import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeader } from "@/components/marketing/Section";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { submitContact } from "@/lib/contact";

export const Route = createFileRoute("/_marketing/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Juanet" },
      {
        name: "description",
        content: "Tell us about your project. We respond within one business day.",
      },
      { property: "og:title", content: "Contact Juanet" },
      {
        property: "og:description",
        content: "Start a project, license a platform, or book a consultation.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Name, email, and message are required.");
      return;
    }
    setSubmitting(true);
    try {
      await submitContact({ name, email, company, budget, message });
      toast.success("Inquiry sent — we'll respond within 24h.");
      setName(""); setEmail(""); setCompany(""); setBudget(""); setMessage("");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to send. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Section className="pt-32 md:pt-40">
      <SectionHeader
        eyebrow="Contact"
        title="Let's build something serious"
        description="Tell us about your project — we'll get back within one business day."
      />

      <div className="mt-16 grid gap-8 lg:grid-cols-5">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-3 glass-strong rounded-2xl p-6 md:p-8 space-y-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" required />
            <Field label="Email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@company.com" type="email" required />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Inc." />
            <Field label="Budget" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="$10k – $50k" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Project brief</label>
            <textarea
              required
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what you're building..."
              className="mt-1.5 w-full px-3 py-2.5 rounded-md bg-white/5 border border-border/60 text-sm placeholder:text-muted-foreground/60 outline-none focus:border-brand-blue/60"
            />
          </div>
          <button
            disabled={submitting}
            className="h-11 px-6 rounded-lg text-sm font-medium bg-gradient-to-r from-brand-blue to-brand-violet text-primary-foreground glow-primary disabled:opacity-50"
          >
            {submitting ? "Sending…" : "Send inquiry"}
          </button>
        </form>

        <div className="lg:col-span-2 space-y-4">
          {[
            { i: Mail, t: "Email", v: "hello@juanet.com" },
            { i: Phone, t: "Phone", v: "+254 700 000 000" },
            { i: MapPin, t: "Office", v: "Nairobi, Kenya" },
          ].map((c) => (
            <div key={c.t} className="glass rounded-2xl p-5 flex items-start gap-4">
              <span className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-brand-blue/30 to-brand-violet/30 border border-white/10">
                <c.i className="h-5 w-5 text-brand-cyan" />
              </span>
              <div>
                <div className="text-xs text-muted-foreground">{c.t}</div>
                <div className="font-medium">{c.v}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function Field({
  label,
  ...rest
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      <input
        {...rest}
        className="mt-1.5 w-full h-10 px-3 rounded-md bg-white/5 border border-border/60 text-sm placeholder:text-muted-foreground/60 outline-none focus:border-brand-blue/60"
      />
    </div>
  );
}
