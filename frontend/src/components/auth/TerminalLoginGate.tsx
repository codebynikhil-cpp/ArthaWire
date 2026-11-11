"use client";

import React, { useState } from "react";
import { ShieldCheck, Lock, KeyRound, AlertTriangle, ArrowRight, Activity, Terminal } from "lucide-react";
import { api } from "../../lib/api";

interface TerminalLoginGateProps {
  onAuthenticated: (role: string, displayName: string) => void;
}

export const TerminalLoginGate: React.FC<TerminalLoginGateProps> = ({ onAuthenticated }) => {
  const [accessKey, setAccessKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessKey.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await api.login(accessKey.trim());
      if (res.authenticated && res.token) {
        localStorage.setItem("arthawire_auth_token", res.token);
        localStorage.setItem("arthawire_auth_role", res.role);
        localStorage.setItem("arthawire_auth_user", res.display_name);
        onAuthenticated(res.role, res.display_name);
      }
    } catch (err: any) {
      setError(err.message || "Invalid Access Key. Access Denied.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrefillKey = () => {
    setAccessKey("ARTHA-2026");
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070A0F] text-fin-text p-4 font-mono select-none">
      {/* Subtle Background Grid & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Terminal Vault Card */}
      <div className="relative w-full max-w-md bg-fin-card border border-fin-border rounded-xl shadow-2xl p-6 sm:p-8 space-y-6 backdrop-blur">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-fin-border pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Activity className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold tracking-widest text-white">ARTHAWIRE</span>
                <span className="text-[9px] font-semibold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30 uppercase">
                  DALAL STREET INTEL
                </span>
              </div>
              <p className="text-[10px] text-fin-muted">Institutional Financial Research Terminal</p>
            </div>
          </div>
          <div className="flex items-center space-x-1.5 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px]">
            <Lock className="w-3 h-3" />
            <span className="font-semibold uppercase tracking-wider">RESTRICTED</span>
          </div>
        </div>

        {/* Security Notice */}
        <div className="space-y-1.5 text-center">
          <h2 className="text-sm font-semibold text-white tracking-wider uppercase flex items-center justify-center space-x-2">
            <Terminal className="w-4 h-4 text-blue-400 inline" />
            <span>Terminal Clearance Required</span>
          </h2>
          <p className="text-xs text-fin-muted font-sans leading-relaxed">
            Authorized access only. Enter your institutional master passkey to unlock real-time NSE/BSE surveillance, FinBERT sentiment telemetry, and cross-creator consensus models.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2 animate-shake">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span className="font-mono text-[11px]">{error}</span>
          </div>
        )}

        {/* Access Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-fin-muted flex items-center justify-between">
              <span className="flex items-center space-x-1">
                <KeyRound className="w-3 h-3 text-blue-400" />
                <span>TERMINAL ACCESS KEY</span>
              </span>
              <button
                type="button"
                onClick={handlePrefillKey}
                className="text-[10px] text-blue-400 hover:text-blue-300 underline underline-offset-2"
              >
                Use Default: ARTHA-2026
              </button>
            </label>
            <div className="relative">
              <input
                type="password"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                placeholder="ENTER ACCESS KEY (e.g. ARTHA-2026)"
                autoFocus
                className="w-full px-3.5 py-2.5 text-xs bg-fin-secondary border border-fin-border rounded-lg text-white placeholder-fin-muted focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 font-mono tracking-wider transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !accessKey.trim()}
            className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white text-xs font-semibold tracking-wider uppercase transition flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/20"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Verifying Clearance...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Authorize & Unlock Desk</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </>
            )}
          </button>
        </form>

        {/* Terminal Footer Info */}
        <div className="pt-2 border-t border-fin-border/60 flex items-center justify-between text-[10px] text-fin-muted">
          <span>SEC PROTOCOL: AES-256 HMAC</span>
          <span className="text-emerald-400 font-mono flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span>NODE ONLINE</span>
          </span>
        </div>
      </div>
    </div>
  );
};
