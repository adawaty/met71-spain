import { cn } from "@/lib/utils";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { useLang } from "@/contexts/LanguageContext";

export default function PageShell({
  title,
  lede,
  children,
}: {
  title: string;
  lede?: string;
  children: React.ReactNode;
}) {
  const { dir } = useLang();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="grain" aria-label="Main content">
        <section className="mx-auto max-w-6xl px-4 pt-12 pb-8">
          <div className={cn("max-w-3xl", dir === "rtl" && "ml-auto text-right")}>
            <h1 className="font-display text-4xl md:text-6xl leading-[0.95] tracking-tight">{title}</h1>
            {lede ? <p className="mt-5 text-lg text-muted-foreground">{lede}</p> : null}
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-4 pb-28 lg:pb-16">{children}</section>
      </main>
      <SiteFooter />
    </div>
  );
}
