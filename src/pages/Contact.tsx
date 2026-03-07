import { useMemo, useState } from "react";
import { toast } from "sonner";
import PageShell from "@/components/PageShell";
import SEO from "@/components/SEO";
import { useLang } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Mail, MapPin, Phone } from "lucide-react";

import checklistImg from "@/assets/infographics/quote-checklist.png";

type ServiceType = "import" | "export" | "unsure";
type TempControl = "yes" | "no" | "unsure";

export default function Contact() {
  const { t, dir, lang } = useLang();

  const apiUrl = useMemo(() => {
    const v = import.meta.env.VITE_LEADS_API_URL as string | undefined;
    return v && v.trim().length ? v : "/api/leads";
  }, []);

  const [service, setService] = useState<ServiceType>("unsure");
  const [product, setProduct] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [quantity, setQuantity] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [tempControl, setTempControl] = useState<TempControl>("unsure");
  const [docs, setDocs] = useState("");

  const [form, setForm] = useState({ name: "", email: "", phone: "", topic: "", message: "" });
  const [loading, setLoading] = useState(false);

  function buildMessage() {
    const lines = [
      "QUOTE REQUEST DETAILS",
      `Service: ${service}`,
      product ? `Product: ${product}` : null,
      quantity ? `Quantity/Weight/Volume: ${quantity}` : null,
      origin ? `Origin: ${origin}` : null,
      destination ? `Destination: ${destination}` : null,
      deliveryDate ? `Desired delivery date: ${deliveryDate}` : null,
      tempControl ? `Temperature control: ${tempControl}` : null,
      docs ? `Documents available: ${docs}` : null,
      "",
      "Message",
      form.message || "",
    ].filter(Boolean);

    return lines.join("\n");
  }

  return (
    <>
      <SEO
        title="Contact Met71 Spain"
        description="Request a quote or ask about a shipment. Tell us what you’re moving, origin/destination, and timing—Met71 Spain will coordinate the next steps."
        path="/contact"
      />
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
                  const topicPrefix = service === "unsure" ? "Quote request" : `Quote request (${service})`;
                  const payload = {
                    ...form,
                    topic: form.topic?.trim().length ? `${topicPrefix} — ${form.topic}` : topicPrefix,
                    message: buildMessage(),
                    lang,
                    source_page: "contact",
                  };

                  const r = await fetch(apiUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                  });

                  if (!r.ok) {
                    const txt = await r.text();
                    throw new Error(txt || `HTTP ${r.status}`);
                  }

                  toast.success("Sent. We'll follow up soon.", { id: toastId });

                  setForm({ name: "", email: "", phone: "", topic: "", message: "" });
                  setService("unsure");
                  setProduct("");
                  setOrigin("");
                  setDestination("");
                  setQuantity("");
                  setDeliveryDate("");
                  setTempControl("unsure");
                  setDocs("");
                } catch {
                  toast.error("Send failed. Please check API deployment or VITE_LEADS_API_URL.", { id: toastId });
                } finally {
                  setLoading(false);
                }
              }}
              className="grid gap-4"
            >
              <div className="grid gap-2">
                <Label className={cn(dir === "rtl" && "text-right")}>Service</Label>
                <div className={cn("flex flex-wrap gap-2", dir === "rtl" && "flex-row-reverse")}>
                  {([
                    { v: "import", label: "Import" },
                    { v: "export", label: "Export" },
                    { v: "unsure", label: "Not sure" },
                  ] as const).map((x) => (
                    <button
                      key={x.v}
                      type="button"
                      onClick={() => setService(x.v)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm transition",
                        service === x.v ? "bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]" : "bg-background hover:bg-[var(--sand)]",
                      )}
                    >
                      {x.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label className={cn(dir === "rtl" && "text-right")}>Product category</Label>
                  <Input value={product} onChange={(e) => setProduct(e.target.value)} placeholder="e.g., vehicles, firefighting equipment, agriculture, fertilizers" />
                </div>
                <div className="grid gap-2">
                  <Label className={cn(dir === "rtl" && "text-right")}>Quantity / weight / volume</Label>
                  <Input value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="e.g., 2 cars, 1 pallet, 500kg, 2m³" />
                </div>
                <div className="grid gap-2">
                  <Label className={cn(dir === "rtl" && "text-right")}>Origin</Label>
                  <Input value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="City + country" />
                </div>
                <div className="grid gap-2">
                  <Label className={cn(dir === "rtl" && "text-right")}>Destination</Label>
                  <Input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="City + country" />
                </div>
                <div className="grid gap-2">
                  <Label className={cn(dir === "rtl" && "text-right")}>Desired delivery date</Label>
                  <Input value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} placeholder="YYYY-MM-DD or timeframe" />
                </div>
                <div className="grid gap-2">
                  <Label className={cn(dir === "rtl" && "text-right")}>Temperature control</Label>
                  <select
                    className="h-10 rounded-md border bg-background px-3 text-sm"
                    value={tempControl}
                    onChange={(e) => setTempControl(e.target.value as TempControl)}
                  >
                    <option value="unsure">Not sure</option>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label className={cn(dir === "rtl" && "text-right")}>Documents available</Label>
                <Input value={docs} onChange={(e) => setDocs(e.target.value)} placeholder="e.g., invoice, packing list, certificates, photos" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label className={cn(dir === "rtl" && "text-right")}>{t("contact.form.name")}</Label>
                  <Input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} placeholder={t("contact.form.name")} />
                </div>
                <div className="grid gap-2">
                  <Label className={cn(dir === "rtl" && "text-right")}>{t("contact.form.email")}</Label>
                  <Input value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} type="email" placeholder="name@company.com" />
                </div>
              </div>

              <div className="grid gap-2">
                <Label className={cn(dir === "rtl" && "text-right")}>{t("contact.form.phone")}</Label>
                <Input value={form.phone} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} placeholder={t("contact.form.phone")} />
              </div>

              <div className="grid gap-2">
                <Label className={cn(dir === "rtl" && "text-right")}>{t("contact.form.topic")}</Label>
                <Input value={form.topic} onChange={(e) => setForm((s) => ({ ...s, topic: e.target.value }))} placeholder="e.g., urgent shipment, recurring lane, compliance help" />
              </div>
              <div className="grid gap-2">
                <Label className={cn(dir === "rtl" && "text-right")}>{t("contact.form.message")}</Label>
                <Textarea value={form.message} onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))} placeholder={t("contact.form.message")} className="min-h-32" />
              </div>

              <div className={cn("flex items-center justify-between gap-3", dir === "rtl" && "flex-row-reverse")}>
                <div className="text-xs text-muted-foreground">The more detail you share, the faster we can quote.</div>
                <Button disabled={loading} type="submit" className="rounded-full bg-[var(--orange)] text-[var(--ink)] hover:bg-[var(--orange)]/90">
                  {loading ? "..." : t("contact.form.send")}
                </Button>
              </div>
            </form>
          </Card>

          <div className="lg:col-span-5 grid gap-6">
            <Card className="overflow-hidden rounded-3xl border bg-[var(--sand)]">
              <img src={checklistImg} alt="Quote request checklist infographic" className="w-full" loading="lazy" decoding="async" />
            </Card>

            <Card className="rounded-2xl border bg-[var(--ink)] text-[var(--paper)] p-6">
              <div className={cn("font-display text-3xl", dir === "rtl" && "text-right")}>Met71 Spain</div>
              <p className={cn("mt-2 text-sm text-[var(--paper)]/80", dir === "rtl" && "text-right")}>
                {t("about.lede")}
              </p>

              <div className={cn("mt-6 space-y-4 text-sm", dir === "rtl" && "text-right")}>
                <div className={cn("flex items-start gap-3", dir === "rtl" && "flex-row-reverse")}>
                  <Mail className="mt-0.5 h-4 w-4 text-[var(--orange)]" />
                  <div>
                    <div className="text-xs text-[var(--paper)]/60">Email</div>
                    <div>exports@met71spain.com</div>
                  </div>
                </div>

                <div className={cn("flex items-start gap-3", dir === "rtl" && "flex-row-reverse")}>
                  <Phone className="mt-0.5 h-4 w-4 text-[var(--orange)]" />
                  <div>
                    <div className="text-xs text-[var(--paper)]/60">Phone</div>
                    <div>+34 685 063 079</div>
                  </div>
                </div>

                <div className={cn("flex items-start gap-3", dir === "rtl" && "flex-row-reverse")}>
                  <MapPin className="mt-0.5 h-4 w-4 text-[var(--orange)]" />
                  <div>
                    <div className="text-xs text-[var(--paper)]/60">Address</div>
                    <div>CALLE SAN FERNANDO, NUM 33, 03001 ALACANT/ALICANTE (ALICANTE)</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </PageShell>
    </>
  );
}
