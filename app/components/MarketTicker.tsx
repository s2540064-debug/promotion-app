"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";
import { getPlayerRanking } from "../utils/playerRanking";

interface TickerItem {
  id: string;
  name: string;
  changeRate: number;
  marketCap: number;
}

export default function MarketTicker() {
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([]);

  useEffect(() => {
    // 個人ランキングからデータを取得
    const ranking = getPlayerRanking();
    const items: TickerItem[] = ranking.slice(0, 10).map((player) => ({
      id: player.userId,
      name: player.userName,
      changeRate: player.changeRate,
      marketCap: player.marketCap,
    }));

    setTickerItems(items);
    
    // 5秒ごとに更新
    const interval = setInterval(() => {
      const updatedRanking = getPlayerRanking();
      const updatedItems = updatedRanking.slice(0, 10).map((player) => ({
        id: player.userId,
        name: player.userName,
        changeRate: player.changeRate,
        marketCap: player.marketCap,
      }));
      setTickerItems(updatedItems);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black border-b border-gray-800 overflow-hidden">
      <div className="flex items-center gap-4 px-4 py-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#D4AF37] whitespace-nowrap">
          <TrendingUp size={14} />
          <span>本日の値上がり率</span>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <div className="flex gap-6 animate-ticker">
            {/* 2セット表示して無限ループを実現 */}
            {[...tickerItems, ...tickerItems].map((item, index) => (
              <div
                key={`${item.id}_${index}`}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <span className="text-xs text-gray-300 font-semibold">{item.name}</span>
                <span
                  className={`text-xs font-mono font-bold ${
                    item.changeRate >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {item.changeRate >= 0 ? "+" : ""}
                  {item.changeRate}%
                </span>
                <span className="text-xs text-gray-500 font-mono">
                  ¥{(item.marketCap / 10000).toFixed(0)}万
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-ticker {
          animation: ticker 30s linear infinite;
        }
      `}</style>
    </div>
  );
}

