"""
FinPulse Unified Financial NLP Pipeline
Orchestrates:
1. Sentiment Analysis (FinBERT / rule-based fallback)
2. Financial Entity Extraction (NSE/BSE equities, indices, sectors, commodities, RBI, macro)
3. Topic Classification (14 categories)
4. Financial Event Detection (Earnings, dividends, rate decisions, regulatory, etc.)
5. Market Impact Classification (Bullish, Bearish, Neutral, Unclear; opinion vs fact)
6. Structured AI Summarization (summary, arguments, risks/opportunities, evidence)
"""

import logging
from typing import Dict, Any

from app.nlp.sentiment import sentiment_analyzer
from app.nlp.entity_extractor import entity_extractor
from app.nlp.topic_classifier import topic_classifier
from app.nlp.event_detector import event_detector
from app.nlp.market_impact import market_impact_classifier
from app.nlp.summarizer import financial_summarizer

logger = logging.getLogger(__name__)

class FinancialNLPPipeline:
    def process_post(self, text: str) -> Dict[str, Any]:
        """
        Executes full financial intelligence pipeline on a post.
        Returns complete analysis payload.
        """
        try:
            # 1. Entity Extraction
            entities = entity_extractor.extract_entities(text)

            # 2. Financial Sentiment Analysis
            sentiment_result = sentiment_analyzer.analyze(text)
            sentiment = sentiment_result["sentiment"]
            sentiment_score = sentiment_result["sentiment_score"]
            sentiment_breakdown = sentiment_result["sentiment_breakdown"]

            # 3. Topic Classification
            topic, secondary_topics = topic_classifier.classify(text)

            # 4. Event Detection
            event_type, event_details = event_detector.detect_event(text)

            # 5. Market Impact Classification
            impact_result = market_impact_classifier.classify(
                text=text,
                sentiment=sentiment,
                entities=entities,
                event_type=event_type
            )

            # 6. Structured Summarization
            summary_result = financial_summarizer.summarize(
                text=text,
                entities=entities,
                topic=topic,
                sentiment=sentiment,
                event_type=event_type
            )

            return {
                "sentiment": sentiment,
                "sentiment_score": sentiment_score,
                "sentiment_breakdown": sentiment_breakdown,
                "topic": topic,
                "secondary_topics": secondary_topics,
                "event_type": event_type,
                "event_details": event_details,
                "market_impact": impact_result["market_impact"],
                "market_impact_reasoning": impact_result["market_impact_reasoning"],
                "is_opinion": impact_result["is_opinion"],
                "creator_opinion_summary": impact_result["creator_opinion_summary"],
                "summary": summary_result["summary"],
                "main_arguments": summary_result["main_arguments"],
                "risks_and_opportunities": summary_result["risks_and_opportunities"],
                "supporting_evidence": summary_result["supporting_evidence"],
                "entities": entities,
                "model_version": "FinPulse-NLP-v1",
                "is_error": False,
                "error_message": None
            }

        except Exception as e:
            logger.error(f"Error processing post through NLP pipeline: {e}", exc_info=True)
            return {
                "sentiment": "Neutral",
                "sentiment_score": 0.0,
                "sentiment_breakdown": {"positive": 0.33, "negative": 0.33, "neutral": 0.34},
                "topic": "Other financial topics",
                "secondary_topics": [],
                "event_type": None,
                "event_details": None,
                "market_impact": "Unclear",
                "market_impact_reasoning": "Pipeline processing encountered a recoverable exception.",
                "is_opinion": True,
                "creator_opinion_summary": "Unclassified",
                "summary": text[:200],
                "main_arguments": [text[:100]],
                "risks_and_opportunities": {"risks": [], "opportunities": []},
                "supporting_evidence": "None",
                "entities": [],
                "model_version": "FinPulse-NLP-v1",
                "is_error": True,
                "error_message": str(e)
            }

nlp_pipeline = FinancialNLPPipeline()

