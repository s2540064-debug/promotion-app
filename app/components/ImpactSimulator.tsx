"use client";

import { TrendingUp } from "lucide-react";
import { calculateMarketImpact } from "../utils/impactSimulator";

interface ImpactSimulatorProps {
  content: string;
  sector: string;
  hasEvidence?: boolean;
}

export default function ImpactSimulator({
  content,
  sector,
  hasEvidence = false,
}: ImpactSimulatorProps) {
  const impact = calculateMarketImpact(content, sector, hasEvidence);
  const maxImpact = 1500000; // 最大インパクト（証拠ありの場合150万円）
  const percentage = Math.min((impact / maxImpact) * 100, 100);

  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp size={16} className="text-green-400" />
        <span className="text-xs font-semibold text-white uppercase tracking-wider">
          推定市場インパクト
        </span>
      </div>

      <div className="mb-3">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-mono font-bold text-green-400">
            +¥{impact.toLocaleString()}
          </span>
          <span className="text-xs text-gray-500">
            / ¥{maxImpact.toLocaleString()}
          </span>
        </div>
      </div>

      {/* プログレスバー */}
      <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-500 via-green-400 to-green-500 rounded-full transition-all duration-500 shadow-lg shadow-green-500/30"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-gray-500 font-mono">
          {percentage.toFixed(1)}%
        </div>
        {hasEvidence && (
          <div className="text-xs text-green-400 font-semibold bg-green-500/20 px-2 py-1 rounded border border-green-500/30">
            +50% Trust Bonus
          </div>
        )}
      </div>
    </div>
  );
}

