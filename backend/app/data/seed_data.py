"""
FinPulse Seed Data:
- Top 10 Curated Indian Financial Creators
- Comprehensive Indian Market Entities (Equities, Indices, Sectors, Commodities, Currencies, Regulators)
- Default Alert Rules
"""

INITIAL_CREATORS = [
    {
        "x_user_id": "14298154",
        "username": "deepakshenoy",
        "display_name": "Deepak Shenoy",
        "description": "Founder & CEO, Capitalmind. Author of Money Wise. Investing in Indian equities, macro commentary & markets.",
        "profile_image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        "followers_count": 285000,
        "is_active": True,
    },
    {
        "x_user_id": "83492718",
        "username": "dmuthuk",
        "display_name": "D.Muthukrishnan",
        "description": "Certified Financial Planner, long-term equity investor in Indian wealth creation stories. Wisdom & perspective.",
        "profile_image_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        "followers_count": 420000,
        "is_active": True,
    },
    {
        "x_user_id": "278194301",
        "username": "shripad_n",
        "display_name": "Shripad",
        "description": "Deep-dives on Indian banking, credit growth, NBFCs, RBI policies and quarterly corporate earnings.",
        "profile_image_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
        "followers_count": 94000,
        "is_active": True,
    },
    {
        "x_user_id": "95817263",
        "username": "kshitij_a",
        "display_name": "Kshitij Anand",
        "description": "Financial journalist tracking Dalal Street trends, NSE/BSE corporate announcements, FII/DII institutional flows.",
        "profile_image_url": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
        "followers_count": 138000,
        "is_active": True,
    },
    {
        "x_user_id": "18492047",
        "username": "capitalmind_in",
        "display_name": "Capitalmind Research",
        "description": "SEBI Registered Research Analyst. Data-driven equity research, macro insights & Indian stock analysis.",
        "profile_image_url": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&auto=format&fit=crop&q=80",
        "followers_count": 195000,
        "is_active": True,
    },
    {
        "x_user_id": "49201948",
        "username": "safalniveshak",
        "display_name": "Vishal Khandelwal",
        "description": "Safal Niveshak. Teaching the art of value investing, Indian corporate governance & behavioral finance.",
        "profile_image_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
        "followers_count": 210000,
        "is_active": True,
    },
    {
        "x_user_id": "10492817",
        "username": "TamalBandyo",
        "display_name": "Tamal Bandyopadhyay",
        "description": "Author, columnist & banking analyst. Inside view on Indian banking, NPA cycles & RBI central bank policies.",
        "profile_image_url": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
        "followers_count": 82000,
        "is_active": True,
    },
    {
        "x_user_id": "67182940",
        "username": "nagpalmano",
        "display_name": "Manoj Nagpal",
        "description": "CEO Anand Rathi Wealth. Analyzing mutual fund flows, bond yields, debt markets and retail participation.",
        "profile_image_url": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
        "followers_count": 115000,
        "is_active": True,
    },
    {
        "x_user_id": "11928374",
        "username": "soicfinance",
        "display_name": "SOIC Finance",
        "description": "School of Intrinsic Compounding. Fundamental business teardowns, sector moats & Indian manufacturing.",
        "profile_image_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        "followers_count": 160000,
        "is_active": True,
    },
    {
        "x_user_id": "33918204",
        "username": "surajae",
        "display_name": "Suraj",
        "description": "Indian equity markets, smallcap tracking, capital goods, infrastructure capex cycles and macro trends.",
        "profile_image_url": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
        "followers_count": 68000,
        "is_active": True,
    }
]

