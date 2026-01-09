"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNavigation from "../components/BottomNavigation";
import SectorSelector, { type Sector } from "../components/SectorSelector";
import ImpactSimulator from "../components/ImpactSimulator";
import EvidenceUpload from "../components/EvidenceUpload";
import { ArrowRight, Sparkles } from "lucide-react";
import { createPost } from "../utils/supabasePosts";
import { calculateMarketImpact } from "../utils/impactSimulator";
import { useMarket } from "../contexts/MarketContext";

export default function PostPage() {
  const router = useRouter();
  const { userProfile } = useMarket();
  const [content, setContent] = useState("");
  const [sector, setSector] = useState<Sector>("ビジネス");
  const [evidenceImage, setEvidenceImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    setShowFlash(true);

    // 速報エフェクト
    setTimeout(() => {
      setShowFlash(false);
    }, 1000);

    try {
      console.log("[IR発行] 投稿処理を開始します");
      
      // 市場インパクトを計算
      const impactAmount = calculateMarketImpact(
        content,
        sector,
        !!evidenceImage
      );

      console.log("[IR発行] 計算されたインパクト額:", impactAmount);

      // 画像のアップロード（将来的に実装）
      let imageUrl: string | undefined = undefined;
      if (evidenceImage) {
        console.log("[IR発行] 画像ファイルが添付されています:", {
          name: evidenceImage.name,
          size: evidenceImage.size,
          type: evidenceImage.type,
        });
        // TODO: Supabase Storageに画像をアップロード
        // const { data, error } = await supabase.storage
        //   .from('evidence-images')
        //   .upload(`${Date.now()}_${evidenceImage.name}`, evidenceImage);
        // if (!error && data) {
        //   imageUrl = data.path;
        //   console.log("[IR発行] 画像アップロード成功:", imageUrl);
        // } else {
        //   console.error("[IR発行] 画像アップロード失敗:", error);
        // }
      }

      // Supabaseに投稿を保存
      const postData = {
        content: content.trim(),
        image_url: imageUrl,
        impact_amount: impactAmount,
      };

      console.log("[IR発行] Supabaseに保存するデータ:", {
        content: postData.content.substring(0, 50) + "...",
        image_url: postData.image_url || "なし",
        impact_amount: postData.impact_amount,
      });

      const post = await createPost(postData);

      if (post) {
        console.log("[IR発行] 投稿が正常に保存されました:", post);
        // 成功後、ホームにリダイレクト
        setTimeout(() => {
          setIsSubmitting(false);
          router.push("/");
        }, 1500);
      } else {
        // エラー処理
        console.error("[IR発行] 投稿の保存に失敗しました（createPostがnullを返しました）");
        console.error("[IR発行] 詳細は上記のSupabaseエラーログを確認してください");
        setIsSubmitting(false);
        alert("投稿の保存に失敗しました。ブラウザのコンソール（F12）でエラー詳細を確認してください。");
      }
    } catch (error) {
      console.error("[IR発行] 予期しないエラーが発生しました:");
      console.error("  Error type:", error instanceof Error ? error.constructor.name : typeof error);
      console.error("  Error message:", error instanceof Error ? error.message : String(error));
      console.error("  Error stack:", error instanceof Error ? error.stack : "N/A");
      console.error("  Full error object:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
      setIsSubmitting(false);
      alert("投稿の保存に失敗しました。ブラウザのコンソール（F12）でエラー詳細を確認してください。");
    }
  };

  return (
    <div className="min-h-screen bg-black pb-20 relative overflow-hidden">
      {/* 速報エフェクト */}
      {showFlash && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/20 via-transparent to-[#FFD700]/20"
            style={{
              animation: "flashNews 0.5s ease-out",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="bg-black/90 border-4 border-[#FFD700] rounded-lg px-8 py-4 shadow-2xl"
              style={{
                boxShadow: "0 0 50px rgba(255, 215, 0, 0.8)",
                animation: "flashNews 0.5s ease-out",
              }}
            >
              <span
                className="text-2xl font-bold uppercase tracking-wider"
                style={{
                  color: "#FFD700",
                  textShadow: "0 0 20px #FFD700",
                }}
              >
                BREAKING NEWS
              </span>
            </div>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-black border-b border-gray-800 backdrop-blur-sm bg-black/95 shadow-lg">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-2">
            <div className="w-1 h-6 bg-[#D4AF37]"></div>
            <h1 className="text-xl font-bold text-white uppercase tracking-wider">
              Issue New IR
            </h1>
            <div className="w-1 h-6 bg-[#D4AF37]"></div>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2 font-mono">
            新規IR発行
          </p>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* 活動内容入力 */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-3">
            活動内容
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="市場に報告する成果を入力してください"
            className="w-full h-40 px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 resize-none font-sans"
          />
          <div className="text-xs text-gray-500 mt-2 text-right font-mono">
            {content.length} 文字
          </div>
        </div>

        {/* セクター選択 */}
        <div className="mb-6">
          <SectorSelector selectedSector={sector} onSectorChange={setSector} />
        </div>

        {/* 証拠写真アップロード */}
        <EvidenceUpload
          onImageChange={setEvidenceImage}
          currentImage={evidenceImage}
        />

        {/* インパクト・シミュレーター */}
        <div className="mb-6">
          <ImpactSimulator
            content={content}
            sector={sector}
            hasEvidence={!!evidenceImage}
          />
        </div>

        {/* 送信ボタン */}
        <button
          onClick={handleSubmit}
          disabled={!content.trim() || isSubmitting}
          className={`w-full relative overflow-hidden px-6 py-4 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${
            !content.trim() || isSubmitting
              ? "bg-gray-900 text-gray-600 border-2 border-gray-800 cursor-not-allowed"
              : "bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#D4AF37] text-black border-2 border-[#FFD700] shadow-lg shadow-[#D4AF37]/50 hover:shadow-[#D4AF37]/70 hover:scale-105 active:scale-95"
          }`}
          style={
            !content.trim() || isSubmitting
              ? {}
              : {
                  backgroundSize: "200% 100%",
                  animation: "shimmer 2s infinite",
                }
          }
        >
          <div className="flex items-center justify-center gap-2 relative z-10">
            <Sparkles size={18} />
            <span>Release to Market</span>
            <ArrowRight size={18} />
          </div>
          <span className="block text-xs mt-1 relative z-10 opacity-90">
            市場へ公開
          </span>
          {!content.trim() || isSubmitting ? null : (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          )}
        </button>
      </main>

      <BottomNavigation />
    </div>
  );
}

