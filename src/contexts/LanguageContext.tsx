import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Lang, TranslationKey } from "@/i18n/translations";
import { translations } from "@/i18n/translations";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  dir: "ltr" | "rtl";
  t: (k: TranslationKey) => string;
};

const LanguageContext = createContext<Ctx | null>(null);

function getInitialLang(): Lang {
  const saved = localStorage.getItem("met71.lang") as Lang | null;
  if (saved === "en" || saved === "es" || saved === "ar") return saved;

  const nav = (navigator.language || "").toLowerCase();
  if (nav.startsWith("ar")) return "ar";
  if (nav.startsWith("es")) return "es";
  return "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      return getInitialLang();
    } catch {
      return "en";
    }
  });

  const dir: "ltr" | "rtl" = lang === "ar" ? "rtl" : "ltr";

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("met71.lang", l);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    // Keep html attributes in sync for proper RTL
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const t = useMemo(() => {
    return (k: TranslationKey) => translations[lang][k] ?? translations.en[k] ?? k;
  }, [lang]);

  const value: Ctx = { lang, setLang, dir, t };
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
