# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Individual Indian stock market investors, equities researchers, financial analysts, and market observers monitoring public commentary from prominent financial creators across X (formerly Twitter) regarding Dalal Street developments (NSE/BSE).

## Product Purpose

ArthaWire is an institutional-grade personal financial intelligence and market research platform. It continuously tracks up to 10 selected Indian financial creators, automatically extracts their newly published public posts via the official X API v2, processes the unstructured text through local financial NLP models (FinBERT), and delivers actionable, traceable market intelligence on a real-time analytics terminal.

Success means eliminating the noise and manual effort of checking social media for market commentary, converting scattered discussions into structured sentiment, detecting corporate events, and identifying emerging multi-creator consensus or divergence.

## Positioning

Unlike generic social media monitors or automated trading bots, ArthaWire functions strictly as an analytical research instrument. It never fabricates prices, never executes trades, maintains strict provenance linking every AI briefing to its original X post, and visually segregates subjective creator opinions from verified empirical corporate announcements.

## Operating Context

- **Market Focus:** Indian Financial Markets (National Stock Exchange - NSE, Bombay Stock Exchange - BSE).
- **Surveillance Cohort:** Fewer than 10 curated financial creators with active public market commentary.
- **Data Ingestion:** Official X API v2 (incremental `since_id` timeline polling with checkpoint persistence, APScheduler 15m intervals, with fallback Sandbox Simulation).
- **AI/NLP Processing:** Local ProsusAI/FinBERT transformer for domain sentiment, 14-category financial topic classification, Indian company/ticker entity mapping, event detection, and multi-creator consensus clustering.
- **Usage Environment:** Desktop and tablet research terminal during and after Dalal Street market trading hours (9:15 AM - 3:30 PM IST).

## Capabilities and Constraints

- **Creator Management:** Enlist and pause monitoring for up to 10 creators; store X user IDs, handles, followers, and profile metadata.
- **Incremental Retrieval & Deduplication:** Avoid duplicate processing via relational unique constraints and `since_id` checkpoints.
- **Financial NLP Pipeline:**
  - Sentiment Analysis: Positive, Negative, Neutral, Mixed via FinBERT.
  - Entity Extraction: Indian listed companies, stock symbols (`$RELIANCE`, `$TCS`, `$HDFCBANK`), market indices (NIFTY 50, SENSEX), sectors, and macroeconomic indicators.
  - Topic Classification: 14 domain categories (Company earnings, RBI monetary policy, IPOs, Banking & finance, Inflation, Macroeconomics, etc.).
  - Event Detection: Earnings releases, RBI announcements, corporate actions.
  - Market Impact: Potentially bullish, Potentially bearish, Neutral, Unclear.
  - AI Dossier: Executive summaries, key arguments, risks vs. opportunities, empirical figures.
  - Multi-Creator Consensus Engine: Clusters related commentary across multiple creators within a 72-hour rolling window.
- **Real-Time Surveillance Desk:** Next.js 15 dashboard streaming updates over persistent WebSockets (`/ws`) without page reloads.
- **Cost Constraints:** High-efficiency architecture utilizing local open-source models, zero external proprietary LLM spend, and configurable polling rates to respect X API Free/Basic tier billing limits.

## Brand Commitments

- **Name:** FinPulse — Real-Time X-Based Financial Intelligence Platform.
- **Aesthetic Direction:** Institutional financial research terminal (Bloomberg Terminal, TradingView, Linear, Stripe Dashboard).
- **Tone:** Analytical, precise, objective, authoritative, restrained. No hype, no clickbait.
- **Disclaimer:** Prominently communicates that AI analysis does not constitute SEBI investment advice.

## Evidence on Hand

- Database schema persisted with SQLite (`finpulse.db`) & SQLAlchemy 2 models.
- Seed data for 10 verified Indian financial creators and Dalal Street market entities.
- Tested NLP pipeline covering sentiment, topics, entities, event detection, and multi-creator consensus.
- Working WebSocket broadcaster (`/ws`) and incremental timeline checkpointer.

## Product Principles

1. **Information Density with Analytical Clarity:** Maximize scanability and metric hierarchy; every pixel serves analytical comprehension.
2. **Strict Provenance & Source Traceability:** Every synthetic AI metric or insight must maintain an unbroken link to its original X post.
3. **Opinion vs. Fact Separation:** Clearly demarcate personal creator hypotheses from verified corporate disclosures or RBI policy facts.
4. **Operational Real-Time Awareness:** Real-time WebSocket connection state and data freshness must be accurately communicated without false "LIVE" claims.
5. **Cost & Rate Governance:** Local models and smart checkpointing prevent API waste and unnecessary infrastructure expense.

## Accessibility & Inclusion

- WCAG 2.1 AA compliant contrast across dark charcoal surfaces (`#090D14`, `#111927`).
- Full keyboard navigation, semantic HTML landmarks (`<header>`, `<aside>`, `<main>`, `<article>`), and visible focus rings.
- Tabular figures (`tabular-nums`) ensuring numerical alignment across tickers and statistics.
- Text labels accompanying all semantic color indicators (never rely on color alone).

