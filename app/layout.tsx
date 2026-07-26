import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lina's Card Shop",
  description:
    "Lina photographs the cards she is selling and they appear in her shop.",
  metadataBase: new URL("https://alamost.com"),
  openGraph: {
    title: "Lina's Card Shop",
    description: "Lina photographs the cards she is selling and they appear in her shop.",
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
