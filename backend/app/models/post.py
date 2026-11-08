import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship

from app.database import Base

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    x_post_id = Column(String(64), unique=True, index=True, nullable=False)
    creator_id = Column(Integer, ForeignKey("creators.id", ondelete="CASCADE"), nullable=False, index=True)
    text = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False, index=True) # X publication timestamp
    post_url = Column(String(256), nullable=False)
    lang = Column(String(16), default="en")
    conversation_id = Column(String(64), nullable=True)
    ingested_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    creator = relationship("Creator", back_populates="posts")
    metrics = relationship("PostMetrics", back_populates="post", uselist=False, cascade="all, delete-orphan")
    analysis = relationship("PostAnalysis", back_populates="post", uselist=False, cascade="all, delete-orphan")
    entity_mentions = relationship("PostEntityMention", back_populates="post", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="post", cascade="all, delete-orphan")


class PostMetrics(Base):
    __tablename__ = "post_metrics"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id", ondelete="CASCADE"), unique=True, nullable=False)
    like_count = Column(Integer, default=0)
    repost_count = Column(Integer, default=0)
    reply_count = Column(Integer, default=0)
    quote_count = Column(Integer, default=0)
    impression_count = Column(Integer, default=0)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationship
    post = relationship("Post", back_populates="metrics")


class PostAnalysis(Base):
    __tablename__ = "post_analysis"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    # Financial Sentiment Analysis
    # Allowed: Positive, Negative, Neutral, Mixed
    sentiment = Column(String(32), nullable=False, index=True)
    sentiment_score = Column(Float, default=0.0)
    sentiment_breakdown = Column(JSON, nullable=True) # {"positive": 0.85, "negative": 0.05, "neutral": 0.10}

    # Topic Classification
    topic = Column(String(64), nullable=False, index=True)
    secondary_topics = Column(JSON, nullable=True) # ["Company earnings", "Banking and finance"]

    # Event Detection
    event_type = Column(String(64), nullable=True, index=True)
    event_details = Column(Text, nullable=True)

    # Market Impact Classification
    # Allowed: Potentially bullish, Potentially bearish, Neutral, Unclear
    market_impact = Column(String(32), nullable=False, index=True)
    market_impact_reasoning = Column(Text, nullable=True)
    creator_opinion_summary = Column(Text, nullable=True)
    is_opinion = Column(Boolean, default=True)

    # AI Summarization
    summary = Column(Text, nullable=False)
    main_arguments = Column(JSON, nullable=True) # ["Strong Q3 margin expansion", "Capex guidance lowered"]
    risks_and_opportunities = Column(JSON, nullable=True) # {"risks": [...], "opportunities": [...]}
    supporting_evidence = Column(Text, nullable=True)

    # Model & Processing metadata
    model_version = Column(String(64), default="FinPulse-NLP-v1")
    is_error = Column(Boolean, default=False)
    error_message = Column(Text, nullable=True)
    processed_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationship
    post = relationship("Post", back_populates="analysis")

