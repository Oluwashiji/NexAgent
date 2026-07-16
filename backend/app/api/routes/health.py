"""
Health check endpoint. Every backend needs one - it's how Render (and you)
confirm the server is actually up and responding, before we've built anything
real yet.
"""
from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def health_check():
    return {"status": "ok", "service": "nexagent-backend"}