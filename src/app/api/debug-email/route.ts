import { NextResponse } from "next/server";
import { Resend } from "resend";
import { MagicLinkEmail } from "@/lib/email/templates/magic-link";
import { db } from "@/lib/db";
import { verificationTokens } from "@/lib/db/schema";

// TEMPORARY: delete this file after debugging
export async function GET() {
  const results: Record<string, unknown> = {};

  // 1. Test React Email rendering
  try {
    const rendered = MagicLinkEmail({ url: "https://pewneighbor.com/test" });
    results.reactEmail = rendered ? "ok" : "returned null";
  } catch (e) {
    results.reactEmail = `ERROR: ${e instanceof Error ? e.message : String(e)}`;
  }

  // 2. Test Resend with React template
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "PewNeighbor <noreply@pewneighbor.com>",
      to: "awhiles2011@gmail.com",
      subject: "PewNeighbor react email test",
      react: MagicLinkEmail({ url: "https://pewneighbor.com/test" }),
    });
    results.resendReact = error ? `ERROR: ${JSON.stringify(error)}` : `ok, id: ${data?.id}`;
  } catch (e) {
    results.resendReact = `ERROR: ${e instanceof Error ? e.message : String(e)}`;
  }

  // 3. Test verification token DB write
  try {
    const testToken = { identifier: "debug@test.com", token: "debug-token-delete-me", expires: new Date(Date.now() + 60000) };
    await db.insert(verificationTokens).values(testToken);
    await db.delete(verificationTokens).where(
      (await import("drizzle-orm")).and(
        (await import("drizzle-orm")).eq(verificationTokens.identifier, testToken.identifier),
        (await import("drizzle-orm")).eq(verificationTokens.token, testToken.token),
      )
    );
    results.dbVerificationToken = "ok";
  } catch (e) {
    results.dbVerificationToken = `ERROR: ${e instanceof Error ? e.message : String(e)}`;
  }

  return NextResponse.json(results);
}
