# ArthaWire — Real-Time X-Based Financial Intelligence Platform

> **Dalal Street Financial Research & Intelligence Assistant (NSE/BSE Focus)**  
> Transforms scattered commentary across curated Indian financial creators on X (formerly Twitter) into structured, searchable, and continuously updated market intelligence.

---

## 1. Project Overview & Philosophy

**ArthaWire** is a specialized financial intelligence platform designed for investors, equity analysts, and financial researchers tracking the Indian stock market (NSE/BSE).

Instead of drowning in noisy social feeds or relying on automated trading black boxes, ArthaWire continuously monitors up to 10 selected financial creators, automatically extracts their newly published posts via the official X API v2, processes the text through an AI/NLP pipeline (FinBERT, Indian listed equity & ticker mapping, 14-topic classification, event detection, opinion vs. fact separation, and structured summarization), and surfaces actionable intelligence on a real-time dark financial research terminal.

> [!IMPORTANT]
> **Research Platform Disclaimer:**  
> ArthaWire is built strictly as a personal research and intelligence platform. It does not provide automated trading, robo-advisory, or verified stock recommendations. Every AI-generated insight clearly separates creator subjective opinions from verified corporate disclosures and links directly to its original X post.

---

## 2. Technical Architecture

```
                    ┌────────────────────────────────────────────────────────┐
                    │               Official X (Twitter) API v2              │
                    │      (User Timeline / Recent Search / since_id)        │
                    └───────────────────────────┬────────────────────────────┘
                                                │ Polling & Ingestion
                                                ▼
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│                               ArthaWire Backend (FastAPI)                                  │
│                                                                                            │
│  ┌───────────────────────┐   ┌─────────────────────────────┐   ┌────────────────────────┐  │
│  │   APScheduler Engine  │──▶│   Checkpointer & Dedup      │──▶│  SQLAlchemy Relational │  │
│  │ (15m recurring poll)  │   │  (since_id, unique post_id) │   │ (SQLite / PostgreSQL)  │  │
│  └───────────────────────┘   └──────────────┬──────────────┘   └────────────────────────┘  │
│                                             │                                              │
│                                             ▼                                              │
│  ┌──────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                    Financial NLP Intelligence Pipeline                               │  │
│  │  • FinBERT Sentiment (Positive / Negative / Neutral / Mixed)                         │  │
│  │  • Indian Market Entity Extractor (Equities, Indices, Sectors, RBI, Macro)           │  │
│  │  • 14 Financial Topics Classification                                                │  │
│  │  • Corporate & Regulatory Event Detector (Earnings, Dividends, Repo Rate, Notices)  │  │
│  │  • Market Impact Classifier (Bullish / Bearish / Neutral / Unclear; Opinion vs Fact) │  │
│  │  • Structured Summarizer (Summary, Core Arguments, Risks/Opportunities, Evidence)   │  │
│  │  • Cross-Creator Consensus Engine (Clusters multi-creator discussions & divergence)  │  │
│  └──────────────────────────────────────────┬───────────────────────────────────────────┘  │
│                                             │                                              │
│                                             ▼                                              │
│  ┌────────────────────────┐   ┌─────────────────────────────┐   ┌────────────────────────┐  │
│  │ Alert Rule Evaluator   │   │ WebSockets Broadcaster      │   │ REST API V1 Routers    │  │
│  │ (Entities, RBI, Spikes)│──▶│ (NEW_POST, NEW_ALERT, SYNC) │──▶│ (Feed, Analytics, etc.)│  │
│  └────────────────────────┘   └─────────────┬───────────────┘   └───────────┬────────────┘  │
└─────────────────────────────────────────────┼───────────────────────────────┼──────────────┘
                                              │                               │
                                    WebSockets Stream                 HTTP REST
                                              │                               │
                                              ▼                               ▼
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│                          ArthaWire Frontend (Next.js 15 + React 19)                        │
│                                                                                            │
│  • Overview Dashboard (Real-time metrics, Sentiment Donut, Trending Topics, Recent Events)  │
│  • Live Feed (Instant post streaming, entity pills, sentiment badges, AI briefings)        │
│  • Creator Analytics (Posting frequency, sentiment breakdown, top discussed equities)       │
│  • Market Intelligence (NSE/BSE Ticker Leaderboard, Sector Breakdown, Volume Spikes)      │
│  • AI Consensus Insights (Multi-creator consensus, common arguments, divergent opinions)   │
│  • Alert Rule Manager & Live Notifications Drawer                                          │
│  • Ingestion Status & Operational X API Cost Calculator                                    │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Core Modules & Capabilities

### A. Creator Monitoring
- Monitor up to 10 curated financial creators simultaneously.
- Track metadata: X user IDs, handles, display names, profile avatars, and follower counts.
- Toggle individual creator activation (`is_active` monitoring switch).
- Track checkpoints (`since_id`) and last polled timestamps.

### B. Reliable Ingestion & X API v2 Integration
- Incremental retrieval using `since_id` to never retrieve duplicate posts.
- Duplicate prevention via database unique constraints on `x_post_id`.
- Rate limit headers monitoring (`x-rate-limit-remaining`, `x-rate-limit-reset`).
- Full simulation sandbox mode included for immediate out-of-the-box development and testing without burning X API credits.

### C. Financial Intelligence Pipeline
1. **Financial Sentiment Analysis**: FinBERT model support (`ProsusAI/finbert`) with an Indian financial market lexicon & heuristics fallback. Accurately flags `Positive`, `Negative`, `Neutral`, and `Mixed` sentiments with confidence probabilities.
2. **Indian Market Entity Extraction**: Comprehensive dictionary and regex alias matching for Indian equities (RELIANCE, TCS, HDFCBANK, INFY, TATAMOTORS, etc.), indices (NIFTY 50, SENSEX, BANKNIFTY), sectors (Banking, IT, Auto, FMCG, Energy), commodities (Gold, Crude Oil, Silver), currencies (USDINR), and regulators (RBI, MPC, SEBI, CPI Inflation).
3. **14 Topic Classifications**:
   - Indian stock market, Company earnings, Banking and finance, RBI monetary policy, Inflation, Interest rates, IPOs, Mergers and acquisitions, Corporate announcements, Macroeconomics, Global markets, Geopolitical developments, Commodities, Other financial topics.
4. **Event Detection**: Identifies quarterly earnings, capital return (dividends/buybacks/bonus), RBI repo rate decisions, regulatory notices/SEBI orders, executive changes, and large capex contract awards.
5. **Market Impact Classification**: Classes posts as *Potentially bullish*, *Potentially bearish*, *Neutral*, or *Unclear*, strictly separating creator subjective opinions from verified corporate disclosures.
6. **Structured Summarization**: Generates concise executive summaries, main financial arguments, key risks & opportunities, and supporting empirical figures.
7. **Consensus & Divergence Engine**: Detects when 2 or more distinct creators discuss the same stock or theme within a given time window (e.g. 24–72 hours), aggregates consensus sentiment, highlights common arguments, isolates divergent stances, and links to all source posts.

### D. Operational Cost & Consumption Calculator
Built-in financial model that calculates monthly X API requests and compares official tiers:
- **Free Tier ($0/mo)**: 100 reads/mo — strictly for write testing.
- **Basic Tier ($100/mo)**: 10,000 reads/mo — viable for 10 creators at 30-60 min intervals.
- **Pro Tier ($5,000/mo)**: 1,000,000 reads/mo — commercial real-time filtered stream.
- **ArthaWire Simulation Mode ($0/mo)**: Zero operational cost for personal research and testing.

---

## 4. Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm

### Backend Setup

```bash
cd backend

