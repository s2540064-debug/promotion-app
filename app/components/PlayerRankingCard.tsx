"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { getPlayerRanking } from "../utils/playerRanking";
import { useEffect, useState } from "react";

export default function PlayerRankingCard() {
  const [ranking, setRanking] = useState<ReturnType<typeof getPlayerRanking>>([]);

  useEffect(() => {
    const updateRanking = () => {
      setRanking(getPlayerRanking().slice(0, 10)); // 上位10名
    };
    
    updateRanking();
    const interval = setInterval(updateRanking, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-900 rounded-lg p-3 mb-4 border border-gray-800">
      <h2 className="text-xs font-semibold text-white mb-3 flex items-center gap-2">
        <span className="w-1 h-3 bg-[#D4AF37]"></span>
        個人時価総額ランキング
      </h2>
      <div className="space-y-1.5">
        {ranking.map((player) => {
          const isPositive = player.changeRate >= 0;
          const isCurrentUser = player.userId === "current_user";
          
          return (
            <div
              key={player.userId}
              className={`flex items-center justify-between p-2 rounded ${
                isCurrentUser
                  ? "bg-[#D4AF37]/10 border border-[#D4AF37]/30"
                  : "bg-black/50 border border-gray-800"
              }`}
            >
              <div className="flex items-center gap-2 flex-1">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    player.rank === "1"
                      ? "bg-[#FFD700] text-black"
                      : player.rank === "2"
                      ? "bg-[#C0C0C0] text-black"
                      : player.rank === "3"
                      ? "bg-[#CD7F32] text-black"
                      : "bg-gray-700 text-white"
                  }`}
                >
                  {player.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold truncate ${isCurrentUser ? "text-[#D4AF37]" : "text-white"}`}>
                      {player.userName}
                    </span>
                    {isCurrentUser && (
                      <span className="text-[10px] text-[#D4AF37] bg-[#D4AF37]/20 px-1.5 py-0.5 rounded flex-shrink-0">
                        あなた
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-mono font-bold text-[#D4AF37]">
                      ¥{player.marketCap.toLocaleString()}
                    </span>
                    <div className={`flex items-center gap-0.5 text-[10px] font-semibold ${
                      isPositive ? "text-green-400" : "text-red-400"
                    }`}>
                      {isPositive ? (
                        <TrendingUp size={10} />
                      ) : (
                        <TrendingDown size={10} />
                      )}
                      <span>
                        {isPositive ? "+" : ""}
                        {player.changeRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

