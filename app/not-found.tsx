"use client";
import Link from "next/link";
import { Compass, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    // Fond global adaptatif identique à la Home Page
    <div className="h-screen w-full bg-slate-50 dark:bg-[#0d0e12] text-zinc-900 dark:text-white flex items-center justify-center p-4 antialiased">
      {/* Boîte centrale style Ronas IT */}
      <div className="max-w-md w-full bg-white dark:bg-[#1c1d22] border border-slate-200/80 dark:border-zinc-800/40 rounded-3xl p-8 md:p-10 shadow-sm flex flex-col items-center text-center">
        {/* Zone Icône Graphique */}
        <div className="relative mb-6">
          <div className="w-16 h-16 bg-slate-100 dark:bg-zinc-800 border border-slate-200/50 dark:border-zinc-700/30 rounded-2xl flex items-center justify-center text-zinc-600 dark:text-zinc-300">
            <Compass size={32} className="animate-spin-slow" />
          </div>
          {/* Pastille colorée du projet en haut à droite */}
          <span className="absolute -top-1 -right-1 block h-3.5 w-3.5 rounded-full ring-4 ring-white dark:ring-[#1c1d22] bg-[#d4f96d]" />
        </div>

        {/* Code et Titre */}
        <span className="text-xs font-mono bg-slate-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-2.5 py-1 rounded-full mb-4">
          Error 404
        </span>

        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">
          Lost in Space
        </h1>

        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs leading-relaxed mb-8">
          The page you are looking for doesn't exist or has been moved to
          another coordinate on Les Talk.
        </p>

        {/* Actions */}
        <div className="w-full flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 text-xs font-bold px-5 py-3 bg-[#d4f96d] hover:bg-[#c2e65b] text-black rounded-2xl flex items-center justify-center gap-2 transition duration-200"
          >
            <Home size={16} />
            Back to Home
          </Link>

          <button
            onClick={() =>
              typeof window !== "undefined" && window.history.back()
            }
            className="flex-1 text-xs font-semibold px-5 py-3 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-2xl flex items-center justify-center gap-2 transition duration-200"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
