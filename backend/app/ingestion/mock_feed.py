"""
FinPulse Mock Ingestion & Simulation Stream
High-fidelity simulated posts from monitored Indian finance creators.
Used for zero-cost testing, sandbox demonstration, and offline research.
"""

import datetime
import random
from typing import List, Dict, Any

SIMULATED_TWEET_POOL = [
    {
        "username": "deepakshenoy",
        "text": "Reliance Q3 numbers look solid on the surface with consolidated PAT up +15.2% to ₹18,400 Cr. However, retail EBITDA margin compressed by 40 bps. Jio is carrying the growth weight with 11M net subscriber additions. Valuations look reasonable here. $RELIANCE",
        "likes": 1240,
        "reposts": 185,
        "replies": 94,
        "topic": "Company earnings",
        "symbol": "RELIANCE"
    },
    {
        "username": "shripad_n",
        "text": "Reliance results breakdown: Retail revenue grew +18% YoY, but O2C (refining & petrochemicals) took a hit due to crude oil margin volatility and Singapore GRM slump. Debt levels remain steady at ₹1.18 lakh Cr. Mixed bag overall. $RELIANCE #DalalStreet",
        "likes": 850,
        "reposts": 112,
        "replies": 43,
        "topic": "Company earnings",
        "symbol": "RELIANCE"
    },
    {
        "username": "kshitij_a",
        "text": "Market reaction to Reliance: Early trading shows Dalal Street digesting the numbers. Institutional brokerages have maintained 'Accumulate' with average target price of ₹3,150. Key monitorable remains telecom tariff hikes. $RELIANCE",
        "likes": 640,
        "reposts": 78,
        "replies": 29,
        "topic": "Company earnings",
        "symbol": "RELIANCE"
    },
    {
        "username": "TamalBandyo",
        "text": "RBI MPC keeps the repo rate unchanged at 6.50% in a unanimous decision. Governor Shaktikanta Das reiterated focus on bringing retail inflation sustainably down to the 4% target. Banking system liquidity is being actively managed via VRR auctions.",
        "likes": 2100,
        "reposts": 430,
        "replies": 112,
        "topic": "RBI monetary policy",
        "symbol": "RBI"
    },
    {
        "username": "shripad_n",
        "text": "HDFC Bank deposit growth (+16.5% YoY) is finally outpacing credit growth (+13.2%). This will help bring down the elevated Credit-to-Deposit (LDR) ratio faster than street expected. NIMs should stabilize around 3.45% over the next two quarters. $HDFCBANK",
        "likes": 1650,
        "reposts": 280,
        "replies": 88,
        "topic": "Banking and finance",
        "symbol": "HDFCBANK"
    },
    {
        "username": "deepakshenoy",
        "text": "HDFC Bank numbers confirm the merger hangover is resolving. Deposit mobilization has been aggressive, though at slightly higher cost of funds. Long term compounding machine at 2.4x book value. $HDFCBANK",
        "likes": 1920,
        "reposts": 310,
        "replies": 95,
        "topic": "Banking and finance",
        "symbol": "HDFCBANK"
    },
    {
        "username": "dmuthuk",
        "text": "NIFTY 50 hitting new highs is not a reason to panic or become overly euphoric. For long-term Indian wealth creation, monthly SIPs in index funds and high quality compounders will always outperform tactical timing. Stay invested in India's structural growth.",
        "likes": 4800,
        "reposts": 620,
        "replies": 215,
        "topic": "Indian stock market",
        "symbol": "NIFTY50"
    },
    {
        "username": "capitalmind_in",
        "text": "Tata Motors commercial vehicle volumes witnessed a 7% dip in domestic dispatches, but JLR order book stands strong at 148,000 units. EV segment margin turned positive for the first time (+1.8% EBITDA). Demerger into CV and PV businesses on track. $TATAMOTORS",
        "likes": 1150,
        "reposts": 190,
        "replies": 62,
        "topic": "Company earnings",
        "symbol": "TATAMOTORS"
    },
    {
        "username": "soicfinance",
        "text": "Deep dive into Indian IT sector: TCS and Infosys are seeing BFSI revival in North America, with mega deal total contract value (TCV) hitting $8.2 billion. Attrition has normalized to sub-13%. Operating margins expanding back towards 24-25% band. $TCS $INFY",
        "likes": 2340,
        "reposts": 410,
        "replies": 140,
        "topic": "Company earnings",
        "symbol": "TCS"
    },
    {
        "username": "nagpalmano",
        "text": "Retail inflation CPI cooled down to 4.85% in the latest print, led by moderation in vegetable prices. This gives RBI headroom for a potential 25 bps rate cut in the upcoming monetary policy meeting if monsoon distribution remains normal.",
        "likes": 1420,
        "reposts": 215,
        "replies": 75,
        "topic": "Inflation",
        "symbol": "INFLATION"
    },
    {
        "username": "safalniveshak",
        "text": "When analyzing Indian manufacturing companies, capex alone isn't enough. Look at Return on Capital Employed (ROCE) and whether management is diluting equity or piling on bank debt. High ROCE businesses like Titan and Astral generate enough internal cash flows. $TITAN",
        "likes": 3100,
        "reposts": 490,
        "replies": 110,
        "topic": "Indian stock market",
        "symbol": "TITAN"
    },
    {
        "username": "surajae",
        "text": "Larsen & Toubro bagging ₹4,800 Cr infrastructure order for railway electrification and transmission corridors. Domestic capex cycle is firing on all cylinders with central government budget spending. Order book book-to-bill ratio at 3.2x. $LT",
        "likes": 980,
        "reposts": 145,
        "replies": 38,
        "topic": "Corporate announcements",
        "symbol": "LT"
    },
    {
        "username": "deepakshenoy",
        "text": "Gold hitting all-time high on MCX at ₹78,000 per 10g while USDINR tests 84.40. Central banks across emerging markets continue dedollarization reserves accumulation. Indian sovereign gold bonds (SGB) yielding tremendous returns for patient holders.",
        "likes": 2650,
        "reposts": 390,
        "replies": 130,
        "topic": "Commodities",
        "symbol": "GOLD"
    },
    {
        "username": "kshitij_a",
        "text": "SEBI board meeting update: Stricter derivative regulations implemented for index options. Minimum contract size raised and weekly expiry restricted to one per exchange. Steps aimed at curbing speculative retail losses in F&O. $BANKNIFTY",
        "likes": 3890,
        "reposts": 610,
        "replies": 290,
        "topic": "Indian stock market",
        "symbol": "SEBI"
    }
]

