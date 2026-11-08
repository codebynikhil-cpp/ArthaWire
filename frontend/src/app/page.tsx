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
  RefreshCw
} from "lucide-react";

export default function Home() {
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
      // WebSocket will receive event and automatically prepend to stream
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

  return (
    <div className="min-h-screen bg-[#070b12] text-gray-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        wsConnected={wsConnected}
        isSyncing={isSyncing}
        onSync={handleSyncAll}
        onSimulate={handleSimulatePost}
        unreadNotificationsCount={unreadCount}
        onToggleNotifications={() => setIsDrawerOpen(true)}
        ingestionMode={ingestionStatus?.mode || "SIMULATION"}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          activeCreatorsCount={activeCount}
          totalCreatorsCount={creators.length}
          onOpenAddCreator={() => setIsAddCreatorOpen(true)}
        />

        {/* Main Workspace Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {currentTab === "overview" && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Monitored Creators"
                  value={`${activeCount} / ${creators.length}`}
                  sublabel="10 max capacity limit"
                  trendColor="text-blue-400"
                  icon={<Users className="w-5 h-5 text-blue-400" />}
                />
                <StatCard
                  title="Total Posts Ingested"
                  value={overview?.total_posts_collected || 0}
                  sublabel="Deduplicated & indexed"
                  trendColor="text-emerald-400"
                  icon={<Rss className="w-5 h-5 text-emerald-400" />}
                />
                <StatCard
                  title="Detected Today"
                  value={overview?.posts_detected_today || 0}
                  sublabel="Real-time ingestion"
                  trendColor="text-purple-400"
                  icon={<Activity className="w-5 h-5 text-purple-400" />}
                />
                <StatCard
                  title="Consensus Clusters"
                  value={consensus?.total_consensus_clusters || 0}
                  sublabel="Multi-creator discussions"
                  trendColor="text-amber-400"
                  icon={<Sparkles className="w-5 h-5 text-amber-400" />}
                />
              </div>

              {/* Middle Row: Sentiment & Trending Topics */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

              {/* Quick Live Feed Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Live Intelligence Stream</h3>
                    <p className="text-xs text-gray-400">Newly analyzed commentary across Dalal Street</p>
                  </div>
                  <button
                    onClick={() => setCurrentTab("feed")}
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                  >
                    View All {postsTotal} Posts →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="space-y-5">
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

              <div className="flex items-center justify-between text-xs text-gray-400 px-1">
                <span>
                  Showing {posts.length} of {postsTotal} monitored financial posts
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Auto-updating via WebSockets</span>
                </span>
              </div>

              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onSelectSymbol={(sym) => setFilters((prev) => ({ ...prev, symbol: sym }))}
                  />
                ))}

                {posts.length === 0 && (
                  <div className="bg-[#111726] border border-gray-800 rounded-xl p-12 text-center text-xs text-gray-400 space-y-2">
                    <p className="text-sm font-semibold text-gray-300">No posts matched current filters</p>
                    <p>Try resetting filters or triggering a new ingestion poll.</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {postsTotal > 15 && (
                <div className="flex items-center justify-center space-x-3 pt-4">
                  <button
                    onClick={() => loadPosts(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono text-gray-400">
                    Page {page} of {Math.ceil(postsTotal / 15)}
                  </span>
                  <button
                    onClick={() => loadPosts(page + 1)}
                    disabled={page * 15 >= postsTotal}
                    className="p-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CREATOR ANALYTICS */}
          {currentTab === "creators" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Monitored Indian Financial Creators</h3>
                  <p className="text-xs text-gray-400">
                    Tracking up to 10 verified creators with posting frequency, sentiment and company coverage
                  </p>
                </div>
                <button
                  onClick={() => setIsAddCreatorOpen(true)}
                  disabled={creators.length >= 10}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition disabled:opacity-50"
                >
                  Add Creator ({creators.length}/10)
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <div className="space-y-6">
              {marketIntel && (
                <>
                  <TickerLeaderboard
                    companies={marketIntel.trending_companies}
                    onSelectSymbol={(sym) => {
                      setFilters({ symbol: sym });
                      setCurrentTab("feed");
                    }}
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SectorBreakdown sectors={marketIntel.trending_sectors} />
                    <SpikesPanel spikes={marketIntel.unusual_spikes} />
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 5: AI CONSENSUS INSIGHTS */}
          {currentTab === "insights" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Multi-Creator Consensus & Divergence Briefings
                  </h3>
                  <p className="text-xs text-gray-400">
                    Aggregated intelligence when 2 or more financial creators discuss the same stock or theme
                  </p>
                </div>
                <span className="text-xs font-mono text-purple-400">
                  {consensus?.total_consensus_clusters || 0} Clusters Active
                </span>
              </div>

              <div className="space-y-4">
                {consensus?.insights.map((ins) => (
                  <ConsensusCard key={ins.symbol} insight={ins} />
                ))}

                {(!consensus || consensus.insights.length === 0) && (
                  <div className="bg-[#111726] border border-gray-800 rounded-xl p-12 text-center text-xs text-gray-400 space-y-2">
                    <p className="text-sm font-semibold text-gray-300">No multi-creator clusters detected</p>
                    <p>
                      Trigger a sync or simulate posts from multiple creators discussing Reliance or HDFC Bank to observe consensus clustering.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: ALERTS & RULES */}
          {currentTab === "alerts" && (
            <div className="space-y-6">
              <AlertRuleManager
                rules={alertRules}
                onRulesUpdated={loadAlertsAndNotifications}
              />
            </div>
          )}

          {/* TAB 7: X API & COST CALCULATOR */}
          {currentTab === "settings" && (
            <div className="space-y-6">
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
