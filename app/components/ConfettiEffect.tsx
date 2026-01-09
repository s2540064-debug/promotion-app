"use client";

import { useEffect, useState } from "react";

interface ConfettiEffectProps {
  trigger: boolean;
  onComplete?: () => void;
}

export default function ConfettiEffect({ trigger, onComplete }: ConfettiEffectProps) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsActive(true);
      const timer = setTimeout(() => {
        setIsActive(false);
        onComplete?.();
      }, 3000); // 3秒間表示

      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  if (!isActive) return null;

  // 紙吹雪のパーティクルを生成
  const confettiParticles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 1,
    initialRotation: Math.random() * 360,
    finalRotation: Math.random() * 720 + 360,
  }));

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {confettiParticles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-3 h-3 confetti-particle"
            style={{
              left: `${particle.left}%`,
              top: '-10px',
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
              '--initial-rotation': `${particle.initialRotation}deg`,
              '--final-rotation': `${particle.finalRotation}deg`,
            } as React.CSSProperties & { '--initial-rotation': string; '--final-rotation': string }}
          >
            <div className="w-full h-full bg-gradient-to-br from-[#FFD700] via-[#FFA500] to-[#FFD700] rounded-sm shadow-lg" />
          </div>
        ))}
      </div>
      <style jsx global>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(var(--initial-rotation));
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(var(--final-rotation));
            opacity: 0;
          }
        }
        .confetti-particle {
          animation: confettiFall linear forwards;
        }
      `}</style>
    </>
  );
}

