import pytest
from fastapi.testclient import TestClient
from app.main import app, seed_database
from app.database import engine, Base
import asyncio

@pytest.fixture(scope="module")
def client():
    # Ensure tables and seed data exist
    Base.metadata.create_all(bind=engine)
    asyncio.run(seed_database())
    with TestClient(app) as test_client:
        yield test_client

def test_auth_login_and_verify(client):
    # Test invalid key
    res_invalid = client.post("/api/auth/login", json={"access_key": "WRONG-KEY"})
    assert res_invalid.status_code == 401

    # Test valid key
    res_valid = client.post("/api/auth/login", json={"access_key": "ARTHA-2026"})
    assert res_valid.status_code == 200
    data = res_valid.json()
    assert data["authenticated"] is True
    assert "token" in data

    # Test verify endpoint
    token = data["token"]
    res_verify = client.get("/api/auth/verify", headers={"Authorization": f"Bearer {token}"})
    assert res_verify.status_code == 200
    assert res_verify.json()["authenticated"] is True

    res_h = client.get("/health")
    assert res_h.status_code == 200
    assert res_h.json()["status"] == "healthy"

def test_creators_endpoints(client):
    res = client.get("/api/creators")
    assert res.status_code == 200
    creators = res.json()
    assert isinstance(creators, list)
    assert len(creators) > 0
    assert any(c["username"] == "deepakshenoy" for c in creators)

def test_posts_feed_endpoint(client):
    res = client.get("/api/posts?limit=10")
    assert res.status_code == 200
    data = res.json()
    assert "posts" in data
    assert "total" in data
    assert len(data["posts"]) > 0

def test_analytics_overview(client):
    res = client.get("/api/analytics/overview")
    assert res.status_code == 200
    data = res.json()
    assert "total_monitored_creators" in data
    assert "sentiment_distribution" in data
    assert "trending_topics" in data

def test_market_intelligence(client):
    res = client.get("/api/analytics/market")
    assert res.status_code == 200
    data = res.json()
    assert "trending_companies" in data
    assert "trending_sectors" in data

def test_insights_consensus(client):
    res = client.get("/api/insights/consensus")
    assert res.status_code == 200
    data = res.json()
    assert "insights" in data

def test_alert_rules(client):
    res = client.get("/api/alerts/rules")
    assert res.status_code == 200
    rules = res.json()
    assert len(rules) > 0

def test_cost_estimates(client):
    res = client.get("/api/ingestion/cost-estimates?creators_count=10&poll_interval_minutes=15")
    assert res.status_code == 200
    data = res.json()
    assert "tiers" in data
    assert len(data["tiers"]) == 4
