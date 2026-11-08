import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship

from app.database import Base

class AlertRule(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    # Types: ENTITY_MENTION, RBI_POLICY, HIGH_IMPACT_EVENT, MULTI_CREATOR, SENTIMENT_EXTREME, TOPIC_FOCUS
    rule_type = Column(String(64), nullable=False, index=True)
    criteria = Column(JSON, nullable=False) # e.g. {"symbol": "RELIANCE"}, {"min_creators": 2}, {"sentiment": "Negative"}
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    notifications = relationship("Notification", back_populates="alert_rule", cascade="all, delete-orphan")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    alert_id = Column(Integer, ForeignKey("alerts.id", ondelete="SET NULL"), nullable=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id", ondelete="CASCADE"), nullable=True, index=True)
    title = Column(String(256), nullable=False)
    message = Column(Text, nullable=False)
    severity = Column(String(32), default="INFO") # INFO, WARNING, CRITICAL
    category = Column(String(64), default="MARKET_ALERT")
    is_read = Column(Boolean, default=False, index=True)
    metadata_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    # Relationships
    alert_rule = relationship("AlertRule", back_populates="notifications")
    post = relationship("Post", back_populates="notifications")

