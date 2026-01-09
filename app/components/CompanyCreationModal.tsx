"use client";

import { useState } from "react";
import { X, AlertCircle, CheckCircle2 } from "lucide-react";
import { useMarket } from "../contexts/MarketContext";
import { useCompany } from "../contexts/CompanyContext";
import { checkCompanyCreationRequirements, createCompany } from "../utils/company";
import { getRankFromMarketCap } from "../utils/marketCap";

interface CompanyCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CompanyCreationModal({
  isOpen,
  onClose,
  onSuccess,
}: CompanyCreationModalProps) {
  const { marketData } = useMarket();
  const { refreshCompanies } = useCompany();
  const [companyName, setCompanyName] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const rank = getRankFromMarketCap(
    marketData.marketCap,
    marketData.receivedRespects
  );
  const requirements = checkCompanyCreationRequirements(marketData.marketCap, rank);
  const canCreate = requirements.canCreate;

  const handleCreate = () => {
    if (!companyName.trim()) {
      setError("企業名を入力してください");
      return;
    }

    const result = createCompany(
      companyName,
      companyDescription || "新しい上場企業です",
      "current_user",
      "あなた",
      marketData.marketCap,
      rank
    );

    if (result.success) {
      setCompanyName("");
      setCompanyDescription("");
      setError(null);
      refreshCompanies();
      onSuccess();
      onClose();
    } else {
      setError(result.error || "会社の作成に失敗しました");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">上場企業を設立</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* 設立条件チェック */}
        <div className="mb-6 p-4 bg-gray-900 rounded-lg border border-gray-800">
          <h3 className="text-sm font-semibold text-white mb-3">上場条件</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {marketData.marketCap >= 10_000_000 ? (
                <CheckCircle2 size={16} className="text-green-400" />
              ) : (
                <AlertCircle size={16} className="text-red-400" />
              )}
              <span
                className={`text-sm ${
                  marketData.marketCap >= 10_000_000
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                時価総額: ¥{marketData.marketCap.toLocaleString()} / ¥10,000,000
                {marketData.marketCap < 10_000_000 && (
                  <span className="ml-2">
                    (不足: ¥
                    {(10_000_000 - marketData.marketCap).toLocaleString()})
                  </span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {["課長", "部長", "役員", "社長", "会長"].includes(rank) ? (
                <CheckCircle2 size={16} className="text-green-400" />
              ) : (
                <AlertCircle size={16} className="text-red-400" />
              )}
              <span
                className={`text-sm ${
                  ["課長", "部長", "役員", "社長", "会長"].includes(rank)
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                役職: {rank} / 課長以上
                {!["課長", "部長", "役員", "社長", "会長"].includes(rank) && (
                  <span className="ml-2">(不足)</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* 出資金情報 */}
        <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
          <h3 className="text-sm font-semibold text-yellow-400 mb-2">出資金</h3>
          <p className="text-sm text-gray-300">
            設立時に¥2,000,000が出資金としてロックされます
          </p>
          <p className="text-xs text-gray-500 mt-1">
            出資金を差し引いた時価総額: ¥
            {(marketData.marketCap - 2_000_000).toLocaleString()}
          </p>
        </div>

        {/* フォーム */}
        <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                企業名 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="例: 株式会社テックイノベーション"
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                企業の説明（任意）
              </label>
            <textarea
              value={companyDescription}
              onChange={(e) => setCompanyDescription(e.target.value)}
              placeholder="会社の理念や目標を記入してください"
              rows={4}
              className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#D4AF37] resize-none"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-900/30 border border-red-600/50 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleCreate}
            disabled={!canCreate || !companyName.trim()}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors ${
              canCreate && companyName.trim()
                ? "bg-[#D4AF37] text-black hover:bg-[#FFD700]"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            設立する
          </button>
        </div>
      </div>
    </div>
  );
}

