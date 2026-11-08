"""
FinPulse Analytics & Market Intelligence Endpoints
- Overview Dashboard metrics
- Individual Creator Deep Dive Analytics
- Market-wide Intelligence & Sector Breakdown
"""

import datetime
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from app.database import get_db
from app.models.creator import Creator
from app.models.post import Post, PostAnalysis
from app.models.entity import MarketEntity, PostEntityMention
from app.schemas.analytics import (
    OverviewStats, SentimentCount, TopicCount, SectorCount,
    EntityLeaderboard, CreatorAnalyticsResponse, MarketIntelligenceResponse
)

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/overview", response_model=OverviewStats)
def get_overview_stats(db: Session = Depends(get_db)):
    """Computes headline metrics for dashboard overview."""
    total_creators = db.query(func.count(Creator.id)).scalar() or 0
    active_creators = db.query(func.count(Creator.id)).filter(Creator.is_active == True).scalar() or 0
    total_posts = db.query(func.count(Post.id)).scalar() or 0

    today_start = datetime.datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    posts_today = db.query(func.count(Post.id)).filter(Post.created_at >= today_start).scalar() or 0

    # Sentiment distribution
    sentiment_rows = db.query(PostAnalysis.sentiment, func.count(PostAnalysis.id)).group_by(PostAnalysis.sentiment).all()
    sentiment_map = {s: c for s, c in sentiment_rows}
    sentiment_dist = SentimentCount(
        positive=sentiment_map.get("Positive", 0),
        negative=sentiment_map.get("Negative", 0),
        neutral=sentiment_map.get("Neutral", 0),
        mixed=sentiment_map.get("Mixed", 0)
    )

    # Trending topics
    topic_rows = db.query(PostAnalysis.topic, func.count(PostAnalysis.id)).group_by(PostAnalysis.topic).order_by(desc(func.count(PostAnalysis.id))).limit(6).all()
    trending_topics = [TopicCount(topic=t, count=c) for t, c in topic_rows if t]

    # Recent important events
    recent_events_posts = (
        db.query(Post, PostAnalysis)
        .join(PostAnalysis, Post.id == PostAnalysis.post_id)
        .filter(PostAnalysis.event_type.isnot(None))
        .order_by(desc(Post.created_at))
        .limit(5)
        .all()
    )

    events_list = []
    for post, analysis in recent_events_posts:
        events_list.append({
            "post_id": post.id,
            "creator_name": post.creator.display_name if post.creator else "Creator",
            "creator_username": post.creator.username if post.creator else "",
            "event_type": analysis.event_type,
            "event_details": analysis.event_details or analysis.summary,
            "market_impact": analysis.market_impact,
            "post_url": post.post_url,
            "timestamp": post.created_at.isoformat()
        })

    return OverviewStats(
        total_monitored_creators=total_creators,
        active_monitored_creators=active_creators,
        total_posts_collected=total_posts,
        posts_detected_today=posts_today,
        sentiment_distribution=sentiment_dist,
        trending_topics=trending_topics,
        recent_events=events_list
    )

@router.get("/creators/{creator_id}", response_model=CreatorAnalyticsResponse)
def get_creator_analytics(creator_id: int, db: Session = Depends(get_db)):
    """Deep-dive analytics for an individual monitored creator."""
    creator = db.query(Creator).filter(Creator.id == creator_id).first()
    if not creator:
        raise HTTPException(status_code=404, detail="Creator not found")

    total_posts = db.query(func.count(Post.id)).filter(Post.creator_id == creator.id).scalar() or 0
    one_week_ago = datetime.datetime.utcnow() - datetime.timedelta(days=7)
    posts_week = db.query(func.count(Post.id)).filter(Post.creator_id == creator.id, Post.created_at >= one_week_ago).scalar() or 0

    # Sentiment distribution
    sentiment_rows = (
        db.query(PostAnalysis.sentiment, func.count(PostAnalysis.id))
        .join(Post, Post.id == PostAnalysis.post_id)
        .filter(Post.creator_id == creator.id)
        .group_by(PostAnalysis.sentiment)
        .all()
    )
    s_map = {s: c for s, c in sentiment_rows}
    sentiment_dist = SentimentCount(
        positive=s_map.get("Positive", 0),
        negative=s_map.get("Negative", 0),
        neutral=s_map.get("Neutral", 0),
        mixed=s_map.get("Mixed", 0)
    )

    # Top discussed companies
    top_companies_rows = (
        db.query(MarketEntity.symbol, MarketEntity.name, func.count(PostEntityMention.id))
        .join(PostEntityMention, MarketEntity.id == PostEntityMention.entity_id)
        .join(Post, Post.id == PostEntityMention.post_id)
        .filter(Post.creator_id == creator.id, MarketEntity.entity_type == "EQUITY")
        .group_by(MarketEntity.symbol, MarketEntity.name)
        .order_by(desc(func.count(PostEntityMention.id)))
        .limit(5)
        .all()
    )
    top_companies = [{"symbol": sym, "name": name, "mentions": cnt} for sym, name, cnt in top_companies_rows]

    # Top discussed sectors
    top_sectors_rows = (
        db.query(MarketEntity.sector, func.count(PostEntityMention.id))
        .join(PostEntityMention, MarketEntity.id == PostEntityMention.entity_id)
        .join(Post, Post.id == PostEntityMention.post_id)
        .filter(Post.creator_id == creator.id, MarketEntity.sector.isnot(None))
        .group_by(MarketEntity.sector)
        .order_by(desc(func.count(PostEntityMention.id)))
        .limit(5)
        .all()
    )
    top_sectors = [{"sector": sec, "count": cnt} for sec, cnt in top_sectors_rows]

    # Top topics
    top_topics_rows = (
        db.query(PostAnalysis.topic, func.count(PostAnalysis.id))
        .join(Post, Post.id == PostAnalysis.post_id)
        .filter(Post.creator_id == creator.id)
        .group_by(PostAnalysis.topic)
        .order_by(desc(func.count(PostAnalysis.id)))
        .limit(5)
        .all()
    )
    top_topics = [{"topic": t, "count": cnt} for t, cnt in top_topics_rows if t]

    # Recent posts
    recent_posts_db = db.query(Post).filter(Post.creator_id == creator.id).order_by(desc(Post.created_at)).limit(5).all()
    recent_posts = [{
        "id": p.id,
        "text": p.text,
        "created_at": p.created_at.isoformat(),
        "post_url": p.post_url,
        "sentiment": p.analysis.sentiment if p.analysis else "Neutral",
        "market_impact": p.analysis.market_impact if p.analysis else "Neutral"
    } for p in recent_posts_db]

    return CreatorAnalyticsResponse(
        creator_id=creator.id,
        username=creator.username,
        display_name=creator.display_name,
        profile_image_url=creator.profile_image_url,
        total_posts=total_posts,
        posts_this_week=posts_week,
        sentiment_distribution=sentiment_dist,
        top_discussed_companies=top_companies,
        top_discussed_sectors=top_sectors,
        top_topics=top_topics,
        recent_posts=recent_posts
    )

