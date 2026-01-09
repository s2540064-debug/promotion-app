// IR重要度ランクの判定ロジック

export type ImpactRank = "S" | "A" | "B";

export interface ImpactRankInfo {
  rank: ImpactRank;
  label: string;
  color: string;
  bgGradient: string;
  borderColor: string;
}

export function getImpactRank(marketCapImpact: number): ImpactRankInfo {
  if (marketCapImpact >= 500000) {
    return {
      rank: "S",
      label: "HIGH IMPACT",
      color: "#ff0080", // ネオンピンク
      bgGradient: "from-pink-500/20 via-purple-500/20 to-pink-500/20",
      borderColor: "border-pink-500/50",
    };
  } else if (marketCapImpact >= 100000) {
    return {
      rank: "A",
      label: "GROWTH",
      color: "#00ff88", // ネオングリーン
      bgGradient: "from-green-500/20 via-emerald-500/20 to-green-500/20",
      borderColor: "border-green-500/50",
    };
  } else {
    return {
      rank: "B",
      label: "STANDARD",
      color: "#ffaa00", // ネオンオレンジ
      bgGradient: "from-orange-500/20 via-yellow-500/20 to-orange-500/20",
      borderColor: "border-orange-500/50",
    };
  }
}

