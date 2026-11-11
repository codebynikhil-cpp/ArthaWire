"use client";

import React from "react";
import { X, Bell, ExternalLink, CheckCheck, AlertTriangle, Info, AlertOctagon } from "lucide-react";
import { NotificationItem } from "../../types";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkRead: (id: number) => void;
  onMarkAllRead: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
  onMarkAllRead
}) => {
  if (!isOpen) return null;

  const getSeverityIcon = (sev: string) => {
    switch (sev) {
      case "CRITICAL":
        return <AlertOctagon className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
      case "WARNING":
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      default:
        return <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-fin-secondary border-l border-fin-border p-5 flex flex-col justify-between shadow-card">
          <div className="space-y-4">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-fin-border pb-3">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-blue-400" />
                <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Surveillance Alerts Stream
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={onMarkAllRead}
                  className="text-[11px] text-fin-muted hover:text-white flex items-center space-x-1 font-mono transition"
                >
                  <CheckCheck className="w-3 h-3" />
                  <span>Mark Read</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-1 rounded bg-fin-elevated text-fin-muted hover:text-white border border-fin-border transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Notification Items List */}
            <div className="space-y-2 overflow-y-auto max-h-[82vh] pr-1">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.is_read && onMarkRead(n.id)}
                  className={`p-3 rounded border text-xs space-y-1.5 transition cursor-pointer ${
                    n.is_read
                      ? "bg-fin-card/40 border-fin-border/60 text-fin-muted"
                      : "bg-fin-elevated border-blue-500/30 text-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      {getSeverityIcon(n.severity)}
                      <span className="font-semibold text-white text-[11px]">{n.title}</span>
                    </div>
                    {!n.is_read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1" />
                    )}
                  </div>

                  <p className="leading-relaxed pl-5 text-[11px] text-slate-300">{n.message}</p>

                  <div className="flex items-center justify-between pl-5 text-[10px] text-fin-muted pt-1 border-t border-fin-border/40 font-mono">
                    <span>
                      {new Date(n.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false
                      })}
                    </span>
                    {n.metadata_json?.post_url && (
                      <a
                        href={n.metadata_json.post_url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                      >
                        <span>View X Post</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}

              {notifications.length === 0 && (
                <p className="text-xs text-fin-muted py-12 text-center font-mono">
                  No alerts in memory
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
