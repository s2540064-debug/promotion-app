"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send } from "lucide-react";
import { getComments, addComment, getCommentCount, type Comment } from "../utils/comments";
import { useMarket } from "../contexts/MarketContext";

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const { userProfile } = useMarket();
  const [isOpen, setIsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    const loadComments = () => {
      const loadedComments = getComments(postId);
      setComments(loadedComments);
      setCommentCount(getCommentCount(postId));
    };

    loadComments();
  }, [postId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = addComment(
      postId,
      "current_user",
      userProfile.name,
      commentText.trim()
    );

    setComments([...comments, newComment]);
    setCommentCount(commentCount + 1);
    setCommentText("");
  };

  return (
    <div>
      {/* コメントアイコンとカウント */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-300 transition-colors"
      >
        <MessageCircle size={12} />
        <span>{commentCount}</span>
      </button>

      {/* アコーディオン展開 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 pt-2 border-t border-gray-800">
              {/* コメント入力欄 */}
              <form onSubmit={handleSubmit} className="mb-2">
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="コメント..."
                    className="flex-1 bg-black border border-gray-800 rounded px-2 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]/50"
                  />
                  <button
                    type="submit"
                    disabled={!commentText.trim()}
                    className="px-2 py-1.5 bg-[#D4AF37]/20 text-[#D4AF37] rounded hover:bg-[#D4AF37]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send size={12} />
                  </button>
                </div>
              </form>

              {/* コメント履歴 */}
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {comments.length === 0 ? (
                  <p className="text-[10px] text-gray-500 text-center py-1.5">
                    コメントはまだありません
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="bg-black/50 rounded p-1.5 border border-gray-800"
                    >
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-semibold text-[#D4AF37]">
                          {comment.userName}
                        </span>
                        <span className="text-[9px] text-gray-500">
                          {new Date(comment.timestamp).toLocaleTimeString("ja-JP", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-300 leading-relaxed">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

