"use client";

import React, { useState } from "react";
import { Plus, Trash2, Power, Bell, ShieldAlert, Check } from "lucide-react";
import { AlertRule } from "../../types";
import { api } from "../../lib/api";

interface AlertRuleManagerProps {
  rules: AlertRule[];
  onRulesUpdated: () => void;
}

export const AlertRuleManager: React.FC<AlertRuleManagerProps> = ({ rules, onRulesUpdated }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [ruleType, setRuleType] = useState("ENTITY_MENTION");
  const [targetSymbol, setTargetSymbol] = useState("RELIANCE");
  const [loading, setLoading] = useState(false);

  const handleToggle = async (ruleId: number, currentStatus: boolean) => {
    try {
      await api.toggleAlertRule(ruleId, !currentStatus);
      onRulesUpdated();
    } catch {}
  };

  const handleDelete = async (ruleId: number) => {
    try {
      await api.deleteAlertRule(ruleId);
      onRulesUpdated();
    } catch {}
  };

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    let criteria: any = {};

    if (ruleType === "ENTITY_MENTION") {
      criteria = { symbol: targetSymbol.trim().toUpperCase() };
    } else if (ruleType === "RBI_POLICY") {
      criteria = { keywords: ["repo rate", "rbi", "mpc", "rate cut", "rate hike"] };
    } else if (ruleType === "HIGH_IMPACT_EVENT") {
      criteria = { events: ["Earnings", "Merger", "Resignation", "Regulatory"] };
    } else if (ruleType === "MULTI_CREATOR") {
      criteria = { min_creators: 2, time_window_hours: 24 };
    } else if (ruleType === "SENTIMENT_EXTREME") {
      criteria = { sentiment: "Negative" };
    }

    try {
      await api.createAlertRule({
        name: name.trim(),
        rule_type: ruleType,
        criteria
      });
      setName("");
      setShowAddForm(false);
      onRulesUpdated();
    } catch {}
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#111726] border border-gray-800 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Configured Financial Alert Rules</h3>
          <p className="text-xs text-gray-400">
            Real-time triggers for Indian company mentions, RBI policy updates & multi-creator signals
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Alert Rule</span>
        </button>
      </div>

      {/* Add Rule Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreateRule}
          className="p-4 rounded-xl bg-gray-900 border border-gray-750 text-xs space-y-3"
        >
          <h4 className="font-semibold text-white">Configure New Alert Trigger</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-gray-400 mb-1">Rule Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Alert on Tata Motors Discussions"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Trigger Type</label>
              <select
                value={ruleType}
                onChange={(e) => setRuleType(e.target.value)}
                className="w-full px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white"
              >
                <option value="ENTITY_MENTION">Specific Ticker Mention</option>
                <option value="RBI_POLICY">RBI Monetary Policy & Repo Rate</option>
                <option value="HIGH_IMPACT_EVENT">High-Impact Corporate Events</option>
                <option value="MULTI_CREATOR">Multi-Creator Consensus</option>
                <option value="SENTIMENT_EXTREME">Extreme Negative/Positive</option>
              </select>
            </div>
            {ruleType === "ENTITY_MENTION" && (
              <div>
                <label className="block text-gray-400 mb-1">Stock Ticker Symbol</label>
                <input
                  type="text"
                  placeholder="e.g. TATAMOTORS"
                  value={targetSymbol}
                  onChange={(e) => setTargetSymbol(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono uppercase"
                />
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg"
            >
              {loading ? "Saving..." : "Save Rule"}
            </button>
          </div>
        </form>
      )}

      {/* Rules List */}
      <div className="space-y-2.5">
        {rules.map((r) => (
          <div
            key={r.id}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-900/40 border border-gray-800/80 text-xs"
          >
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-white">{r.name}</span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-gray-800 text-blue-400 border border-gray-700">
                  {r.rule_type}
                </span>
              </div>
              <p className="text-gray-400 text-[11px] font-mono">
                Criteria: {JSON.stringify(r.criteria)}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleToggle(r.id, r.is_active)}
                className={`p-1.5 rounded-lg border transition ${
                  r.is_active
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-gray-800 text-gray-400 border-gray-700"
                }`}
                title={r.is_active ? "Rule active" : "Rule paused"}
              >
                <Power className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(r.id)}
                className="p-1.5 text-rose-400/80 hover:text-rose-400 bg-gray-900 border border-gray-800 rounded-lg transition"
                title="Delete rule"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
