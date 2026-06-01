"use server";

import { prisma } from "./db";
import { auth } from "./auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createPostAction({
  title,
  content,
  mediaUrl,
  mediaType,
}: {
  title: string;
  content?: string | null;
  mediaUrl?: string | null;
  mediaType?: "IMAGE" | "VIDEO" | null;
}) {
  //verifions si l'utilisateur est connecté
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || !session.user) {
    throw new Error("Unauthorized! You must be logged in to create a post.");
  }

  //créons le post dans la base de données
  try {
    const newPost = await prisma.post.create({
      data: {
        title: title,
        content: content || "",
        mediaUrl: mediaUrl || "",
        mediaType: mediaType || undefined,
        authorId: session.user.id,
      },
    });
    revalidatePath("/");
    return { success: true, post: newPost };
  } catch (error: any) {
    console.error("Error creating post:", error);
    return { success: false, error: "Failed to create post" };
  }
}

export async function toggleLikeAction({ postId }: { postId: string }) {
  //verifions si l'utilisateur est connecté
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !session.user) {
    return {
      success: false,
      error: "Unauthorized! You must be logged in to like a post.",
    };
  }

  const userId = session.user.id;

  try {
    // Vérifions si l'utilisateur a déjà liké le post
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      // Si le like existe déjà, supprimons-le (unlike)
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      // Sinon, créons un nouveau like
      await prisma.like.create({
        data: {
          userId,
          postId,
        },
      });
    }
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error toggling like:", error);
    throw new Error("Failed to toggle like");
  }
}
