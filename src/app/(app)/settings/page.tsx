import { requireProfile } from "@/lib/auth/session";
import { AppShell } from "@/components/layout/app-shell";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const { session } = await requireProfile();
  const fullSession = await auth();

  return (
    <AppShell userName={session.user?.name ?? undefined}>
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Settings</h1>
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Email</p>
            <p className="text-slate-900">{fullSession?.user?.email}</p>
          </div>
          <div className="pt-2 border-t border-slate-100">
            <p className="text-sm text-slate-500">Account settings coming soon.</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
