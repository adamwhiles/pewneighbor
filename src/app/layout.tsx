import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PewNeighbor — Find Friends in Your Church Community",
    template: "%s | PewNeighbor",
  },
  description:
    "PewNeighbor helps introverted church members find meaningful friendships within their church community. Not a dating site — just genuine connections.",
  keywords: ["church friends", "church community", "Christian friendships", "church social"],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: "PewNeighbor — Find Friends in Your Church Community",
    description:
      "Find meaningful friendships within your church. Not a dating site — just genuine connections.",
    type: "website",
    siteName: "PewNeighbor",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
