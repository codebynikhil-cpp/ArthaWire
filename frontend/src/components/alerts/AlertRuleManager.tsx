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
    } catch { }
  };

  const handleDelete = async (ruleId: number) => {
    try {
      await api.deleteAlertRule(ruleId);
      onRulesUpdated();
    } catch { }
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
    } catch { }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-fin-card border border-fin-border rounded-lg p-4 space-y-4 shadow-terminal">
      <div className="flex items-center justify-between border-b border-fin-border pb-3">
        <div>
          <h3 className="text-xs font-mono font-semibold text-white tracking-wider uppercase">
            Dalal Street Alert Engine
          </h3>
          <p className="text-[11px] text-fin-muted">
            Real-time automated notification triggers for Indian stock mentions, RBI actions & sentiment swings
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Alert Trigger</span>
        </button>
      </div>

      {/* Add Rule Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreateRule}
          className="p-3.5 rounded bg-fin-elevated border border-fin-border text-xs space-y-3"
        >
          <h4 className="font-mono font-semibold text-white text-[11px] uppercase">Configure Trigger Rule</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-fin-muted text-[10px] uppercase font-mono mb-1">Rule Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Surveillance: Reliance Industries"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-fin-card border border-fin-border rounded text-white text-xs font-sans placeholder-fin-muted focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-fin-muted text-[10px] uppercase font-mono mb-1">Trigger Type</label>
              <select
                value={ruleType}
                onChange={(e) => setRuleType(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-fin-card border border-fin-border rounded text-white text-xs font-sans focus:outline-none focus:border-blue-500"
              >
                <option value="ENTITY_MENTION">Indian Company Mention</option>
                <option value="RBI_POLICY">RBI Monetary Policy Discussion</option>
                <option value="HIGH_IMPACT_EVENT">High-Impact Corporate Event</option>
                <option value="MULTI_CREATOR">Multi-Creator Discussion Velocity</option>
                <option value="SENTIMENT_EXTREME">Extreme Sentiment Outlier</option>
              </select>
            </div>
            {ruleType === "ENTITY_MENTION" && (
              <div>
                <label className="block text-fin-muted text-[10px] uppercase font-mono mb-1">Target Stock Ticker</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RELIANCE, TCS, INFY"
                  value={targetSymbol}
                  onChange={(e) => setTargetSymbol(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-fin-card border border-fin-border rounded text-white text-xs font-mono uppercase focus:outline-none focus:border-blue-500"
                />
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-2 pt-1 border-t border-fin-border">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-2.5 py-1 text-xs text-fin-muted hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-1 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Save Trigger"}
            </button>
          </div>
        </form>
      )}

      {/* Rules Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-fin-border text-fin-muted font-mono uppercase text-[10px]">
              <th className="pb-2">Rule Name</th>
              <th className="pb-2">Trigger Criteria</th>
              <th className="pb-2 text-center">Status</th>
              <th className="pb-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-fin-border/50">
            {rules.map((rule) => (
              <tr key={rule.id} className="hover:bg-fin-hover/40 transition">
                <td className="py-2.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-white text-xs">{rule.name}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-fin-elevated text-fin-muted border border-fin-border">
                      {rule.rule_type}
                    </span>
                  </div>
                </td>
                <td className="py-2.5 text-slate-300 font-mono text-[11px]">
                  {rule.criteria.symbol && (
                    <span className="text-emerald-400 font-bold">${rule.criteria.symbol}</span>
                  )}
                  {rule.criteria.keywords && (
                    <span>Keywords: {rule.criteria.keywords.join(", ")}</span>
                  )}
                  {rule.criteria.events && (
                    <span>Events: {rule.criteria.events.join(", ")}</span>
                  )}
                  {rule.criteria.min_creators && (
                    <span>Min {rule.criteria.min_creators} Creators in {rule.criteria.time_window_hours}h</span>
                  )}
                  {rule.criteria.sentiment && (
                    <span>Sentiment: {rule.criteria.sentiment}</span>
                  )}
                </td>
                <td className="py-2.5 text-center">
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                      rule.is_active
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                        : "bg-fin-elevated text-fin-muted border-fin-border"
                    }`}
                  >
                    {rule.is_active ? "ENABLED" : "MUTED"}
                  </span>
                </td>
                <td className="py-2.5 text-right">
                  <div className="flex items-center justify-end space-x-1.5">
                    <button
                      onClick={() => handleToggle(rule.id, rule.is_active)}
                      className={`p-1 rounded border transition ${
                        rule.is_active
                          ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/25"
                          : "text-fin-muted bg-fin-elevated border-fin-border"
                      }`}
                      title={rule.is_active ? "Mute alert" : "Enable alert"}
                    >
                      <Power className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDelete(rule.id)}
                      className="p-1 rounded bg-fin-elevated hover:bg-rose-500/10 text-fin-muted hover:text-rose-400 border border-fin-border hover:border-rose-500/30 transition"
                      title="Delete rule"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rules.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-fin-muted font-mono">
                  No alert triggers configured
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
