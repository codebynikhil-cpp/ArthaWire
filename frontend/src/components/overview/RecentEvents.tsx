import React from "react";
import { ExternalLink, Calendar, AlertCircle } from "lucide-react";

interface RecentEventsProps {
  events: {
    post_id: number;
    creator_name: string;
    creator_username: string;
    event_type: string;
    event_details: string;
    market_impact: string;
    post_url: string;
    timestamp: string;
  }[];
}

export const RecentEvents: React.FC<RecentEventsProps> = ({ events }) => {
  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case "Potentially bullish":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "Potentially bearish":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      case "Neutral":
        return "bg-slate-500/10 text-slate-400 border-slate-500/30";
      default:
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    }
  };

  return (
    <div className="bg-fin-card border border-fin-border rounded-lg p-4 space-y-3 shadow-terminal">
      <div className="flex items-center justify-between border-b border-fin-border pb-2.5">
        <div>
          <h3 className="text-xs font-mono font-semibold text-white tracking-wider uppercase">
            Detected Financial Events
          </h3>
          <p className="text-[11px] text-fin-muted">Earnings releases, RBI policies & corporate developments</p>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
          NLP Extracted
        </span>
      </div>

      <div className="space-y-2 max-h-[260px] overflow-y-auto pr-0.5">
        {events.map((ev, i) => (
          <div
            key={i}
            className="p-2.5 rounded bg-fin-elevated/50 border border-fin-border/70 hover:border-slate-700/60 transition space-y-1.5 text-xs"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-white flex items-center gap-1.5 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                <span className="truncate max-w-[150px]">{ev.event_type}</span>
              </span>
              <span className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border shrink-0 ${getImpactBadge(ev.market_impact)}`}>
                {ev.market_impact}
              </span>
            </div>

            <p className="text-fin-secondaryText text-[11px] leading-relaxed line-clamp-2">
              {ev.event_details}
            </p>

            <div className="flex items-center justify-between text-[10px] text-fin-muted pt-1 border-t border-fin-border/40 font-mono">
              <span className="truncate max-w-[130px]">@{ev.creator_username}</span>
              <a
                href={ev.post_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 font-sans"
              >
                <span>X Post</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <p className="text-xs text-fin-muted py-8 text-center font-mono">No corporate events detected</p>
        )}
      </div>
    </div>
  );
};
