// 証拠写真アーカイブのダミーデータ
// 実際の実装では、APIから取得するか、localStorageから読み込む

import { EvidenceItem } from "../components/EvidenceGallery";

export function getEvidenceArchive(userId: string): EvidenceItem[] {
  // ダミーデータ
  const dummyEvidence: EvidenceItem[] = [
    {
      id: "1",
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=400&fit=crop",
      impact: 850000,
      content: "今日、ついにTOEIC900点を突破しました！毎日2時間の勉強を3ヶ月続けた成果です。次は英検1級に挑戦します！",
      date: "2024年1月15日",
      sector: "自己研鑽",
    },
    {
      id: "2",
      imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
      impact: 420000,
      content: "筋トレ100日連続達成！体重5kg減、体脂肪率も8%減りました。健康診断の数値も全て改善しました！",
      date: "2024年1月10日",
      sector: "フィジカル",
    },
    {
      id: "3",
      imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=400&fit=crop",
      impact: 250000,
      content: "プログラミング学習でReactのポートフォリオサイトを完成させました。GitHubに公開して、初めてのスターももらいました！",
      date: "2024年1月5日",
      sector: "自己研鑽",
    },
    {
      id: "4",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop",
      impact: 1200000,
      content: "新規事業の売上が月間100万円を突破しました！チーム一丸となって取り組んだ結果です。",
      date: "2023年12月28日",
      sector: "ビジネス",
    },
    {
      id: "5",
      imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=400&fit=crop",
      impact: 680000,
      content: "資格試験に合格しました！3ヶ月間、仕事の合間を縫って勉強を続けた結果です。",
      date: "2023年12月20日",
      sector: "自己研鑽",
    },
    {
      id: "6",
      imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop",
      impact: 950000,
      content: "マラソン大会で自己ベストを更新しました！目標タイムを30秒短縮できました。",
      date: "2023年12月15日",
      sector: "フィジカル",
    },
  ];

  return dummyEvidence;
}

