"use client";

import { Trophy, TrendingUp } from "lucide-react";
import { getPlayerRanking } from "../utils/playerRanking";
import { useEffect, useState } from "react";

interface TopGainerData {
  userId: string;
  userName: string;
  rank: string;
  marketCap: number;
  changeRate: number;
  change: number;
}

export default function DailyTopGainer() {
  const [topGainer, setTopGainer] = useState<TopGainerData | null>(null);

  useEffect(() => {
    const ranking = getPlayerRanking();
    // 最も上昇率が高いユーザーを取得
    const gainer = ranking
      .filter((p) => p.changeRate > 0)
      .sort((a, b) => b.changeRate - a.changeRate)[0];

    if (gainer) {
      setTopGainer({
        userId: gainer.userId,
        userName: gainer.userName,
        rank: gainer.rank,
        marketCap: gainer.marketCap,
        changeRate: gainer.changeRate,
        change: gainer.marketCap - gainer.previousMarketCap,
      });
    }
  }, []);

  if (!topGainer) return null;

  return (
    <div className="mb-4">
      <div className="bg-gradient-to-br from-[#D4AF37]/20 via-[#FFD700]/15 to-[#D4AF37]/20 border border-[#D4AF37]/40 rounded-lg p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <Trophy size={18} className="text-[#FFD700]" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-[#D4AF37] text-black text-xs font-bold rounded">
                  {topGainer.rank}
                </span>
                <h3 className="text-lg font-bold text-white">{topGainer.userName}</h3>
              </div>
              <div className="text-sm text-gray-300">
                時価総額 <span className="text-[#D4AF37] font-mono font-bold">¥{topGainer.marketCap.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-green-400">
            <TrendingUp size={18} />
            <span className="text-xl font-mono font-bold">
              +{topGainer.changeRate.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

