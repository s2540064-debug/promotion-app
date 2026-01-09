// 会社（Company）システムのユーティリティ

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
  ownerId: string; // 会社作成者のID
  lockedCapital: number; // 出資金（ロックされた時価総額）
  stage: CompanyStage; // 成長ステージ
  isBankrupt: boolean; // 倒産状態
  daysBelowThreshold: number; // ステージ維持条件未達成日数
  lastCheckDate: string; // 最後にチェックした日付
}

// ステージ定義
export const STAGE_THRESHOLDS = {
  startup: { min: 10_000_000, maxMembers: 5 }, // 1,000万円〜
  venture: { min: 50_000_000, maxMembers: 20 }, // 5,000万円〜
  listed: { min: 200_000_000, maxMembers: Infinity }, // 2億円〜
  unicorn: { min: 1_000_000_000, maxMembers: Infinity }, // 10億円〜
} as const;

const CAPITAL_REQUIREMENT = 10_000_000; // 設立に必要な時価総額: 1,000万円
const CAPITAL_LOCK = 2_000_000; // 出資金: 200万円
const BANKRUPTCY_THRESHOLD_DAYS = 3; // 倒産までの日数

const STORAGE_KEY = 'promotion_companies';
const MEMBER_STORAGE_KEY = 'promotion_user_company';

// 会社一覧を取得
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

