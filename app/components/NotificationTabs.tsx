"use client";

export type NotificationTab = "market" | "human";

interface NotificationTabsProps {
  activeTab: NotificationTab;
  onTabChange: (tab: NotificationTab) => void;
  marketCount: number;
  humanCount: number;
}

export default function NotificationTabs({
  activeTab,
  onTabChange,
  marketCount,
  humanCount,
}: NotificationTabsProps) {
  return (
    <div className="flex gap-2 border-b border-gray-800 mb-4">
      <button
        onClick={() => onTabChange("market")}
        className={`flex-1 px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${
          activeTab === "market"
            ? "text-[#D4AF37] border-[#D4AF37]"
            : "text-gray-500 border-transparent hover:text-gray-300"
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          <span>市場 (Market)</span>
          {marketCount > 0 && (
            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
              {marketCount}
            </span>
          )}
        </div>
      </button>
      <button
        onClick={() => onTabChange("human")}
        className={`flex-1 px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${
          activeTab === "human"
            ? "text-[#D4AF37] border-[#D4AF37]"
            : "text-gray-500 border-transparent hover:text-gray-300"
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          <span>人間 (Human)</span>
          {humanCount > 0 && (
            <span className="px-2 py-0.5 bg-pink-500/20 text-pink-400 text-xs rounded-full border border-pink-500/30">
              {humanCount}
            </span>
          )}
        </div>
      </button>
    </div>
  );
}

