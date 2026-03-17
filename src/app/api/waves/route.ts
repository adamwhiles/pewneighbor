import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { waves, connections, connectionMembers, profiles } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const sendWaveSchema = z.object({
  recipientProfileId: z.string().uuid(),
});

const respondWaveSchema = z.object({
  waveId: z.string().uuid(),
  action: z.enum(["accept", "decline"]),
});

// POST /api/waves — send a wave
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { recipientProfileId } = sendWaveSchema.parse(body);

    // Get sender's profile
    const userId = session.user!.id!;
    const senderProfile = await db.query.profiles.findFirst({
      where: (t, { eq }) => eq(t.userId, userId),
    });

    if (!senderProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Get recipient profile (must be in same church)
    const recipientProfile = await db.query.profiles.findFirst({
      where: (t, { eq, and }) =>
        and(
          eq(t.id, recipientProfileId),
          eq(t.organizationId, senderProfile.organizationId)
        ),
    });

    if (!recipientProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Check if a wave already exists in either direction
    const existingWave = await db.query.waves.findFirst({
      where: (t, { or, and, eq }) =>
        or(
          and(eq(t.senderId, senderProfile.id), eq(t.recipientId, recipientProfileId)),
          and(eq(t.senderId, recipientProfileId), eq(t.recipientId, senderProfile.id))
        ),
    });

    if (existingWave) {
      // If the other person already waved at us, auto-accept and create connection
      if (existingWave.senderId === recipientProfileId && existingWave.status === "pending") {
        return await acceptWaveAndConnect(existingWave.id, senderProfile.organizationId, [senderProfile.id, recipientProfileId]);
      }
      return NextResponse.json({ error: "Wave already exists" }, { status: 409 });
    }

    // Create the wave
    const [wave] = await db
      .insert(waves)
      .values({
        senderId: senderProfile.id,
        recipientId: recipientProfileId,
        organizationId: senderProfile.organizationId,
        status: "pending",
      })
      .returning();

    // TODO: Send email notification to recipient (check their preferences)

    return NextResponse.json({ success: true, waveId: wave.id });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    console.error("Send wave error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// PATCH /api/waves — respond to a wave (accept or decline)
export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { waveId, action } = respondWaveSchema.parse(body);

    // Get the current user's profile
    const userId = session.user!.id!;
    const myProfile = await db.query.profiles.findFirst({
      where: (t, { eq }) => eq(t.userId, userId),
    });

    if (!myProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Find the wave — must be addressed to me
    const wave = await db.query.waves.findFirst({
      where: (t, { eq, and }) =>
        and(eq(t.id, waveId), eq(t.recipientId, myProfile.id), eq(t.status, "pending")),
    });

    if (!wave) {
      return NextResponse.json({ error: "Wave not found" }, { status: 404 });
    }

    if (action === "decline") {
      await db
        .update(waves)
        .set({ status: "declined", updatedAt: new Date() })
        .where(eq(waves.id, waveId));
      return NextResponse.json({ success: true, action: "declined" });
    }

    // Accept: create connection
    return await acceptWaveAndConnect(waveId, wave.organizationId, [wave.senderId, wave.recipientId]);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    console.error("Respond wave error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

async function acceptWaveAndConnect(
  waveId: string,
  organizationId: string,
  profileIds: string[]
) {
  // Update wave status
  await db
    .update(waves)
    .set({ status: "accepted", updatedAt: new Date() })
    .where(eq(waves.id, waveId));

  // Create connection
  const [connection] = await db
    .insert(connections)
    .values({
      organizationId,
      initiatingWaveId: waveId,
      status: "active",
    })
    .returning();

  // Add members to connection
  await db.insert(connectionMembers).values(
    profileIds.map((profileId) => ({
      connectionId: connection.id,
      profileId,
    }))
  );

  // TODO: Send email notification to both parties

  return NextResponse.json({
    success: true,
    action: "accepted",
    connectionId: connection.id,
  });
}
