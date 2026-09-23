import type { Metadata } from "next";
import ServicePage from "@/app/components/service-page";

export const metadata: Metadata = {
  title: "Building custom solutions",
  alternates: { canonical: "/services/custom-solutions" },
  description:
    "Working prototypes on your real data — embedding and search systems, forecasting models, production data pipelines with quality gates, agentic workflows with human approval gates. Built to hand off.",
};

const deliverables = [
  ["Working software, not slides", "A real system running on your real data — embedding and search systems, forecasting models, data pipelines with quality gates, agentic workflows with human approval gates. Your team can touch it, measure it, and argue with it."],
  ["Evaluation before and after", "Every prototype ships with the harness that proves what it does: baseline scores on your data, post-build scores, and the failure modes written up honestly."],
  ["Code your team can read", "Documented, boring-in-a-good-way code — the reasoning behind each decision written down, not locked in anyone's head."],
  ["Training for your team", "Working sessions with the people who will own the system: how it runs, how it fails, what to watch, and what to change first when the data drifts."],
  ["A clean handoff", "Runbooks, evaluation playbooks, and documentation — the work survives after the engagement ends because it was built to leave."],
];

const notIncluded = [
  "Ongoing maintenance and on-call. The prototype is yours; if you want a longer arrangement afterward, that's a separate conversation.",
  "Your infrastructure bills — cloud, data, and vendor costs stay on your accounts.",
  "Replacing your team. The point is to make them self-sufficient, not dependent.",
  "Financial, investment, legal, or tax advice — this is technical advisory only.",
];

export default function CustomSolutionsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Custom AI solutions",
    serviceType: "AI systems development",
    provider: {
      "@type": "ProfessionalService",
      name: "Alamo St Advisors",
      url: "https://www.alamost.com",
      address: { "@type": "PostalAddress", addressLocality: "Austin", addressRegion: "TX", addressCountry: "US" },
    },
    areaServed: "Worldwide",
    url: "https://www.alamost.com/services/custom-solutions",
    description: metadata.description,
  };
  return (
    <ServicePage
      n="03"
      title="Building custom solutions"
      jsonLd={jsonLd}
      lede={<>Working prototypes on your real data — embedding and search systems, forecasting models, production data pipelines with quality gates, agentic workflows with human approval gates. Built to hand off: documentation and training so your team owns it.</>}
      deliverables={deliverables}
      howItRuns={<>Weeks, not quarters. The shape is always the same: diagnose the decision, build a working slice on real data, evaluate it honestly, then hand it over with your team trained to run it. Engagements are scoped to a single working system with a fixed price agreed upfront — you&rsquo;ll know exactly what you&rsquo;re getting before anything starts.</>}
      whoFor={<>Teams that know the opportunity and need it built right — with evaluation you can trust and a handoff that sticks. If your team should build it themselves and just needs a senior pair of eyes, say so; that&rsquo;s a shorter engagement, not this one.</>}
      notIncluded={notIncluded}
    />
  );
}
