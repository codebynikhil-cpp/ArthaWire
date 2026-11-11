import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  sublabel?: string;
  icon: React.ReactNode;
  trendColor?: string;
  badge?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  sublabel,
  icon,
  trendColor = "text-emerald-400",
  badge
}) => {
  return (
    <div className="bg-fin-card border border-fin-border rounded-lg p-4 hover:border-slate-700/60 transition group shadow-terminal">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[11px] font-mono font-semibold text-fin-muted uppercase tracking-wider">
          {title}
        </span>
        <div className="p-1.5 rounded bg-fin-elevated border border-fin-border group-hover:border-slate-700/50 transition">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline space-x-2">
        <span className="text-2xl font-bold font-mono text-white tabular-nums tracking-tight">
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
        {badge && (
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-fin-elevated text-fin-secondaryText border border-fin-border">
            {badge}
          </span>
        )}
      </div>
      {sublabel && (
        <p className={`text-[11px] mt-1.5 font-medium ${trendColor} flex items-center space-x-1`}>
          <span>{sublabel}</span>
        </p>
      )}
    </div>
  );
};
