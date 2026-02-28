import heroImg from "@/assets/met71-hero.png";
import { ArrowRight, ShieldCheck, Ship, Wheat } from "lucide-react";
import { Link } from "wouter";

import PageShell from "@/components/PageShell";
import { useLang } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  const { t, dir } = useLang();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageShell title={t("home.hero.title")} lede={t("home.hero.subtitle")}>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          <div className={cn("lg:col-span-7", dir === "rtl" && "lg:col-start-6")}
          >
            <div className={cn("space-y-3", dir === "rtl" && "text-right")}>
              <ul className="space-y-2 text-sm md:text-base">
                <li className={cn("flex items-start gap-2", dir === "rtl" && "flex-row-reverse")}
                >
                  <ShieldCheck className="mt-0.5 h-5 w-5 text-[var(--orange)]" />
                  <span>{t("home.hero.points.1")}</span>
                </li>
                <li className={cn("flex items-start gap-2", dir === "rtl" && "flex-row-reverse")}
                >
                  <Wheat className="mt-0.5 h-5 w-5 text-[var(--teal)]" />
                  <span>{t("home.hero.points.2")}</span>
                </li>
                <li className={cn("flex items-start gap-2", dir === "rtl" && "flex-row-reverse")}
                >
                  <Ship className="mt-0.5 h-5 w-5 text-[var(--ink)]" />
                  <span>{t("home.hero.points.3")}</span>
                </li>
              </ul>

              <div className={cn("flex flex-wrap gap-3 pt-4", dir === "rtl" && "flex-row-reverse")}
              >
                <Link href="/contact">
                  <Button className="rounded-full bg-[var(--orange)] text-[var(--ink)] hover:bg-[var(--orange)]/90">
                    {t("cta.primary")} <ArrowRight className={cn("h-4 w-4", dir === "rtl" && "rotate-180")} />
                  </Button>
                </Link>
                <Link href="/services">
                  <Button variant="outline" className="rounded-full">
                    {t("cta.secondary")}
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-10 grid gap-3 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="rounded-2xl border bg-card/80 p-4">
                  <div className="text-xs text-muted-foreground">{t((`home.stats.${i}.title`) as any)}</div>
                  <div className="mt-2 text-sm">{t((`home.stats.${i}.desc`) as any)}</div>
                </Card>
              ))}
            </div>
          </div>

          <div className={cn("lg:col-span-5", dir === "rtl" && "lg:col-start-1")}
          >
            <div className="relative overflow-hidden rounded-3xl border bg-[var(--sand)]">
              <img src={heroImg} alt="Met71 trade routes illustration" className="h-[320px] w-full object-cover md:h-[420px]" />
              <div className="pointer-events-none absolute inset-0" style={{ boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)" }} />
            </div>

            <div className="mt-6 grid gap-3">
              <Card className="rounded-2xl border bg-[var(--ink)] text-[var(--paper)] p-5">
                <div className="font-display text-2xl">{t("home.services.import.title")}</div>
                <p className="mt-2 text-sm text-[var(--paper)]/80">{t("home.services.import.desc")}</p>
              </Card>
              <Card className="rounded-2xl border bg-card/90 p-5">
                <div className="font-display text-2xl">{t("home.services.export.title")}</div>
                <p className="mt-2 text-sm text-muted-foreground">{t("home.services.export.desc")}</p>
              </Card>
              <Card className="rounded-2xl border bg-[var(--sand)] p-5">
                <div className="font-display text-2xl">{t("home.services.trade.title")}</div>
                <p className="mt-2 text-sm text-muted-foreground">{t("home.services.trade.desc")}</p>
              </Card>
            </div>
          </div>
        </div>
      </PageShell>
    </div>
  );
}
