"use client";

import React from "react";
import {
  Activity,
  RefreshCw,
  Bell,
  Zap,
  Radio,
  Search,
  CheckCircle2,
  AlertCircle,
  Database,
  Lock
} from "lucide-react";

interface NavbarProps {
  wsConnected: boolean;
  isSyncing: boolean;
  onSync: () => void;
  onSimulate: () => void;
  unreadNotificationsCount: number;
  onToggleNotifications: () => void;
  ingestionMode: string;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onLockTerminal?: () => void;
  userRole?: string;
  userEmail?: string;
  userPicture?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  wsConnected,
  isSyncing,
  onSync,
  onSimulate,
  unreadNotificationsCount,
  onToggleNotifications,
  ingestionMode,
  searchQuery = "",
  onSearchChange,
  onLockTerminal,
  userRole = "Terminal Analyst",
  userEmail,
  userPicture
}) => {
  const isLiveX = ingestionMode === "LIVE_X_API";

  return (
    <header className="sticky top-0 z-40 bg-fin-secondary/95 backdrop-blur border-b border-fin-border text-fin-text">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Brand & Market Focus */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="w-8 h-8 rounded bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400">
            <Activity className="w-4 h-4" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-bold text-base tracking-wider text-white font-mono">ARTHAWIRE</span>
            <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
              NSE / BSE INTEL
            </span>
          </div>
        </div>

        {/* Global Terminal Search */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-fin-muted" />
            <input
              type="text"
              placeholder="Search companies ($RELIANCE, $TCS), creators, topics, or events..."
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-fin-card border border-fin-border rounded text-fin-text placeholder-fin-muted focus:outline-none focus:border-blue-500/60 font-sans transition"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 text-[9px] font-mono text-fin-muted bg-fin-elevated border border-fin-border rounded">
                /
              </kbd>
            </div>
          </div>
        </div>

        {/* Status Badges & Quick Action Controls */}
        <div className="flex items-center space-x-2.5 shrink-0">
          {/* WebSocket Status Indicator */}
          <div
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-[11px] font-mono border transition ${
              wsConnected
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                : "bg-amber-500/10 text-amber-400 border-amber-500/25"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                wsConnected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
              }`}
            />
            <span className="font-semibold tracking-wider">
              {wsConnected ? "STREAM LIVE" : "CONNECTING"}
            </span>
          </div>

          {/* Ingestion Mode Pill */}
          <span
            className={`hidden sm:inline-flex items-center space-x-1 px-2.5 py-1 rounded text-[11px] font-mono border ${
              isLiveX
                ? "bg-purple-500/10 text-purple-300 border-purple-500/30"
                : "bg-blue-500/10 text-blue-300 border-blue-500/25"
            }`}
          >
            <Database className="w-3 h-3" />
            <span>{isLiveX ? "Official X API v2" : "Sandbox Simulator"}</span>
          </span>

          {/* Quick Simulate Post Injection Button */}
          <button
            onClick={onSimulate}
            title="Inject an immediate simulated Dalal Street post into the real-time stream"
            className="flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded transition"
          >
            <Zap className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Simulate Post</span>
          </button>

          {/* Manual Ingestion Sync Button */}
          <button
            onClick={onSync}
            disabled={isSyncing}
            title="Trigger incremental sync with checkpoints"
            className="flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium bg-fin-card hover:bg-fin-hover text-fin-secondaryText hover:text-white border border-fin-border rounded transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin text-blue-400" : ""}`} />
            <span className="hidden sm:inline">{isSyncing ? "Syncing..." : "Sync"}</span>
          </button>

          {/* Notifications Center Toggle */}
          <button
            onClick={onToggleNotifications}
            title="Open Alerts & Notifications drawer"
            className="relative p-1.5 text-fin-secondaryText hover:text-white hover:bg-fin-hover rounded border border-fin-border transition"
          >
            <Bell className="w-3.5 h-3.5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[15px] h-[15px] text-[9px] font-mono font-bold bg-rose-500 text-white rounded-full flex items-center justify-center px-0.5">
                {unreadNotificationsCount > 9 ? "9+" : unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Terminal User Profile & Lock / Sign Out */}
          {onLockTerminal && (
            <div className="flex items-center space-x-2 pl-1 border-l border-fin-border">
              {userPicture && (
                <img
                  src={userPicture}
                  alt="Google Account"
                  className="w-6 h-6 rounded-full border border-blue-400/40 object-cover"
                />
              )}
              <button
                onClick={onLockTerminal}
                title={userEmail ? `Signed in as ${userEmail} — Click to Sign Out` : "Lock Terminal Desk"}
                className="flex items-center space-x-1 px-2 py-1 text-xs text-fin-muted hover:text-amber-400 bg-fin-card hover:bg-fin-hover rounded border border-fin-border transition"
              >
                <Lock className="w-3 h-3 text-amber-400" />
                <span className="hidden sm:inline text-[11px] font-mono">
                  {userEmail ? "Sign Out" : "Lock"}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
