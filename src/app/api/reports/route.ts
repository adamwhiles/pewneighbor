import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { reports } from "@/lib/db/schema";
import { reportSchema } from "@/lib/validation/schemas";
import { z } from "zod";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = reportSchema.parse(body);

    // Get reporter's profile to determine org
    const userId = session.user!.id!;
    const profile = await db.query.profiles.findFirst({
      where: (t, { eq }) => eq(t.userId, userId),
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Verify reported profile is in same org
    const reportedProfile = await db.query.profiles.findFirst({
      where: (t, { eq, and }) =>
        and(
          eq(t.id, data.reportedProfileId),
          eq(t.organizationId, profile.organizationId)
        ),
    });

    if (!reportedProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    await db.insert(reports).values({
      reporterId: session.user.id,
      reportedProfileId: data.reportedProfileId,
      reportedMessageId: data.reportedMessageId ?? null,
      organizationId: profile.organizationId,
      reason: data.reason,
      detail: data.detail ?? null,
      status: "open",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    console.error("Report error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
