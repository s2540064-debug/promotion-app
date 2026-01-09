"use client";

import { use } from "react";
import BottomNavigation from "../../../components/BottomNavigation";
import ImpactCard from "../../../components/ImpactCard";
import CompanyDashboard from "../../../components/CompanyDashboard";
import { useCompany } from "../../../contexts/CompanyContext";
import { calculateRank } from "../../../utils/rank";
import { calculateContribution, calculateCompanyMarketCap } from "../../../utils/company";
import { Building2, Users, TrendingUp } from "lucide-react";
import { useMarket } from "../../../contexts/MarketContext";

export default function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { companies } = useCompany();
  const { marketData } = useMarket();
  const company = companies.find((c) => c.id === id);

  if (!company) {
    return (
      <div className="min-h-screen bg-black pb-20">
        <header className="sticky top-0 z-40 bg-black border-b border-gray-800 backdrop-blur-sm bg-black/95">
          <div className="max-w-md mx-auto px-4 py-4">
            <h1 className="text-xl font-semibold text-white text-center">
              会社が見つかりません
            </h1>
          </div>
        </header>
        <BottomNavigation />
      </div>
    );
  }

  // 会社の時価総額を計算（組織力係数を含む）
  const companyMarketCap = calculateCompanyMarketCap(company);

  // サンプル投稿データ（実際の実装では、会社メンバーの投稿を取得）
  const companyPosts = company.members.map((member, index) => ({
    id: `post_${member.userId}_${index}`,
    userId: member.userId,
    userName: member.userName,
    rank: calculateRank(0, Math.floor(member.marketCap / 10)),
    content: `${member.userName}の投稿です。会社の成長に貢献しています！`,
    likes: Math.floor(member.marketCap / 100),
    timestamp: `${index + 1}時間前`,
  }));

  // 現在のユーザーの貢献度を計算
  const currentUserId = "current_user";
  const contribution = calculateContribution(currentUserId, company);

  return (
    <div className="min-h-screen bg-black pb-20">
      <header className="sticky top-0 z-40 bg-black border-b border-gray-800 backdrop-blur-sm bg-black/95">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <Building2 size={24} className="text-[#D4AF37]" />
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-white">{company.name}</h1>
              <p className="text-xs text-gray-500">{company.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-800">
            <div>
              <span className="text-xs text-gray-500">時価総額</span>
              <div className="text-lg font-mono font-bold text-[#D4AF37]">
                ¥{companyMarketCap.toLocaleString()}
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-500">社員数</span>
              <div className="text-lg font-semibold text-white">
                {company.members.length}名
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-500">あなたの貢献度</span>
              <div className="text-lg font-semibold text-white">
                {contribution.percentage.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 会社ダッシュボード */}
      <section className="max-w-md mx-auto px-4 py-4">
        <CompanyDashboard />
      </section>

      {/* 社員一覧 */}
      <section className="max-w-md mx-auto px-4 py-4 border-b border-gray-800">
        <div className="flex items-center gap-2 mb-3">
          <Users size={18} className="text-gray-400" />
          <h2 className="text-sm font-semibold text-white">社員一覧</h2>
        </div>
        <div className="space-y-2">
          {company.members
            .sort((a, b) => b.marketCap - a.marketCap)
            .map((member, index) => (
              <div
                key={member.userId}
                className="flex items-center justify-between p-2 bg-gray-900/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-black font-bold text-xs">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {member.userName}
                    </div>
                    <div className="text-xs text-gray-500">
                      ¥{member.marketCap.toLocaleString()}
                    </div>
                  </div>
                </div>
                {member.givenRespectsToday < 3 && (
                  <span className="text-xs text-red-400">ノルマ未達成</span>
                )}
              </div>
            ))}
        </div>
      </section>

      {/* 社内タイムライン */}
      <main className="max-w-md mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-gray-400" />
          <h2 className="text-sm font-semibold text-white">社内タイムライン</h2>
        </div>
        {companyPosts.length === 0 ? (
          <p className="text-gray-400 text-center mt-8">
            まだ投稿がありません
          </p>
        ) : (
          companyPosts.map((post) => (
            <ImpactCard key={post.id} {...post} />
          ))
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}

