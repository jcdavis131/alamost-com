import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lina's Card Shop",
  description:
    "Printable picture cards for little kids — animals, numbers and shapes. Pick a card, print it, colour it in.",
  metadataBase: new URL("https://alamost.com"),
  openGraph: {
    title: "Lina's Card Shop",
    description: "Printable picture cards for little kids — animals, numbers and shapes.",
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
