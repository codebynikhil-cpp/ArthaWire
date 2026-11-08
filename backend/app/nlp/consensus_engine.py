"""
FinPulse Cross-Creator Consensus Engine
Discovers and consolidates discussions across multiple creators discussing the same company or topic.
Synthesizes:
- Company & Number of creators
- Main topic
- Overall consensus sentiment (Bullish / Bearish / Mixed / Neutral)
- Common arguments & points of agreement
- Differences in creator opinions & divergent views
- Original post references and links
"""

import datetime
from typing import List, Dict, Any
from collections import defaultdict

class ConsensusEngine:
    def consolidate_discussions(
        self,
        posts_data: List[Dict[str, Any]],
        time_window_hours: int = 48
    ) -> List[Dict[str, Any]]:
        """
        Groups posts by entity symbol and identifies clusters with 2+ distinct creators.
        """
        # Map: symbol -> list of posts
        entity_clusters = defaultdict(list)
        now = datetime.datetime.utcnow()

        for post in posts_data:
            # Check time window if post has created_at
            p_time = post.get("created_at")
            if isinstance(p_time, str):
                try:
                    p_time = datetime.datetime.fromisoformat(p_time.replace("Z", "+00:00")).replace(tzinfo=None)
                except Exception:
                    p_time = now
            elif not p_time:
                p_time = now

            delta = (now - p_time).total_seconds() / 3600.0
            if delta > time_window_hours:
                continue

            entities = post.get("entities", [])
            for ent in entities:
                symbol = ent.get("symbol")
                if symbol:
                    entity_clusters[symbol].append(post)

        insights = []

        for symbol, p_list in entity_clusters.items():
            # Get distinct creators
            creator_ids = set(p.get("creator_id") or p.get("username") for p in p_list)
            if len(creator_ids) < 2:
                continue

            # Entity metadata
            sample_entity = next((e for p in p_list for e in p.get("entities", []) if e.get("symbol") == symbol), None)
            entity_name = sample_entity.get("name", symbol) if sample_entity else symbol
            entity_type = sample_entity.get("entity_type", "EQUITY") if sample_entity else "EQUITY"

            # Compute overall sentiment
            sentiments = [p.get("sentiment", "Neutral") for p in p_list]
            pos_count = sentiments.count("Positive")
            neg_count = sentiments.count("Negative")
            neu_count = sentiments.count("Neutral")
            mixed_count = sentiments.count("Mixed")

            if pos_count > 0 and neg_count > 0:
                overall_sentiment = "Mixed"
            elif pos_count > (neg_count + neu_count):
                overall_sentiment = "Bullish Consensus"
            elif neg_count > (pos_count + neu_count):
                overall_sentiment = "Bearish Consensus"
            else:
                overall_sentiment = "Neutral / Balanced"

            # Primary topic across the cluster
            topics = [p.get("topic") for p in p_list if p.get("topic")]
            main_topic = max(set(topics), key=topics.count) if topics else "Indian stock market"

            # Common arguments & divergence
            common_arguments = []
            divergent_opinions = []
            post_links = []
            creator_names = []

            for p in p_list:
                c_name = p.get("display_name") or p.get("username") or "Creator"
                if c_name not in creator_names:
                    creator_names.append(c_name)

                args = p.get("main_arguments") or []
                if args:
                    common_arguments.append(f"{c_name}: {args[0]}")

                # Note specific opinions for divergence
                post_sentiment = p.get("sentiment")
                summary = p.get("summary") or ""
                divergent_opinions.append({
                    "creator": c_name,
                    "sentiment": post_sentiment,
                    "stance": summary[:120] + "..." if len(summary) > 120 else summary,
                    "post_url": p.get("post_url", "#")
                })

                if p.get("post_url") and p.get("post_url") not in post_links:
                    post_links.append(p.get("post_url"))

            insights.append({
                "symbol": symbol,
                "company_name": entity_name,
                "entity_type": entity_type,
                "creators_count": len(creator_ids),
                "creator_names": creator_names,
                "total_posts": len(p_list),
                "main_topic": main_topic,
                "overall_sentiment": overall_sentiment,
                "sentiment_distribution": {
                    "positive": pos_count,
                    "negative": neg_count,
                    "neutral": neu_count,
                    "mixed": mixed_count
                },
                "common_arguments": common_arguments[:4],
                "divergent_opinions": divergent_opinions,
                "original_post_links": post_links,
                "detected_at": datetime.datetime.utcnow().isoformat()
            })

        # Sort by creators_count descending
        insights.sort(key=lambda x: x["creators_count"], reverse=True)
        return insights

consensus_engine = ConsensusEngine()

