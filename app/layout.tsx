import type { Metadata } from "next";
import "./globals.css";

const DESCRIPTION =
  "Alamo St Advisors — independent advisory for teams building with AI. Strategy, model evaluation, data pipelines, and embedding systems. Austin, Texas.";

export const metadata: Metadata = {
  title: {
    default: "Alamo St Advisors — Advisory for teams building with AI",
    template: "%s — Alamo St Advisors",
  },
  description: DESCRIPTION,
  metadataBase: new URL("https://alamost.com"),
  applicationName: "Alamo St Advisors",
  openGraph: {
    siteName: "Alamo St Advisors",
    title: "Alamo St Advisors — Advisory for teams building with AI",
    description: DESCRIPTION,
    type: "website",
    url: "https://alamost.com",
  },
  twitter: { card: "summary" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
