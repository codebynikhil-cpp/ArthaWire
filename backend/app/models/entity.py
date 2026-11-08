import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship

from app.database import Base

class MarketEntity(Base):
    __tablename__ = "market_entities"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String(32), unique=True, index=True, nullable=False) # e.g., RELIANCE, NIFTY50, USDINR
    name = Column(String(128), index=True, nullable=False) # e.g., Reliance Industries Limited
    entity_type = Column(String(32), index=True, nullable=False) # EQUITY, INDEX, SECTOR, COMMODITY, CURRENCY, REGULATOR, MACRO
    exchange = Column(String(32), nullable=True) # NSE, BSE, MCX, RBI
    sector = Column(String(64), nullable=True, index=True) # e.g., Energy, Banking & Finance, IT
    aliases = Column(JSON, nullable=True) # ["RIL", "Reliance", "Jio", "Mukesh Ambani"]
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    mentions = relationship("PostEntityMention", back_populates="entity", cascade="all, delete-orphan")


class PostEntityMention(Base):
    __tablename__ = "post_entity_mentions"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id", ondelete="CASCADE"), nullable=False, index=True)
    entity_id = Column(Integer, ForeignKey("market_entities.id", ondelete="CASCADE"), nullable=False, index=True)
    matched_text = Column(String(128), nullable=False)
    sentiment_toward_entity = Column(String(32), nullable=True) # Positive, Negative, Neutral
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    post = relationship("Post", back_populates="entity_mentions")
    entity = relationship("MarketEntity", back_populates="mentions")

