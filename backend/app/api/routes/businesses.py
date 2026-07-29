"""
Public-facing business directory endpoints.

No auth required - these are read-only lookups anonymous website
visitors use to find a business's chat widget by name. Only accounts
with `is_approved=True` show up here, which is our first line of
defense against someone signing up as "Nike Support" and impersonating
a real brand before we've manually verified them. This is NOT full
verification, just a speed bump - documented limitation, not a bug.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User

router = APIRouter()


class BusinessSummary(BaseModel):
    id: str
    business_name: str


@router.get("/businesses", response_model=list[BusinessSummary])
def list_businesses(db: Session = Depends(get_db)):
    """All approved businesses, for the directory / picker UI."""
    businesses = (
        db.query(User)
        .filter(User.is_approved == True, User.business_name.isnot(None))  # noqa: E712
        .order_by(User.business_name.asc())
        .all()
    )
    return [
        BusinessSummary(id=str(b.id), business_name=b.business_name)
        for b in businesses
    ]


@router.get("/businesses/lookup", response_model=BusinessSummary)
def lookup_business(name: str, db: Session = Depends(get_db)):
    """
    Case-insensitive exact match on business_name. The landing chatbot
    calls this with whatever the visitor typed, resolves it to a
    business_id (user.id), and scopes the chat widget's retrieval to
    that business. Unapproved signups never match here, even with an
    exact name.
    """
    business = (
        db.query(User)
        .filter(
            func.lower(User.business_name) == name.strip().lower(),
            User.is_approved == True,  # noqa: E712
        )
        .first()
    )
    if business is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No approved business found with that name.",
        )
    return BusinessSummary(id=str(business.id), business_name=business.business_name)