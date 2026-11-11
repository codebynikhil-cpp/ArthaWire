"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "../components/layout/Navbar";
import { Sidebar, TabKey } from "../components/layout/Sidebar";
import { StatCard } from "../components/overview/StatCard";
import { SentimentChart } from "../components/overview/SentimentChart";
import { TrendingTopics } from "../components/overview/TrendingTopics";
import { RecentEvents } from "../components/overview/RecentEvents";
import { PostCard } from "../components/feed/PostCard";
import { FeedFilters } from "../components/feed/FeedFilters";
import { CreatorCard } from "../components/creators/CreatorCard";
import { CreatorDetailModal } from "../components/creators/CreatorDetailModal";
import { AddCreatorModal } from "../components/creators/AddCreatorModal";
import { TickerLeaderboard } from "../components/market/TickerLeaderboard";
import { SectorBreakdown } from "../components/market/SectorBreakdown";
import { SpikesPanel } from "../components/market/SpikesPanel";
import { ConsensusCard } from "../components/insights/ConsensusCard";
import { AlertRuleManager } from "../components/alerts/AlertRuleManager";
import { NotificationDrawer } from "../components/alerts/NotificationDrawer";
import { IngestionControl } from "../components/settings/IngestionControl";
import { CostEstimator } from "../components/settings/CostEstimator";
import { TerminalLoginGate } from "../components/auth/TerminalLoginGate";
import {
  Creator,
  Post,
  OverviewStats,
  MarketIntelligence,
  ConsensusResponse,
  AlertRule,
  NotificationItem,
  IngestionStatus
} from "../types";
import { api, FinPulseWebSocket } from "../lib/api";
import {
  Users,
  Rss,
  TrendingUp,
  Activity,
  Sparkles,
  Bell,
  Coins,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Search,
  ExternalLink
} from "lucide-react";