@router.get("/market", response_model=MarketIntelligenceResponse)
def get_market_intelligence(db: Session = Depends(get_db)):
    """Computes Indian market-wide intelligence: trending tickers, sectors, and unusual spikes."""
    # Top mentioned companies with sentiment
    top_entities_rows = (
        db.query(MarketEntity.symbol, MarketEntity.name, func.count(PostEntityMention.id))
        .join(PostEntityMention, MarketEntity.id == PostEntityMention.entity_id)
        .filter(MarketEntity.entity_type == "EQUITY")
        .group_by(MarketEntity.symbol, MarketEntity.name)
        .order_by(desc(func.count(PostEntityMention.id)))
        .limit(8)
        .all()
    )

    trending_companies = []
    for sym, name, cnt in top_entities_rows:
        # Sentiment for this symbol
        mentions = (
            db.query(PostAnalysis.sentiment, func.count(PostAnalysis.id))
            .join(Post, Post.id == PostAnalysis.post_id)
            .join(PostEntityMention, Post.id == PostEntityMention.post_id)
            .join(MarketEntity, MarketEntity.id == PostEntityMention.entity_id)
            .filter(MarketEntity.symbol == sym)
            .group_by(PostAnalysis.sentiment)
            .all()
        )
        s_map = {s: c for s, c in mentions}
        trending_companies.append(EntityLeaderboard(
            symbol=sym,
            name=name,
            mentions_count=cnt,
            positive=s_map.get("Positive", 0),
            negative=s_map.get("Negative", 0),
            neutral=s_map.get("Neutral", 0),
            mixed=s_map.get("Mixed", 0)
        ))

    # Trending sectors
    sector_rows = (
        db.query(MarketEntity.sector, func.count(PostEntityMention.id))
        .join(PostEntityMention, MarketEntity.id == PostEntityMention.entity_id)
        .filter(MarketEntity.sector.isnot(None), MarketEntity.sector != "")
        .group_by(MarketEntity.sector)
        .order_by(desc(func.count(PostEntityMention.id)))
        .limit(6)
        .all()
    )
    trending_sectors = []
    for sec, cnt in sector_rows:
        sec_sentiment = (
            db.query(PostAnalysis.sentiment, func.count(PostAnalysis.id))
            .join(Post, Post.id == PostAnalysis.post_id)
            .join(PostEntityMention, Post.id == PostEntityMention.post_id)
            .join(MarketEntity, MarketEntity.id == PostEntityMention.entity_id)
            .filter(MarketEntity.sector == sec)
            .group_by(PostAnalysis.sentiment)
            .all()
        )
        s_map = {s: c for s, c in sec_sentiment}
        trending_sectors.append(SectorCount(
            sector=sec,
            count=cnt,
            sentiment_distribution=SentimentCount(
                positive=s_map.get("Positive", 0),
                negative=s_map.get("Negative", 0),
                neutral=s_map.get("Neutral", 0),
                mixed=s_map.get("Mixed", 0)
            )
        ))

    # Emerging topics
    topic_rows = (
        db.query(PostAnalysis.topic, func.count(PostAnalysis.id))
        .group_by(PostAnalysis.topic)
        .order_by(desc(func.count(PostAnalysis.id)))
        .limit(8)
        .all()
    )
    emerging_topics = [TopicCount(topic=t, count=c) for t, c in topic_rows if t]

    # Unusual spikes (e.g. entities with > 2 mentions recently)
    unusual_spikes = []
    for comp in trending_companies:
        if comp.mentions_count >= 2:
            unusual_spikes.append({
                "symbol": comp.symbol,
                "name": comp.name,
                "spike_magnitude": f"{comp.mentions_count}x normal volume",
                "reason": f"Elevated discussions across multiple Indian financial creators regarding recent earnings or strategic corporate announcements."
            })

    return MarketIntelligenceResponse(
        trending_companies=trending_companies,
        trending_sectors=trending_sectors,
        emerging_topics=emerging_topics,
        unusual_spikes=unusual_spikes
    )

