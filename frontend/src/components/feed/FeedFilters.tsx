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
  const hasActiveFilters = Boolean(
    selectedCreatorId ||
    selectedSentiment ||
    selectedTopic ||
    selectedSymbol ||
    selectedMarketImpact ||
    searchQuery
  );

  return (
    <div className="bg-fin-card border border-fin-border rounded-lg p-3.5 space-y-3 shadow-terminal">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs font-mono font-semibold uppercase tracking-wider text-fin-secondaryText">
          <Filter className="w-3.5 h-3.5 text-blue-400" />
          <span>Surveillance Filters</span>
          {selectedSymbol && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              Ticker: ${selectedSymbol}
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center space-x-1 text-xs text-rose-400 hover:text-rose-300 font-mono transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-xs">
        {/* Keyword Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-fin-muted" />
          <input
            type="text"
            placeholder="Search keywords..."
            value={searchQuery}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full pl-7 pr-2.5 py-1.5 bg-fin-elevated border border-fin-border rounded text-fin-text placeholder-fin-muted focus:outline-none focus:border-blue-500 font-sans"
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
          className="px-2.5 py-1.5 bg-fin-elevated border border-fin-border rounded text-fin-text focus:outline-none focus:border-blue-500 font-sans"
        >
          <option value="">All Creators ({creators.length})</option>
          {creators.map((c) => (
            <option key={c.id} value={c.id}>
              @{c.username}
            </option>
          ))}
        </select>

        {/* Sentiment Dropdown */}
        <select
          value={selectedSentiment || ""}
          onChange={(e) => onFilterChange({ sentiment: e.target.value || undefined })}
          className="px-2.5 py-1.5 bg-fin-elevated border border-fin-border rounded text-fin-text focus:outline-none focus:border-blue-500 font-sans"
        >
          <option value="">All Sentiments</option>
          <option value="Positive">Positive (Bullish Tone)</option>
          <option value="Negative">Negative (Bearish Tone)</option>
          <option value="Neutral">Neutral (Analytical / Factual)</option>
          <option value="Mixed">Mixed (Contrarian / Divergent)</option>
        </select>

        {/* Financial Topic Dropdown */}
        <select
          value={selectedTopic || ""}
          onChange={(e) => onFilterChange({ topic: e.target.value || undefined })}
          className="px-2.5 py-1.5 bg-fin-elevated border border-fin-border rounded text-fin-text focus:outline-none focus:border-blue-500 font-sans"
        >
          <option value="">All Topics</option>
          {TOPICS.map((top) => (
            <option key={top} value={top}>
              {top}
            </option>
          ))}
        </select>

        {/* Market Impact Dropdown */}
        <select
          value={selectedMarketImpact || ""}
          onChange={(e) => onFilterChange({ market_impact: e.target.value || undefined })}
          className="px-2.5 py-1.5 bg-fin-elevated border border-fin-border rounded text-fin-text focus:outline-none focus:border-blue-500 font-sans"
        >
          <option value="">All Market Impacts</option>
          <option value="Potentially bullish">Potentially Bullish</option>
          <option value="Potentially bearish">Potentially Bearish</option>
          <option value="Neutral">Neutral Impact</option>
          <option value="Unclear">Unclear / Speculative</option>
        </select>
      </div>
    </div>
  );
};
