"""
Text extraction. Given a file on disk, pull out plain text regardless of
whether it's a PDF, a Word doc, or already plain text.

Think of this as translation: businesses will upload whatever they have
lying around (PDFs, Word docs), and this file's job is to turn all of
that into one common format - plain strings - that the rest of the
pipeline (chunking, embedding) can work with the same way regardless
of the original file type.
"""
from pathlib import Path

from pypdf import PdfReader
from docx import Document


class UnsupportedFileType(Exception):
    pass


def extract_text(file_path: str) -> str:
    """Route to the right extractor based on file extension."""
    suffix = Path(file_path).suffix.lower()

    if suffix == ".pdf":
        return _extract_pdf(file_path)
    elif suffix == ".docx":
        return _extract_docx(file_path)
    elif suffix == ".txt":
        return _extract_txt(file_path)
    else:
        raise UnsupportedFileType(
            f"'{suffix}' files aren't supported yet. Use PDF, DOCX, or TXT."
        )


def _extract_pdf(file_path: str) -> str:
    reader = PdfReader(file_path)
    pages_text = []
    for page in reader.pages:
        text = page.extract_text() or ""
        pages_text.append(text)
    return "\n".join(pages_text).strip()


def _extract_docx(file_path: str) -> str:
    doc = Document(file_path)
    paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
    return "\n".join(paragraphs).strip()


def _extract_txt(file_path: str) -> str:
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        return f.read().strip()