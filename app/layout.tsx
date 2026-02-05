import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "tldraw Editor",
  description: "Programmatic tldraw canvas editor",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
