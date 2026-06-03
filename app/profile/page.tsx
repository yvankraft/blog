import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MessageCircle, Trash2 } from "lucide-react";
import { prisma } from "@/app/lib/db";
import ProfileActions from "./ProfileActions";
import { deletePostAction } from "@/app/lib/actions";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect("/login");
  }

  const userPosts = await prisma.post.findMany({
    where: {
      authorId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-6 md:p-8 bg-gray-50/50 dark:bg-zinc-900/20 backdrop-blur">
      <div className="min-h-screen justify-center bg-white dark:bg-black text-black dark:text-white antialiased p-8 md:p-16">
        <div className="max-w-2xl mx-auto space-y-4 md:space-y-6">
          {/* Navigation / Header */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-2">
              <MessageCircle size={18} className="text-gray-400" />
              <h3 className="font-medium tracking-tight text-sm text-gray-500 dark:text-gray-400">
                Les Talk / Profile
              </h3>
            </div>
            <Link
              href="/"
              className="text-xs border border-gray-200 dark:border-gray-800 rounded-md px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-900 transition font-medium"
            >
              Back to Home
            </Link>
          </div>

          {/* Section Photos */}
          <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-4 bg-gray-50/50 dark:bg-zinc-900/20 backdrop-blur">
            <div className="relative w-full h-48 md:h-64 bg-zinc-100 dark:bg-zinc-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
              {user.coverImage ? (
                <img
                  src={user.coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-orange-400 to-orange-600 opacity-20" />
              )}

              <button className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white text-[11px] font-medium px-3 py-1.5 rounded-xl transition">
                Change Cover
              </button>
            </div>

            <div className="px-4 -mt-16 relative z-10 flex items-end justify-between">
              <div className="relative w-32 h-32 rounded-3xl border-4 border-white dark:border-black bg-white dark:bg-zinc-900 overflow-hidden shadow-xl group">
                <img
                  src={
                    user.image ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff&bold=true`
                  }
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
                <button className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition duration-200">
                  Update
                </button>
              </div>

              <div className="mb-2 hidden sm:block">
                <h2 className="text-lg font-bold leading-none">{user.name}</h2>
                <p className="text-xs text-gray-400">
                  @{user.username || "user"}
                </p>
              </div>
            </div>
          </div>
          {/* Section Publications */}
          <div className="mt-12">
            <h2 className="font-medium text-lg tracking-tight mb-4">
              Your Publications
            </h2>

            {userPosts.length === 0 ? (
              <div className="border border-dashed border-gray-200 dark:border-gray-800 rounded-xl p-8 text-center text-xs text-gray-400 dark:text-gray-500">
                You haven't published any posts yet.
              </div>
            ) : (
              <div className="space-y-4">
                {userPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={async () => {
                      "use server";
                      await deletePostAction({ postId: post.id });
                    }}
                    className="flex items-center justify-between border border-gray-200 dark:border-gray-800 rounded-xl p-4 bg-zinc-50/30 dark:bg-zinc-900/10 cursor-pointer transition-all duration-200 hover:border-red-500/40 hover:bg-red-500/[0.02] group"
                  >
                    <div>
                      <h3 className="font-semibold text-base group-hover:text-red-500 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="p-2 text-zinc-400 group-hover:text-red-500 group-hover:bg-red-500/10 rounded-xl transition-all">
                      <Trash2 size={16} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Profile Card / Settings */}
          <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-6 md:p-8 bg-gray-50/50 dark:bg-zinc-900/20 backdrop-blur">
            <h1 className="font-semibold text-2xl tracking-tight mb-6">
              Settings
            </h1>
            <ProfileActions user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
