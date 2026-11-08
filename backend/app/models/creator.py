import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.orm import relationship

from app.database import Base

class Creator(Base):
    __tablename__ = "creators"

    id = Column(Integer, primary_key=True, index=True)
    x_user_id = Column(String(64), unique=True, index=True, nullable=False)
    username = Column(String(64), unique=True, index=True, nullable=False)
    display_name = Column(String(128), nullable=False)
    description = Column(Text, nullable=True)
    profile_image_url = Column(String(512), nullable=True)
    followers_count = Column(Integer, default=0)
    is_active = Column(Boolean, default=True, index=True)
    last_polled_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    posts = relationship("Post", back_populates="creator", cascade="all, delete-orphan")
    poll_state = relationship("PollState", back_populates="creator", uselist=False, cascade="all, delete-orphan")
    ingestion_logs = relationship("IngestionLog", back_populates="creator", cascade="all, delete-orphan")

