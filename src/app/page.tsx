import Image from "next/image";
import { prisma } from "@/lib/prisma";

async function getUsers() {
  return prisma.user.findMany({ orderBy: { createdAt: "desc" } });
}

export default async function Home() {
  const users = await getUsers();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-4xl flex-col gap-12 p-10 bg-white shadow-sm dark:bg-zinc-950 sm:p-16">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Image src="/next.svg" alt="Next.js logo" width={100} height={20} priority />
            <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-white">
              Prisma + Supabase
            </h1>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
            Database connect sudah aktif. Ini adalah daftar pengguna yang diambil dari Supabase/Postgres via Prisma.
          </p>
        </div>

        <section className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="text-2xl font-semibold text-black dark:text-white">Users</h2>
          <div className="mt-4 space-y-4">
            {users.length === 0 ? (
              <p className="text-zinc-600 dark:text-zinc-400">Belum ada user di database.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {users.map((user) => (
                  <div key={user.id} className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-700">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">ID: {user.id}</p>
                    <p className="mt-2 text-lg font-semibold text-black dark:text-white">{user.name ?? "(No Name)"}</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300">{user.email}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
