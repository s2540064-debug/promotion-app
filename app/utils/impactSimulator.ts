// 市場インパクト推定ロジック

export function calculateMarketImpact(
  content: string,
  sector: string,
  hasEvidence: boolean = false
): number {
  // 文字数ベースの基本インパクト
  const baseImpact = content.length * 100;

  // セクター別の倍率
  const sectorMultipliers: Record<string, number> = {
    ビジネス: 1.5,
    自己研鑽: 1.3,
    フィジカル: 1.2,
    その他: 1.0,
  };

  const multiplier = sectorMultipliers[sector] || 1.0;

  // キーワードボーナス（簡易版）
  const keywords = [
    "達成", "突破", "合格", "完成", "成功", "記録", "更新", "獲得",
    "優勝", "受賞", "昇進", "起業", "上場", "契約", "売上", "利益",
  ];

  let keywordBonus = 0;
  keywords.forEach((keyword) => {
    if (content.includes(keyword)) {
      keywordBonus += 50000;
    }
  });

  // 文字数ボーナス（長文ほど高評価）
  const lengthBonus = content.length > 200 ? (content.length - 200) * 200 : 0;

  let totalImpact = Math.floor(
    (baseImpact + keywordBonus + lengthBonus) * multiplier
  );

  // 信頼性ボーナス（証拠写真がある場合1.5倍）
  if (hasEvidence) {
    totalImpact = Math.floor(totalImpact * 1.5);
  }

  return totalImpact;
}

