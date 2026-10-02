import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fund Management | Portfolio Workspace",
  description: "Monthly fund performance, cash flows, and key contributors.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
