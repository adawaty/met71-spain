import { useMemo, useState } from "react";
import { toast } from "sonner";
import PageShell from "@/components/PageShell";
import { useLang } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function Contact() {
  const { t, dir, lang } = useLang();

  const apiUrl = useMemo(() => {
    const v = import.meta.env.VITE_LEADS_API_URL as string | undefined;
    return v && v.trim().length ? v : "/api/leads";
  }, []);

  const [form, setForm] = useState({ name: "", email: "", phone: "", topic: "", message: "" });
  const [loading, setLoading] = useState(false);

  return (
    <PageShell title={t("contact.title")} lede={t("contact.lede")}>
      <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
        <Card className="rounded-2xl border bg-card/90 p-6 lg:col-span-7">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!form.name || !form.email || !form.message) {
                toast.error("Please fill name, email, and message");
                return;
              }

              setLoading(true);
              const toastId = toast.loading("Sending...");

              try {
                const r = await fetch(apiUrl, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    ...form,
                    lang,
                    source_page: "contact",
                  }),
                });

                if (!r.ok) {
                  const txt = await r.text();
                  throw new Error(txt || `HTTP ${r.status}`);
                }

                toast.success("Sent. We'll follow up soon.", { id: toastId });
                setForm({ name: "", email: "", phone: "", topic: "", message: "" });
              } catch (_err) {
                toast.error(
                  "Form is not connected yet. Set VITE_LEADS_API_URL or deploy the API.",
                  { id: toastId },
                );
              } finally {
                setLoading(false);
              }
            }}
            className="grid gap-4"
          >
            <div className="grid gap-2">
              <Label className={cn(dir === "rtl" && "text-right")}>{t("contact.form.name")}</Label>
              <Input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} placeholder={t("contact.form.name")} />
            </div>
            <div className="grid gap-2">
              <Label className={cn(dir === "rtl" && "text-right")}>{t("contact.form.email")}</Label>
              <Input value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} type="email" placeholder="name@company.com" />
            </div>
            <div className="grid gap-2">
              <Label className={cn(dir === "rtl" && "text-right")}>{t("contact.form.phone")}</Label>
              <Input value={form.phone} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} placeholder={t("contact.form.phone")} />
            </div>
            <div className="grid gap-2">
              <Label className={cn(dir === "rtl" && "text-right")}>{t("contact.form.topic")}</Label>
              <Input value={form.topic} onChange={(e) => setForm((s) => ({ ...s, topic: e.target.value }))} placeholder={t("contact.form.topic")} />
            </div>
            <div className="grid gap-2">
              <Label className={cn(dir === "rtl" && "text-right")}>{t("contact.form.message")}</Label>
              <Textarea value={form.message} onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))} placeholder={t("contact.form.message")} className="min-h-32" />
            </div>

            <div className={cn("flex items-center justify-between gap-3", dir === "rtl" && "flex-row-reverse")}>
              <div className="text-xs text-muted-foreground">{t("contact.note")}</div>
              <Button disabled={loading} type="submit" className="rounded-full bg-[var(--orange)] text-[var(--ink)] hover:bg-[var(--orange)]/90">
                {loading ? "..." : t("contact.form.send")}
              </Button>
            </div>
          </form>
        </Card>

        <Card className="rounded-2xl border bg-[var(--ink)] text-[var(--paper)] p-6 lg:col-span-5">
          <div className={cn("font-display text-3xl", dir === "rtl" && "text-right")}>Met71 Spain</div>
          <p className={cn("mt-2 text-sm text-[var(--paper)]/80", dir === "rtl" && "text-right")}
          >
            {t("about.lede")}
          </p>

          <div className={cn("mt-6 space-y-3 text-sm", dir === "rtl" && "text-right")}
          >
            <div>
              <div className="text-xs text-[var(--paper)]/60">Email</div>
              <div>info@met71.com</div>
            </div>
            <div>
              <div className="text-xs text-[var(--paper)]/60">Phone</div>
              <div>+34 XXX XXX XXX</div>
            </div>
            <div>
              <div className="text-xs text-[var(--paper)]/60">Locations</div>
              <div>Spain · Egypt</div>
            </div>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
