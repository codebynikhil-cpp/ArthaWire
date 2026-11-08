"""
FinPulse Market Impact Classification Module
Classifies market impact into:
- Potentially bullish
- Potentially bearish
- Neutral
- Unclear
Strictly distinguishes creator subjective thesis/opinion from verified corporate disclosures.
"""

import re
from typing import Dict, Any, List

OPINION_INDICATORS = [
    r"\b(i think|in my view|looks like|imo|imho|my take|personal view|might be|could see|expecting|feeling|seems to me|target price|fair value)\b",
    r"\b(overvalued|undervalued|cheap|expensive|bubble|time to buy|time to sell|accumulate on dips|stay away)\b"
]

OFFICIAL_INDICATORS = [
    r"\b(exchange filing|bse disclosure|nse circular|press release|audited results|official announcement|statutory filing|rbi circular)\b"
]

class MarketImpactClassifier:
    def __init__(self):
        self.opinion_regex = [re.compile(p, re.IGNORECASE) for p in OPINION_INDICATORS]
        self.official_regex = [re.compile(p, re.IGNORECASE) for p in OFFICIAL_INDICATORS]

    def classify(
        self,
        text: str,
        sentiment: str,
        entities: List[Dict[str, Any]],
        event_type: str = None
    ) -> Dict[str, Any]:
        """
        Computes market impact with clear separation of opinion vs official announcement.
        """
        text_lower = text.lower()
        
        # Check if text is creator opinion
        opinion_matches = sum(len(r.findall(text_lower)) for r in self.opinion_regex)
        official_matches = sum(len(r.findall(text_lower)) for r in self.official_regex)
        
        is_opinion = opinion_matches >= official_matches

        # Determine Market Impact
        entity_names = [e["name"] for e in entities[:2]]
        entities_str = ", ".join(entity_names) if entity_names else "the broader market"

        if sentiment == "Positive":
            market_impact = "Potentially bullish"
            if event_type:
                reasoning = f"Positive event detected ({event_type}) indicating operational or financial expansion for {entities_str}."
            else:
                reasoning = f"Constructive creator commentary highlighting financial strength, margin growth or valuation upside for {entities_str}."
        elif sentiment == "Negative":
            market_impact = "Potentially bearish"
            if event_type:
                reasoning = f"Adverse event or metric detected ({event_type}) suggesting potential margin, governance or regulatory pressure on {entities_str}."
            else:
                reasoning = f"Cautionary creator commentary noting valuation risks, competitive headwinds or earnings deceleration for {entities_str}."
        elif sentiment == "Mixed":
            market_impact = "Unclear"
            reasoning = f"Conflicting operational signals (e.g. revenue growth offset by margin compression or macro headwinds) for {entities_str}; net market direction remains uncertain."
        else:
            market_impact = "Neutral"
            reasoning = f"Informational or balanced discussion regarding {entities_str} without directional market conviction."

        opinion_desc = (
            "Subjective creator thesis / personal commentary"
            if is_opinion
            else "Factual reporting / reference to corporate filing"
        )

        return {
            "market_impact": market_impact,
            "market_impact_reasoning": reasoning,
            "is_opinion": is_opinion,
            "creator_opinion_summary": opinion_desc
        }

# Global market impact classifier singleton
market_impact_classifier = MarketImpactClassifier()

