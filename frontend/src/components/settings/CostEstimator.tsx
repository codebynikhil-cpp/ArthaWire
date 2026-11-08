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
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [creatorsCount, pollInterval, avgTweetsDay]);

  return (
    <div className="bg-[#111726] border border-gray-800 rounded-xl p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2.5 rounded-lg bg-purple-600/15 border border-purple-500/30 text-purple-400">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">
            Operational Cost & X API Consumption Calculator
          </h3>
          <p className="text-xs text-gray-400">
            Model official X API v2 billing tiers against creator volume and polling intervals.
          </p>
        </div>
      </div>

      {/* Interactive Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-4 rounded-xl bg-gray-900/60 border border-gray-800">
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-gray-300 font-medium">Monitored Creators</span>
            <span className="font-mono font-bold text-blue-400">{creatorsCount}</span>
          </div>
          <input
            type="range"
            min="1"
            max="25"
            value={creatorsCount}
            onChange={(e) => setCreatorsCount(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
          <span className="text-[10px] text-gray-400">Target: Up to 10 creators initially</span>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-gray-300 font-medium">Polling Interval</span>
            <span className="font-mono font-bold text-purple-400">{pollInterval} mins</span>
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
          <span className="text-[10px] text-gray-400">Incremental `since_id` polling</span>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-gray-300 font-medium">Avg Posts / Creator / Day</span>
            <span className="font-mono font-bold text-emerald-400">{avgTweetsDay}</span>
          </div>
          <input
            type="range"
            min="1"
            max="20"
            value={avgTweetsDay}
            onChange={(e) => setAvgTweetsDay(Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
          <span className="text-[10px] text-gray-400">Typical finance creator volume</span>
        </div>
      </div>

      {/* Estimated Consumption Metrics */}
      {estimates && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-lg bg-gray-900/40 border border-gray-800">
            <span className="text-gray-400 block text-[11px] uppercase">Daily X API Requests</span>
            <span className="text-lg font-mono font-bold text-white">
              {estimates.consumption.polls_per_day.toLocaleString()} calls/day
            </span>
          </div>
          <div className="p-3.5 rounded-lg bg-gray-900/40 border border-gray-800">
            <span className="text-gray-400 block text-[11px] uppercase">Monthly X API Requests</span>
            <span className="text-lg font-mono font-bold text-blue-400">
              {estimates.consumption.polls_per_month.toLocaleString()} calls/mo
            </span>
          </div>
          <div className="p-3.5 rounded-lg bg-gray-900/40 border border-gray-800">
            <span className="text-gray-400 block text-[11px] uppercase">
              Expected Posts Ingested
            </span>
            <span className="text-lg font-mono font-bold text-emerald-400">
              {estimates.consumption.expected_tweets_ingested_month.toLocaleString()} posts/mo
            </span>
          </div>
        </div>
      )}

      {/* Official Tier Comparison Cards */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          X API v2 Tier Viability Matrix
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {estimates?.tiers.map((tier) => (
            <div
              key={tier.tier_name}
              className={`p-4 rounded-xl border flex flex-col justify-between ${
                tier.is_viable
                  ? "bg-gray-900/50 border-gray-800"
                  : "bg-gray-900/20 border-gray-800/40 opacity-70"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="font-semibold text-white text-sm">{tier.tier_name}</h5>
                  <span className="font-mono font-bold text-sm text-purple-400">
                    ${tier.monthly_cost_usd}/mo
                  </span>
                </div>

                <div className="space-y-1 text-[11px] text-gray-400">
                  <div>
                    <strong className="text-gray-300">Read Limit:</strong> {tier.tweet_read_limit}
                  </div>
                  <div>
                    <strong className="text-gray-300">Rate Limit:</strong> {tier.rate_limit}
                  </div>
                </div>

                <p className="text-xs text-gray-300 pt-1 leading-relaxed">
                  {tier.recommendation}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-800 mt-2 flex items-center space-x-1.5">
                {tier.is_viable ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span
                  className={`text-[11px] font-medium ${
                    tier.is_viable ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {tier.is_viable ? "Viable for this configuration" : "Exceeds rate/read limits"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
