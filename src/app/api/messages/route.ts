import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { messages } from "@/lib/db/schema";
import { encryptMessage } from "@/lib/crypto";
import { messageSchema } from "@/lib/validation/schemas";
import { z } from "zod";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { connectionId, content } = messageSchema.parse(body);

    const userId = session.user!.id!;
    // Get sender profile
    const senderProfile = await db.query.profiles.findFirst({
      where: (t, { eq }) => eq(t.userId, userId),
    });

    if (!senderProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Verify sender is a member of this connection
    const membership = await db.query.connectionMembers.findFirst({
      where: (t, { eq, and }) =>
        and(
          eq(t.connectionId, connectionId),
          eq(t.profileId, senderProfile.id)
        ),
    });

    if (!membership) {
      return NextResponse.json({ error: "Connection not found" }, { status: 404 });
    }

    // Encrypt message before storage
    const { ciphertext, iv } = await encryptMessage(content);

    await db.insert(messages).values({
      connectionId,
      senderId: senderProfile.id,
      ciphertext,
      iv,
    });

    // TODO: Queue email digest notification for other member(s)

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }
    console.error("Send message error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
