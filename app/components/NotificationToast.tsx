"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { getSoundManager, playInvestmentHaptic } from "../utils/sounds";

interface NotificationToastProps {
  amount: number;
  userName?: string;
  isVisible: boolean;
  onClose: () => void;
}

export default function NotificationToast({
  amount,
  userName,
  isVisible,
  onClose,
}: NotificationToastProps) {
  useEffect(() => {
    if (isVisible) {
      // サウンド再生
      const soundManager = getSoundManager();
      soundManager.resumeAudioContext();
      soundManager.playCashRegisterSound();

      // モバイル振動
      playInvestmentHaptic();

      // 3秒後に自動で閉じる
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4"
        >
          <div className="bg-black border-2 border-[#D4AF37] rounded-lg p-4 shadow-2xl relative overflow-hidden">
            {/* 背景パターン */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(212,175,55,0.1) 10px, rgba(212,175,55,0.1) 20px)",
              }} />
            </div>

            <div className="relative z-10 flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg border border-green-500/40 shadow-lg shadow-green-500/20">
                <TrendingUp size={20} className="text-green-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider font-mono">
                    [CAPITAL IN]
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-mono font-bold text-green-400">
                    +¥{amount.toLocaleString()}
                  </span>
                  {userName && (
                    <span className="text-xs text-gray-400 font-semibold">
                      from {userName}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

