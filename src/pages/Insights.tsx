import { Link } from "wouter";
import SEO from "@/components/SEO";
import PageShell from "@/components/PageShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const posts = [
  {
    slug: "incoterms-quick-guide",
    title: "Incoterms: a practical quick guide",
    date: "2026-03-07",
    excerpt:
      "A fast way to align responsibilities, costs, and risk across borders—without turning your shipment into a guessing game.",
    body: [
      "Incoterms define who is responsible for transport, insurance, and risk transfer at each leg of an international shipment.",
      "For quotes, the single most helpful detail is the Incoterm you want (EXW, FOB, CIF, DAP, etc.). If you’re unsure, tell us where you want responsibility to start and end.",
      "Tip: when comparing quotes, make sure everyone is quoting the same Incoterm and origin/destination points.",
    ],
  },
  {
    slug: "documents-that-prevent-delays",
    title: "Documents that prevent delays",
    date: "2026-03-07",
    excerpt:
      "Paperwork isn’t paperwork—it’s a workflow. Here’s what typically reduces clearance friction.",
    body: [
      "Delays often come from mismatched details across invoice, packing list, certificates, and transport documents.",
      "Before booking freight, confirm product description, HS code assumptions (if relevant), quantities/weights, and consignee details.",
      "If you already have drafts, send them—reviewing early is cheaper than fixing at the port.",
    ],
  },
] as const;

export default function Insights() {
  return (
    <>
      <SEO
        title="News & Insights"
        description="Practical notes on international trade, documentation, and logistics—written for operators who need predictable outcomes."
        path="/insights"
      />

      <PageShell title="News & Insights" lede="Practical trade notes, updates, and checklists—built for clarity.">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="grid gap-4">
              {posts.map((p) => (
                <Card key={p.slug} className="rounded-3xl border bg-card/90 p-6">
                  <div className="text-xs text-muted-foreground">{p.date}</div>
                  <div className="mt-2 font-display text-2xl">{p.title}</div>
                  <p className="mt-3 text-sm text-muted-foreground">{p.excerpt}</p>

                  <div className="mt-4 space-y-2 text-sm">
                    {p.body.map((x) => (
                      <p key={x}>{x}</p>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <Card className="rounded-3xl border bg-[var(--ink)] p-6 text-[var(--paper)]">
              <div className="font-display text-2xl">Want a tailored answer?</div>
              <p className="mt-2 text-sm text-[var(--paper)]/80">
                Tell us product, origin, destination, and timing—we’ll respond with the most practical path.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/contact">
                  <Button className="rounded-full bg-[var(--orange)] text-[var(--ink)] hover:bg-[var(--orange)]/90">Request a quote</Button>
                </Link>
                <Link href="/services">
                  <Button variant="outline" className="rounded-full border-[var(--paper)]/30 text-[var(--paper)] hover:bg-[var(--paper)]/10">Explore services</Button>
                </Link>
              </div>
            </Card>

            <Card className="mt-6 rounded-3xl border bg-[var(--sand)] p-6">
              <div className="font-display text-2xl">Editorial note</div>
              <p className="mt-2 text-sm text-muted-foreground">
                These posts are informational and intentionally high-level. For shipment-specific guidance, use the quote form.
              </p>
            </Card>
          </div>
        </div>
      </PageShell>
    </>
  );
}
