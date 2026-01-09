"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getAllCompanies,
  getUserCompanyId,
  getCompanyRanking,
  type Company,
} from "../utils/company";
import { useMarket } from "./MarketContext";

interface CompanyContextType {
  companies: Company[];
  userCompany: Company | null;
  userCompanyId: string | null;
  ranking: Array<Company & { marketCap: number; rank: number }>;
  refreshCompanies: () => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const { marketData } = useMarket();
  const [companies, setCompanies] = useState<Company[]>(() => getAllCompanies());
  const [userCompanyId, setUserCompanyId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    // デモ用: 現在のユーザーIDを仮定（実際の実装では認証から取得）
    const currentUserId = 'current_user';
    return getUserCompanyId(currentUserId);
  });
  const [ranking, setRanking] = useState(() => getCompanyRanking());

  const userCompany = userCompanyId
    ? companies.find((c) => c.id === userCompanyId) || null
    : null;

  const refreshCompanies = () => {
    const updatedCompanies = getAllCompanies();
    setCompanies(updatedCompanies);
    setRanking(getCompanyRanking());
    
    // ユーザーの所属会社を再取得
    if (typeof window !== 'undefined') {
      const currentUserId = 'current_user';
      const companyId = getUserCompanyId(currentUserId);
      setUserCompanyId(companyId);
    }
  };

  // 定期的に会社データを更新
  useEffect(() => {
    const interval = setInterval(() => {
      refreshCompanies();
    }, 30000); // 30秒ごと

    return () => clearInterval(interval);
  }, []);

  // 時価総額が変わったら会社データを更新
  useEffect(() => {
    if (userCompanyId && typeof window !== 'undefined') {
      const { updateCompanyMember } = require('../utils/company');
      const currentUserId = 'current_user';
      updateCompanyMember(userCompanyId, currentUserId, {
        marketCap: marketData.marketCap,
        givenRespectsToday: marketData.givenRespectsToday,
      });
      refreshCompanies();
    }
  }, [marketData.marketCap, marketData.givenRespectsToday, userCompanyId]);

  return (
    <CompanyContext.Provider
      value={{
        companies,
        userCompany,
        userCompanyId,
        ranking,
        refreshCompanies,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }
  return context;
}

