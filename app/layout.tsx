import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "alamost.com — Lina's Card Shop",
  description: "Daily MTNN cards • equities, hoops, gridiron — static shop, Canvas 2D export, free-tier.",
  metadataBase: new URL("https://alamost.com"),
  openGraph: {
    title: "alamost.com — Lina's Card Shop",
    description: "Curated daily cards from MTNN models. Shop, preview, export PNG.",
    type: "website",
    url: "https://alamost.com",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
