"use client";

import { useEffect, useState } from "react";
import { ThumbsUp } from "lucide-react";
import { toggleLikeAction } from "@/app/lib/actions";

interface LikeButtonProps {
  postId: string;
  initialLikesCount: number;
  initialHasLiked: boolean;
}

export default function LikeButton({
  postId,
  initialLikesCount,
  initialHasLiked,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialHasLiked);
  const [count, setCount] = useState(initialLikesCount);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);

    // 1. Calculer les futurs états à l'avance
    const nextLiked = !liked;
    const nextCount = liked ? count - 1 : count + 1;

    // 2. Mise à jour optimiste immédiate
    setLiked(nextLiked);
    setCount(nextCount);

    try {
      // 3. Appel de la Server Action en tâche de fond
      const res = await toggleLikeAction({ postId });

      // Si le serveur renvoie un état différent (ex: erreur), on synchronise
      if (!res.success) {
        setLiked(liked);
        setCount(count);
      }
    } catch (error) {
      // En cas de crash réseau, on remet l'ancien état
      setLiked(liked);
      setCount(count);
    } finally {
      setLoading(false);
    }
  };
  // 🔄 Synchronise l'état local dès que le serveur envoie de nouvelles données (grâce à revalidatePath)
  useEffect(() => {
    setLiked(initialHasLiked);
    setCount(initialLikesCount);
  }, [initialHasLiked, initialLikesCount]);

  return (
    <div className=" bg-zinc-400 px-4 py-2 rounded-2xl active:scale-95 dark:bg-zinc-900/40 flex justify-center items-center pt-3 gap-2 select-none border-r border-zinc-100 dark:border-zinc-900/50">
      <button
        onClick={handleLike}
        className={`p-1 rounded transition ${
          liked
            ? "text-blue-500 bg-blue-500/10 dark:bg-blue-500/20 z-10"
            : "text-zinc-400 hover:text-blue-500   dark:hover:text-blue-500 z-10"
        }`}
      >
        <ThumbsUp
          size={22}
          className={`text-zinc-800 dark:text-zinc-200 z-10 ${
            liked ? "fill-current text-blue-500" : "fill-none"
          } `}
        />
      </button>

      <span
        className={`text-sm font-bold z-10 ${liked ? "text-blue-500" : "text-zinc-900 dark:text-zinc-300"}`}
      >
        {count}
      </span>
    </div>
  );
}
