import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowUpRight, Globe, Menu, X, Mail, MapPin, Phone, Home, Info, BriefcaseBusiness, Boxes, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLang } from "@/contexts/LanguageContext";

import logoImg from "@/assets/met71-logo-512.webp";

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

function MobileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t, dir } = useLang();
  const [location] = useLocation();

  const nav = useMemo(
    () => [
      { href: "/", key: "nav.home" as const },
      { href: "/about", key: "nav.about" as const },
      { href: "/services", key: "nav.services" as const },
      { href: "/industries", key: "nav.industries" as const },
      { href: "/logistics", key: "nav.logistics" as const },
      { href: "/contact", key: "nav.contact" as const },
    ],
    [],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    // lock scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    // close after navigation
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999]">
      <button
        className="absolute inset-0 bg-black/55"
        aria-label="Close menu"
        onClick={onClose}
      />

      <div
        className={cn(
          "absolute top-0 h-full w-[86%] max-w-sm bg-background shadow-2xl border",
          dir === "rtl" ? "left-0 border-r" : "right-0 border-l",
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="p-4 border-b grain">
          <div className={cn("flex items-center justify-between gap-3", dir === "rtl" && "flex-row-reverse")}
          >
            <div className={cn("flex items-center gap-3", dir === "rtl" && "flex-row-reverse")}
            >
              <div className="h-12 w-12 rounded-2xl border bg-[var(--sand)] grid place-items-center overflow-hidden">
                <img src={logoImg} alt="Met71 logo" className="h-full w-full object-contain" />
              </div>
              <div className={cn("leading-tight", dir === "rtl" && "text-right")}
              >
                <div className="font-display text-xl leading-none">{t("meta.company")}</div>
                <div className="text-[11px] text-muted-foreground">{t("meta.tagline")}</div>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className={cn("mt-4 flex items-center gap-2", dir === "rtl" && "flex-row-reverse")}
          >
            <Globe className="h-4 w-4 text-muted-foreground" />
            <LangPill code="en" label="EN" />
            <LangPill code="es" label="ES" />
            <LangPill code="ar" label="AR" />
          </div>
        </div>

        <div className="p-4 grid gap-2">
          {nav.map((n) => {
            const active = location === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "rounded-xl border px-4 py-3 text-sm transition",
                  "bg-card/70 hover:bg-[var(--sand)]",
                  dir === "rtl" && "text-right",
                  active && "bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)] hover:bg-[var(--ink)]",
                )}
              >
                {t(n.key)}
              </Link>
            );
          })}
        </div>

        <div className="mt-auto p-4 border-t space-y-3">
          <div className={cn("space-y-2 text-xs text-muted-foreground", dir === "rtl" && "text-right")}
          >
            <div className={cn("flex items-start gap-2", dir === "rtl" && "flex-row-reverse")}
            >
              <Phone className="mt-0.5 h-3.5 w-3.5" />
              <span>+34 685 063 079</span>
            </div>
            <div className={cn("flex items-start gap-2", dir === "rtl" && "flex-row-reverse")}
            >
              <Mail className="mt-0.5 h-3.5 w-3.5" />
              <span>exports@met71spain.com</span>
            </div>
            <div className={cn("flex items-start gap-2", dir === "rtl" && "flex-row-reverse")}
            >
              <MapPin className="mt-0.5 h-3.5 w-3.5" />
              <span>CALLE SAN FERNANDO, NUM 33, 03001 ALACANT/ALICANTE</span>
            </div>
          </div>

          <Link href="/contact">
            <Button className="w-full rounded-full bg-[var(--orange)] text-[var(--ink)] hover:bg-[var(--orange)]/90">
              {t("cta.primary")} <ArrowUpRight className={cn("h-4 w-4", dir === "rtl" && "rotate-180")} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function MobileDock() {
  const { t, dir } = useLang();
  const [location] = useLocation();

  const items = [
    { href: "/", label: t("nav.home"), Icon: Home },
    { href: "/about", label: t("nav.about"), Icon: Info },
    { href: "/services", label: t("nav.services"), Icon: BriefcaseBusiness },
    { href: "/industries", label: t("nav.industries"), Icon: Boxes },
    { href: "/contact", label: t("nav.contact"), Icon: MessageCircle },
  ];

  return (
    <nav
      className={cn(
        "fixed bottom-3 left-1/2 z-40 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 rounded-3xl border bg-background/90 backdrop-blur-md shadow-lg lg:hidden",
        "px-2 py-2",
      )}
      aria-label="Mobile navigation"
    >
      <div className={cn("flex items-center justify-between", dir === "rtl" && "flex-row-reverse")}
      >
        {items.map(({ href, label, Icon }) => {
          const active = location === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex w-[20%] flex-col items-center justify-center gap-1 rounded-2xl py-2 text-[11px] transition",
                active ? "bg-[var(--ink)] text-[var(--paper)]" : "text-muted-foreground hover:bg-[var(--sand)]",
              )}
            >
              <Icon className={cn("h-4 w-4", active && "text-[var(--orange)]")} />
              <span className={cn("truncate", dir === "rtl" && "text-[10px]")}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function SiteHeader() {
  const { t, dir } = useLang();
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  const nav = [
    { href: "/", key: "nav.home" as const },
    { href: "/about", key: "nav.about" as const },
    { href: "/services", key: "nav.services" as const },
    { href: "/industries", key: "nav.industries" as const },
    { href: "/logistics", key: "nav.logistics" as const },
    { href: "/contact", key: "nav.contact" as const },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/85 backdrop-blur grain">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className={cn("flex items-center gap-3", dir === "rtl" && "flex-row-reverse")}
            >
              <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl border bg-[var(--sand)] grid place-items-center overflow-hidden">
                <img src={logoImg} alt="Met71 logo" className="h-full w-full object-contain" loading="lazy" />
              </div>
              <div className={cn("leading-tight", dir === "rtl" && "text-right")}
              >
                <div className="font-display text-xl md:text-2xl">{t("meta.company")}</div>
                <div className="text-xs md:text-sm text-muted-foreground">{t("meta.tagline")}</div>
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

            <div className={cn("flex items-center gap-2", dir === "rtl" && "flex-row-reverse")}
            >
              <div className={cn("hidden md:flex items-center gap-2", dir === "rtl" && "flex-row-reverse")}
              >
                <Globe className="h-4 w-4 text-muted-foreground" />
                <LangPill code="en" label="EN" />
                <LangPill code="es" label="ES" />
                <LangPill code="ar" label="AR" />
              </div>

              <div className="lg:hidden">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={() => setOpen(true)}
                  aria-label="Open menu"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </div>

              <Link href="/contact">
                <Button className="rounded-full bg-[var(--orange)] text-[var(--ink)] hover:bg-[var(--orange)]/90 active:scale-[0.98] transition-transform">
                  {t("cta.primary")} <ArrowUpRight className={cn("h-4 w-4", dir === "rtl" && "rotate-180")} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <MobileDrawer open={open} onClose={() => setOpen(false)} />
      <MobileDock />
    </>
  );
}

export function SiteFooter() {
  const { t, dir } = useLang();
  return (
    <footer className="border-t bg-[var(--sand)] grain">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className={cn("flex flex-col gap-4 md:flex-row md:items-center md:justify-between", dir === "rtl" && "md:flex-row-reverse")}
        >
          <div className={cn("flex items-center gap-3", dir === "rtl" && "flex-row-reverse")}>
            <div className="h-16 w-16 md:h-20 md:w-20 rounded-3xl border bg-background/60 grid place-items-center overflow-hidden">
              <img src={logoImg} alt="Met71 logo" className="h-full w-full object-contain" loading="lazy" />
            </div>
            <div className={cn("space-y-1", dir === "rtl" && "text-right")}>
              <div className="font-display text-2xl md:text-3xl leading-none">Met71 Spain</div>
              <div className="text-sm text-muted-foreground">{t("footer.note")}</div>
            </div>
          </div>
          <div className={cn("flex items-center gap-3", dir === "rtl" && "flex-row-reverse")}
          >
            <LangPill code="en" label="EN" />
            <LangPill code="es" label="ES" />
            <LangPill code="ar" label="AR" />
          </div>
        </div>
      </div>
    </footer>
  );
}
