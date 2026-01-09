// Company System Utility

import { type Rank } from './rank';

export interface CompanyMember {
  userId: string;
  userName: string;
  marketCap: number;
  givenRespectsToday: number;
  joinedAt: string;
}

export type CompanyStage = "startup" | "venture" | "listed" | "unicorn";

export interface Company {
  id: string;
  name: string;
  description: string;
  logo?: string;
  createdAt: string;
  members: CompanyMember[];
  ownerId: string; // Company creator ID
  lockedCapital: number; // Capital (locked market cap)
  stage: CompanyStage; // Growth stage
  isBankrupt: boolean; // Bankruptcy status
  daysBelowThreshold: number; // Days below stage maintenance threshold
  lastCheckDate: string; // Last check date
}

// Stage definitions
export const STAGE_THRESHOLDS = {
  startup: { min: 10_000_000, maxMembers: 5 }, // 1,000万円〜
  venture: { min: 50_000_000, maxMembers: 20 }, // 5,000万円〜
  listed: { min: 200_000_000, maxMembers: Infinity }, // 2億円〜
  unicorn: { min: 1_000_000_000, maxMembers: Infinity }, // 10億円〜
} as const;

const CAPITAL_REQUIREMENT = 10_000_000; // Required market cap for establishment: 10M yen
const CAPITAL_LOCK = 2_000_000; // Capital: 2M yen
const BANKRUPTCY_THRESHOLD_DAYS = 3; // Days until bankruptcy

const STORAGE_KEY = 'promotion_companies';
const MEMBER_STORAGE_KEY = 'promotion_user_company';

