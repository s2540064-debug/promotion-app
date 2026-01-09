"use client";

import { useEffect, useState } from "react";
import ImpactCard from "./ImpactCard";
import { getPlayerRanking } from "../utils/playerRanking";

interface ImpactCardWithRankingProps {
  id: string;
  userId: string;
  userName: string;
  rank: string;
  content: string;
  timestamp: string;
  marketCapImpact: number;
}

export default function ImpactCardWithRanking(props: ImpactCardWithRankingProps) {
  const [playerData, setPlayerData] = useState<{ marketCap: number; previousMarketCap: number } | null>(null);

  useEffect(() => {
    const ranking = getPlayerRanking();
    const player = ranking.find((p) => p.userId === props.userId);
    if (player) {
      setPlayerData({
        marketCap: player.marketCap,
        previousMarketCap: player.previousMarketCap,
      });
    }
  }, [props.userId]);

  return (
    <ImpactCard
      id={props.id}
      userId={props.userId}
      userName={props.userName}
      rank={props.rank}
      content={props.content}
      timestamp={props.timestamp}
      marketCapImpact={props.marketCapImpact}
      marketCap={playerData?.marketCap || 0}
      previousMarketCap={playerData?.previousMarketCap || 0}
    />
  );
}

