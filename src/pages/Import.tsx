import SEO from "@/components/SEO";
import PageShell from "@/components/PageShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { useLang } from "@/contexts/LanguageContext";

import importFlow from "@/assets/infographics/import-flow.png";
import carsImg from "@/assets/product-cars.jpg";
import fireImg from "@/assets/product-fire.jpg";

export default function ImportService() {
  const { dir } = useLang();

  return (
    <>
      <SEO
        title="Import Services (Europe → North Africa)"
        description="Premium vehicle imports, firefighting equipment, and critical spares—sourced, documented, cleared, and delivered with a compliance-first workflow."
        path="/import"
      />

      <PageShell title="Import (Europe → North Africa)" lede="From sourcing to handover—one coordinated process, fewer delays.">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <Card className="rounded-3xl border bg-card/90 p-6">
              <h2 className={cn("font-display text-2xl", dir === "rtl" && "text-right")}>What we import</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Card className="rounded-2xl border bg-[var(--sand)] p-4">
                  <div className="text-sm font-medium">Premium European vehicles</div>
                  <p className="mt-2 text-sm text-muted-foreground">Sourcing support, documentation, and shipping coordination.</p>
                </Card>
                <Card className="rounded-2xl border bg-[var(--sand)] p-4">
                  <div className="text-sm font-medium">Firefighting equipment</div>
                  <p className="mt-2 text-sm text-muted-foreground">Critical equipment and spares where timing matters.</p>
                </Card>
                <Card className="rounded-2xl border bg-[var(--sand)] p-4 md:col-span-2">
                  <div className="text-sm font-medium">Spare parts & documentation-heavy shipments</div>
                  <p className="mt-2 text-sm text-muted-foreground">We manage paperwork as a workflow: tracked, reviewed, and aligned with milestones.</p>
                </Card>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/contact">
                  <Button className="rounded-full bg-[var(--orange)] text-[var(--ink)] hover:bg-[var(--orange)]/90">Request an import quote</Button>
                </Link>
                <Link href="/services">
                  <Button variant="outline" className="rounded-full">See all services</Button>
                </Link>
              </div>
            </Card>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <Card className="overflow-hidden rounded-3xl border bg-card/90">
                <img src={carsImg} alt="Premium European vehicle import logistics" className="h-48 w-full object-cover" loading="lazy" decoding="async" />
                <div className="p-5">
                  <div className="font-medium">Vehicles</div>
                  <p className="mt-2 text-sm text-muted-foreground">Documentation, compliance, and transport coordination from European suppliers to North Africa.</p>
                </div>
              </Card>
              <Card className="overflow-hidden rounded-3xl border bg-card/90">
                <img src={fireImg} alt="Firefighting equipment shipping and customs clearance" className="h-48 w-full object-cover" loading="lazy" decoding="async" />
                <div className="p-5">
                  <div className="font-medium">Fire Safety</div>
                  <p className="mt-2 text-sm text-muted-foreground">Critical imports with a compliance-first approach to reduce clearance risk.</p>
                </div>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-5">
            <Card className="overflow-hidden rounded-3xl border bg-[var(--sand)]">
              <img src={importFlow} alt="Import process flow: sourcing, documentation, customs, freight, delivery" className="w-full" loading="lazy" decoding="async" />
            </Card>

            <Card className="mt-6 rounded-3xl border bg-[var(--ink)] p-6 text-[var(--paper)]">
              <div className="font-display text-2xl">Our value</div>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--paper)]/85">
                <li>Compliance-first paperwork and customs alignment</li>
                <li>Predictable timelines via milestone-based coordination</li>
                <li>Single point of contact across suppliers, freight, and clearance</li>
              </ul>
            </Card>
          </div>
        </div>
      </PageShell>
    </>
  );
}
