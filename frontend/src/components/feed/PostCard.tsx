"use client";

import React, { useState } from "react";
import {
  ExternalLink,
  Heart,
  Repeat2,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Info
} from "lucide-react";
import { Post, SentimentType, MarketImpactType } from "../../types";

interface PostCardProps {
  post: Post;
  onSelectSymbol?: (symbol: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onSelectSymbol }) => {
  const [showAnalysis, setShowAnalysis] = useState(false);

  const getSentimentBadge = (sentiment?: SentimentType) => {
    switch (sentiment) {
      case "Positive":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "Negative":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      case "Mixed":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    }
  };

  const getImpactBadge = (impact?: MarketImpactType) => {
    switch (impact) {
      case "Potentially bullish":
        return {
          className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
          icon: <TrendingUp className="w-3 h-3 text-emerald-400" />
        };
      case "Potentially bearish":
        return {
          className: "bg-rose-500/10 text-rose-400 border-rose-500/30",
          icon: <TrendingDown className="w-3 h-3 text-rose-400" />
        };
      case "Unclear":
        return {
          className: "bg-amber-500/10 text-amber-400 border-amber-500/30",
          icon: <AlertCircle className="w-3 h-3 text-amber-400" />
        };
      default:
        return {
          className: "bg-gray-500/10 text-gray-400 border-gray-500/30",
          icon: <Info className="w-3 h-3 text-gray-400" />
        };
    }
  };

  const formatTimestamp = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return dateStr;
    }
  };

  const analysis = post.analysis;
  const impactInfo = getImpactBadge(analysis?.market_impact);

  return (
    <article className="bg-[#111726] border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition space-y-3.5">
      {/* Header: Creator info & Timestamp */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={
              post.creator.profile_image_url ||
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
            }
            alt={post.creator.display_name}
            className="w-10 h-10 rounded-full border border-gray-700 object-cover"
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm text-white">{post.creator.display_name}</span>
              <span className="text-xs text-gray-400 font-mono">@{post.creator.username}</span>
            </div>
            <span className="text-[11px] text-gray-400">{formatTimestamp(post.created_at)}</span>
          </div>
        </div>

        {/* Sentiment & Impact Badges */}
        <div className="flex items-center space-x-2">
          {analysis && (
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getSentimentBadge(
                analysis.sentiment
              )}`}
            >
              {analysis.sentiment}
            </span>
          )}
          {analysis?.market_impact && (
            <span
              className={`hidden sm:inline-flex items-center space-x-1 text-xs font-medium px-2.5 py-0.5 rounded-full border ${impactInfo.className}`}
            >
              {impactInfo.icon}
              <span>{analysis.market_impact}</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Post Text */}
      <p className="text-sm text-gray-200 leading-relaxed font-sans whitespace-pre-line">
        {post.text}
      </p>

      {/* Tags: Topic & Detected Financial Entities */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        {analysis?.topic && (
          <span className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-blue-900/30 text-blue-300 border border-blue-700/40">
            {analysis.topic}
          </span>
        )}

        {post.entities.map((ent) => (
          <button
            key={ent.id}
            onClick={() => onSelectSymbol && onSelectSymbol(ent.symbol)}
            className="text-xs font-mono font-medium px-2 py-0.5 rounded-md bg-gray-800 hover:bg-gray-750 text-emerald-400 hover:text-emerald-300 border border-gray-700 transition"
          >
            ${ent.symbol}
          </button>
        ))}

        {analysis?.event_type && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-purple-900/30 text-purple-300 border border-purple-700/40">
            Event: {analysis.event_type}
          </span>
        )}
      </div>

      {/* AI Financial Analysis Drawer */}
      {analysis && (
        <div className="pt-2">
          <button
            onClick={() => setShowAnalysis(!showAnalysis)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-gray-900/60 hover:bg-gray-850 border border-gray-800 text-xs font-medium text-gray-300 transition"
          >
            <div className="flex items-center space-x-2 text-blue-400">
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>AI Financial Intelligence Briefing</span>
            </div>
            {showAnalysis ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showAnalysis && (
            <div className="mt-2.5 p-3.5 rounded-lg bg-[#0d121d] border border-blue-900/30 text-xs space-y-3">
              <div>
                <span className="font-semibold text-blue-300 block mb-1">Executive Summary</span>
                <p className="text-gray-300 leading-relaxed">{analysis.summary}</p>
              </div>

              {analysis.main_arguments && analysis.main_arguments.length > 0 && (
                <div>
                  <span className="font-semibold text-gray-300 block mb-1">Key Financial Arguments</span>
                  <ul className="list-disc list-inside space-y-1 text-gray-400">
                    {analysis.main_arguments.map((arg, i) => (
                      <li key={i}>{arg}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Risks & Opportunities */}
              {analysis.risks_and_opportunities && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {analysis.risks_and_opportunities.risks?.length > 0 && (
                    <div className="p-2 rounded bg-rose-950/20 border border-rose-900/30">
                      <span className="font-semibold text-rose-400 block mb-1">Risks Identified</span>
                      <ul className="list-disc list-inside space-y-0.5 text-gray-400">
                        {analysis.risks_and_opportunities.risks.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysis.risks_and_opportunities.opportunities?.length > 0 && (
                    <div className="p-2 rounded bg-emerald-950/20 border border-emerald-900/30">
                      <span className="font-semibold text-emerald-400 block mb-1">
                        Opportunities / Upside
                      </span>
                      <ul className="list-disc list-inside space-y-0.5 text-gray-400">
                        {analysis.risks_and_opportunities.opportunities.map((o, i) => (
                          <li key={i}>{o}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Supporting Evidence */}
              {analysis.supporting_evidence && (
                <div className="text-gray-400 text-[11px] pt-1 border-t border-gray-800">
                  <span className="font-medium text-gray-300">Empirical Figures: </span>
                  {analysis.supporting_evidence}
                </div>
              )}

              {/* Opinion separation notice */}
              <div className="text-[10px] text-gray-400 italic pt-1 border-t border-gray-800/60 flex items-center space-x-1">
                <span>Classification: {analysis.creator_opinion_summary}</span>
                <span>• Research assessment only; not financial advice.</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer: Metrics & Source Link */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-800/80 text-xs text-gray-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Heart className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-mono">{post.metrics?.like_count || 0}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Repeat2 className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-mono">{post.metrics?.repost_count || 0}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-mono">{post.metrics?.reply_count || 0}</span>
          </div>
        </div>

        <a
          href={post.post_url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 font-medium transition"
        >
          <span>Original Post</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </article>
  );
};
