import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface WaveEmailProps {
  senderName: string;
}

export function WaveEmail({ senderName }: WaveEmailProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://pewneighbor.com";

  return (
    <Html>
      <Head />
      <Preview>{senderName} waved at you on PewNeighbor!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Text style={logoText}>🕊️ PewNeighbor</Text>
          </Section>
          <Heading style={heading}>You got a wave! 👋</Heading>
          <Text style={paragraph}>
            <strong>{senderName}</strong> from your church community waved at
            you on PewNeighbor. Wave back to make a new friend connection!
          </Text>
          <Section style={buttonSection}>
            <Button style={button} href={`${appUrl}/waves`}>
              See Your Waves
            </Button>
          </Section>
          <Text style={paragraph}>
            If you&apos;re not interested, you can simply decline — no pressure,
            no awkwardness.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            PewNeighbor — Finding friends in your church community.
            <br />
            To update your notification preferences,{" "}
            <a href={`${appUrl}/settings`} style={{ color: "#1e3a5f" }}>
              visit your settings
            </a>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f9fafb",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "560px",
};

const logoSection = { marginBottom: "32px" };
const logoText = { fontSize: "24px", fontWeight: "bold", color: "#1e3a5f", margin: "0" };
const heading = { fontSize: "28px", fontWeight: "bold", color: "#111827", marginBottom: "16px" };
const paragraph = { fontSize: "16px", lineHeight: "24px", color: "#374151", marginBottom: "24px" };
const buttonSection = { marginBottom: "32px" };
const button = {
  backgroundColor: "#1e3a5f",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  padding: "14px 28px",
  textDecoration: "none",
  display: "inline-block",
};
const hr = { borderColor: "#e5e7eb", margin: "24px 0" };
const footer = { fontSize: "13px", color: "#9ca3af", lineHeight: "20px" };
