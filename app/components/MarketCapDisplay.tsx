"use client";

import { useMarket } from "../contexts/MarketContext";
import { useEffect, useState } from "react";
import { getRankFromMarketCap } from "../utils/marketCap";
import { getRankStyle } from "../utils/rank";

export default function MarketCapDisplay() {
  const { marketData } = useMarket();
  const [displayValue, setDisplayValue] = useState(marketData.marketCap);
  const [isAnimating, setIsAnimating] = useState(false);
  const [changeDirection, setChangeDirection] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    const targetValue = marketData.marketCap;
    const currentValue = displayValue;

    if (targetValue === currentValue) return;

    setIsAnimating(true);
    setChangeDirection(targetValue > currentValue ? "up" : "down");

    // アニメーションで数値を更新
    const duration = 1000; // 1秒
    const steps = 30;
    const stepValue = (targetValue - currentValue) / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayValue(targetValue);
        setIsAnimating(false);
        setChangeDirection(null);
        clearInterval(interval);
      } else {
        setDisplayValue(Math.floor(currentValue + stepValue * currentStep));
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [marketData.marketCap]);

  const rank = getRankFromMarketCap(
    marketData.marketCap,
    marketData.receivedRespects,
    0 // 投稿数は別途管理（現在は0）
  );

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-baseline gap-1">
        <span
          className={`text-base font-mono font-bold transition-colors ${
            isAnimating
              ? changeDirection === "up"
                ? "text-green-400"
                : "text-red-400"
              : "text-[#D4AF37]"
          }`}
        >
          ¥{displayValue.toLocaleString()}
        </span>
        {isAnimating && (
          <span
            className={`text-xs font-bold ${
              changeDirection === "up" ? "text-green-400" : "text-red-400"
            }`}
          >
            {changeDirection === "up" ? "↑" : "↓"}
          </span>
        )}
      </div>
      <div className={`${getRankStyle(rank)} border border-[#D4AF37]/30 text-xs px-2 py-0.5`}>{rank}</div>
    </div>
  );
}

