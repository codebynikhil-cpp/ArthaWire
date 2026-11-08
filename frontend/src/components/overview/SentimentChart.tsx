"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { SentimentCount } from "../../types";

interface SentimentChartProps {
  distribution: SentimentCount;
}

const COLORS = {
  positive: "#10b981", // Emerald
  negative: "#f43f5e", // Rose
  neutral: "#64748b",  // Slate
  mixed: "#f59e0b"    // Amber
};

export const SentimentChart: React.FC<SentimentChartProps> = ({ distribution }) => {
  const data = [
    { name: "Positive", value: distribution.positive, color: COLORS.positive },
    { name: "Negative", value: distribution.negative, color: COLORS.negative },
    { name: "Neutral", value: distribution.neutral, color: COLORS.neutral },
    { name: "Mixed", value: distribution.mixed, color: COLORS.mixed }
  ];

  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-[#111726] border border-gray-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white">Financial Sentiment Ratio</h3>
          <p className="text-xs text-gray-400">Classified across Indian market commentary</p>
        </div>
        <span className="text-xs font-mono text-gray-400">{total} Posts</span>
      </div>

      <div className="h-44 w-full">
        {total > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#0e131f" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0a0e17",
                  borderColor: "#374151",
                  borderRadius: "8px",
                  fontSize: "12px"
                }}
                itemStyle={{ color: "#f3f4f6" }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-gray-500">
            No sentiment data recorded yet
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-800/80 text-xs">
        {data.map((item) => {
          const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
          return (
            <div key={item.name} className="flex items-center justify-between p-1.5 rounded bg-gray-900/50">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-gray-300">{item.name}</span>
              </div>
              <span className="font-mono font-medium text-gray-400">
                {item.value} ({pct}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
