"use client";

import { Trophy } from "lucide-react";

interface Shareholder {
  rank: number;
  userName: string;
  investmentCount: number;
}

interface ShareholderRankingProps {
  userId: string;
}

// ダミーデータ（実際の実装では、shareholders.tsから取得）
const dummyShareholders: Shareholder[] = [
  {
    rank: 1,
    userName: "投資家A",
    investmentCount: 127,
  },
  {
    rank: 2,
    userName: "投資家B",
    investmentCount: 89,
  },
  {
    rank: 3,
    userName: "投資家C",
    investmentCount: 56,
  },
];

const rankIcons = ["🥇", "🥈", "🥉"];

export default function ShareholderRanking({ userId }: ShareholderRankingProps) {
  // 実際の実装では、getShareholders(userId)から取得
  const shareholders = dummyShareholders;

  if (shareholders.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
        <div className="flex items-center gap-2 mb-3">
          <Trophy size={18} className="text-[#D4AF37]" />
          <h3 className="text-sm font-semibold text-white">筆頭株主</h3>
        </div>
        <p className="text-xs text-gray-500">まだ投資を受けていません</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-800 shadow-xl">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-800">
        <Trophy size={18} className="text-[#D4AF37]" />
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">筆頭株主ランキング</h3>
      </div>
      <div className="space-y-3">
        {shareholders.map((shareholder) => (
          <div
            key={shareholder.rank}
            className={`flex items-center justify-between p-3 rounded-lg border ${
              shareholder.rank === 1
                ? "bg-gradient-to-r from-[#D4AF37]/20 to-[#FFD700]/20 border-[#D4AF37]/30"
                : shareholder.rank === 2
                ? "bg-gradient-to-r from-[#C0C0C0]/10 to-[#E8E8E8]/10 border-gray-600/30"
                : "bg-black/50 border-gray-800"
            }`}
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="text-2xl">
                {rankIcons[shareholder.rank - 1]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-400 font-mono">
                    #{shareholder.rank}
                  </span>
                  <span className="text-sm font-bold text-white">
                    {shareholder.userName}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 mb-1 uppercase tracking-widest">総投資数</div>
              <div className="text-lg font-mono font-bold text-[#D4AF37]">
                {shareholder.investmentCount}
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-4 pt-3 border-t border-gray-800">
        ※ 昇進時、筆頭株主に時価総額の5%が配当として付与されます
      </p>
    </div>
  );
}

