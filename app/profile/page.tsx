"use client";

import BottomNavigation from "../components/BottomNavigation";
import MarketCapChart from "../components/MarketCapChart";
import ShareholderRanking from "../components/ShareholderRanking";
import EvidenceGallery from "../components/EvidenceGallery";
import ProfileEditModal from "../components/ProfileEditModal";
import PersonalInfoCard from "../components/PersonalInfoCard";
import { useMarket } from "../contexts/MarketContext";
import { TrendingUp, TrendingDown, User, Settings } from "lucide-react";
import { getRankFromMarketCap } from "../utils/marketCap";
import { useCountUp } from "../hooks/useCountUp";
import { getEvidenceArchive } from "../utils/evidenceArchive";
import { useEffect, useState } from "react";
import { type Sector } from "../components/SectorSelector";

export default function ProfilePage() {
  const { marketData, userProfile, updateUserProfile } = useMarket();
  const currentUserId = "current_user";
  const [evidenceItems, setEvidenceItems] = useState(
    getEvidenceArchive(currentUserId)
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // ランクは時価総額から計算するが、ユーザーが設定した役職も表示
  const calculatedRank = getRankFromMarketCap(
    marketData.marketCap,
    marketData.receivedRespects
  );
  const displayRank = userProfile.rank || calculatedRank;
  
  // 前日比を計算（仮のデータ）
  const previousMarketCap = marketData.marketCap * 0.95;
  const change = marketData.marketCap - previousMarketCap;
  const changeRate = (change / previousMarketCap) * 100;
  const isPositive = changeRate >= 0;

  // カウントアップアニメーション
  const animatedMarketCap = useCountUp(marketData.marketCap, { duration: 2000 });

  // 過去7日間の時価総額推移データ（ダミー）
  const chartData = [
    { date: "7日前", value: Math.floor(marketData.marketCap * 0.85) },
    { date: "6日前", value: Math.floor(marketData.marketCap * 0.88) },
    { date: "5日前", value: Math.floor(marketData.marketCap * 0.90) },
    { date: "4日前", value: Math.floor(marketData.marketCap * 0.92) },
    { date: "3日前", value: Math.floor(marketData.marketCap * 0.93) },
    { date: "2日前", value: Math.floor(marketData.marketCap * 0.94) },
    { date: "1日前", value: Math.floor(previousMarketCap) },
    { date: "今日", value: marketData.marketCap },
  ];

  return (
    <div className="min-h-screen bg-black pb-20">
      <header className="sticky top-0 z-40 bg-black border-b border-gray-800 backdrop-blur-sm bg-black/95">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center gap-2 flex-1">
              <div className="w-1 h-6 bg-[#D4AF37]"></div>
              <h1 className="text-xl font-bold text-white uppercase tracking-wider">
                銘柄情報
              </h1>
              <div className="w-1 h-6 bg-[#D4AF37]"></div>
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-900 transition-colors border border-gray-800 hover:border-[#D4AF37]/50"
            >
              <Settings size={20} className="text-gray-400 hover:text-[#D4AF37] transition-colors" />
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-1 font-mono">
            FINANCIAL ANALYSIS TERMINAL
          </p>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* 銘柄ヘッダー */}
        <section className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#FFD700] flex items-center justify-center border-2 border-[#D4AF37]/50">
              <User size={32} className="text-black" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{userProfile.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-1 bg-[#D4AF37] text-black text-xs font-bold rounded border border-[#D4AF37]/50">
                  {displayRank}
                </span>
                <span className="text-xs text-gray-500 font-mono">銘柄コード: YOU001</span>
              </div>
              {userProfile.vision && (
                <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                  {userProfile.vision}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* 時価総額情報（大型チャート付き） */}
        <section className="mb-6">
          <div className="bg-gray-900 rounded-lg p-5 border border-gray-800 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">時価総額情報</h3>
              <div className={`flex items-center gap-1 text-xs font-bold ${
                isPositive ? "text-green-400" : "text-red-400"
              }`}>
                {isPositive ? (
                  <TrendingUp size={14} />
                ) : (
                  <TrendingDown size={14} />
                )}
                <span>
                  {isPositive ? "+" : ""}
                  {changeRate.toFixed(2)}%
                </span>
              </div>
            </div>
            
            {/* メインの時価総額（カウントアップアニメーション） */}
            <div className="mb-4">
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">現在の時価総額</div>
              <div className="text-3xl font-mono font-bold text-[#D4AF37]">
                ¥{animatedMarketCap.toLocaleString()}
              </div>
            </div>

            {/* 前日比情報 */}
            <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-800">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">前日比</div>
                <div className={`text-lg font-mono font-bold ${
                  isPositive ? "text-green-400" : "text-red-400"
                }`}>
                  {isPositive ? "+" : ""}
                  {changeRate.toFixed(2)}%
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">変動額</div>
                <div className={`text-lg font-mono font-bold ${
                  isPositive ? "text-green-400" : "text-red-400"
                }`}>
                  {isPositive ? "+" : ""}¥{Math.abs(change).toLocaleString()}
                </div>
              </div>
            </div>

            {/* 過去7日間のチャート */}
            <MarketCapChart data={chartData} />
          </div>
        </section>

        {/* 筆頭株主ランキング */}
        <section className="mb-6">
          <ShareholderRanking userId="current_user" />
        </section>

        {/* パーソナル情報 */}
        <section className="mb-6">
          <PersonalInfoCard
            base={userProfile.base}
            fuel={userProfile.fuel}
            riskFactors={userProfile.riskFactors}
            personalTags={userProfile.personalTags}
          />
        </section>

        {/* 統計情報 */}
        <section className="mb-6">
          <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">統計情報</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">受け取った投資</div>
              <div className="text-2xl font-mono font-bold text-white">
                {marketData.receivedRespects}
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">今日送った投資</div>
              <div className="text-2xl font-mono font-bold text-white">
                {marketData.givenRespectsToday}/3
              </div>
            </div>
          </div>
        </section>

        {/* 実績アーカイブ */}
        <section>
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-800">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Performance Archive
            </h3>
            <span className="text-xs text-gray-500 font-mono">
              ({evidenceItems.length}件)
            </span>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 shadow-lg">
            <EvidenceGallery items={evidenceItems} />
          </div>
        </section>
      </main>

      {/* プロフィール編集モーダル */}
      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentName={userProfile.name}
        currentRank={userProfile.rank}
        currentVision={userProfile.vision}
        currentSector={userProfile.sector as Sector}
        currentBase={userProfile.base}
        currentFuel={userProfile.fuel}
        currentRiskFactors={userProfile.riskFactors}
        currentPersonalTags={userProfile.personalTags}
        onSave={(data) => {
          updateUserProfile({
            name: data.name,
            rank: data.rank,
            vision: data.vision,
            sector: data.sector,
            base: data.base,
            fuel: data.fuel,
            riskFactors: data.riskFactors,
            personalTags: data.personalTags,
          });
        }}
      />

      <BottomNavigation />
    </div>
  );
}

