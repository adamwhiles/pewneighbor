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
  const { error } = await getResend().emails.send({
    from: process.env.EMAIL_FROM ?? "PewNeighbor <noreply@pewneighbor.com>",
    to,
    subject: "Your PewNeighbor sign-in link",
    react: MagicLinkEmail({ url }),
  });

  if (error) {
    console.error("Failed to send magic link email:", error);
    throw new Error("Failed to send sign-in email");
  }
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
