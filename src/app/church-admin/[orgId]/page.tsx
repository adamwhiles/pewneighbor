import { requireChurchAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { AppShell } from "@/components/layout/app-shell";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireProfile } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export const metadata = { title: "Church Admin Dashboard" };

interface AdminPageProps {
  params: { orgId: string };
}

export default async function ChurchAdminPage({ params }: AdminPageProps) {
  const { session } = await requireChurchAdmin(params.orgId);
  const { profile } = await requireProfile();

  const org = await db.query.organizations.findFirst({
    where: (t, { eq }) => eq(t.id, params.orgId),
  });

  if (!org) return null;

  const members = await db.query.organizationMembers.findMany({
    where: (t, { eq, and }) =>
      and(eq(t.organizationId, params.orgId), eq(t.status, "active")),
    with: { user: { with: { profile: true } } },
    orderBy: (t, { desc }) => [desc(t.joinedAt)],
  });

  const openReports = await db.query.reports.findMany({
    where: (t, { eq, and }) =>
      and(eq(t.organizationId, params.orgId), eq(t.status, "open")),
    with: {
      reportedProfile: true,
    },
    orderBy: (t, { desc }) => [desc(t.createdAt)],
    limit: 10,
  });

  const memberCount = members.length;
  const memberLimit = org.memberLimit;

  return (
    <AppShell userName={session.user?.name ?? undefined}>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{org.name}</h1>
          <p className="text-slate-500">Church Admin Dashboard</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <p className="text-3xl font-bold text-navy-800">{memberCount}</p>
              <p className="text-sm text-slate-500 mt-1">
                Active members ({memberLimit === 999999 ? "unlimited" : `${memberLimit} limit`})
              </p>
              {memberCount >= memberLimit * 0.9 && (
                <Badge variant="warning" className="mt-2">Near limit</Badge>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-3xl font-bold text-navy-800">{openReports.length}</p>
              <p className="text-sm text-slate-500 mt-1">Open reports</p>
              {openReports.length > 0 && (
                <Badge variant="danger" className="mt-2">Needs review</Badge>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="font-mono text-2xl font-bold text-navy-800 tracking-widest">
                {org.joinCode}
              </p>
              <p className="text-sm text-slate-500 mt-1">Church join code</p>
              <p className="text-xs text-slate-400 mt-1">Share with your congregation</p>
            </CardContent>
          </Card>
        </div>

        {/* Open reports */}
        {openReports.length > 0 && (
          <section>
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Open reports
            </h2>
            <div className="space-y-3">
              {openReports.map((report) => (
                <Card key={report.id} className="border-red-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-900">
                          Report against{" "}
                          <span className="text-red-700">
                            {report.reportedProfile.displayName}
                          </span>
                        </p>
                        <p className="text-sm text-slate-500">
                          Reason: {report.reason.replace("_", " ")}
                        </p>
                        {report.detail && (
                          <p className="mt-1 text-sm text-slate-600">
                            &ldquo;{report.detail}&rdquo;
                          </p>
                        )}
                      </div>
                      <Link href={`/church-admin/${params.orgId}/reports`}>
                        <Badge variant="danger">Review</Badge>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Members list */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Members</h2>
          <div className="space-y-2">
            {members.map((member) => {
              const memberProfile = member.user?.profile;
              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {memberProfile?.displayName ?? "No profile yet"}
                    </p>
                    <p className="text-xs text-slate-500">
                      Joined{" "}
                      {new Date(member.joinedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={member.role === "admin" ? "default" : "secondary"}>
                      {member.role}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
