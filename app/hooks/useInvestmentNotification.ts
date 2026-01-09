"use client";

import { useState, useEffect, useRef } from "react";
import { useMarket } from "../contexts/MarketContext";

interface InvestmentNotification {
  amount: number;
  userName?: string;
  id: string;
}

export function useInvestmentNotification() {
  const { marketData } = useMarket();
  const [notifications, setNotifications] = useState<InvestmentNotification[]>([]);
  const previousMarketCapRef = useRef(marketData.marketCap);
  const previousReceivedRespectsRef = useRef(marketData.receivedRespects);

  useEffect(() => {
    // 時価総額が増加した場合、投資通知を生成
    const marketCapIncrease = marketData.marketCap - previousMarketCapRef.current;
    const respectIncrease = marketData.receivedRespects - previousReceivedRespectsRef.current;

    if (marketCapIncrease > 0 && respectIncrease > 0) {
      // 投資通知を生成（簡易版：実際の実装では、誰から投資を受けたかを追跡する必要がある）
      const notification: InvestmentNotification = {
        id: `investment_${Date.now()}`,
        amount: marketCapIncrease,
        userName: undefined, // 実際の実装では、投資者の情報を取得
      };

      setNotifications((prev) => [...prev, notification]);

      // 5秒後に通知を削除
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
      }, 3500);
    }

    previousMarketCapRef.current = marketData.marketCap;
    previousReceivedRespectsRef.current = marketData.receivedRespects;
  }, [marketData.marketCap, marketData.receivedRespects]);

  return notifications;
}

