"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import CommentModal from "./CommentModal";

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

interface CommentSectionProps {
  postId: string;
  postTitle: string; // 💡 Ajouté pour l'en-tête de la modal
  initialComments: Comment[];
  commentsCount: number;
}

export default function CommentSection({
  postId,
  postTitle,
  initialComments,
  commentsCount,
}: CommentSectionProps) {
  // L'état gère maintenant uniquement l'ouverture/fermeture de la modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Bouton d'ouverture de la section (Reste sur la ligne des boutons sans rien décaler) */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-3 py-1.5 rounded-xl transition text-xs font-bold text-zinc-500 dark:text-zinc-400"
      >
        <MessageSquare size={16} />
        <span>{commentsCount} Comments</span>
      </button>

      {/* La Modal Flottante (Injected directement au body, aucun impact sur le layout) */}
      <CommentModal
        postId={postId}
        postTitle={postTitle}
        initialComments={initialComments}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
