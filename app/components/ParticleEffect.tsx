"use client";

import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

interface ParticleEffectProps {
  trigger: boolean;
  onComplete?: () => void;
}

export default function ParticleEffect({ trigger, onComplete }: ParticleEffectProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!trigger) return;

    // パーティクルを生成
    const newParticles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: 50, // ボタンの中心（%）
      y: 50,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4 - 2, // 上向きに
      life: 1,
    }));

    setParticles(newParticles);

    // アニメーション
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.1, // 重力
            life: p.life - 0.02,
          }))
          .filter((p) => p.life > 0)
      );
    }, 16);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setParticles([]);
      onComplete?.();
    }, 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [trigger, onComplete]);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            background: `radial-gradient(circle, #FFD700 ${particle.life * 100}%, transparent)`,
            opacity: particle.life,
            transform: `scale(${particle.life})`,
            boxShadow: `0 0 ${particle.life * 10}px #FFD700`,
          }}
        />
      ))}
    </div>
  );
}

