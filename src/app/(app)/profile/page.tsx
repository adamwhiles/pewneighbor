import { requireProfile } from "@/lib/auth/session";
import { AppShell } from "@/components/layout/app-shell";

export const dynamic = "force-dynamic";
export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const { session, profile } = await requireProfile();

  return (
    <AppShell userName={session.user?.name ?? undefined}>
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Your Profile</h1>
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Display name</p>
            <p className="text-slate-900">{profile.displayName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Age range</p>
            <p className="text-slate-900">{profile.ageRange}</p>
          </div>
          {profile.aboutMe && (
            <div>
              <p className="text-sm font-medium text-slate-500">About me</p>
              <p className="text-slate-900">{profile.aboutMe}</p>
            </div>
          )}
          <div className="pt-2 border-t border-slate-100">
            <p className="text-sm text-slate-500">Profile editing coming soon.</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
