import type { Metadata } from "next";
import "./globals.css";

const DESCRIPTION =
  "Sports trading cards and handmade cards, photographed at home and described properly. Run by Lina Davis, proprietor.";

export const metadata: Metadata = {
  // A template so every page carries the shop's name without each one
  // remembering to append it.
  title: { default: "Lina's Card Shop", template: "%s — Lina's Card Shop" },
  description: DESCRIPTION,
  metadataBase: new URL("https://alamost.com"),
  applicationName: "Lina's Card Shop",
  openGraph: {
    siteName: "Lina's Card Shop",
    title: "Lina's Card Shop",
    description: DESCRIPTION,
    type: "website",
    url: "https://alamost.com",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
