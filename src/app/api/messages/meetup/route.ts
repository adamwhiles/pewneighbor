import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { meetupSuggestions } from "@/lib/db/schema";
import { meetupSuggestionSchema } from "@/lib/validation/schemas";
import { z } from "zod";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = meetupSuggestionSchema.parse(body);

    const userId = session.user!.id!;
    const senderProfile = await db.query.profiles.findFirst({
      where: (t, { eq }) => eq(t.userId, userId),
    });

    if (!senderProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Verify membership
    const membership = await db.query.connectionMembers.findFirst({
      where: (t, { eq, and }) =>
        and(
          eq(t.connectionId, data.connectionId),
          eq(t.profileId, senderProfile.id)
        ),
    });

    if (!membership) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    await db.insert(meetupSuggestions).values({
      connectionId: data.connectionId,
      proposerId: senderProfile.id,
      suggestedActivity: data.suggestedActivity ?? null,
      suggestedDateRange: data.suggestedDateRange ?? null,
      suggestedLocation: data.suggestedLocation ?? null,
      status: "pending",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    console.error("Meetup suggestion error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
