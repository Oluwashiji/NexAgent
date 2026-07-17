import json
import uuid
from datetime import datetime, timezone
from pathlib import Path

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.document import Document
from app.services.document_processor import extract_text, UnsupportedFileType
from app.services.chunker import chunk_text
from app.services.vector_store import add_chunks, query_chunks

router = APIRouter()

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt"}
MAX_FILE_SIZE_MB = 20


@router.post("/documents/upload")
async def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    suffix = Path(file.filename).suffix.lower()

    if suffix not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"'{suffix}' isn't supported. Upload a PDF, DOCX, or TXT file.")

    contents = await file.read()
    size_mb = len(contents) / (1024 * 1024)
    if size_mb > MAX_FILE_SIZE_MB:
        raise HTTPException(status_code=400, detail=f"File is {size_mb:.1f}MB. Max allowed is {MAX_FILE_SIZE_MB}MB.")

    doc_id = uuid.uuid4().hex
    upload_dir = Path(settings.UPLOAD_DIR)
    upload_dir.mkdir(parents=True, exist_ok=True)

    saved_path = upload_dir / f"{doc_id}{suffix}"
    saved_path.write_bytes(contents)

    try:
        text = extract_text(str(saved_path))
    except UnsupportedFileType as e:
        saved_path.unlink(missing_ok=True)
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        saved_path.unlink(missing_ok=True)
        raise HTTPException(status_code=422, detail=f"Could not read text from this file: {e}")

    if not text.strip():
        saved_path.unlink(missing_ok=True)
        raise HTTPException(status_code=422, detail="No readable text found in this file (it might be a scanned/image-only PDF).")

    extracted_path = upload_dir / f"{doc_id}.extracted.txt"
    extracted_path.write_text(text, encoding="utf-8")

    chunks = chunk_text(text)
    chunks_path = upload_dir / f"{doc_id}.chunks.json"
    chunks_path.write_text(json.dumps(chunks, indent=2), encoding="utf-8")

    add_chunks(doc_id=doc_id, filename=file.filename, chunks=chunks, owner_id=str(current_user.id))

    # This is the row that makes the document actually belong to someone
    document = Document(
        id=doc_id,
        user_id=current_user.id,
        filename=file.filename,
        char_count=len(text),
        chunk_count=len(chunks),
    )
    db.add(document)
    db.commit()

    metadata = {
        "doc_id": doc_id,
        "original_filename": file.filename,
        "uploaded_at": datetime.now(timezone.utc).isoformat(),
        "char_count": len(text),
        "chunk_count": len(chunks),
        "status": "embedded",
        "owner_id": str(current_user.id),
    }
    meta_path = upload_dir / f"{doc_id}.meta.json"
    meta_path.write_text(json.dumps(metadata, indent=2), encoding="utf-8")

    return {
        "doc_id": doc_id,
        "filename": file.filename,
        "char_count": len(text),
        "chunk_count": len(chunks),
        "preview": text[:300],
        "first_chunk_preview": chunks[0][:200] if chunks else None,
        "status": "embedded",
    }


@router.get("/documents")
def list_documents(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """What the dashboard's Upload tab will show: this business's own files, nobody else's."""
    docs = (
        db.query(Document)
        .filter(Document.user_id == current_user.id)
        .order_by(Document.uploaded_at.desc())
        .all()
    )
    return [
        {
            "doc_id": d.id,
            "filename": d.filename,
            "char_count": d.char_count,
            "chunk_count": d.chunk_count,
            "uploaded_at": d.uploaded_at.isoformat(),
        }
        for d in docs
    ]


@router.get("/documents/search")
def search_documents(
    query: str,
    doc_id: str | None = None,
    n_results: int = 4,
    current_user: User = Depends(get_current_user),
):
    matches = query_chunks(query=query, n_results=n_results, doc_id=doc_id, owner_id=str(current_user.id))
    return {"query": query, "matches": matches}