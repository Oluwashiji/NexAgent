"""
Real per-business analytics, derived from chat_logs. Everything here
is scoped to current_user - a business only ever sees its own numbers.

We deliberately don't fabricate metrics we can't back with real data:
no "escalated vs resolved" status (there's no human-handoff feature
yet), no fake month-over-month deltas. Just honest counts and timings.
"""
from datetime import datetime, timezone, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.chat_log import ChatLog

router = APIRouter()


@router.get("/analytics/stats")
def analytics_stats(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    now = datetime.now(timezone.utc)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)

    chats_this_month = (
        db.query(func.count(ChatLog.id))
        .filter(ChatLog.owner_id == current_user.id, ChatLog.created_at >= month_start)
        .scalar()
    )
    chats_today = (
        db.query(func.count(ChatLog.id))
        .filter(ChatLog.owner_id == current_user.id, ChatLog.created_at >= today_start)
        .scalar()
    )
    avg_response_ms = (
        db.query(func.avg(ChatLog.response_ms))
        .filter(ChatLog.owner_id == current_user.id, ChatLog.created_at >= month_start)
        .scalar()
    )

    return {
        "chats_this_month": chats_this_month or 0,
        "chats_today": chats_today or 0,
        "avg_response_ms": round(avg_response_ms) if avg_response_ms else None,
    }


@router.get("/analytics/volume")
def chat_volume(days: int = 14, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Daily chat counts for the last `days` days, zero-filled for days with no chats."""
    now = datetime.now(timezone.utc)
    start_date = (now - timedelta(days=days - 1)).date()

    rows = (
        db.query(func.date(ChatLog.created_at).label("day"), func.count(ChatLog.id).label("cnt"))
        .filter(ChatLog.owner_id == current_user.id, ChatLog.created_at >= now - timedelta(days=days - 1))
        .group_by("day")
        .all()
    )
    counts_by_day = {r.day.isoformat(): r.cnt for r in rows}

    series = []
    for i in range(days):
        d = start_date + timedelta(days=i)
        series.append({"date": d.isoformat(), "chats": counts_by_day.get(d.isoformat(), 0)})
    return series


@router.get("/analytics/top-questions")
def top_questions(limit: int = 5, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Groups by exact question text (trimmed, case-insensitive) - this is
    a literal-match grouping, not semantic clustering, so two visitors
    phrasing the same question differently won't merge into one row.
    """
    normalized = func.lower(func.trim(ChatLog.query))
    rows = (
        db.query(normalized.label("norm_q"), func.max(ChatLog.query).label("display_q"), func.count(ChatLog.id).label("cnt"))
        .filter(ChatLog.owner_id == current_user.id)
        .group_by("norm_q")
        .order_by(func.count(ChatLog.id).desc())
        .limit(limit)
        .all()
    )
    return [{"question": r.display_q, "count": r.cnt} for r in rows]


@router.get("/analytics/recent")
def recent_conversations(
    page: int = 1,
    page_size: int = 5,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    total = db.query(func.count(ChatLog.id)).filter(ChatLog.owner_id == current_user.id).scalar()
    rows = (
        db.query(ChatLog)
        .filter(ChatLog.owner_id == current_user.id)
        .order_by(ChatLog.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    return {
        "total": total or 0,
        "page": page,
        "page_size": page_size,
        "conversations": [
            {"time": r.created_at.isoformat(), "query": r.query, "answer": r.answer} for r in rows
        ],
    }