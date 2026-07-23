"""
Vector storage and retrieval, now backed by Postgres (via pgvector)
instead of a separate local-disk vector database.

We still use chromadb's lightweight embedding function (ONNX-based, not
the heavy torch-based option) purely as a text-to-vector converter - we
no longer use any of chromadb's own storage or database features. This
keeps memory usage low while making storage fully persistent, since it
now lives in the same database as everything else.
"""
import uuid

from chromadb.utils import embedding_functions
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.chunk import Chunk

_embedding_function = None


def get_embedding_function():
    global _embedding_function
    if _embedding_function is None:
        _embedding_function = embedding_functions.DefaultEmbeddingFunction()
    return _embedding_function


def embed_texts(texts: list[str]) -> list[list[float]]:
    """Turn a list of strings into a list of embedding vectors."""
    ef = get_embedding_function()
    return ef(texts)


def add_chunks(db: Session, doc_id: str, filename: str, chunks: list[str], owner_id: str) -> None:
    """
    Embed and store every chunk from one document, tagged to its owner.
    Processed in small batches - embedding many chunks in a single call
    spikes memory, which matters a lot on a memory-constrained server.
    """
    if not chunks:
        return

    owner_uuid = uuid.UUID(owner_id)
    batch_size = 16

    for start in range(0, len(chunks), batch_size):
        batch = chunks[start : start + batch_size]
        vectors = embed_texts(batch)

        for i, (text, vector) in enumerate(zip(batch, vectors)):
            db.add(
                Chunk(
                    doc_id=doc_id,
                    owner_id=owner_uuid,
                    filename=filename,
                    chunk_index=start + i,
                    text=text,
                    embedding=vector,
                )
            )
        db.commit()


def query_chunks(db: Session, query: str, owner_id: str, n_results: int = 4, doc_id: str | None = None) -> list[dict]:
    """
    Find the chunks whose meaning is closest to the query, scoped to one
    business's documents only - this is the multi-tenancy boundary.
    Uses pgvector's cosine distance operator directly in the SQL query.
    """
    owner_uuid = uuid.UUID(owner_id)
    query_vector = embed_texts([query])[0]

    distance = Chunk.embedding.cosine_distance(query_vector)
    stmt = select(Chunk, distance.label("distance")).where(Chunk.owner_id == owner_uuid)
    if doc_id:
        stmt = stmt.where(Chunk.doc_id == doc_id)
    stmt = stmt.order_by(distance).limit(n_results)

    rows = db.execute(stmt).all()

    matches = []
    for chunk, dist in rows:
        matches.append(
            {
                "text": chunk.text,
                "metadata": {"doc_id": chunk.doc_id, "filename": chunk.filename, "chunk_index": chunk.chunk_index},
                "distance": float(dist),
            }
        )
    return matches


def delete_document_chunks(db: Session, doc_id: str, owner_id: str) -> None:
    """
    Remove every chunk belonging to one document. Scoped to owner_id
    too, so a business can never delete chunks that aren't theirs even
    if they somehow guessed another business's doc_id.
    """
    owner_uuid = uuid.UUID(owner_id)
    db.query(Chunk).filter(Chunk.doc_id == doc_id, Chunk.owner_id == owner_uuid).delete()
    db.commit()