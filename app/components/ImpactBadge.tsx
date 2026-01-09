"use client";

import { getImpactRank } from "../utils/impactRank";

interface ImpactBadgeProps {
  marketCapImpact: number;
}

export default function ImpactBadge({ marketCapImpact }: ImpactBadgeProps) {
  const rankInfo = getImpactRank(marketCapImpact);

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 ${rankInfo.borderColor} bg-gradient-to-r ${rankInfo.bgGradient} shadow-lg`}
      style={{
        boxShadow: `0 0 20px ${rankInfo.color}40, 0 0 40px ${rankInfo.color}20`,
      }}
    >
      <span
        className="text-lg font-black"
        style={{ color: rankInfo.color, textShadow: `0 0 10px ${rankInfo.color}` }}
      >
        {rankInfo.rank}
      </span>
      <span
        className="text-xs font-bold uppercase tracking-widest"
        style={{ color: rankInfo.color }}
      >
        {rankInfo.label}
      </span>
    </div>
  );
}

