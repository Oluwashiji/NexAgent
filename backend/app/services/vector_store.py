"""
Vector store. This is where chunks stop being just text and become
searchable by meaning.

What happens here: each chunk gets run through an embedding model
(all-MiniLM-L6-v2 - small, fast, runs locally, no API cost) which turns
it into a list of ~384 numbers - a "fingerprint" that captures the
chunk's meaning. Chunks with similar meaning end up with similar
fingerprints, even if they don't share any of the same words. ChromaDB
stores these fingerprints on disk and can quickly find the closest
matches to any new fingerprint (i.e. a customer's question).

We use one ChromaDB "collection" (think: one table) for every document
across every business for now, and tag each chunk with its doc_id in
metadata. That's enough to build and test retrieval. When we add
multi-tenancy in Phase 2, we'll extend this to also filter by
business/agent id.
"""
import chromadb
from chromadb.utils import embedding_functions

from app.core.config import settings

COLLECTION_NAME = "nexagent_documents"

_client = None
_collection = None


def get_collection():
    """Lazily create the ChromaDB client/collection on first use, then reuse it."""
    global _client, _collection
    if _collection is None:
        _client = chromadb.PersistentClient(path=settings.CHROMA_DIR)
        _collection = _client.get_or_create_collection(
            name=COLLECTION_NAME,
            embedding_function=embedding_functions.DefaultEmbeddingFunction(),
        )
    return _collection


def add_chunks(doc_id: str, filename: str, chunks: list[str], owner_id: str) -> None:
    """Embed and store every chunk from one document, tagged to its owner."""
    if not chunks:
        return

    collection = get_collection()
    ids = [f"{doc_id}_chunk_{i}" for i in range(len(chunks))]
    metadatas = [
        {"doc_id": doc_id, "filename": filename, "chunk_index": i, "owner_id": owner_id}
        for i in range(len(chunks))
    ]

    collection.add(ids=ids, documents=chunks, metadatas=metadatas)


def query_chunks(query: str, owner_id: str, n_results: int = 4, doc_id: str | None = None) -> list[dict]:
    """
    Find the chunks whose meaning is closest to the query, scoped to one
    business's documents only - this is the multi-tenancy boundary.
    """
    collection = get_collection()

    conditions = [{"owner_id": owner_id}]
    if doc_id:
        conditions.append({"doc_id": doc_id})
    where_filter = conditions[0] if len(conditions) == 1 else {"$and": conditions}

    results = collection.query(
        query_texts=[query],
        n_results=n_results,
        where=where_filter,
    )

    matches = []
    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]

    for doc, meta, dist in zip(documents, metadatas, distances):
        matches.append({"text": doc, "metadata": meta, "distance": dist})

    return matches

    def delete_document_chunks(doc_id: str, owner_id: str) -> None:
    """
    Remove every chunk belonging to one document from the vector store.
    Scoped to owner_id too, so a business can never delete chunks that
    aren't theirs even if they somehow guessed another business's doc_id.
    """
    collection = get_collection()
    collection.delete(where={"$and": [{"doc_id": doc_id}, {"owner_id": owner_id}]})