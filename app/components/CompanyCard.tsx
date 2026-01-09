"use client";

import { Building2, Trophy, TrendingUp } from "lucide-react";
import Link from "next/link";
import { getCompanyLabel, getStageName } from "../utils/company";

interface CompanyCardProps {
  company: {
    id: string;
    name: string;
    description: string;
    marketCap: number;
    rank: number;
    stage: string;
    members: Array<{ userId: string; userName: string }>;
    isBankrupt?: boolean;
  };
}

export default function CompanyCard({ company }: CompanyCardProps) {
  const label = getCompanyLabel(company.marketCap, company.rank, company.stage as any);
  const isTop3 = company.rank <= 3;
  const isBankrupt = company.isBankrupt || false;

  return (
    <Link href={`/companies/${company.id}`}>
      <article
        className={`bg-[#0a0a0a] border rounded-xl p-4 mb-3 transition-all ${
          isBankrupt
            ? "border-red-600 opacity-60"
            : isTop3
            ? "border-[#D4AF37] shadow-lg shadow-yellow-500/20 hover:border-[#FFD700]"
            : "border-gray-800 hover:border-gray-700"
        }`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1">
            {isTop3 && (
              <Trophy
                size={24}
                className={`${
                  company.rank === 1
                    ? "text-[#FFD700]"
                    : company.rank === 2
                    ? "text-[#C0C0C0]"
                    : "text-[#CD7F32]"
                }`}
              />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Building2 size={18} className={isBankrupt ? "text-red-400" : "text-gray-400"} />
                <h3 className={`font-semibold text-sm ${isBankrupt ? "text-red-400 line-through" : "text-white"}`}>
                  {company.name}
                </h3>
                {isBankrupt && (
                  <span className="px-2 py-0.5 bg-red-900/50 text-red-400 text-xs rounded">
                    倒産
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 line-clamp-1">{company.description}</p>
              <span className="text-xs text-[#D4AF37] mt-1">{getStageName(company.stage as any)}</span>
            </div>
          </div>
          <div
            className={`px-2 py-1 rounded text-xs font-bold ${
              isTop3
                ? "bg-[#D4AF37] text-black"
                : "bg-gray-800 text-gray-300"
            }`}
          >
            #{company.rank}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-xs text-gray-500">時価総額</span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-mono font-bold text-[#D4AF37]">
                  ¥{company.marketCap.toLocaleString()}
                </span>
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-500">社員数</span>
              <div className="text-sm font-semibold text-white">
                {company.members.length}名
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp size={16} className="text-green-400" />
            <span className="text-xs font-semibold text-green-400">{label}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

