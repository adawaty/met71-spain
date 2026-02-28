import PageShell from "@/components/PageShell";
import { useLang } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ClipboardCheck, ThermometerSnowflake, Route } from "lucide-react";

export default function Logistics() {
  const { t, dir } = useLang();

  const blocks = [
    { icon: ThermometerSnowflake, title: t("logistics.blocks.1.title"), desc: t("logistics.blocks.1.desc"), tone: "bg-card/90" },
    { icon: ClipboardCheck, title: t("logistics.blocks.2.title"), desc: t("logistics.blocks.2.desc"), tone: "bg-[var(--sand)]" },
    { icon: Route, title: t("logistics.blocks.3.title"), desc: t("logistics.blocks.3.desc"), tone: "bg-[var(--ink)] text-[var(--paper)]" },
  ];

  return (
    <PageShell title={t("logistics.title")} lede={t("logistics.lede")}>
      <div className="grid gap-4 md:grid-cols-3">
        {blocks.map((b) => {
          const Icon = b.icon;
          const dark = b.tone.includes("text-[var(--paper)]");
          return (
            <Card key={b.title} className={cn("rounded-2xl border p-6", b.tone)}>
              <div className={cn("flex items-center gap-3", dir === "rtl" && "flex-row-reverse")}
              >
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
    </PageShell>
  );
}
