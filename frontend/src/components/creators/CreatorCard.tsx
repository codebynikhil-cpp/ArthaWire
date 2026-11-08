"use client";

import React from "react";
import {
  Users,
  RefreshCw,
  ExternalLink,
  BarChart2,
  Check,
  X,
  Power
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
      className={`bg-[#111726] border rounded-xl p-5 transition flex flex-col justify-between ${
        creator.is_active ? "border-gray-800 hover:border-gray-700" : "border-gray-800/40 opacity-70"
      }`}
    >
      <div className="space-y-3">
        {/* Creator Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={
                creator.profile_image_url ||
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
              }
              alt={creator.display_name}
              className="w-11 h-11 rounded-full border border-gray-700 object-cover"
            />
            <div>
              <h3 className="font-semibold text-sm text-white">{creator.display_name}</h3>
              <a
                href={`https://x.com/${creator.username}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-gray-400 hover:text-blue-400 flex items-center space-x-1"
              >
                <span>@{creator.username}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

          {/* Active status indicator badge */}
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
              creator.is_active
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : "bg-gray-800 text-gray-400 border-gray-700"
            }`}
          >
            {creator.is_active ? "MONITORING" : "PAUSED"}
          </span>
        </div>

        {/* Bio */}
        <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
          {creator.description || "Active Indian financial market creator on X."}
        </p>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-800/80 text-xs">
          <div className="p-2 rounded bg-gray-900/40">
            <span className="text-[11px] text-gray-400 block">Followers</span>
            <span className="font-mono font-semibold text-white">
              {creator.followers_count ? creator.followers_count.toLocaleString() : "50,000+"}
            </span>
          </div>
          <div className="p-2 rounded bg-gray-900/40">
            <span className="text-[11px] text-gray-400 block">Posts Tracked</span>
            <span className="font-mono font-semibold text-blue-400">
              {creator.total_posts_count || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="pt-4 border-t border-gray-800/80 flex items-center justify-between gap-2 mt-3">
        <button
          onClick={() => onOpenDetails(creator)}
          className="flex-1 flex items-center justify-center space-x-1.5 py-1.5 px-2.5 text-xs font-medium bg-blue-600/15 hover:bg-blue-600/25 text-blue-400 border border-blue-500/30 rounded-lg transition"
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Analytics</span>
        </button>

        <button
          onClick={() => onSync(creator.id)}
          title="Sync creator timeline"
          className="p-1.5 text-gray-400 hover:text-white bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onToggleActive(creator.id, creator.is_active)}
          title={creator.is_active ? "Pause monitoring" : "Resume monitoring"}
          className={`p-1.5 rounded-lg border transition ${
            creator.is_active
              ? "text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 border-emerald-500/30"
              : "text-gray-400 hover:text-gray-200 bg-gray-900 border-gray-800"
          }`}
        >
          <Power className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onDelete(creator.id)}
          title="Remove creator"
          className="p-1.5 text-rose-400/80 hover:text-rose-400 bg-gray-900 hover:bg-rose-500/10 border border-gray-800 hover:border-rose-500/30 rounded-lg transition"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
