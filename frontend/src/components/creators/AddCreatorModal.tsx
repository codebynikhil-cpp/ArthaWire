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
      setError("Maximum limit of 10 monitored creators reached. Please remove an existing creator first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newCreator = await api.addCreator({
        username: username.trim(),
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#111726] border border-gray-800 rounded-2xl w-full max-w-md p-6 space-y-4 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center space-x-2">
            <UserPlus className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold">Add X Financial Creator</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-gray-400">
          Enter the public handle of an Indian financial creator. The platform will automatically extract
          their public posts and stream financial analysis.
        </p>

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-medium text-gray-300 mb-1">
              X Username Handle <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono">@</span>
              <input
                type="text"
                required
                placeholder="e.g. deepakshenoy"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white font-mono placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-300 mb-1">Display Name (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Deepak Shenoy"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-300 mb-1">Description / Notes</label>
            <textarea
              rows={2}
              placeholder="e.g. Capitalmind founder, equity research and macroeconomic cycles"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !username.trim()}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add to Monitoring"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
