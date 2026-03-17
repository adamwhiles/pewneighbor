import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/session";
import { db } from "@/lib/db";
import OnboardingForm from "./onboarding-form";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const session = await requireAuth();

  const user = await db.query.users.findFirst({
    where: (t, { eq }) => eq(t.id, session.user.id),
  });

  if (user?.isAppAdmin) {
    redirect("/admin/churches");
  }

  return <OnboardingForm />;
}
