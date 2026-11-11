"use client";

import React, { useEffect, useState } from "react";
import { X, ExternalLink, Calendar, BarChart3, TrendingUp, Shield } from "lucide-react";
import { Creator, CreatorAnalytics } from "../../types";
import { api } from "../../lib/api";
import { SentimentChart } from "../overview/SentimentChart";

interface CreatorDetailModalProps {
  creator: Creator | null;
  onClose: () => void;
}

export const CreatorDetailModal: React.FC<CreatorDetailModalProps> = ({ creator, onClose }) => {
  const [analytics, setAnalytics] = useState<CreatorAnalytics | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (creator) {
      setLoading(true);
      api
        .getCreatorAnalytics(creator.id)
        .then((data) => setAnalytics(data))
        .catch(() => { })
        .finally(() => setLoading(false));
    }
  }, [creator]);

  if (!creator) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-fin-secondary border border-fin-border rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-5 space-y-5 text-white shadow-card">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-fin-border pb-3">
          <div className="flex items-center space-x-3.5">
            <img
              src={
                creator.profile_image_url ||
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
              }
              alt={creator.display_name}
              className="w-12 h-12 rounded-full border border-fin-border object-cover"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold">{creator.display_name}</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {creator.is_active ? "ACTIVE" : "PAUSED"}
                </span>
              </div>
              <a
                href={`https://x.com/${creator.username}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 font-mono flex items-center space-x-1"
              >
                <span>@{creator.username}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <p className="text-[11px] text-slate-300 mt-1 max-w-xl">{creator.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded bg-fin-elevated text-fin-muted hover:text-white border border-fin-border transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-fin-muted font-mono animate-pulse">
            Compiling intelligence dossier for @{creator.username}...
          </div>
        ) : analytics ? (
          <div className="space-y-5">
            {/* Top Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
              <div className="p-3 rounded bg-fin-card border border-fin-border">
                <span className="text-[10px] text-fin-muted block uppercase">Total Tracked</span>
                <span className="text-lg font-bold text-white tabular-nums">
                  {analytics.total_posts}
                </span>
              </div>
              <div className="p-3 rounded bg-fin-card border border-fin-border">
                <span className="text-[10px] text-fin-muted block uppercase">Posts This Week</span>
                <span className="text-lg font-bold text-emerald-400 tabular-nums">
                  {analytics.posts_this_week}
                </span>
              </div>
              <div className="p-3 rounded bg-fin-card border border-fin-border">
                <span className="text-[10px] text-fin-muted block uppercase">Primary Focus</span>
                <span className="text-xs font-bold text-blue-400 truncate block mt-1">
                  ${analytics.top_discussed_companies[0]?.symbol || "Diverse"}
                </span>
              </div>
              <div className="p-3 rounded bg-fin-card border border-fin-border">
                <span className="text-[10px] text-fin-muted block uppercase">Primary Sector</span>
                <span className="text-xs font-bold text-purple-300 truncate block mt-1">
                  {analytics.top_discussed_sectors[0]?.sector || "Multi-Sector"}
                </span>
              </div>
            </div>

            {/* Middle Grid: Sentiment Chart & Top Companies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SentimentChart distribution={analytics.sentiment_distribution} />

              <div className="bg-fin-card border border-fin-border rounded-lg p-4 space-y-3 shadow-terminal">
                <h4 className="text-xs font-mono font-semibold text-white uppercase tracking-wider">
                  Most Discussed Indian Companies
                </h4>
                <div className="space-y-1.5 max-h-[220px] overflow-y-auto">
                  {analytics.top_discussed_companies.map((c) => (
                    <div
                      key={c.symbol}
                      className="flex items-center justify-between p-2 rounded bg-fin-elevated/60 border border-fin-border text-xs"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-emerald-400">${c.symbol}</span>
                        <span className="text-slate-300 truncate max-w-[150px]">{c.name}</span>
                      </div>
                      <span className="font-mono font-bold text-white tabular-nums">
                        {c.mentions} posts
                      </span>
                    </div>
                  ))}
                  {analytics.top_discussed_companies.length === 0 && (
                    <p className="text-xs text-fin-muted py-6 text-center font-mono">
                      No company mentions recorded yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
