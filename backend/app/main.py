"""
The entrypoint. This is what `uvicorn app.main:app` actually runs.

Wires up CORS (so your React frontend is allowed to call this API from
a different domain), the health check route, and every feature route
under app/api/routes/, each kept in its own file to keep this from
turning into a 1000-line mess.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.core.config import settings
from app.core.database import Base, engine
from app.models import user, document, chunk  # noqa: F401 - imported so their tables get registered
from app.api.routes import health, documents, chat, auth, businesses
from app.services.vector_store import get_embedding_function

app = FastAPI(title="NexAgent API", version="0.1.0")

# pgvector needs its Postgres extension enabled once before we can create
# a table with a Vector column - safe to run every startup, does nothing
# if it's already enabled.
with engine.connect() as conn:
    conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
    conn.commit()

# Creates any tables that don't exist yet in the database. Safe to run every
# startup - it does nothing if the tables are already there.
Base.metadata.create_all(bind=engine)

# Loads the ONNX embedding model into memory now, during boot, instead of
# on whichever unlucky user's request happens to trigger it first. On a
# cold Render instance this download/load can take a while - better that
# delay happens here (once, at deploy time) than freezing a live upload
# or chat request.
get_embedding_function()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(documents.router, prefix="/api", tags=["documents"])
app.include_router(chat.router, prefix="/api", tags=["chat"])
app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(businesses.router, prefix="/api", tags=["businesses"])


@app.get("/")
def root():
    return {"message": "NexAgent API is running"}