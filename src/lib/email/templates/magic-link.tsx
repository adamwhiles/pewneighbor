import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface MagicLinkEmailProps {
  url: string;
}

export function MagicLinkEmail({ url }: MagicLinkEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your PewNeighbor sign-in link (expires in 10 minutes)</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Text style={logoText}>🕊️ PewNeighbor</Text>
          </Section>
          <Heading style={heading}>Sign in to PewNeighbor</Heading>
          <Text style={paragraph}>
            Click the button below to sign in. This link expires in{" "}
            <strong>10 minutes</strong> and can only be used once.
          </Text>
          <Section style={buttonSection}>
            <Button style={button} href={url}>
              Sign In to PewNeighbor
            </Button>
          </Section>
          <Text style={paragraph}>
            If you didn&apos;t request this email, you can safely ignore it.
            Someone may have entered your email address by mistake.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            PewNeighbor — Finding friends in your church community.
            <br />
            This is a secure, one-time sign-in link. Never share it with anyone.
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

const logoSection = {
  marginBottom: "32px",
};

const logoText = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#1e3a5f",
  margin: "0",
};

const heading = {
  fontSize: "28px",
  fontWeight: "bold",
  color: "#111827",
  marginBottom: "16px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#374151",
  marginBottom: "24px",
};

const buttonSection = {
  marginBottom: "32px",
};

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

const hr = {
  borderColor: "#e5e7eb",
  margin: "24px 0",
};

const footer = {
  fontSize: "13px",
  color: "#9ca3af",
  lineHeight: "20px",
};
