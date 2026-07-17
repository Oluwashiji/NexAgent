"""
The entrypoint. This is what `uvicorn app.main:app` actually runs.

Right now it just wires up CORS (so your React frontend is allowed to call
this API from a different domain) and the health check route. We'll add the
document upload, chunking, embedding, and chat routes here as we build them,
each in its own file under app/api/routes/ to keep this file from turning
into a 1000-line mess.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import Base, engine
from app.models import user, document  # noqa: F401 - imported so their tables get registered
from app.api.routes import health, documents, chat, auth

app = FastAPI(title="NexAgent API", version="0.1.0")

# Creates any tables that don't exist yet in the database. Safe to run every
# startup - it does nothing if the tables are already there. Fine for now;
# once the schema is more settled we'd switch to proper migrations (Alembic)
# instead of this simple approach.
Base.metadata.create_all(bind=engine)

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


@app.get("/")
def root():
    return {"message": "NexAgent API is running"}