# (Optional) Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate # On Windows (or source venv/bin/activate on Linux/Mac)

# Install dependencies
pip install -r requirements.txt

# Start backend server
python run.py
```

The FastAPI backend will start on **`http://localhost:8000`**:
- Swagger API Docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`
- WebSocket stream: `ws://localhost:8000/ws`

### Frontend Setup

```bash
cd frontend

# Install dependencies (already prepared)
npm install --legacy-peer-deps

# Start Next.js development server
npm run dev
```

The frontend dashboard will be live on **`http://localhost:3000`**.

---

## 5. Verification & Testing

The backend includes a comprehensive pytest suite covering the NLP pipeline, entity extractor, consensus engine, and API routes:

```bash
# Run backend test suite
$env:PYTHONPATH="backend"; pytest backend/tests -v
```

Output:
```
backend/tests/test_api.py::test_health_and_root PASSED                   [  7%]
backend/tests/test_api.py::test_creators_endpoints PASSED                [ 15%]
backend/tests/test_api.py::test_posts_feed_endpoint PASSED               [ 23%]
backend/tests/test_api.py::test_analytics_overview PASSED                [ 30%]
backend/tests/test_api.py::test_market_intelligence PASSED               [ 38%]
backend/tests/test_api.py::test_insights_consensus PASSED                [ 46%]
backend/tests/test_api.py::test_alert_rules PASSED                       [ 53%]
backend/tests/test_api.py::test_cost_estimates PASSED                    [ 61%]
backend/tests/test_consensus.py::test_multi_creator_consensus_detection PASSED [ 69%]
backend/tests/test_nlp_pipeline.py::test_nlp_positive_earnings_and_entities PASSED [ 76%]
backend/tests/test_nlp_pipeline.py::test_nlp_mixed_sentiment PASSED      [ 84%]
backend/tests/test_nlp_pipeline.py::test_nlp_rbi_monetary_policy PASSED  [ 92%]
backend/tests/test_nlp_pipeline.py::test_nlp_event_detection_dividend PASSED [100%]
====================== 13 passed in 25s =======================
```

To build and verify the Next.js production frontend:

```bash
cd frontend
npm run build
```

---

## 6. Docker Deployment

Deploy full stack locally with a single command:

```bash
docker-compose up --build
```

---

## 7. License & Compliance
This software is provided for personal financial research. All data retrieval respects X Developer Policies, rate limits, and non-redistribution requirements.

