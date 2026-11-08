from typing import Optional, Dict, Any, List
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

class AlertRuleCreate(BaseModel):
    name: str
    rule_type: str = Field(..., description="ENTITY_MENTION, RBI_POLICY, HIGH_IMPACT_EVENT, MULTI_CREATOR, SENTIMENT_EXTREME, KEYWORD")
    criteria: Dict[str, Any]
    is_active: bool = True

class AlertRuleResponse(BaseModel):
    id: int
    name: str
    rule_type: str
    criteria: Dict[str, Any]
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class NotificationResponse(BaseModel):
    id: int
    alert_id: Optional[int] = None
    post_id: Optional[int] = None
    title: str
    message: str
    severity: str
    category: str
    is_read: bool
    created_at: datetime
    metadata_json: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(from_attributes=True)
