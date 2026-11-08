"use client";

import React from "react";
import {
  LayoutDashboard,
  Radio,
  Users,
  TrendingUp,
  Sparkles,
  BellRing,
  Coins,
  ShieldCheck,
  PlusCircle
} from "lucide-react";

export type TabKey =
  | "overview"
  | "feed"
  | "creators"
  | "market"
  | "insights"
  | "alerts"
  | "settings";

interface SidebarProps {
  currentTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  activeCreatorsCount: number;
  totalCreatorsCount: number;
  onOpenAddCreator: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  activeCreatorsCount,
  totalCreatorsCount,
  onOpenAddCreator
}) => {
  const navItems: { key: TabKey; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      key: "overview",
      label: "Overview",
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      key: "feed",
      label: "Live Feed",
      icon: <Radio className="w-4 h-4 text-emerald-400" />,
      badge: "LIVE"
    },
    {
      key: "creators",
      label: "Creators Analytics",
      icon: <Users className="w-4 h-4" />,
      badge: `${activeCreatorsCount}/${totalCreatorsCount}`
    },
    {
      key: "market",
      label: "Market Intelligence",
      icon: <TrendingUp className="w-4 h-4 text-blue-400" />
    },
    {
      key: "insights",
      label: "AI Consensus Insights",
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
      badge: "MULTI"
    },
    {
      key: "alerts",
      label: "Alerts & Notifications",
      icon: <BellRing className="w-4 h-4" />
    },
    {
      key: "settings",
      label: "X API & Cost Calculator",
      icon: <Coins className="w-4 h-4 text-purple-400" />
    }
  ];

  return (
    <aside className="w-64 bg-[#0a0e17] border-r border-gray-800 flex flex-col justify-between shrink-0 p-4">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
            INTELLIGENCE DESK
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = currentTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => onTabChange(item.key)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    active
                      ? "bg-blue-600/15 text-blue-400 border border-blue-500/30"
                      : "text-gray-400 hover:text-gray-200 hover:bg-gray-900 border border-transparent"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                        item.badge === "LIVE"
                          ? "bg-emerald-500/20 text-emerald-400 animate-pulse"
                          : active
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-gray-800 text-gray-400"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Add Creator Card */}
        <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-300">Creator Capacity</span>
            <span className="text-xs font-mono font-semibold text-blue-400">
              {totalCreatorsCount}/10
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${(totalCreatorsCount / 10) * 100}%` }}
            />
          </div>
          <button
            onClick={onOpenAddCreator}
            disabled={totalCreatorsCount >= 10}
            className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 text-xs font-medium bg-gray-800 hover:bg-gray-750 text-gray-200 rounded-lg border border-gray-700 transition disabled:opacity-50"
          >
            <PlusCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>Add Creator</span>
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-gray-800/80 text-[11px] text-gray-400 space-y-1">
        <div className="flex items-center space-x-1 text-gray-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Research Platform</span>
        </div>
        <p className="text-[10px] leading-tight">
          Not investment advice. AI summaries link to original X source.
        </p>
      </div>
    </aside>
  );
};
