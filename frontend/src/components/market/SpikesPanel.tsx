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
    <div className="bg-fin-card border border-fin-border rounded-lg p-4 space-y-3.5 shadow-terminal">
      <div className="flex items-center justify-between border-b border-fin-border pb-2.5">
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded bg-amber-500/10 text-amber-400">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-semibold text-white tracking-wider uppercase">
              Discussion Velocity Anomalies
            </h3>
            <p className="text-[11px] text-fin-muted">
              Unusual discussion spikes across 2+ monitored creators
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
          Surge Alert
        </span>
      </div>

      <div className="space-y-2 pt-0.5">
        {spikes.map((spike) => (
          <div
            key={spike.symbol}
            className="p-2.5 rounded bg-amber-500/5 border border-amber-500/20 text-xs space-y-1 hover:border-amber-500/35 transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-amber-300 text-xs">${spike.symbol}</span>
                <span className="text-slate-300 font-medium text-[11px] truncate max-w-[150px]">
                  {spike.name}
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {spike.spike_magnitude}
              </span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">{spike.reason}</p>
          </div>
        ))}
        {spikes.length === 0 && (
          <p className="text-xs text-fin-muted py-6 text-center font-mono">
            No statistically abnormal discussion spikes detected
          </p>
        )}
      </div>
    </div>
  );
};
