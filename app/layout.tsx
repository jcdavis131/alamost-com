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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Alamo St Advisors",
    url: "https://alamost.com",
    description: DESCRIPTION,
    areaServed: "Worldwide",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Austin",
      addressRegion: "TX",
      addressCountry: "US",
    },
    founder: {
      "@type": "Person",
      name: "JC Davis",
      url: "https://jcamd.com",
    },
    sameAs: ["https://github.com/jcdavis131"],
  };
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
