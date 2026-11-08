"""
FinPulse Financial Post Summarization Module
Generates structured financial briefings:
- Concise summary
- Core financial arguments
- Key risks & opportunities
- Supporting empirical evidence (figures, percentages, filings)
"""

import re
from typing import Dict, Any, List

class FinancialSummarizer:
    def summarize(
        self,
        text: str,
        entities: List[Dict[str, Any]],
        topic: str,
        sentiment: str,
        event_type: str = None
    ) -> Dict[str, Any]:
        """
        Generates structured analytical summary from text and extracted financial features.
        """
        # Clean URLs for readability
        clean_text = re.sub(r"https?://\S+", "", text).strip()
        sentences = [s.strip() for s in re.split(r"[.!?\n]+", clean_text) if len(s.strip()) > 15]

        # Extract supporting numerical evidence (+15%, Rs 4,500 cr, $80/bbl, etc.)
        evidence_matches = re.findall(
            r"(?:rs\.?|inr|\$|₹)?\s*\d+(?:,\d+)*(?:\.\d+)?\s*(?:%|cr|crore|lakh|bn|billion|bps|basis points|bbl)?",
            clean_text,
            re.IGNORECASE
        )
        supporting_evidence = [e.strip() for e in evidence_matches if len(e.strip()) > 1 and any(c.isdigit() for c in e)]
        evidence_str = ", ".join(supporting_evidence[:5]) if supporting_evidence else "Qualitative commentary"

        # Mentioned companies and sectors
        companies = [e["name"] for e in entities if e.get("entity_type") == "EQUITY"]
        sectors = list(set([e.get("sector") for e in entities if e.get("sector")]))

        # Synthesize concise summary
        primary_entity = entities[0]["name"] if entities else "the Indian market"
        
        if sentences:
            concise_summary = sentences[0]
            if len(sentences) > 1 and len(concise_summary) < 80:
                concise_summary += f". {sentences[1]}"
        else:
            concise_summary = clean_text[:160]

        # Extract core financial arguments
        main_arguments = []
        for s in sentences[:3]:
            # Clean bullet or leading indicators
            clean_s = re.sub(r"^[\s\-\*\d\.]+", "", s).strip()
            if clean_s:
                main_arguments.append(clean_s)

        if not main_arguments:
            main_arguments.append(f"Analysis focusing on {primary_entity} under {topic}.")

        # Identify risks & opportunities based on sentiment and keywords
        risks = []
        opportunities = []

        lower = clean_text.lower()
        if "debt" in lower or "leverage" in lower or "borrowing" in lower:
            risks.append("Elevated leverage and balance sheet debt servicing")
        if "margin" in lower and ("compress" in lower or "pressure" in lower or "drop" in lower):
            risks.append("Operating margin compression")
        if "valuation" in lower and ("expensive" in lower or "rich" in lower or "high pe" in lower):
            risks.append("Stretched multiples / premium valuations")
        if "inflation" in lower or "rate hike" in lower:
            risks.append("Macro inflationary headwinds and monetary tightening")
        if not risks and sentiment in ("Negative", "Mixed"):
            risks.append(f"Earnings deceleration or competitive friction in {sectors[0] if sectors else 'the industry'}")

        if "growth" in lower or "expand" in lower or "expansion" in lower:
            opportunities.append("Volume/revenue expansion across core segments")
        if "order" in lower or "capex" in lower or "contract" in lower:
            opportunities.append("Order book accretion and long-term capital formation")
        if "margin" in lower and ("expand" in lower or "strong" in lower or "beat" in lower):
            opportunities.append("Operating leverage driving EBITDA expansion")
        if not opportunities and sentiment in ("Positive", "Mixed"):
            opportunities.append(f"Structural domestic demand tailwinds for {primary_entity}")

        return {
            "summary": concise_summary,
            "main_arguments": main_arguments,
            "risks_and_opportunities": {
                "risks": risks,
                "opportunities": opportunities
            },
            "supporting_evidence": f"Key figures: {evidence_str}" if supporting_evidence else "Broad qualitative analysis",
            "companies_mentioned": companies,
            "sectors_mentioned": sectors
        }

# Global summarizer singleton
financial_summarizer = FinancialSummarizer()

