import type { Metadata } from "next";
import ServicePage from "@/app/components/service-page";

export const metadata: Metadata = {
  title: "Benchmarking workflows that matter",
  alternates: { canonical: "/services/benchmarking" },
  description:
    "Evaluation harnesses built on your own data: champion vs. challenger, held-out metrics, human-in-the-loop checks — tied to business outcomes, not leaderboard scores.",
};

const deliverables = [
  ["A harness on your data", "An evaluation pipeline built on your own examples, your own edge cases, your own failure history — the situations a generic benchmark never covers."],
  ["Champion vs. challenger", "Your current approach scored head-to-head against the candidate: the model you're considering, the agent workflow you're prototyping, the vendor you're evaluating. Same data, same metrics, no spin."],
  ["Held-out metrics, reported straight", "The numbers measured on data neither side saw during development — including the ones that make a candidate look bad. Metrics you could bet the roadmap on."],
  ["Human-in-the-loop checks", "Where outputs touch customers or decisions, structured human review: sampled, scored, and priced against the error budget. You learn what review costs before you're committed to it."],
  ["A rerun playbook", "Documentation your team can run themselves next quarter — new data in, new scores out — so the evaluation keeps working after the engagement ends."],
];

const notIncluded = [
  "Training a model from scratch as part of the evaluation — the harness judges candidates, it doesn't build them.",
  "A deployment or integration plan. The answer to “does it work” comes first; wiring it in is a separate engagement.",
  "Financial, investment, legal, or tax advice — this is technical advisory only.",
];

export default function BenchmarkingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AI evaluation and benchmarking",
    serviceType: "AI model evaluation",
    provider: {
      "@type": "ProfessionalService",
      name: "Alamo St Advisors",
      url: "https://www.alamost.com",
      address: { "@type": "PostalAddress", addressLocality: "Austin", addressRegion: "TX", addressCountry: "US" },
    },
    areaServed: "Worldwide",
    url: "https://www.alamost.com/services/benchmarking",
    description: metadata.description,
  };
  return (
    <ServicePage
      n="02"
      title="Benchmarking workflows that matter"
      jsonLd={jsonLd}
      lede={<>Evaluation harnesses built on your own data: champion vs. challenger, held-out metrics, human-in-the-loop checks — tied to business outcomes, not leaderboard scores. Know what a model or an agent will do for your customers before it ever touches them.</>}
      deliverables={deliverables}
      howItRuns={<>Three to six weeks. First the harness: your data turned into scored test sets with the metrics that matter to the business. Then the matchup: champion vs. challenger run cleanly, with held-out data and the failure cases written up plainly. You get a report a product lead can act on — ship it, fix it, or kill it — and a playbook so your team can rerun the whole thing.</>}
      whoFor={<>Teams about to ship — or about to buy — an AI system and needing an honest answer first. Model vendors and internal champions bring demos; this engagement brings the part demos skip: what it does on <em>your</em> customers&rsquo; data, with the bad news included.</>}
      notIncluded={notIncluded}
    />
  );
}
