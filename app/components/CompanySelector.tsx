"use client";

import { useState } from "react";
import { Building2, Plus, Search } from "lucide-react";
import { useCompany } from "../contexts/CompanyContext";
import { useMarket } from "../contexts/MarketContext";
import {
  joinCompany,
  getUserCompanyId,
} from "../utils/company";
import CompanyCreationModal from "./CompanyCreationModal";

export default function CompanySelector() {
  const { companies, refreshCompanies } = useCompany();
  const { marketData } = useMarket();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const currentUserId = "current_user";
  const currentUserName = "あなた";
  const currentCompanyId = getUserCompanyId(currentUserId);

  const handleJoinCompany = (companyId: string) => {
    const result = joinCompany(companyId, currentUserId, currentUserName, marketData.marketCap);
    if (result.success) {
      refreshCompanies();
    } else {
      alert(result.error || "参加に失敗しました");
    }
  };

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (currentCompanyId) {
    return null; // 既に会社に所属している場合は表示しない
  }

  return (
    <div className="mb-6">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#D4AF37] text-black rounded-lg font-semibold hover:bg-[#FFD700] transition-colors"
        >
          <Plus size={18} />
          上場企業を設立
        </button>
        <button
          onClick={() => {
            setShowJoin(true);
          }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
        >
          <Building2 size={18} />
          上場企業に参加
        </button>
      </div>

      <CompanyCreationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          refreshCompanies();
        }}
      />

      {showJoin && (
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="上場企業を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredCompanies.length === 0 ? (
              <p className="text-gray-400 text-center py-4">
                {searchQuery ? "該当する上場企業が見つかりません" : "参加できる上場企業がありません"}
              </p>
            ) : (
              filteredCompanies.map((company) => (
                <div
                  key={company.id}
                  className="flex items-center justify-between p-3 bg-black rounded-lg border border-gray-800"
                >
                  <div className="flex-1">
                    <div className="text-white font-semibold text-sm">
                      {company.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {company.description}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {company.members.length}名の社員
                    </div>
                  </div>
                  <button
                    onClick={() => handleJoinCompany(company.id)}
                    className="px-4 py-2 bg-[#D4AF37] text-black rounded-lg font-semibold text-sm hover:bg-[#FFD700] transition-colors"
                  >
                    参加
                  </button>
                </div>
              ))
            )}
          </div>
          <button
            onClick={() => {
              setShowJoin(false);
              setSearchQuery("");
            }}
            className="w-full mt-3 px-4 py-2 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            閉じる
          </button>
        </div>
      )}
    </div>
  );
}

