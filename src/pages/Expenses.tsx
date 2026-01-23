
import React, { useEffect, useMemo, useState, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

// --- CSV Export Helpers ---
function escapeCsvValue(value: unknown) {
  const s = String(value ?? "");
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
// ...existing code...

type ExpenseRow = {
  id: string;
  user_id: string;
  amount_cents: number;
  currency: string;
  category: string;
  vendor: string | null;
  note: string | null;
  expense_date: string; // YYYY-MM-DD
  created_at: string; // timestamptz
};

function formatMoneyFromCents(amountCents: number, currency: string) {
  const amount = amountCents / 100;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  } catch {
    return `${currency || "USD"} ${amount.toFixed(2)}`;
  }
}

function todayISODate() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// Week range: Monday -> Sunday (local time)
function startOfWeekISO(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay(); // 0 Sun..6 Sat
  const diff = (day === 0 ? -6 : 1) - day; // move to Monday
  d.setDate(d.getDate() + diff);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function startOfMonthISO(date = new Date()) {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${yyyy}-${mm}-01`;
}

export default function Expenses() {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState<ExpenseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Edit mode
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = useState<string>(todayISODate());
  const [category, setCategory] = useState<string>("Rent");
  const [vendor, setVendor] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [currency, setCurrency] = useState<string>("USD");
  const amountRef = useRef<HTMLInputElement>(null);

  // Filter state
  const [vendorQuery, setVendorQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  const weekStart = useMemo(() => startOfWeekISO(new Date()), []);
  const monthStart = useMemo(() => startOfMonthISO(new Date()), []);

  async function fetchExpenses() {
    setLoading(true);
    setError(null);

    try {
      // Check authentication first
      const { data: authData } = await supabase.auth.getUser();
      
      if (!authData?.user) {
        setError("Please sign in to view expenses.");
        setExpenses([]);
        return;
      }

      const { data, error } = await supabase
        .from("expenses")
        .select("id,user_id,amount_cents,currency,category,vendor,note,expense_date,created_at")
        .order("expense_date", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        setError(error.message);
        setExpenses([]);
        return;
      }

      setExpenses((data as ExpenseRow[]) ?? []);
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError(e?.message ?? "Unknown error fetching expenses.");
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    setError(null);
    await fetchExpenses();
    setRefreshing(false);
  }

  function resetForm() {
    setAmount("");
    setDate(todayISODate());
    setCategory("Rent");
    setVendor("");
    setNote("");
    setCurrency("USD");
  }

  function fillFormFromExpense(e: ExpenseRow) {
    setAmount((e.amount_cents / 100).toFixed(2));
    setDate(e.expense_date);
    setCategory(e.category || "");
    setVendor(e.vendor ?? "");
    setNote(e.note ?? "");
    setCurrency(e.currency || "USD");
  }

  function handleEdit(e: ExpenseRow) {
    setError(null);
    setEditingId(e.id);
    fillFormFromExpense(e);
    // scroll to form area
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      amountRef.current?.focus();
    }, 100);
  }

  async function handleDelete(e: ExpenseRow) {
    const ok = window.confirm("Delete this expense? This cannot be undone.");
    if (!ok) return;

    setError(null);

    const prev = expenses;
    setExpenses((cur) => cur.filter((x) => x.id !== e.id)); // optimistic

    const { error } = await supabase.from("expenses").delete().eq("id", e.id);
    if (error) {
      setExpenses(prev); // rollback
      setError(error.message);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt <= 0) {
      setError("Enter a valid amount greater than 0.");
      setSaving(false);
      return;
    }
    if (!date) {
      setError("Date is required.");
      setSaving(false);
      return;
    }
    if (!category.trim()) {
      setError("Category is required.");
      setSaving(false);
      return;
    }

    const { data: authData, error: authErr } = await supabase.auth.getUser();
    if (authErr) {
      setError(authErr.message);
      setSaving(false);
      return;
    }
    const userId = authData?.user?.id;
    if (!userId) {
      setError("You must be signed in to add expenses.");
      setSaving(false);
      return;
    }

    const payload = {
      user_id: userId,
      amount_cents: Math.round(amt * 100),
      currency: (currency || "USD").trim().toUpperCase(),
      category: category.trim(),
      vendor: vendor.trim() ? vendor.trim() : null,
      note: note.trim() ? note.trim() : null,
      expense_date: date,
    };

    if (editingId) {
      const { error } = await supabase.from("expenses").update(payload).eq("id", editingId);
      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }
      setHighlightId(editingId);
      setTimeout(() => setHighlightId(null), 1500);
    } else {
      const { error } = await supabase.from("expenses").insert(payload);
      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    setEditingId(null);
    resetForm();
    amountRef.current?.focus();
    await fetchExpenses();
  }

  useEffect(() => {
    fetchExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dynamic categories from data
  const categoryOptions = ["Rent", "Utilities", "Food", "Software", "Travel", "Health", "Other"];
  const filterCategoryOptions = ["All", ...categoryOptions];

  const filteredExpenses = useMemo(() => {
    const q = vendorQuery.trim().toLowerCase();

    return expenses.filter((e) => {
      const matchesCategory =
        categoryFilter === "All" ? true : e.category === categoryFilter;

      const matchesVendor = !q
        ? true
        : (e.vendor ?? "").toLowerCase().includes(q);

      return matchesCategory && matchesVendor;
    });
  }, [expenses, vendorQuery, categoryFilter]);

  // Highlight row after edit
  const [highlightId, setHighlightId] = useState<string | null>(null);
  // CSV Export Handler
  function handleExportCsv() {
    // Export ALL filtered rows (not just 10 visible)
    const rows = filteredExpenses;

    const headers = [
      "expense_date",
      "category",
      "vendor",
      "note",
      "amount",
      "currency",
      "amount_cents",
      "id",
    ];

    const lines = [
      headers.join(","),
      ...rows.map((e) => {
        const amount = (e.amount_cents / 100).toFixed(2);
        const values = [
          e.expense_date,
          e.category,
          e.vendor ?? "",
          e.note ?? "",
          amount,
          e.currency ?? "USD",
          e.amount_cents,
          e.id,
        ];
        return values.map(escapeCsvValue).join(",");
      }),
    ];

    const yyyy = new Date().getFullYear();
    const mm = String(new Date().getMonth() + 1).padStart(2, "0");
    const dd = String(new Date().getDate()).padStart(2, "0");
    const filename = `expenses-${yyyy}-${mm}-${dd}.csv`;

    downloadCsv(filename, lines.join("\n"));
  }

  // Totals
  const totals = useMemo(() => {
    const week = filteredExpenses
      .filter((e) => e.expense_date >= weekStart)
      .reduce((sum, e) => sum + (e.amount_cents || 0), 0);

    const month = filteredExpenses
      .filter((e) => e.expense_date >= monthStart)
      .reduce((sum, e) => sum + (e.amount_cents || 0), 0);

    const displayCurrency = filteredExpenses[0]?.currency || expenses[0]?.currency || "USD";

    return { week, month, displayCurrency };
  }, [filteredExpenses, expenses, weekStart, monthStart]);

  return (
    <div className="min-h-[calc(100vh-64px)] w-full">
      {/* Background */}
      <div className="bg-gradient-to-b from-[#071a3a] via-[#06142e] to-[#050b1c]">
        <div className="mx-auto w-full max-w-6xl px-4 py-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90 hover:bg-white/10"
                title="Back"
              >
                ←
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-white">Expense Tracker</h1>
                <p className="text-sm text-white/60">
                  Track spending with calendar-based totals (This Week / This Month)
                </p>
              </div>
            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-100 hover:bg-emerald-500/15 disabled:opacity-60"
              title="Refresh"
            >
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-100">
              <div className="flex items-start justify-between gap-3">
                <div>{error}</div>
                <button
                  onClick={() => setError(null)}
                  className="shrink-0 rounded-lg px-2 py-1 text-xs font-medium hover:bg-white/10"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Totals */}
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm text-white/70">This Week (Mon–Sun)</div>
                <div className="text-white/40">📅</div>
              </div>
              <div className="mt-3 text-4xl font-semibold text-emerald-300">
                {formatMoneyFromCents(totals.week, totals.displayCurrency)}
              </div>
              <div className="mt-1 text-sm text-white/50">From {weekStart}</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm text-white/70">This Month</div>
                <div className="text-white/40">$</div>
              </div>
              <div className="mt-3 text-4xl font-semibold text-emerald-300">
                {formatMoneyFromCents(totals.month, totals.displayCurrency)}
              </div>
              <div className="mt-1 text-sm text-white/50">From {monthStart}</div>
            </div>
          </div>

          {/* Add / Edit Expense */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xl font-semibold text-white">
                  {editingId ? "Edit Expense" : "Add Expense"}
                </div>
                <div className="text-sm text-white/60">Log a new expense entry</div>
              </div>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    resetForm();
                    setError(null);
                  }}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={onSubmit} className="mt-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                <div>
                  <div className="mb-1 text-xs text-white/60">Amount ($)</div>
                  <input
                    ref={amountRef}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    inputMode="decimal"
                    placeholder="12.34"
                    aria-label="Amount"
                    className="w-full rounded-xl border border-white/10 bg-[#071a3a]/60 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-300/30"
                  />
                </div>

                <div>
                  <div className="mb-1 text-xs text-white/60">Date</div>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#071a3a]/60 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-300/30"
                  />
                </div>

                <div>
                  <div className="mb-1 text-xs text-white/60">Category</div>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#071a3a]/60 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-300/30"
                    aria-label="Category"
                    title="Category"
                  >
                    {categoryOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="mb-1 text-xs text-white/60">Vendor</div>
                  <input
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    placeholder="e.g. Amazon"
                    className="w-full rounded-xl border border-white/10 bg-[#071a3a]/60 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-300/30"
                  />
                </div>

                <div>
                  <div className="mb-1 text-xs text-white/60">Note</div>
                  <input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Optional note"
                    className="w-full rounded-xl border border-white/10 bg-[#071a3a]/60 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-300/30"
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-white/50">
                  Tip: Categories are simple text for v1 flexibility.
                </div>

                <div className="flex items-center gap-2">
                  {/* Currency optional, keeping it hidden-ish for now (still stored in DB) */}
                  <input type="hidden" value={currency} readOnly />

                  <button
                    type="submit"
                    disabled={saving || !(Number(amount) > 0 && date && category.trim())}
                    className="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
                  >
                    {saving ? "Saving..." : editingId ? "Save Changes" : "Add Expense"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Recent Expenses */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">

            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-2xl font-semibold text-white">Recent Expenses</div>
                <div className="text-sm text-white/60">Latest entries</div>
              </div>
              <button
                onClick={handleExportCsv}
                disabled={loading || filteredExpenses.length === 0}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10 disabled:opacity-60"
                title="Export CSV"
              >
                Export CSV
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="md:col-span-2">
                <div className="mb-1 text-xs text-white/60">Search vendor</div>
                <input
                  value={vendorQuery}
                  onChange={(e) => setVendorQuery(e.target.value)}
                  placeholder="Type vendor name (e.g. Amazon)"
                  className="w-full rounded-xl border border-white/10 bg-[#071a3a]/60 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-300/30"
                />
              </div>

              <div>
                <div className="mb-1 text-xs text-white/60">Category</div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#071a3a]/60 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-300/30"
                  aria-label="Category Filter"
                  title="Category Filter"
                >
                  {filterCategoryOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {!loading && (
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-white/50">
                <div>
                  Showing <span className="text-white/80 font-medium">{filteredExpenses.length}</span>{" "}
                  of <span className="text-white/80 font-medium">{expenses.length}</span>
                </div>

                {(vendorQuery.trim() || categoryFilter !== "All") && (
                  <button
                    onClick={() => {
                      setVendorQuery("");
                      setCategoryFilter("All");
                    }}
                    className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 hover:bg-white/10"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}

            <div className="mt-4 overflow-x-auto">
              {loading ? (
                <div className="py-10 text-center text-sm text-white/60">Loading expenses…</div>
              ) : filteredExpenses.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="text-lg font-medium text-white">
                    {expenses.length === 0 ? "No expenses yet" : "No matching expenses"}
                  </div>
                  <div className="mt-1 text-sm text-white/60">
                    {expenses.length === 0
                      ? "Add your first expense above."
                      : "Try clearing filters or adjusting your search."}
                  </div>
                </div>
              ) : (
                <table className="w-full text-left text-sm text-white/85">
                  <thead className="text-xs text-white/60">
                    <tr className="border-b border-white/10">
                      <th className="py-3 pr-4">Date</th>
                      <th className="py-3 pr-4">Category</th>
                      <th className="py-3 pr-4">Vendor</th>
                      <th className="py-3 pr-4">Note</th>
                      <th className="py-3 pr-4 text-right">Amount</th>
                      <th className="py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.slice(0, 10).map((e) => (
                      <tr
                        key={e.id}
                        className={`border-b border-white/5 ${highlightId === e.id ? "bg-emerald-500/10" : ""}`}
                      >
                        <td className="py-4 pr-4 whitespace-nowrap">{e.expense_date}</td>
                        <td className="py-4 pr-4 whitespace-nowrap">{e.category}</td>
                        <td className="py-4 pr-4">{e.vendor ?? "—"}</td>
                        <td className="py-4 pr-4">{e.note ?? "—"}</td>
                        <td className="py-4 pr-4 text-right font-semibold text-emerald-300 whitespace-nowrap">
                          {formatMoneyFromCents(e.amount_cents, e.currency)}
                        </td>
                        <td className="py-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(e)}
                              className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/80 hover:bg-white/10"
                              title="Edit"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(e)}
                              className="rounded-lg border border-red-400/20 bg-red-500/10 px-2 py-1 text-xs text-red-100 hover:bg-red-500/15"
                              title="Delete"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="h-8" />
        </div>
      </div>
    </div>
  );
}