"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  loadMarketData,
  saveMarketData,
  receiveRespect,
  sendRespect,
  getQuotaProgress,
  shouldShowWarning,
  type UserMarketData,
} from "../utils/marketCap";
import { getRankFromMarketCap } from "../utils/marketCap";
import { type Rank } from "../utils/rank";
import {
  loadUserProfile,
  saveUserProfile,
  type UserProfile,
} from "../utils/userProfile";

interface InvestmentEvent {
  amount: number;
  userName?: string;
  timestamp: number;
}

interface MarketContextType {
  marketData: UserMarketData;
  quotaProgress: { current: number; quota: number; percentage: number };
  showWarning: boolean;
  currentRank: Rank;
  previousRank: Rank | null;
  userProfile: UserProfile;
  handleReceiveRespect: (amount?: number, userName?: string) => void;
  handleSendRespect: () => void;
  updateUserProfile: (profile: UserProfile) => void;
  refreshData: () => void;
  // 投資通知イベント（InvestmentNotificationManagerが監視）
  investmentEvents: InvestmentEvent[];
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export function MarketProvider({ children }: { children: React.ReactNode }) {
  const [marketData, setMarketData] = useState<UserMarketData>(() => loadMarketData());
  const [quotaProgress, setQuotaProgress] = useState(getQuotaProgress());
  const [showWarning, setShowWarning] = useState(shouldShowWarning());
  const [currentRank, setCurrentRank] = useState<Rank>(() =>
    getRankFromMarketCap(marketData.marketCap, marketData.receivedRespects)
  );
  const [previousRank, setPreviousRank] = useState<Rank | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => loadUserProfile());
  const [investmentEvents, setInvestmentEvents] = useState<InvestmentEvent[]>([]);

  // 階級変化をチェック
  useEffect(() => {
    const newRank = getRankFromMarketCap(marketData.marketCap, marketData.receivedRespects);
    if (newRank !== currentRank) {
      setPreviousRank(currentRank);
      setCurrentRank(newRank);
    }
  }, [marketData.marketCap, marketData.receivedRespects, currentRank]);

  // 定期的にデータを更新（1分ごと）
  useEffect(() => {
    const interval = setInterval(() => {
      const data = loadMarketData();
      setMarketData(data);
      setQuotaProgress(getQuotaProgress());
      setShowWarning(shouldShowWarning());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // 日付が変わった時のチェック
  useEffect(() => {
    const checkDateChange = () => {
      const data = loadMarketData();
      setMarketData(data);
      setQuotaProgress(getQuotaProgress());
      setShowWarning(shouldShowWarning());
    };

    // 毎分チェック
    const interval = setInterval(checkDateChange, 60000);
    checkDateChange(); // 初回実行

    return () => clearInterval(interval);
  }, []);

  const handleReceiveRespect = (amount: number = 1, userName?: string) => {
    const oldRank = getRankFromMarketCap(marketData.marketCap, marketData.receivedRespects);
    const updated = receiveRespect(amount);
    const newRank = getRankFromMarketCap(updated.marketCap, updated.receivedRespects);
    
    const marketCapIncrease = updated.marketCap - marketData.marketCap;
    
    // 投資通知イベントを発火
    if (marketCapIncrease > 0) {
      setInvestmentEvents((prev) => [
        ...prev,
        {
          amount: marketCapIncrease,
          userName,
          timestamp: Date.now(),
        },
      ]);
    }
    
    setMarketData(updated);
    setQuotaProgress(getQuotaProgress());
    
    // 階級昇進を検知
    if (oldRank !== newRank) {
      setPreviousRank(oldRank);
      setCurrentRank(newRank);
      
      // 筆頭株主に配当を付与
      if (typeof window !== 'undefined') {
        const { distributeDividend } = require('../utils/shareholders');
        const dividend = distributeDividend('current_user', updated.marketCap, 0.05);
        if (dividend) {
          // 配当を筆頭株主の時価総額に加算（実際の実装ではサーバー側で処理）
          console.log(`筆頭株主に配当: ¥${dividend.dividend.toLocaleString()}`);
        }
      }
    }
  };

  const handleSendRespect = () => {
    const updated = sendRespect();
    setMarketData(updated);
    setQuotaProgress(getQuotaProgress());
    setShowWarning(shouldShowWarning());
  };

  const updateUserProfile = (profile: UserProfile) => {
    saveUserProfile(profile);
    setUserProfile(profile);
  };

  const refreshData = () => {
    const data = loadMarketData();
    setMarketData(data);
    setQuotaProgress(getQuotaProgress());
    setShowWarning(shouldShowWarning());
    setUserProfile(loadUserProfile());
  };

  return (
    <MarketContext.Provider
      value={{
        marketData,
        quotaProgress,
        showWarning,
        currentRank,
        previousRank,
        userProfile,
        handleReceiveRespect,
        handleSendRespect,
        updateUserProfile,
        refreshData,
        investmentEvents,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
}

export function useMarket() {
  const context = useContext(MarketContext);
  if (context === undefined) {
    throw new Error("useMarket must be used within a MarketProvider");
  }
  return context;
}

