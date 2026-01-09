// ユーザープロフィール情報の管理

export interface UserProfile {
  name: string;
  rank: string;
  vision: string;
  sector: string;
  base?: string; // 上場拠点
  fuel?: string; // 動力源
  riskFactors?: string; // リスク要因
  personalTags?: string[]; // パーソナルタグ
}

const STORAGE_KEY = 'promotion_user_profile';

const DEFAULT_PROFILE: UserProfile = {
  name: "あなた",
  rank: "新人",
  vision: "",
  sector: "ビジネス",
  base: "",
  fuel: "",
  riskFactors: "",
  personalTags: [],
};

export function loadUserProfile(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_PROFILE, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Failed to load user profile:', error);
  }
  
  return DEFAULT_PROFILE;
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Failed to save user profile:', error);
  }
}

