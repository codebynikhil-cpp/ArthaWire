import React from "react";
import { TopicCount } from "../../types";
import { Hash, ChevronRight } from "lucide-react";

interface TrendingTopicsProps {
  topics: TopicCount[];
  onSelectTopic?: (topic: string) => void;
}

export const TrendingTopics: React.FC<TrendingTopicsProps> = ({ topics, onSelectTopic }) => {
  return (
    <div className="bg-fin-card border border-fin-border rounded-lg p-4 space-y-3 shadow-terminal">
      <div className="flex items-center justify-between border-b border-fin-border pb-2.5">
        <div>
          <h3 className="text-xs font-mono font-semibold text-white tracking-wider uppercase">
            Trending Financial Topics
          </h3>
          <p className="text-[11px] text-fin-muted">Categorized across 14 financial domains</p>
        </div>
        <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
          NLP Ranked
        </span>
      </div>

      <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-0.5">
        {topics.map((t, idx) => (
          <button
            key={t.topic}
            onClick={() => onSelectTopic && onSelectTopic(t.topic)}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded bg-fin-elevated/50 hover:bg-fin-hover border border-fin-border/60 hover:border-slate-700/60 transition text-left group"
          >
            <div className="flex items-center space-x-2">
              <span className="w-4 text-center font-mono text-[10px] font-semibold text-fin-muted group-hover:text-blue-400">
                {idx + 1}
              </span>
              <span className="text-xs font-medium text-fin-text group-hover:text-blue-300 transition truncate max-w-[170px]">
                {t.topic}
              </span>
            </div>
            <div className="flex items-center space-x-1.5 shrink-0">
              <span className="text-[11px] font-mono font-bold text-white tabular-nums px-1.5 py-0.5 rounded bg-fin-card border border-fin-border">
                {t.count}
              </span>
              <ChevronRight className="w-3 h-3 text-fin-muted group-hover:text-blue-400 group-hover:translate-x-0.5 transition" />
            </div>
          </button>
        ))}
        {topics.length === 0 && (
          <p className="text-xs text-fin-muted py-8 text-center font-mono">No financial topics detected</p>
        )}
      </div>
    </div>
  );
};
