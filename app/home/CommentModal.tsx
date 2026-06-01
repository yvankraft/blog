"use client";

import { useState } from "react";
import { createCommentAction } from "@/app/lib/actions";
import { X, Send } from "lucide-react";
import { createPortal } from "react-dom";

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    name: string;
    image: string | null;
    username: string;
  };
}

interface CommentModalProps {
  postId: string;
  postTitle: string;
  initialComments: Comment[];
  isOpen: boolean;
  onClose: () => void;
}

export default function CommentModal({
  postId,
  postTitle,
  initialComments,
  isOpen,
  onClose,
}: CommentModalProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || loading) return;

    setLoading(true);
    try {
      const res = await createCommentAction({ postId, content: text });
      if (res.success && res.comment) {
        setComments([res.comment as any, ...comments]);
        setText("");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Conteneur de la Modal */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header de la Modal */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
              Comments
            </h3>
            <p className="text-xs text-zinc-400 line-clamp-1">
              On: {postTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Zone de défilement des commentaires */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
          {comments.length === 0 ? (
            <p className="text-xs text-zinc-400 text-center py-8">
              No comments yet. Be the first to reply!
            </p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="flex gap-2.5 items-start text-sm"
              >
                <img
                  src={
                    comment.author.image ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author.name)}&background=random&color=color=fff&bold=true`
                  }
                  alt={comment.author.name}
                  className="w-7 h-7 min-w-[28px] min-h-[28px] shrink-0 rounded-full object-cover"
                />
                <div className="flex-1 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/40 p-2.5 rounded-2xl">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-bold text-xs text-zinc-800 dark:text-zinc-200">
                      {comment.author.name}
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      @{comment.author.username}
                    </span>
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-300 text-xs leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Formulaire d'envoi en bas */}
        <form
          onSubmit={handleSubmit}
          className="p-4 bg-zinc-50 dark:bg-zinc-900/40 border-t border-zinc-100 dark:border-zinc-800 flex gap-2 items-center"
        >
          <input
            type="text"
            placeholder="Write a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
            className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-500 text-zinc-900 dark:text-zinc-100"
          />
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="p-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition active:scale-95 disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>,
    document.body,
  );
}
