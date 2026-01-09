// 時価総額システムのユーティリティ

export interface UserMarketData {
  marketCap: number; // 時価総額
  receivedRespects: number; // 受け取ったRespect総数
  givenRespectsToday: number; // 今日送ったRespect数
  lastCheckDate: string; // 最後にチェックした日付 (YYYY-MM-DD)
  dailyRespects: Record<string, number>; // 日付ごとのRespect送信数 { "2024-01-01": 3 }
}

const DAILY_QUOTA = 3; // 1日のノルマ
const PENALTY_RATE = 0.3; // 30%のペナルティ

// 初期データ
export function getInitialMarketData(): UserMarketData {
  const today = new Date().toISOString().split('T')[0];
  return {
    marketCap: 1000, // 初期時価総額
    receivedRespects: 0,
    givenRespectsToday: 0,
    lastCheckDate: today,
    dailyRespects: {},
  };
}

// localStorageからデータを読み込む
export function loadMarketData(): UserMarketData {
  if (typeof window === 'undefined') return getInitialMarketData();
  
  const stored = localStorage.getItem('promotion_market_data');
  if (!stored) return getInitialMarketData();
  
  try {
    const data = JSON.parse(stored);
    // 今日の日付を取得
    const today = new Date().toISOString().split('T')[0];
    
    // 日付が変わった場合の処理
    if (data.lastCheckDate !== today) {
      return checkDailyQuota(data, today);
    }
    
    return data;
  } catch {
    return getInitialMarketData();
  }
}

// データを保存
export function saveMarketData(data: UserMarketData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('promotion_market_data', JSON.stringify(data));
}

// 日次ノルマチェックとペナルティ適用
function checkDailyQuota(data: UserMarketData, today: string): UserMarketData {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];
  
  const yesterdayRespects = data.dailyRespects[yesterday] || 0;
  const oldMarketCap = data.marketCap;
  
  // ノルマ未達成の場合、時価総額を30%ダウン
  if (yesterdayRespects < DAILY_QUOTA) {
    const penalty = data.marketCap * PENALTY_RATE;
    data.marketCap = Math.max(100, Math.floor(data.marketCap - penalty));
    
    // 階級降格のチェック（時価総額が下がった場合）
    const { demoted, oldRank, newRank } = checkRankDemotion(
      oldMarketCap,
      data.marketCap,
      data.receivedRespects
    );
    
    if (demoted) {
      // 階級降格の通知（実際の実装では、トースト通知などで表示）
      console.log(`階級降格: ${oldRank} → ${newRank}`);
    }
  }
  
  // 今日のデータをリセット
  data.givenRespectsToday = 0;
  data.lastCheckDate = today;
  
  // 古い日付のデータをクリーンアップ（30日以上前）
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];
  
  Object.keys(data.dailyRespects).forEach((date) => {
    if (date < thirtyDaysAgo) {
      delete data.dailyRespects[date];
    }
  });
  
  return data;
}

// 投資を受け取った時の処理（時価総額上昇）
export function receiveRespect(amount: number = 1): UserMarketData {
  const data = loadMarketData();
  data.receivedRespects += amount;
  
  // 市場不況モードを適用
  const { applyMarketCrashMultiplier } = require('./marketCrash');
  const baseGrowth = amount * 10; // 1投資 = 10時価総額
  const adjustedGrowth = applyMarketCrashMultiplier(baseGrowth);
  
  data.marketCap += Math.floor(adjustedGrowth);
  saveMarketData(data);
  return data;
}

// Respectを送信した時の処理
export function sendRespect(): UserMarketData {
  const data = loadMarketData();
  const today = new Date().toISOString().split('T')[0];
  
  // 今日の日付が変わった場合、チェックを実行
  if (data.lastCheckDate !== today) {
    const updated = checkDailyQuota(data, today);
    data.givenRespectsToday = 1;
    updated.givenRespectsToday = 1;
    updated.dailyRespects[today] = 1;
    saveMarketData(updated);
    return updated;
  }
  
  data.givenRespectsToday += 1;
  data.dailyRespects[today] = (data.dailyRespects[today] || 0) + 1;
  saveMarketData(data);
  return data;
}

// 時価総額から階級を計算（既存のrank.tsと統合）
import { calculateRank, type Rank } from './rank';

export function getRankFromMarketCap(marketCap: number, receivedRespects: number, postCount: number = 0): Rank {
  // 時価総額をスコアに変換
  // 時価総額 = 受け取ったRespect数 * 10 なので、逆算してリスペクト数を取得
  // より正確には、時価総額から直接スコアを計算
  const respectCount = Math.max(receivedRespects, Math.floor(marketCap / 10));
  return calculateRank(postCount, respectCount);
}

// 時価総額が下がった時に階級が降格するかチェック
export function checkRankDemotion(
  oldMarketCap: number,
  newMarketCap: number,
  receivedRespects: number,
  postCount: number = 0
): { demoted: boolean; oldRank: Rank; newRank: Rank } {
  const oldRank = getRankFromMarketCap(oldMarketCap, receivedRespects, postCount);
  const newRank = getRankFromMarketCap(newMarketCap, receivedRespects, postCount);
  
  // 階級のインデックスを比較
  const rankOrder: Rank[] = ["新人", "主任", "係長", "課長", "部長", "役員", "社長", "会長"];
  const oldIndex = rankOrder.indexOf(oldRank);
  const newIndex = rankOrder.indexOf(newRank);
  
  return {
    demoted: newIndex < oldIndex,
    oldRank,
    newRank,
  };
}

// ノルマ達成率を計算
export function getQuotaProgress(): { current: number; quota: number; percentage: number } {
  const data = loadMarketData();
  return {
    current: data.givenRespectsToday,
    quota: DAILY_QUOTA,
    percentage: Math.min(100, (data.givenRespectsToday / DAILY_QUOTA) * 100),
  };
}

// ノルマ未達成警告の判定
export function shouldShowWarning(): boolean {
  const progress = getQuotaProgress();
  const now = new Date();
  const hours = now.getHours();
  
  // 18時以降で、まだノルマ未達成の場合に警告
  return hours >= 18 && progress.current < progress.quota;
}

