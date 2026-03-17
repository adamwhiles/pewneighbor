import { requireProfile } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { AppShell } from "@/components/layout/app-shell";
import { ChatWindow } from "./chat-window";
import { notFound, redirect } from "next/navigation";
import { decryptMessage } from "@/lib/crypto";
import { eq, and, isNull, asc } from "drizzle-orm";
import { messages, connections } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export const metadata = { title: "Chat" };

interface ChatPageProps {
  params: { connectionId: string };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { session, profile } = await requireProfile();

  // Verify this user is a member of this connection
  const membership = await db.query.connectionMembers.findFirst({
    where: (t, { eq, and }) =>
      and(
        eq(t.connectionId, params.connectionId),
        eq(t.profileId, profile.id)
      ),
    with: {
      connection: {
        with: {
          members: {
            with: { profile: true },
          },
        },
      },
    },
  });

  if (!membership) notFound();

  const connection = membership.connection;
  if (connection.status === "archived") {
    redirect("/messages");
  }

  // Fetch messages separately for better type safety
  const rawMessages = await db.query.messages.findMany({
    where: (t, { eq, and, isNull }) =>
      and(eq(t.connectionId, params.connectionId), isNull(t.deletedAt)),
    orderBy: (t, { asc }) => [asc(t.createdAt)],
    limit: 50,
  });

  // Decrypt messages
  const decryptedMessages = await Promise.all(
    rawMessages.map(async (msg) => {
      try {
        const content = await decryptMessage(msg.ciphertext, msg.iv);
        return {
          id: msg.id,
          senderId: msg.senderId,
          content,
          createdAt: msg.createdAt,
        };
      } catch {
        return {
          id: msg.id,
          senderId: msg.senderId,
          content: "[Message could not be decrypted]",
          createdAt: msg.createdAt,
        };
      }
    })
  );

  const otherMembers = connection.members.filter(
    (m) => m.profileId !== profile.id
  );
  const chatTitle = otherMembers
    .map((m) => m.profile?.displayName ?? "Unknown")
    .join(" & ");

  return (
    <AppShell userName={session.user?.name ?? undefined}>
      <ChatWindow
        connectionId={params.connectionId}
        currentProfileId={profile.id}
        chatTitle={chatTitle}
        initialMessages={decryptedMessages}
        members={connection.members.map((m) => ({
          profileId: m.profileId,
          displayName: m.profile?.displayName ?? "Unknown",
        }))}
      />
    </AppShell>
  );
}