INDIAN_MARKET_ENTITIES = [
    # Top Equities (NSE/BSE)
    {
        "symbol": "RELIANCE",
        "name": "Reliance Industries Limited",
        "entity_type": "EQUITY",
        "exchange": "NSE",
        "sector": "Energy & Oil/Gas",
        "aliases": ["RIL", "Reliance", "Reliance Retail", "Jio", "Mukesh Ambani", "Reliance Jio"]
    },
    {
        "symbol": "TCS",
        "name": "Tata Consultancy Services Limited",
        "entity_type": "EQUITY",
        "exchange": "NSE",
        "sector": "Information Technology",
        "aliases": ["Tata Consultancy", "TCS Ltd"]
    },
    {
        "symbol": "HDFCBANK",
        "name": "HDFC Bank Limited",
        "entity_type": "EQUITY",
        "exchange": "NSE",
        "sector": "Banking & Finance",
        "aliases": ["HDFC", "HDFC Bank", "HDFC Ltd"]
    },
    {
        "symbol": "INFY",
        "name": "Infosys Limited",
        "entity_type": "EQUITY",
        "exchange": "NSE",
        "sector": "Information Technology",
        "aliases": ["Infosys", "Infy"]
    },
    {
        "symbol": "ICICIBANK",
        "name": "ICICI Bank Limited",
        "entity_type": "EQUITY",
        "exchange": "NSE",
        "sector": "Banking & Finance",
        "aliases": ["ICICI", "ICICI Bank"]
    },
    {
        "symbol": "SBIN",
        "name": "State Bank of India",
        "entity_type": "EQUITY",
        "exchange": "NSE",
        "sector": "Banking & Finance",
        "aliases": ["SBI", "State Bank", "SBI Bank"]
    },
    {
        "symbol": "BHARTIARTL",
        "name": "Bharti Airtel Limited",
        "entity_type": "EQUITY",
        "exchange": "NSE",
        "sector": "Telecommunication",
        "aliases": ["Airtel", "Bharti Airtel"]
    },
    {
        "symbol": "LT",
        "name": "Larsen & Toubro Limited",
        "entity_type": "EQUITY",
        "exchange": "NSE",
        "sector": "Infrastructure",
        "aliases": ["L&T", "Larsen and Toubro", "Larsen & Toubro"]
    },
    {
        "symbol": "ITC",
        "name": "ITC Limited",
        "entity_type": "EQUITY",
        "exchange": "NSE",
        "sector": "Fast Moving Consumer Goods",
        "aliases": ["ITC Ltd", "ITC Hotels"]
    },
    {
        "symbol": "HINDUNILVR",
        "name": "Hindustan Unilever Limited",
        "entity_type": "EQUITY",
        "exchange": "NSE",
        "sector": "Fast Moving Consumer Goods",
        "aliases": ["HUL", "Hindustan Unilever"]
    },
    {
        "symbol": "TATAMOTORS",
        "name": "Tata Motors Limited",
        "entity_type": "EQUITY",
        "exchange": "NSE",
        "sector": "Automobile",
        "aliases": ["Tata Motors", "TAMO", "JLR", "Jaguar Land Rover"]
    },
    {
        "symbol": "BAJFINANCE",
        "name": "Bajaj Finance Limited",
        "entity_type": "EQUITY",
        "exchange": "NSE",
        "sector": "Banking & Finance",
        "aliases": ["Bajaj Finance", "Bajaj Finserv", "Bajaj"]
    },
    {
        "symbol": "MARUTI",
        "name": "Maruti Suzuki India Limited",
        "entity_type": "EQUITY",
        "exchange": "NSE",
        "sector": "Automobile",
        "aliases": ["Maruti", "Maruti Suzuki", "MSIL"]
    },
    {
        "symbol": "SUNPHARMA",
        "name": "Sun Pharmaceutical Industries Limited",
        "entity_type": "EQUITY",
        "exchange": "NSE",
        "sector": "Pharmaceuticals",
        "aliases": ["Sun Pharma", "Sun Pharmaceuticals"]
    },
    {
        "symbol": "AXISBANK",
        "name": "Axis Bank Limited",
        "entity_type": "EQUITY",
        "exchange": "NSE",
        "sector": "Banking & Finance",
        "aliases": ["Axis Bank", "Axis"]
    },
    {
        "symbol": "KOTAKBANK",
        "name": "Kotak Mahindra Bank Limited",
        "entity_type": "EQUITY",
        "exchange": "NSE",
        "sector": "Banking & Finance",
        "aliases": ["Kotak Bank", "Kotak", "Uday Kotak"]
    },
    {
        "symbol": "WIPRO",
        "name": "Wipro Limited",
        "entity_type": "EQUITY",
        "exchange": "NSE",
        "sector": "Information Technology",
        "aliases": ["Wipro Ltd", "Wipro"]
    },
    {
        "symbol": "ADANIENT",
        "name": "Adani Enterprises Limited",
        "entity_type": "EQUITY",
        "exchange": "NSE",
        "sector": "Metals & Mining",
        "aliases": ["Adani", "Adani Enterprises", "Gautam Adani"]
    },
    {
        "symbol": "ADANIPORTS",
        "name": "Adani Ports and Special Economic Zone Limited",
        "entity_type": "EQUITY",
        "exchange": "NSE",
        "sector": "Infrastructure",
        "aliases": ["Adani Ports", "APSEZ"]
    },
    {
        "symbol": "TITAN",
        "name": "Titan Company Limited",
        "entity_type": "EQUITY",
        "exchange": "NSE",
        "sector": "Fast Moving Consumer Goods",
        "aliases": ["Titan", "Tanishq"]
    },
    {
        "symbol": "TATASTEEL",
        "name": "Tata Steel Limited",
        "entity_type": "EQUITY",
        "exchange": "NSE",
        "sector": "Metals & Mining",
        "aliases": ["Tata Steel"]
    },
    {
        "symbol": "ZOMATO",
        "name": "Zomato Limited",
        "entity_type": "EQUITY",
        "exchange": "NSE",
        "sector": "Information Technology",
        "aliases": ["Zomato", "Blinkit", "Deepinder Goyal"]
    },
    {
        "symbol": "PAYTM",
        "name": "One97 Communications Limited",
        "entity_type": "EQUITY",
        "exchange": "NSE",
        "sector": "Banking & Finance",
        "aliases": ["Paytm", "One97"]
    },
    {
        "symbol": "JIOFIN",
        "name": "Jio Financial Services Limited",
        "entity_type": "EQUITY",
        "exchange": "NSE",
        "sector": "Banking & Finance",
        "aliases": ["Jio Financial", "JFSL", "Jio Fin"]
    },

    # Market Indices
    {
        "symbol": "NIFTY50",
        "name": "NIFTY 50 Index",
        "entity_type": "INDEX",
        "exchange": "NSE",
        "sector": "Benchmark",
        "aliases": ["Nifty", "Nifty 50", "NSE Nifty"]
    },
    {
        "symbol": "BANKNIFTY",
        "name": "NIFTY Bank Index",
        "entity_type": "INDEX",
        "exchange": "NSE",
        "sector": "Banking & Finance",
        "aliases": ["Bank Nifty", "BankNifty", "Nifty Bank"]
    },
    {
        "symbol": "SENSEX",
        "name": "BSE SENSEX",
        "entity_type": "INDEX",
        "exchange": "BSE",
        "sector": "Benchmark",
        "aliases": ["Sensex", "BSE Sensex", "BSE 30"]
    },
    {
        "symbol": "NIFTYIT",
        "name": "NIFTY IT Index",
        "entity_type": "INDEX",
        "exchange": "NSE",
        "sector": "Information Technology",
        "aliases": ["Nifty IT", "IT Index"]
    },
    {
        "symbol": "NIFTYMIDCAP",
        "name": "NIFTY Midcap 100",
        "entity_type": "INDEX",
        "exchange": "NSE",
        "sector": "Midcap",
        "aliases": ["Nifty Midcap", "Midcap 100"]
    },

    # Sectors
    {
        "symbol": "SEC_BANKING",
        "name": "Indian Banking & NBFC Sector",
        "entity_type": "SECTOR",
        "exchange": "NSE",
        "sector": "Banking & Finance",
        "aliases": ["Banking sector", "PSU banks", "Private banks", "NBFCs"]
    },
    {
        "symbol": "SEC_IT",
        "name": "Indian Information Technology Sector",
        "entity_type": "SECTOR",
        "exchange": "NSE",
        "sector": "Information Technology",
        "aliases": ["IT sector", "IT services", "Tech sector"]
    },
    {
        "symbol": "SEC_AUTO",
        "name": "Automobile & EV Sector",
        "entity_type": "SECTOR",
        "exchange": "NSE",
        "sector": "Automobile",
        "aliases": ["Auto sector", "EV market", "Automobile industry"]
    },
    {
        "symbol": "SEC_ENERGY",
        "name": "Energy, Oil & Gas Sector",
        "entity_type": "SECTOR",
        "exchange": "NSE",
        "sector": "Energy & Oil/Gas",
        "aliases": ["Oil and gas", "Refining", "Renewable energy", "Energy sector"]
    },
    {
        "symbol": "SEC_PHARMA",
        "name": "Pharmaceuticals & Healthcare Sector",
        "entity_type": "SECTOR",
        "exchange": "NSE",
        "sector": "Pharmaceuticals",
        "aliases": ["Pharma sector", "Healthcare", "US FDA approvals"]
    },

    # Commodities & Currencies
    {
        "symbol": "CRUDE_OIL",
        "name": "Brent Crude Oil",
        "entity_type": "COMMODITY",
        "exchange": "MCX",
        "sector": "Commodities",
        "aliases": ["Crude oil", "Brent crude", "WTI crude", "Oil prices"]
    },
    {
        "symbol": "GOLD",
        "name": "Gold MCX",
        "entity_type": "COMMODITY",
        "exchange": "MCX",
        "sector": "Commodities",
        "aliases": ["Gold", "Gold prices", "Bullion"]
    },
    {
        "symbol": "SILVER",
        "name": "Silver MCX",
        "entity_type": "COMMODITY",
        "exchange": "MCX",
        "sector": "Commodities",
        "aliases": ["Silver", "Silver prices"]
    },
    {
        "symbol": "USDINR",
        "name": "US Dollar to Indian Rupee",
        "entity_type": "CURRENCY",
        "exchange": "NSE",
        "sector": "Forex",
        "aliases": ["Rupee", "INR", "USD/INR", "Dollar vs Rupee"]
    },

    # Regulators & Macro
    {
        "symbol": "RBI",
        "name": "Reserve Bank of India",
        "entity_type": "REGULATOR",
        "exchange": "RBI",
        "sector": "Central Banking",
        "aliases": ["RBI", "Reserve Bank", "Shaktikanta Das", "Central Bank", "Mint Street"]
    },
    {
        "symbol": "MPC",
        "name": "Monetary Policy Committee",
        "entity_type": "REGULATOR",
        "exchange": "RBI",
        "sector": "Central Banking",
        "aliases": ["MPC", "Repo rate", "Policy rate", "Rate cut", "Rate hike", "Monetary policy"]
    },
    {
        "symbol": "SEBI",
        "name": "Securities and Exchange Board of India",
        "entity_type": "REGULATOR",
        "exchange": "SEBI",
        "sector": "Market Regulator",
        "aliases": ["SEBI", "Madhabi Puri Buch", "Market regulator"]
    },
    {
        "symbol": "INFLATION",
        "name": "Consumer Price Index (CPI) Inflation",
        "entity_type": "MACRO",
        "exchange": "MOSPI",
        "sector": "Macroeconomics",
        "aliases": ["CPI", "Retail inflation", "Inflation rate", "WPI"]
    },
    {
        "symbol": "GDP",
        "name": "India Gross Domestic Product",
        "entity_type": "MACRO",
        "exchange": "MOSPI",
        "sector": "Macroeconomics",
        "aliases": ["GDP growth", "GDP print", "Economic growth"]
    }
]

DEFAULT_ALERTS = [
    {
        "name": "RBI Monetary Policy & Repo Rate Decision",
        "rule_type": "RBI_POLICY",
        "criteria": {"keywords": ["repo rate", "rbi", "mpc", "rate cut", "rate hike", "shaktikanta"]},
        "is_active": True
    },
    {
        "name": "High-Impact Corporate Events & Earnings",
        "rule_type": "HIGH_IMPACT_EVENT",
        "criteria": {"events": ["Earnings", "Merger & Acquisition", "Executive Resignation", "Regulatory Inquiry"]},
        "is_active": True
    },
    {
        "name": "Multi-Creator Consensus Alert",
        "rule_type": "MULTI_CREATOR",
        "criteria": {"min_creators": 2, "time_window_hours": 24},
        "is_active": True
    },
    {
        "name": "Reliance Industries Discussion Spike",
        "rule_type": "ENTITY_MENTION",
        "criteria": {"symbol": "RELIANCE"},
        "is_active": True
    },
    {
        "name": "HDFC Bank & Banking Sector Watch",
        "rule_type": "ENTITY_MENTION",
        "criteria": {"symbols": ["HDFCBANK", "SEC_BANKING"]},
        "is_active": True
    }
]

