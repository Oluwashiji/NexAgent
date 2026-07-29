"""
Called anonymously by customers on a business's website - no login,
by design. `business_id` (the owner's user UUID) is the public routing
key embedded in the widget snippet that tells us whose documents to
search. It's not a secret; it just scopes retrieval.

Every interaction gets logged to chat_logs (query, answer, how long it
took) - that's the raw data the Analytics tab reads from.
"""
import time
import uuid

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.vector_store import query_chunks
from app.services.llm_service import generate_answer
from app.models.chat_log import ChatLog

router = APIRouter()


class ChatRequest(BaseModel):
    business_id: str
    query: str
    doc_id: str | None = None
    n_results: int = 4


class ChatResponse(BaseModel):
    answer: str
    sources: list[dict]


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest, db: Session = Depends(get_db)):
    start = time.perf_counter()

    matches = query_chunks(
        db=db,
        query=request.query,
        n_results=request.n_results,
        doc_id=request.doc_id,
        owner_id=request.business_id,
    )
    context_chunks = [m["text"] for m in matches]
    answer = generate_answer(query=request.query, context_chunks=context_chunks)

    elapsed_ms = int((time.perf_counter() - start) * 1000)

    db.add(
        ChatLog(
            owner_id=uuid.UUID(request.business_id),
            query=request.query,
            answer=answer,
            response_ms=elapsed_ms,
        )
    )
    db.commit()

    return ChatResponse(
        answer=answer,
        sources=[{"filename": m["metadata"].get("filename"), "distance": m["distance"]} for m in matches],
    )