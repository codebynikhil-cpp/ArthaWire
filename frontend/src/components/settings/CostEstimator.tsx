"use client";

import React, { useState, useEffect } from "react";
import { Coins, Calculator, CheckCircle2, XCircle, AlertCircle, Info } from "lucide-react";
import { CostEstimate } from "../../types";
import { api } from "../../lib/api";

export const CostEstimator: React.FC = () => {
  const [creatorsCount, setCreatorsCount] = useState(10);
  const [pollInterval, setPollInterval] = useState(15);
  const [avgTweetsDay, setAvgTweetsDay] = useState(4);
  const [estimates, setEstimates] = useState<CostEstimate | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .getCostEstimates(creatorsCount, pollInterval, avgTweetsDay)
      .then((data) => setEstimates(data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [creatorsCount, pollInterval, avgTweetsDay]);

  return (
    <div className="bg-fin-card border border-fin-border rounded-lg p-5 space-y-5 shadow-terminal">
      <div className="flex items-center space-x-3 border-b border-fin-border pb-3">
        <div className="p-2 rounded bg-purple-500/10 border border-purple-500/25 text-purple-400">
          <Calculator className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-xs font-mono font-semibold text-white tracking-wider uppercase">
            X API v2 Consumption & Operational Budget Modeler
          </h3>
          <p className="text-[11px] text-fin-muted">
            Model official X API tier limits ($0 Free, $100 Basic, $5,000 Pro) based on creator pool size & polling frequency
          </p>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3.5 rounded bg-fin-elevated border border-fin-border">
        <div>
          <div className="flex justify-between text-xs mb-1.5 font-mono">
            <span className="text-fin-secondaryText">Monitored Creators</span>
            <span className="font-bold text-blue-400 tabular-nums">{creatorsCount}</span>
          </div>
          <input
            type="range"
            min="1"
            max="25"
            value={creatorsCount}
            onChange={(e) => setCreatorsCount(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
          <span className="text-[10px] text-fin-muted font-mono">Target: Up to 10 Indian creators</span>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1.5 font-mono">
            <span className="text-fin-secondaryText">Polling Interval</span>
            <span className="font-bold text-purple-400 tabular-nums">{pollInterval} mins</span>
          </div>
          <input
            type="range"
            min="5"
            max="60"
            step="5"
            value={pollInterval}
            onChange={(e) => setPollInterval(Number(e.target.value))}
            className="w-full accent-purple-500"
          />
          <span className="text-[10px] text-fin-muted font-mono">Incremental `since_id` interval</span>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1.5 font-mono">
            <span className="text-fin-secondaryText">Avg Posts / Day / Creator</span>
            <span className="font-bold text-emerald-400 tabular-nums">{avgTweetsDay}</span>
          </div>
          <input
            type="range"
            min="1"
            max="20"
            value={avgTweetsDay}
            onChange={(e) => setAvgTweetsDay(Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
          <span className="text-[10px] text-fin-muted font-mono">Dalal Street creator activity</span>
        </div>
      </div>

      {/* Estimated Consumption Metrics */}
      {estimates && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 rounded bg-fin-elevated/70 border border-fin-border">
            <span className="text-fin-muted block text-[10px] uppercase">Daily X API Requests</span>
            <span className="text-base font-bold text-white tabular-nums">
              {estimates.consumption.polls_per_day.toLocaleString()} calls/day
            </span>
          </div>

          <div className="p-3 rounded bg-fin-elevated/70 border border-fin-border">
            <span className="text-fin-muted block text-[10px] uppercase">Monthly API Requests</span>
            <span className="text-base font-bold text-blue-400 tabular-nums">
              {estimates.consumption.polls_per_month.toLocaleString()} calls/mo
            </span>
          </div>

          <div className="p-3 rounded bg-fin-elevated/70 border border-fin-border">
            <span className="text-fin-muted block text-[10px] uppercase">Monthly Ingested Posts</span>
            <span className="text-base font-bold text-emerald-400 tabular-nums">
              ~{estimates.consumption.expected_tweets_ingested_month.toLocaleString()} posts
            </span>
          </div>
        </div>
      )}

      {/* Tier Suitability Cards */}
      {estimates && (
        <div className="space-y-2">
          <h4 className="text-xs font-mono font-semibold text-white uppercase tracking-wider">
            Official X API v2 Tier Feasibility
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {estimates.tiers.map((tier) => (
              <div
                key={tier.tier_name}
                className={`p-3 rounded border space-y-2 ${
                  tier.is_viable
                    ? "bg-blue-500/10 border-blue-500/30"
                    : "bg-fin-elevated/50 border-fin-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">
                    {tier.tier_name} (${tier.monthly_cost_usd}/mo)
                  </span>
                  {tier.is_viable ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  )}
                </div>
                <p className="text-[11px] text-slate-300">{tier.recommendation}</p>
                <div className="text-[10px] font-mono text-fin-muted">
                  Read Limit: {typeof tier.tweet_read_limit === "number" ? tier.tweet_read_limit.toLocaleString() : tier.tweet_read_limit} posts/mo
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
