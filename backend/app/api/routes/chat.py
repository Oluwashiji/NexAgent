"""
Called anonymously by customers on a business's website - no login,
by design. `business_id` (the owner's user UUID) is the public routing
key embedded in the widget snippet that tells us whose documents to
search. It's not a secret; it just scopes retrieval.
"""
from fastapi import APIRouter
from pydantic import BaseModel

from app.services.vector_store import query_chunks
from app.services.llm_service import generate_answer

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
def chat(request: ChatRequest):
    matches = query_chunks(
        query=request.query,
        n_results=request.n_results,
        doc_id=request.doc_id,
        owner_id=request.business_id,
    )
    context_chunks = [m["text"] for m in matches]
    answer = generate_answer(query=request.query, context_chunks=context_chunks)

    return ChatResponse(
        answer=answer,
        sources=[{"filename": m["metadata"].get("filename"), "distance": m["distance"]} for m in matches],
    )