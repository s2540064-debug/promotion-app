"use client";

import { TrendingUp, BarChart3 } from "lucide-react";

export default function MarketOverview() {
  // ダミーデータ
  const totalTradingVolume = 12500000000; // 125億円
  const marketSentiment = 72; // 72%が強気

  return (
    <div className="bg-black border-b border-gray-800 p-4 shadow-lg">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-800">
          <BarChart3 size={18} className="text-[#D4AF37]" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Market Overview
          </h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {/* 総投資量 */}
          <div className="bg-gray-900 rounded-lg p-3 border border-gray-800">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">
              Total Trading Volume
            </div>
            <div className="text-xl font-mono font-bold text-white mb-1">
              ¥{(totalTradingVolume / 100000000).toFixed(1)}億
            </div>
            <div className="text-[10px] text-gray-500 font-mono">
              {totalTradingVolume.toLocaleString()} JPY
            </div>
          </div>

          {/* 市場感情 */}
          <div className="bg-gray-900 rounded-lg p-3 border border-gray-800">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">
              Market Sentiment
            </div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={14} className="text-green-400" />
              <span className="text-xs font-bold text-green-400 uppercase tracking-wider">
                BULLISH
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden mb-1">
              <div
                className="h-full bg-gradient-to-r from-green-500 via-green-400 to-green-500 rounded-full transition-all duration-500 shadow-lg shadow-green-500/30"
                style={{ width: `${marketSentiment}%` }}
              />
            </div>
            <div className="text-xs text-gray-400 text-right font-mono">
              {marketSentiment}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

