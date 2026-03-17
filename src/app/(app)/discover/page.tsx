import { requireProfile } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { profiles, waves, blocks } from "@/lib/db/schema";
import { eq, and, ne, inArray, notInArray, or, sql } from "drizzle-orm";
import { AppShell } from "@/components/layout/app-shell";
import { ProfileCard } from "./profile-card";
import { DiscoverFilters } from "./discover-filters";

export const dynamic = "force-dynamic";

export const metadata = { title: "Discover" };

interface DiscoverPageProps {
  searchParams: {
    lookingFor?: string;
    availability?: string;
    interest?: string;
  };
}

export default async function DiscoverPage({ searchParams }: DiscoverPageProps) {
  const { session, profile } = await requireProfile();

  // Get profiles this user has already waved at (in either direction)
  const existingWaves = await db.query.waves.findMany({
    where: (t, { or, eq }) =>
      or(eq(t.senderId, profile.id), eq(t.recipientId, profile.id)),
    columns: { senderId: true, recipientId: true },
  });

  const wavedProfileIds = existingWaves.flatMap((w) => [w.senderId, w.recipientId]);

  // Get profiles this user has blocked (or been blocked by)
  const blockRows = await db.query.blocks.findMany({
    where: (t, { or, eq }) =>
      or(eq(t.blockerId, profile.id), eq(t.blockedId, profile.id)),
    columns: { blockerId: true, blockedId: true },
  });
  const blockedIds = blockRows.flatMap((b) => [b.blockerId, b.blockedId]);

  const excludeIds = [...new Set([...wavedProfileIds, ...blockedIds, profile.id])];

  // Fetch discoverable profiles within the same church
  const discoverable = await db.query.profiles.findMany({
    where: (t, { eq, and, notInArray }) => {
      const conditions = [
        eq(t.organizationId, profile.organizationId),
        ne(t.id, profile.id),
      ];
      if (excludeIds.length > 0) {
        conditions.push(notInArray(t.id, excludeIds));
      }
      // Filter by looking-for type compatibility
      if (searchParams.lookingFor) {
        conditions.push(
          or(
            eq(t.lookingFor, searchParams.lookingFor as "individual" | "couple" | "both"),
            eq(t.lookingFor, "both")
          )!
        );
      }
      return and(...conditions);
    },
    with: {
      interests: {
        with: { interest: true },
        limit: 5,
      },
    },
    limit: 30,
    orderBy: sql`RANDOM()`,
  });

  // Filter by interest if specified
  const filtered = searchParams.interest
    ? discoverable.filter((p) =>
        p.interests.some((pi) => pi.interest?.label === searchParams.interest)
      )
    : discoverable;

  return (
    <AppShell userName={session.user?.name ?? undefined}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Discover people in {profile.organization?.name ?? "your church"}
          </h1>
          <p className="mt-1 text-slate-500">
            Wave at someone to start a connection. Mutual waves unlock a private chat.
          </p>
        </div>

        <DiscoverFilters currentFilters={searchParams} />

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="mb-4 text-5xl">👋</div>
            <h3 className="text-lg font-semibold text-slate-700">
              No more profiles to discover right now
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              You&apos;ve seen everyone in your church! Check back later as new
              members join, or adjust your filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <ProfileCard
                key={p.id}
                profile={p}
                currentProfileId={profile.id}
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
