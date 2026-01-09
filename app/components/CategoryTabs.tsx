"use client";

import { useState } from "react";

export type Category = "すべて" | "ビジネス" | "自己研鑽" | "健康" | "その他";

interface CategoryTabsProps {
  selectedCategory: Category;
  onCategoryChange: (category: Category) => void;
}

const categories: Category[] = ["すべて", "ビジネス", "自己研鑽", "健康", "その他"];

export default function CategoryTabs({
  selectedCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  return (
    <div className="bg-black border-b border-gray-800 sticky top-0 z-30 shadow-lg">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-2.5 rounded-lg font-bold text-xs whitespace-nowrap transition-all border ${
                selectedCategory === category
                  ? "bg-[#D4AF37] text-black border-[#D4AF37] shadow-lg shadow-[#D4AF37]/30"
                  : "bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800 border-gray-800"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

