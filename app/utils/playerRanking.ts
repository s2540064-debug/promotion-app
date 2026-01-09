// 個人ランキングシステムのユーティリティ

export interface PlayerData {
  userId: string;
  userName: string;
  marketCap: number;
  previousMarketCap: number; // 前日の時価総額
  receivedRespects: number;
  rank: string;
}

const STORAGE_KEY = 'promotion_player_ranking';

// 全プレイヤーのデータを取得（サンプルデータ + 現在のユーザー）
export function getAllPlayers(): PlayerData[] {
  if (typeof window === 'undefined') return [];
  
  // 現在のユーザーのデータを取得
  const { loadMarketData } = require('./marketCap');
  const { getRankFromMarketCap } = require('./marketCap');
  const marketData = loadMarketData();
  const currentRank = getRankFromMarketCap(marketData.marketCap, marketData.receivedRespects);
  
  // サンプルプレイヤーデータ
  const samplePlayers: PlayerData[] = [
    {
      userId: "user1",
      userName: "田中太郎",
      marketCap: 15000000,
      previousMarketCap: 14200000,
      receivedRespects: 3500,
      rank: "社長",
    },
    {
      userId: "user2",
      userName: "佐藤花子",
      marketCap: 12000000,
      previousMarketCap: 11800000,
      receivedRespects: 1200,
      rank: "役員",
    },
    {
      userId: "user3",
      userName: "鈴木一郎",
      marketCap: 8000000,
      previousMarketCap: 7500000,
      receivedRespects: 420,
      rank: "部長",
    },
    {
      userId: "current_user",
      userName: "あなた",
      marketCap: marketData.marketCap,
      previousMarketCap: marketData.marketCap * 0.95, // 仮の前日比
      receivedRespects: marketData.receivedRespects,
      rank: currentRank,
    },
  ];
  
  return samplePlayers;
}

// ランキングを取得（時価総額順）
export function getPlayerRanking(): Array<Omit<PlayerData, 'rank'> & { rank: string; changeRate: number }> {
  const players = getAllPlayers();
  
  // 時価総額順にソート
  const sorted = players.sort((a, b) => b.marketCap - a.marketCap);
  
  // ランクと前日比を計算
  return sorted.map((player, index) => {
    const change = player.marketCap - player.previousMarketCap;
    const changeRate = player.previousMarketCap > 0 
      ? (change / player.previousMarketCap) * 100 
      : 0;
    
    return {
      ...player,
      rank: (index + 1).toString(),
      changeRate,
    };
  });
}

// 現在のユーザーのランキングを取得
export function getCurrentUserRank(): number {
  const ranking = getPlayerRanking();
  const currentUser = ranking.find((p) => p.userId === "current_user");
  return currentUser ? parseInt(currentUser.rank) || 0 : 0;
}

