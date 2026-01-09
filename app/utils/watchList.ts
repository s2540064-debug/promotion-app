// フォロー（WATCH）リスト管理ユーティリティ

const STORAGE_KEY = 'promotion_watch_list';

export interface WatchItem {
  userId: string;
  userName: string;
  watchedAt: number;
}

export function getWatchList(): WatchItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load watch list:', error);
  }
  
  return [];
}

export function addToWatchList(userId: string, userName: string): void {
  if (typeof window === 'undefined') return;
  
  const watchList = getWatchList();
  
  // 既に追加されている場合は何もしない
  if (watchList.some((item) => item.userId === userId)) {
    return;
  }
  
  watchList.push({
    userId,
    userName,
    watchedAt: Date.now(),
  });
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchList));
  } catch (error) {
    console.error('Failed to save watch list:', error);
  }
}

export function removeFromWatchList(userId: string): void {
  if (typeof window === 'undefined') return;
  
  const watchList = getWatchList();
  const filtered = watchList.filter((item) => item.userId !== userId);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to remove from watch list:', error);
  }
}

export function isWatching(userId: string): boolean {
  const watchList = getWatchList();
  return watchList.some((item) => item.userId === userId);
}

