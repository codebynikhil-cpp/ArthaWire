from typing import Optional, Dict, Any, List
from datetime import datetime
from pydantic import BaseModel, ConfigDict

class IngestionStatusResponse(BaseModel):
    is_scheduler_running: bool
    mode: str
    active_creators_count: int
    total_creators_count: int
    rate_limit_remaining: Optional[int] = None
    rate_limit_reset: Optional[datetime] = None
    last_poll_time: Optional[datetime] = None
    total_posts_ingested: int

class CostEstimateTier(BaseModel):
    tier_name: str
    monthly_cost_usd: float
    tweet_read_limit: Any
    rate_limit: str
    is_viable: bool
    recommendation: str

class CostEstimateResponse(BaseModel):
    parameters: Dict[str, Any]
    consumption: Dict[str, Any]
    tiers: List[CostEstimateTier]

class IngestionLogResponse(BaseModel):
    id: int
    timestamp: datetime
    creator_username: Optional[str] = None
    endpoint: str
    status: str
    posts_retrieved: int
    rate_limit_remaining: Optional[int] = None
    message: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
