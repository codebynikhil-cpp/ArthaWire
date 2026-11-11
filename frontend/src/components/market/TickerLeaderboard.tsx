"use client";

import React from "react";
import { TrendingUp, ArrowUpRight, BarChart3, Filter } from "lucide-react";
import { EntityLeaderboard } from "../../types";

interface TickerLeaderboardProps {
  companies: EntityLeaderboard[];
  onSelectSymbol?: (symbol: string) => void;
}

export const TickerLeaderboard: React.FC<TickerLeaderboardProps> = ({
  companies,
  onSelectSymbol
}) => {
  return (
    <div className="bg-fin-card border border-fin-border rounded-lg p-4 space-y-4 shadow-terminal">
      <div className="flex items-center justify-between border-b border-fin-border pb-3">
        <div>
          <h3 className="text-xs font-mono font-semibold text-white tracking-wider uppercase">
            Dalal Street Ticker Surveillance
          </h3>
          <p className="text-[11px] text-fin-muted">
            NSE / BSE listed entities ranked by creator volume & FinBERT sentiment breakdown
          </p>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          NSE / BSE
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-fin-border text-fin-muted font-mono uppercase text-[10px]">
              <th className="pb-2">Symbol & Company</th>
              <th className="pb-2 text-center">Volume</th>
              <th className="pb-2">Sentiment Ratio (Bullish / Bearish / Mixed)</th>
              <th className="pb-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-fin-border/60">
            {companies.map((c) => {
              const total = c.mentions_count || 1;
              const posPct = Math.round((c.positive / total) * 100);
              const negPct = Math.round((c.negative / total) * 100);
              const mixPct = Math.round((c.mixed / total) * 100);
              const neuPct = Math.max(0, 100 - (posPct + negPct + mixPct));

              return (
                <tr key={c.symbol} className="hover:bg-fin-hover/50 transition">
                  <td className="py-2.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 text-[11px]">
                        ${c.symbol}
                      </span>
                      <span className="text-slate-200 font-medium truncate max-w-[200px]">
                        {c.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 text-center font-mono font-bold text-white tabular-nums">
                    {c.mentions_count}
                  </td>
                  <td className="py-2.5">
                    <div className="flex items-center space-x-2.5">
                      {/* Stacked Sentiment Visualizer */}
                      <div className="w-32 h-2 rounded bg-fin-elevated overflow-hidden flex border border-fin-border">
                        <div
                          style={{ width: `${posPct}%` }}
                          className="bg-emerald-500 h-full"
                          title={`Positive: ${c.positive}`}
                        />
                        <div
                          style={{ width: `${negPct}%` }}
                          className="bg-rose-500 h-full"
                          title={`Negative: ${c.negative}`}
                        />
                        <div
                          style={{ width: `${mixPct}%` }}
                          className="bg-amber-500 h-full"
                          title={`Mixed: ${c.mixed}`}
                        />
                        <div
                          style={{ width: `${neuPct}%` }}
                          className="bg-slate-500 h-full"
                          title={`Neutral: ${c.neutral}`}
                        />
                      </div>
                      <div className="flex items-center space-x-1.5 font-mono text-[10px] tabular-nums">
                        {c.positive > 0 && (
                          <span className="text-emerald-400">+{c.positive}</span>
                        )}
                        {c.negative > 0 && (
                          <span className="text-rose-400">-{c.negative}</span>
                        )}
                        {c.mixed > 0 && (
                          <span className="text-amber-400">~{c.mixed}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 text-right">
                    <button
                      onClick={() => onSelectSymbol && onSelectSymbol(c.symbol)}
                      className="px-2 py-1 text-[11px] font-mono bg-fin-elevated hover:bg-fin-hover text-blue-400 rounded border border-fin-border transition inline-flex items-center space-x-1"
                    >
                      <Filter className="w-2.5 h-2.5" />
                      <span>Filter Feed</span>
                    </button>
                  </td>
                </tr>
              );
            })}
            {companies.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-fin-muted font-mono">
                  No Dalal Street company mentions recorded yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
