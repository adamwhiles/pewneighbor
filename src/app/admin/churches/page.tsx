import { requireAppAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { organizations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApproveChurchButton } from "./approve-church-button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin — Churches" };

export default async function AdminChurchesPage() {
  await requireAppAdmin();

  const pending = await db.query.organizations.findMany({
    where: (t, { eq }) => eq(t.status, "pending"),
    orderBy: (t, { asc }) => [asc(t.createdAt)],
  });

  const active = await db.query.organizations.findMany({
    where: (t, { eq }) => eq(t.status, "active"),
    orderBy: (t, { desc }) => [desc(t.createdAt)],
    limit: 50,
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Church Applications</h1>
        <Link href="/admin/reports" className="text-sm text-navy-700 underline">
          View reports →
        </Link>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-800 flex items-center gap-2">
          Pending approval
          {pending.length > 0 && (
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
              {pending.length}
            </span>
          )}
        </h2>
        {pending.length === 0 ? (
          <p className="text-sm text-slate-500">No pending applications. 🎉</p>
        ) : (
          <div className="space-y-3">
            {pending.map((org) => (
              <Card key={org.id} className="border-amber-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-900">{org.name}</p>
                      {org.denomination && (
                        <p className="text-sm text-slate-500">{org.denomination}</p>
                      )}
                      <p className="text-sm text-slate-500">
                        {org.city}, {org.stateProvince ?? ""} {org.country}
                      </p>
                      <p className="text-sm text-slate-600">
                        Admin: <span className="font-medium">{org.adminEmail}</span>
                      </p>
                      {org.websiteUrl && (
                        <a
                          href={org.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-navy-700 underline"
                        >
                          {org.websiteUrl}
                        </a>
                      )}
                      <p className="text-xs text-slate-400">
                        Applied{" "}
                        {new Date(org.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <ApproveChurchButton orgId={org.id} action="approve" />
                      <ApproveChurchButton orgId={org.id} action="reject" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-800">Active churches</h2>
        <div className="space-y-2">
          {active.map((org) => (
            <div
              key={org.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3"
            >
              <div>
                <p className="font-medium text-slate-900">{org.name}</p>
                <p className="text-xs text-slate-500">
                  {org.city}, {org.stateProvince} · Code:{" "}
                  <span className="font-mono font-semibold">{org.joinCode}</span>
                </p>
              </div>
              <Badge variant="success">{org.subscriptionTier}</Badge>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
