"use client";

import { useState, useEffect, useRef } from "react";
import NotificationToast from "./NotificationToast";
import { useMarket } from "../contexts/MarketContext";

export default function InvestmentNotificationManager() {
  const { investmentEvents } = useMarket();
  const [activeNotification, setActiveNotification] = useState<{
    amount: number;
    userName?: string;
  } | null>(null);
  const processedEventsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    // 新しい投資イベントを検知
    const latestEvent = investmentEvents[investmentEvents.length - 1];
    
    if (latestEvent && !processedEventsRef.current.has(latestEvent.timestamp)) {
      // 投資通知を表示
      setActiveNotification({
        amount: latestEvent.amount,
        userName: latestEvent.userName,
      });
      
      // イベントを処理済みとしてマーク
      processedEventsRef.current.add(latestEvent.timestamp);
      
      // 3.5秒後に通知を閉じる（NotificationToastの自動クローズと同期）
      setTimeout(() => {
        setActiveNotification(null);
      }, 3500);
    }
  }, [investmentEvents]);

  const handleClose = () => {
    setActiveNotification(null);
  };

  if (!activeNotification) return null;

  return (
    <NotificationToast
      amount={activeNotification.amount}
      userName={activeNotification.userName}
      isVisible={!!activeNotification}
      onClose={handleClose}
    />
  );
}

