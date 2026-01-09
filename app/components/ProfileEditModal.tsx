"use client";

import { useState, useEffect } from "react";
import { X, Save, CheckCircle2 } from "lucide-react";
import SectorSelector, { type Sector } from "./SectorSelector";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  currentRank: string;
  currentVision: string;
  currentSector: Sector;
  currentBase?: string;
  currentFuel?: string;
  currentRiskFactors?: string;
  currentPersonalTags?: string[];
  onSave: (data: {
    name: string;
    rank: string;
    vision: string;
    sector: Sector;
    base?: string;
    fuel?: string;
    riskFactors?: string;
    personalTags?: string[];
  }) => void;
}

export default function ProfileEditModal({
  isOpen,
  onClose,
  currentName,
  currentRank,
  currentVision,
  currentSector,
  currentBase = "",
  currentFuel = "",
  currentRiskFactors = "",
  currentPersonalTags = [],
  onSave,
}: ProfileEditModalProps) {
  const [name, setName] = useState(currentName);
  const [rank, setRank] = useState(currentRank);
  const [vision, setVision] = useState(currentVision);
  const [sector, setSector] = useState<Sector>(currentSector);
  const [base, setBase] = useState(currentBase);
  const [fuel, setFuel] = useState(currentFuel);
  const [riskFactors, setRiskFactors] = useState(currentRiskFactors);
  const [personalTags, setPersonalTags] = useState(currentPersonalTags.join(", "));
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(currentName);
      setRank(currentRank);
      setVision(currentVision);
      setSector(currentSector);
      setBase(currentBase);
      setFuel(currentFuel);
      setRiskFactors(currentRiskFactors);
      setPersonalTags(currentPersonalTags.join(", "));
      setShowSuccess(false);
    }
  }, [isOpen, currentName, currentRank, currentVision, currentSector, currentBase, currentFuel, currentRiskFactors, currentPersonalTags]);

  const handleSave = () => {
    if (!name.trim()) return;

    const tags = personalTags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    onSave({
      name,
      rank,
      vision,
      sector,
      base: base.trim() || undefined,
      fuel: fuel.trim() || undefined,
      riskFactors: riskFactors.trim() || undefined,
      personalTags: tags.length > 0 ? tags : undefined,
    });
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative max-w-md w-full mx-4 bg-gray-900 rounded-xl border border-gray-700 shadow-2xl overflow-hidden animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-[#D4AF37]"></div>
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">
              Update Market Info
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* 銘柄名 */}
          <div>
            <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-3">
              銘柄名
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="銘柄名を入力"
              className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
            />
          </div>

          {/* 役職 */}
          <div>
            <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-3">
              役職
            </label>
            <input
              type="text"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              placeholder="現在の肩書きを入力"
              className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
            />
          </div>

          {/* ビジョン */}
          <div>
            <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-3">
              ビジョン
            </label>
            <textarea
              value={vision}
              onChange={(e) => setVision(e.target.value)}
              placeholder="自己紹介テキストを入力"
              rows={4}
              className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 resize-none"
            />
          </div>

          {/* セクター選択 */}
          <div>
            <SectorSelector selectedSector={sector} onSectorChange={setSector} />
          </div>

          {/* パーソナル情報セクション */}
          <div className="pt-4 border-t border-gray-800">
            <h3 className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-4">
              パーソナル情報
            </h3>
            <p className="text-xs text-gray-500 mb-4 italic">
              投資家にあなたの人間味を伝えましょう
            </p>

            {/* 上場拠点 */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-2">
                📍 上場拠点 (Base)
              </label>
              <input
                type="text"
                value={base}
                onChange={(e) => setBase(e.target.value)}
                placeholder="例：福岡、東京"
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
              />
              <p className="text-xs text-gray-600 mt-1">出身地や現在の活動拠点</p>
            </div>

            {/* 動力源 */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-2">
                ⚡️ 動力源 (Fuel)
              </label>
              <input
                type="text"
                value={fuel}
                onChange={(e) => setFuel(e.target.value)}
                placeholder="例：サウナ、特定の漫画、コーヒー"
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
              />
              <p className="text-xs text-gray-600 mt-1">自分が頑張るために必要なもの</p>
            </div>

            {/* リスク要因 */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-2">
                ⚠️ リスク要因 (Risk Factors)
              </label>
              <textarea
                value={riskFactors}
                onChange={(e) => setRiskFactors(e.target.value)}
                placeholder="例：朝が苦手、集中力が短い"
                rows={2}
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 resize-none"
              />
              <p className="text-xs text-gray-600 mt-1">自分の人間らしい弱点</p>
            </div>

            {/* パーソナルタグ */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-2">
                🏷️ パーソナルタグ
              </label>
              <input
                type="text"
                value={personalTags}
                onChange={(e) => setPersonalTags(e.target.value)}
                placeholder="例：努力家, 好奇心旺盛, チームワーク（カンマ区切り）"
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
              />
              <p className="text-xs text-gray-600 mt-1">性格や価値観を表す短いキーワード（カンマ区切り）</p>
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="p-4 border-t border-gray-800 bg-gray-900">
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${
              !name.trim()
                ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#D4AF37] text-black border-2 border-[#FFD700] shadow-lg shadow-[#D4AF37]/50 hover:shadow-[#D4AF37]/70 hover:scale-105"
            }`}
          >
            <Save size={18} />
            <span>Update Market Info</span>
          </button>
          <p className="text-xs text-gray-500 text-center mt-2 font-mono">
            市場情報を更新
          </p>
        </div>

        {/* 成功通知 */}
        {showSuccess && (
          <div className="absolute inset-0 bg-black/90 flex items-center justify-center animate-fadeIn">
            <div className="bg-gray-900 border-2 border-[#D4AF37] rounded-lg px-6 py-4 shadow-2xl">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={24} className="text-green-400" />
                <div>
                  <p className="text-sm font-bold text-white">
                    情報が市場に反映されました
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    市場情報が更新されました
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

