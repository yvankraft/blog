import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { prisma } from "@/app/lib/db";
import ProfileActions from "./ProfileActions";

export default async function ProfilePage() {
  // Récupération de la session sur le serveur
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { user } = session;

  // Récupération des publications de cet utilisateur
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
        <div className="max-w-2xl mx-auto">
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

          {/* Profile Card */}
          <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-6 md:p-8 bg-gray-50/50 dark:bg-zinc-900/20 backdrop-blur">
            <h1 className="font-semibold text-3xl tracking-tight mb-8">
              Account Details
            </h1>

            {/* Composant client injecté avec les données utilisateur en props */}
            <ProfileActions user={user} />
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
                    className="border border-gray-200 dark:border-gray-800 rounded-xl p-4"
                  >
                    <h3 className="font-semibold text-base">{post.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
