import type { Metadata, Viewport } from "next";
import "./globals.css";

const DESCRIPTION =
  "Alamo St Advisors — independent advisory for teams building with AI. Strategy, model evaluation, data pipelines, and embedding systems. Austin, Texas.";

export const metadata: Metadata = {
  title: {
    default: "Alamo St Advisors — Advisory for teams building with AI",
    template: "%s — Alamo St Advisors",
  },
  description: DESCRIPTION,
  metadataBase: new URL("https://www.alamost.com"),
  applicationName: "Alamo St Advisors",
  authors: [{ name: "JC Davis", url: "https://jcamd.com" }],
  formatDetection: { telephone: false, address: false, email: false },
  openGraph: {
    siteName: "Alamo St Advisors",
    title: "Alamo St Advisors — Advisory for teams building with AI",
    description: DESCRIPTION,
    type: "website",
    url: "https://www.alamost.com",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Alamo St Advisors — Clarity for teams building with AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alamo St Advisors — Advisory for teams building with AI",
    description: DESCRIPTION,
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f1ece2" },
    { media: "(prefers-color-scheme: dark)", color: "#14120f" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Alamo St Advisors",
    url: "https://www.alamost.com",
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
