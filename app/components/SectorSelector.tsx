"use client";

export type Sector = "ビジネス" | "自己研鑽" | "フィジカル" | "その他";

interface SectorSelectorProps {
  selectedSector: Sector;
  onSectorChange: (sector: Sector) => void;
}

const sectors: Sector[] = ["ビジネス", "自己研鑽", "フィジカル", "その他"];

export default function SectorSelector({
  selectedSector,
  onSectorChange,
}: SectorSelectorProps) {
  return (
    <div>
      <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-3">
        セクター選択
      </label>
      <div className="grid grid-cols-2 gap-3">
        {sectors.map((sector) => (
          <button
            key={sector}
            onClick={() => onSectorChange(sector)}
            className={`px-4 py-3 rounded-lg font-bold text-sm transition-all border-2 ${
              selectedSector === sector
                ? "bg-[#D4AF37] text-black border-[#D4AF37] shadow-lg shadow-[#D4AF37]/30"
                : "bg-gray-900 text-gray-400 border-gray-800 hover:border-[#D4AF37]/50 hover:text-white"
            }`}
          >
            {sector}
          </button>
        ))}
      </div>
    </div>
  );
}

