"""
FinPulse Financial Topic Classification Module
Categorizes financial posts into 14 core Indian & macro market topics.
"""

import re
from typing import List, Dict, Any, Tuple

TOPIC_RULES = {
    "Company earnings": [
        r"\b(q[1-4]|quarterly|earnings|results|ebitda|pat|profit after tax|revenue|net profit|operating profit|topline|bottomline|concall|guidance|margins)\b",
        r"\b(beat estimates|missed estimates|q-o-q|y-o-y|financial results)\b"
    ],
    "RBI monetary policy": [
        r"\b(rbi|reserve bank|mpc|monetary policy|repo rate|reverse repo|shaktikanta|mint street|liquidity|crr|slr)\b"
    ],
    "Inflation": [
        r"\b(inflation|cpi|retail inflation|wpi|wholesale price|food inflation|price pressures|cost of living)\b"
    ],
    "Interest rates": [
        r"\b(interest rate|rate cut|rate hike|yield|bond yields|10-year yield|borrowing cost|fixed deposit|fd rate|terminal rate)\b"
    ],
    "Banking and finance": [
        r"\b(npa|bad loans|credit growth|deposit growth|nbfc|private banks|psu banks|hdfc|icici|sbi|kotak|axis|fintech|casa ratio|net interest margin|nim)\b"
    ],
    "IPOs": [
        r"\b(ipo|initial public offer|listing|grey market premium|gmp|subscribed|issue price|fresh issue|of offer for sale|ofs|drhp|listing day)\b"
    ],
    "Mergers and acquisitions": [
        r"\b(merger|acquisition|takeover|m&a|stake sale|buyout|de-merger|amalgamation|consolidation|joint venture)\b"
    ],
    "Corporate announcements": [
        r"\b(dividend|bonus shares|stock split|buyback|capex|order win|contract awarded|ceo resignation|board meeting|management change|promoter pledge)\b"
    ],
    "Indian stock market": [
        r"\b(nifty|sensex|dalal street|nse|bse|fii|dii|institutional flows|bull run|bear market|rally|correction|smallcap|midcap|largecap|indices|options|derivatives)\b"
    ],
    "Macroeconomics": [
        r"\b(gdp|cad|current account deficit|fiscal deficit|forex reserves|trade deficit|iip|manufacturing pmi|economic growth|macro)\b"
    ],
    "Commodities": [
        r"\b(crude oil|brent|wti|gold|silver|metals|copper|natural gas|opec|mcx|bullion|commodities)\b"
    ],
    "Global markets": [
        r"\b(federal reserve|fed|jerome powell|nasdaq|s&p 500|dow jones|wall street|us treasury|dollar index|dxy|nikkei|hang seng|european markets)\b"
    ],
    "Geopolitical developments": [
        r"\b(geopolitical|tariff|trade war|sanctions|middle east|conflict|taiwan|red sea|shipping routes|export ban)\b"
    ]
}

class FinancialTopicClassifier:
    def __init__(self):
        self.compiled_rules = {
            topic: [re.compile(p, re.IGNORECASE) for p in patterns]
            for topic, patterns in TOPIC_RULES.items()
        }

    def classify(self, text: str) -> Tuple[str, List[str]]:
        """
        Classifies post into primary topic and secondary topics.
        Returns: (primary_topic, [secondary_topics])
        """
        topic_scores: Dict[str, int] = {}

        for topic, regexes in self.compiled_rules.items():
            matches = 0
            for r in regexes:
                matches += len(r.findall(text))
            if matches > 0:
                topic_scores[topic] = matches

        if not topic_scores:
            return "Other financial topics", []

        # Sort topics by frequency of matched keywords
        sorted_topics = sorted(topic_scores.items(), key=lambda x: x[1], reverse=True)
        primary_topic = sorted_topics[0][0]
        secondary_topics = [t[0] for t in sorted_topics[1:4]] # Top 3 secondary

        return primary_topic, secondary_topics

# Global topic classifier singleton
topic_classifier = FinancialTopicClassifier()

