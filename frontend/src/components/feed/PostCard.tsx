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
  Info,
  ShieldCheck,
  Tag
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
        return "bg-slate-500/10 text-slate-300 border-slate-500/30";
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
          className: "bg-slate-500/10 text-slate-400 border-slate-500/30",
          icon: <Info className="w-3 h-3 text-slate-400" />
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
        minute: "2-digit",
        hour12: false
      });
    } catch {
      return dateStr;
    }
  };

  const analysis = post.analysis;
  const impactInfo = getImpactBadge(analysis?.market_impact);

  return (
    <article className="bg-fin-card border border-fin-border rounded-lg p-4 hover:border-slate-700/60 transition space-y-3 shadow-terminal">
      {/* Header: Creator Identity, Timestamp & Badges */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center space-x-3 min-w-0">
          <img
            src={
              post.creator.profile_image_url ||
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
            }
            alt={post.creator.display_name}
            className="w-9 h-9 rounded-full border border-fin-border object-cover shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-xs text-white truncate">
                {post.creator.display_name}
              </span>
              <span className="text-[11px] text-fin-muted font-mono shrink-0">
                @{post.creator.username}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-[10px] text-fin-muted font-mono">
              <time dateTime={post.created_at}>{formatTimestamp(post.created_at)}</time>
              {analysis?.model_version && (
                <>
                  <span>•</span>
                  <span>{analysis.model_version}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Sentiment & Market Impact Badges */}
        <div className="flex items-center space-x-1.5 shrink-0">
          {analysis && (
            <span
              className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${getSentimentBadge(
                analysis.sentiment
              )}`}
            >
              {analysis.sentiment}
            </span>
          )}
          {analysis?.market_impact && (
            <span
              className={`hidden sm:inline-flex items-center space-x-1 text-[10px] font-medium px-2 py-0.5 rounded border ${impactInfo.className}`}
            >
              {impactInfo.icon}
              <span>{analysis.market_impact}</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Post Text with High Contrast Typography */}
      <p className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line select-text">
        {post.text}
      </p>

      {/* Entities & Topics Row */}
      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        {analysis?.topic && (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/25">
            {analysis.topic}
          </span>
        )}

        {post.entities.map((ent) => (
          <button
            key={ent.id}
            onClick={() => onSelectSymbol && onSelectSymbol(ent.symbol)}
            title={`Filter posts discussing ${ent.name}`}
            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 transition"
          >
            ${ent.symbol}
          </button>
        ))}

        {analysis?.event_type && (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/25">
            Event: {analysis.event_type}
          </span>
        )}
      </div>

      {/* AI Financial Intelligence Drawer */}
      {analysis && (
        <div className="pt-1">
          <button
            onClick={() => setShowAnalysis(!showAnalysis)}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded bg-fin-elevated/70 hover:bg-fin-hover border border-fin-border text-[11px] font-medium text-fin-secondaryText transition"
          >
            <div className="flex items-center space-x-2 text-blue-400 font-mono">
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>AI FINANCIAL INTELLIGENCE DOSSIER</span>
            </div>
            {showAnalysis ? (
              <ChevronUp className="w-3.5 h-3.5 text-fin-muted" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-fin-muted" />
            )}
          </button>

          {showAnalysis && (
            <div className="mt-2 p-3.5 rounded bg-fin-elevated border border-blue-500/20 text-xs space-y-3">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-blue-300 block mb-1">
                  Executive Summary
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">{analysis.summary}</p>
              </div>

              {analysis.main_arguments && analysis.main_arguments.length > 0 && (
                <div>
                  <span className="font-mono text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Key Financial Arguments
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-300 text-[11px]">
                    {analysis.main_arguments.map((arg, i) => (
                      <li key={i}>{arg}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Identified Risks vs Opportunities */}
              {analysis.risks_and_opportunities && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {analysis.risks_and_opportunities.risks?.length > 0 && (
                    <div className="p-2 rounded bg-rose-500/10 border border-rose-500/20">
                      <span className="font-mono text-[10px] uppercase font-bold text-rose-400 block mb-1">
                        Risks Discussed
                      </span>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-300 text-[10px]">
                        {analysis.risks_and_opportunities.risks.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysis.risks_and_opportunities.opportunities?.length > 0 && (
                    <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
                      <span className="font-mono text-[10px] uppercase font-bold text-emerald-400 block mb-1">
                        Potential Upside / Triggers
                      </span>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-300 text-[10px]">
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
                <div className="text-[10px] text-slate-400 pt-1 border-t border-fin-border font-mono">
                  <span className="font-bold text-slate-300">Empirical Figures: </span>
                  {analysis.supporting_evidence}
                </div>
              )}

              {/* Strict separation of opinion vs fact */}
              <div className="text-[10px] text-fin-muted pt-1 border-t border-fin-border flex items-center justify-between">
                <span>Provenance: {analysis.creator_opinion_summary}</span>
                <span className="font-mono text-slate-400">Personal Research • Not Trading Advice</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer: Monospace Engagement Metrics & Direct X Link */}
      <div className="flex items-center justify-between pt-2 border-t border-fin-border text-[11px] text-fin-muted">
        <div className="flex items-center space-x-4 font-mono tabular-nums">
          <div className="flex items-center space-x-1" title="Likes">
            <Heart className="w-3.5 h-3.5 text-slate-500" />
            <span>{post.metrics?.like_count?.toLocaleString() || 0}</span>
          </div>
          <div className="flex items-center space-x-1" title="Reposts">
            <Repeat2 className="w-3.5 h-3.5 text-slate-500" />
            <span>{post.metrics?.repost_count?.toLocaleString() || 0}</span>
          </div>
          <div className="flex items-center space-x-1" title="Replies">
            <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
            <span>{post.metrics?.reply_count?.toLocaleString() || 0}</span>
          </div>
        </div>

        <a
          href={post.post_url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 font-medium transition"
        >
          <span>View on X</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </article>
  );
};