// 会社を保存
export function saveCompanies(companies: Company[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
}

// ユーザーの所属会社IDを取得
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

// ユーザーの所属会社を設定
export function setUserCompany(userId: string, companyId: string | null): void {
  if (typeof window === 'undefined') return;
  
  const stored = localStorage.getItem(MEMBER_STORAGE_KEY);
  const data = stored ? JSON.parse(stored) : {};
  data[userId] = companyId;
  localStorage.setItem(MEMBER_STORAGE_KEY, JSON.stringify(data));
}

// 会社設立条件をチェック
export function checkCompanyCreationRequirements(
  marketCap: number,
  rank: Rank
): { canCreate: boolean; reasons: string[] } {
  const reasons: string[] = [];
  
  if (marketCap < CAPITAL_REQUIREMENT) {
    reasons.push(`時価総額が不足しています（必要: ¥${CAPITAL_REQUIREMENT.toLocaleString()}、現在: ¥${marketCap.toLocaleString()}）`);
  }
  
  const rankOrder: Rank[] = ["新人", "主任", "係長", "課長", "部長", "役員", "社長", "会長"];
  const rankIndex = rankOrder.indexOf(rank);
  const kachouIndex = rankOrder.indexOf("課長");
  
  if (rankIndex < kachouIndex) {
    reasons.push(`役職が不足しています（必要: 課長以上、現在: ${rank}）`);
  }
  
  return {
    canCreate: reasons.length === 0,
    reasons,
  };
}

// 組織力係数を計算
export function calculateOrganizationFactor(company: Company): number {
  // 全員がノルマ達成しているかチェック
  const allQuotaMet = company.members.every((member) => member.givenRespectsToday >= 3);
  
  // 全員達成: 1.2、1人でも未達成: 0.8
  return allQuotaMet ? 1.2 : 0.8;
}

// 会社の時価総額を計算（組織力係数を含む）
export function calculateCompanyMarketCap(company: Company): number {
  if (company.isBankrupt) return 0;
  
  // 基本時価総額 = 全社員の時価総額の合計
  const baseMarketCap = company.members.reduce((sum, member) => sum + member.marketCap, 0);
  
  // 組織力係数を適用
  const alpha = calculateOrganizationFactor(company);
  const adjustedMarketCap = baseMarketCap * alpha;
  
  return Math.floor(adjustedMarketCap);
}

// 会社のステージを決定
export function determineCompanyStage(marketCap: number): CompanyStage {
  if (marketCap >= STAGE_THRESHOLDS.unicorn.min) return "unicorn";
  if (marketCap >= STAGE_THRESHOLDS.listed.min) return "listed";
  if (marketCap >= STAGE_THRESHOLDS.venture.min) return "venture";
  return "startup";
}

// ステージ維持条件をチェック
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

// 倒産チェックと処理
export function checkBankruptcy(company: Company, today: string): Company {
  if (company.isBankrupt) return company;
  
  // 日付が変わった場合のみチェック
  if (company.lastCheckDate === today) return company;
  
  const { meetsThreshold } = checkStageMaintenance(company);
  
  if (!meetsThreshold) {
    company.daysBelowThreshold += 1;
    
    // 3日間連続で条件未達成の場合、倒産
    if (company.daysBelowThreshold >= BANKRUPTCY_THRESHOLD_DAYS) {
      company.isBankrupt = true;
      // 全社員を無職に戻し、役職を1ランクダウン
      // 実際の実装では、各社員のデータを更新する必要がある
    }
  } else {
    // 条件を満たしている場合はリセット
    company.daysBelowThreshold = 0;
  }
  
  company.lastCheckDate = today;
  
  // ステージを更新
  const currentMarketCap = calculateCompanyMarketCap(company);
  company.stage = determineCompanyStage(currentMarketCap);
  
  return company;
}

// 会社を作成（新しい要件に合わせて更新）
export function createCompany(
  name: string,
  description: string,
  ownerId: string,
  ownerName: string,
  ownerMarketCap: number,
  ownerRank: Rank
): { success: boolean; company?: Company; error?: string } {
  // 設立条件をチェック
  const requirements = checkCompanyCreationRequirements(ownerMarketCap, ownerRank);
  if (!requirements.canCreate) {
    return {
      success: false,
      error: requirements.reasons.join('\n'),
    };
  }
  
  // 出資金をロック（200万円）
  const lockedCapital = CAPITAL_LOCK;
  const availableMarketCap = ownerMarketCap - lockedCapital;
  
  if (availableMarketCap < 0) {
    return {
      success: false,
      error: '出資金を確保できません',
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
        marketCap: availableMarketCap, // 出資金を差し引いた時価総額
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

// 会社に参加（ステージ制限を追加）
export function joinCompany(
  companyId: string,
  userId: string,
  userName: string,
  marketCap: number
): { success: boolean; error?: string } {
  const companies = getAllCompanies();
  const company = companies.find((c) => c.id === companyId);
  
  if (!company) {
    return { success: false, error: '会社が見つかりません' };
  }
  
  if (company.isBankrupt) {
    return { success: false, error: 'この会社は倒産しています' };
  }
  
  // 既に参加しているかチェック
  if (company.members.some((m) => m.userId === userId)) {
    return { success: false, error: '既に参加しています' };
  }
  
  // ステージによる人数制限をチェック
  const maxMembers = STAGE_THRESHOLDS[company.stage].maxMembers;
  if (company.members.length >= maxMembers) {
    return { success: false, error: `この会社は最大${maxMembers}名までです` };
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

// 会社から退会
export function leaveCompany(userId: string): boolean {
  const companyId = getUserCompanyId(userId);
  if (!companyId) return false;
  
  const companies = getAllCompanies();
  const company = companies.find((c) => c.id === companyId);
  
  if (!company) return false;
  
  // オーナーは退会できない（会社を削除する必要がある）
  if (company.ownerId === userId) return false;
  
  company.members = company.members.filter((m) => m.userId !== userId);
  saveCompanies(companies);
  setUserCompany(userId, null);
  
  return true;
}

// 会社ランキングを取得（時価総額順）
export function getCompanyRanking(): Array<Company & { marketCap: number; rank: number }> {
  const companies = getAllCompanies();
  const today = new Date().toISOString().split('T')[0];
  
  // 倒産チェックを実行
  const updatedCompanies = companies.map((company) => checkBankruptcy(company, today));
  saveCompanies(updatedCompanies);
  
  const companiesWithMarketCap = updatedCompanies.map((company) => ({
    ...company,
    marketCap: calculateCompanyMarketCap(company),
  }));
  
  // 時価総額順にソート
  companiesWithMarketCap.sort((a, b) => b.marketCap - a.marketCap);
  
  // ランクを付与
  return companiesWithMarketCap.map((company, index) => ({
    ...company,
    rank: index + 1,
  }));
}

// 会社のラベルを取得
export function getCompanyLabel(marketCap: number, rank: number, stage: CompanyStage): string {
  if (rank === 1 && stage === "unicorn") return "伝説のユニコーン企業";
  if (stage === "unicorn") return "ユニコーン企業";
  if (rank === 1 && marketCap >= 200_000_000) return "上場企業（トップ）";
  if (stage === "listed") return "上場企業";
  if (stage === "venture") return "ベンチャー企業";
  return "スタートアップ";
}

// ユーザーの会社内での貢献度を計算
export function calculateContribution(userId: string, company: Company): {
  percentage: number;
  rank: number;
} {
  const member = company.members.find((m) => m.userId === userId);
  if (!member) return { percentage: 0, rank: 0 };
  
  const totalMarketCap = company.members.reduce((sum, m) => sum + m.marketCap, 0);
  const percentage = totalMarketCap > 0 ? (member.marketCap / totalMarketCap) * 100 : 0;
  
  // 社内ランク（時価総額順）
  const sortedMembers = [...company.members].sort((a, b) => b.marketCap - a.marketCap);
  const rank = sortedMembers.findIndex((m) => m.userId === userId) + 1;
  
  return { percentage, rank };
}

// 会社のメンバー情報を更新（時価総額やノルマ進捗）
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

// ステージ名を日本語で取得
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
