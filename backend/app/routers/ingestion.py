"""
FinPulse Ingestion Control & Cost Calculator Endpoints
- Scheduler Status & Health Check
- Manual Ingestion Sync Trigger
- Ingestion Logs
- Operational X API Cost Estimation
- Simulated Real-Time Post Generator (for live demonstration)
"""

import random
import datetime
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, func

from app.database import get_db
from app.config import settings
from app.models.creator import Creator
from app.models.post import Post, PostMetrics, PostAnalysis
from app.models.entity import MarketEntity, PostEntityMention
from app.models.ingestion import IngestionLog, PollState
from app.schemas.ingestion import IngestionStatusResponse, IngestionLogResponse, CostEstimateResponse
from app.ingestion.x_client import x_client
from app.ingestion.checkpointer import ingestion_manager
from app.ingestion.scheduler import polling_scheduler
from app.ingestion.mock_feed import generate_random_live_post
from app.nlp.pipeline import nlp_pipeline
from app.alerts.evaluator import alert_evaluator
from app.routers.websockets import ws_manager

router = APIRouter(prefix="/ingestion", tags=["Ingestion"])

@router.get("/status", response_model=IngestionStatusResponse)
def get_ingestion_status(db: Session = Depends(get_db)):
    """Retrieves current background scheduler and rate limit status."""
    total_creators = db.query(func.count(Creator.id)).scalar() or 0
    active_creators = db.query(func.count(Creator.id)).filter(Creator.is_active == True).scalar() or 0
    total_posts = db.query(func.count(Post.id)).scalar() or 0

    last_poll = db.query(func.max(PollState.last_polled_at)).scalar()

    mode = "SIMULATION" if (settings.SIMULATION_MODE or not settings.X_BEARER_TOKEN) else "LIVE_X_API"

    return IngestionStatusResponse(
        is_scheduler_running=polling_scheduler.is_running,
        mode=mode,
        active_creators_count=active_creators,
        total_creators_count=total_creators,
        rate_limit_remaining=x_client.rate_limit_remaining,
        rate_limit_reset=x_client.rate_limit_reset,
        last_poll_time=last_poll,
        total_posts_ingested=total_posts
    )

@router.post("/sync-all")
async def sync_all_active_creators(db: Session = Depends(get_db)):
    """Triggers an immediate incremental synchronization across all active creators."""
    active_creators = db.query(Creator).filter(Creator.is_active == True).all()
    results = []
    total_new = 0

    for c in active_creators:
        res = await ingestion_manager.sync_creator(db, c)
        results.append(res)
        new_count = res.get("posts_ingested", 0)
        total_new += new_count

        if new_count > 0:
            for p in res.get("posts", []):
                await ws_manager.broadcast({
                    "type": "NEW_POST",
                    "data": p
                })

    if total_new > 0:
        await ws_manager.broadcast({
            "type": "SYNC_COMPLETED",
            "data": {"new_posts": total_new}
        })

    return {
        "status": "completed",
        "creators_synced": len(active_creators),
        "total_new_posts": total_new,
        "details": results
    }

@router.get("/logs", response_model=List[IngestionLogResponse])
def get_ingestion_logs(limit: int = Query(25, ge=1, le=100), db: Session = Depends(get_db)):
    """Retrieves recent ingestion audit logs."""
    logs = (
        db.query(IngestionLog)
        .order_by(desc(IngestionLog.timestamp))
        .limit(limit)
        .all()
    )
    result = []
    for log in logs:
        creator_user = log.creator.username if log.creator else None
        result.append(IngestionLogResponse(
            id=log.id,
            timestamp=log.timestamp,
            creator_username=creator_user,
            endpoint=log.endpoint,
            status=log.status,
            posts_retrieved=log.posts_retrieved,
            rate_limit_remaining=log.rate_limit_remaining,
            message=log.message
        ))
    return result

@router.get("/cost-estimates", response_model=CostEstimateResponse)
def get_cost_estimates(
    creators_count: int = Query(10, ge=1, le=50),
    poll_interval_minutes: int = Query(15, ge=1, le=1440),
    avg_tweets_day: int = Query(4, ge=1, le=50)
):
    """
    Computes operational budget calculation based on current X API v2 pricing.
    Demonstrates consumption for Free, Basic ($100), Pro ($5000), and FinPulse Simulation mode.
    """
    estimates = x_client.calculate_cost_estimates(
        monitored_creators_count=creators_count,
        poll_interval_minutes=poll_interval_minutes,
        avg_tweets_per_creator_day=avg_tweets_day
    )
    return estimates

