"use client";

import { Building2, TrendingUp, Users, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useCompany } from "../contexts/CompanyContext";
import {
  calculateCompanyMarketCap,
  calculateOrganizationFactor,
  getStageName,
  STAGE_THRESHOLDS,
  checkStageMaintenance,
} from "../utils/company";

export default function CompanyDashboard() {
  const { userCompany } = useCompany();

  if (!userCompany) return null;

  const companyMarketCap = calculateCompanyMarketCap(userCompany);
  const organizationFactor = calculateOrganizationFactor(userCompany);
  const { meetsThreshold, requiredMarketCap } = checkStageMaintenance(userCompany);
  const quotaFailures = userCompany.members.filter(
    (member) => member.givenRespectsToday < 3
  ).length;

  return (
    <div className="mb-6 space-y-4">
      {/* ステージ表示 */}
      <div className="bg-gradient-to-r from-[#D4AF37]/20 to-[#FFD700]/20 border border-[#D4AF37] rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Building2 size={20} className="text-[#D4AF37]" />
            <h3 className="text-lg font-bold text-white">{userCompany.name}</h3>
          </div>
          <span className="px-3 py-1 bg-[#D4AF37] text-black text-xs font-bold rounded-full">
            {getStageName(userCompany.stage)}
          </span>
        </div>
        {userCompany.isBankrupt && (
          <div className="mt-2 p-2 bg-red-900/30 border border-red-600/50 rounded-lg">
            <p className="text-sm text-red-400 font-semibold">⚠️ 倒産状態</p>
          </div>
        )}
      </div>

      {/* 時価総額と組織力係数 */}
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="text-xs text-gray-500">会社時価総額</span>
            <div className="text-xl font-mono font-bold text-[#D4AF37]">
              ¥{companyMarketCap.toLocaleString()}
            </div>
          </div>
          <div>
            <span className="text-xs text-gray-500">組織力係数</span>
            <div className="flex items-baseline gap-1">
              <span
                className={`text-xl font-bold ${
                  organizationFactor >= 1.2 ? "text-green-400" : "text-red-400"
                }`}
              >
                {organizationFactor.toFixed(1)}×
              </span>
              {organizationFactor >= 1.2 ? (
                <CheckCircle2 size={16} className="text-green-400" />
              ) : (
                <AlertTriangle size={16} className="text-red-400" />
              )}
            </div>
          </div>
        </div>

        {/* ステージ維持条件 */}
        <div className="pt-4 border-t border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">ステージ維持条件</span>
            {meetsThreshold ? (
              <CheckCircle2 size={16} className="text-green-400" />
            ) : (
              <AlertTriangle size={16} className="text-red-400" />
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-white">
              ¥{companyMarketCap.toLocaleString()}
            </span>
            <span className="text-xs text-gray-500">/</span>
            <span
              className={`text-sm font-semibold ${
                meetsThreshold ? "text-green-400" : "text-red-400"
              }`}
            >
              ¥{requiredMarketCap.toLocaleString()}
            </span>
          </div>
          {!meetsThreshold && (
            <p className="text-xs text-red-400 mt-1">
              {userCompany.daysBelowThreshold}日連続で条件未達成（3日で倒産）
            </p>
          )}
        </div>
      </div>

      {/* 社員のノルマ達成状況 */}
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
        <div className="flex items-center gap-2 mb-3">
          <Users size={18} className="text-gray-400" />
          <h4 className="text-sm font-semibold text-white">社員のノルマ達成状況</h4>
        </div>
        <div className="space-y-2">
          {userCompany.members.map((member) => {
            const quotaMet = member.givenRespectsToday >= 3;
            return (
              <div
                key={member.userId}
                className="flex items-center justify-between p-2 bg-black rounded-lg"
              >
                <span className="text-sm text-white">{member.userName}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {member.givenRespectsToday}/3
                  </span>
                  {quotaMet ? (
                    <CheckCircle2 size={16} className="text-green-400" />
                  ) : (
                    <AlertTriangle size={16} className="text-red-400" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {quotaFailures > 0 && (
          <p className="text-xs text-red-400 mt-3">
            {quotaFailures}名がノルマ未達成のため、組織力係数が0.8倍に低下しています
          </p>
        )}
      </div>

      {/* ステージ情報 */}
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
        <h4 className="text-sm font-semibold text-white mb-3">ステージ情報</h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-500">最大社員数</span>
            <span className="text-white">
              {STAGE_THRESHOLDS[userCompany.stage].maxMembers === Infinity
                ? "無制限"
                : `${STAGE_THRESHOLDS[userCompany.stage].maxMembers}名`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">現在の社員数</span>
            <span className="text-white">{userCompany.members.length}名</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">出資金</span>
            <span className="text-white">¥{userCompany.lockedCapital.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

