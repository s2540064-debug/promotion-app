"use client";

import { useState } from "react";
import BottomNavigation from "../components/BottomNavigation";
import PlayerRankingCard from "../components/PlayerRankingCard";
import { Search } from "lucide-react";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-black pb-20">
      <header className="sticky top-0 z-40 bg-black border-b border-gray-800 backdrop-blur-sm bg-black/95">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-white mb-3">検索</h1>
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="銘柄名で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {searchQuery ? (
          <div>
            <p className="text-gray-400 text-center mt-8">
              検索機能は準備中です
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-sm font-semibold text-white mb-4">個人ランキング</h2>
            <PlayerRankingCard />
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}

