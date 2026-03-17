import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { profiles, profileInterests, interests, organizationMembers, organizations } from "@/lib/db/schema";
import { profileSchema } from "@/lib/validation/schemas";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Validate join code and find the church
    const org = await db.query.organizations.findFirst({
      where: (t, { eq, and }) =>
        and(eq(t.joinCode, body.joinCode?.toUpperCase()), eq(t.status, "active")),
    });

    if (!org) {
      return NextResponse.json(
        { error: "Invalid or inactive join code. Check with your church admin." },
        { status: 400 }
      );
    }

    // Check member limit
    const memberCount = await db.query.organizationMembers.findMany({
      where: (t, { eq, and }) =>
        and(eq(t.organizationId, org.id), eq(t.status, "active")),
    });

    if (memberCount.length >= org.memberLimit) {
      return NextResponse.json(
        { error: "This church has reached its member limit. Please contact your church admin." },
        { status: 400 }
      );
    }

    const data = profileSchema.parse(body);

    // Resolve interest labels to UUIDs
    const interestLabels: string[] = body.interestLabels ?? [];
    const interestRecords = await db.query.interests.findMany({
      where: (t, { inArray }) =>
        inArray(t.label, interestLabels.length > 0 ? interestLabels : [""]),
    });
    const interestIds = interestRecords.map((r) => r.id);

    // Upsert profile (handles re-runs of onboarding)
    const userId = session.user!.id!;
    const existingProfile = await db.query.profiles.findFirst({
      where: (t, { eq }) => eq(t.userId, userId),
    });

    if (existingProfile) {
      // Update existing profile
      await db
        .update(profiles)
        .set({
          organizationId: org.id,
          displayName: data.displayName,
          ageRange: data.ageRange,
          gender: data.gender,
          aboutMe: data.aboutMe ?? null,
          lookingFor: data.lookingFor,
          availability: data.availability,
          isCouple: data.isCouple,
          partnerName: data.partnerName ?? null,
          partnerAgeRange: data.partnerAgeRange ?? null,
          updatedAt: new Date(),
        })
        .where(eq(profiles.id, existingProfile.id));

      // Replace interests
      await db.delete(profileInterests).where(eq(profileInterests.profileId, existingProfile.id));
      if (interestIds.length > 0) {
        await db.insert(profileInterests).values(
          interestIds.map((id) => ({ profileId: existingProfile.id, interestId: id }))
        );
      }
    } else {
      // Create new profile
      const [newProfile] = await db
        .insert(profiles)
        .values({
          userId: session.user.id,
          organizationId: org.id,
          displayName: data.displayName,
          ageRange: data.ageRange,
          gender: data.gender,
          aboutMe: data.aboutMe ?? null,
          lookingFor: data.lookingFor,
          availability: data.availability,
          isCouple: data.isCouple,
          partnerName: data.partnerName ?? null,
          partnerAgeRange: data.partnerAgeRange ?? null,
        })
        .returning();

      // Add interests
      if (interestIds.length > 0) {
        await db.insert(profileInterests).values(
          interestIds.map((id) => ({ profileId: newProfile.id, interestId: id }))
        );
      }

      // Create or update church membership
      await db
        .insert(organizationMembers)
        .values({
          userId: session.user.id,
          organizationId: org.id,
          role: "member",
          status: "active",
        })
        .onConflictDoNothing();
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid profile data", details: err.issues },
        { status: 400 }
      );
    }
    console.error("Profile creation error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
