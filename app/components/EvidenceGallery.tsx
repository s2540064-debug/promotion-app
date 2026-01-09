"use client";

import { useState } from "react";
import { CheckCircle2, X } from "lucide-react";

export interface EvidenceItem {
  id: string;
  imageUrl: string;
  impact: number;
  content: string;
  date: string;
  sector: string;
}

interface EvidenceGalleryProps {
  items: EvidenceItem[];
}

interface EvidenceModalProps {
  item: EvidenceItem | null;
  isOpen: boolean;
  onClose: () => void;
}

function EvidenceModal({ item, isOpen, onClose }: EvidenceModalProps) {
  if (!isOpen || !item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full mx-4 bg-gray-900 rounded-xl border border-gray-700 shadow-2xl overflow-hidden animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/80 rounded-full hover:bg-black transition-colors"
        >
          <X size={20} className="text-white" />
        </button>

        {/* 画像 */}
        <div className="relative w-full h-64 md:h-96 bg-gray-800">
          <img
            src={item.imageUrl}
            alt="証拠写真"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/80 px-3 py-1.5 rounded-lg border border-[#D4AF37]/30">
            <CheckCircle2 size={16} className="text-[#D4AF37]" />
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
              Verified
            </span>
          </div>
        </div>

        {/* コンテンツ */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-800">
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                {item.date}
              </div>
              <div className="text-sm font-semibold text-gray-400 uppercase">
                {item.sector}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Market Impact
              </div>
              <div className="text-xl font-mono font-bold text-green-400">
                +¥{item.impact.toLocaleString()}
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
              IR Content
            </div>
            <p className="text-gray-300 leading-relaxed">{item.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EvidenceGallery({ items }: EvidenceGalleryProps) {
  const [selectedItem, setSelectedItem] = useState<EvidenceItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = (item: EvidenceItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  if (items.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-8 border border-gray-700 text-center">
        <p className="text-gray-500 text-sm">まだ証拠写真がありません</p>
        <p className="text-gray-600 text-xs mt-2">
          新しいIRを発行して証拠写真を追加しましょう
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="relative group cursor-pointer"
            onClick={() => handleImageClick(item)}
          >
            <div className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-[#D4AF37]/60 transition-all duration-300 hover:shadow-xl hover:shadow-[#D4AF37]/30 hover:-translate-y-1.5 hover:scale-105">
              <img
                src={item.imageUrl}
                alt="証拠写真"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              
              {/* オーバーレイ */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* VERIFIEDアイコン */}
              <div className="absolute top-1.5 right-1.5 z-10">
                <div className="bg-black/90 px-1.5 py-0.5 rounded border border-[#D4AF37]/50 shadow-lg">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 size={10} className="text-[#D4AF37]" />
                    <span className="text-[8px] font-bold text-[#D4AF37] uppercase tracking-wider">
                      Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* インパクトバッジ */}
              <div className="absolute bottom-1.5 left-1.5 right-1.5 z-10">
                <div className="bg-gradient-to-r from-green-500 to-green-400 px-2 py-1 rounded text-xs font-mono font-bold text-white shadow-lg border border-green-400/30">
                  +¥{(item.impact / 1000).toFixed(0)}K
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <EvidenceModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}

