import { createFileRoute } from "@tanstack/react-router";
import { OngoingProjects } from "@/components/marketing/OngoingProjects";
import { Section, SectionHeader } from "@/components/marketing/Section";
import { CTA } from "@/components/marketing/CTA";

export const Route = createFileRoute("/_marketing/projects")({
  head: () => ({
    meta: [
      { title: "Ongoing Projects — Juanet" },
      { name: "description", content: "Public progress for systems Juanet is currently building." },
      { property: "og:title", content: "Juanet — Ongoing Projects" },
      { property: "og:description", content: "Transparency by default — track our active builds in real time." },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  return (
    <>
      <Section className="pt-32 md:pt-40 pb-0">
        <SectionHeader
          eyebrow="Live"
          title="Ongoing projects"
          description="Real-time progress across the systems we're currently shipping."
        />
      </Section>
      <OngoingProjects />
      <CTA />
    </>
  );
}
