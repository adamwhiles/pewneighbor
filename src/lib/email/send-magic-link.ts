import { Resend } from "resend";
import { render } from "@react-email/components";
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
  const html = await render(MagicLinkEmail({ url }));

  const { data, error } = await getResend().emails.send({
    from: process.env.EMAIL_FROM ?? "PewNeighbor <noreply@pewneighbor.com>",
    to,
    subject: "Your PewNeighbor sign-in link",
    html,
  });

  if (error) {
    console.error("[sendMagicLinkEmail] Resend error:", JSON.stringify(error));
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
  const html = await render(WaveEmail({ senderName }));

  await getResend().emails.send({
    from: process.env.EMAIL_FROM ?? "PewNeighbor <noreply@pewneighbor.com>",
    to,
    subject: `${senderName} waved at you on PewNeighbor!`,
    html,
  });
}
