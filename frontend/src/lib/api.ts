import {
  Creator,
  PostFeedResponse,
  Post,
  OverviewStats,
  CreatorAnalytics,
  MarketIntelligence,
  ConsensusResponse,
  AlertRule,
  NotificationItem,
  IngestionStatus,
  CostEstimate
} from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8005/api";
const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8005/ws";

async function fetchJSON<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Attach terminal auth token if available in browser
  const token = typeof window !== "undefined" ? localStorage.getItem("arthawire_auth_token") : null;
  const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...(options?.headers || {})
    }
  });

  if (!response.ok) {
    let errorDetail = response.statusText;
    try {
      const errObj = await response.json();
      errorDetail = errObj.detail || errorDetail;
    } catch {}
    throw new Error(errorDetail);
  }

  return response.json();
}

export const api = {
  // Overview
  getOverview: () => fetchJSON<OverviewStats>("/analytics/overview"),

  // Posts Feed
  getPosts: (params?: {
    page?: number;
    limit?: number;
    creator_id?: number;
    symbol?: string;
    sentiment?: string;
    topic?: string;
    market_impact?: string;
    search?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.creator_id) query.append("creator_id", params.creator_id.toString());
    if (params?.symbol) query.append("symbol", params.symbol);
    if (params?.sentiment) query.append("sentiment", params.sentiment);
    if (params?.topic) query.append("topic", params.topic);
    if (params?.market_impact) query.append("market_impact", params.market_impact);
    if (params?.search) query.append("search", params.search);
    return fetchJSON<PostFeedResponse>(`/posts?${query.toString()}`);
  },

  getPost: (id: number) => fetchJSON<Post>(`/posts/${id}`),

  // Creators
  getCreators: () => fetchJSON<Creator[]>("/creators"),

  addCreator: (data: {
    username: string;
    display_name?: string;
    description?: string;
    profile_image_url?: string;
    is_active?: boolean;
  }) =>
    fetchJSON<Creator>("/creators", {
      method: "POST",
      body: JSON.stringify(data)
    }),

  updateCreator: (id: number, data: { is_active?: boolean; display_name?: string }) =>
    fetchJSON<Creator>(`/creators/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data)
    }),

  deleteCreator: (id: number) =>
    fetchJSON<{ status: string; message: string }>(`/creators/${id}`, {
      method: "DELETE"
    }),

  syncCreator: (id: number) =>
    fetchJSON<any>(`/creators/${id}/sync`, {
      method: "POST"
    }),

  getCreatorAnalytics: (id: number) => fetchJSON<CreatorAnalytics>(`/analytics/creators/${id}`),

  // Market Intelligence
  getMarketIntelligence: () => fetchJSON<MarketIntelligence>("/analytics/market"),

  // AI Insights
  getConsensusInsights: (timeWindowHours: number = 72) =>
    fetchJSON<ConsensusResponse>(`/insights/consensus?time_window_hours=${timeWindowHours}`),

  // Alerts & Notifications
  getAlertRules: () => fetchJSON<AlertRule[]>("/alerts/rules"),

  createAlertRule: (data: { name: string; rule_type: string; criteria: any }) =>
    fetchJSON<AlertRule>("/alerts/rules", {
      method: "POST",
      body: JSON.stringify(data)
    }),

  toggleAlertRule: (id: number, is_active: boolean) =>
    fetchJSON<AlertRule>(`/alerts/rules/${id}?is_active=${is_active}`, {
      method: "PATCH"
    }),

  deleteAlertRule: (id: number) =>
    fetchJSON<{ status: string }>(`/alerts/rules/${id}`, {
      method: "DELETE"
    }),

  getNotifications: (unreadOnly = false) =>
    fetchJSON<NotificationItem[]>(`/alerts/notifications?unread_only=${unreadOnly}`),

  markNotificationRead: (id: number) =>
    fetchJSON<any>(`/alerts/notifications/${id}/read`, {
      method: "PATCH"
    }),

  markAllNotificationsRead: () =>
    fetchJSON<any>("/alerts/notifications/read-all", {
      method: "POST"
    }),

  resetCreatorsToDefaults: () =>
    fetchJSON<{ status: string; message: string; count: number }>("/creators/reset-defaults", {
      method: "POST"
    }),

  // Terminal Authentication
  login: (accessKey: string) =>
    fetchJSON<{ authenticated: boolean; token: string; role: string; display_name: string; expires_at: number }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ access_key: accessKey })
      }
    ),

  verifyAuth: () =>
    fetchJSON<{ authenticated: boolean; role: string; display_name: string }>("/auth/verify"),

  // Ingestion & Cost
  getIngestionStatus: () => fetchJSON<IngestionStatus>("/ingestion/status"),

  syncAllCreators: () =>
    fetchJSON<{ status: string; creators_synced: number; total_new_posts: number }>(
      "/ingestion/sync-all",
      { method: "POST" }
    ),

  getCostEstimates: (creators = 10, interval = 15, avgTweets = 4) =>
    fetchJSON<CostEstimate>(
      `/ingestion/cost-estimates?creators_count=${creators}&poll_interval_minutes=${interval}&avg_tweets_day=${avgTweets}`
    ),

  simulateLivePost: (username?: string) => {
    const url = username
      ? `/ingestion/simulate-live-post?username=${encodeURIComponent(username)}`
      : "/ingestion/simulate-live-post";
    return fetchJSON<{ status: string; message: string; post: any }>(url, {
      method: "POST"
    });
  }
};

/**
 * WebSocket Connection Helper with Auto-Reconnect
 */
export class FinPulseWebSocket {
  private ws: WebSocket | null = null;
  private listeners: ((event: any) => void)[] = [];
  private reconnectInterval = 3000;
  private isDestroyed = false;

  constructor() {
    this.connect();
  }

  private connect() {
    if (typeof window === "undefined" || this.isDestroyed) return;

    try {
      this.ws = new WebSocket(WS_BASE_URL);

      this.ws.onopen = () => {
        // console.log("FinPulse WebSocket connected");
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.listeners.forEach((listener) => listener(data));
        } catch {}
      };

      this.ws.onclose = () => {
        if (!this.isDestroyed) {
          setTimeout(() => this.connect(), this.reconnectInterval);
        }
      };

      this.ws.onerror = () => {
        this.ws?.close();
      };
    } catch {
      if (!this.isDestroyed) {
        setTimeout(() => this.connect(), this.reconnectInterval);
      }
    }
  }

  public subscribe(callback: (event: any) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  public destroy() {
    this.isDestroyed = true;
    this.ws?.close();
  }
}
