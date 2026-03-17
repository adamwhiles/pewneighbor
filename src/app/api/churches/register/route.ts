import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { organizations } from "@/lib/db/schema";
import { churchRegistrationSchema } from "@/lib/validation/schemas";
import { generateJoinCode } from "@/lib/utils";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = churchRegistrationSchema.parse(body);

    // Generate a unique join code
    let joinCode: string;
    let attempts = 0;
    do {
      joinCode = generateJoinCode();
      const existing = await db.query.organizations.findFirst({
        where: (t, { eq }) => eq(t.joinCode, joinCode),
      });
      if (!existing) break;
      attempts++;
    } while (attempts < 10);

    if (attempts >= 10) {
      return NextResponse.json(
        { error: "Failed to generate unique join code. Please try again." },
        { status: 500 }
      );
    }

    await db.insert(organizations).values({
      name: data.name,
      denomination: data.denomination ?? null,
      city: data.city,
      stateProvince: data.stateProvince ?? null,
      country: data.country,
      websiteUrl: data.websiteUrl || null,
      adminEmail: data.adminEmail,
      joinCode: joinCode!,
      status: "pending",
    });

    // TODO: Send confirmation email to admin
    // TODO: Send notification to internal review queue

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid form data", details: err.issues },
        { status: 400 }
      );
    }
    console.error("Church registration error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
