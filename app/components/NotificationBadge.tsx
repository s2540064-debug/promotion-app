"use client";

import { useEffect, useState } from "react";
import { getUnreadCount } from "../utils/notifications";

export default function NotificationBadge() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      setUnreadCount(getUnreadCount());
    };

    updateCount();
    const interval = setInterval(updateCount, 5000); // 5秒ごとに更新

    return () => clearInterval(interval);
  }, []);

  if (unreadCount === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-black">
      {unreadCount > 9 ? "9+" : unreadCount}
    </span>
  );
}

