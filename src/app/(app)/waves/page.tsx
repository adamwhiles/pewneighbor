import { requireProfile } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { AppShell } from "@/components/layout/app-shell";
import { WaveList } from "./wave-list";

export const dynamic = "force-dynamic";

export const metadata = { title: "Waves" };

export default async function WavesPage() {
  const { session, profile } = await requireProfile();

  // Incoming pending waves
  const incoming = await db.query.waves.findMany({
    where: (t, { eq, and }) =>
      and(eq(t.recipientId, profile.id), eq(t.status, "pending")),
    with: {
      sender: {
        with: {
          interests: { with: { interest: true }, limit: 3 },
        },
      },
    },
    orderBy: (t, { desc }) => [desc(t.createdAt)],
  });

  // Outgoing pending waves
  const outgoing = await db.query.waves.findMany({
    where: (t, { eq, and }) =>
      and(eq(t.senderId, profile.id), eq(t.status, "pending")),
    with: {
      recipient: {
        with: {
          interests: { with: { interest: true }, limit: 3 },
        },
      },
    },
    orderBy: (t, { desc }) => [desc(t.createdAt)],
  });

  return (
    <AppShell userName={session.user?.name ?? undefined}>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold text-slate-900">Waves</h1>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-800 flex items-center gap-2">
            👋 Incoming waves
            {incoming.length > 0 && (
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-navy-700 text-xs font-bold text-white">
                {incoming.length}
              </span>
            )}
          </h2>
          {incoming.length === 0 ? (
            <p className="text-sm text-slate-500">
              No incoming waves yet. Head to{" "}
              <a href="/discover" className="text-navy-700 underline">Discover</a>{" "}
              to meet people in your church!
            </p>
          ) : (
            <WaveList waves={incoming} direction="incoming" />
          )}
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-800">
            Sent waves
          </h2>
          {outgoing.length === 0 ? (
            <p className="text-sm text-slate-500">You haven&apos;t waved at anyone yet.</p>
          ) : (
            <WaveList waves={outgoing} direction="outgoing" />
          )}
        </section>
      </div>
    </AppShell>
  );
}
