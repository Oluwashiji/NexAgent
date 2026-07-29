"""
The User table. One row per business that signs up for NexAgent.

We store a hashed password, never the real one - if our database ever
leaked, an attacker would get useless scrambled text instead of actual
passwords. This is standard practice, not optional caution.
"""
import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, String, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    business_name = Column(String, nullable=True)
    # New signups start unapproved and stay invisible in the public
    # business directory (see businesses.py) until manually flipped in
    # Neon. This is a speed bump against impersonation, not full
    # verification - documented limitation.
    is_approved = Column(Boolean, nullable=False, default=False, server_default="false")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))