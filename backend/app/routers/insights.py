"""
FinPulse Cross-Creator AI Insights Router
Consolidates discussions from multiple creators discussing the same stock, topic, or central bank development.
Generates consensus analysis, opinion differences, and direct source linkages.
"""

from typing import List, Dict, Any
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import get_db
from app.models.post import Post
from app.nlp.consensus_engine import consensus_engine

router = APIRouter(prefix="/insights", tags=["AI Insights"])

@router.get("/consensus")
def get_consensus_briefings(
    time_window_hours: int = Query(72, ge=1, le=168, description="Time window in hours to group discussions"),
    db: Session = Depends(get_db)
):
    """
    Computes cross-creator consensus briefings.
    Identifies stocks and topics discussed by 2 or more distinct creators.
    """
    # Fetch all recent posts with their creators, analysis, and entities
    posts = db.query(Post).order_by(desc(Post.created_at)).limit(100).all()

    posts_data = []
    for p in posts:
        if not p.analysis:
            continue

        entities_list = []
        for m in p.entity_mentions:
            if m.entity:
                entities_list.append({
                    "symbol": m.entity.symbol,
                    "name": m.entity.name,
                    "entity_type": m.entity.entity_type,
                    "sector": m.entity.sector
                })

        posts_data.append({
            "post_id": p.id,
            "creator_id": p.creator_id,
            "username": p.creator.username if p.creator else "creator",
            "display_name": p.creator.display_name if p.creator else "Creator",
            "text": p.text,
            "created_at": p.created_at.isoformat(),
            "post_url": p.post_url,
            "sentiment": p.analysis.sentiment,
            "topic": p.analysis.topic,
            "market_impact": p.analysis.market_impact,
            "summary": p.analysis.summary,
            "main_arguments": p.analysis.main_arguments or [],
            "entities": entities_list
        })

    insights = consensus_engine.consolidate_discussions(posts_data, time_window_hours=time_window_hours)
    return {
        "time_window_hours": time_window_hours,
        "total_consensus_clusters": len(insights),
        "insights": insights
    }

