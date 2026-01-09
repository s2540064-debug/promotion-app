"use client";

import { Users, Trophy } from "lucide-react";
import { getShareholders } from "../utils/shareholders";

interface ShareholderListProps {
  userId: string;
}

export default function ShareholderList({ userId }: ShareholderListProps) {
  const shareholders = getShareholders(userId);

  if (shareholders.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
        <div className="flex items-center gap-2 mb-2">
          <Users size={18} className="text-gray-400" />
          <h3 className="text-sm font-semibold text-white">筆頭株主</h3>
        </div>
        <p className="text-xs text-gray-500">まだ投資を受けていません</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
      <div className="flex items-center gap-2 mb-3">
        <Users size={18} className="text-[#D4AF37]" />
        <h3 className="text-sm font-semibold text-white">筆頭株主</h3>
      </div>
      <div className="space-y-2">
        {shareholders.map((shareholder) => (
          <div
            key={shareholder.userId}
            className={`flex items-center justify-between p-2 rounded-lg ${
              shareholder.rank === 1
                ? "bg-gradient-to-r from-[#D4AF37]/20 to-[#FFD700]/20 border border-[#D4AF37]/30"
                : "bg-black"
            }`}
          >
            <div className="flex items-center gap-2">
              {shareholder.rank === 1 && (
                <Trophy size={16} className="text-[#D4AF37]" />
              )}
              <span className="text-xs font-semibold text-gray-400">
                #{shareholder.rank}
              </span>
              <span className="text-sm text-white">{shareholder.userName}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                投資: {shareholder.investmentCount}回
              </span>
            </div>
          </div>
        ))}
      </div>
      {shareholders.length > 0 && (
        <p className="text-xs text-gray-500 mt-3">
          ※ 昇進時、筆頭株主に時価総額の5%が配当として付与されます
        </p>
      )}
    </div>
  );
}

