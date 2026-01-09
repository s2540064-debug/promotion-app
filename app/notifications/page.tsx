"use client";

import { useState, useEffect } from "react";
import BottomNavigation from "../components/BottomNavigation";
import NotificationCard from "../components/NotificationCard";
import NotificationTabs, { type NotificationTab } from "../components/NotificationTabs";
import {
  loadNotifications,
  markAsRead,
  markAllAsRead,
  type Notification,
} from "../utils/notifications";
import { Check } from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<NotificationTab>("market");

  useEffect(() => {
    const loaded = loadNotifications();
    setNotifications(loaded);
  }, []);

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
      setNotifications(loadNotifications());
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    setNotifications(loadNotifications());
  };

  // タブでフィルタリング
  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "market") {
      return n.type === "investment" || n.type === "promotion";
    } else {
      return n.type === "human";
    }
  });

  const marketNotifications = notifications.filter(
    (n) => n.type === "investment" || n.type === "promotion"
  );
  const humanNotifications = notifications.filter((n) => n.type === "human");

  const unreadMarketCount = marketNotifications.filter((n) => !n.isRead).length;
  const unreadHumanCount = humanNotifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-black pb-20">
      <header className="sticky top-0 z-40 bg-black border-b border-gray-800 backdrop-blur-sm bg-black/95 shadow-lg">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-[#D4AF37]"></div>
              <h1 className="text-xl font-bold text-white uppercase tracking-wider">
                Market News
              </h1>
            </div>
            {filteredNotifications.some((n) => !n.isRead) && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-lg hover:border-[#D4AF37]/50 transition-colors"
              >
                <Check size={14} className="text-gray-400" />
                <span className="text-xs text-gray-400 font-semibold">すべて既読</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* タブ */}
        <NotificationTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          marketCount={unreadMarketCount}
          humanCount={unreadHumanCount}
        />

        {/* 通知リスト */}
        {filteredNotifications.length === 0 ? (
          <div className="text-center mt-12">
            <p className="text-gray-500 text-sm">通知がありません</p>
            <p className="text-gray-600 text-xs mt-2">
              {activeTab === "market"
                ? "市場関連の通知が表示されます"
                : "人間的な交流の通知が表示されます"}
            </p>
          </div>
        ) : (
          <div>
            {filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onClick={() => handleNotificationClick(notification)}
              />
            ))}
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}

