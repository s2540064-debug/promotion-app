"use client";

import { useState, useEffect } from "react";
import { Plus, Check } from "lucide-react";
import { isWatching, addToWatchList, removeFromWatchList } from "../utils/watchList";

interface WatchButtonProps {
  userId?: string;
  userName: string;
}

export default function WatchButton({ userId, userName }: WatchButtonProps) {
  const [watching, setWatching] = useState(false);

  useEffect(() => {
    if (userId) {
      setWatching(isWatching(userId));
    }
  }, [userId]);

  const handleToggle = () => {
    if (!userId) return;

    if (watching) {
      removeFromWatchList(userId);
      setWatching(false);
    } else {
      addToWatchList(userId, userName);
      setWatching(true);
    }
  };

  if (!userId) return null;

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
        watching
          ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30"
          : "bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-700/50 hover:text-gray-300"
      }`}
      title={watching ? "WATCHING" : "WATCH"}
    >
      {watching ? (
        <>
          <Check size={10} />
          <span>WATCHING</span>
        </>
      ) : (
        <>
          <Plus size={10} />
          <span>WATCH</span>
        </>
      )}
    </button>
  );
}

