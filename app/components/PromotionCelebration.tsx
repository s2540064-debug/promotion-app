"use client";

import { useEffect, useState } from "react";
import { Trophy, Sparkles } from "lucide-react";
import ConfettiEffect from "./ConfettiEffect";
import { getSoundManager } from "../utils/sounds";

interface PromotionCelebrationProps {
  oldRank: string;
  newRank: string;
  onComplete?: () => void;
}

export default function PromotionCelebration({
  oldRank,
  newRank,
  onComplete,
}: PromotionCelebrationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (oldRank !== newRank) {
      setIsVisible(true);
      setShowConfetti(true);
      
      // ファンファーレ音を再生
      const soundManager = getSoundManager();
      soundManager.resumeAudioContext();
      soundManager.playFanfareSound();

      const timer = setTimeout(() => {
        setIsVisible(false);
        setShowConfetti(false);
        onComplete?.();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [oldRank, newRank, onComplete]);

  if (!isVisible) return null;

  return (
    <>
      <ConfettiEffect trigger={showConfetti} />
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl animate-scale-in">
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <Trophy size={64} className="text-black animate-bounce" />
              <Sparkles
                size={32}
                className="absolute -top-2 -right-2 text-yellow-200 animate-pulse"
              />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-black mb-2">昇進おめでとうございます！</h2>
          <div className="mb-4">
            <div className="text-lg text-black/70 mb-1">{oldRank}</div>
            <div className="text-2xl font-bold text-black">↓</div>
            <div className="text-2xl font-bold text-black">{newRank}</div>
          </div>
          <p className="text-sm text-black/80">
            素晴らしい成果です！次のステージへ進みましょう！
          </p>
          <style jsx>{`
            @keyframes scale-in {
              0% {
                transform: scale(0.8);
                opacity: 0;
              }
              100% {
                transform: scale(1);
                opacity: 1;
              }
            }
            .animate-scale-in {
              animation: scale-in 0.3s ease-out;
            }
          `}</style>
        </div>
      </div>
    </>
  );
}

