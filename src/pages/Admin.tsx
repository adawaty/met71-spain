import { useMemo, useState } from "react";
import { toast } from "sonner";
import PageShell from "@/components/PageShell";
import { useLang } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Lead = {
  id: number;
  created_at: string;
  name: string;
  email: string;
  phone?: string | null;
  topic?: string | null;
  message: string;
  lang?: string | null;
  source_page?: string | null;
  status: string;
  sales_note?: string | null;
};

const STATUSES = ["new", "contacted", "qualified", "won", "lost", "spam"] as const;

export default function Admin() {
  const { dir } = useLang();

  const apiBase = useMemo(() => {
    const v = import.meta.env.VITE_ADMIN_API_BASE as string | undefined;
    return v && v.trim().length ? v.replace(/\/$/, "") : "";
  }, []);

  const [token, setToken] = useState(() => localStorage.getItem("met71.adminToken") || "");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [items, setItems] = useState<Lead[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [offset, setOffset] = useState<number>(0);
  const limit = 25;
  const [loading, setLoading] = useState(false);

  async function fetchLeads(nextOffset = 0) {
    if (!token) {
      toast.error("Missing admin token");
      return;
    }
    setLoading(true);
    const toastId = toast.loading("Loading leads...");

    try {
      const url = new URL((apiBase || "") + "/api/admin/leads", window.location.origin);
      url.searchParams.set("limit", String(limit));
      url.searchParams.set("offset", String(nextOffset));
      if (statusFilter) url.searchParams.set("status", statusFilter);

      const r = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!r.ok) throw new Error(await r.text());
      const data = await r.json();
      setItems(data.items || []);
      setTotal(data.total || 0);
      setOffset(nextOffset);
      toast.success("Loaded", { id: toastId });
    } catch (_e) {
      toast.error("Failed to load. Check token / API base.", { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  async function updateLead(id: number, patch: Partial<Lead>) {
    if (!token) return toast.error("Missing admin token");
    try {
      const r = await fetch((apiBase || "") + `/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: patch.status, sales_note: patch.sales_note }),
      });
      if (!r.ok) throw new Error(await r.text());
      const data = await r.json();
      setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...data.item } : it)));
      toast.success("Updated");
    } catch (_e) {
      toast.error("Update failed");
    }
  }

  function exportCsv() {
    if (!token) return toast.error("Missing admin token");
    const url = new URL((apiBase || "") + "/api/admin/leads.csv", window.location.origin);
    if (statusFilter) url.searchParams.set("status", statusFilter);

    // Cannot set auth header for simple download; we pass token as query? not secure.
    // So we do a fetch and create a blob.
    (async () => {
      const toastId = toast.loading("Exporting CSV...");
      try {
        const r = await fetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } });
        if (!r.ok) throw new Error(await r.text());
        const blob = await r.blob();
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "met71-leads.csv";
        a.click();
        URL.revokeObjectURL(a.href);
        toast.success("Downloaded", { id: toastId });
      } catch (_e) {
        toast.error("Export failed", { id: toastId });
      }
    })();
  }

  return (
    <PageShell
      title="Admin — Leads"
      lede="Secure dashboard to manage enquiries stored in Neon."
    >
      <div className="grid gap-4 lg:grid-cols-12 lg:items-start">
        <Card className="rounded-2xl border bg-card/90 p-6 lg:col-span-4">
          <div className={cn("font-display text-2xl", dir === "rtl" && "text-right")}>
            Access
          </div>

          <div className="mt-4 grid gap-3">
            <div className="grid gap-2">
              <div className={cn("text-xs text-muted-foreground", dir === "rtl" && "text-right")}>
                Admin API base (optional)
              </div>
              <Input
                value={apiBase}
                readOnly
                className="opacity-80"
                placeholder="https://api.yourdomain.com"
              />
              <div className={cn("text-xs text-muted-foreground", dir === "rtl" && "text-right")}>
                Set via Vercel env: VITE_ADMIN_API_BASE
              </div>
            </div>

            <div className="grid gap-2">
              <div className={cn("text-xs text-muted-foreground", dir === "rtl" && "text-right")}>
                Admin token
              </div>
              <Input
                type="password"
                value={token}
                onChange={(e) => {
                  setToken(e.target.value);
                  localStorage.setItem("met71.adminToken", e.target.value);
                }}
                placeholder="Paste ADMIN_TOKEN"
              />
            </div>

            <div className="grid gap-2">
              <div className={cn("text-xs text-muted-foreground", dir === "rtl" && "text-right")}>
                Status filter
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={statusFilter === "" ? "default" : "outline"}
                  className="rounded-full"
                  onClick={() => setStatusFilter("")}
                >
                  All
                </Button>
                {STATUSES.map((s) => (
                  <Button
                    key={s}
                    variant={statusFilter === s ? "default" : "outline"}
                    className="rounded-full"
                    onClick={() => setStatusFilter(s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button disabled={loading} onClick={() => fetchLeads(0)} className="rounded-full">
                Load
              </Button>
              <Button variant="outline" onClick={exportCsv} className="rounded-full">
                Export CSV
              </Button>
            </div>
          </div>
        </Card>

        <div className="lg:col-span-8 space-y-3">
          <div className={cn("text-sm text-muted-foreground", dir === "rtl" && "text-right")}>
            Total: {total}
          </div>

          {items.map((lead) => (
            <Card key={lead.id} className="rounded-2xl border bg-card/90 p-5">
              <div className={cn("flex items-start justify-between gap-4", dir === "rtl" && "flex-row-reverse")}>
                <div className={cn("space-y-1", dir === "rtl" && "text-right")}>
                  <div className="font-display text-xl">
                    {lead.name} 
                    <span className="text-sm text-muted-foreground">#{lead.id}</span>
                  </div>
                  <div className="text-sm">
                    <a className="underline" href={`mailto:${lead.email}`}>
                      {lead.email}
                    </a>
                    {lead.phone ? <span className="text-muted-foreground"> · {lead.phone}</span> : null}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(lead.created_at).toLocaleString()} · {lead.source_page || "-"} · {lead.lang || "-"}
                  </div>
                </div>

                <div className={cn("flex flex-col gap-2", dir === "rtl" && "items-end")}>
                  <div className="text-xs text-muted-foreground">Status</div>
                  <div className="flex flex-wrap gap-2">
                    {STATUSES.map((s) => (
                      <Button
                        key={s}
                        size="sm"
                        variant={lead.status === s ? "default" : "outline"}
                        className="rounded-full"
                        onClick={() => updateLead(lead.id, { status: s })}
                      >
                        {s}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {lead.topic ? (
                <div className={cn("mt-3 text-sm", dir === "rtl" && "text-right")}>
                  <span className="text-muted-foreground">Topic:</span> {lead.topic}
                </div>
              ) : null}

              <div className={cn("mt-3 text-sm whitespace-pre-wrap", dir === "rtl" && "text-right")}>
                {lead.message}
              </div>

              <div className="mt-4 grid gap-2">
                <div className={cn("text-xs text-muted-foreground", dir === "rtl" && "text-right")}>
                  Sales note
                </div>
                <Textarea
                  value={lead.sales_note || ""}
                  onChange={(e) =>
                    setItems((prev) =>
                      prev.map((it) => (it.id === lead.id ? { ...it, sales_note: e.target.value } : it)),
                    )
                  }
                  placeholder="Add internal note..."
                />
                <div className={cn("flex items-center justify-end", dir === "rtl" && "justify-start")}>
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={() => updateLead(lead.id, { sales_note: lead.sales_note || "" })}
                  >
                    Save note
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          <div className={cn("flex items-center justify-between", dir === "rtl" && "flex-row-reverse")}>
            <Button
              variant="outline"
              className="rounded-full"
              disabled={offset 	<= 0 || loading}
              onClick={() => fetchLeads(Math.max(offset - limit, 0))}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              className="rounded-full"
              disabled={offset + limit >= total || loading}
              onClick={() => fetchLeads(offset + limit)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <Card className="mt-6 rounded-2xl border bg-[var(--sand)] p-5 text-sm text-muted-foreground">
        	Security note: keep ADMIN_TOKEN secret and rotate it periodically.
      </Card>
    </PageShell>
  );
}
