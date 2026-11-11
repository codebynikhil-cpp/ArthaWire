"use client";

import React from "react";
import {
  Users,
  RefreshCw,
  ExternalLink,
  BarChart2,
  Power,
  Trash2
} from "lucide-react";
import { Creator } from "../../types";

interface CreatorCardProps {
  creator: Creator;
  onToggleActive: (id: number, currentStatus: boolean) => void;
  onSync: (id: number) => void;
  onOpenDetails: (creator: Creator) => void;
  onDelete: (id: number) => void;
}

export const CreatorCard: React.FC<CreatorCardProps> = ({
  creator,
  onToggleActive,
  onSync,
  onOpenDetails,
  onDelete
}) => {
  return (
    <div
      className={`bg-fin-card border rounded-lg p-4 transition flex flex-col justify-between shadow-terminal ${
        creator.is_active
          ? "border-fin-border hover:border-slate-700/60"
          : "border-fin-border/40 opacity-65"
      }`}
    >
      <div className="space-y-3">
        {/* Creator Identity Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-3 min-w-0">
            <img
              src={
                creator.profile_image_url ||
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
              }
              alt={creator.display_name}
              className="w-10 h-10 rounded-full border border-fin-border object-cover shrink-0"
            />
            <div className="min-w-0">
              <h3 className="font-semibold text-xs text-white truncate">
                {creator.display_name}
              </h3>
              <a
                href={`https://x.com/${creator.username}`}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-mono text-fin-muted hover:text-blue-400 flex items-center space-x-1 transition"
              >
                <span>@{creator.username}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

          {/* Active Monitoring Status */}
          <span
            className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded border shrink-0 ${
              creator.is_active
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                : "bg-fin-elevated text-fin-muted border-fin-border"
            }`}
          >
            {creator.is_active ? "SURVEILLANCE ON" : "PAUSED"}
          </span>
        </div>

        {/* Bio */}
        <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
          {creator.description || "Active Indian financial market intelligence creator on X."}
        </p>

        {/* Monospace Metric Stats Grid */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-fin-border text-xs font-mono">
          <div className="p-2 rounded bg-fin-elevated/60 border border-fin-border/60">
            <span className="text-[10px] text-fin-muted block uppercase">Followers</span>
            <span className="font-bold text-white tabular-nums">
              {creator.followers_count ? creator.followers_count.toLocaleString() : "50,000+"}
            </span>
          </div>
          <div className="p-2 rounded bg-fin-elevated/60 border border-fin-border/60">
            <span className="text-[10px] text-fin-muted block uppercase">Posts Indexed</span>
            <span className="font-bold text-blue-400 tabular-nums">
              {creator.total_posts_count || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="pt-3 border-t border-fin-border flex items-center justify-between gap-1.5 mt-3">
        <button
          onClick={() => onOpenDetails(creator)}
          className="flex-1 flex items-center justify-center space-x-1.5 py-1.5 px-2 text-xs font-medium bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/25 rounded transition"
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Research Dossier</span>
        </button>

        <button
          onClick={() => onSync(creator.id)}
          title="Sync creator timeline from X API"
          className="p-1.5 text-fin-muted hover:text-white bg-fin-elevated hover:bg-fin-hover border border-fin-border rounded transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onToggleActive(creator.id, creator.is_active)}
          title={creator.is_active ? "Pause monitoring" : "Resume monitoring"}
          className={`p-1.5 rounded border transition ${
            creator.is_active
              ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20"
              : "text-fin-muted bg-fin-elevated border-fin-border hover:text-white"
          }`}
        >
          <Power className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onDelete(creator.id)}
          title="Remove creator"
          className="p-1.5 text-rose-400/80 hover:text-rose-400 bg-fin-elevated hover:bg-rose-500/10 border border-fin-border hover:border-rose-500/30 rounded transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
