"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Users,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Scale,
  CheckCircle2,
  FileText
} from "lucide-react";
import { ConsensusInsight } from "../../types";

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
    return "bg-slate-500/10 text-slate-300 border-slate-500/30";
  };

  return (
    <div className="bg-fin-card border border-blue-500/20 rounded-lg p-4 space-y-3.5 hover:border-blue-500/35 transition shadow-terminal">
      {/* Header: Company, Topic, Creators Count & Overall Sentiment */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-fin-border pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded bg-blue-500/10 border border-blue-500/25 text-blue-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-sm text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                ${insight.symbol}
              </span>
              <span className="text-white font-semibold text-xs">{insight.company_name}</span>
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-fin-muted mt-0.5 font-mono">
              <span>Topic: <strong className="text-slate-300 font-sans">{insight.main_topic}</strong></span>
              <span>•</span>
              <span className="flex items-center space-x-1 text-blue-400 font-semibold">
                <Users className="w-3 h-3" />
                <span>{insight.creators_count} Creators Discussing</span>
              </span>
            </div>
          </div>
        </div>

        {/* Overall Sentiment Badge & Accordion Toggle */}
        <div className="flex items-center space-x-2 shrink-0">
          <span
            className={`text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full border ${getSentimentPill(
              insight.overall_sentiment
            )}`}
          >
            {insight.overall_sentiment}
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded bg-fin-elevated text-fin-muted hover:text-white border border-fin-border transition"
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="space-y-3.5 text-xs">
          {/* Participating Creators Attribution */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-fin-muted font-mono">Monitored Creators:</span>
            {insight.creator_names.map((name) => (
              <span
                key={name}
                className="px-2 py-0.5 rounded bg-fin-elevated text-slate-300 font-mono text-[10px] border border-fin-border"
              >
                {name}
              </span>
            ))}
          </div>

          {/* Common Arguments (Consensus Agreement) */}
          {insight.common_arguments.length > 0 && (
            <div className="p-3 rounded bg-fin-elevated/70 border border-fin-border space-y-1.5">
              <span className="font-mono text-[10px] uppercase font-bold text-blue-300 flex items-center space-x-1.5">
                <CheckCircle2 className="w-3 h-3 text-blue-400" />
                <span>Consensus & Overlapping Financial Arguments</span>
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                {insight.common_arguments.map((arg, idx) => (
                  <li key={idx} className="leading-relaxed">{arg}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Divergent Opinions (Contrasting Views) */}
          {insight.divergent_opinions.length > 0 && (
            <div className="p-3 rounded bg-fin-elevated/70 border border-fin-border space-y-2">
              <span className="font-mono text-[10px] uppercase font-bold text-amber-300 flex items-center space-x-1.5">
                <Scale className="w-3 h-3 text-amber-400" />
                <span>Differing Creator Theses & Market Divergence</span>
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {insight.divergent_opinions.map((op, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded bg-fin-card border border-fin-border space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white text-[11px] font-mono">{op.creator}</span>
                      <span
                        className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border ${getSentimentPill(
                          op.sentiment
                        )}`}
                      >
                        {op.sentiment}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{op.stance}</p>
                    <a
                      href={op.post_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1 text-[10px] text-blue-400 hover:text-blue-300 font-mono pt-0.5"
                    >
                      <span>Original Post</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Source Post Links */}
          <div className="pt-1.5 border-t border-fin-border flex flex-wrap items-center justify-between gap-2 text-[10px] text-fin-muted font-mono">
            <span>Evidence Base ({insight.original_post_links.length} Referenced Posts):</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {insight.original_post_links.map((link, idx) => (
                <a
                  key={idx}
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2 py-0.5 rounded bg-fin-elevated hover:bg-fin-hover text-blue-400 flex items-center space-x-1 border border-fin-border transition"
                >
                  <span>Post #{idx + 1}</span>
                  <ExternalLink className="w-2 h-2" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
