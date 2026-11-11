"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { SentimentCount } from "../../types";

interface SentimentChartProps {
  distribution: SentimentCount;
}

const COLORS = {
  positive: "#22C55E", // Semantic Positive
  negative: "#EF4444", // Semantic Negative
  neutral: "#94A3B8",  // Semantic Neutral
  mixed: "#F59E0B"     // Semantic Mixed / Ambiguous
};

export const SentimentChart: React.FC<SentimentChartProps> = ({ distribution }) => {
  const data = [
    { name: "Positive", value: distribution.positive, color: COLORS.positive },
    { name: "Negative", value: distribution.negative, color: COLORS.negative },
    { name: "Neutral", value: distribution.neutral, color: COLORS.neutral },
    { name: "Mixed", value: distribution.mixed, color: COLORS.mixed }
  ];

  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0];
      const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
      return (
        <div className="bg-fin-secondary border border-fin-borderDefault p-2.5 rounded shadow-terminal text-xs space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.payload.color }} />
            <span className="font-semibold text-white">{d.name} Sentiment</span>
          </div>
          <div className="flex items-center justify-between space-x-4 text-fin-secondaryText font-mono">
            <span>Volume:</span>
            <span className="text-white font-bold">{d.value} posts</span>
          </div>
          <div className="flex items-center justify-between space-x-4 text-fin-secondaryText font-mono">
            <span>Share:</span>
            <span className="text-blue-400 font-bold">{pct}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-fin-card border border-fin-border rounded-lg p-4 space-y-3 shadow-terminal">
      <div className="flex items-center justify-between border-b border-fin-border pb-2.5">
        <div>
          <h3 className="text-xs font-mono font-semibold text-white tracking-wider uppercase">
            Financial Sentiment Ratio
          </h3>
          <p className="text-[11px] text-fin-muted">FinBERT NLP classification across Indian creators</p>
        </div>
        <span className="text-[11px] font-mono font-bold text-fin-secondaryText bg-fin-elevated px-2 py-0.5 rounded border border-fin-border">
          {total} Posts
        </span>
      </div>

      <div className="h-40 w-full relative">
        {total > 0 ? (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={64}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Donut Center Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs font-mono font-bold text-white tabular-nums">{total}</span>
              <span className="text-[9px] font-mono text-fin-muted uppercase tracking-wider">Posts</span>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-fin-muted font-mono">
            No sentiment classifications available
          </div>
        )}
      </div>

      {/* Grid Legend with Percentages */}
      <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-fin-border text-[11px]">
        {data.map((item) => {
          const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
          return (
            <div
              key={item.name}
              className="flex items-center justify-between px-2 py-1.5 rounded bg-fin-elevated/60 border border-fin-border/60"
            >
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-fin-secondaryText font-medium">{item.name}</span>
              </div>
              <span className="font-mono font-bold text-white tabular-nums">
                {item.value} <span className="text-fin-muted font-normal text-[10px]">({pct}%)</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
