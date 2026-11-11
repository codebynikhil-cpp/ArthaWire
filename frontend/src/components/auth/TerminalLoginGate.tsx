"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Lock, KeyRound, AlertTriangle, ArrowRight, Activity, Terminal, Mail, CheckCircle } from "lucide-react";
import { api } from "../../lib/api";

interface TerminalLoginGateProps {
  onAuthenticated: (role: string, displayName: string, email?: string, picture?: string) => void;
}

export const TerminalLoginGate: React.FC<TerminalLoginGateProps> = ({ onAuthenticated }) => {
  const [accessKey, setAccessKey] = useState("");
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleName, setGoogleName] = useState("");
  const [showGoogleInput, setShowGoogleInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize official Google Identity Services script if client ID is configured
  useEffect(() => {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (googleClientId && typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        try {
          // @ts-ignore
          if (window.google?.accounts?.id) {
            // @ts-ignore
            window.google.accounts.id.initialize({
              client_id: googleClientId,
              callback: handleGoogleCredentialResponse,
            });
            // @ts-ignore
            window.google.accounts.id.renderButton(
              document.getElementById("gsi-button-target"),
              { theme: "filled_black", size: "large", width: 340, text: "continue_with" }
            );
          }
        } catch {}
      };
      document.body.appendChild(script);
    }
  }, []);

  const handleGoogleCredentialResponse = async (response: any) => {
    try {
      setLoading(true);
      setError(null);
      // Decode JWT payload from Google credential
      const base64Url = response.credential.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const user = JSON.parse(jsonPayload);

      const res = await api.loginWithGoogle({
        email: user.email,
        name: user.name,
        picture: user.picture,
        credential: response.credential,
      });

      if (res.authenticated && res.token) {
        localStorage.setItem("arthawire_auth_token", res.token);
        localStorage.setItem("arthawire_auth_role", res.role);
        localStorage.setItem("arthawire_auth_user", res.display_name);
        if (res.email) localStorage.setItem("arthawire_auth_email", res.email);
        if (res.picture) localStorage.setItem("arthawire_auth_picture", res.picture);
        onAuthenticated(res.role, res.display_name, res.email, res.picture);
      }
    } catch (err: any) {
      setError(err.message || "Google Authentication Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCustomGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmail.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const email = googleEmail.trim();
      const name = googleName.trim() || email.split("@")[0];
      const picture = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;

      const res = await api.loginWithGoogle({
        email,
        name,
        picture,
      });

      if (res.authenticated && res.token) {
        localStorage.setItem("arthawire_auth_token", res.token);
        localStorage.setItem("arthawire_auth_role", res.role);
        localStorage.setItem("arthawire_auth_user", res.display_name);
        localStorage.setItem("arthawire_auth_email", email);
        localStorage.setItem("arthawire_auth_picture", picture);
        onAuthenticated(res.role, res.display_name, email, picture);
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google account.");
    } finally {
      setLoading(false);
    }
  };

  const handleMasterKeySubmit = async (e: React.FormEvent) => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070A0F] text-fin-text p-4 font-mono select-none overflow-y-auto">
      {/* Subtle Background Grid & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Terminal Vault Card */}
      <div className="relative w-full max-w-md bg-fin-card border border-fin-border rounded-xl shadow-2xl p-6 sm:p-8 space-y-5 backdrop-blur my-8">
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
            <span className="font-semibold uppercase tracking-wider">SECURE</span>
          </div>
        </div>

        {/* Security Notice */}
        <div className="space-y-1 text-center">
          <h2 className="text-sm font-semibold text-white tracking-wider uppercase flex items-center justify-center space-x-2">
            <Terminal className="w-4 h-4 text-blue-400 inline" />
            <span>Sign In to Access Terminal</span>
          </h2>
          <p className="text-xs text-fin-muted font-sans leading-relaxed">
            Connect with your Google account to personalize your NSE/BSE surveillance feed, alerts, and creator watchlist.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2 animate-shake">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span className="font-mono text-[11px]">{error}</span>
          </div>
        )}

        {/* Google Authentication Section */}
        <div className="space-y-3">
          <div id="gsi-button-target" className="flex justify-center" />

          {/* Primary Continue with Google Button */}
          {!showGoogleInput ? (
            <button
              type="button"
              onClick={() => setShowGoogleInput(true)}
              className="w-full py-2.5 px-4 rounded-lg bg-white hover:bg-slate-100 text-slate-900 text-xs font-semibold tracking-wider transition flex items-center justify-center space-x-2.5 shadow-md"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          ) : (
            <form onSubmit={handleCustomGoogleSubmit} className="space-y-3 p-3.5 rounded-lg bg-fin-secondary border border-fin-border">
              <div className="flex items-center justify-between pb-1 border-b border-fin-border/60">
                <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider flex items-center space-x-1">
                  <Mail className="w-3 h-3" />
                  <span>Google Account Details</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowGoogleInput(false)}
                  className="text-[10px] text-fin-muted hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-fin-muted">YOUR GOOGLE EMAIL</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. nikhil@gmail.com"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-fin-card border border-fin-border rounded text-white placeholder-fin-muted focus:outline-none focus:border-blue-500 font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-fin-muted">DISPLAY NAME (OPTIONAL)</label>
                <input
                  type="text"
                  placeholder="e.g. Nikhil Kumar"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-fin-card border border-fin-border rounded text-white placeholder-fin-muted focus:outline-none focus:border-blue-500 font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !googleEmail.trim()}
                className="w-full py-2 px-3 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold tracking-wider uppercase transition flex items-center justify-center space-x-1.5 disabled:opacity-50"
              >
                {loading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Authorize as Google User</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-fin-border/60"></div>
          <span className="flex-shrink mx-3 text-[10px] text-fin-muted uppercase tracking-wider">
            OR MASTER ACCESS KEY
          </span>
          <div className="flex-grow border-t border-fin-border/60"></div>
        </div>

        {/* Master Access Key Form */}
        <form onSubmit={handleMasterKeySubmit} className="space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] text-fin-muted uppercase">
              <span className="flex items-center space-x-1">
                <KeyRound className="w-3 h-3 text-blue-400" />
                <span>TERMINAL MASTER KEY</span>
              </span>
              <button
                type="button"
                onClick={() => setAccessKey("ARTHA-2026")}
                className="text-[10px] text-blue-400 hover:text-blue-300 underline underline-offset-2"
              >
                Default: ARTHA-2026
              </button>
            </div>
            <input
              type="password"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              placeholder="ENTER KEY (e.g. ARTHA-2026)"
              className="w-full px-3 py-2 text-xs bg-fin-secondary border border-fin-border rounded text-white placeholder-fin-muted focus:outline-none focus:border-blue-500 font-mono tracking-wider transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !accessKey.trim()}
            className="w-full py-2 px-3 rounded bg-fin-card hover:bg-fin-hover text-fin-secondaryText hover:text-white border border-fin-border text-xs font-semibold tracking-wider uppercase transition flex items-center justify-center space-x-1.5 disabled:opacity-50"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Unlock via Master Key</span>
            <ArrowRight className="w-3 h-3 ml-1" />
          </button>
        </form>

        {/* Terminal Footer Info */}
        <div className="pt-2 border-t border-fin-border/60 flex items-center justify-between text-[10px] text-fin-muted">
          <span>OAUTH 2.0 & HMAC-SHA256</span>
          <span className="text-emerald-400 font-mono flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span>NODE ONLINE</span>
          </span>
        </div>
      </div>
    </div>
  );
};
