import carImg from "@/assets/product-cars.jpg";
import fireImg from "@/assets/product-fire.jpg";
import agriImg from "@/assets/product-agri.jpg";

import { Flame, Tractor, Car } from "lucide-react";
import PageShell from "@/components/PageShell";
import { useLang } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function Industries() {
  const { t, dir } = useLang();

  const items = [
    {
      icon: Car,
      title: t("industries.auto.title"),
      desc: t("industries.auto.desc"),
      img: carImg,
      tone: "bg-card/90",
    },
    {
      icon: Flame,
      title: t("industries.fire.title"),
      desc: t("industries.fire.desc"),
      img: fireImg,
      tone: "bg-[var(--ink)] text-[var(--paper)]",
    },
    {
      icon: Tractor,
      title: t("industries.agri.title"),
      desc: t("industries.agri.desc"),
      img: agriImg,
      tone: "bg-[var(--sand)]",
    },
  ];

  return (
    <PageShell title={t("industries.title")} lede={t("industries.lede")}>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((it) => {
          const Icon = it.icon;
          const dark = it.tone.includes("text-[var(--paper)]");
          return (
            <Card key={it.title} className={cn("overflow-hidden rounded-2xl border", it.tone)}>
              <div className="relative">
                <img src={it.img} alt={it.title} className="h-40 w-full object-cover" loading="lazy" />
                <div className="pointer-events-none absolute inset-0" style={{ boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)" }} />
              </div>

              <div className="p-6">
                <div className={cn("flex items-center gap-3", dir === "rtl" && "flex-row-reverse")}>
                  <div className={cn("h-11 w-11 rounded-2xl border grid place-items-center", dark ? "bg-background/10" : "bg-background/60")}>
                    <Icon className={cn("h-5 w-5", dark ? "text-[var(--orange)]" : "text-[var(--ink)]")} />
                  </div>
                  <div className={cn("font-display text-2xl", dir === "rtl" && "text-right")}>{it.title}</div>
                </div>
                <p className={cn("mt-4 text-sm", dark ? "text-[var(--paper)]/80" : "text-muted-foreground", dir === "rtl" && "text-right")}>
                  {it.desc}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </PageShell>
  );
}
