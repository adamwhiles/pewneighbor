import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { organizations, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const schema = z.object({
  orgId: z.string().uuid(),
  action: z.enum(["approve", "reject"]),
});

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user!.id!;
  // Verify app admin
  const user = await db.query.users.findFirst({
    where: (t, { eq }) => eq(t.id, userId),
  });

  if (!user?.isAppAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { orgId, action } = schema.parse(body);

    const org = await db.query.organizations.findFirst({
      where: (t, { eq }) => eq(t.id, orgId),
    });

    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    if (action === "approve") {
      await db
        .update(organizations)
        .set({ status: "active", updatedAt: new Date() })
        .where(eq(organizations.id, orgId));

      // TODO: Send approval email to org.adminEmail with join code
    } else {
      await db
        .update(organizations)
        .set({ status: "suspended", updatedAt: new Date() })
        .where(eq(organizations.id, orgId));

      // TODO: Send rejection email to org.adminEmail
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    console.error("Admin church action error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
