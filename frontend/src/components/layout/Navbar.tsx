"use client";

import React from "react";
import {
  Activity,
  RefreshCw,
  Bell,
  Zap,
  Radio,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface NavbarProps {
  wsConnected: boolean;
  isSyncing: boolean;
  onSync: () => void;
  onSimulate: () => void;
  unreadNotificationsCount: number;
  onToggleNotifications: () => void;
  ingestionMode: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  wsConnected,
  isSyncing,
  onSync,
  onSimulate,
  unreadNotificationsCount,
  onToggleNotifications,
  ingestionMode
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0e131f]/95 backdrop-blur border-b border-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-wider text-white">FinPulse</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                NSE/BSE Intelligence
              </span>
            </div>
            <p className="text-[11px] text-gray-400 hidden sm:block">
              Real-Time Financial NLP & X-Creator Monitoring
            </p>
          </div>
        </div>

        {/* Status badges & Actions */}
        <div className="flex items-center space-x-3">
          {/* WebSocket Status */}
          <div
            className={`hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-mono border ${
              wsConnected
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : "bg-amber-500/10 text-amber-400 border-amber-500/30"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                wsConnected ? "bg-emerald-400 animate-ping" : "bg-amber-400"
              }`}
            />
            <span>{wsConnected ? "STREAM LIVE" : "CONNECTING"}</span>
          </div>

          {/* Mode Pill */}
          <span
            className={`hidden lg:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
              ingestionMode === "LIVE_X_API"
                ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                : "bg-blue-500/10 text-blue-400 border-blue-500/30"
            }`}
          >
            {ingestionMode === "LIVE_X_API" ? "Official X API v2" : "Sandbox Simulator"}
          </span>

          {/* Simulate Live Post Button (for real-time demo) */}
          <button
            onClick={onSimulate}
            title="Inject an immediate simulated post into the real-time stream"
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg transition"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Simulate Post</span>
          </button>

          {/* Manual Sync Button */}
          <button
            onClick={onSync}
            disabled={isSyncing}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium bg-gray-800 hover:bg-gray-750 text-gray-200 border border-gray-700 rounded-lg transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-blue-400" : ""}`} />
            <span className="hidden sm:inline">{isSyncing ? "Syncing..." : "Sync Now"}</span>
          </button>

          {/* Notifications Button */}
          <button
            onClick={onToggleNotifications}
            className="relative p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg border border-gray-800 transition"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold bg-rose-500 text-white rounded-full flex items-center justify-center animate-bounce">
                {unreadNotificationsCount > 9 ? "9+" : unreadNotificationsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
