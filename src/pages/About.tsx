import PageShell from "@/components/PageShell";
import { useLang } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function About() {
  const { t, dir } = useLang();

  const blocks = [1, 2, 3].map((i) => ({
    title: t((`about.blocks.${i}.title`) as any),
    desc: t((`about.blocks.${i}.desc`) as any),
  }));

  return (
    <PageShell title={t("about.title")} lede={t("about.lede")}>
      <div className="grid gap-4 md:grid-cols-3">
        {blocks.map((b) => (
          <Card key={b.title} className="rounded-2xl border bg-card/85 p-6">
            <div className={cn("font-display text-2xl", dir === "rtl" && "text-right")}>{b.title}</div>
            <p className={cn("mt-3 text-sm text-muted-foreground", dir === "rtl" && "text-right")}>{b.desc}</p>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
