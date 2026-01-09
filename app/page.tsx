"use client";

import React, { useEffect } from "react";
import BottomNavigation from "./components/BottomNavigation";
import ImpactCardWithRanking from "./components/ImpactCardWithRanking";
import QuotaIndicator from "./components/QuotaIndicator";
import MarketCapDisplay from "./components/MarketCapDisplay";
import WarningOverlay from "./components/WarningOverlay";
import PromotionCelebration from "./components/PromotionCelebration";
import MarketTicker from "./components/MarketTicker";
import MarketCrashIndicator from "./components/MarketCrashIndicator";
import IRNewsTicker from "./components/IRNewsTicker";
import DailyTopGainer from "./components/DailyTopGainer";
import CategoryTabs, { type Category } from "./components/CategoryTabs";
import PlayerRankingDisplay from "./components/PlayerRankingDisplay";
import PlayerRankingCard from "./components/PlayerRankingCard";
import { useMarket } from "./contexts/MarketContext";
import { calculateRank } from "./utils/rank";
import { useState } from "react";
import { loadUserProfile } from "./utils/userProfile";
import { getPosts, getPostsBySector, type Post } from "./utils/supabasePosts";

interface ImpactData {
  id: string;
  userId: string;
  userName: string;
  rank: string;
  content: string;
  timestamp: string;
  marketCapImpact: number;
  marketCap?: number;
  previousMarketCap?: number;
}

// 時刻を相対時間に変換
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "たった今";
  if (diffMins < 60) return `${diffMins}分前`;
  if (diffHours < 24) return `${diffHours}時間前`;
  if (diffDays < 7) return `${diffDays}日前`;
  return date.toLocaleDateString("ja-JP");
}

export default function Home() {
  const { currentRank, previousRank, userProfile } = useMarket();
  const [showPromotion, setShowPromotion] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>("すべて");
  const [impacts, setImpacts] = useState<ImpactData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    if (previousRank && previousRank !== currentRank) {
      setShowPromotion(true);
    }
  }, [currentRank, previousRank]);

  // Supabaseから投稿を取得
  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      try {
        const posts: Post[] =
          selectedCategory === "すべて"
            ? await getPosts(50)
            : await getPostsBySector(selectedCategory, 50);

        // 投稿データをImpactData形式に変換
        const impactDataPromises = posts.map(async (post) => {
          // 簡易的なユーザー情報（実際のテーブル構造に応じて調整）
          const marketCap = post.impact_amount || 0;
          const previousMarketCap = 0; // 簡易計算

          return {
            id: post.id,
            userId: "user_" + post.id, // 簡易的なID
            userName: "ユーザー", // 簡易的な名前
            rank: calculateRank(0, 0), // 簡易計算
            content: post.content,
            timestamp: formatRelativeTime(post.created_at || new Date().toISOString()),
            marketCapImpact: post.impact_amount || 0,
            marketCap,
            previousMarketCap: previousMarketCap > 0 ? previousMarketCap : 0,
          };
        });

        const impactData = await Promise.all(impactDataPromises);
        setImpacts(impactData);
      } catch (error) {
        console.error("Error loading posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-black pb-20 relative">
      {showPromotion && previousRank && (
        <PromotionCelebration
          oldRank={previousRank}
          newRank={currentRank}
          onComplete={() => setShowPromotion(false)}
        />
      )}
      <WarningOverlay />
      <MarketCrashIndicator />
      <MarketTicker />
      <IRNewsTicker />
      
      <header className="sticky top-0 z-40 bg-black border-b border-gray-800 backdrop-blur-sm bg-black/95 shadow-lg">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">PROMOTION</h1>
              <PlayerRankingDisplay />
            </div>
            <MarketCapDisplay />
          </div>
        </div>
      </header>

      {/* カテゴリータブ */}
      <CategoryTabs
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <main className="max-w-md mx-auto px-4 py-4">
        {/* 注目銘柄（Daily Top Gainer） */}
        <DailyTopGainer />
        
        {/* 個人時価総額ランキング */}
        <PlayerRankingCard />
        
        {/* IRタイムライン */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-800">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-4 bg-[#D4AF37]"></span>
              IR Timeline
            </h2>
            {selectedCategory !== "すべて" && (
              <span className="text-xs text-[#D4AF37] font-mono font-semibold bg-[#D4AF37]/10 px-2 py-1 rounded border border-[#D4AF37]/30">
                {selectedCategory}
              </span>
            )}
          </div>
          <div className="space-y-3">
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">読み込み中...</p>
              </div>
            ) : impacts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">投稿がありません</p>
              </div>
            ) : (
              impacts.map((impact) => (
                <ImpactCardWithRanking key={impact.id} {...impact} />
              ))
            )}
          </div>
        </div>
      </main>
      <QuotaIndicator />
      <BottomNavigation />
    </div>
  );
}