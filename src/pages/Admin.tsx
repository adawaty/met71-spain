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

type AdminSessionUser = {
  id: string;
  email: string;
  role: "owner";
};

const STATUSES = ["new", "contacted", "qualified", "won", "lost", "spam"] as const;

const LS = {
  access: "met71.accessToken",
  user: "met71.adminUser",
};

export default function Admin() {
  const { dir, lang } = useLang();

  const apiBase = useMemo(() => {
    const v = import.meta.env.VITE_ADMIN_API_BASE as string | undefined;
    return v && v.trim().length ? v.replace(/\/$/, "") : "";
  }, []);

  const api = (path: string) => (apiBase || "") + path;

  const [adminPassword, setAdminPassword] = useState<string>("");

  const [accessToken, setAccessToken] = useState(() => localStorage.getItem(LS.access) || "");
  const [user, setUser] = useState<AdminSessionUser | null>(() => {
    const raw = localStorage.getItem(LS.user);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  });

  const [statusFilter, setStatusFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [items, setItems] = useState<Lead[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [offset, setOffset] = useState<number>(0);
  const limit = 25;
  const [loading, setLoading] = useState(false);

  function saveSession(next: { access_token: string; user: AdminSessionUser }) {
    setAccessToken(next.access_token);
    setUser(next.user);
    localStorage.setItem(LS.access, next.access_token);
    localStorage.setItem(LS.user, JSON.stringify(next.user));
  }

  function clearSession() {
    setAccessToken("");
    setUser(null);
    localStorage.removeItem(LS.access);
    localStorage.removeItem(LS.user);
  }

  async function login() {
    if (!adminPassword) return toast.error("Admin password required");
    const toastId = toast.loading("Signing in...");

    try {
      const r = await fetch(api("/api/admin/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: adminPassword }),
      });
      if (!r.ok) throw new Error(await r.text());
      const data = await r.json();
      if (!data?.ok) throw new Error("bad_response");
      saveSession({ access_token: data.access_token, user: data.user });
      setAdminPassword("");
      toast.success("Signed in", { id: toastId });
    } catch { 
      toast.error("Login failed", { id: toastId });
    }
  }

  async function authFetch(input: RequestInfo, init?: RequestInit) {
    if (!accessToken) throw new Error("not_signed_in");

    const r = await fetch(input, {
      ...init,
      headers: {
        ...(init?.headers || {}),
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (r.status === 401) {
      clearSession();
      throw new Error("session_expired");
    }

    return r;
  }

  async function logout() {
    clearSession();
    try {
      await fetch(api("/api/admin/auth/logout"), { method: "POST" });
    } catch {
      // ignore
    }
    toast.success("Signed out");
  }

  async function fetchLeads(nextOffset = 0) {
    if (!accessToken) {
      toast.error("Please sign in first");
      return;
    }
    setLoading(true);
    const toastId = toast.loading("Loading leads...");

    try {
      const url = new URL(api("/api/admin/leads"), window.location.origin);
      url.searchParams.set("limit", String(limit));
      url.searchParams.set("offset", String(nextOffset));
      if (statusFilter) url.searchParams.set("status", statusFilter);
      if (search.trim()) url.searchParams.set("q", search.trim());

      const r = await authFetch(url.toString());
      if (!r.ok) throw new Error(await r.text());
      const data = await r.json();
      setItems(data.items || []);
      setTotal(data.total || 0);
      setOffset(nextOffset);
      toast.success("Loaded", { id: toastId });
    } catch { 
      toast.error("Failed to load. Session may have expired.", { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  async function updateLead(id: number, patch: Partial<Lead>) {
    if (!accessToken) return toast.error("Please sign in first");

    try {
      const r = await authFetch(api(`/api/admin/leads/${id}`),
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: patch.status, sales_note: patch.sales_note }),
        },
      );
      if (!r.ok) throw new Error(await r.text());
      const data = await r.json();
      setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...data.item } : it)));
      toast.success("Updated");
    } catch { 
      toast.error("Update failed");
    }
  }

  function exportCsv() {
    if (!accessToken) return toast.error("Please sign in first");

    const url = new URL(api("/api/admin/leads.csv"), window.location.origin);
    if (statusFilter) url.searchParams.set("status", statusFilter);

    (async () => {
      const toastId = toast.loading("Exporting CSV...");
      try {
        const r = await authFetch(url.toString());
        if (!r.ok) throw new Error(await r.text());
        const blob = await r.blob();
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "met71-leads.csv";
        a.click();
        URL.revokeObjectURL(a.href);
        toast.success("Downloaded", { id: toastId });
      } catch { 
        toast.error("Export failed", { id: toastId });
      }
    })();
  }

  return (
    <PageShell title="Admin — Leads" lede="Leads dashboard for Met71 Spain." >
      <div className="grid gap-4 lg:grid-cols-12 lg:items-start">
        <Card className="rounded-2xl border bg-card/90 p-6 lg:col-span-4">
          <div className={cn("font-display text-2xl", dir === "rtl" && "text-right")}>
            {user ? "Session" : "Sign in"}
          </div>

          <div className="mt-4 grid gap-3">

            {!user ? (
              <>
                <div className="grid gap-2">
                  <div className={cn("text-xs text-muted-foreground", dir === "rtl" && "text-right")}>
                    Admin passcode
                  </div>
                  <Input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter passcode"
                  />
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button onClick={login} className="rounded-full">
                    Sign in
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className={cn("text-sm", dir === "rtl" && "text-right")}>
                  <div className="text-muted-foreground">Signed in as</div>
                  <div className="font-medium">{user.email}</div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button disabled={loading} onClick={() => fetchLeads(0)} className="rounded-full">
                    Load
                  </Button>
                  <Button variant="outline" onClick={exportCsv} className="rounded-full">
                    Export CSV
                  </Button>
                  <Button variant="ghost" onClick={logout} className="rounded-full">
                    Logout
                  </Button>
                </div>

                <div className="grid gap-2 pt-2">
                  <div className={cn("text-xs text-muted-foreground", dir === "rtl" && "text-right")}>
                    Search (name or email)
                  </div>
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Type a name or email..."
                  />
                </div>

                <div className="grid gap-2 pt-2">
                  <div className={cn("text-xs text-muted-foreground", dir === "rtl" && "text-right")}>
                    Status filter
                  </div>
                  <div className={cn("flex flex-wrap gap-2", dir === "rtl" && "justify-end")}>
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
              </>
            )}
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
                    {lead.name} <span className="text-sm text-muted-foreground">#{lead.id}</span>
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
                  <div className={cn("flex flex-wrap items-center gap-2", dir === "rtl" && "justify-end")}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full"
                      onClick={async () => {
                        const toastId = toast.loading("Summarizing...");
                        try {
                          const r = await authFetch(api("/api/admin/ai"), {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ type: "summary", lead, lang }),
                          });
                          const data = await r.json();
                          if (!r.ok || !data?.ok) throw new Error();
                          toast.message("AI summary", { description: String(data.output || ""), duration: 15000, id: toastId });
                        } catch {
                          toast.error("AI failed", { id: toastId });
                        }
                      }}
                    >
                      AI Summary
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full"
                      onClick={async () => {
                        const toastId = toast.loading("Drafting reply...");
                        try {
                          const r = await authFetch(api("/api/admin/ai"), {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ type: "reply", lead, lang }),
                          });
                          const data = await r.json();
                          if (!r.ok || !data?.ok) throw new Error();
                          await navigator.clipboard?.writeText(String(data.output || ""));
                          toast.message("AI reply copied", { description: String(data.output || ""), duration: 15000, id: toastId });
                        } catch {
                          toast.error("AI failed", { id: toastId });
                        }
                      }}
                    >
                      AI Reply
                    </Button>
                  </div>

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
                    setItems((prev) => prev.map((it) => (it.id === lead.id ? { ...it, sales_note: e.target.value } : it)))
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
              disabled={offset <= 0 || loading}
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
        Admin access is protected by a private passcode.
      </Card>
    </PageShell>
  );
}
