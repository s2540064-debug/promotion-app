"use client";

import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import ImpactBadge from './ImpactBadge';
import ParticleEffect from './ParticleEffect';
import FloatingText from './FloatingText';
import WatchButton from './WatchButton';
import CommentSection from './CommentSection';
import { useMarket } from '../contexts/MarketContext';
import { createRespect, hasRespectedPost } from '../utils/supabaseRespects';

interface ImpactCardProps {
  id?: string;
  userId?: string;
  userName: string;
  rank: string;
  content: string;
  timestamp: string;
  marketCapImpact: number; // 今回の投稿で上がった額
  marketCap?: number; // 現在の時価総額
  previousMarketCap?: number; // 前日の時価総額
}

export default function ImpactCard({ 
  id,
  userId,
  userName, 
  rank, 
  content, 
  timestamp, 
  marketCapImpact,
  marketCap = 0,
  previousMarketCap = 0,
}: ImpactCardProps) {
  const { handleSendRespect, userProfile } = useMarket();
  const [isInvested, setIsInvested] = useState(false);
  const [particleTrigger, setParticleTrigger] = useState(false);
  const [floatingText, setFloatingText] = useState<{ text: string; trigger: boolean }>({ text: "", trigger: false });
  const [chartBoost, setChartBoost] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 既に投資済みかチェック
  useEffect(() => {
    const checkRespectStatus = async () => {
      if (id && userId) {
        const hasRespected = await hasRespectedPost("current_user", id);
        setIsInvested(hasRespected);
      }
    };
    checkRespectStatus();
  }, [id, userId]);
  
  // スライドインアニメーション
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  // 前日比を計算
  const change = marketCap - previousMarketCap;
  const changeRate = previousMarketCap > 0 ? (change / previousMarketCap) * 100 : 0;
  const isPositive = changeRate >= 0;
  
  // グラフ用のダミーデータ（投資時にブースト）
  const baseChartData = [
    { value: 100 },
    { value: 120 },
    { value: 110 },
    { value: 130 },
    { value: 125 },
    { value: 125 + marketCapImpact / 10000 + chartBoost }, // 最後の一押し + ブースト
  ];

  const handleInvestment = async () => {
    if (isInvested || !userId || !id) return;

    setIsInvested(true);
    setParticleTrigger(true);
    setChartBoost(5); // チャートを上昇
    setFloatingText({ text: "BUYING...", trigger: true });

    try {
      // Supabaseに投資を記録
      const respectAmount = marketCapImpact; // 投資額は投稿のインパクト額
      const respect = await createRespect({
        from_user_id: "current_user",
        to_user_id: userId,
        post_id: id,
        amount: respectAmount,
      });

      if (respect) {
        // MarketContextと連携
        handleSendRespect();

        // 投資記録を保存（筆頭株主システム用）
        if (typeof window !== 'undefined') {
          const { recordInvestment } = require('../utils/shareholders');
          recordInvestment('current_user', userId);
        }

        setTimeout(() => {
          setFloatingText({ text: "MARKET CAP UP!", trigger: true });
        }, 500);
      } else {
        // エラー時は状態を戻す
        setIsInvested(false);
        alert("投資の記録に失敗しました。もう一度お試しください。");
      }
    } catch (error) {
      console.error("Error creating respect:", error);
      setIsInvested(false);
      alert("投資の記録に失敗しました。もう一度お試しください。");
    }

    setTimeout(() => {
      setParticleTrigger(false);
      setFloatingText({ text: "", trigger: false });
    }, 2000);
  };

  return (
    <div
      ref={cardRef}
      className={`bg-gray-900 border rounded-lg p-3 mb-3 shadow-lg transition-all relative overflow-hidden ${
        isVisible ? "animate-slide-in" : "opacity-0 -translate-x-10"
      } ${
        isInvested
          ? "border-[#FFD700] shadow-[0_0_30px_rgba(255,215,0,0.5)]"
          : "border-gray-800 hover:border-[#D4AF37]/30"
      }`}
    >
      {/* ゴールドフラッシュエフェクト */}
      {isVisible && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 border-2 border-[#FFD700] rounded-xl opacity-0"
            style={{
              animation: "flashGold 0.3s ease-out 0.2s",
            }}
          />
        </div>
      )}

      {/* パーティクルエフェクト */}
      <ParticleEffect trigger={particleTrigger} />

      {/* フローティングテキスト */}
      {floatingText.trigger && (
        <FloatingText
          text={floatingText.text}
          trigger={floatingText.trigger}
          position={{ x: 50, y: 20 }}
        />
      )}

      <div className="flex justify-between items-start mb-3 pb-3 border-b border-gray-800">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-1 rounded border border-[#D4AF37]/20">
              {rank}
            </span>
            <h3 className="text-white font-bold text-sm">{userName}</h3>
            <span className="text-xs text-[#D4AF37] font-mono font-semibold">銘柄</span>
            {/* WATCHボタン */}
            <WatchButton userId={userId} userName={userName} />
            {/* IR重要度バッジ */}
            <ImpactBadge marketCapImpact={marketCapImpact} />
          </div>
          {marketCap > 0 && (
            <div className="flex items-center gap-3 mt-2">
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">時価総額</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-mono font-bold text-[#D4AF37]">
                    ¥{marketCap.toLocaleString()}
                  </span>
                </div>
              </div>
              {previousMarketCap > 0 && (
                <div>
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest">前日比</span>
                  <div className={`flex items-center gap-1 text-xs font-bold ${
                    isPositive ? "text-green-400" : "text-red-400"
                  }`}>
                    {isPositive ? (
                      <TrendingUp size={12} />
                    ) : (
                      <TrendingDown size={12} />
                    )}
                    <span>
                      {isPositive ? "+" : ""}
                      {changeRate.toFixed(2)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <span className="text-gray-500 text-xs font-mono ml-2">{timestamp}</span>
      </div>

      <p className="text-gray-300 text-sm mb-4 leading-relaxed">
        {content}
      </p>

      <div className="flex items-center justify-between bg-black/50 rounded-lg p-3 border border-gray-800">
        <div className="w-1/2">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Market Impact</p>
          <p className="text-green-400 font-mono font-bold">
            +{marketCapImpact.toLocaleString()} JPY
          </p>
        </div>
        
        {/* 小さなチャート（スパークライン） */}
        <div className="w-1/2 h-12 relative">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={baseChartData}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#4ade80" 
                strokeWidth={2} 
                dot={false} 
                isAnimationActive={true}
                animationDuration={chartBoost > 0 ? 500 : 1000}
              />
              <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 投資ボタン */}
      <div className="mt-3 flex justify-end">
        <button
          onClick={handleInvestment}
          className={`relative overflow-hidden flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-xs transition-all ${
            isInvested
              ? "bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/50"
              : "bg-gradient-to-r from-gray-800 to-gray-700 text-gray-300 hover:from-green-600/20 hover:to-green-500/10 hover:text-green-400 hover:border hover:border-green-500/30"
          }`}
        >
          <Sparkles 
            size={16} 
            className={isInvested ? "text-white" : "text-green-400"} 
            fill={isInvested ? "currentColor" : "none"}
          />
          <span>{isInvested ? "投資済み" : "投資"}</span>
        </button>
      </div>

      {/* コメントセクション（右下） */}
      <div className="mt-2 flex justify-end">
        <CommentSection postId={id || `post_${userId}_${timestamp}`} />
      </div>

    </div>
  );
}