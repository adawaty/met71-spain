import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, Send, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useLang } from "@/contexts/LanguageContext";

type Msg = { role: "user" | "assistant"; content: string };

export default function AIAssistant() {
  const { dir, lang, t } = useLang();

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(() => {
    try {
      const raw = localStorage.getItem("met71.ai.chat");
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string").slice(-12);
    } catch {
      return [];
    }
  });

  const placeholder = useMemo(() => {
    if (lang === "ar") return "اسأل عن الشحن، الجمارك، أو طلب عرض سعر...";
    if (lang === "es") return "Pregunta sobre logística, aduanas o solicita una cotización...";
    return "Ask about logistics, customs, or request a quote...";
  }, [lang]);

  const title = useMemo(() => {
    if (lang === "ar") return "مساعد Met71";
    if (lang === "es") return "Asistente Met71";
    return "Met71 Assistant";
  }, [lang]);

  const bottomHint = useMemo(() => {
    if (lang === "ar") return "تأكد من كتابة التفاصيل (المنشأ، الوجهة، النوع، التوقيت).";
    if (lang === "es") return "Incluye detalles (origen, destino, tipo, fecha).";
    return "Include details (origin, destination, type, timeline).";
  }, [lang]);

  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem("met71.ai.chat", JSON.stringify(messages.slice(-12)));
    } catch {
      // ignore
    }
  }, [messages]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [open, messages, loading]);

  async function send() {
    const msg = input.trim();
    if (!msg || loading) return;

    setInput("");
    setLoading(true);

    setMessages((prev) => [...prev, { role: "user", content: msg }]);

    try {
      const history = messages.slice(-10);
      const r = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, history, lang }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data?.ok) throw new Error("ai_failed");

      setMessages((prev) => [...prev, { role: "assistant", content: String(data.reply || "") }]);
    } catch {
      const fallback =
        lang === "ar"
          ? "حصل خطأ. حاول مرة أخرى بعد قليل."
          : lang === "es"
            ? "Ocurrió un error. Inténtalo de nuevo en un momento."
            : "Something went wrong. Please try again in a moment.";
      setMessages((prev) => [...prev, { role: "assistant", content: fallback }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "fixed z-40 bottom-24 right-4 lg:bottom-6 lg:right-6",
          "h-12 w-12 rounded-2xl border bg-[var(--ink)] text-[var(--paper)] shadow-lg",
          "grid place-items-center transition active:scale-[0.98]",
        )}
        aria-label="Open assistant"
      >
        <Bot className="h-5 w-5 text-[var(--orange)]" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50">
          <button
            className="absolute inset-0 bg-black/50"
            aria-label="Close"
            onClick={() => setOpen(false)}
          />

          <Card
            className={cn(
              "absolute right-4 left-4 bottom-24 lg:right-6 lg:left-auto lg:bottom-6",
              "w-auto lg:w-[420px] rounded-3xl border bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden",
            )}
          >
            <div className={cn("flex items-center justify-between gap-3 p-4 border-b", dir === "rtl" && "flex-row-reverse")}>
              <div className={cn("flex items-center gap-2", dir === "rtl" && "flex-row-reverse")}>
                <div className="h-9 w-9 rounded-2xl bg-[var(--sand)] border grid place-items-center">
                  <Bot className="h-4 w-4 text-[var(--ink)]" />
                </div>
                <div>
                  <div className="font-display text-lg leading-none">{title}</div>
                  <div className="text-xs text-muted-foreground">{t("meta.tagline")}</div>
                </div>
              </div>

              <Button variant="outline" size="icon" className="rounded-full" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div ref={listRef} className="max-h-[50vh] overflow-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className={cn("text-sm text-muted-foreground", dir === "rtl" && "text-right")}>
                  {lang === "ar"
                    ? "اسألني عن خدمات Met71 Spain أو اطلب عرض سعر."
                    : lang === "es"
                      ? "Pregúntame sobre los servicios de Met71 Spain o solicita una cotización."
                      : "Ask me about Met71 Spain services or request a quote."}
                </div>
              ) : null}

              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "rounded-2xl border px-3 py-2 text-sm whitespace-pre-wrap",
                    m.role === "user" ? "bg-[var(--sand)]" : "bg-card/80",
                    dir === "rtl" && "text-right",
                  )}
                >
                  {m.content}
                </div>
              ))}

              {loading ? (
                <div className={cn("text-xs text-muted-foreground", dir === "rtl" && "text-right")}>
                  {lang === "ar" ? "...يفكر" : lang === "es" ? "Pensando..." : "Thinking..."}
                </div>
              ) : null}
            </div>

            <div className="border-t p-4">
              <div className={cn("flex items-center gap-2", dir === "rtl" && "flex-row-reverse")}>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={placeholder}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") send();
                  }}
                />
                <Button className="rounded-2xl bg-[var(--orange)] text-[var(--ink)] hover:bg-[var(--orange)]/90" onClick={send} disabled={loading}>
                  <Send className={cn("h-4 w-4", dir === "rtl" && "rotate-180")} />
                </Button>
              </div>
              <div className={cn("mt-2 text-[11px] text-muted-foreground", dir === "rtl" && "text-right")}>{bottomHint}</div>
            </div>
          </Card>
        </div>
      ) : null}
    </>
  );
}
