"use client";

import { Trophy } from "lucide-react";
import { getCurrentUserRank } from "../utils/playerRanking";
import { useEffect, useState } from "react";

export default function PlayerRankingDisplay() {
  const [rank, setRank] = useState(0);

  useEffect(() => {
    const updateRank = () => {
      setRank(getCurrentUserRank());
    };
    
    updateRank();
    const interval = setInterval(updateRank, 5000); // 5秒ごとに更新
    
    return () => clearInterval(interval);
  }, []);

  if (rank === 0) return null;

  return (
    <div className="flex items-center gap-1">
      {rank <= 3 && (
        <Trophy
          size={14}
          className={
            rank === 1
              ? "text-[#FFD700]"
              : rank === 2
              ? "text-[#C0C0C0]"
              : "text-[#CD7F32]"
          }
        />
      )}
      <span className="text-xs font-bold text-[#D4AF37]">#{rank}</span>
    </div>
  );
}

