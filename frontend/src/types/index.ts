export type SentimentType = "Positive" | "Negative" | "Neutral" | "Mixed";
export type MarketImpactType = "Potentially bullish" | "Potentially bearish" | "Neutral" | "Unclear";

export interface CreatorSummary {
  id: number;
  username: string;
  display_name: string;
  profile_image_url?: string;
}

export interface PollState {
  endpoint_used: string;
  since_id?: string;
  last_status: string;
  error_message?: string;
  last_polled_at?: string;
}

export interface Creator {
  id: number;
  x_user_id: string;
  username: string;
  display_name: string;
  description?: string;
  profile_image_url?: string;
  followers_count: number;
  is_active: boolean;
  last_polled_at?: string;
  created_at: string;
  poll_state?: PollState;
  total_posts_count?: number;
}

export interface PostMetrics {
  like_count: number;
  repost_count: number;
  reply_count: number;
  quote_count: number;
  impression_count: number;
}

export interface PostAnalysis {
  sentiment: SentimentType;
  sentiment_score: number;
  sentiment_breakdown?: {
    positive: number;
    negative: number;
    neutral: number;
  };
  topic: string;
  secondary_topics?: string[];
  event_type?: string;
  event_details?: string;
  market_impact: MarketImpactType;
  market_impact_reasoning?: string;
  is_opinion: boolean;
  creator_opinion_summary?: string;
  summary: string;
  main_arguments?: string[];
  risks_and_opportunities?: {
    risks: string[];
    opportunities: string[];
  };
  supporting_evidence?: string;
  model_version: string;
  processed_at: string;
}

export interface EntityMention {
  id: number;
  symbol: string;
  name: string;
  entity_type: string;
  sector?: string;
  matched_text: string;
}

export interface Post {
  id: number;
  x_post_id: string;
  text: string;
  created_at: string;
  post_url: string;
  lang: string;
  ingested_at: string;
  creator: CreatorSummary;
  metrics?: PostMetrics;
  analysis?: PostAnalysis;
  entities: EntityMention[];
}

export interface PostFeedResponse {
  total: number;
  page: number;
  limit: number;
  posts: Post[];
}

export interface SentimentCount {
  positive: number;
  negative: number;
  neutral: number;
  mixed: number;
}

export interface TopicCount {
  topic: string;
  count: number;
}

export interface SectorCount {
  sector: string;
  count: number;
  sentiment_distribution: SentimentCount;
}

export interface EntityLeaderboard {
  symbol: string;
  name: string;
  mentions_count: number;
  positive: number;
  negative: number;
  neutral: number;
  mixed: number;
  last_discussed?: string;
}

export interface OverviewStats {
  total_monitored_creators: number;
  active_monitored_creators: number;
  total_posts_collected: number;
  posts_detected_today: number;
  sentiment_distribution: SentimentCount;
  trending_topics: TopicCount[];
  recent_events: {
    post_id: number;
    creator_name: string;
    creator_username: string;
    event_type: string;
    event_details: string;
    market_impact: MarketImpactType;
    post_url: string;
    timestamp: string;
  }[];
}

export interface CreatorAnalytics {
  creator_id: number;
  username: string;
  display_name: string;
  profile_image_url?: string;
  total_posts: number;
  posts_this_week: number;
  sentiment_distribution: SentimentCount;
  top_discussed_companies: { symbol: string; name: string; mentions: number }[];
  top_discussed_sectors: { sector: string; count: number }[];
  top_topics: { topic: string; count: number }[];
  recent_posts: {
    id: number;
    text: string;
    created_at: string;
    post_url: string;
    sentiment: SentimentType;
    market_impact: MarketImpactType;
  }[];
}

export interface MarketIntelligence {
  trending_companies: EntityLeaderboard[];
  trending_sectors: SectorCount[];
  emerging_topics: TopicCount[];
  unusual_spikes: {
    symbol: string;
    name: string;
    spike_magnitude: string;
    reason: string;
  }[];
}

export interface DivergentOpinion {
  creator: string;
  sentiment: SentimentType;
  stance: string;
  post_url: string;
}

export interface ConsensusInsight {
  symbol: string;
  company_name: string;
  entity_type: string;
  creators_count: number;
  creator_names: string[];
  total_posts: number;
  main_topic: string;
  overall_sentiment: string;
  sentiment_distribution: SentimentCount;
  common_arguments: string[];
  divergent_opinions: DivergentOpinion[];
  original_post_links: string[];
  detected_at: string;
}

export interface ConsensusResponse {
  time_window_hours: number;
  total_consensus_clusters: number;
  insights: ConsensusInsight[];
}

export interface AlertRule {
  id: number;
  name: string;
  rule_type: string;
  criteria: any;
  is_active: boolean;
  created_at: string;
}

export interface NotificationItem {
  id: number;
  alert_id?: number;
  post_id?: number;
  title: string;
  message: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  category: string;
  is_read: boolean;
  created_at: string;
  metadata_json?: any;
}

export interface IngestionStatus {
  is_scheduler_running: boolean;
  mode: "SIMULATION" | "LIVE_X_API";
  active_creators_count: number;
  total_creators_count: number;
  rate_limit_remaining?: number;
  rate_limit_reset?: string;
  last_poll_time?: string;
  total_posts_ingested: number;
}

export interface CostTier {
  tier_name: string;
  monthly_cost_usd: number;
  tweet_read_limit: any;
  rate_limit: string;
  is_viable: boolean;
  recommendation: string;
}

export interface CostEstimate {
  parameters: {
    monitored_creators: number;
    poll_interval_minutes: number;
    avg_tweets_per_creator_day: number;
  };
  consumption: {
    polls_per_day: number;
    polls_per_month: number;
    expected_tweets_ingested_month: number;
  };
  tiers: CostTier[];
}
