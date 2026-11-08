from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class SentimentCount(BaseModel):
    positive: int = 0
    negative: int = 0
    neutral: int = 0
    mixed: int = 0

class TopicCount(BaseModel):
    topic: str
    count: int

class SectorCount(BaseModel):
    sector: str
    count: int
    sentiment_distribution: SentimentCount

class EntityLeaderboard(BaseModel):
    symbol: str
    name: str
    mentions_count: int
    positive: int
    negative: int
    neutral: int
    mixed: int
    last_discussed: Optional[str] = None

class OverviewStats(BaseModel):
    total_monitored_creators: int
    active_monitored_creators: int
    total_posts_collected: int
    posts_detected_today: int
    sentiment_distribution: SentimentCount
    trending_topics: List[TopicCount]
    recent_events: List[Dict[str, Any]]

class CreatorAnalyticsResponse(BaseModel):
    creator_id: int
    username: str
    display_name: str
    profile_image_url: Optional[str] = None
    total_posts: int
    posts_this_week: int
    sentiment_distribution: SentimentCount
    top_discussed_companies: List[Dict[str, Any]]
    top_discussed_sectors: List[Dict[str, Any]]
    top_topics: List[Dict[str, Any]]
    recent_posts: List[Dict[str, Any]]

class MarketIntelligenceResponse(BaseModel):
    trending_companies: List[EntityLeaderboard]
    trending_sectors: List[SectorCount]
    emerging_topics: List[TopicCount]
    unusual_spikes: List[Dict[str, Any]]

