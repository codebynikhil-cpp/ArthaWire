"use client";

import React from "react";
import {
  Server,
  RefreshCw,
  Clock,
  ShieldCheck,
  CheckCircle,
  Database,
  Coins,
  Cpu
} from "lucide-react";
import { IngestionStatus } from "../../types";

interface IngestionControlProps {
  status: IngestionStatus | null;
  onSyncAll: () => void;
  isSyncing: boolean;
}

export const IngestionControl: React.FC<IngestionControlProps> = ({
  status,
  onSyncAll,
  isSyncing
}) => {
  const isLive = status?.mode === "LIVE_X_API";

  return (
    <div className="bg-fin-card border border-fin-border rounded-lg p-4 space-y-4 shadow-terminal">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-fin-border pb-3">
        <div>
          <h3 className="text-xs font-mono font-semibold text-white tracking-wider uppercase flex items-center space-x-2">
            <Server className="w-3.5 h-3.5 text-purple-400" />
            <span>X API v2 Ingestion Daemon & Checkpoint Manager</span>
          </h3>
          <p className="text-[11px] text-fin-muted">
            Incremental `since_id` timeline retrieval, deduplication engine, and rate limit tracking
          </p>
        </div>
        <button
          onClick={onSyncAll}
          disabled={isSyncing}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded transition disabled:opacity-50 shrink-0 font-mono"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
          <span>{isSyncing ? "Syncing Checkpoints..." : "Trigger Incremental Sync"}</span>
        </button>
      </div>

      {status ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
          <div className="p-3 rounded bg-fin-elevated/70 border border-fin-border">
            <span className="text-[10px] text-fin-muted block uppercase">Daemon State</span>
            <span
              className={`font-semibold flex items-center space-x-1.5 mt-1 ${
                status.is_scheduler_running ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              <span>{status.is_scheduler_running ? "APScheduler (15m)" : "OFFLINE"}</span>
            </span>
          </div>

          <div className="p-3 rounded bg-fin-elevated/70 border border-fin-border">
            <span className="text-[10px] text-fin-muted block uppercase">Pipeline Mode</span>
            <span
              className={`font-semibold block mt-1 ${
                isLive ? "text-purple-300" : "text-blue-300"
              }`}
            >
              {isLive ? "Official X API v2" : "Sandbox Simulation"}
            </span>
          </div>

          <div className="p-3 rounded bg-fin-elevated/70 border border-fin-border">
            <span className="text-[10px] text-fin-muted block uppercase">Ingested Volume</span>
            <span className="font-semibold text-white block mt-1 tabular-nums">
              {status.total_posts_ingested.toLocaleString()} Posts
            </span>
          </div>

          <div className="p-3 rounded bg-fin-elevated/70 border border-fin-border">
            <span className="text-[10px] text-fin-muted block uppercase">Rate Quota Remaining</span>
            <span className="font-semibold text-blue-400 block mt-1 tabular-nums">
              {status.rate_limit_remaining !== null && status.rate_limit_remaining !== undefined
                ? `${status.rate_limit_remaining} calls`
                : "Active & Monitored"}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
};
