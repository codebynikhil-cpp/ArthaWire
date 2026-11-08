"use client";

import React from "react";
import { TrendingUp, ArrowUpRight } from "lucide-react";
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
    <div className="bg-[#111726] border border-gray-800 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">NSE / BSE Ticker Leaderboard</h3>
          <p className="text-xs text-gray-400">Ranked by creator discussion volume and sentiment ratio</p>
        </div>
        <span className="text-xs font-mono text-emerald-400">Dalal Street Radar</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 font-mono uppercase text-[11px]">
              <th className="pb-2.5">Company / Ticker</th>
              <th className="pb-2.5 text-center">Mentions</th>
              <th className="pb-2.5">Sentiment Breakdown</th>
              <th className="pb-2.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {companies.map((c) => {
              const total = c.mentions_count || 1;
              const posPct = Math.round((c.positive / total) * 100);
              const negPct = Math.round((c.negative / total) * 100);
              const neuPct = Math.round((c.neutral / total) * 100);
              const mixPct = Math.round((c.mixed / total) * 100);

              return (
                <tr key={c.symbol} className="hover:bg-gray-900/40 transition">
                  <td className="py-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-emerald-400">${c.symbol}</span>
                      <span className="text-gray-300 font-medium truncate max-w-[180px]">
                        {c.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-center font-mono font-bold text-white">
                    {c.mentions_count}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center space-x-2">
                      {/* Stacked bar */}
                      <div className="w-28 h-2 rounded-full bg-gray-800 overflow-hidden flex">
                        <div style={{ width: `${posPct}%` }} className="bg-emerald-500 h-full" title={`Positive: ${c.positive}`} />
                        <div style={{ width: `${negPct}%` }} className="bg-rose-500 h-full" title={`Negative: ${c.negative}`} />
                        <div style={{ width: `${mixPct}%` }} className="bg-amber-500 h-full" title={`Mixed: ${c.mixed}`} />
                        <div style={{ width: `${neuPct}%` }} className="bg-gray-500 h-full" title={`Neutral: ${c.neutral}`} />
                      </div>
                      <div className="flex items-center space-x-1.5 font-mono text-[10px]">
                        {c.positive > 0 && <span className="text-emerald-400">+{c.positive}</span>}
                        {c.negative > 0 && <span className="text-rose-400">-{c.negative}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => onSelectSymbol && onSelectSymbol(c.symbol)}
                      className="px-2.5 py-1 text-[11px] font-medium bg-gray-800 hover:bg-gray-700 text-blue-400 rounded-md border border-gray-700 transition"
                    >
                      Filter Feed
                    </button>
                  </td>
                </tr>
              );
            })}
            {companies.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-500">
                  No company mentions recorded yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
