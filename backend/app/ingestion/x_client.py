"""
Official X API v2 Client
Supports:
- User lookup by username
- User timeline tweets retrieval (GET /2/users/:id/tweets)
- Recent search retrieval (GET /2/tweets/search/recent)
- Incremental pagination with since_id
- Rate limit tracking (x-rate-limit-remaining, x-rate-limit-reset)
- Cost calculation for operational budget estimation
"""

import datetime
import logging
from typing import Dict, Any, Optional, List
import httpx

from app.config import settings

logger = logging.getLogger(__name__)

X_API_BASE_URL = "https://api.twitter.com/2"

class XAPIClient:
    def __init__(self, bearer_token: Optional[str] = None):
        self.bearer_token = bearer_token or settings.X_BEARER_TOKEN
        self.rate_limit_remaining: Optional[int] = None
        self.rate_limit_reset: Optional[datetime.datetime] = None

    def _headers(self) -> Dict[str, str]:
        if not self.bearer_token:
            return {}
        return {
            "Authorization": f"Bearer {self.bearer_token}",
            "User-Agent": "FinPulse-Financial-Intelligence/1.0"
        }

    def _update_rate_limits(self, headers: httpx.Headers):
        remaining = headers.get("x-rate-limit-remaining")
        reset_epoch = headers.get("x-rate-limit-reset")
        if remaining is not None:
            try:
                self.rate_limit_remaining = int(remaining)
            except ValueError:
                pass
        if reset_epoch is not None:
            try:
                self.rate_limit_reset = datetime.datetime.fromtimestamp(float(reset_epoch))
            except (ValueError, TypeError):
                pass

    async def get_user_by_username(self, username: str) -> Dict[str, Any]:
        """
        Retrieves user profile metadata by X username.
        Endpoint: GET /2/users/by/username/:username
        """
        if not self.bearer_token:
            return {"error": "Missing X_BEARER_TOKEN", "status": "unauthenticated"}

        url = f"{X_API_BASE_URL}/users/by/username/{username.lstrip('@')}"
        params = {
            "user.fields": "description,profile_image_url,public_metrics,verified"
        }

        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url, headers=self._headers(), params=params)
            self._update_rate_limits(resp.headers)

            if resp.status_code == 200:
                data = resp.json().get("data", {})
                return {
                    "status": "success",
                    "x_user_id": data.get("id"),
                    "username": data.get("username"),
                    "display_name": data.get("name"),
                    "description": data.get("description"),
                    "profile_image_url": data.get("profile_image_url"),
                    "followers_count": data.get("public_metrics", {}).get("followers_count", 0)
                }
            elif resp.status_code == 429:
                return {
                    "status": "rate_limited",
                    "rate_limit_reset": self.rate_limit_reset.isoformat() if self.rate_limit_reset else None
                }
            else:
                return {
                    "status": "error",
                    "status_code": resp.status_code,
                    "message": resp.text
                }

    async def get_user_timeline(
        self,
        x_user_id: str,
        since_id: Optional[str] = None,
        max_results: int = 20
    ) -> Dict[str, Any]:
        """
        Retrieves recent public posts from user timeline with incremental since_id.
        Endpoint: GET /2/users/:id/tweets
        """
        if not self.bearer_token:
            return {"error": "Missing X_BEARER_TOKEN", "status": "unauthenticated", "posts": []}

        url = f"{X_API_BASE_URL}/users/{x_user_id}/tweets"
        params = {
            "max_results": min(max(5, max_results), 100),
            "tweet.fields": "created_at,public_metrics,lang,conversation_id,entities",
            "exclude": "retweets,replies"
        }
        if since_id:
            params["since_id"] = since_id

        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url, headers=self._headers(), params=params)
            self._update_rate_limits(resp.headers)

            if resp.status_code == 200:
                data = resp.json()
                tweets = data.get("data", [])
                meta = data.get("meta", {})
                
                formatted_posts = []
                for tw in tweets:
                    metrics = tw.get("public_metrics", {})
                    created_at_str = tw.get("created_at")
                    post_id = tw.get("id")
                    
                    formatted_posts.append({
                        "x_post_id": post_id,
                        "text": tw.get("text", ""),
                        "created_at": created_at_str,
                        "post_url": f"https://x.com/i/web/status/{post_id}",
                        "lang": tw.get("lang", "en"),
                        "conversation_id": tw.get("conversation_id"),
                        "metrics": {
                            "like_count": metrics.get("like_count", 0),
                            "repost_count": metrics.get("retweet_count", 0),
                            "reply_count": metrics.get("reply_count", 0),
                            "quote_count": metrics.get("quote_count", 0),
                            "impression_count": metrics.get("impression_count", 0)
                        }
                    })

                return {
                    "status": "success",
                    "posts": formatted_posts,
                    "newest_id": meta.get("newest_id"),
                    "oldest_id": meta.get("oldest_id"),
                    "result_count": meta.get("result_count", 0)
                }
            elif resp.status_code == 429:
                return {
                    "status": "rate_limited",
                    "posts": [],
                    "rate_limit_reset": self.rate_limit_reset.isoformat() if self.rate_limit_reset else None
                }
            else:
                return {
                    "status": "error",
                    "status_code": resp.status_code,
                    "message": resp.text,
                    "posts": []
                }

    @staticmethod
    def calculate_cost_estimates(
        monitored_creators_count: int = 10,
        poll_interval_minutes: int = 15,
        avg_tweets_per_creator_day: int = 4
    ) -> Dict[str, Any]:
        """
        Calculates expected X API calls and operational cost estimates under current billing rules.
        """
        polls_per_hour = 60 / max(1, poll_interval_minutes)
        polls_per_day_per_creator = polls_per_hour * 24
        total_api_calls_day = monitored_creators_count * polls_per_day_per_creator
        total_api_calls_month = total_api_calls_day * 30
        
        expected_tweets_month = monitored_creators_count * avg_tweets_per_creator_day * 30

        return {
            "parameters": {
                "monitored_creators": monitored_creators_count,
                "poll_interval_minutes": poll_interval_minutes,
                "avg_tweets_per_creator_day": avg_tweets_per_creator_day
            },
            "consumption": {
                "polls_per_day": int(total_api_calls_day),
                "polls_per_month": int(total_api_calls_month),
                "expected_tweets_ingested_month": int(expected_tweets_month)
            },
            "tiers": [
                {
                    "tier_name": "X API Free Tier",
                    "monthly_cost_usd": 0,
                    "tweet_read_limit": 100,
                    "rate_limit": "15 requests / 15 min for write; severely limited read",
                    "is_viable": False,
                    "recommendation": "Not suitable for continuous timeline polling; works for posting."
                },
                {
                    "tier_name": "X API Basic Tier",
                    "monthly_cost_usd": 100,
                    "tweet_read_limit": 10000,
                    "rate_limit": "100 requests / 24 hours per user timeline",
                    "is_viable": monitored_creators_count <= 10 and poll_interval_minutes >= 30,
                    "recommendation": "Viable for 10 creators if polling interval is 30-60 mins or when using since_id."
                },
                {
                    "tier_name": "X API Pro Tier",
                    "monthly_cost_usd": 5000,
                    "tweet_read_limit": 1000000,
                    "rate_limit": "Real-time Filtered Stream + 300 requests / 15 min",
                    "is_viable": True,
                    "recommendation": "Full real-time streaming capability for commercial operations."
                },
                {
                    "tier_name": "FinPulse Hybrid / Simulation Mode",
                    "monthly_cost_usd": 0,
                    "tweet_read_limit": "Unlimited local simulation & research sandbox",
                    "rate_limit": "No rate limits",
                    "is_viable": True,
                    "recommendation": "Ideal for development, demonstration and cost-free personal research."
                }
            ]
        }

x_client = XAPIClient()

