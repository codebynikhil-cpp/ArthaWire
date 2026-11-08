"use client";

import React from "react";
import {
  Server,
  RefreshCw,
  Clock,
  ShieldAlert,
  CheckCircle,
  Database,
  Coins
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
  return (
    <div className="bg-[#111726] border border-gray-800 rounded-xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Server className="w-4 h-4 text-purple-400" />
            <span>X API v2 Ingestion & Background Scheduler</span>
          </h3>
          <p className="text-xs text-gray-400">
            Incremental timeline polling, duplicate prevention, and checkpoint persistence
          </p>
        </div>
        <button
          onClick={onSyncAll}
          disabled={isSyncing}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
          <span>{isSyncing ? "Running Incremental Sync..." : "Trigger Full Ingestion"}</span>
        </button>
      </div>

      {status ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
          <div className="p-3 rounded-lg bg-gray-900/60 border border-gray-800">
            <span className="text-[11px] text-gray-400 block uppercase">Scheduler State</span>
            <span
              className={`font-semibold font-mono flex items-center space-x-1 mt-0.5 ${
                status.is_scheduler_running ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-current" />
              <span>{status.is_scheduler_running ? "ACTIVE (APScheduler)" : "STOPPED"}</span>
            </span>
          </div>

          <div className="p-3 rounded-lg bg-gray-900/60 border border-gray-800">
            <span className="text-[11px] text-gray-400 block uppercase">Ingestion Mode</span>
            <span className="font-semibold font-mono text-purple-400 block mt-0.5">
              {status.mode}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-gray-900/60 border border-gray-800">
            <span className="text-[11px] text-gray-400 block uppercase">Total Ingested</span>
            <span className="font-semibold font-mono text-white block mt-0.5">
              {status.total_posts_ingested} Posts
            </span>
          </div>

          <div className="p-3 rounded-lg bg-gray-900/60 border border-gray-800">
            <span className="text-[11px] text-gray-400 block uppercase">Rate Limit (Remaining)</span>
            <span className="font-semibold font-mono text-blue-400 block mt-0.5">
              {status.rate_limit_remaining !== null && status.rate_limit_remaining !== undefined
                ? `${status.rate_limit_remaining} calls`
                : "Simulation (Uncapped)"}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
};
