"use client";

import { useEffect, useState } from "react";

interface FloatingTextProps {
  text: string;
  trigger: boolean;
  position?: { x: number; y: number };
}

export default function FloatingText({
  text,
  trigger,
  position = { x: 50, y: 50 },
}: FloatingTextProps) {
  const [visible, setVisible] = useState(false);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (!trigger) return;

    setVisible(true);
    setOpacity(1);

    const fadeOut = setInterval(() => {
      setOpacity((prev) => {
        if (prev <= 0) {
          clearInterval(fadeOut);
          setVisible(false);
          return 0;
        }
        return prev - 0.05;
      });
    }, 50);

    return () => clearInterval(fadeOut);
  }, [trigger]);

  if (!visible) return null;

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: "translate(-50%, -100%)",
        opacity,
        transition: "opacity 0.1s ease-out, transform 0.1s ease-out",
      }}
    >
      <div
        className="bg-black/90 border-2 border-[#FFD700] rounded-lg px-4 py-2 shadow-lg"
        style={{
          boxShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
        }}
      >
        <span
          className="text-sm font-bold uppercase tracking-wider"
          style={{
            color: "#FFD700",
            textShadow: "0 0 10px #FFD700, 0 0 20px #FFD700",
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
}

