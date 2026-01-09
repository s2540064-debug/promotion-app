"use client";

import BottomNavigation from "../components/BottomNavigation";
import CompanyCard from "../components/CompanyCard";
import { useCompany } from "../contexts/CompanyContext";
import { Building2 } from "lucide-react";

export default function CompaniesPage() {
  const { ranking, refreshCompanies } = useCompany();

  return (
    <div className="min-h-screen bg-black pb-20">
      <header className="sticky top-0 z-40 bg-black border-b border-gray-800 backdrop-blur-sm bg-black/95">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-white">上場企業ランキング</h1>
            <Building2 size={20} className="text-[#D4AF37]" />
          </div>
          <p className="text-xs text-gray-500 mt-1">時価総額順の上場企業一覧</p>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {ranking.length === 0 ? (
          <div className="text-center mt-12">
            <p className="text-gray-400 mb-4">まだ上場企業が登録されていません</p>
            <p className="text-sm text-gray-500">
              最初の上場企業を作成してみましょう
            </p>
          </div>
        ) : (
          <div>
            {ranking.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}

