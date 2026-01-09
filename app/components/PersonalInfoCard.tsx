"use client";

import { MapPin, Zap, AlertTriangle, Tag } from "lucide-react";

interface PersonalInfoCardProps {
  base?: string;
  fuel?: string;
  riskFactors?: string;
  personalTags?: string[];
}

export default function PersonalInfoCard({
  base,
  fuel,
  riskFactors,
  personalTags,
}: PersonalInfoCardProps) {
  if (!base && !fuel && !riskFactors && (!personalTags || personalTags.length === 0)) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 rounded-lg p-5 border border-gray-700 shadow-xl">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-800">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
          パーソナル情報
        </h3>
        <span className="text-xs text-gray-500 font-mono">Personal Data</span>
      </div>

      <div className="space-y-4">
        {/* 上場拠点 */}
        {base && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20 hover:bg-blue-500/10 transition-colors">
            <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/40 shadow-lg shadow-blue-500/20">
              <MapPin size={18} className="text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                上場拠点 (Base)
              </div>
              <div className="text-sm font-semibold text-blue-300">{base}</div>
            </div>
          </div>
        )}

        {/* 動力源 */}
        {fuel && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20 hover:bg-yellow-500/10 transition-colors">
            <div className="p-2 bg-yellow-500/20 rounded-lg border border-yellow-500/40 shadow-lg shadow-yellow-500/20">
              <Zap size={18} className="text-yellow-400" />
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                動力源 (Fuel)
              </div>
              <div className="text-sm font-semibold text-yellow-300">{fuel}</div>
            </div>
          </div>
        )}

        {/* リスク要因 */}
        {riskFactors && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-500/5 border border-orange-500/20 hover:bg-orange-500/10 transition-colors">
            <div className="p-2 bg-orange-500/20 rounded-lg border border-orange-500/40 shadow-lg shadow-orange-500/20">
              <AlertTriangle size={18} className="text-orange-400" />
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                リスク要因 (Risk Factors)
              </div>
              <div className="text-sm text-orange-200 leading-relaxed italic">{riskFactors}</div>
            </div>
          </div>
        )}

        {/* パーソナルタグ */}
        {personalTags && personalTags.length > 0 && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-500/5 border border-purple-500/20 hover:bg-purple-500/10 transition-colors">
            <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/40 shadow-lg shadow-purple-500/20">
              <Tag size={18} className="text-purple-400" />
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                パーソナルタグ
              </div>
              <div className="flex flex-wrap gap-2">
                {personalTags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-500/20 border border-purple-500/40 rounded-lg text-xs font-semibold text-purple-300 shadow-md hover:bg-purple-500/30 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

