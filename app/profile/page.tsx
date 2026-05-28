import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MessageCircle, User, Mail, Calendar } from "lucide-react";
import { prisma } from "@/app/lib/db"; //
import ProfileActions from "./ProfileActions"; // Import du composant pour les actions de profil

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { user } = session;

  // recuperation manuellement des posts de cet utilisateur depuis la base de données
  const userPosts = await prisma.post.findMany({
    where: {
      authorId: user.id, // Ajustez le nom du champ selon votre modèle (ex: userId ou authorId)
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
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

          <div className="space-y-6">
            <div className="flex items-center gap-4 border-b border-gray-100 dark:border-gray-900 pb-4 active:scale-95 transition hover:cursor-pointer">
              <User size={18} className="text-gray-400" />
              <div>
                <p className="text-[11px] uppercase tracking-widest text-gray-400 font-medium ">
                  Username
                </p>

                <p className="text-sm font-medium mt-0.5">
                  {user.username || user.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-b border-gray-100 dark:border-gray-900 pb-4 active:scale-95 transition hover:cursor-pointer">
              <Mail size={18} className="text-gray-400" />
              <div>
                <p className="text-[11px] uppercase tracking-widest text-gray-400 font-medium">
                  Email Address
                </p>

                <p className="text-sm font-medium mt-0.5">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pb-2 ">
              <Calendar size={18} className="text-gray-400" />
              <div>
                <p className="text-[11px] uppercase tracking-widest text-gray-400 font-medium">
                  Joined
                </p>
                <p className="text-sm font-medium mt-0.5">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
          <ProfileActions />
        </div>

        {/* Section Publications mise à jour avec les vraies données */}
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
  );
}
