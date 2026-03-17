import { NextResponse } from "next/server";
import { Resend } from "resend";

// TEMPORARY: delete this file after debugging
export async function GET() {
  const apiKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM;

  if (!apiKey) {
    return NextResponse.json({ error: "RESEND_API_KEY is not set" }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from: emailFrom ?? "PewNeighbor <noreply@pewneighbor.com>",
    to: "awhiles2011@gmail.com",
    subject: "PewNeighbor email test",
    text: "If you received this, Resend is working correctly.",
  });

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ success: true, id: data?.id });
}