export default function Home() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string>("Authorized Terminal Analyst");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userPicture, setUserPicture] = useState<string>("");

  const [currentTab, setCurrentTab] = useState<TabKey>("overview");
  const [wsConnected, setWsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddCreatorOpen, setIsAddCreatorOpen] = useState(false);
  const [selectedCreatorForDetail, setSelectedCreatorForDetail] = useState<Creator | null>(null);

  // Data states
  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsTotal, setPostsTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [marketIntel, setMarketIntel] = useState<MarketIntelligence | null>(null);
  const [consensus, setConsensus] = useState<ConsensusResponse | null>(null);
  const [alertRules, setAlertRules] = useState<AlertRule[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [ingestionStatus, setIngestionStatus] = useState<IngestionStatus | null>(null);

  // Filters state
  const [filters, setFilters] = useState<{
    creator_id?: number;
    sentiment?: string;
    topic?: string;
    symbol?: string;
    market_impact?: string;
    search?: string;
  }>({});

  // Check existing session token on mount
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("arthawire_auth_token") : null;
    const role = typeof window !== "undefined" ? localStorage.getItem("arthawire_auth_role") : null;
    const email = typeof window !== "undefined" ? localStorage.getItem("arthawire_auth_email") : null;
    const picture = typeof window !== "undefined" ? localStorage.getItem("arthawire_auth_picture") : null;
    if (token) {
      setIsAuthenticated(true);
      if (role) setUserRole(role);
      if (email) setUserEmail(email);
      if (picture) setUserPicture(picture);
    }
    setIsCheckingAuth(false);
  }, []);

  const handleLockTerminal = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("arthawire_auth_token");
      localStorage.removeItem("arthawire_auth_role");
      localStorage.removeItem("arthawire_auth_user");
      localStorage.removeItem("arthawire_auth_email");
      localStorage.removeItem("arthawire_auth_picture");
    }
    setIsAuthenticated(false);
    setUserEmail("");
    setUserPicture("");
  };

  const handleResetCreators = async () => {
    if (confirm("Reset to 3 curated Indian creators and free up 7 slots for your own handles?")) {
      try {
        await api.resetCreatorsToDefaults();
        loadCreators();
        loadOverview();
        loadPosts(1);
      } catch (err: any) {
        alert(err.message || "Failed to reset creators");
      }
    }
  };

  // Fetch initial data
  const loadOverview = useCallback(() => {
    api.getOverview().then(setOverview).catch(() => {});
  }, []);

  const loadCreators = useCallback(() => {
    api.getCreators().then(setCreators).catch(() => {});
  }, []);

  const loadPosts = useCallback(
    (p = 1) => {
      api
        .getPosts({ page: p, limit: 15, ...filters })
        .then((res) => {
          setPosts(res.posts);
          setPostsTotal(res.total);
          setPage(res.page);
        })
        .catch(() => {});
    },
    [filters]
  );

  const loadMarketIntel = useCallback(() => {
    api.getMarketIntelligence().then(setMarketIntel).catch(() => {});
  }, []);

  const loadConsensus = useCallback(() => {
    api.getConsensusInsights(72).then(setConsensus).catch(() => {});
  }, []);

  const loadAlertsAndNotifications = useCallback(() => {
    api.getAlertRules().then(setAlertRules).catch(() => {});
    api.getNotifications().then(setNotifications).catch(() => {});
  }, []);

  const loadIngestionStatus = useCallback(() => {
    api.getIngestionStatus().then(setIngestionStatus).catch(() => {});
  }, []);

  // Initial load
  useEffect(() => {
    loadOverview();
    loadCreators();
    loadPosts(1);
    loadMarketIntel();
    loadConsensus();
    loadAlertsAndNotifications();
    loadIngestionStatus();
  }, [
    loadOverview,
    loadCreators,
    loadPosts,
    loadMarketIntel,
    loadConsensus,
    loadAlertsAndNotifications,
    loadIngestionStatus
  ]);

  // WebSocket real-time subscription
  useEffect(() => {
    const ws = new FinPulseWebSocket();
    setWsConnected(true);

    const unsubscribe = ws.subscribe((event) => {
      if (event.type === "CONNECTION_ESTABLISHED") {
        setWsConnected(true);
      } else if (event.type === "NEW_POST") {
        // Prepend newly published post directly into feed in real time!
        const newPost = event.data;
        setPosts((prev) => [newPost, ...prev]);
        setPostsTotal((t) => t + 1);
        loadOverview();
        loadMarketIntel();
        loadConsensus();
      } else if (event.type === "NEW_ALERT") {
        setNotifications((prev) => [event.data, ...prev]);
      } else if (event.type === "SYNC_COMPLETED") {
        loadOverview();
        loadPosts(1);
        loadMarketIntel();
        loadConsensus();
      }
    });

    return () => {
      unsubscribe();
      ws.destroy();
    };
  }, [loadOverview, loadPosts, loadMarketIntel, loadConsensus]);

  // Handlers
  const handleSyncAll = async () => {
    setIsSyncing(true);
    try {
      await api.syncAllCreators();
      loadOverview();
      loadPosts(1);
      loadMarketIntel();
      loadConsensus();
      loadIngestionStatus();
    } catch {}
    finally {
      setIsSyncing(false);
    }
  };

  const handleSimulatePost = async () => {
    try {
      await api.simulateLivePost();
    } catch {}
  };

  const handleToggleCreator = async (id: number, currentStatus: boolean) => {
    try {
      await api.updateCreator(id, { is_active: !currentStatus });
      loadCreators();
      loadOverview();
    } catch {}
  };

  const handleDeleteCreator = async (id: number) => {
    if (confirm("Remove this creator from monitoring?")) {
      try {
        await api.deleteCreator(id);
        loadCreators();
        loadOverview();
      } catch {}
    }
  };

  const handleSyncCreator = async (id: number) => {
    try {
      await api.syncCreator(id);
      loadPosts(1);
      loadOverview();
    } catch {}
  };

  const handleMarkNotificationRead = async (id: number) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch {}
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch {}
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const activeCount = creators.filter((c) => c.is_active).length;

  // Authentication Gate Check
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#070A0F] flex items-center justify-center font-mono text-xs text-fin-muted">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <span>INITIALIZING ARTHAWIRE SECURITY NODE...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <TerminalLoginGate
        onAuthenticated={(role, name, email, picture) => {
          setIsAuthenticated(true);
          setUserRole(role);
          if (email) setUserEmail(email);
          if (picture) setUserPicture(picture);
          loadOverview();
          loadCreators();
          loadPosts(1);
          loadMarketIntel();
          loadConsensus();
          loadAlertsAndNotifications();
          loadIngestionStatus();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-fin-bg text-fin-text flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        wsConnected={wsConnected}
        isSyncing={isSyncing}
        onSync={handleSyncAll}
        onSimulate={handleSimulatePost}
        unreadNotificationsCount={unreadCount}
        onToggleNotifications={() => setIsDrawerOpen(true)}
        ingestionMode={ingestionStatus?.mode || "LIVE_X_API"}
        searchQuery={filters.search || ""}
        onLockTerminal={handleLockTerminal}
        userRole={userRole}
        userEmail={userEmail}
        userPicture={userPicture}
        onSearchChange={(q) => {
          setFilters((prev) => ({ ...prev, search: q }));
          if (currentTab !== "feed" && q.trim().length > 0) {
            setCurrentTab("feed");
          }
        }}
      />

      {/* Main Terminal Shell */}
      <div className="flex-1 flex overflow-hidden">
        {/* Persistent Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          activeCreatorsCount={activeCount}
          totalCreatorsCount={creators.length}
          onOpenAddCreator={() => setIsAddCreatorOpen(true)}
        />

        {/* Analytical Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6 space-y-5">
          {/* TAB 1: OVERVIEW */}
          {currentTab === "overview" && (
            <div className="space-y-5 max-w-[1600px] mx-auto">
              {/* Stat Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                <StatCard
                  title="Monitored Creators"
                  value={`${activeCount} / ${creators.length}`}
                  sublabel="Target: 10 Indian Market Creators"
                  trendColor="text-blue-400"
                  icon={<Users className="w-4 h-4 text-blue-400" />}
                />
                <StatCard
                  title="Total Posts Collected"
                  value={overview?.total_posts_collected || 0}
                  sublabel="Deduplicated & Checkpointed"
                  trendColor="text-emerald-400"
                  icon={<Rss className="w-4 h-4 text-emerald-400" />}
                />
                <StatCard
                  title="Posts Detected Today"
                  value={overview?.posts_detected_today || 0}
                  sublabel="Incremental Ingestion Stream"
                  trendColor="text-purple-400"
                  icon={<Activity className="w-4 h-4 text-purple-400" />}
                />
                <StatCard
                  title="Consensus Clusters"
                  value={consensus?.total_consensus_clusters || 0}
                  sublabel="Multi-Creator Discussion Overlaps"
                  trendColor="text-amber-400"
                  icon={<Sparkles className="w-4 h-4 text-amber-400" />}
                />
              </div>

              {/* Analytical Triad: Sentiment Donut, Trending Topics, Detected Events */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-1">
                  {overview && <SentimentChart distribution={overview.sentiment_distribution} />}
                </div>
                <div className="lg:col-span-1">
                  {overview && (
                    <TrendingTopics
                      topics={overview.trending_topics}
                      onSelectTopic={(t) => {
                        setFilters({ topic: t });
                        setCurrentTab("feed");
                      }}
                    />
                  )}
                </div>
                <div className="lg:col-span-1">
                  {overview && <RecentEvents events={overview.recent_events} />}
                </div>
              </div>

              {/* Live Intelligence Feed Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-fin-border pb-2">
                  <div>
                    <h3 className="text-xs font-mono font-semibold text-white uppercase tracking-wider">
                      Live Stream Intel Preview
                    </h3>
                    <p className="text-[11px] text-fin-muted">
                      Latest public commentary ingested & processed through FinBERT NLP
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentTab("feed")}
                    className="text-xs text-blue-400 hover:text-blue-300 font-mono flex items-center space-x-1"
                  >
                    <span>Inspect Full Feed ({postsTotal})</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {posts.slice(0, 4).map((p) => (
                    <PostCard
                      key={p.id}
                      post={p}
                      onSelectSymbol={(sym) => {
                        setFilters({ symbol: sym });
                        setCurrentTab("feed");
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE FEED */}
          {currentTab === "feed" && (
            <div className="space-y-4 max-w-[1400px] mx-auto">
              <FeedFilters
                creators={creators}
                selectedCreatorId={filters.creator_id}
                selectedSentiment={filters.sentiment}
                selectedTopic={filters.topic}
                selectedSymbol={filters.symbol}
                selectedMarketImpact={filters.market_impact}
                searchQuery={filters.search || ""}
                onFilterChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
                onReset={() => setFilters({})}
              />

              <div className="flex items-center justify-between text-xs text-fin-muted px-1 font-mono">
                <span>
                  Displaying {posts.length} of {postsTotal} indexed financial intelligence posts
                </span>
                <span className="flex items-center space-x-1.5 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Real-Time WebSocket Feed</span>
                </span>
              </div>

              <div className="space-y-3.5">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onSelectSymbol={(sym) => setFilters((prev) => ({ ...prev, symbol: sym }))}
                  />
                ))}

                {posts.length === 0 && (
                  <div className="bg-fin-card border border-fin-border rounded-lg p-12 text-center text-xs text-fin-muted space-y-2 font-mono">
                    <p className="text-sm font-semibold text-white">No intelligence posts matched criteria</p>
                    <p>Adjust your surveillance filters or trigger an incremental sync above.</p>
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              {postsTotal > 15 && (
                <div className="flex items-center justify-center space-x-3 pt-3">
                  <button
                    onClick={() => loadPosts(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded bg-fin-card border border-fin-border text-fin-muted hover:text-white disabled:opacity-40 transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono text-fin-secondaryText tabular-nums">
                    Page {page} of {Math.ceil(postsTotal / 15)}
                  </span>
                  <button
                    onClick={() => loadPosts(page + 1)}
                    disabled={page * 15 >= postsTotal}
                    className="p-1.5 rounded bg-fin-card border border-fin-border text-fin-muted hover:text-white disabled:opacity-40 transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CREATOR DIRECTORY */}
          {currentTab === "creators" && (
            <div className="space-y-4 max-w-[1600px] mx-auto">
              <div className="flex items-center justify-between border-b border-fin-border pb-3">
                <div>
                  <h3 className="text-xs font-mono font-semibold text-white tracking-wider uppercase">
                    Monitored Indian Financial Creators
                  </h3>
                  <p className="text-[11px] text-fin-muted">
                    Surveillance cohort of curated Dalal Street market commentators with posting frequency and company focus
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleResetCreators}
                    title="Resets database to 3 curated creators, freeing up 7 slots for your own choices"
                    className="px-2.5 py-1.5 text-xs font-mono font-medium bg-fin-card hover:bg-fin-hover text-fin-secondaryText hover:text-white border border-fin-border rounded transition"
                  >
                    Reset to 3 Creators (7 Free Slots)
                  </button>
                  <button
                    onClick={() => setIsAddCreatorOpen(true)}
                    disabled={creators.length >= 10}
                    className="px-3 py-1.5 text-xs font-mono font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded transition disabled:opacity-50"
                  >
                    Add Creator ({creators.length}/10)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {creators.map((c) => (
                  <CreatorCard
                    key={c.id}
                    creator={c}
                    onToggleActive={handleToggleCreator}
                    onSync={handleSyncCreator}
                    onOpenDetails={setSelectedCreatorForDetail}
                    onDelete={handleDeleteCreator}
                  />
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: MARKET INTELLIGENCE */}
          {currentTab === "market" && (
            <div className="space-y-4 max-w-[1600px] mx-auto">
              {marketIntel && (
                <>
                  <TickerLeaderboard
                    companies={marketIntel.trending_companies}
                    onSelectSymbol={(sym) => {
                      setFilters({ symbol: sym });
                      setCurrentTab("feed");
                    }}
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <SectorBreakdown sectors={marketIntel.trending_sectors} />
                    <SpikesPanel spikes={marketIntel.unusual_spikes} />
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 5: AI CONSENSUS INSIGHTS */}
          {currentTab === "insights" && (
            <div className="space-y-4 max-w-[1400px] mx-auto">
              <div className="flex items-center justify-between border-b border-fin-border pb-3">
                <div>
                  <h3 className="text-xs font-mono font-semibold text-white tracking-wider uppercase">
                    Cross-Creator Consensus & Divergence Briefings
                  </h3>
                  <p className="text-[11px] text-fin-muted">
                    Automated multi-creator synthesis when 2 or more monitored accounts concurrently discuss the same Dalal Street company
                  </p>
                </div>
                <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  {consensus?.total_consensus_clusters || 0} Clusters Identified
                </span>
              </div>

              <div className="space-y-3.5">
                {consensus?.insights.map((ins) => (
                  <ConsensusCard key={ins.symbol} insight={ins} />
                ))}

                {(!consensus || consensus.insights.length === 0) && (
                  <div className="bg-fin-card border border-fin-border rounded-lg p-12 text-center text-xs text-fin-muted space-y-2 font-mono">
                    <p className="text-sm font-semibold text-white">No multi-creator consensus clusters active</p>
                    <p>
                      Trigger a sync or use the "Simulate Post" action in the navbar to observe cross-creator synthesis.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: ALERTS & RULES */}
          {currentTab === "alerts" && (
            <div className="space-y-4 max-w-[1400px] mx-auto">
              <AlertRuleManager
                rules={alertRules}
                onRulesUpdated={loadAlertsAndNotifications}
              />
            </div>
          )}

          {/* TAB 7: X API & COST CALCULATOR */}
          {currentTab === "settings" && (
            <div className="space-y-4 max-w-[1400px] mx-auto">
              <IngestionControl
                status={ingestionStatus}
                onSyncAll={handleSyncAll}
                isSyncing={isSyncing}
              />
              <CostEstimator />
            </div>
          )}
        </main>
      </div>

      {/* Modals & Slide-out Drawers */}
      <NotificationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkNotificationRead}
        onMarkAllRead={handleMarkAllNotificationsRead}
      />

      <AddCreatorModal
        isOpen={isAddCreatorOpen}
        onClose={() => setIsAddCreatorOpen(false)}
        onCreatorAdded={() => {
          loadCreators();
          loadOverview();
        }}
        currentCount={creators.length}
      />

      <CreatorDetailModal
        creator={selectedCreatorForDetail}
        onClose={() => setSelectedCreatorForDetail(null)}
      />
    </div>
  );
}
