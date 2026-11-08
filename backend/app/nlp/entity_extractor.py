"""
FinPulse Financial Entity Extraction Module
Identifies Indian listed companies, tickers, NSE/BSE indices, sectors, commodities, currencies, RBI, and macroeconomic indicators.
"""

import re
from typing import List, Dict, Any, Optional
from app.data.seed_data import INDIAN_MARKET_ENTITIES

class FinancialEntityExtractor:
    def __init__(self, entities: Optional[List[Dict[str, Any]]] = None):
        self.entities = entities or INDIAN_MARKET_ENTITIES
        self._build_lookup_index()

    def update_entities(self, entities: List[Dict[str, Any]]):
        self.entities = entities
        self._build_lookup_index()

    def _build_lookup_index(self):
        """Precomputes regex patterns for fast, high-precision matching."""
        self.patterns = []
        for ent in self.entities:
            symbol = ent["symbol"]
            name = ent["name"]
            aliases = ent.get("aliases") or []
            
            # Match symbol either as $SYMBOL or word boundary SYMBOL (if > 2 chars)
            terms = [symbol]
            if not symbol.startswith("SEC_"):
                terms.append(f"\\${symbol}")
            
            # Add company name and aliases
            terms.append(re.escape(name))
            for alias in aliases:
                terms.append(re.escape(alias))
            
            # Combine into regex
            pattern_str = r"(?:\b|(?<=\$))(" + "|".join(terms) + r")\b"
            try:
                regex = re.compile(pattern_str, re.IGNORECASE)
                self.patterns.append({
                    "entity": ent,
                    "regex": regex
                })
            except Exception as e:
                pass

    def extract_entities(self, text: str) -> List[Dict[str, Any]]:
        """
        Extracts all financial entities mentioned in text.
        Returns list of matched entities with matched text and entity metadata.
        """
        detected = []
        seen_symbols = set()

        # Clean URLs to avoid false positives inside tweet links
        cleaned_text = re.sub(r"https?://\S+", "", text)

        for item in self.patterns:
            ent = item["entity"]
            symbol = ent["symbol"]
            if symbol in seen_symbols:
                continue

            match = item["regex"].search(cleaned_text)
            if match:
                matched_span = match.group(0)
                
                # Filter out single common English word false positives (e.g. 'AS', 'IT', 'OR')
                if len(matched_span.strip()) < 3 and not matched_span.startswith("$"):
                    continue

                seen_symbols.add(symbol)
                
                # Context snippet around mention for entity sentiment
                start = max(0, match.start() - 50)
                end = min(len(cleaned_text), match.end() + 50)
                context_snippet = cleaned_text[start:end]

                detected.append({
                    "symbol": ent["symbol"],
                    "name": ent["name"],
                    "entity_type": ent["entity_type"],
                    "exchange": ent.get("exchange"),
                    "sector": ent.get("sector"),
                    "matched_text": matched_span,
                    "context_snippet": context_snippet
                })

        return detected

# Global entity extractor singleton
entity_extractor = FinancialEntityExtractor()

