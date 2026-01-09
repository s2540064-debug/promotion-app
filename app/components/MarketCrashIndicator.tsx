"use client";

import { AlertTriangle } from "lucide-react";
import { getMarketCrashMode } from "../utils/marketCrash";
import { useEffect, useState } from "react";

export default function MarketCrashIndicator() {
  const [crashMode, setCrashMode] = useState(getMarketCrashMode());

  useEffect(() => {
    const interval = setInterval(() => {
      setCrashMode(getMarketCrashMode());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!crashMode.isActive) return null;

  return (
    <div className="bg-red-900/30 border-b border-red-600/50 px-4 py-2">
      <div className="flex items-center gap-2 max-w-md mx-auto">
        <AlertTriangle size={16} className="text-red-400 animate-pulse" />
        <span className="text-xs font-semibold text-red-400">
          市場不況モード発動中
        </span>
        <span className="text-xs text-red-300">
          時価総額上昇率: {(crashMode.growthRateMultiplier * 100).toFixed(0)}%
        </span>
      </div>
    </div>
  );
}

