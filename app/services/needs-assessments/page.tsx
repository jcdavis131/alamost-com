import type { Metadata } from "next";
import ServicePage from "@/app/components/service-page";

export const metadata: Metadata = {
  title: "Needs assessments",
  alternates: { canonical: "/services/needs-assessments" },
  description:
    "A clear-eyed look at where machine learning or agentic systems can actually move one of your business metrics — and where they can't — before anyone commits to building anything.",
};

const deliverables = [
  ["Opportunity map", "Every plausible use case scored against the business metric it would actually move — revenue, cost, risk, or time — ranked by impact and effort."],
  ["Data-readiness read", "An honest inventory of the data each opportunity would need, what you already have, what's missing, and what filling the gaps would cost."],
  ["Cost of being wrong", "For the top candidates: what a bad model does to your customers or your team, and whether the failure modes are survivable."],
  ["Buy, build, or skip", "A plain recommendation per opportunity — buy a vendor product, build it in-house, or skip it — with the reasoning written down so your team can argue with it."],
  ["First-step plan", "The smallest useful thing to do next, with the decision it answers and the evidence that would change it."],
];

const notIncluded = [
  "Model training or production builds — this is diagnosis, not construction.",
  "Vendor selection run as a paid referral. If a vendor product fits, you'll hear it; there's no commission riding on the answer.",
  "Financial, investment, legal, or tax advice — this is technical advisory only.",
];

export default function NeedsAssessmentsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AI needs assessment",
    serviceType: "AI strategy advisory",
    provider: {
      "@type": "ProfessionalService",
      name: "Alamo St Advisors",
      url: "https://www.alamost.com",
      address: { "@type": "PostalAddress", addressLocality: "Austin", addressRegion: "TX", addressCountry: "US" },
    },
    areaServed: "Worldwide",
    url: "https://www.alamost.com/services/needs-assessments",
    description: metadata.description,
  };
  return (
    <ServicePage
      n="01"
      title="Needs assessments"
      jsonLd={jsonLd}
      lede={<>A clear-eyed look at where machine learning or agentic systems can actually move one of your business metrics — and where they can&rsquo;t. You get an honest map of the opportunities, the data they&rsquo;d need, and what it costs to be wrong, before anyone commits to building anything.</>}
      deliverables={deliverables}
      howItRuns={<>Two to four weeks, not quarters. Week one is conversations and data access: the decision you&rsquo;re stuck on, the team that would own the outcome, and a look at what you actually have in the warehouse. The rest is analysis and writing — the output is a document your leadership can read in twenty minutes and your engineers can argue with for a month.</>}
      whoFor={<>Teams with real AI curiosity and real data, but no clear picture of where the leverage is — or a leadership team that needs one trusted voice to separate the plausible from the theater before the budget gets spent.</>}
      notIncluded={notIncluded}
    />
  );
}
