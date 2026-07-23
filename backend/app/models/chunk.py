"""
Stores each document chunk along with its embedding vector, directly in
our Postgres database (via the pgvector extension) instead of a
separate local vector database file.

Why: our hosting platform doesn't persist local disk storage across
deploys on the free/basic tier, but our Postgres database already does.
Storing embeddings here means everything lives in one place that's
already durable, with no extra infrastructure or cost.
"""
import uuid

from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from pgvector.sqlalchemy import Vector

from app.core.database import Base

EMBEDDING_DIMENSIONS = 384  # matches the all-MiniLM-L6-v2 model we embed with


class Chunk(Base):
    __tablename__ = "chunks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    doc_id = Column(String, ForeignKey("documents.id"), nullable=False, index=True)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    filename = Column(String, nullable=False)
    chunk_index = Column(Integer, nullable=False)
    text = Column(String, nullable=False)
    embedding = Column(Vector(EMBEDDING_DIMENSIONS), nullable=False)