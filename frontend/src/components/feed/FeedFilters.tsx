"use client";

import React from "react";
import { Search, RotateCcw, Filter } from "lucide-react";
import { Creator } from "../../types";

interface FeedFiltersProps {
  creators: Creator[];
  selectedCreatorId?: number;
  selectedSentiment?: string;
  selectedTopic?: string;
  selectedSymbol?: string;
  selectedMarketImpact?: string;
  searchQuery: string;
  onFilterChange: (filters: {
    creator_id?: number;
    sentiment?: string;
    topic?: string;
    symbol?: string;
    market_impact?: string;
    search?: string;
  }) => void;
  onReset: () => void;
}

const TOPICS = [
  "Indian stock market",
  "Company earnings",
  "Banking and finance",
  "RBI monetary policy",
  "Inflation",
  "Interest rates",
  "IPOs",
  "Mergers and acquisitions",
  "Corporate announcements",
  "Macroeconomics",
  "Global markets",
  "Commodities"
];

export const FeedFilters: React.FC<FeedFiltersProps> = ({
  creators,
  selectedCreatorId,
  selectedSentiment,
  selectedTopic,
  selectedSymbol,
  selectedMarketImpact,
  searchQuery,
  onFilterChange,
  onReset
}) => {
  return (
    <div className="bg-[#111726] border border-gray-800 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          <Filter className="w-3.5 h-3.5 text-blue-400" />
          <span>Feed Filters & Discovery</span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center space-x-1 text-xs text-gray-400 hover:text-white transition"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search keywords..."
            value={searchQuery}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-900 border border-gray-700/80 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Creator Dropdown */}
        <select
          value={selectedCreatorId || ""}
          onChange={(e) =>
            onFilterChange({
              creator_id: e.target.value ? Number(e.target.value) : undefined
            })
          }
          className="px-3 py-1.5 text-xs bg-gray-900 border border-gray-700/80 rounded-lg text-gray-200 focus:outline-none focus:border-blue-500"
        >
          <option value="">All Creators</option>
          {creators.map((c) => (
            <option key={c.id} value={c.id}>
              @{c.username} ({c.display_name})
            </option>
          ))}
        </select>

        {/* Sentiment Dropdown */}
        <select
          value={selectedSentiment || ""}
          onChange={(e) => onFilterChange({ sentiment: e.target.value || undefined })}
          className="px-3 py-1.5 text-xs bg-gray-900 border border-gray-700/80 rounded-lg text-gray-200 focus:outline-none focus:border-blue-500"
        >
          <option value="">All Sentiments</option>
          <option value="Positive">Positive</option>
          <option value="Negative">Negative</option>
          <option value="Neutral">Neutral</option>
          <option value="Mixed">Mixed</option>
        </select>

        {/* Topic Dropdown */}
        <select
          value={selectedTopic || ""}
          onChange={(e) => onFilterChange({ topic: e.target.value || undefined })}
          className="px-3 py-1.5 text-xs bg-gray-900 border border-gray-700/80 rounded-lg text-gray-200 focus:outline-none focus:border-blue-500"
        >
          <option value="">All Topics</option>
          {TOPICS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* Market Impact Dropdown */}
        <select
          value={selectedMarketImpact || ""}
          onChange={(e) => onFilterChange({ market_impact: e.target.value || undefined })}
          className="px-3 py-1.5 text-xs bg-gray-900 border border-gray-700/80 rounded-lg text-gray-200 focus:outline-none focus:border-blue-500"
        >
          <option value="">All Market Impacts</option>
          <option value="Potentially bullish">Potentially Bullish</option>
          <option value="Potentially bearish">Potentially Bearish</option>
          <option value="Neutral">Neutral</option>
          <option value="Unclear">Unclear</option>
        </select>
      </div>

      {selectedSymbol && (
        <div className="flex items-center space-x-2 pt-1 text-xs text-gray-300">
          <span>Active Ticker Filter:</span>
          <span className="font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
            <span>${selectedSymbol}</span>
            <button
              onClick={() => onFilterChange({ symbol: undefined })}
              className="text-emerald-300 hover:text-white ml-1 font-bold"
            >
              ×
            </button>
          </span>
        </div>
      )}
    </div>
  );
};
