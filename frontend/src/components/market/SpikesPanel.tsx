import React from "react";
import { Zap, AlertTriangle } from "lucide-react";

interface SpikesPanelProps {
  spikes: {
    symbol: string;
    name: string;
    spike_magnitude: string;
    reason: string;
  }[];
}

export const SpikesPanel: React.FC<SpikesPanelProps> = ({ spikes }) => {
  return (
    <div className="bg-[#111726] border border-gray-800 rounded-xl p-5 space-y-3">
      <div className="flex items-center space-x-2">
        <Zap className="w-4 h-4 text-amber-400" />
        <h3 className="text-sm font-semibold text-white">Unusual Discussion Volume Spikes</h3>
      </div>
      <p className="text-xs text-gray-400">
        Statistical anomalies where 2 or more monitored creators concurrently discuss a stock.
      </p>

      <div className="space-y-2.5 pt-1">
        {spikes.map((spike) => (
          <div
            key={spike.symbol}
            className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 text-xs space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-amber-300">${spike.symbol}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {spike.spike_magnitude}
              </span>
            </div>
            <p className="text-gray-300 text-[11px] leading-relaxed">{spike.reason}</p>
          </div>
        ))}
        {spikes.length === 0 && (
          <p className="text-xs text-gray-400 py-4 text-center">No volume spikes detected</p>
        )}
      </div>
    </div>
  );
};
