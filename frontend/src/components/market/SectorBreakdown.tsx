"use client";

import React from "react";
import { SectorCount } from "../../types";

interface SectorBreakdownProps {
  sectors: SectorCount[];
}

export const SectorBreakdown: React.FC<SectorBreakdownProps> = ({ sectors }) => {
  const maxCount = Math.max(...sectors.map((s) => s.count), 1);

  return (
    <div className="bg-[#111726] border border-gray-800 rounded-xl p-5 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-white">Indian Sector Intelligence</h3>
        <p className="text-xs text-gray-400">Discussion volume and sentiment by industry segment</p>
      </div>

      <div className="space-y-3">
        {sectors.map((sec) => {
          const widthPct = Math.round((sec.count / maxCount) * 100);
          return (
            <div key={sec.sector} className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-200">{sec.sector}</span>
                <span className="font-mono text-gray-400">{sec.count} mentions</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </div>
          );
        })}
        {sectors.length === 0 && (
          <p className="text-xs text-gray-500 py-6 text-center">No sector data available</p>
        )}
      </div>
    </div>
  );
};
