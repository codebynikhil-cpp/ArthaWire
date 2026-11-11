---
name: ArthaWire
description: Institutional Financial Intelligence & Dalal Street Surveillance Terminal
colors:
  primary: "#38BDF8"
  primary-hover: "#0284C7"
  neutral-bg: "#090D14"
  neutral-secondary: "#0E1420"
  neutral-elevated: "#141C29"
  surface-card: "#111927"
  surface-hover: "#192436"
  surface-elevated: "#1B2637"
  border-subtle: "rgba(148, 163, 184, 0.12)"
  border-default: "rgba(148, 163, 184, 0.20)"
  text-primary: "#F1F5F9"
  text-secondary: "#A0AEC0"
  text-muted: "#64748B"
  positive: "#22C55E"
  negative: "#EF4444"
  neutral: "#94A3B8"
  warning: "#F59E0B"
  info: "#38BDF8"
typography:
  display:
    fontFamily: "var(--font-geist-mono), JetBrains Mono, monospace"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "var(--font-geist-sans), Inter, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  title:
    fontFamily: "var(--font-geist-sans), Inter, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0em"
  body:
    fontFamily: "var(--font-geist-sans), Inter, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
  mono:
    fontFamily: "var(--font-geist-mono), JetBrains Mono, monospace"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.02em"
  label:
    fontFamily: "var(--font-geist-mono), JetBrains Mono, monospace"
    fontSize: "0.625rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.05em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.sm}"
    padding: "6px 14px"
  stat-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "16px"
  post-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "16px"
---

## Overview

ArthaWire's visual identity embodies the discipline, restraint, and information density of high-tier institutional investment research terminals (Bloomberg Terminal, TradingView, Linear, Stripe Dashboard).

The design prioritizes analytical scanability over consumer-grade decoration. High-contrast financial typography, muted midnight surfaces, hairline slate borders, and strict semantic color discipline ensure market researchers can ingest complex Dalal Street intelligence at high velocity.

## Colors

### Surface Hierarchy
- **Base Background (`#090D14`):** Deep charcoal canvas providing maximum contrast for financial data.
- **Secondary Surface (`#0E1420`):** Persistent shell backdrop for top navigation and intelligence sidebar.
- **Elevated Canvas (`#141C29`):** Card interiors, modal overlays, and structured module groupings.
- **Card Surface (`#111927`):** Primary interactive cards, feed items, and analytics containers.
- **Hover Surface (`#192436`):** Precise interactive hover state.

### Border Standards
- **Subtle Hairline (`rgba(148, 163, 184, 0.12)`):** Default divider separating cards and data rows.
- **Active / Accent Border (`rgba(148, 163, 184, 0.22)`):** Card hover, active tabs, and focused inputs.

### Financial Semantic Palette
Colors carry strict financial meaning and are never used as generic decoration:
- **Positive / Bullish (`#22C55E`):** Upward momentum, bullish sentiment, successful daemon state.
- **Negative / Bearish (`#EF4444`):** Downward sentiment, bearish impact, critical alerts, rate limit thresholds.
- **Neutral / Factual (`#94A3B8`):** Empirical disclosures, quarterly reports, corporate announcements.
- **Warning / Mixed (`#F59E0B`):** Multi-creator opinion divergence, discussion spikes, caution flags.
- **Information / Telemetry (`#38BDF8`):** X API v2 telemetry, AI consensus clusters, navigational emphasis.

## Typography

ArthaWire employs a dual-font system pairing geometric clarity with monospace precision:
- **Primary Interface:** `Geist Sans` / `Inter` (`11px` to `14px`) for narrative body, creator bios, and analytical summaries.
- **Financial Monospace:** `Geist Mono` / `JetBrains Mono` for stock tickers (`$RELIANCE`), tabular metrics, timestamps, and model version tags.

### Tabular Numerals
All stock prices, mention counts, percentages, and timestamps must use `tabular-nums` to guarantee vertical column alignment across dense leaderboards.

## Layout

- **Persistent Navigation Shell:** Top navigation (`h-14`) combined with a collapsible fixed sidebar (`w-64`) and an analytical workspace (`overflow-y-auto`).
- **4px / 8px Spatial Grid:** Internal card spacing `8px-12px`, component padding `16px`, section gaps `20px-24px`.
- **Responsive Breakpoints:**
  - `Mobile (< 768px):` Single-column feed, slide-out drawer navigation, stacked metric cards.
  - `Tablet (768px - 1024px):` 2-column metrics grid, persistent compact sidebar.
  - `Desktop (1024px+):` Full multi-column analytical dashboard (Stat cards 4-col, Triad grid 3-col).

## Elevation & Depth

ArthaWire favors **tonal elevation over heavy drop shadows**:
- Surfaces rise in lightness as they approach the user (`#090D14` → `#0E1420` → `#111927` → `#1B2637`).
- Shadows are restrained (`box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4)`).
- Hairline borders (`border-fin-border`) provide crisp boundary separation without blurry glow effects.

## Shapes

- **Base Radius:** `4px` (`rounded`) for buttons, badges, and input elements for an instrument-like feel.
- **Card Radius:** `8px` (`rounded-lg`) for primary content modules, post cards, and analytics panels.
- **Modal Radius:** `12px` (`rounded-xl`) for dialogs and detail dossiers.

## Components

### 1. Surveillance Post Card
- Creator avatar, verified handle, and relative timestamp.
- Direct link to original X post with provenance preservation.
- Extracted company tickers (`$SYMBOL`) formatted as interactive filter pills.
- Collapsible AI Financial Intelligence Dossier separating facts from creator opinions.
- Monospace engagement metrics (likes, reposts, replies).

### 2. Market Ticker Leaderboard
- Monospace ticker codes with exchange indicators (`NSE/BSE`).
- Stacked proportional sentiment bars (emerald, rose, amber, slate).
- One-click filter feed actions.

### 3. AI Consensus Card
- Aggregates multi-creator discussions within rolling 72-hour windows.
- Dual-column breakdown: Overlapping consensus arguments vs. Contrarian stances.
- Direct source links to each creator's post.

### 4. Interactive Cost Modeler
- Real-time simulation of X API v2 billing limits (Free, Basic, Pro).
- Interactive sliders for creator volume, polling frequency, and tweet velocity.

## Do's and Don'ts

### Do
- Always display text labels alongside color badges (e.g. `[+ Bullish]` not just a green dot).
- Preserve links to original X posts on every AI-generated insight.
- Use tabular monospace numerals for all counts, timestamps, and ticker symbols.
- Clearly identify simulated sandbox data versus official live X API v2 data.

### Don't
- Never use bright neon gradients, rainbow cards, or decorative glassmorphism.
- Never use red or green for non-financial elements (e.g. do not use green for standard success buttons).
- Never hide or omit source attribution on AI briefings.
- Never let long ticker names cause layout shifts or horizontal scrollbars.

