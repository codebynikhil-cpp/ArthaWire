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
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [creator]);

  if (!creator) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#111726] border border-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 space-y-6 text-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-gray-800 pb-4">
          <div className="flex items-center space-x-4">
            <img
              src={
                creator.profile_image_url ||
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
              }
              alt={creator.display_name}
              className="w-14 h-14 rounded-full border border-gray-700 object-cover"
            />
            <div>
              <h2 className="text-lg font-bold">{creator.display_name}</h2>
              <a
                href={`https://x.com/${creator.username}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 font-mono flex items-center space-x-1"
              >
                <span>@{creator.username}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <p className="text-xs text-gray-400 mt-1 max-w-xl">{creator.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-gray-400 animate-pulse">
            Loading analytics for @{creator.username}...
          </div>
        ) : analytics ? (
          <div className="space-y-6">
            {/* Top Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-gray-900/60 border border-gray-800">
                <span className="text-[11px] text-gray-400 block uppercase">Total Tracked</span>
                <span className="text-xl font-mono font-bold text-white">
                  {analytics.total_posts}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-gray-900/60 border border-gray-800">
                <span className="text-[11px] text-gray-400 block uppercase">Posts This Week</span>
                <span className="text-xl font-mono font-bold text-emerald-400">
                  {analytics.posts_this_week}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-gray-900/60 border border-gray-800">
                <span className="text-[11px] text-gray-400 block uppercase">Top Stock Focus</span>
                <span className="text-sm font-mono font-bold text-blue-400 truncate block">
                  {analytics.top_discussed_companies[0]?.symbol || "Diverse"}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-gray-900/60 border border-gray-800">
                <span className="text-[11px] text-gray-400 block uppercase">Top Sector</span>
                <span className="text-sm font-medium text-purple-400 truncate block">
                  {analytics.top_discussed_sectors[0]?.sector || "General"}
                </span>
              </div>
            </div>

            {/* Sentiment & Sectors Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SentimentChart distribution={analytics.sentiment_distribution} />

              {/* Top Discussed Equities */}
              <div className="bg-[#111726] border border-gray-800 rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-semibold text-white">Most Discussed Companies</h3>
                <div className="space-y-2">
                  {analytics.top_discussed_companies.map((comp) => (
                    <div
                      key={comp.symbol}
                      className="flex items-center justify-between p-2 rounded-lg bg-gray-900/40 border border-gray-800 text-xs"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-emerald-400">${comp.symbol}</span>
                        <span className="text-gray-300 truncate max-w-[150px]">{comp.name}</span>
                      </div>
                      <span className="font-mono text-gray-400">{comp.mentions} mentions</span>
                    </div>
                  ))}
                  {analytics.top_discussed_companies.length === 0 && (
                    <p className="text-xs text-gray-400 py-4 text-center">No specific company mentions</p>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Posts History */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white">Recent Historical Commentary</h3>
              <div className="space-y-2">
                {analytics.recent_posts.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-lg bg-gray-900/40 border border-gray-800 text-xs space-y-1.5"
                  >
                    <p className="text-gray-200">{p.text}</p>
                    <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                      <span className="font-mono">{p.created_at.slice(0, 10)}</span>
                      <a
                        href={p.post_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                      >
                        <span>View X Post</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
