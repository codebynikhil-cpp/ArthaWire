"""
FinPulse Polling Scheduler
Uses APScheduler to execute periodic incremental ingestion across all active creators.
Dispatches WebSocket notifications on new post detection.
"""

import asyncio
import logging
from typing import Optional
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger

from app.config import settings
from app.database import SessionLocal
from app.models.creator import Creator
from app.ingestion.checkpointer import ingestion_manager

logger = logging.getLogger(__name__)

class PollingScheduler:
    def __init__(self):
        self.scheduler: Optional[AsyncIOScheduler] = None
        self.is_running: bool = False
        self.ws_broadcaster = None # Injected by main.py

    def set_broadcaster(self, broadcaster):
        self.ws_broadcaster = broadcaster

    def start(self):
        if self.scheduler is None:
            self.scheduler = AsyncIOScheduler()
            interval_minutes = settings.DEFAULT_POLL_INTERVAL_MINUTES
            self.scheduler.add_job(
                self.poll_all_creators,
                trigger=IntervalTrigger(minutes=interval_minutes),
                id="finpulse_poll_job",
                name="Poll Active Creators",
                replace_existing=True
            )
            self.scheduler.start()
            self.is_running = True
            logger.info(f"FinPulse Polling Scheduler started with interval: {interval_minutes} minutes.")

    def stop(self):
        if self.scheduler and self.scheduler.running:
            self.scheduler.shutdown()
            self.is_running = False
            logger.info("FinPulse Polling Scheduler stopped.")

    async def poll_all_creators(self):
        """Iterates over all active creators and triggers incremental sync."""
        db = SessionLocal()
        try:
            active_creators = db.query(Creator).filter(Creator.is_active == True).all()
            logger.info(f"Scheduler running poll for {len(active_creators)} active creators.")
            
            total_new_posts = 0
            for creator in active_creators:
                result = await ingestion_manager.sync_creator(db, creator)
                new_posts_count = result.get("posts_ingested", 0)
                total_new_posts += new_posts_count

                # If new posts detected and broadcaster is attached, notify frontend in real time!
                if new_posts_count > 0 and self.ws_broadcaster:
                    for post_item in result.get("posts", []):
                        await self.ws_broadcaster({
                            "type": "NEW_POST",
                            "data": post_item
                        })

            if total_new_posts > 0 and self.ws_broadcaster:
                await self.ws_broadcaster({
                    "type": "SYNC_COMPLETED",
                    "data": {"new_posts": total_new_posts}
                })

        except Exception as e:
            logger.error(f"Error during scheduled poll: {e}", exc_info=True)
        finally:
            db.close()

polling_scheduler = PollingScheduler()

