import Navbar from "./components/Navbar";
import FirstSideMenu from "./home/firstSideMenu";
import AddPost from "./home/addPost";

export default function Page() {
  return (
    // Fond slate-50 (clair) qui devient #0d0e12 (sombre)
    <div className="h-screen w-full bg-slate-50 dark:bg-[#0d0e12] text-zinc-900 dark:text-white flex overflow-hidden p-3 md:p-4 gap-4 antialiased">
      <FirstSideMenu />

      <div className="relative flex-1 min-h-0 flex flex-col">
        <Navbar />

        {/* Zone de contenu sous la Navbar */}
        <div className="flex-1 min-h-0 flex gap-4 overflow-hidden">
          {/* Le flux central défilant */}
          <main className="flex-1 min-h-0 bg-white dark:bg-[#1c1d22] border border-slate-200/80 dark:border-zinc-800/40 rounded-3xl p-6 overflow-y-auto scrollbar-none">
            <h1 className="text-xl font-bold mb-4 tracking-tight text-zinc-900 dark:text-white">
              Infinite Scroll
            </h1>
            <div className="h-[1200px] text-zinc-500 dark:text-zinc-400 text-sm">
              (Contenu pour tester le défilement interne...)
            </div>
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
