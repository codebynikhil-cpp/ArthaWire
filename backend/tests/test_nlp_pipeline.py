import pytest
from app.nlp.pipeline import nlp_pipeline

def test_nlp_positive_earnings_and_entities():
    text = "Tata Motors Q3 net profit jumped +42% to Rs 7,025 crore driven by robust JLR order book and expanding margins. EV segment EBITDA turned positive. $TATAMOTORS"
    result = nlp_pipeline.process_post(text)

    assert result["sentiment"] == "Positive"
    assert result["topic"] == "Company earnings"
    assert any(e["symbol"] == "TATAMOTORS" for e in result["entities"])
    assert result["market_impact"] == "Potentially bullish"
    assert "summary" in result
    assert len(result["main_arguments"]) > 0

def test_nlp_mixed_sentiment():
    text = "Reliance reported strong retail revenue (+18%), but petrochemical margins collapsed -24% amid higher debt levels. Mixed outlook for the coming quarter."
    result = nlp_pipeline.process_post(text)

    assert result["sentiment"] == "Mixed"
    assert result["market_impact"] == "Unclear"
    assert any(e["symbol"] == "RELIANCE" for e in result["entities"])

def test_nlp_rbi_monetary_policy():
    text = "RBI MPC unanimously voted to keep repo rate at 6.50%. Shaktikanta Das stressed that monetary policy must remain actively disinflationary."
    result = nlp_pipeline.process_post(text)

    assert result["topic"] == "RBI monetary policy"
    assert any(e["symbol"] in ("RBI", "MPC") for e in result["entities"])

def test_nlp_event_detection_dividend():
    text = "ITC board declares interim dividend of Rs 6.25 per share to all registered shareholders."
    result = nlp_pipeline.process_post(text)

    assert result["event_type"] is not None
    assert "Dividend" in result["event_type"] or "Capital Return" in result["event_type"]
