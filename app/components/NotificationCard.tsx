"use client";

import { TrendingUp, Heart, Trophy } from "lucide-react";
import { type Notification } from "../utils/notifications";

interface NotificationCardProps {
  notification: Notification;
  onClick?: () => void;
}

export default function NotificationCard({
  notification,
  onClick,
}: NotificationCardProps) {
  const getIcon = () => {
    switch (notification.type) {
      case "investment":
        return <TrendingUp size={20} className="text-green-400" />;
      case "human":
        return <Heart size={20} className="text-pink-400" />;
      case "promotion":
        return <Trophy size={20} className="text-[#D4AF37]" />;
      default:
        return null;
    }
  };

  const getIconBg = () => {
    switch (notification.type) {
      case "investment":
        return "bg-green-500/20 border-green-500/30";
      case "human":
        return "bg-pink-500/20 border-pink-500/30";
      case "promotion":
        return "bg-[#D4AF37]/20 border-[#D4AF37]/30";
      default:
        return "bg-gray-500/20 border-gray-500/30";
    }
  };

  return (
    <div
      onClick={onClick}
      className={`bg-gray-900 rounded-lg p-4 border mb-3 cursor-pointer transition-all hover:border-[#D4AF37]/50 hover:shadow-lg hover:bg-gray-800/50 ${
        notification.isRead
          ? "border-gray-800 opacity-70"
          : "border-gray-700 bg-gray-900"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* アイコン */}
        <div
          className={`p-3 rounded-lg border ${getIconBg()} flex-shrink-0 shadow-lg`}
        >
          {getIcon()}
        </div>

        {/* コンテンツ */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider font-mono">
                  {notification.title}
                </span>
                {!notification.isRead && (
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                )}
              </div>
              <p className="text-sm text-gray-200 leading-relaxed">
                {notification.message}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-800">
            <span className="text-xs text-gray-500 font-mono">
              {notification.timestamp}
            </span>
            {notification.userName && (
              <span className="text-xs text-gray-400 font-semibold">
                by {notification.userName}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

