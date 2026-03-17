import { Resend } from "resend";
import { MagicLinkEmail } from "./templates/magic-link";
import { WaveEmail } from "./templates/wave-notification";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? "");
}

export async function sendMagicLinkEmail({
  to,
  url,
}: {
  to: string;
  url: string;
}) {
  console.log("[sendMagicLinkEmail] attempting send to:", to);
  console.log("[sendMagicLinkEmail] RESEND_API_KEY set:", !!process.env.RESEND_API_KEY);
  console.log("[sendMagicLinkEmail] EMAIL_FROM:", process.env.EMAIL_FROM);

  const { data, error } = await getResend().emails.send({
    from: process.env.EMAIL_FROM ?? "PewNeighbor <noreply@pewneighbor.com>",
    to,
    subject: "Your PewNeighbor sign-in link",
    react: MagicLinkEmail({ url }),
  });

  if (error) {
    console.error("[sendMagicLinkEmail] Resend error:", JSON.stringify(error));
    throw new Error("Failed to send sign-in email");
  }
  console.log("[sendMagicLinkEmail] sent successfully, id:", data?.id);
}

export async function sendWaveNotificationEmail({
  to,
  senderName,
}: {
  to: string;
  senderName: string;
}) {
  await getResend().emails.send({
    from: process.env.EMAIL_FROM ?? "PewNeighbor <noreply@pewneighbor.com>",
    to,
    subject: `${senderName} waved at you on PewNeighbor!`,
    react: WaveEmail({ senderName }),
  });
}
