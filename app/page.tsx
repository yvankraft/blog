import Navbar from "./components/Navbar";
import FirstSideMenu from "./home/firstSideMenu";
import AddPost from "./home/addPost";
import { prisma } from "@/app/lib/db";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Share2, MoreHorizontal, ThumbsUp } from "lucide-react";
import LikeButton from "./home/LikeBuuton";
import Commentaires from "./home/Commentaires";

export const dynamic = "force-dynamic";

// Fonction pour récupérer les posts depuis la base de données
async function getPosts(currentUserId?: string) {
  return await prisma.post.findMany({
    orderBy: {
      createdAt: "desc", // Les plus récents en premier
    },
    include: {
      author: true,
      _count: { select: { comments: true, likes: true } },
      // On vérifie si un like existe pour cet utilisateur précis
      likes: currentUserId ? { where: { userId: currentUserId } } : false,
      // Inclure les commentaires avec leurs auteurs pour le rendu de la section de commentaires
      comments: {
        orderBy: { createdAt: "desc" },
        include: { author: true },
      },
    },
  });
}

//fonction pour liker un post
async function likePost(postId: string) {
  //verifions si l'utilisateur est connecté
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("You must be logged in to like a post");
    redirect("/login");
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
    console.error("Error liking post:", error);
    throw new Error("Failed to like post");
  }
}

export default async function Page() {
  const posts = await getPosts();
  return (
    // Fond slate-50 (clair) qui devient #0d0e12 (sombre)
    <div className="h-screen w-full bg-slate-50 dark:bg-[#0d0e12] text-zinc-900 dark:text-white flex overflow-hidden p-3 md:p-4 gap-4 antialiased">
      <FirstSideMenu />

      <div className="relative flex-1 min-h-0 flex flex-col">
        <Navbar />

        {/* Zone de contenu sous la Navbar */}
        <div className="flex-1 min-h-0 flex gap-4 overflow-hidden">
          {/* Le flux central défilant */}
          <main className="flex-1 min-h-0 bg-white dark:bg-[#1c1d22] border border-gray-50 dark:border-zinc-800/40 rounded-3xl p-6 overflow-y-auto scrollbar-none">
            <h1 className="text-2xl font-bold tracking-tight">Home Timeline</h1>
            {posts.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                <p className="text-zinc-500 text-sm font-medium">
                  No talks here yet. Start the conversation!
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-8 mt-4">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="flex p-4 bg-white dark:bg-zinc-900 border border-zinc-50 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden hover:shadow-md hover:shadow-gray-300 dark:hover:shadow-zinc-600 hover:scale-101 transition"
                  >
                    {/* Right Side: Main Content Box */}
                    <div className="flex-1 p-3 flex flex-col justify-between">
                      <div>
                        {/* Community/Author Header */}
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-zinc-800 dark:text-zinc-200 hover:underline cursor-pointer">
                              t/general
                            </span>

                            <span className="text-zinc-400">•</span>
                            <span className="text-zinc-500">
                              Posted by @{post.author.username || "user"}
                            </span>
                            <span className="text-zinc-400">
                              {new Date(post.createdAt).toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric" },
                              )}
                            </span>
                          </div>
                          <button className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded p-1">
                            <MoreHorizontal size={16} />
                          </button>
                        </div>

                        {/* Title & Body */}
                        <div className="space-y-1">
                          <h2 className="text-base font-medium text-zinc-950 dark:text-zinc-50 leading-tight">
                            {post.title}
                          </h2>
                          {post.content && (
                            <p className="text-sm text-zinc-600 dark:text-zinc-300 font-normal leading-relaxed">
                              {post.content}
                            </p>
                          )}
                        </div>

                        {/* Media Frame */}
                        {post.mediaUrl && (
                          <div className="mt-3 relative w-full aspect-video border-b border-zinc-200 dark:border-zinc-800  overflow-hidden bg-none">
                            {post.mediaType === "IMAGE" ? (
                              <img
                                src={post.mediaUrl}
                                alt="Media"
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <video
                                autoPlay
                                loop
                                src={post.mediaUrl}
                                controls
                                className="w-full h-full object-contain"
                              />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Footer Action Strip */}
                      <div className="mt-4 flex items-center gap-1 text-zinc-500 dark:text-zinc-400 font-bold text-xs">
                        <LikeButton
                          postId={post.id}
                          initialLikesCount={post._count.likes}
                          initialHasLiked={
                            post.likes ? post.likes.length > 0 : false
                          }
                        />
                        <Commentaires
                          postId={post.id}
                          postTitle={post.title}
                          initialComments={post.comments}
                          commentsCount={post._count.comments}
                        />

                        <button className="flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-2 py-1.5 rounded transition">
                          <Share2 size={16} />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
            <AddPost />
          </main>

          {/* Les recommandations à droite du flux */}
          <div className="hidden lg:block w-72 bg-white dark:bg-[#1c1d22] border border-slate-200/80 dark:border-zinc-800/40 rounded-3xl p-6">
            <h1 className="text-lg font-bold tracking-tight mb-2 text-zinc-900 dark:text-white">
              Recommended
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              You probably know this person.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
