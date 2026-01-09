// Major Shareholder System Utility

export interface Shareholder {
  userId: string;
  userName: string;
  investmentCount: number; // Investment count
  investmentAmount: number; // Total investment amount (expandable in future)
  rank: number; // Shareholder rank (1 = major shareholder)
}

const STORAGE_KEY = 'promotion_shareholders';

// Investment record storage
export interface InvestmentRecord {
  fromUserId: string;
  toUserId: string;
  timestamp: string;
}

// Record investment
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

// Get user's shareholder list (top 3)
export function getShareholders(userId: string): Shareholder[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    const records: InvestmentRecord[] = JSON.parse(stored);
    
    // Aggregate investments to target user
    const investmentMap = new Map<string, number>();
    const userNameMap = new Map<string, string>();
    
    records.forEach((record) => {
      if (record.toUserId === userId) {
        const count = investmentMap.get(record.fromUserId) || 0;
        investmentMap.set(record.fromUserId, count + 1);
        // User names managed separately (in actual implementation, fetch from DB)
        userNameMap.set(record.fromUserId, `User${record.fromUserId.slice(-4)}`);
      }
    });
    
    // Sort by investment count
    const shareholders: Shareholder[] = Array.from(investmentMap.entries())
      .map(([userId, count], index) => ({
        userId,
        userName: userNameMap.get(userId) || `User${userId.slice(-4)}`,
        investmentCount: count,
        investmentAmount: count, // In future, manage investment amount separately
        rank: index + 1,
      }))
      .sort((a, b) => b.investmentCount - a.investmentCount)
      .slice(0, 3); // Top 3
    
    return shareholders;
  } catch {
    return [];
  }
}

// Distribute dividend to major shareholder (on promotion)
export function distributeDividend(
  userId: string,
  marketCap: number,
  dividendRate: number = 0.05 // 5% dividend
): { shareholderId: string; dividend: number } | null {
  const shareholders = getShareholders(userId);
  if (shareholders.length === 0) return null;
  
  const topShareholder = shareholders[0]; // Major shareholder
  const dividend = Math.floor(marketCap * dividendRate);
  
  return {
    shareholderId: topShareholder.userId,
    dividend,
  };
}

