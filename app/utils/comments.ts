// コメント管理ユーティリティ

const STORAGE_KEY = 'promotion_comments';

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: number;
}

export function getComments(postId: string): Comment[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const allComments: Comment[] = JSON.parse(stored);
      return allComments.filter((c) => c.postId === postId);
    }
  } catch (error) {
    console.error('Failed to load comments:', error);
  }
  
  return [];
}

export function addComment(postId: string, userId: string, userName: string, content: string): Comment {
  if (typeof window === 'undefined') {
    // SSR用のダミー
    return {
      id: '',
      postId,
      userId,
      userName,
      content,
      timestamp: Date.now(),
    };
  }
  
  const comment: Comment = {
    id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    postId,
    userId,
    userName,
    content,
    timestamp: Date.now(),
  };
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const allComments: Comment[] = stored ? JSON.parse(stored) : [];
    allComments.push(comment);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allComments));
  } catch (error) {
    console.error('Failed to save comment:', error);
  }
  
  return comment;
}

export function getCommentCount(postId: string): number {
  return getComments(postId).length;
}

