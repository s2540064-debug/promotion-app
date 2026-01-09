"use client";

import { useMarket } from "../contexts/MarketContext";
import { useEffect, useState } from "react";

export default function WarningOverlay() {
  const { showWarning, quotaProgress } = useMarket();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (showWarning) {
      setIsVisible(true);
      // 3秒ごとに点滅
      const interval = setInterval(() => {
        setIsVisible((prev) => !prev);
      }, 3000);
      return () => clearInterval(interval);
    } else {
      setIsVisible(false);
    }
  }, [showWarning]);

  if (!showWarning) return null;

  return (
    <>
      {/* 画面端の赤い警告エフェクト */}
      <div
        className={`fixed inset-0 pointer-events-none z-30 transition-opacity duration-1000 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* 左端 */}
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-red-600/50 blur-sm animate-pulse" />
        {/* 右端 */}
        <div className="absolute right-0 top-0 bottom-0 w-2 bg-red-600/50 blur-sm animate-pulse" />
        {/* 上端 */}
        <div className="absolute left-0 right-0 top-0 h-2 bg-red-600/50 blur-sm animate-pulse" />
      </div>
    </>
  );
}

