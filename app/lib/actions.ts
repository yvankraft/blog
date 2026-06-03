"use server";

import { prisma } from "./db";
import { auth } from "./auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

// Action pour créer un nouveau post
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

// Action pour liker ou unliker un post
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

// Action pour commenter un post
export async function createCommentAction({
  postId,
  content,
}: {
  postId: string;
  content: string;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !session.user) {
    return { success: false, error: "Unauthorized" };
  }

  if (!content.trim()) {
    return { success: false, error: "Comment cannot be empty" };
  }

  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: session.user.id,
      },
      include: {
        author: true, // Pour renvoyer les infos de l'auteur immédiatement
      },
    });

    revalidatePath("/");
    return { success: true, comment: newComment };
  } catch (error) {
    console.error("Error creating comment:", error);
    return { success: false, error: "Database error" };
  }
}

// Action pour supprimer un post
export async function deletePostAction({ postId }: { postId: string }) {
  //verifions si l'utilisateur est connecté
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !session.user) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    // Vérifions si le post existe et appartient à l'utilisateur
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return { success: false, error: "Post not found" };
    }

    if (post.authorId !== session.user.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Supprimons le post
    await prisma.post.delete({
      where: { id: postId },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting post:", error);
    return { success: false, error: "Database error" };
  }
}

// Action pour updater la photo de profil
export async function updateProfilePictureAction({
  type,
  url,
}: {
  type: "profilePicture" | "coverPhoto";
  url: string;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !session.user) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const dataToUpdate =
      type === "profilePicture" ? { profilePicture: url } : { coverPhoto: url };

    await prisma.user.update({
      where: { id: session.user.id },
      data: dataToUpdate,
    });
    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Error updating profile picture:", error);
    return { success: false, error: "Database error" };
  }
}

//actions pour stockage des preferences de l'utilisateur
export async function savePreferencesAction({ tags }: { tags: string[] }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !session.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.userPreference.upsert({
      where: { userId: session.user.id },
      update: { tags },
      create: {
        userId: session.user.id,
        tags,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error saving preferences:", error);
    return { success: false, error: "Database error" };
  }
}
