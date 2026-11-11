"use client";

import React, { useState } from "react";
import { X, UserPlus, AlertCircle } from "lucide-react";
import { api } from "../../lib/api";
import { Creator } from "../../types";

interface AddCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatorAdded: (creator: Creator) => void;
  currentCount: number;
}

export const AddCreatorModal: React.FC<AddCreatorModalProps> = ({
  isOpen,
  onClose,
  onCreatorAdded,
  currentCount
}) => {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    if (currentCount >= 10) {
      setError("Maximum limit of 10 monitored creators reached. Please pause or remove an existing creator.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newCreator = await api.addCreator({
        username: username.trim().replace(/^@/, ""),
        display_name: displayName.trim() || undefined,
        description: description.trim() || undefined,
        is_active: true
      });
      onCreatorAdded(newCreator);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to add creator");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-fin-secondary border border-fin-border rounded-lg w-full max-w-md p-5 space-y-4 text-white shadow-card">
        <div className="flex items-center justify-between border-b border-fin-border pb-3">
          <div className="flex items-center space-x-2">
            <UserPlus className="w-4 h-4 text-blue-400" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider">
              Enlist Indian Financial Creator
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded bg-fin-elevated text-fin-muted hover:text-white border border-fin-border transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[11px] text-fin-muted">
          Add an Indian market creator public handle. FinPulse will incrementally retrieve their public X posts and route them through the FinBERT financial NLP pipeline.
        </p>

        {error && (
          <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-mono text-[10px] uppercase text-fin-secondaryText mb-1">
              X Username Handle <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-fin-muted font-mono">@</span>
              <input
                type="text"
                required
                placeholder="e.g. deepakshenoy"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-7 pr-3 py-1.5 bg-fin-card border border-fin-border rounded text-white font-mono placeholder-fin-muted focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase text-fin-secondaryText mb-1">
              Display Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Deepak Shenoy"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-1.5 bg-fin-card border border-fin-border rounded text-white placeholder-fin-muted focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase text-fin-secondaryText mb-1">
              Focus / Bio Description (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Capitalmind CEO, macro & Dalal Street equities research"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-1.5 bg-fin-card border border-fin-border rounded text-white placeholder-fin-muted focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-fin-border">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-fin-muted hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || currentCount >= 10}
              className="px-3.5 py-1.5 text-xs font-mono font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded transition disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Enlist Creator"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
