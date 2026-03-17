import { requireProfile } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { AppShell } from "@/components/layout/app-shell";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export const metadata = { title: "Messages" };

export default async function MessagesPage() {
  const { session, profile } = await requireProfile();

  // Get all active connections for this profile
  const myConnections = await db.query.connectionMembers.findMany({
    where: (t, { eq }) => eq(t.profileId, profile.id),
    with: {
      connection: {
        with: {
          members: {
            with: { profile: true },
          },
          messages: {
            orderBy: (t, { desc }) => [desc(t.createdAt)],
            limit: 1,
          },
        },
      },
    },
  });

  const activeConnections = myConnections
    .filter((cm) => cm.connection.status === "active")
    .sort((a, b) => {
      const aTime = a.connection.messages[0]?.createdAt ?? a.connection.createdAt;
      const bTime = b.connection.messages[0]?.createdAt ?? b.connection.createdAt;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });

  return (
    <AppShell userName={session.user?.name ?? undefined}>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Messages</h1>

        {activeConnections.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="mb-4 text-5xl">💬</div>
            <h3 className="text-lg font-semibold text-slate-700">
              No connections yet
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              When you and someone wave at each other, a chat will open here.{" "}
              <Link href="/discover" className="text-navy-700 underline">
                Start discovering!
              </Link>
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {activeConnections.map((cm) => {
              const others = cm.connection.members.filter(
                (m) => m.profileId !== profile.id
              );
              const otherNames = others
                .map((m) => m.profile?.displayName ?? "Unknown")
                .join(" & ");
              const lastMessage = cm.connection.messages[0];

              return (
                <Link
                  key={cm.connection.id}
                  href={`/messages/${cm.connection.id}`}
                >
                  <Card className="p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900">
                          {otherNames}
                        </p>
                        <p className="mt-0.5 text-sm text-slate-500 truncate">
                          {lastMessage
                            ? "💬 New message"
                            : "👋 You're connected! Say hello."}
                        </p>
                      </div>
                      <span className="text-xs text-slate-400 shrink-0">
                        {formatRelativeTime(
                          new Date(
                            lastMessage?.createdAt ?? cm.connection.createdAt
                          )
                        )}
                      </span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
