"""
FinPulse Real-Time Alert Rule Evaluator
Evaluates newly ingested posts against user-configured alert rules:
- Specific company / ticker mentions
- Major RBI & monetary policy discussions
- High-impact events (earnings, management changes, regulatory notices)
- Extreme sentiment thresholds
- Multi-creator discussion triggers
"""

import logging
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session

from app.models.alert import AlertRule, Notification
from app.models.post import Post

logger = logging.getLogger(__name__)

class AlertEvaluator:
    def evaluate_post(self, db: Session, post: Post, analysis: Dict[str, Any]) -> List[Notification]:
        """
        Evaluates a newly ingested and analyzed post against all active alert rules.
        Creates and persists Notification records in the database.
        Returns list of newly triggered notifications.
        """
        active_rules = db.query(AlertRule).filter(AlertRule.is_active == True).all()
        created_notifications = []

        entities = analysis.get("entities", [])
        symbols = [e.get("symbol") for e in entities if e.get("symbol")]
        topic = analysis.get("topic", "")
        event_type = analysis.get("event_type")
        sentiment = analysis.get("sentiment", "Neutral")
        text_lower = post.text.lower()

        creator_name = post.creator.display_name if post.creator else "Creator"

        for rule in active_rules:
            triggered = False
            title = ""
            message = ""
            severity = "INFO"

            criteria = rule.criteria or {}

            # Rule 1: Specific Entity Mention
            if rule.rule_type == "ENTITY_MENTION":
                target_symbol = criteria.get("symbol")
                target_symbols = criteria.get("symbols", [])
                all_targets = ([target_symbol] if target_symbol else []) + target_symbols
                
                matched_syms = set(symbols).intersection(set(all_targets))
                if matched_syms:
                    triggered = True
                    severity = "WARNING" if sentiment in ("Negative", "Positive") else "INFO"
                    title = f"Alert: {', '.join(matched_syms)} Mentioned by {creator_name}"
                    message = f"{creator_name} discussed {', '.join(matched_syms)}. Stance: {sentiment}. {analysis.get('summary', '')[:140]}..."

            # Rule 2: RBI & Monetary Policy Discussions
            elif rule.rule_type == "RBI_POLICY":
                keywords = criteria.get("keywords", ["repo rate", "rbi", "mpc"])
                if any(kw in text_lower for kw in keywords) or "RBI" in symbols or topic == "RBI monetary policy":
                    triggered = True
                    severity = "CRITICAL" if "repo" in text_lower or "rate" in text_lower else "WARNING"
                    title = f"Central Bank Alert: RBI / MPC Discussion"
                    message = f"{creator_name} published insights on RBI monetary policy: '{analysis.get('summary', '')[:140]}...'"

            # Rule 3: High-Impact Corporate Events
            elif rule.rule_type == "HIGH_IMPACT_EVENT":
                allowed_events = criteria.get("events", ["Earnings", "Merger", "Resignation", "Regulatory"])
                if event_type:
                    for ev in allowed_events:
                        if ev.lower() in event_type.lower():
                            triggered = True
                            severity = "WARNING" if "regulatory" in ev.lower() or "resignation" in ev.lower() else "INFO"
                            title = f"Event Detected: {event_type}"
                            message = f"{creator_name} flagged {event_type} involving {', '.join(symbols) if symbols else 'Indian market'}."
                            break

            # Rule 4: Extreme Sentiment Alert
            elif rule.rule_type == "SENTIMENT_EXTREME":
                target_sentiment = criteria.get("sentiment")
                if target_sentiment and sentiment == target_sentiment and analysis.get("sentiment_score", 0) >= 0.8:
                    triggered = True
                    severity = "WARNING" if sentiment == "Negative" else "INFO"
                    title = f"Extreme Sentiment Alert: {sentiment.upper()}"
                    message = f"High conviction {sentiment} commentary from {creator_name} on {', '.join(symbols) if symbols else 'market'}."

            # Rule 5: Keyword Alert
            elif rule.rule_type == "KEYWORD":
                keywords = criteria.get("keywords", [])
                matched_kw = [kw for kw in keywords if kw.lower() in text_lower]
                if matched_kw:
                    triggered = True
                    severity = "INFO"
                    title = f"Keyword Alert: {', '.join(matched_kw)}"
                    message = f"Keywords {matched_kw} matched in post by {creator_name}."

            if triggered:
                notification = Notification(
                    alert_id=rule.id,
                    post_id=post.id,
                    title=title,
                    message=message,
                    severity=severity,
                    category=rule.rule_type,
                    is_read=False,
                    metadata_json={
                        "symbols": symbols,
                        "sentiment": sentiment,
                        "topic": topic,
                        "event_type": event_type,
                        "creator": creator_name,
                        "post_url": post.post_url
                    }
                )
                db.add(notification)
                created_notifications.append(notification)

        if created_notifications:
            db.commit()
            for n in created_notifications:
                db.refresh(n)

        return created_notifications

alert_evaluator = AlertEvaluator()

