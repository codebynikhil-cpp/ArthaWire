"""
FinPulse Backend Entrypoint
FastAPI Application, Startup/Shutdown Lifespan, Database Seeding, APScheduler, and WebSocket Management.
"""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.models.creator import Creator
from app.models.entity import MarketEntity
from app.models.alert import AlertRule
from app.data.seed_data import INITIAL_CREATORS, INDIAN_MARKET_ENTITIES, DEFAULT_ALERTS
from app.ingestion.scheduler import polling_scheduler
from app.ingestion.checkpointer import ingestion_manager
from app.routers import creators, posts, analytics, insights, alerts, ingestion, websockets
from app.routers.websockets import ws_manager

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("finpulse")

async def seed_database():
    """Initializes tables and populates default creators, market entities, and alerts if empty."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # 1. Seed Market Entities
        if db.query(MarketEntity).count() == 0:
            logger.info("Seeding Indian Market Entities (Equities, Indices, Sectors, Macro)...")
            for ent in INDIAN_MARKET_ENTITIES:
                db.add(MarketEntity(
                    symbol=ent["symbol"],
                    name=ent["name"],
                    entity_type=ent["entity_type"],
                    exchange=ent.get("exchange"),
                    sector=ent.get("sector"),
                    aliases=ent.get("aliases")
                ))
            db.commit()

        # 2. Seed Default Alert Rules
        if db.query(AlertRule).count() == 0:
            logger.info("Seeding Default Alert Rules...")
            for alert in DEFAULT_ALERTS:
                db.add(AlertRule(
                    name=alert["name"],
                    rule_type=alert["rule_type"],
                    criteria=alert["criteria"],
                    is_active=alert["is_active"]
                ))
            db.commit()

        # 3. Seed Initial 10 Creators
        if db.query(Creator).count() == 0:
            logger.info("Seeding 10 Curated Indian Financial Creators...")
            for c_data in INITIAL_CREATORS:
                creator = Creator(
                    x_user_id=c_data["x_user_id"],
                    username=c_data["username"],
                    display_name=c_data["display_name"],
                    description=c_data["description"],
                    profile_image_url=c_data["profile_image_url"],
                    followers_count=c_data["followers_count"],
                    is_active=c_data["is_active"]
                )
                db.add(creator)
            db.commit()

            # Pre-populate posts from seed simulation
            logger.info("Pre-populating initial intelligence feed for seeded creators...")
            all_creators = db.query(Creator).all()
            for c in all_creators:
                try:
                    await ingestion_manager.sync_creator(db, c)
                except Exception as ex:
                    logger.warning(f"Error syncing creator @{c.username} during seeding: {ex}")

    except Exception as e:
        logger.error(f"Error seeding database: {e}", exc_info=True)
        db.rollback()
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Seed database and start APScheduler
    logger.info("FinPulse Backend starting up...")
    await seed_database()

    # Inject WebSocket broadcaster into scheduler
    polling_scheduler.set_broadcaster(ws_manager.broadcast)
    polling_scheduler.start()

    yield

    # Shutdown
    logger.info("FinPulse Backend shutting down...")
    polling_scheduler.stop()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Real-Time X-Based Financial Intelligence Platform for Indian Markets (NSE/BSE)",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(creators.router, prefix=settings.API_V1_PREFIX)
app.include_router(posts.router, prefix=settings.API_V1_PREFIX)
app.include_router(analytics.router, prefix=settings.API_V1_PREFIX)
app.include_router(insights.router, prefix=settings.API_V1_PREFIX)
app.include_router(alerts.router, prefix=settings.API_V1_PREFIX)
app.include_router(ingestion.router, prefix=settings.API_V1_PREFIX)
app.include_router(websockets.router) # /ws directly on root

@app.get("/")
def root():
    return {
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "operational",
        "docs_url": "/docs",
        "market_focus": "Indian Financial Market (NSE/BSE)",
        "disclaimer": "FinPulse is a research and intelligence assistant, not investment advice."
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "scheduler_active": polling_scheduler.is_running}
