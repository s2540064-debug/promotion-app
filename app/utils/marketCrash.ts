// 市場暴落ロジック（市場不況モード）

const STORAGE_KEY = 'promotion_market_crash_mode';

export interface MarketCrashConfig {
  isActive: boolean;
  growthRateMultiplier: number; // 時価総額上昇率の倍率（0.5 = 半分）
  activatedAt?: string;
}

// 市場不況モードの状態を取得
export function getMarketCrashMode(): MarketCrashConfig {
  if (typeof window === 'undefined') {
    return { isActive: false, growthRateMultiplier: 1.0 };
  }
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { isActive: false, growthRateMultiplier: 1.0 };
  }
  
  try {
    return JSON.parse(stored);
  } catch {
    return { isActive: false, growthRateMultiplier: 1.0 };
  }
}

// 市場不況モードを有効化/無効化（運営側機能）
export function setMarketCrashMode(
  isActive: boolean,
  growthRateMultiplier: number = 0.5
): void {
  if (typeof window === 'undefined') return;
  
  const config: MarketCrashConfig = {
    isActive,
    growthRateMultiplier,
    activatedAt: isActive ? new Date().toISOString() : undefined,
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

// 時価総額上昇率に市場不況モードを適用
export function applyMarketCrashMultiplier(baseGrowth: number): number {
  const config = getMarketCrashMode();
  if (!config.isActive) {
    return baseGrowth;
  }
  
  return baseGrowth * config.growthRateMultiplier;
}

