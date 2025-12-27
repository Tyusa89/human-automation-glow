import { useEffect, useMemo, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw, Search } from "lucide-react";

type AppointmentStatus = "booked" | "rescheduled" | "canceled";

type Appointment = {
  id: string;
  start_time: string;
  end_time: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  notes: string | null;
  status: AppointmentStatus;
  created_at: string;
};

function fmt(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString([], {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: AppointmentStatus }) {
  if (status === "booked") {
    return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Booked</Badge>;
  }
  if (status === "rescheduled") {
    return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Rescheduled</Badge>;
  }
  return <Badge variant="destructive">Canceled</Badge>;
}

export default function AdminAppointments() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | AppointmentStatus>("all");
  const [items, setItems] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const params = new URLSearchParams({
        q,
        status,
        limit: "75",
      });

      const res = await fetch(
        `https://rqldulvkwzvrmcvwttep.supabase.co/functions/v1/appointments-admin-list?${params}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Failed to load appointments");

      setItems(json.appointments ?? []);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [q, status]);

  useEffect(() => {
    load();
  }, [load]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => load(), 350);
    return () => clearTimeout(t);
  }, [q, status, load]);

  async function cancel(id: string) {
    if (!confirm("Cancel this appointment?")) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const res = await fetch(
        "https://rqldulvkwzvrmcvwttep.supabase.co/functions/v1/appointments-admin-cancel",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Cancel failed");

      setItems((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "canceled" } : a))
      );
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Cancel failed");
    }
  }

  const upcomingCount = useMemo(() => {
    const now = Date.now();
    return items.filter(
      (a) => a.status !== "canceled" && new Date(a.start_time).getTime() >= now
    ).length;
  }, [items]);

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">Appointments</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {loading ? "Loading…" : `${items.length} loaded • ${upcomingCount} upcoming`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search name or email..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="pl-9 md:w-[260px]"
                />
              </div>

              <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="booked">Booked</SelectItem>
                  <SelectItem value="rescheduled">Rescheduled</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" onClick={load} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {err && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md mb-4">
              {err}
            </div>
          )}

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date/Time</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No appointments found.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>
                        <div className="font-medium">{fmt(a.start_time)}</div>
                        <div className="text-xs text-muted-foreground">
                          to {fmt(a.end_time)}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="font-medium">{a.client_name}</div>
                        <div className="text-xs text-muted-foreground">{a.client_email}</div>
                      </TableCell>

                      <TableCell>
                        <StatusBadge status={a.status} />
                      </TableCell>

                      <TableCell>
                        <span className="text-sm text-muted-foreground line-clamp-2">
                          {a.notes || "—"}
                        </span>
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={a.status === "canceled"}
                          onClick={() => cancel(a.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          Cancel
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            Tip: Use search to find a client fast (name or email).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
