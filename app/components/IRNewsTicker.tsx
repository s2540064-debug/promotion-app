"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { getPlayerRanking } from "../utils/playerRanking";

interface TickerItem {
  id: string;
  code: string;
  userName: string;
  changeRate: number;
}

export default function IRNewsTicker() {
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([]);

  useEffect(() => {
    const updateTicker = () => {
      const ranking = getPlayerRanking();
      const items: TickerItem[] = ranking
        .filter((p) => p.changeRate > 0)
        .slice(0, 10)
        .map((player) => ({
          id: player.userId,
          code: player.userId.slice(-6).toUpperCase(),
          userName: player.userName,
          changeRate: player.changeRate,
        }));

      setTickerItems(items);
    };

    updateTicker();
    const interval = setInterval(updateTicker, 5000);

    return () => clearInterval(interval);
  }, []);

  if (tickerItems.length === 0) return null;

  return (
    <div className="bg-black border-b border-green-500/30 overflow-hidden relative h-10 shadow-lg">
      <div className="flex items-center h-full">
        <div className="flex items-center gap-2 px-4 bg-green-500/10 border-r border-green-500/30 h-full">
          <TrendingUp size={14} className="text-green-400 animate-pulse" />
          <span className="text-xs font-bold text-green-400 uppercase tracking-wider whitespace-nowrap">
            LIVE MARKET
          </span>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <div className="flex gap-6 animate-ticker h-full items-center">
            {/* 2セット表示して無限ループを実現 */}
            {[...tickerItems, ...tickerItems].map((item, index) => (
              <div
                key={`${item.id}_${index}`}
                className="flex items-center gap-3 whitespace-nowrap"
              >
                <span className="text-xs font-mono font-bold text-green-400">
                  {item.code}
                </span>
                <span className="text-xs text-gray-300 font-semibold">{item.userName}</span>
                <span className="text-xs font-mono font-bold text-green-400">
                  +{item.changeRate.toFixed(2)}%
                </span>
                <span className="text-xs text-gray-500">•</span>
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

