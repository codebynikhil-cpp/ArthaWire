from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

class CreatorBase(BaseModel):
    username: str = Field(..., description="X creator username handle (e.g. deepakshenoy)")
    display_name: Optional[str] = None
    description: Optional[str] = None
    profile_image_url: Optional[str] = None
    is_active: bool = True

class CreatorCreate(CreatorBase):
    pass

class CreatorUpdate(BaseModel):
    is_active: Optional[bool] = None
    display_name: Optional[str] = None
    description: Optional[str] = None
    profile_image_url: Optional[str] = None

class PollStateResponse(BaseModel):
    endpoint_used: str
    since_id: Optional[str] = None
    last_status: str
    error_message: Optional[str] = None
    last_polled_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class CreatorResponse(CreatorBase):
    id: int
    x_user_id: str
    followers_count: int = 0
    last_polled_at: Optional[datetime] = None
    created_at: datetime
    poll_state: Optional[PollStateResponse] = None
    total_posts_count: Optional[int] = 0

    model_config = ConfigDict(from_attributes=True)
