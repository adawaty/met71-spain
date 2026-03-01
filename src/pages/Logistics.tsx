import portImg from "@/assets/hero-port.jpg";
import docsImg from "@/assets/customs-docs.jpg";

import PageShell from "@/components/PageShell";
import { useLang } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ClipboardCheck, ThermometerSnowflake, Route, FileCheck2, ShieldAlert, Boxes } from "lucide-react";

import type { ElementType } from "react";

function Step({ icon: Icon, title, desc }: { icon: ElementType; title: string; desc: string }) {
  const { dir } = useLang();
  return (
    <Card className="rounded-2xl border bg-card/85 p-6">
      <div className={cn("flex items-center gap-3", dir === "rtl" && "flex-row-reverse")}
      >
        <div className="h-11 w-11 rounded-2xl border bg-[var(--sand)] grid place-items-center">
          <Icon className="h-5 w-5 text-[var(--ink)]" />
        </div>
        <div className={cn("font-display text-2xl", dir === "rtl" && "text-right")}>{title}</div>
      </div>
      <p className={cn("mt-3 text-sm text-muted-foreground", dir === "rtl" && "text-right")}>{desc}</p>
    </Card>
  );
}

export default function Logistics() {
  const { t, dir } = useLang();

  const blocks = [
    { icon: ThermometerSnowflake, title: t("logistics.blocks.1.title"), desc: t("logistics.blocks.1.desc"), tone: "bg-card/90" },
    { icon: ClipboardCheck, title: t("logistics.blocks.2.title"), desc: t("logistics.blocks.2.desc"), tone: "bg-[var(--sand)]" },
    { icon: Route, title: t("logistics.blocks.3.title"), desc: t("logistics.blocks.3.desc"), tone: "bg-[var(--ink)] text-[var(--paper)]" },
  ];

  return (
    <PageShell title={t("logistics.title")} lede={t("logistics.lede")}>
      <div className="relative overflow-hidden rounded-3xl border bg-[var(--sand)]">
        <img src={portImg} alt="Port operations" className="h-[260px] w-full object-cover md:h-[340px]" loading="lazy" />
        <div className="pointer-events-none absolute inset-0" style={{ boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)" }} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {blocks.map((b) => {
          const Icon = b.icon;
          const dark = b.tone.includes("text-[var(--paper)]");
          return (
            <Card key={b.title} className={cn("rounded-2xl border p-6", b.tone)}>
              <div className={cn("flex items-center gap-3", dir === "rtl" && "flex-row-reverse")}>
                <div className={cn("h-11 w-11 rounded-2xl border grid place-items-center", dark ? "bg-background/10" : "bg-background/60")}
                >
                  <Icon className={cn("h-5 w-5", dark ? "text-[var(--orange)]" : "text-[var(--ink)]")} />
                </div>
                <div className={cn("font-display text-2xl", dir === "rtl" && "text-right")}>{b.title}</div>
              </div>
              <p className={cn("mt-4 text-sm", dark ? "text-[var(--paper)]/80" : "text-muted-foreground", dir === "rtl" && "text-right")}
              >
                {b.desc}
              </p>
            </Card>
          );
        })}
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-12 lg:items-start">
        <div className={cn("lg:col-span-7 space-y-4", dir === "rtl" && "lg:col-start-6")}
        >
          <div className={cn("font-display text-3xl", dir === "rtl" && "text-right")}>How we manage risk</div>
          <div className="grid gap-4 md:grid-cols-2">
            <Step icon={FileCheck2} title="Document trail" desc="Each shipment has a tracked paperwork set (commercial invoice, packing list, certificates when needed) aligned to milestones." />
            <Step icon={Boxes} title="Handoffs" desc="We plan each handoff point (supplier → freight → clearance → last mile) to reduce delays and ambiguous responsibility." />
            <Step icon={ShieldAlert} title="Compliance-first" desc="We validate shipment requirements early to avoid last-minute customs surprises. (Exact requirements vary by product and destination.)" />
            <Step icon={Route} title="Predictability" desc="We keep timelines realistic and update stakeholders when constraints change (weather, port congestion, documentation corrections)." />
          </div>
        </div>

        <div className={cn("lg:col-span-5", dir === "rtl" && "lg:col-start-1")}
        >
          <Card className="overflow-hidden rounded-3xl border bg-card/90">
            <img src={docsImg} alt="Customs documentation" className="h-[360px] w-full object-cover" loading="lazy" />
            <div className="p-5">
              <div className={cn("font-display text-2xl", dir === "rtl" && "text-right")}>Customs  documentation</div>
              <p className={cn("mt-2 text-sm text-muted-foreground", dir === "rtl" && "text-right")}
              >
                Practical paperwork support: accuracy, consistency, and timing. We treat documents as part of operations, not an afterthought.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
