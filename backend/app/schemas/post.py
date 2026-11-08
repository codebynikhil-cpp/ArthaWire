from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, ConfigDict

class PostMetricsResponse(BaseModel):
    like_count: int = 0
    repost_count: int = 0
    reply_count: int = 0
    quote_count: int = 0
    impression_count: int = 0

    model_config = ConfigDict(from_attributes=True)

class PostAnalysisResponse(BaseModel):
    sentiment: str
    sentiment_score: float
    sentiment_breakdown: Optional[Dict[str, float]] = None
    topic: str
    secondary_topics: Optional[List[str]] = None
    event_type: Optional[str] = None
    event_details: Optional[str] = None
    market_impact: str
    market_impact_reasoning: Optional[str] = None
    is_opinion: bool = True
    creator_opinion_summary: Optional[str] = None
    summary: str
    main_arguments: Optional[List[str]] = None
    risks_and_opportunities: Optional[Dict[str, List[str]]] = None
    supporting_evidence: Optional[str] = None
    model_version: str
    processed_at: datetime

    model_config = ConfigDict(from_attributes=True)

class EntityMentionResponse(BaseModel):
    id: int
    symbol: str
    name: str
    entity_type: str
    sector: Optional[str] = None
    matched_text: str

    model_config = ConfigDict(from_attributes=True)

class CreatorSummary(BaseModel):
    id: int
    username: str
    display_name: str
    profile_image_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class PostResponse(BaseModel):
    id: int
    x_post_id: str
    text: str
    created_at: datetime
    post_url: str
    lang: str
    ingested_at: datetime
    creator: CreatorSummary
    metrics: Optional[PostMetricsResponse] = None
    analysis: Optional[PostAnalysisResponse] = None
    entities: List[EntityMentionResponse] = []

    model_config = ConfigDict(from_attributes=True)

class PostFeedResponse(BaseModel):
    total: int
    page: int
    limit: int
    posts: List[PostResponse]
