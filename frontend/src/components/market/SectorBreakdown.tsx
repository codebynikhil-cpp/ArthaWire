"use client";

import React from "react";
import { SectorCount } from "../../types";
import { PieChart, Layers } from "lucide-react";

interface SectorBreakdownProps {
  sectors: SectorCount[];
}

export const SectorBreakdown: React.FC<SectorBreakdownProps> = ({ sectors }) => {
  const maxCount = Math.max(...sectors.map((s) => s.count), 1);

  return (
    <div className="bg-fin-card border border-fin-border rounded-lg p-4 space-y-3.5 shadow-terminal">
      <div className="flex items-center justify-between border-b border-fin-border pb-2.5">
        <div>
          <h3 className="text-xs font-mono font-semibold text-white tracking-wider uppercase">
            Indian Sector Intelligence
          </h3>
          <p className="text-[11px] text-fin-muted">Discussion intensity across industry sectors</p>
        </div>
        <div className="p-1 rounded bg-blue-500/10 text-blue-400">
          <Layers className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="space-y-2.5">
        {sectors.map((sec) => {
          const widthPct = Math.round((sec.count / maxCount) * 100);
          return (
            <div key={sec.sector} className="space-y-1 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-medium text-slate-200">{sec.sector}</span>
                <span className="font-mono font-bold text-white tabular-nums">
                  {sec.count} <span className="text-fin-muted font-normal text-[10px]">mentions</span>
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-fin-elevated overflow-hidden border border-fin-border/40">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </div>
          );
        })}
        {sectors.length === 0 && (
          <p className="text-xs text-fin-muted py-6 text-center font-mono">No sector activity recorded</p>
        )}
      </div>
    </div>
  );
};
