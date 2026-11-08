import React from "react";
import { ExternalLink, AlertTriangle, Calendar } from "lucide-react";

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
        return "bg-gray-500/10 text-gray-400 border-gray-500/30";
      default:
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    }
  };

  return (
    <div className="bg-[#111726] border border-gray-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white">Detected Financial Events</h3>
          <p className="text-xs text-gray-400">
            Earnings releases, RBI announcements & corporate actions
          </p>
        </div>
        <span className="text-xs font-mono text-blue-400">Automated NLP</span>
      </div>

      <div className="space-y-3">
        {events.map((ev, i) => (
          <div
            key={i}
            className="p-3 rounded-lg bg-gray-900/40 border border-gray-800/80 hover:border-gray-700 transition"
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                {ev.event_type}
              </span>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${getImpactBadge(ev.market_impact)}`}>
                {ev.market_impact}
              </span>
            </div>

            <p className="text-xs text-gray-300 line-clamp-2 mb-2">{ev.event_details}</p>

            <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-gray-800/50">
              <span>via @{ev.creator_username}</span>
              <a
                href={ev.post_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1 text-blue-400 hover:text-blue-300"
              >
                <span>View on X</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <p className="text-xs text-gray-400 py-6 text-center">No recent events detected</p>
        )}
      </div>
    </div>
  );
};
