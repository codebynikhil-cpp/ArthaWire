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
  PlusCircle,
  ExternalLink
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
  const navSections = [
    {
      title: "INTELLIGENCE DESK",
      items: [
        {
          key: "overview" as TabKey,
          label: "Terminal Overview",
          icon: <LayoutDashboard className="w-4 h-4" />
        },
        {
          key: "feed" as TabKey,
          label: "Live Creator Feed",
          icon: <Radio className="w-4 h-4 text-emerald-400" />,
          badge: "STREAM"
        },
        {
          key: "insights" as TabKey,
          label: "AI Consensus Briefings",
          icon: <Sparkles className="w-4 h-4 text-amber-400" />,
          badge: "CLUSTERS"
        }
      ]
    },
    {
      title: "MARKET SURVEILLANCE",
      items: [
        {
          key: "market" as TabKey,
          label: "Dalal Street Radar",
          icon: <TrendingUp className="w-4 h-4 text-blue-400" />
        },
        {
          key: "creators" as TabKey,
          label: "Creator Directory",
          icon: <Users className="w-4 h-4 text-slate-300" />,
          badge: `${activeCreatorsCount}/${totalCreatorsCount}`
        },
        {
          key: "alerts" as TabKey,
          label: "Alert Triggers & Rules",
          icon: <BellRing className="w-4 h-4 text-indigo-400" />
        }
      ]
    },
    {
      title: "SYSTEM & AUDIT",
      items: [
        {
          key: "settings" as TabKey,
          label: "X API & Cost Analytics",
          icon: <Coins className="w-4 h-4 text-purple-400" />
        }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-fin-secondary border-r border-fin-border flex flex-col justify-between shrink-0 p-3.5 select-none">
      <div className="space-y-5">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <p className="px-2.5 text-[10px] font-mono font-semibold text-fin-muted tracking-wider uppercase">
              {section.title}
            </p>
            <nav className="space-y-0.5">
              {section.items.map((item) => {
                const active = currentTab === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => onTabChange(item.key)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-xs font-medium transition group ${
                      active
                        ? "bg-blue-600/15 text-blue-300 border border-blue-500/30"
                        : "text-fin-secondaryText hover:text-white hover:bg-fin-hover border border-transparent"
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className={active ? "text-blue-400" : "text-fin-muted group-hover:text-fin-text"}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded tracking-wide ${
                          item.badge === "STREAM"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                            : active
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            : "bg-fin-elevated text-fin-muted border border-fin-border"
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
        ))}

        {/* Creator Capacity Meter */}
        <div className="p-3 rounded bg-fin-card border border-fin-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-fin-secondaryText">Creator Monitoring Capacity</span>
            <span className="text-[11px] font-mono font-bold text-white">
              {totalCreatorsCount} <span className="text-fin-muted">/ 10</span>
            </span>
          </div>
          <div className="w-full h-1.5 bg-fin-elevated rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                totalCreatorsCount >= 10 ? "bg-amber-500" : "bg-blue-500"
              }`}
              style={{ width: `${Math.min(100, (totalCreatorsCount / 10) * 100)}%` }}
            />
          </div>
          <button
            onClick={onOpenAddCreator}
            disabled={totalCreatorsCount >= 10}
            className="w-full mt-1 flex items-center justify-center space-x-1.5 py-1.5 px-2 text-[11px] font-medium bg-fin-elevated hover:bg-fin-hover text-fin-text rounded border border-fin-border transition disabled:opacity-40"
          >
            <PlusCircle className="w-3 h-3 text-blue-400" />
            <span>Add X Creator</span>
          </button>
        </div>
      </div>

      {/* Footer Info & Regulatory Notice */}
      <div className="pt-3 border-t border-fin-border space-y-1.5 text-[10px] text-fin-muted">
        <div className="flex items-center space-x-1.5 text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span className="font-semibold">Dalal Street Research Platform</span>
        </div>
        <p className="leading-tight text-fin-muted">
          Automated FinBERT intelligence. Not SEBI registered investment advice. Insights preserve original post provenance.
        </p>
      </div>
    </aside>
  );
};