// Get all companies
export function getAllCompanies(): Company[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

// Save companies
export function saveCompanies(companies: Company[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
}

// Get user's company ID
export function getUserCompanyId(userId: string): string | null {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem(MEMBER_STORAGE_KEY);
  if (!stored) return null;
  
  try {
    const data = JSON.parse(stored);
    return data[userId] || null;
  } catch {
    return null;
  }
}

// Set user's company
export function setUserCompany(userId: string, companyId: string | null): void {
  if (typeof window === 'undefined') return;
  
  const stored = localStorage.getItem(MEMBER_STORAGE_KEY);
  const data = stored ? JSON.parse(stored) : {};
  data[userId] = companyId;
  localStorage.setItem(MEMBER_STORAGE_KEY, JSON.stringify(data));
}

// Check company creation requirements
export function checkCompanyCreationRequirements(
  marketCap: number,
  rank: Rank
): { canCreate: boolean; reasons: string[] } {
  const reasons: string[] = [];
  
  if (marketCap < CAPITAL_REQUIREMENT) {
    reasons.push(`Insufficient market cap (required: ¥${CAPITAL_REQUIREMENT.toLocaleString()}, current: ¥${marketCap.toLocaleString()})`);
  }
  
  const rankOrder: Rank[] = ["新人", "主任", "係長", "課長", "部長", "役員", "社長", "会長"];
  const rankIndex = rankOrder.indexOf(rank);
  const kachouIndex = rankOrder.indexOf("課長");
  
  if (rankIndex < kachouIndex) {
    reasons.push(`Insufficient rank (required: Manager or above, current: ${rank})`);
  }
  
  return {
    canCreate: reasons.length === 0,
    reasons,
  };
}

// Calculate organization factor
export function calculateOrganizationFactor(company: Company): number {
  // Check if all members met quota
  const allQuotaMet = company.members.every((member) => member.givenRespectsToday >= 3);
  
  // All met: 1.2, anyone not met: 0.8
  return allQuotaMet ? 1.2 : 0.8;
}

// Calculate company market cap (including organization factor)
export function calculateCompanyMarketCap(company: Company): number {
  if (company.isBankrupt) return 0;
  
  // Base market cap = sum of all members' market caps
  const baseMarketCap = company.members.reduce((sum, member) => sum + member.marketCap, 0);
  
  // Apply organization factor
  const alpha = calculateOrganizationFactor(company);
  const adjustedMarketCap = baseMarketCap * alpha;
  
  return Math.floor(adjustedMarketCap);
}

// Determine company stage
export function determineCompanyStage(marketCap: number): CompanyStage {
  if (marketCap >= STAGE_THRESHOLDS.unicorn.min) return "unicorn";
  if (marketCap >= STAGE_THRESHOLDS.listed.min) return "listed";
  if (marketCap >= STAGE_THRESHOLDS.venture.min) return "venture";
  return "startup";
}

// Check stage maintenance requirements
export function checkStageMaintenance(company: Company): {
  meetsThreshold: boolean;
  requiredMarketCap: number;
} {
  const currentMarketCap = calculateCompanyMarketCap(company);
  const requiredMarketCap = STAGE_THRESHOLDS[company.stage].min;
  
  return {
    meetsThreshold: currentMarketCap >= requiredMarketCap,
    requiredMarketCap,
  };
}

// Check and process bankruptcy
export function checkBankruptcy(company: Company, today: string): Company {
  if (company.isBankrupt) return company;
  
  // Only check if date changed
  if (company.lastCheckDate === today) return company;
  
  const { meetsThreshold } = checkStageMaintenance(company);
  
  if (!meetsThreshold) {
    company.daysBelowThreshold += 1;
    
    // If conditions not met for 3 consecutive days, bankrupt
    if (company.daysBelowThreshold >= BANKRUPTCY_THRESHOLD_DAYS) {
      company.isBankrupt = true;
      // Return all members to unemployed, demote rank by 1
      // In actual implementation, need to update each member's data
    }
  } else {
    // Reset if conditions are met
    company.daysBelowThreshold = 0;
  }
  
  company.lastCheckDate = today;
  
  // Update stage
  const currentMarketCap = calculateCompanyMarketCap(company);
  company.stage = determineCompanyStage(currentMarketCap);
  
  return company;
}

// Create company (updated for new requirements)
export function createCompany(
  name: string,
  description: string,
  ownerId: string,
  ownerName: string,
  ownerMarketCap: number,
  ownerRank: Rank
): { success: boolean; company?: Company; error?: string } {
  // Check establishment requirements
  const requirements = checkCompanyCreationRequirements(ownerMarketCap, ownerRank);
  if (!requirements.canCreate) {
    return {
      success: false,
      error: requirements.reasons.join('\n'),
    };
  }
  
  // Lock capital (2M yen)
  const lockedCapital = CAPITAL_LOCK;
  const availableMarketCap = ownerMarketCap - lockedCapital;
  
  if (availableMarketCap < 0) {
    return {
      success: false,
      error: 'Cannot secure capital',
    };
  }
  
  const companies = getAllCompanies();
  const today = new Date().toISOString().split('T')[0];
  
  const newCompany: Company = {
    id: `company_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    description,
    createdAt: new Date().toISOString(),
    ownerId,
    lockedCapital,
    stage: "startup",
    isBankrupt: false,
    daysBelowThreshold: 0,
    lastCheckDate: today,
    members: [
      {
        userId: ownerId,
        userName: ownerName,
        marketCap: availableMarketCap, // Market cap after deducting capital
        givenRespectsToday: 0,
        joinedAt: new Date().toISOString(),
      },
    ],
  };
  
  companies.push(newCompany);
  saveCompanies(companies);
  setUserCompany(ownerId, newCompany.id);
  
  return { success: true, company: newCompany };
}

// Join company (with stage restrictions)
export function joinCompany(
  companyId: string,
  userId: string,
  userName: string,
  marketCap: number
): { success: boolean; error?: string } {
  const companies = getAllCompanies();
  const company = companies.find((c) => c.id === companyId);
  
  if (!company) {
    return { success: false, error: 'Company not found' };
  }
  
  if (company.isBankrupt) {
    return { success: false, error: 'This company is bankrupt' };
  }
  
  // Check if already joined
  if (company.members.some((m) => m.userId === userId)) {
    return { success: false, error: 'Already joined' };
  }
  
  // Check member limit by stage
  const maxMembers = STAGE_THRESHOLDS[company.stage].maxMembers;
  if (company.members.length >= maxMembers) {
    return { success: false, error: `This company can have up to ${maxMembers} members` };
  }
  
  company.members.push({
    userId,
    userName,
    marketCap,
    givenRespectsToday: 0,
    joinedAt: new Date().toISOString(),
  });
  
  // ステージを再計算
  const currentMarketCap = calculateCompanyMarketCap(company);
  company.stage = determineCompanyStage(currentMarketCap);
  
  saveCompanies(companies);
  setUserCompany(userId, companyId);
  
  return { success: true };
}

// Leave company
export function leaveCompany(userId: string): boolean {
  const companyId = getUserCompanyId(userId);
  if (!companyId) return false;
  
  const companies = getAllCompanies();
  const company = companies.find((c) => c.id === companyId);
  
  if (!company) return false;
  
  // Owner cannot leave (must delete company)
  if (company.ownerId === userId) return false;
  
  company.members = company.members.filter((m) => m.userId !== userId);
  saveCompanies(companies);
  setUserCompany(userId, null);
  
  return true;
}

// Get company ranking (by market cap)
export function getCompanyRanking(): Array<Company & { marketCap: number; rank: number }> {
  const companies = getAllCompanies();
  const today = new Date().toISOString().split('T')[0];
  
  // Run bankruptcy check
  const updatedCompanies = companies.map((company) => checkBankruptcy(company, today));
  saveCompanies(updatedCompanies);
  
  const companiesWithMarketCap = updatedCompanies.map((company) => ({
    ...company,
    marketCap: calculateCompanyMarketCap(company),
  }));
  
  // Sort by market cap
  companiesWithMarketCap.sort((a, b) => b.marketCap - a.marketCap);
  
  // Assign ranks
  return companiesWithMarketCap.map((company, index) => ({
    ...company,
    rank: index + 1,
  }));
}

// Get company label
export function getCompanyLabel(marketCap: number, rank: number, stage: CompanyStage): string {
  if (rank === 1 && stage === "unicorn") return "伝説のユニコーン企業";
  if (stage === "unicorn") return "ユニコーン企業";
  if (rank === 1 && marketCap >= 200_000_000) return "上場企業（トップ）";
  if (stage === "listed") return "上場企業";
  if (stage === "venture") return "ベンチャー企業";
  return "スタートアップ";
}

// Calculate user's contribution within company
export function calculateContribution(userId: string, company: Company): {
  percentage: number;
  rank: number;
} {
  const member = company.members.find((m) => m.userId === userId);
  if (!member) return { percentage: 0, rank: 0 };
  
  const totalMarketCap = company.members.reduce((sum, m) => sum + m.marketCap, 0);
  const percentage = totalMarketCap > 0 ? (member.marketCap / totalMarketCap) * 100 : 0;
  
  // Internal rank (by market cap)
  const sortedMembers = [...company.members].sort((a, b) => b.marketCap - a.marketCap);
  const rank = sortedMembers.findIndex((m) => m.userId === userId) + 1;
  
  return { percentage, rank };
}

// Update company member information (market cap and quota progress)
export function updateCompanyMember(
  companyId: string,
  userId: string,
  updates: Partial<CompanyMember>
): boolean {
  const companies = getAllCompanies();
  const company = companies.find((c) => c.id === companyId);
  
  if (!company) return false;
  
  const memberIndex = company.members.findIndex((m) => m.userId === userId);
  if (memberIndex === -1) return false;
  
  company.members[memberIndex] = {
    ...company.members[memberIndex],
    ...updates,
  };
  
  // ステージを再計算
  const currentMarketCap = calculateCompanyMarketCap(company);
  company.stage = determineCompanyStage(currentMarketCap);
  
  saveCompanies(companies);
  return true;
}

// Get stage name in Japanese
export function getStageName(stage: CompanyStage): string {
  switch (stage) {
    case "startup":
      return "スタートアップ";
    case "venture":
      return "ベンチャー";
    case "listed":
      return "上場企業";
    case "unicorn":
      return "ユニコーン";
  }
}
