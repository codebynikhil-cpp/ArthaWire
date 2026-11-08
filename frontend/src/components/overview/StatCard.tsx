import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  sublabel?: string;
  icon: React.ReactNode;
  trendColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  sublabel,
  icon,
  trendColor = "text-emerald-400"
}) => {
  return (
    <div className="bg-[#111726] border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{title}</span>
        <div className="p-2 rounded-lg bg-gray-800/60 border border-gray-700/50">{icon}</div>
      </div>
      <div className="flex items-baseline space-x-2">
        <span className="text-2xl font-bold font-mono text-white">{value}</span>
      </div>
      {sublabel && <p className={`text-xs mt-1 font-medium ${trendColor}`}>{sublabel}</p>}
    </div>
  );
};
