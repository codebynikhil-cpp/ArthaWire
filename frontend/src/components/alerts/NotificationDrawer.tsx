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
        return <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />;
      case "WARNING":
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-400 shrink-0" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0e131f] border-l border-gray-800 p-6 flex flex-col justify-between shadow-2xl">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-blue-400" />
                <h2 className="text-sm font-bold text-white">Financial Alerts Stream</h2>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={onMarkAllRead}
                  className="text-xs text-gray-400 hover:text-white flex items-center space-x-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark All Read</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-1 rounded bg-gray-800 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-2.5 overflow-y-auto max-h-[80vh] pr-1">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.is_read && onMarkRead(n.id)}
                  className={`p-3 rounded-lg border text-xs space-y-1.5 transition cursor-pointer ${
                    n.is_read
                      ? "bg-gray-900/40 border-gray-800/80 text-gray-400"
                      : "bg-[#141b2d] border-blue-900/40 text-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      {getSeverityIcon(n.severity)}
                      <span className="font-semibold text-white">{n.title}</span>
                    </div>
                    {!n.is_read && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1" />
                    )}
                  </div>

                  <p className="leading-relaxed pl-6">{n.message}</p>

                  <div className="flex items-center justify-between pl-6 text-[10px] text-gray-400 pt-1">
                    <span>{new Date(n.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    {n.metadata_json?.post_url && (
                      <a
                        href={n.metadata_json.post_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                      >
                        <span>Open Post</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}

              {notifications.length === 0 && (
                <p className="text-xs text-gray-400 py-12 text-center">No alerts triggered yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