def get_simulated_posts_for_creator(username: str, count: int = 3) -> List[Dict[str, Any]]:
    """Retrieves simulated posts for a given creator."""
    matched = [p for p in SIMULATED_TWEET_POOL if p["username"].lower() == username.lower()]
    if not matched:
        # Fallback to random posts customized with username
        matched = random.sample(SIMULATED_TWEET_POOL, min(count, len(SIMULATED_TWEET_POOL)))

    now = datetime.datetime.utcnow()
    posts = []
    for i, t in enumerate(matched[:count]):
        post_id = f"18{random.randint(10000000, 99999999)}"
        created_time = now - datetime.timedelta(minutes=random.randint(5, 180) * (i + 1))
        posts.append({
            "x_post_id": post_id,
            "text": t["text"],
            "created_at": created_time.isoformat() + "Z",
            "post_url": f"https://x.com/{t['username']}/status/{post_id}",
            "lang": "en",
            "conversation_id": post_id,
            "metrics": {
                "like_count": t["likes"] + random.randint(0, 50),
                "repost_count": t["reposts"] + random.randint(0, 20),
                "reply_count": t["replies"] + random.randint(0, 10),
                "quote_count": random.randint(2, 25),
                "impression_count": t["likes"] * random.randint(15, 30)
            }
        })
    return posts

def generate_random_live_post(username: str = None) -> Dict[str, Any]:
    """Generates a freshly published post for real-time live feed demonstration."""
    sample = random.choice(SIMULATED_TWEET_POOL)
    target_user = username or sample["username"]
    post_id = f"18{random.randint(10000000, 99999999)}"
    now = datetime.datetime.utcnow()

    return {
        "x_post_id": post_id,
        "username": target_user,
        "text": sample["text"],
        "created_at": now.isoformat() + "Z",
        "post_url": f"https://x.com/{target_user}/status/{post_id}",
        "lang": "en",
        "conversation_id": post_id,
        "metrics": {
            "like_count": random.randint(20, 300),
            "repost_count": random.randint(5, 50),
            "reply_count": random.randint(2, 25),
            "quote_count": random.randint(1, 10),
            "impression_count": random.randint(500, 5000)
        }
    }

