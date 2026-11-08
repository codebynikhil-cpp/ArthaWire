import datetime
import pytest
from app.nlp.consensus_engine import consensus_engine

def test_multi_creator_consensus_detection():
    # 2 different creators discussing Reliance within 24 hours
    now = datetime.datetime.utcnow().isoformat()
    mock_posts = [
        {
            "post_id": 1,
            "creator_id": 101,
            "username": "deepakshenoy",
            "display_name": "Deepak Shenoy",
            "text": "Reliance Q3 numbers look solid on retail EBITDA.",
            "created_at": now,
            "post_url": "https://x.com/deepakshenoy/status/101",
            "sentiment": "Positive",
            "topic": "Company earnings",
            "summary": "Deepak is bullish on retail growth.",
            "main_arguments": ["Retail EBITDA expansion"],
            "entities": [{"symbol": "RELIANCE", "name": "Reliance Industries Limited", "entity_type": "EQUITY"}]
        },
        {
            "post_id": 2,
            "creator_id": 102,
            "username": "shripad_n",
            "display_name": "Shripad",
            "text": "Reliance O2C margins took a hit from crude volatility.",
            "created_at": now,
            "post_url": "https://x.com/shripad_n/status/102",
            "sentiment": "Negative",
            "topic": "Company earnings",
            "summary": "Shripad notes refining margin contraction.",
            "main_arguments": ["O2C margin compression"],
            "entities": [{"symbol": "RELIANCE", "name": "Reliance Industries Limited", "entity_type": "EQUITY"}]
        }
    ]

    insights = consensus_engine.consolidate_discussions(mock_posts, time_window_hours=48)

    assert len(insights) == 1
    rel = insights[0]
    assert rel["symbol"] == "RELIANCE"
    assert rel["creators_count"] == 2
    assert rel["overall_sentiment"] == "Mixed"
    assert len(rel["divergent_opinions"]) == 2
    assert len(rel["original_post_links"]) == 2

