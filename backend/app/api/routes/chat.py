"""
The chat endpoint. This is what the embeddable widget on a business's
website will actually call every time a customer sends a message.

It ties together everything we've built so far:
1. retrieval (vector_store.query_chunks) - find the relevant chunks
2. generation (llm_service.generate_answer) - write a grounded answer

This completes the core RAG pipeline: upload -> chunk -> embed -> retrieve -> answer.
"""
from fastapi import APIRouter
from pydantic import BaseModel

from app.services.vector_store import query_chunks
from app.services.llm_service import generate_answer

router = APIRouter()


class ChatRequest(BaseModel):
    query: str
    doc_id: str | None = None  # optional: restrict search to one document
    n_results: int = 4


class ChatResponse(BaseModel):
    answer: str
    sources: list[dict]


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    matches = query_chunks(
        query=request.query,
        n_results=request.n_results,
        doc_id=request.doc_id,
    )

    context_chunks = [m["text"] for m in matches]
    answer = generate_answer(query=request.query, context_chunks=context_chunks)

    return ChatResponse(
        answer=answer,
        sources=[
            {"filename": m["metadata"].get("filename"), "distance": m["distance"]}
            for m in matches
        ],
    )