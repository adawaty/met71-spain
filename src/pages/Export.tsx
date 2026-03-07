import SEO from "@/components/SEO";
import PageShell from "@/components/PageShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { useLang } from "@/contexts/LanguageContext";

import exportFlow from "@/assets/infographics/export-flow.png";
import agriImg from "@/assets/product-agri.jpg";
import fertilizerImg from "@/assets/product-fertilizer.jpg";
import coldchainImg from "@/assets/product-coldchain.jpg";

export default function ExportService() {
  const { dir } = useLang();

  return (
    <>
      <SEO
        title="Export Services (North Africa → Europe)"
        description="Agricultural exports and fertilizers with optional cold-chain handling—planned, documented, and delivered with measurable logistics coordination."
        path="/export"
      />

      <PageShell title="Export (North Africa → Europe)" lede="Quality, documentation, and logistics—aligned so shipments arrive as expected.">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <Card className="rounded-3xl border bg-card/90 p-6">
              <h2 className={cn("font-display text-2xl", dir === "rtl" && "text-right")}>What we export</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Card className="rounded-2xl border bg-[var(--sand)] p-4">
                  <div className="text-sm font-medium">Agricultural products</div>
                  <p className="mt-2 text-sm text-muted-foreground">Packaging guidance, partner coordination, and export-ready documentation.</p>
                </Card>
                <Card className="rounded-2xl border bg-[var(--sand)] p-4">
                  <div className="text-sm font-medium">Fertilizers & agri inputs</div>
                  <p className="mt-2 text-sm text-muted-foreground">Compliance and logistics planning for predictable delivery.</p>
                </Card>
                <Card className="rounded-2xl border bg-[var(--sand)] p-4 md:col-span-2">
                  <div className="text-sm font-medium">Cold-chain (when required)</div>
                  <p className="mt-2 text-sm text-muted-foreground">Temperature planning and monitoring coordination for sensitive shipments.</p>
                </Card>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/contact">
                  <Button className="rounded-full bg-[var(--orange)] text-[var(--ink)] hover:bg-[var(--orange)]/90">Request an export quote</Button>
                </Link>
                <Link href="/services">
                  <Button variant="outline" className="rounded-full">See all services</Button>
                </Link>
              </div>
            </Card>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <Card className="overflow-hidden rounded-3xl border bg-card/90 md:col-span-2">
                <img src={agriImg} alt="Agricultural export products prepared for shipment" className="h-48 w-full object-cover" loading="lazy" decoding="async" />
                <div className="p-5">
                  <div className="font-medium">Agriculture</div>
                  <p className="mt-2 text-sm text-muted-foreground">Export planning that protects quality and reduces documentation friction.</p>
                </div>
              </Card>
              <Card className="overflow-hidden rounded-3xl border bg-card/90">
                <img src={fertilizerImg} alt="Fertilizer and agri inputs export logistics" className="h-48 w-full object-cover" loading="lazy" decoding="async" />
                <div className="p-5">
                  <div className="font-medium">Fertilizers</div>
                  <p className="mt-2 text-sm text-muted-foreground">Compliance-first coordination from origin to destination.</p>
                </div>
              </Card>
              <Card className="overflow-hidden rounded-3xl border bg-card/90 md:col-span-3">
                <img src={coldchainImg} alt="Cold chain logistics and temperature-controlled transport" className="h-52 w-full object-cover" loading="lazy" decoding="async" />
                <div className="p-5">
                  <div className="font-medium">Cold-chain optionality</div>
                  <p className="mt-2 text-sm text-muted-foreground">When the product demands it, we coordinate the partners and workflow to maintain temperature control.</p>
                </div>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-5">
            <Card className="overflow-hidden rounded-3xl border bg-[var(--sand)]">
              <img src={exportFlow} alt="Export process flow: readiness, quality checks, optional cold-chain, documentation, freight" className="w-full" loading="lazy" decoding="async" />
            </Card>

            <Card className="mt-6 rounded-3xl border bg-[var(--ink)] p-6 text-[var(--paper)]">
              <div className="font-display text-2xl">Our value</div>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--paper)]/85">
                <li>Quality and documentation aligned before freight booking</li>
                <li>Cold-chain coordination when the shipment requires it</li>
                <li>Clear communication across stakeholders to reduce handoff risk</li>
              </ul>
            </Card>
          </div>
        </div>
      </PageShell>
    </>
  );
}
