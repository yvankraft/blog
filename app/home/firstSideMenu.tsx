import { prisma } from "../lib/db";

export default async function FirstSideMenu() {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

  const users = await prisma.user.findMany({
    take: 10,
    select: {
      id: true,
      name: true,
      image: true,
      lastActiveAt: true,
    },
    orderBy: {
      lastActiveAt: "desc",
    },
  });

  const activeUsers = users.map((u) => ({
    ...u,
    isOnline: u.lastActiveAt ? u.lastActiveAt > fiveMinutesAgo : false,
  }));

  return (
    <div className="hidden md:flex flex-col w-64 min-h-0 bg-white dark:bg-[#1c1d22] border border-slate-200/80 dark:border-zinc-800/40 rounded-3xl p-5 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between px-1 mb-4">
        <h2 className="text-zinc-800 dark:text-zinc-200 text-base font-bold tracking-tight">
          Messages
        </h2>
        <span className="text-[11px] bg-slate-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded-full font-mono">
          {activeUsers.filter((u) => u.isOnline).length}
        </span>
      </div>

      <div className="space-y-1">
        {activeUsers.map((u) => (
          <div
            key={u.id}
            className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition duration-200 cursor-pointer group"
          >
            <div className="relative shrink-0">
              {u.image ? (
                <img
                  src={u.image}
                  alt={u.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-100 dark:border-zinc-800"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700/50 text-zinc-600 dark:text-zinc-300 font-bold flex items-center justify-center uppercase text-xs">
                  {u.name.charAt(0)}
                </div>
              )}

              {/* Anneau qui s'adapte au fond de la carte (blanc ou sombre) */}
              <span
                className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-[#1c1d22] ${
                  u.isOnline ? "bg-[#d4f96d]" : "bg-zinc-400 dark:bg-zinc-600"
                }`}
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate group-hover:text-black dark:group-hover:text-white transition">
                {u.name}
              </p>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate mt-0.5">
                {u.isOnline ? "Active now" : "Offline"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
