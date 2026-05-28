"use client";
import { Tooltip } from "./Tooltip";
import Link from "next/link";
import { authClient } from "@/app/api/lib/auth-client";
import { User } from "lucide-react";

export default function Navbar() {
  // Hook client de Better-Auth qui écoute la session en temps réel
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="w-20 h-8 bg-gray-100 dark:bg-zinc-900 animate-pulse rounded-lg" />
    );
  }
  return (
    <nav className="fixed m-2  top-0 left-0 right-0 mx-auto max-w-400 bg-white flex items-center justify-between border-b-white dark:border-b-white/10 dark:bg-black  dark:shadow-gray-800">
      <div className="flex items-center justify-around space-x-4 px-4 py-2 ">
        <Tooltip text="go to home">
          <Link href="/">
            <h1 className="text-3xl text-[#475569] dark:text-[#f8fafc] font-bold box cursor-pointer">
              Les Talk
            </h1>
          </Link>
        </Tooltip>
        <Tooltip text="search">
          <input
            type="text"
            placeholder="search... ?"
            className=" bg-white/30 dark:bg-black/10 border-gray-200 shadow-sm dark:shadow-gray-800 focus:ring-2 rounded-2xl content-evenly max-w-2xs py-2 px-4 focus:outline-none focus:ring-gray-500 transition duration-300 "
          />
        </Tooltip>
      </div>
      <div>
        <ul className="flex space-x-4 px-4 py-2">
          <Tooltip text="go to home">
            <li>
              <Link
                href="/"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition duration-300"
              >
                Home
              </Link>
            </li>
          </Tooltip>
          <Tooltip text="go to blog">
            <li>
              <Link
                href="/blog"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition duration-300"
              >
                Blog
              </Link>
            </li>
          </Tooltip>

          {/* ✅ N'affiche l'accès à la création de post que si l'utilisateur est connecté */}
          {session && (
            <Tooltip text="go to chat">
              <li>
                <Link
                  href="/chat"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition duration-300"
                >
                  chat
                </Link>
              </li>
            </Tooltip>
          )}
        </ul>
      </div>

      <div className="flex space-x-4 px-4 py-2 items-center">
        {session ? (
          // ✅ Si l'utilisateur est connecté, on affiche le lien vers son profil
          <Tooltip text="View Profile">
            <Link
              href="/profile"
              className="flex items-center gap-2 text-sm font-medium border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
            >
              <User size={18} className="text-gray-400" />
              {session.user.name}
            </Link>
          </Tooltip>
        ) : (
          // ❌ Si l'utilisateur n'est pas connecté, on montre les boutons Login / Sign Up
          <>
            <Tooltip text="Login">
              <Link href="/login" className="btn-primary inline-block">
                Login
              </Link>
            </Tooltip>
            <Tooltip text="Sign Up">
              <Link href="/signup" className="btn-secondary inline-block">
                Sign Up
              </Link>
            </Tooltip>
          </>
        )}
      </div>
    </nav>
  );
}
