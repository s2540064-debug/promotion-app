// Market Cap System Utility

export interface UserMarketData {
  marketCap: number; // Market cap
  receivedRespects: number; // Total received respects
  givenRespectsToday: number; // Respects sent today
  lastCheckDate: string; // Last check date (YYYY-MM-DD)
  dailyRespects: Record<string, number>; // Daily respect count { "2024-01-01": 3 }
}

const DAILY_QUOTA = 3; // Daily quota
const PENALTY_RATE = 0.3; // 30% penalty

// Initial data
export function getInitialMarketData(): UserMarketData {
  const today = new Date().toISOString().split('T')[0];
  return {
    marketCap: 1000, // Initial market cap
    receivedRespects: 0,
    givenRespectsToday: 0,
    lastCheckDate: today,
    dailyRespects: {},
  };
}

// Load data from localStorage
export function loadMarketData(): UserMarketData {
  if (typeof window === 'undefined') return getInitialMarketData();
  
  const stored = localStorage.getItem('promotion_market_data');
  if (!stored) return getInitialMarketData();
  
  try {
    const data = JSON.parse(stored);
    // Get today's date
    const today = new Date().toISOString().split('T')[0];
    
    // Handle date change
    if (data.lastCheckDate !== today) {
      return checkDailyQuota(data, today);
    }
    
    return data;
  } catch {
    return getInitialMarketData();
  }
}

// Save data
export function saveMarketData(data: UserMarketData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('promotion_market_data', JSON.stringify(data));
}

// Daily quota check and penalty application
function checkDailyQuota(data: UserMarketData, today: string): UserMarketData {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];
  
  const yesterdayRespects = data.dailyRespects[yesterday] || 0;
  const oldMarketCap = data.marketCap;
  
  // If quota not met, reduce market cap by 30%
  if (yesterdayRespects < DAILY_QUOTA) {
    const penalty = data.marketCap * PENALTY_RATE;
    data.marketCap = Math.max(100, Math.floor(data.marketCap - penalty));
    
    // Check for rank demotion (when market cap decreases)
    const { demoted, oldRank, newRank } = checkRankDemotion(
      oldMarketCap,
      data.marketCap,
      data.receivedRespects
    );
    
    if (demoted) {
      // Rank demotion notification (in actual implementation, show toast notification)
      console.log(`Rank demotion: ${oldRank} → ${newRank}`);
    }
  }
  
  // Reset today's data
  data.givenRespectsToday = 0;
  data.lastCheckDate = today;
  
  // Clean up old date data (older than 30 days)
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

// Handle receiving investment (market cap increase)
export function receiveRespect(amount: number = 1): UserMarketData {
  const data = loadMarketData();
  data.receivedRespects += amount;
  
  // Apply market crash mode
  const { applyMarketCrashMultiplier } = require('./marketCrash');
  const baseGrowth = amount * 10; // 1 investment = 10 market cap
  const adjustedGrowth = applyMarketCrashMultiplier(baseGrowth);
  
  data.marketCap += Math.floor(adjustedGrowth);
  saveMarketData(data);
  return data;
}

// Handle sending respect
export function sendRespect(): UserMarketData {
  const data = loadMarketData();
  const today = new Date().toISOString().split('T')[0];
  
  // If date changed, run check
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

// Calculate rank from market cap (integrated with existing rank.ts)
import { calculateRank, type Rank } from './rank';

export function getRankFromMarketCap(marketCap: number, receivedRespects: number, postCount: number = 0): Rank {
  // Convert market cap to score
  // Market cap = received respects * 10, so calculate respect count inversely
  // More accurately, calculate score directly from market cap
  const respectCount = Math.max(receivedRespects, Math.floor(marketCap / 10));
  return calculateRank(postCount, respectCount);
}

// Check if rank demotion occurs when market cap decreases
export function checkRankDemotion(
  oldMarketCap: number,
  newMarketCap: number,
  receivedRespects: number,
  postCount: number = 0
): { demoted: boolean; oldRank: Rank; newRank: Rank } {
  const oldRank = getRankFromMarketCap(oldMarketCap, receivedRespects, postCount);
  const newRank = getRankFromMarketCap(newMarketCap, receivedRespects, postCount);
  
  // Compare rank indices
  const rankOrder: Rank[] = ["新人", "主任", "係長", "課長", "部長", "役員", "社長", "会長"];
  const oldIndex = rankOrder.indexOf(oldRank);
  const newIndex = rankOrder.indexOf(newRank);
  
  return {
    demoted: newIndex < oldIndex,
    oldRank,
    newRank,
  };
}

// Calculate quota progress
export function getQuotaProgress(): { current: number; quota: number; percentage: number } {
  const data = loadMarketData();
  return {
    current: data.givenRespectsToday,
    quota: DAILY_QUOTA,
    percentage: Math.min(100, (data.givenRespectsToday / DAILY_QUOTA) * 100),
  };
}

// Determine if quota warning should be shown
export function shouldShowWarning(): boolean {
  const progress = getQuotaProgress();
  const now = new Date();
  const hours = now.getHours();
  
  // Show warning after 6 PM if quota not met
  return hours >= 18 && progress.current < progress.quota;
}

