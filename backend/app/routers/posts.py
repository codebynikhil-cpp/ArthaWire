"""
FinPulse Post Retrieval & Feed Endpoints
Supports rich filtering by creator, ticker symbol, sentiment, topic, and keyword search.
"""

from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, func

from app.database import get_db
from app.models.post import Post, PostMetrics, PostAnalysis
from app.models.creator import Creator
from app.models.entity import MarketEntity, PostEntityMention
from app.schemas.post import PostResponse, PostFeedResponse, EntityMentionResponse, CreatorSummary, PostMetricsResponse, PostAnalysisResponse

router = APIRouter(prefix="/posts", tags=["Posts"])

def format_post_response(post: Post) -> PostResponse:
    # Build entities list
    entities_list = []
    for mention in post.entity_mentions:
        ent = mention.entity
        if ent:
            entities_list.append(EntityMentionResponse(
                id=ent.id,
                symbol=ent.symbol,
                name=ent.name,
                entity_type=ent.entity_type,
                sector=ent.sector,
                matched_text=mention.matched_text
            ))

    creator_summary = CreatorSummary(
        id=post.creator.id,
        username=post.creator.username,
        display_name=post.creator.display_name,
        profile_image_url=post.creator.profile_image_url
    )

    metrics_resp = PostMetricsResponse.model_validate(post.metrics) if post.metrics else None
    analysis_resp = PostAnalysisResponse.model_validate(post.analysis) if post.analysis else None

    return PostResponse(
        id=post.id,
        x_post_id=post.x_post_id,
        text=post.text,
        created_at=post.created_at,
        post_url=post.post_url,
        lang=post.lang,
        ingested_at=post.ingested_at,
        creator=creator_summary,
        metrics=metrics_resp,
        analysis=analysis_resp,
        entities=entities_list
    )

@router.get("", response_model=PostFeedResponse)
def get_posts(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    creator_id: Optional[int] = None,
    symbol: Optional[str] = None,
    sentiment: Optional[str] = None,
    topic: Optional[str] = None,
    market_impact: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Retrieves paginated post feed with filters.
    """
    query = db.query(Post).join(Creator)

    if creator_id:
        query = query.filter(Post.creator_id == creator_id)

    if sentiment:
        query = query.join(PostAnalysis).filter(PostAnalysis.sentiment == sentiment)

    if topic:
        if not sentiment:
            query = query.join(PostAnalysis)
        query = query.filter(PostAnalysis.topic == topic)

    if market_impact:
        if not sentiment and not topic:
            query = query.join(PostAnalysis)
        query = query.filter(PostAnalysis.market_impact == market_impact)

    if symbol:
        query = query.join(PostEntityMention).join(MarketEntity).filter(MarketEntity.symbol == symbol.upper())

    if search:
        query = query.filter(Post.text.ilike(f"%{search}%"))

    total = query.count()
    posts = query.order_by(desc(Post.created_at)).offset((page - 1) * limit).limit(limit).all()

    formatted = [format_post_response(p) for p in posts]

    return PostFeedResponse(
        total=total,
        page=page,
        limit=limit,
        posts=formatted
    )

@router.get("/{post_id}", response_model=PostResponse)
def get_single_post(post_id: int, db: Session = Depends(get_db)):
    """Retrieves full details and AI analysis for a specific post."""
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return format_post_response(post)
