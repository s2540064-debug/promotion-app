import { useEffect, useState, useRef } from "react";

interface UseCountUpOptions {
  duration?: number; // アニメーション時間（ミリ秒）
  startOnMount?: boolean; // マウント時に自動開始
}

export function useCountUp(
  endValue: number,
  options: UseCountUpOptions = {}
): number {
  const { duration = 2000, startOnMount = true } = options;
  const [count, setCount] = useState(0);
  const isAnimatingRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!startOnMount || isAnimatingRef.current) return;

    isAnimatingRef.current = true;
    setCount(0);

    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // イージング関数（ease-out）
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOut);

      setCount(currentValue);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(endValue);
        isAnimatingRef.current = false;
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      isAnimatingRef.current = false;
    };
  }, [endValue, duration, startOnMount]);

  return count;
}

