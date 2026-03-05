import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  icons: {
    icon: '/icon-yellow.png',
  },
  title: "RateifyX — Freight Quote Normalization",
  description: "Normalize shipping quotes from any carrier, any format. Get your comparison table in seconds.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
