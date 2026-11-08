"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Users,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Scale,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { ConsensusInsight, SentimentType } from "../../types";

interface ConsensusCardProps {
  insight: ConsensusInsight;
}

export const ConsensusCard: React.FC<ConsensusCardProps> = ({ insight }) => {
  const [expanded, setExpanded] = useState(true);

  const getSentimentPill = (sentiment: string) => {
    if (sentiment.includes("Bullish") || sentiment === "Positive") {
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    }
    if (sentiment.includes("Bearish") || sentiment === "Negative") {
      return "bg-rose-500/10 text-rose-400 border-rose-500/30";
    }
    if (sentiment === "Mixed") {
      return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    }
    return "bg-gray-500/10 text-gray-400 border-gray-500/30";
  };

  return (
    <div className="bg-[#111726] border border-blue-900/30 rounded-xl p-5 space-y-4 hover:border-blue-700/40 transition">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-600/15 border border-blue-500/30 text-blue-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-base text-emerald-400">
                ${insight.symbol}
              </span>
              <span className="text-white font-semibold text-sm">{insight.company_name}</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-400 mt-0.5">
              <span>Main Topic: <strong className="text-gray-300">{insight.main_topic}</strong></span>
              <span>•</span>
              <span className="flex items-center space-x-1 text-blue-300">
                <Users className="w-3 h-3" />
                <span>{insight.creators_count} Creators Discussing</span>
              </span>
            </div>
          </div>
        </div>

        {/* Overall consensus sentiment badge */}
        <div className="flex items-center space-x-2">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full border ${getSentimentPill(
              insight.overall_sentiment
            )}`}
          >
            {insight.overall_sentiment}
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg bg-gray-900 text-gray-400 hover:text-white transition"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="space-y-4 text-xs">
          {/* Participating Creators */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-gray-400">Discussed by:</span>
            {insight.creator_names.map((name) => (
              <span
                key={name}
                className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-medium border border-gray-700/60"
              >
                {name}
              </span>
            ))}
          </div>

          {/* Common Arguments (Agreement) */}
          {insight.common_arguments.length > 0 && (
            <div className="p-3.5 rounded-lg bg-gray-900/50 border border-gray-800 space-y-2">
              <span className="font-semibold text-blue-300 flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Consensus & Common Arguments</span>
              </span>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                {insight.common_arguments.map((arg, idx) => (
                  <li key={idx} className="leading-relaxed">{arg}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Divergent Opinions (Differences in creator views) */}
          {insight.divergent_opinions.length > 0 && (
            <div className="p-3.5 rounded-lg bg-gray-900/50 border border-gray-800 space-y-2.5">
              <span className="font-semibold text-amber-300 flex items-center space-x-1.5">
                <Scale className="w-3.5 h-3.5 text-amber-400" />
                <span>Differences in Creator Opinions & Divergence</span>
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {insight.divergent_opinions.map((op, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded bg-gray-900 border border-gray-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{op.creator}</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getSentimentPill(
                          op.sentiment
                        )}`}
                      >
                        {op.sentiment}
                      </span>
                    </div>
                    <p className="text-gray-300 text-[11px] leading-relaxed">{op.stance}</p>
                    <a
                      href={op.post_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1 text-[10px] text-blue-400 hover:text-blue-300 pt-0.5"
                    >
                      <span>Original Post</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Links to all original posts */}
          <div className="pt-2 border-t border-gray-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-400">
            <span>Original Evidence Sources ({insight.original_post_links.length} X Posts):</span>
            <div className="flex flex-wrap items-center gap-2">
              {insight.original_post_links.map((link, idx) => (
                <a
                  key={idx}
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2 py-0.5 rounded bg-gray-800 hover:bg-gray-750 text-blue-400 flex items-center space-x-1 border border-gray-700 transition"
                >
                  <span>Post #{idx + 1}</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
