import { Link, useLocation } from "wouter";
import { Globe, ArrowUpRight, Menu, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useLang } from "@/contexts/LanguageContext";

import logoImg from "@/assets/met71-logo.png";

function LangPill({ code, label }: { code: "en" | "es" | "ar"; label: string }) {
  const { lang, setLang } = useLang();
  return (
    <button
      onClick={() => setLang(code)}
      className={cn(
        "rounded-full border px-3 py-1 text-xs tracking-wide transition",
        lang === code
          ? "bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]"
          : "bg-transparent hover:bg-[var(--sand)] border-border",
      )}
      aria-pressed={lang === code}
    >
      {label}
    </button>
  );
}

export function SiteHeader() {
  const { t, dir } = useLang();
  const [location] = useLocation();

  const nav = [
    { href: "/", key: "nav.home" as const },
    { href: "/about", key: "nav.about" as const },
    { href: "/services", key: "nav.services" as const },
    { href: "/industries", key: "nav.industries" as const },
    { href: "/logistics", key: "nav.logistics" as const },
    { href: "/contact", key: "nav.contact" as const },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/85 backdrop-blur grain">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className={cn("flex items-center gap-3", dir === "rtl" && "flex-row-reverse")}>
            <div className="h-10 w-10 rounded-xl border bg-[var(--sand)] grid place-items-center overflow-hidden">
              <img src={logoImg} alt="Met71 logo" className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div className={cn("leading-tight", dir === "rtl" && "text-right")}>
              <div className="font-display text-lg">{t("meta.company")}</div>
              <div className="text-xs text-muted-foreground">{t("meta.tagline")}</div>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {nav.map((n) => {
              const active = location === n.href;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={cn(
                    "px-3 py-2 text-sm rounded-lg transition hover:bg-[var(--sand)]",
                    active && "bg-[var(--ink)] text-[var(--paper)] hover:bg-[var(--ink)]",
                  )}
                >
                  {t(n.key)}
                </Link>
              );
            })}
          </nav>

          <div className={cn("flex items-center gap-2", dir === "rtl" && "flex-row-reverse")}>
            {/* Mobile nav */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full" aria-label="Open menu">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side={dir === "rtl" ? "left" : "right"} className="grain">
                  <SheetHeader>
                    <SheetTitle className={cn("font-display", dir === "rtl" && "text-right")}>{t("meta.company")}</SheetTitle>
                  </SheetHeader>

                  <div className={cn("mt-6 flex items-center gap-2", dir === "rtl" && "flex-row-reverse")}>
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <LangPill code="en" label="EN" />
                    <LangPill code="es" label="ES" />
                    <LangPill code="ar" label="AR" />
                  </div>

                  <div className="mt-6 grid gap-2">
                    {nav.map((n) => (
                      <Link
                        key={n.href}
                        href={n.href}
                        className={cn(
                          "rounded-xl border bg-card/70 px-4 py-3 text-sm hover:bg-[var(--sand)]",
                          dir === "rtl" && "text-right",
                        )}
                      >
                        {t(n.key)}
                      </Link>
                    ))}
                  </div>

                  <div className="mt-6">
                    <Link href="/contact">
                      <Button className="w-full rounded-full bg-[var(--orange)] text-[var(--ink)] hover:bg-[var(--orange)]/90">
                        {t("cta.primary")} <ArrowUpRight className={cn("h-4 w-4", dir === "rtl" && "rotate-180")} />
                      </Button>
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop language */}
            <div className={cn("hidden md:flex items-center gap-2", dir === "rtl" && "flex-row-reverse")}>
              <Globe className="h-4 w-4 text-muted-foreground" />
              <LangPill code="en" label="EN" />
              <LangPill code="es" label="ES" />
              <LangPill code="ar" label="AR" />
            </div>

            <Link href="/contact">
              <Button className="rounded-full bg-[var(--orange)] text-[var(--ink)] hover:bg-[var(--orange)]/90">
                {t("cta.primary")} <ArrowUpRight className={cn("h-4 w-4", dir === "rtl" && "rotate-180")} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const { t, dir } = useLang();
  return (
    <footer className="border-t bg-[var(--sand)] grain">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className={cn("flex flex-col gap-4 md:flex-row md:items-center md:justify-between", dir === "rtl" && "md:flex-row-reverse")}>
          <div className={cn("space-y-1", dir === "rtl" && "text-right")}>
            <div className="font-display text-xl">Met71 Spain</div>
            <div className="text-sm text-muted-foreground">{t("footer.note")}</div>
          </div>
          <div className={cn("flex items-center gap-3", dir === "rtl" && "flex-row-reverse")}>
            <LangPill code="en" label="EN" />
            <LangPill code="es" label="ES" />
            <LangPill code="ar" label="AR" />
          </div>
        </div>
      </div>
    </footer>
  );
}
