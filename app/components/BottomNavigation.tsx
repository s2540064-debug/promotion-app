"use client";

import { Home, Search, Plus, Bell, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NotificationBadge from "./NotificationBadge";

const navItems = [
  { icon: Home, label: "市場", href: "/" },
  { icon: Search, label: "検索", href: "/search" },
  { icon: Plus, label: "IR", href: "/post" },
  { icon: Bell, label: "通知", href: "/notifications" },
  { icon: User, label: "銘柄", href: "/profile" },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-t border-gray-800">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors relative ${
                isActive
                  ? "text-[#D4AF37]"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <div className="relative">
                <Icon size={22} />
                {item.href === "/notifications" && <NotificationBadge />}
              </div>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

