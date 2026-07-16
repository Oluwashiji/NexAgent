"""
Database connection. This is the one place that knows how to talk to
Postgres - everything else (models, routes) goes through this instead
of connecting directly.

Three things happen here:
1. `engine` - the actual connection to your Neon Postgres database
2. `SessionLocal` - a factory that creates a new "session" (think: one
   conversation with the database) whenever a request needs one
3. `Base` - the class every database table/model will inherit from, so
   SQLAlchemy knows which Python classes represent real tables
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.core.config import settings

engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """
    FastAPI dependency: opens one database session per request, and
    guarantees it's closed afterwards even if the request raises an
    error. Routes use this like: `db: Session = Depends(get_db)`.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()