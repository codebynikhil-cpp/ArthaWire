import React from "react";
import { TopicCount } from "../../types";
import { Hash } from "lucide-react";

interface TrendingTopicsProps {
  topics: TopicCount[];
  onSelectTopic?: (topic: string) => void;
}

export const TrendingTopics: React.FC<TrendingTopicsProps> = ({ topics, onSelectTopic }) => {
  return (
    <div className="bg-[#111726] border border-gray-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white">Trending Financial Topics</h3>
          <p className="text-xs text-gray-400">Classified across 14 financial categories</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {topics.map((t, idx) => {
          return (
            <button
              key={t.topic}
              onClick={() => onSelectTopic && onSelectTopic(t.topic)}
              className="w-full flex items-center justify-between p-2 rounded-lg bg-gray-900/40 hover:bg-gray-850 border border-gray-800 transition text-left group"
            >
              <div className="flex items-center space-x-2.5">
                <span className="w-5 text-center font-mono text-xs text-gray-400">
                  #{idx + 1}
                </span>
                <span className="text-xs font-medium text-gray-300 group-hover:text-blue-400 transition">
                  {t.topic}
                </span>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700/60">
                {t.count} posts
              </span>
            </button>
          );
        })}
        {topics.length === 0 && (
          <p className="text-xs text-gray-400 py-6 text-center">No topic data available</p>
        )}
      </div>
    </div>
  );
};
