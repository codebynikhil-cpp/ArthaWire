import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base

class PollState(Base):
    __tablename__ = "poll_state"

    id = Column(Integer, primary_key=True, index=True)
    creator_id = Column(Integer, ForeignKey("creators.id", ondelete="CASCADE"), unique=True, nullable=False)
    endpoint_used = Column(String(64), default="user_timeline") # user_timeline, search_recent
    since_id = Column(String(64), nullable=True) # Incremental checkpoint
    last_status = Column(String(32), default="IDLE") # SUCCESS, RATE_LIMITED, ERROR, IDLE
    error_message = Column(Text, nullable=True)
    last_polled_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationship
    creator = relationship("Creator", back_populates="poll_state")


class IngestionLog(Base):
    __tablename__ = "ingestion_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    creator_id = Column(Integer, ForeignKey("creators.id", ondelete="SET NULL"), nullable=True, index=True)
    endpoint = Column(String(128), nullable=False)
    status = Column(String(32), nullable=False) # SUCCESS, ERROR, RATE_LIMITED, SIMULATION
    posts_retrieved = Column(Integer, default=0)
    rate_limit_remaining = Column(Integer, nullable=True)
    rate_limit_reset = Column(DateTime, nullable=True)
    message = Column(Text, nullable=True)

    # Relationship
    creator = relationship("Creator", back_populates="ingestion_logs")

