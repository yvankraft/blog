import { prisma } from "../lib/db";

export default async function firstSideMenu() {
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
    <div className=" hidden sticky top-0 h-screen w-64  bg-whiet/20 overflow-y-auto p-8 pt-28 md:flex flex-col  gap-2">
      <h2 className="text-2xl font-bold mb-4">Chat</h2>
      {activeUsers.map((u) => (
        <div key={u.id} className="flex items-center gap-3 p-2">
          <div className="relative">
            {u.image ? (
              <img
                src={u.image}
                alt={u.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 font-bold flex items-center justify-center uppercase text-sm">
                {u.name.charAt(0)}
              </div>
            )}

            {/* Pastille de statut ajustée selon la présence */}
            <span
              className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-black ${
                u.isOnline ? "bg-green-500" : "bg-gray-400"
              }`}
            />
          </div>

          <div>
            <p className="text-sm font-semibold">{u.name}</p>
            <p className="text-xs text-gray-400">
              {u.isOnline ? "En ligne" : "Hors ligne"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
