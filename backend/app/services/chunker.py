"""
Chunking. Takes one long string of extracted document text and splits it
into small, overlapping pieces ("chunks") that retrieval can later search
through individually.

We use LangChain's RecursiveCharacterTextSplitter, which tries to cut at
natural boundaries in this order of preference: paragraph breaks, then
sentences, then words - only falling back to a hard character cut if it
has no other choice. This keeps each chunk reading like a coherent
thought instead of an arbitrary slice.
"""
from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.core.config import settings


def chunk_text(text: str) -> list[str]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.CHUNK_SIZE,
        chunk_overlap=settings.CHUNK_OVERLAP,
        separators=["\n\n", "\n", ". ", " ", ""],
    )
    chunks = splitter.split_text(text)
    # Drop any whitespace-only fragments that can occasionally slip through
    return [c.strip() for c in chunks if c.strip()]