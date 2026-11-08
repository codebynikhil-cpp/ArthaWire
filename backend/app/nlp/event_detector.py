"""
FinPulse Financial Event Detection Module
Identifies critical corporate, regulatory, and monetary events from social posts.
"""

import re
from typing import Optional, Tuple

EVENT_PATTERNS = [
    (
        "Quarterly Results / Earnings Announcement",
        r"\b(reported (q[1-4]|pat|net profit|revenue)|q[1-4] results|earnings release|ebitda margin of|posted net profit)\b"
    ),
    (
        "RBI Repo Rate & Monetary Action",
        r"\b(rbi keeps repo rate|mpc cuts rate|rbi hikes|repo rate held at|monetary policy outcome|unanimous mpc decision)\b"
    ),
    (
        "Capital Return (Dividend / Buyback / Bonus)",
        r"\b(declares dividend|announces.*dividend|interim dividend|special dividend|board approved buyback|bonus issue|stock split)\b"
    ),
    (
        "Regulatory Action & SEBI Notice",
        r"\b(sebi notice|sebi bans|regulatory penalty|tax evasion notice|ed raid|cbi investigation|show cause notice)\b"
    ),
    (
        "Executive & Management Change",
        r"\b(ceo resigns|managing director steps down|cfo quits|new appointment of ceo|board reshuffle|independent director leaves)\b"
    ),
    (
        "Mergers, Acquisitions & Stake Deals",
        r"\b(acquires stake|to acquire \d+%|merger approved by nclt|takeover bid|open offer at rs|in talks to sell)\b"
    ),
    (
        "Major Capex & Contract Order",
        r"\b(secures order worth|wins contract of rs|announces mega capex of|commissioned new plant|new manufacturing facility)\b"
    ),
    (
        "Credit Rating Action",
        r"\b(crisil upgrades|care downgrades|rating revised to|placed on credit watch|default on debt coupon)\b"
    )
]

class FinancialEventDetector:
    def __init__(self):
        self.rules = [(event_name, re.compile(pat, re.IGNORECASE)) for event_name, pat in EVENT_PATTERNS]

    def detect_event(self, text: str) -> Tuple[Optional[str], Optional[str]]:
        """
        Returns: (event_type, event_details) or (None, None)
        """
        for event_name, regex in self.rules:
            match = regex.search(text)
            if match:
                start = max(0, match.start() - 40)
                end = min(len(text), match.end() + 60)
                details = text[start:end].strip()
                return event_name, details

        return None, None

event_detector = FinancialEventDetector()