@router.post("/simulate-live-post")
async def simulate_live_post(username: Optional[str] = None, db: Session = Depends(get_db)):
    """
    Generates and ingests a simulated post immediately, broadcasting it via WebSocket.
    Allows testing the real-time live feed without waiting for external API polling.
    """
    # Pick a random creator or the specified one
    if username:
        creator = db.query(Creator).filter(Creator.username == username.lstrip("@")).first()
    else:
        creator = db.query(Creator).filter(Creator.is_active == True).first()

    if not creator:
        raise HTTPException(status_code=400, detail="No active creator found to attribute the simulated post.")

    sim_post = generate_random_live_post(creator.username)

    # Ingest post
    post = Post(
        x_post_id=sim_post["x_post_id"],
        creator_id=creator.id,
        text=sim_post["text"],
        created_at=datetime.datetime.utcnow(),
        post_url=sim_post["post_url"],
        lang="en",
        ingested_at=datetime.datetime.utcnow()
    )
    db.add(post)
    db.flush()

    # Metrics
    m = sim_post["metrics"]
    metrics = PostMetrics(
        post_id=post.id,
        like_count=m["like_count"],
        repost_count=m["repost_count"],
        reply_count=m["reply_count"],
        quote_count=m["quote_count"],
        impression_count=m["impression_count"]
    )
    db.add(metrics)

    # Run NLP Pipeline
    analysis_dict = nlp_pipeline.process_post(post.text)
    post_analysis = PostAnalysis(
        post_id=post.id,
        sentiment=analysis_dict["sentiment"],
        sentiment_score=analysis_dict["sentiment_score"],
        sentiment_breakdown=analysis_dict["sentiment_breakdown"],
        topic=analysis_dict["topic"],
        secondary_topics=analysis_dict["secondary_topics"],
        event_type=analysis_dict["event_type"],
        event_details=analysis_dict["event_details"],
        market_impact=analysis_dict["market_impact"],
        market_impact_reasoning=analysis_dict["market_impact_reasoning"],
        is_opinion=analysis_dict["is_opinion"],
        creator_opinion_summary=analysis_dict["creator_opinion_summary"],
        summary=analysis_dict["summary"],
        main_arguments=analysis_dict["main_arguments"],
        risks_and_opportunities=analysis_dict["risks_and_opportunities"],
        supporting_evidence=analysis_dict["supporting_evidence"],
        model_version=analysis_dict["model_version"],
        is_error=analysis_dict["is_error"],
        error_message=analysis_dict["error_message"]
    )
    db.add(post_analysis)

    # Mentions
    for ent_data in analysis_dict.get("entities", []):
        sym = ent_data.get("symbol")
        db_entity = db.query(MarketEntity).filter(MarketEntity.symbol == sym).first()
        if not db_entity:
            db_entity = MarketEntity(
                symbol=sym,
                name=ent_data.get("name", sym),
                entity_type=ent_data.get("entity_type", "EQUITY"),
                exchange=ent_data.get("exchange", "NSE"),
                sector=ent_data.get("sector")
            )
            db.add(db_entity)
            db.flush()
        db.add(PostEntityMention(
            post_id=post.id,
            entity_id=db_entity.id,
            matched_text=ent_data.get("matched_text", sym),
            sentiment_toward_entity=analysis_dict["sentiment"]
        ))

    # Evaluate alerts
    notifications = alert_evaluator.evaluate_post(db, post, analysis_dict)

    # Ingestion log
    db.add(IngestionLog(
        creator_id=creator.id,
        endpoint="simulated_stream",
        status="SIMULATION",
        posts_retrieved=1,
        message=f"Simulated live post generated for @{creator.username}"
    ))

    db.commit()

    # Format payload for WebSocket broadcast
    post_payload = {
        "id": post.id,
        "x_post_id": post.x_post_id,
        "text": post.text,
        "created_at": post.created_at.isoformat(),
        "post_url": post.post_url,
        "creator": {
            "id": creator.id,
            "username": creator.username,
            "display_name": creator.display_name,
            "profile_image_url": creator.profile_image_url
        },
        "metrics": m,
        "analysis": {
            "sentiment": post_analysis.sentiment,
            "sentiment_score": post_analysis.sentiment_score,
            "topic": post_analysis.topic,
            "event_type": post_analysis.event_type,
            "market_impact": post_analysis.market_impact,
            "market_impact_reasoning": post_analysis.market_impact_reasoning,
            "summary": post_analysis.summary,
            "main_arguments": post_analysis.main_arguments,
            "risks_and_opportunities": post_analysis.risks_and_opportunities
        },
        "entities": analysis_dict.get("entities", [])
    }

    # Broadcast to all live WebSocket subscribers
    await ws_manager.broadcast({
        "type": "NEW_POST",
        "data": post_payload
    })

    for n in notifications:
        await ws_manager.broadcast({
            "type": "NEW_ALERT",
            "data": {
                "id": n.id,
                "title": n.title,
                "message": n.message,
                "severity": n.severity,
                "created_at": n.created_at.isoformat()
            }
        })

    return {
        "status": "success",
        "message": f"Simulated post generated for @{creator.username} and broadcasted via WebSockets.",
        "post": post_payload
    }

