"""
FinPulse Ingestion Engine & Checkpointer
Handles:
- Incremental retrieval using since_id checkpoints
- Duplicate prevention via unique x_post_id constraints
- Invocation of NLP Financial Intelligence pipeline
- Persistence of Posts, Metrics, Analysis, and Entity Mentions
- Alert Rule Evaluation
- Structured Ingestion Logging
"""

import datetime
import logging
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session

from app.config import settings
from app.models.creator import Creator
from app.models.post import Post, PostMetrics, PostAnalysis
from app.models.entity import MarketEntity, PostEntityMention
from app.models.ingestion import PollState, IngestionLog
from app.ingestion.x_client import x_client
from app.ingestion.mock_feed import get_simulated_posts_for_creator
from app.nlp.pipeline import nlp_pipeline
from app.alerts.evaluator import alert_evaluator

logger = logging.getLogger(__name__)

class IngestionManager:
    async def sync_creator(self, db: Session, creator: Creator) -> Dict[str, Any]:
        """
        Polls new posts for a single creator incrementally.
        Supports both live X API v2 and simulation mode.
        """
        # Ensure poll_state exists
        poll_state = creator.poll_state
        if not poll_state:
            poll_state = PollState(creator_id=creator.id, endpoint_used="user_timeline")
            db.add(poll_state)
            db.commit()
            db.refresh(poll_state)

        since_id = poll_state.since_id
        posts_raw: List[Dict[str, Any]] = []
        status = "SUCCESS"
        error_msg = None
        newest_id = since_id

        # Determine mode
        if settings.SIMULATION_MODE or not settings.X_BEARER_TOKEN:
            # Simulation / Demo Mode
            logger.info(f"Syncing creator @{creator.username} in SIMULATION mode.")
            posts_raw = get_simulated_posts_for_creator(creator.username, count=3)
            status = "SIMULATION"
        else:
            # Live X API v2 Mode
            logger.info(f"Syncing creator @{creator.username} via Official X API v2 (since_id={since_id}).")
            res = await x_client.get_user_timeline(
                x_user_id=creator.x_user_id,
                since_id=since_id,
                max_results=20
            )
            
            if res.get("status") == "success":
                posts_raw = res.get("posts", [])
                newest_id = res.get("newest_id") or since_id
                status = "SUCCESS"
            elif res.get("status") == "rate_limited":
                status = "RATE_LIMITED"
                error_msg = f"Rate limited. Reset at {res.get('rate_limit_reset')}"
            else:
                status = "ERROR"
                error_msg = res.get("message", "Unknown X API error")

        # Process and store newly retrieved posts with deduplication
        ingested_count = 0
        processed_posts = []
        new_notifications = []

        for p_data in posts_raw:
            x_post_id = p_data.get("x_post_id")
            
            # Duplicate prevention
            exists = db.query(Post).filter(Post.x_post_id == x_post_id).first()
            if exists:
                continue

            # Parse created_at
            raw_time = p_data.get("created_at")
            if isinstance(raw_time, str):
                try:
                    pub_time = datetime.datetime.fromisoformat(raw_time.replace("Z", "+00:00")).replace(tzinfo=None)
                except Exception:
                    pub_time = datetime.datetime.utcnow()
            else:
                pub_time = datetime.datetime.utcnow()

            # 1. Create Post
            post = Post(
                x_post_id=x_post_id,
                creator_id=creator.id,
                text=p_data.get("text", ""),
                created_at=pub_time,
                post_url=p_data.get("post_url", f"https://x.com/{creator.username}/status/{x_post_id}"),
                lang=p_data.get("lang", "en"),
                conversation_id=p_data.get("conversation_id"),
                ingested_at=datetime.datetime.utcnow()
            )
            db.add(post)
            db.flush() # Populate post.id

            # 2. Create PostMetrics
            metrics_data = p_data.get("metrics", {})
            metrics = PostMetrics(
                post_id=post.id,
                like_count=metrics_data.get("like_count", 0),
                repost_count=metrics_data.get("repost_count", 0),
                reply_count=metrics_data.get("reply_count", 0),
                quote_count=metrics_data.get("quote_count", 0),
                impression_count=metrics_data.get("impression_count", 0)
            )
            db.add(metrics)

            # 3. AI / NLP Financial Intelligence Pipeline
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

            # 4. Link Entity Mentions
            for ent_data in analysis_dict.get("entities", []):
                sym = ent_data.get("symbol")
                # Look up existing MarketEntity in DB
                db_entity = db.query(MarketEntity).filter(MarketEntity.symbol == sym).first()
                if not db_entity:
                    # Dynamically create entity if not already present
                    db_entity = MarketEntity(
                        symbol=sym,
                        name=ent_data.get("name", sym),
                        entity_type=ent_data.get("entity_type", "EQUITY"),
                        exchange=ent_data.get("exchange", "NSE"),
                        sector=ent_data.get("sector")
                    )
                    db.add(db_entity)
                    db.flush()

                mention = PostEntityMention(
                    post_id=post.id,
                    entity_id=db_entity.id,
                    matched_text=ent_data.get("matched_text", sym),
                    sentiment_toward_entity=analysis_dict["sentiment"]
                )
                db.add(mention)

            # 5. Evaluate Alerts
            notifications = alert_evaluator.evaluate_post(db, post, analysis_dict)
            new_notifications.extend(notifications)

            ingested_count += 1
            processed_posts.append({
                "post_id": post.id,
                "x_post_id": post.x_post_id,
                "text": post.text,
                "created_at": post.created_at.isoformat(),
                "sentiment": post_analysis.sentiment,
                "topic": post_analysis.topic,
                "market_impact": post_analysis.market_impact,
                "creator_username": creator.username
            })

            # Track newest_id for checkpoint
            if not newest_id or str(x_post_id) > str(newest_id):
                newest_id = str(x_post_id)

        # Update poll state checkpoint
        poll_state.since_id = newest_id or poll_state.since_id
        poll_state.last_status = status
        poll_state.error_message = error_msg
        poll_state.last_polled_at = datetime.datetime.utcnow()
        creator.last_polled_at = datetime.datetime.utcnow()

        # Write ingestion log
        ingestion_log = IngestionLog(
            creator_id=creator.id,
            endpoint=poll_state.endpoint_used,
            status=status,
            posts_retrieved=ingested_count,
            rate_limit_remaining=x_client.rate_limit_remaining,
            rate_limit_reset=x_client.rate_limit_reset,
            message=error_msg or f"Successfully ingested {ingested_count} new posts."
        )
        db.add(ingestion_log)

        db.commit()

        return {
            "creator_id": creator.id,
            "username": creator.username,
            "status": status,
            "posts_ingested": ingested_count,
            "newest_id": newest_id,
            "notifications_generated": len(new_notifications),
            "posts": processed_posts
        }

ingestion_manager = IngestionManager()

