import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { profiles, organizationMembers, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { cache } from "react";

export const getSession = cache(async () => {
  return auth();
});

export async function requireAuth() {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }
  // After this point, session.user.id is guaranteed to exist
  return session as typeof session & { user: { id: string } };
}

export async function requireProfile() {
  const session = await requireAuth();

  const profile = await db.query.profiles.findFirst({
    where: (t, { eq }) => eq(t.userId, session.user.id),
    with: {
      organization: true,
      interests: { with: { interest: true } },
    },
  });

  if (!profile) {
    redirect("/onboarding");
  }

  return { session, profile };
}

export async function requireChurchAdmin(organizationId: string) {
  const session = await requireAuth();

  const membership = await db.query.organizationMembers.findFirst({
    where: (t, { and, eq }) =>
      and(
        eq(t.userId, session.user.id),
        eq(t.organizationId, organizationId),
        eq(t.role, "admin"),
        eq(t.status, "active")
      ),
  });

  if (!membership) {
    redirect("/discover");
  }

  return { session, membership };
}

export async function requireAppAdmin() {
  const session = await requireAuth();
  const user = await db.query.users.findFirst({
    where: (t, { eq }) => eq(t.id, session.user.id),
  });

  if (!user?.isAppAdmin) {
    redirect("/discover");
  }

  return session;
}
