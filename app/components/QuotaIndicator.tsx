"use client";

import { useMarket } from "../contexts/MarketContext";
import { AlertCircle } from "lucide-react";

export default function QuotaIndicator() {
  const { quotaProgress, showWarning } = useMarket();

  const isComplete = quotaProgress.current >= quotaProgress.quota;
  const isWarning = showWarning && !isComplete;

  return (
    <div
      className={`fixed bottom-20 left-0 right-0 z-40 max-w-md mx-auto px-4 ${
        isWarning ? "animate-pulse" : ""
      }`}
    >
      <div
        className={`rounded-lg p-3 border backdrop-blur-sm ${
          isComplete
            ? "bg-green-900/30 border-green-600/50"
            : isWarning
            ? "bg-red-900/30 border-red-600/50"
            : "bg-gray-900/30 border-gray-700/50"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isWarning && <AlertCircle size={16} className="text-red-400" />}
            <span className="text-xs font-semibold text-gray-300">
              本日の投資ノルマ
            </span>
          </div>
          <span
            className={`text-sm font-bold ${
              isComplete
                ? "text-green-400"
                : isWarning
                ? "text-red-400"
                : "text-gray-400"
            }`}
          >
            {quotaProgress.current}/{quotaProgress.quota}
          </span>
        </div>
        {/* プログレスバー */}
        <div className="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              isComplete
                ? "bg-gradient-to-r from-green-500 to-green-400"
                : isWarning
                ? "bg-gradient-to-r from-red-500 to-red-400"
                : "bg-gradient-to-r from-[#D4AF37] to-[#FFD700]"
            }`}
            style={{ width: `${quotaProgress.percentage}%` }}
          />
        </div>
        {isWarning && (
          <p className="text-xs text-red-400 mt-1.5">
            ノルマ未達成の場合、明日の時価総額が30%暴落します
          </p>
        )}
      </div>
    </div>
  );
}

