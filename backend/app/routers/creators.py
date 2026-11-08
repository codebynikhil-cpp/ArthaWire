"""
FinPulse Creator Management Endpoints
- Add & remove up to 10 creators
- Toggle active/deactive
- Creator status & polling checkpoints
- Manual creator sync
"""

import random
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.config import settings
from app.models.creator import Creator
from app.models.post import Post
from app.models.ingestion import PollState
from app.schemas.creator import CreatorCreate, CreatorUpdate, CreatorResponse
from app.ingestion.x_client import x_client
from app.ingestion.checkpointer import ingestion_manager

router = APIRouter(prefix="/creators", tags=["Creators"])

@router.get("", response_model=List[CreatorResponse])
def get_creators(db: Session = Depends(get_db)):
    """Retrieves all monitored creators with status and post counts."""
    creators = db.query(Creator).all()
    results = []
    for c in creators:
        count = db.query(func.count(Post.id)).filter(Post.creator_id == c.id).scalar()
        res_item = CreatorResponse.model_validate(c)
        res_item.total_posts_count = count
        results.append(res_item)
    return results

@router.post("", response_model=CreatorResponse)
async def add_creator(payload: CreatorCreate, db: Session = Depends(get_db)):
    """
    Adds a new X creator to monitor (max 10).
    Fetches user profile metadata from X API v2 (or simulated profile if in sandbox mode).
    """
    total_count = db.query(func.count(Creator.id)).scalar()
    if total_count >= settings.MAX_MONITORED_CREATORS:
        raise HTTPException(
            status_code=400,
            detail=f"Maximum monitored creator limit reached ({settings.MAX_MONITORED_CREATORS}). Remove an existing creator before adding a new one."
        )

    clean_username = payload.username.lstrip("@").strip()

    # Check if already exists
    existing = db.query(Creator).filter(func.lower(Creator.username) == clean_username.lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Creator @{clean_username} is already monitored.")

    # Fetch profile metadata
    display_name = payload.display_name or clean_username
    description = payload.description or "Indian finance creator on X"
    profile_image = payload.profile_image_url or "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
    followers = 50000
    x_user_id = str(random.randint(10000000, 99999999))

    if not settings.SIMULATION_MODE and settings.X_BEARER_TOKEN:
        x_res = await x_client.get_user_by_username(clean_username)
        if x_res.get("status") == "success":
            x_user_id = str(x_res.get("x_user_id"))
            display_name = x_res.get("display_name") or display_name
            description = x_res.get("description") or description
            profile_image = x_res.get("profile_image_url") or profile_image
            followers = x_res.get("followers_count", 0)

    creator = Creator(
        x_user_id=x_user_id,
        username=clean_username,
        display_name=display_name,
        description=description,
        profile_image_url=profile_image,
        followers_count=followers,
        is_active=payload.is_active
    )
    db.add(creator)
    db.flush()

    # Create associated PollState
    poll_state = PollState(
        creator_id=creator.id,
        endpoint_used="user_timeline",
        last_status="IDLE"
    )
    db.add(poll_state)
    db.commit()
    db.refresh(creator)

    # Initial sync
    try:
        await ingestion_manager.sync_creator(db, creator)
    except Exception:
        pass

    res = CreatorResponse.model_validate(creator)
    res.total_posts_count = db.query(func.count(Post.id)).filter(Post.creator_id == creator.id).scalar()
    return res

@router.patch("/{creator_id}", response_model=CreatorResponse)
def update_creator(creator_id: int, payload: CreatorUpdate, db: Session = Depends(get_db)):
    """Updates creator active status or profile metadata."""
    creator = db.query(Creator).filter(Creator.id == creator_id).first()
    if not creator:
        raise HTTPException(status_code=404, detail="Creator not found")

    if payload.is_active is not None:
        creator.is_active = payload.is_active
    if payload.display_name is not None:
        creator.display_name = payload.display_name
    if payload.description is not None:
        creator.description = payload.description
    if payload.profile_image_url is not None:
        creator.profile_image_url = payload.profile_image_url

    db.commit()
    db.refresh(creator)

    res = CreatorResponse.model_validate(creator)
    res.total_posts_count = db.query(func.count(Post.id)).filter(Post.creator_id == creator.id).scalar()
    return res

@router.delete("/{creator_id}")
def delete_creator(creator_id: int, db: Session = Depends(get_db)):
    """Removes a creator and cascades associated posts and metrics."""
    creator = db.query(Creator).filter(Creator.id == creator_id).first()
    if not creator:
        raise HTTPException(status_code=404, detail="Creator not found")

    username = creator.username
    db.delete(creator)
    db.commit()
    return {"status": "success", "message": f"Creator @{username} successfully removed"}

@router.post("/{creator_id}/sync")
async def sync_single_creator(creator_id: int, db: Session = Depends(get_db)):
    """Manually triggers incremental sync for a specific creator."""
    creator = db.query(Creator).filter(Creator.id == creator_id).first()
    if not creator:
        raise HTTPException(status_code=404, detail="Creator not found")

    res = await ingestion_manager.sync_creator(db, creator)
    return res
