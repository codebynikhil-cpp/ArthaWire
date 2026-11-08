"""
FinPulse Financial Sentiment Analysis Module
Supports:
- Local FinBERT (ProsusAI/finbert via Hugging Face Transformers)
- High-precision finance-domain rule & lexicon fallback
- 4 sentiment classes: Positive, Negative, Neutral, Mixed
"""

import re
import logging
from typing import Dict, Any, Tuple
from app.config import settings

logger = logging.getLogger(__name__)

# Finance-specific positive and negative lexicons for Indian and global financial markets
FIN_POSITIVE_WORDS = {
    "surge", "surged", "rally", "rallied", "bullish", "outperform", "outperformed",
    "profit", "profitable", "growth", "growing", "beat", "beats", "beating",
    "expansion", "expanding", "dividend", "upgraded", "upgrade", "multibagger",
    "breakout", "accumulate", "buyback", "record high", "all-time high", "ath",
    "turnaround", "cash flow", "robust", "strong", "higher margin", "guidance raised",
    "rate cut", "capex", "order win", "credit growth", "npa dropped", "npa declining",
    "synergy", "moat", "rebounding", "headroom", "tailwinds", "promoter buying"
}

FIN_NEGATIVE_WORDS = {
    "plunge", "plunged", "crash", "crashed", "bearish", "underperform", "underperformed",
    "loss", "losses", "missed", "miss", "slump", "slumped", "downgraded", "downgrade",
    "headwinds", "inflationary", "inflation spike", "rate hike", "debt", "leverage",
    "default", "scam", "fraud", "investigation", "sebi order", "notice", "sanction",
    "margin contraction", "margin pressure", "guidance cut", "fall", "falling",
    "drastic", "warning", "caution", "promoter selling", "pledged shares", "bad loan",
    "npa spike", "slowdown", "weakness", "bear market", "correction", "selloff"
}

class FinancialSentimentAnalyzer:
    def __init__(self, use_transformers: bool = False, model_name: str = "ProsusAI/finbert"):
        self.use_transformers = use_transformers or settings.USE_FINBERT_TRANSFORMERS
        self.model_name = model_name
        self.pipeline = None
        self._initialized = False

    def initialize_model(self):
        """Attempts to load local FinBERT if cached or configured, otherwise uses fast financial rule engine."""
        if self._initialized:
            return

        # Attempt to load local cached model first without hanging on network
        if self.use_transformers:
            try:
                from transformers import pipeline
                # Try local files first to prevent hanging on remote downloads
                try:
                    self.pipeline = pipeline("sentiment-analysis", model=self.model_name, local_files_only=True, top_k=None)
                    logger.info("FinBERT successfully loaded from local cache.")
                except Exception:
                    logger.info("Local FinBERT cache not present. High-precision financial NLP engine active.")
                    self.pipeline = None
            except Exception as e:
                logger.warning(f"Could not initialize transformer pipeline ({e}). Using financial NLP engine.")
                self.pipeline = None

        self._initialized = True

    def _rule_based_sentiment(self, text: str) -> Tuple[str, float, Dict[str, float]]:
        """High-precision finance-domain rule-based analyzer with Mixed detection."""
        text_lower = text.lower()
        words = set(re.findall(r"\b[a-z]{3,}\b", text_lower))

        pos_matches = words.intersection(FIN_POSITIVE_WORDS)
        neg_matches = words.intersection(FIN_NEGATIVE_WORDS)

        # Count occurrences for weighted intensity
        pos_score = sum(text_lower.count(w) for w in pos_matches)
        neg_score = sum(text_lower.count(w) for w in neg_matches)

        # Additional regex patterns for financial metrics
        if re.search(r"(\+\d+(\.\d+)?%|up \d+%|grew \d+%|profit up)", text_lower):
            pos_score += 2
        if re.search(r"(-\d+(\.\d+)?%|down \d+%|dropped \d+%|loss of \d+|profit down)", text_lower):
            neg_score += 2

        total = pos_score + neg_score
        
        # Check for mixed sentiment (both strong bullish and bearish factors present)
        if pos_score >= 2 and neg_score >= 2:
            sentiment = "Mixed"
            score = 0.55
            pos_prob = round(pos_score / (total + 1), 2)
            neg_prob = round(neg_score / (total + 1), 2)
            neu_prob = round(max(0.0, 1.0 - pos_prob - neg_prob), 2)
            return sentiment, score, {"positive": pos_prob, "negative": neg_prob, "neutral": neu_prob}

        if total == 0:
            return "Neutral", 0.0, {"positive": 0.15, "negative": 0.15, "neutral": 0.70}

        if pos_score > neg_score:
            prob = min(0.95, round(pos_score / (total + 0.5), 2))
            return "Positive", prob, {"positive": prob, "negative": round((1 - prob) * 0.4, 2), "neutral": round((1 - prob) * 0.6, 2)}
        elif neg_score > pos_score:
            prob = min(0.95, round(neg_score / (total + 0.5), 2))
            return "Negative", prob, {"positive": round((1 - prob) * 0.4, 2), "negative": prob, "neutral": round((1 - prob) * 0.6, 2)}
        else:
            return "Mixed", 0.5, {"positive": 0.40, "negative": 0.40, "neutral": 0.20}

    def analyze(self, text: str) -> Dict[str, Any]:
        """
        Analyze financial sentiment of post text.
        Returns:
            - sentiment: Positive | Negative | Neutral | Mixed
            - sentiment_score: float (0.0 to 1.0)
            - sentiment_breakdown: {"positive": float, "negative": float, "neutral": float}
        """
        self.initialize_model()

        if self.pipeline:
            try:
                truncated = text[:1000]
                results = self.pipeline(truncated)[0]
                scores = {item['label'].lower(): round(item['score'], 3) for item in results}
                
                pos = scores.get('positive', 0.0)
                neg = scores.get('negative', 0.0)
                neu = scores.get('neutral', 0.0)

                if pos > 0.35 and neg > 0.35:
                    sentiment = "Mixed"
                    score = max(pos, neg)
                elif pos >= neg and pos >= neu:
                    sentiment = "Positive"
                    score = pos
                elif neg >= pos and neg >= neu:
                    sentiment = "Negative"
                    score = neg
                else:
                    sentiment = "Neutral"
                    score = neu

                return {
                    "sentiment": sentiment,
                    "sentiment_score": score,
                    "sentiment_breakdown": {
                        "positive": pos,
                        "negative": neg,
                        "neutral": neu
                    }
                }
            except Exception as e:
                logger.warning(f"Error running FinBERT pipeline ({e}). Using rule engine.")

        sentiment, score, breakdown = self._rule_based_sentiment(text)
        return {
            "sentiment": sentiment,
            "sentiment_score": score,
            "sentiment_breakdown": breakdown
        }

# Global singleton analyzer
sentiment_analyzer = FinancialSentimentAnalyzer()
