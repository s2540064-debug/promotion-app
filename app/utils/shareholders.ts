// 筆頭株主システムのユーティリティ

export interface Shareholder {
  userId: string;
  userName: string;
  investmentCount: number; // 投資回数
  investmentAmount: number; // 投資総額（将来的に拡張可能）
  rank: number; // 株主ランク（1=筆頭株主）
}

const STORAGE_KEY = 'promotion_shareholders';

// 投資記録を保存
export interface InvestmentRecord {
  fromUserId: string;
  toUserId: string;
  timestamp: string;
}

// 投資を記録
export function recordInvestment(fromUserId: string, toUserId: string): void {
  if (typeof window === 'undefined') return;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  const records: InvestmentRecord[] = stored ? JSON.parse(stored) : [];
  
  records.push({
    fromUserId,
    toUserId,
    timestamp: new Date().toISOString(),
  });
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

// ユーザーの株主一覧を取得（上位3名）
export function getShareholders(userId: string): Shareholder[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    const records: InvestmentRecord[] = JSON.parse(stored);
    
    // 該当ユーザーへの投資を集計
    const investmentMap = new Map<string, number>();
    const userNameMap = new Map<string, string>();
    
    records.forEach((record) => {
      if (record.toUserId === userId) {
        const count = investmentMap.get(record.fromUserId) || 0;
        investmentMap.set(record.fromUserId, count + 1);
        // ユーザー名は別途管理（実際の実装ではDBから取得）
        userNameMap.set(record.fromUserId, `ユーザー${record.fromUserId.slice(-4)}`);
      }
    });
    
    // 投資回数順にソート
    const shareholders: Shareholder[] = Array.from(investmentMap.entries())
      .map(([userId, count], index) => ({
        userId,
        userName: userNameMap.get(userId) || `ユーザー${userId.slice(-4)}`,
        investmentCount: count,
        investmentAmount: count, // 将来的に投資額を別途管理
        rank: index + 1,
      }))
      .sort((a, b) => b.investmentCount - a.investmentCount)
      .slice(0, 3); // 上位3名
    
    return shareholders;
  } catch {
    return [];
  }
}

// 筆頭株主に配当を付与（昇進時）
export function distributeDividend(
  userId: string,
  marketCap: number,
  dividendRate: number = 0.05 // 5%の配当
): { shareholderId: string; dividend: number } | null {
  const shareholders = getShareholders(userId);
  if (shareholders.length === 0) return null;
  
  const topShareholder = shareholders[0]; // 筆頭株主
  const dividend = Math.floor(marketCap * dividendRate);
  
  return {
    shareholderId: topShareholder.userId,
    dividend,
  };
}

