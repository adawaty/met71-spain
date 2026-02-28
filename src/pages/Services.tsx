import carsImg from "@/assets/product-cars.jpg";
import fireImg from "@/assets/product-fire.jpg";
import agriImg from "@/assets/product-agri.jpg";
import fertilizerImg from "@/assets/product-fertilizer.jpg";
import coldchainImg from "@/assets/product-coldchain.jpg";

import { CheckCircle2 } from "lucide-react";
import PageShell from "@/components/PageShell";
import { useLang } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function Bullets({ items }: { items: string[] }) {
  const { dir } = useLang();
  return (
    	<ul className="mt-4 space-y-2">
      {items.map((it) => (
        <li key={it} className={cn("flex items-start gap-2 text-sm", dir === "rtl" && "flex-row-reverse text-right")}>
          <CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--orange)]" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function ProductCard({ title, desc, img, tone }: { title: string; desc: string; img: string; tone: string }) {
  const { dir } = useLang();
  return (
    <Card className={cn("overflow-hidden rounded-2xl border", tone)}>
      <div className="relative">
        <img src={img} alt={title} className="h-40 w-full object-cover" loading="lazy" />
        <div className="pointer-events-none absolute inset-0" style={{ boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)" }} />
      </div>
      <div className="p-5">
        <div className={cn("font-display text-2xl", dir === "rtl" && "text-right")}>{title}</div>
        <p className={cn("mt-2 text-sm", tone.includes("text-[var(--paper)]") ? "text-[var(--paper)]/80" : "text-muted-foreground", dir === "rtl" && "text-right")}>
          {desc}
        </p>
      </div>
    </Card>
  );
}

export default function Services() {
  const { t, dir } = useLang();

  const importItems = [t("services.import.items.1"), t("services.import.items.2"), t("services.import.items.3")];
  const exportItems = [t("services.export.items.1"), t("services.export.items.2"), t("services.export.items.3")];
  const supportItems = [t("services.support.items.1"), t("services.support.items.2"), t("services.support.items.3")];

  return (
    <PageShell title={t("services.title")} lede={t("services.lede")}>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border bg-[var(--ink)] text-[var(--paper)] p-6">
          <div className={cn("font-display text-3xl", dir === "rtl" && "text-right")}>{t("services.import.title")}</div>
          <Bullets items={importItems} />
        </Card>

        <Card className="rounded-2xl border bg-card/90 p-6">
          <div className={cn("font-display text-3xl", dir === "rtl" && "text-right")}>{t("services.export.title")}</div>
          <Bullets items={exportItems} />
        </Card>

        <Card className="rounded-2xl border bg-[var(--sand)] p-6">
          <div className={cn("font-display text-3xl", dir === "rtl" && "text-right")}>{t("services.support.title")}</div>
          <Bullets items={supportItems} />
        </Card>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-5">
        <div className={cn("lg:col-span-2 space-y-2", dir === "rtl" && "text-right")}
        >
          <div className="font-display text-3xl">Products 																																				</div>
          <p className="text-sm text-muted-foreground">
            Representative visuals of the categories we handle across import/export and logistics.
          </p>
        </div>
        <div className="lg:col-span-3 grid gap-4 md:grid-cols-2">
          <ProductCard title="Premium vehicles" desc={t("home.services.import.desc")} img={carsImg} tone="bg-card/90" />
          <ProductCard title="Firefighting equipment" desc={t("industries.fire.desc")} img={fireImg} tone="bg-[var(--ink)] text-[var(--paper)]" />
          <ProductCard title="Agricultural products" desc={t("industries.agri.desc")} img={agriImg} tone="bg-[var(--sand)]" />
          <ProductCard title="Fertilizers" desc={t("services.export.items.2")} img={fertilizerImg} tone="bg-card/90" />
          <div className="md:col-span-2">
            <ProductCard title="Cold-chain logistics" desc={t("logistics.blocks.1.desc")} img={coldchainImg} tone="bg-card/90" />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
