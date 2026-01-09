// 通知システムのユーティリティ

export type NotificationType = "investment" | "human" | "promotion";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  userId?: string;
  userName?: string;
}

const STORAGE_KEY = 'promotion_notifications';

// ダミーデータ
const DUMMY_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "investment",
    title: "[CAPITAL IN]",
    message: "田中太郎氏があなたの活動に投資を実行しました",
    timestamp: "2分前",
    isRead: false,
    userId: "user1",
    userName: "田中太郎",
  },
  {
    id: "2",
    type: "human",
    title: "[INSIGHT]",
    message: "佐藤花子氏があなたのリスク要因（朝が苦手）を分析し、共感を送りました",
    timestamp: "15分前",
    isRead: false,
    userId: "user2",
    userName: "佐藤花子",
  },
  {
    id: "3",
    type: "promotion",
    title: "[PROMOTION]",
    message: "あなたの時価総額が上昇し、役職が「課長」に昇進しました",
    timestamp: "1時間前",
    isRead: false,
  },
  {
    id: "4",
    type: "investment",
    title: "[CAPITAL IN]",
    message: "鈴木一郎氏があなたの活動に投資を実行しました",
    timestamp: "2時間前",
    isRead: true,
    userId: "user3",
    userName: "鈴木一郎",
  },
  {
    id: "5",
    type: "human",
    title: "[CONNECTION]",
    message: "山田美咲氏があなたの動力源（サウナ）に興味を示しました",
    timestamp: "3時間前",
    isRead: false,
    userId: "user4",
    userName: "山田美咲",
  },
  {
    id: "6",
    type: "investment",
    title: "[CAPITAL IN]",
    message: "高橋健太氏があなたの活動に投資を実行しました",
    timestamp: "5時間前",
    isRead: true,
    userId: "user5",
    userName: "高橋健太",
  },
  {
    id: "7",
    type: "human",
    title: "[INSIGHT]",
    message: "渡辺さくら氏があなたのパーソナルタグ（努力家）に共感しました",
    timestamp: "1日前",
    isRead: false,
    userId: "user6",
    userName: "渡辺さくら",
  },
  {
    id: "8",
    type: "promotion",
    title: "[MARKET UPDATE]",
    message: "あなたの時価総額が10%上昇しました",
    timestamp: "1日前",
    isRead: true,
  },
];

export function loadNotifications(): Notification[] {
  if (typeof window === 'undefined') return DUMMY_NOTIFICATIONS;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load notifications:', error);
  }
  
  return DUMMY_NOTIFICATIONS;
}

export function saveNotifications(notifications: Notification[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  } catch (error) {
    console.error('Failed to save notifications:', error);
  }
}

export function getUnreadCount(): number {
  const notifications = loadNotifications();
  return notifications.filter((n) => !n.isRead).length;
}

export function markAsRead(notificationId: string): void {
  const notifications = loadNotifications();
  const updated = notifications.map((n) =>
    n.id === notificationId ? { ...n, isRead: true } : n
  );
  saveNotifications(updated);
}

export function markAllAsRead(): void {
  const notifications = loadNotifications();
  const updated = notifications.map((n) => ({ ...n, isRead: true }));
  saveNotifications(updated);
}

