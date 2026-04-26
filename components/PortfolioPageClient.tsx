"use client";
import PortfolioAIInsights, {
  InsightsData,
} from "@/components/PortfolioAIInsights";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ImSpinner } from "react-icons/im";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AiSummaryCard } from "./AiSummary/AiSummary";
import { toast } from "@/hooks/use-toast";
import {
  AlertCircle,
  Camera,
  Image as ImageIcon,
  Info,
  Pencil,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";

const SHOW_BROKER_LINK_UI = false;

type AssetType =
  | "stock"
  | "etf"
  | "mutual_fund"
  | "foreign_stock"
  | "gold_bond"
  | "debt"
  | "other";

type Holding = {
  broker: "zerodha" | "upstox" | "upload";
  symbol: string;
  quantity: number;
  avgPrice: number;
  lastPrice?: number;
  weightPct?: number;
  unrealizedPnl?: number;
  assetType?: AssetType;
  currency?: string;
};

type Insights = {
  totalInvested?: number;
  totalCurrent?: number;
  totalUnrealizedPnl?: number;
  diversificationNote?: string;
  topPositions?: any[];
  brokerAllocation?: Record<string, number>;
  assetAllocation?: Record<string, number>;
  concentration?: { top1Pct: number; top2Pct: number; top3Pct: number };
  winners?: any[];
  losers?: any[];
  riskScore?: number;
  sectorOverlap?: number;
  beta?: number;
  actions?: string[];
  notes?: string[];
  events?: any[];
};

type SeriesPoint = {
  date: string;
  invested: number;
  value: number;
  rowCount: number;
};

const ASSET_LABEL: Record<string, string> = {
  stock: "Stocks",
  etf: "ETFs",
  mutual_fund: "Mutual funds",
  foreign_stock: "Foreign stocks",
  gold_bond: "Gold / SGB",
  debt: "Debt / bonds",
  other: "Other",
};

const ASSET_OPTIONS: { value: AssetType; label: string }[] = [
  { value: "stock", label: "Stock" },
  { value: "etf", label: "ETF" },
  { value: "mutual_fund", label: "Mutual fund" },
  { value: "foreign_stock", label: "Foreign stock" },
  { value: "gold_bond", label: "Gold / SGB" },
  { value: "debt", label: "Debt / bond" },
  { value: "other", label: "Other" },
];

const SOURCE_LABEL: Record<string, string> = {
  zerodha: "Zerodha",
  upstox: "Upstox",
  upload: "Screenshot",
};

function formatRelativeTime(value: string | Date | null): string {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  if (isNaN(d.getTime())) return "";
  const now = Date.now();
  const diffMs = now - d.getTime();
  const sec = Math.round(diffMs / 1000);
  if (sec < 60) return "just now";
  const min = Math.round(sec / 60);
  if (min < 60) return `${min} min ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr} hour${hr === 1 ? "" : "s"} ago`;
  const day = Math.round(hr / 24);
  if (day < 30) return `${day} day${day === 1 ? "" : "s"} ago`;
  return d.toLocaleDateString();
}

function blankRow(): EditableRow {
  return {
    id: crypto.randomUUID(),
    symbol: "",
    quantity: 0,
    avgPrice: 0,
    lastPrice: 0,
    assetType: "stock",
    currency: "INR",
  };
}

type EditableRow = {
  id: string;
  symbol: string;
  quantity: number;
  avgPrice: number;
  lastPrice: number;
  assetType: AssetType;
  currency: string;
};

export default function PortfolioPageClient() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [connections, setConnections] = useState<any[]>([]);
  const [aiText, setAiText] = useState<string>("");
  const [analyzing, setAnalyzing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editRows, setEditRows] = useState<EditableRow[]>([]);
  const [dataSource, setDataSource] =
    useState<"screenshot" | "broker" | "none">("none");
  const [snapshotSource, setSnapshotSource] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [series, setSeries] = useState<SeriesPoint[]>([]);
  const [aiUi, setAiUi] = useState<InsightsData | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fallbackData: InsightsData = useMemo(() => {
    const investedFallback = holdings.reduce(
      (s, h) => s + (h.avgPrice || 0) * (h.quantity || 0),
      0
    );
    const currentFallback = holdings.reduce(
      (s, h) =>
        s + (h.lastPrice ?? h.avgPrice ?? 0) * (h.quantity || 0),
      0
    );

    const performanceSeries =
      series.length >= 2
        ? series.map((p) => ({
            date: new Date(p.date).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
            }),
            value: p.value,
            invested: p.invested,
          }))
        : [];

    return {
      kpis: {
        invested: insights?.totalInvested ?? investedFallback,
        current: insights?.totalCurrent ?? currentFallback,
        pnl:
          insights?.totalUnrealizedPnl ??
          currentFallback - investedFallback,
      },
      performance: { series: performanceSeries },
      allocations: (() => {
        const rows = holdings.map((h) => ({
          label: shortLabel(h.symbol),
          value: (h.lastPrice ?? h.avgPrice ?? 0) * (h.quantity || 0),
        }));
        const total = rows.reduce((s, r) => s + r.value, 0);
        return rows
          .map((r) => ({
            label: r.label,
            percent: total > 0 ? (r.value / total) * 100 : 0,
          }))
          .sort((a, b) => b.percent - a.percent)
          .slice(0, 8);
      })(),
      risk: {
        score: insights?.riskScore ?? 0,
        topHolding: (insights?.concentration?.top1Pct || 0) / 100,
        top3: (insights?.concentration?.top3Pct || 0) / 100,
        sectorOverlap: insights?.sectorOverlap ?? 0,
        beta: insights?.beta ?? 1,
      },
      movers: {
        winners: (insights?.winners || []).map((w: any) => ({
          symbol: w.symbol,
          name: w.symbol,
          change: `${Number(w.pnlPct ?? 0).toFixed(1)}%`,
          weight: (w.weightPct ?? 0) / 100,
          pnl: w.pnl ?? w.unrealizedPnl ?? 0,
        })),
        losers: (insights?.losers || []).map((l: any) => ({
          symbol: l.symbol,
          name: l.symbol,
          change: `${Number(l.pnlPct ?? 0).toFixed(1)}%`,
          weight: (l.weightPct ?? 0) / 100,
          pnl: l.pnl ?? l.unrealizedPnl ?? 0,
        })),
      },
      actions: insights?.actions || [],
      notes: insights?.notes || [],
      events: insights?.events || [],
    };
  }, [holdings, insights, series]);

  const reload = async () => {
    setLoading(true);
    try {
      if (SHOW_BROKER_LINK_UI) {
        const c = await fetch("/api/brokers/list");
        const cjson = await c.json();
        setConnections(cjson.connections || []);
      }
      const res = await fetch("/api/insights/portfolio");
      if (res.ok) {
        const data = await res.json();
        setHoldings(data.holdings || []);
        setInsights(data.insights || null);
        setDataSource(data.dataSource || "none");
        setLastUpdated(data.lastUpdated || null);
        setSnapshotSource(data.snapshotSource || null);
        setSeries(Array.isArray(data.series) ? data.series : []);
      } else {
        setHoldings([]);
        setInsights(null);
        setDataSource("none");
        setLastUpdated(null);
        setSnapshotSource(null);
        setSeries([]);
      }
    } catch (error) {
      console.error("[portfolio] reload failed", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showDiffToast = (
    diff: any,
    diffSummary: string,
    hasPrevious: boolean
  ) => {
    if (!hasPrevious) {
      toast({
        title: "Holdings imported",
        description: `${diff?.total ?? 0} rows extracted.`,
      });
      return;
    }
    toast({
      title: "Snapshot updated",
      description: diffSummary || "Latest snapshot saved.",
    });
  };

  const uploadScreenshots = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadBusy(true);
    try {
      const formData = new FormData();
      for (const f of Array.from(files)) formData.append("files", f);
      const res = await fetch("/api/portfolio/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast({
          variant: "destructive",
          title: "Could not parse screenshots",
          description:
            json?.message ||
            "Try a clearer image with visible holdings rows.",
        });
        return;
      }
      showDiffToast(json.diff, json.diffSummary, !!json.hasPrevious);
      await reload();
    } catch {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Please try again.",
      });
    } finally {
      setUploadBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const clearSnapshot = async () => {
    try {
      const res = await fetch("/api/portfolio/snapshot", { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast({
        title: "Removed",
        description: "Your uploaded data and history have been cleared.",
      });
      await reload();
    } catch {
      toast({
        variant: "destructive",
        title: "Couldn't remove uploaded data",
        description: "Please try again.",
      });
    }
  };

  const openEditor = () => {
    const rows: EditableRow[] = holdings.map((h) => ({
      id: crypto.randomUUID(),
      symbol: h.symbol,
      quantity: h.quantity,
      avgPrice: h.avgPrice,
      lastPrice: h.lastPrice ?? h.avgPrice,
      assetType: (h.assetType as AssetType) || "stock",
      currency: h.currency || "INR",
    }));
    setEditRows(rows.length ? rows : [blankRow()]);
    setEditOpen(true);
  };

  const updateEditRow = (id: string, patch: Partial<EditableRow>) => {
    setEditRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r))
    );
  };

  const removeEditRow = (id: string) => {
    setEditRows((prev) => prev.filter((r) => r.id !== id));
  };

  const addEditRow = () => {
    setEditRows((prev) => [...prev, blankRow()]);
  };

  const saveEdits = async () => {
    const cleaned = editRows
      .map((r) => ({
        symbol: r.symbol.trim(),
        quantity: Number(r.quantity) || 0,
        avgPrice: Number(r.avgPrice) || 0,
        lastPrice: Number(r.lastPrice) || Number(r.avgPrice) || 0,
        assetType: r.assetType,
        currency: r.currency || "INR",
      }))
      .filter((r) => r.symbol.length > 0 && r.quantity > 0);

    if (cleaned.length === 0) {
      toast({
        variant: "destructive",
        title: "Nothing to save",
        description: "Add at least one row with a symbol and quantity.",
      });
      return;
    }

    setSavingEdit(true);
    try {
      const res = await fetch("/api/portfolio/snapshot", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ holdings: cleaned }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast({
          variant: "destructive",
          title: "Could not save changes",
          description: json?.message || "Please try again.",
        });
        return;
      }
      toast({
        title: "Holdings saved",
        description: json.diffSummary || "Your changes are now live.",
      });
      setEditOpen(false);
      await reload();
    } catch {
      toast({
        variant: "destructive",
        title: "Could not save changes",
        description: "Please try again.",
      });
    } finally {
      setSavingEdit(false);
    }
  };

  const prettyINR = (n: number | undefined) =>
    typeof n === "number" ? n.toLocaleString("en-IN") : "-";

  const sourceLabel =
    snapshotSource === "manual"
      ? "Manual edit"
      : snapshotSource === "screenshot"
      ? "Screenshot"
      : dataSource === "broker"
      ? "Broker"
      : "—";

  return (
    <div className="relative min-h-screen">
      {analyzing && (
        <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm grid place-items-center">
          <div className="rounded-2xl border bg-card text-card-foreground px-6 py-4 shadow-xl flex items-center gap-3">
            <ImSpinner className="animate-spin text-primary" />
            <span>Loading AI context…</span>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 -z-10 hero-spotlight" />

      <div className="mx-auto max-w-6xl p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge
              variant="secondary"
              className="border-primary/20 bg-primary/10 text-primary"
            >
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              Portfolio · education
            </Badge>
            <h1 className="mt-3 font-display text-3xl sm:text-4xl font-semibold tracking-tight">
              Your portfolio
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Upload screenshots from any broker app or statement and we&apos;ll
              read holdings into a single educational view. You can also edit
              rows manually anytime. Each upload or edit becomes a new
              snapshot in your equity curve.
            </p>
            {lastUpdated && (
              <p className="text-xs text-muted-foreground mt-2">
                Last updated{" "}
                <span className="font-medium text-foreground">
                  {formatRelativeTime(lastUpdated)}
                </span>{" "}
                · source{" "}
                <span className="font-medium text-foreground">
                  {sourceLabel}
                </span>
                {series.length > 0 && (
                  <>
                    {" "}
                    ·{" "}
                    <span className="font-medium text-foreground">
                      {series.length}
                    </span>{" "}
                    snapshot{series.length === 1 ? "" : "s"} on file
                  </>
                )}
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={openEditor}
              disabled={loading}
              className="gap-2"
            >
              <Pencil className="h-4 w-4" />
              Edit holdings
            </Button>
            <Button
              variant="outline"
              onClick={reload}
              disabled={loading}
              className="gap-2"
            >
              {loading ? (
                <ImSpinner className="animate-spin h-4 w-4" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh
            </Button>
          </div>
        </div>

        {/* Upload + status row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 surface-soft">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Camera className="h-4 w-4 text-primary" />
                Load holdings from screenshots
              </CardTitle>
              <CardDescription>
                Re-uploading replaces the latest snapshot — sold rows drop off,
                new buys appear, quantity changes are picked up. We also save a
                history point so your equity curve grows over time.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                multiple
                className="hidden"
                onChange={(e) => uploadScreenshots(e.target.files)}
              />
              <Button
                className="w-full gap-2 bg-brand-gradient hover:opacity-90"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadBusy}
              >
                {uploadBusy ? (
                  <>
                    <ImSpinner className="animate-spin h-4 w-4" />
                    Parsing…
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload screenshots
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={openEditor}
              >
                <Pencil className="h-4 w-4" />
                Edit holdings manually
              </Button>

              <div className="flex items-start gap-2 rounded-lg border bg-background/60 p-3 text-xs text-muted-foreground">
                <Info className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                <span>
                  Tip: capture the holdings list with rows visible. Crop out
                  account numbers; we don&apos;t need them and they&apos;re your data.
                </span>
              </div>

              {(dataSource === "screenshot" || snapshotSource === "manual") && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full gap-2 text-destructive hover:text-destructive"
                  onClick={clearSnapshot}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove uploaded data & history
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-base">Portfolio insights</CardTitle>
                <CardDescription>
                  Computed from{" "}
                  <span className="font-medium text-foreground">
                    {snapshotSource === "manual"
                      ? "your manual edits"
                      : dataSource === "screenshot"
                      ? "your latest screenshot"
                      : dataSource === "broker"
                      ? "linked broker accounts"
                      : "—"}
                  </span>
                </CardDescription>
              </div>
              {dataSource !== "none" && (
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/20"
                >
                  {sourceLabel}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {!insights ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="rounded-xl border p-4 animate-pulse bg-muted/40 h-20"
                    />
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <KpiTile
                      label="Invested"
                      value={`₹${prettyINR(insights.totalInvested)}`}
                    />
                    <KpiTile
                      label="Current"
                      value={`₹${prettyINR(insights.totalCurrent)}`}
                    />
                    <KpiTile
                      label="Unrealized P&L"
                      value={`₹${prettyINR(insights.totalUnrealizedPnl)}`}
                      tone={
                        (insights.totalUnrealizedPnl ?? 0) >= 0
                          ? "pos"
                          : "neg"
                      }
                    />
                  </div>

                  {insights.diversificationNote && (
                    <div className="flex gap-2 rounded-lg border border-warning/30 bg-warning/5 p-3 text-sm">
                      <AlertCircle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                      <div className="text-muted-foreground">
                        {insights.diversificationNote}
                      </div>
                    </div>
                  )}

                  {insights.assetAllocation &&
                    Object.keys(insights.assetAllocation).length > 0 && (
                      <AllocationBars
                        title="By asset type"
                        rows={insights.assetAllocation}
                        labels={ASSET_LABEL}
                      />
                    )}

                  {insights.brokerAllocation &&
                    Object.keys(insights.brokerAllocation).length > 0 && (
                      <AllocationBars
                        title="By source"
                        rows={insights.brokerAllocation}
                        labels={SOURCE_LABEL}
                      />
                    )}

                  {(insights.topPositions?.length ?? 0) > 0 && (
                    <div className="rounded-xl border p-4">
                      <p className="font-medium mb-3">Top positions</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {insights.topPositions!.map((p: any) => (
                          <div
                            key={`${p.broker}-${p.symbol}`}
                            className="rounded-lg border bg-card p-3"
                          >
                            <div className="flex items-start justify-between gap-2 text-sm font-medium">
                              <span className="truncate" title={p.symbol}>
                                {shortLabel(p.symbol)}
                              </span>
                              <span className="tabular-nums shrink-0">
                                {Number(p.weightPct).toFixed(1)}%
                              </span>
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground line-clamp-2">
                              {p.educationalNote}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {SHOW_BROKER_LINK_UI && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Linked accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {connections.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between rounded-xl border bg-card/50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 grid place-items-center text-xs font-semibold uppercase">
                        {String(c.broker).at(0)}
                      </div>
                      <div className="leading-tight">
                        <div className="font-medium capitalize">{c.broker}</div>
                        {c.displayName ? (
                          <div className="text-xs text-muted-foreground">
                            {c.displayName}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        await fetch("/api/brokers/disconnect", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ broker: c.broker }),
                        });
                        reload();
                      }}
                    >
                      Disconnect
                    </Button>
                  </div>
                ))}
                {connections.length === 0 && (
                  <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                    No linked accounts.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Holdings */}
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Holdings</CardTitle>
              <CardDescription>
                {holdings.length > 0
                  ? `${holdings.length} row${holdings.length === 1 ? "" : "s"}`
                  : "Upload a screenshot or add rows manually to populate this view"}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={openEditor}
                className="gap-2"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr className="text-left">
                    <th className="px-3 py-2 font-medium">Source</th>
                    <th className="px-3 py-2 font-medium">Type</th>
                    <th className="px-3 py-2 font-medium">Name</th>
                    <th className="px-3 py-2 font-medium text-right">Qty</th>
                    <th className="px-3 py-2 font-medium text-right">
                      Avg price
                    </th>
                    <th className="px-3 py-2 font-medium text-right">
                      Last price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((h, idx) => (
                    <tr
                      key={`${h.broker}-${h.symbol}-${idx}`}
                      className={`border-t hover:bg-muted/40 ${
                        idx % 2 === 0 ? "bg-background" : "bg-background/60"
                      }`}
                    >
                      <td className="px-3 py-2">
                        <span className="inline-flex items-center gap-2 capitalize">
                          {h.broker === "upload" ? (
                            <ImageIcon className="h-3 w-3 text-primary" />
                          ) : (
                            <span className="h-2.5 w-2.5 rounded-full bg-primary/70" />
                          )}
                          {SOURCE_LABEL[h.broker] || h.broker}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-muted-foreground capitalize">
                        {ASSET_LABEL[h.assetType || "other"] ||
                          h.assetType ||
                          "—"}
                      </td>
                      <td className="px-3 py-2 font-medium">
                        <span
                          className="block truncate max-w-[280px]"
                          title={h.symbol}
                        >
                          {shortLabel(h.symbol)}
                        </span>
                        {h.currency && h.currency !== "INR" && (
                          <span className="ml-1 text-xs text-muted-foreground">
                            ({h.currency})
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        {h.quantity}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        ₹{prettyINR(h.avgPrice)}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        ₹{prettyINR(h.lastPrice)}
                      </td>
                    </tr>
                  ))}
                  {holdings.length === 0 && (
                    <tr>
                      <td
                        className="p-8 text-center text-muted-foreground"
                        colSpan={6}
                      >
                        <div className="mx-auto max-w-md">
                          <ImageIcon className="mx-auto h-6 w-6 text-muted-foreground/60" />
                          <p className="mt-2 text-sm">
                            No holdings loaded yet. Upload a screenshot or
                            click <span className="font-medium">Edit</span> to
                            add rows manually.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <PortfolioAIInsights
          data={aiUi ?? fallbackData}
          aiText={aiText}
          onRunAnalysis={async () => {
            setAnalyzing(true);
            setAiText("");
            try {
              const res = await fetch("/api/insights/portfolio-ai", {
                method: "POST",
              });
              const contentType = res.headers.get("content-type") || "";
              if (!res.ok) {
                let serverMsg = "";
                if (contentType.includes("application/json")) {
                  try {
                    const j = await res.json();
                    serverMsg = j?.message || "Request failed";
                  } catch {}
                } else {
                  try {
                    serverMsg = await res.text();
                  } catch {}
                }
                throw new Error(serverMsg || `HTTP ${res.status}`);
              }
              if (contentType.includes("application/json")) {
                const { text, ui } = await res.json();
                if (ui) setAiUi(ui);
                if (text) setAiText(text);
              } else {
                const raw = await res.text();
                setAiText(raw || "");
              }
            } catch {
              setAiText("Failed to load educational context.");
            } finally {
              setAnalyzing(false);
            }
          }}
        />
        {aiText && <AiSummaryCard text={aiText} loading={analyzing} />}
      </div>

      <EditHoldingsSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        rows={editRows}
        onUpdate={updateEditRow}
        onAdd={addEditRow}
        onRemove={removeEditRow}
        onSave={saveEdits}
        saving={savingEdit}
      />
    </div>
  );
}

function EditHoldingsSheet({
  open,
  onOpenChange,
  rows,
  onUpdate,
  onAdd,
  onRemove,
  onSave,
  saving,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  rows: EditableRow[];
  onUpdate: (id: string, patch: Partial<EditableRow>) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl flex flex-col p-0"
      >
        <SheetHeader className="px-6 pt-6 pb-3 border-b">
          <SheetTitle className="font-display text-xl">
            Edit holdings
          </SheetTitle>
          <SheetDescription>
            Add new positions, fix OCR mistakes, or update quantities and
            prices. Saving creates a new snapshot in your equity curve.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {rows.length === 0 && (
            <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
              No rows yet. Add one to get started.
            </div>
          )}
          {rows.map((row) => (
            <div
              key={row.id}
              className="rounded-xl border bg-card p-3 sm:p-4 space-y-3"
            >
              <div className="flex items-start gap-2">
                <Input
                  placeholder="e.g. RELIANCE · Reliance Industries"
                  value={row.symbol}
                  onChange={(e) =>
                    onUpdate(row.id, { symbol: e.target.value })
                  }
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => onRemove(row.id)}
                  aria-label="Remove row"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <LabeledInput
                  label="Qty"
                  type="number"
                  min={0}
                  step="any"
                  value={row.quantity}
                  onChange={(v) =>
                    onUpdate(row.id, { quantity: parseFloat(v) || 0 })
                  }
                />
                <LabeledInput
                  label="Avg price"
                  type="number"
                  min={0}
                  step="any"
                  value={row.avgPrice}
                  onChange={(v) =>
                    onUpdate(row.id, { avgPrice: parseFloat(v) || 0 })
                  }
                />
                <LabeledInput
                  label="Last price"
                  type="number"
                  min={0}
                  step="any"
                  value={row.lastPrice}
                  onChange={(v) =>
                    onUpdate(row.id, { lastPrice: parseFloat(v) || 0 })
                  }
                />
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    Type
                  </label>
                  <select
                    value={row.assetType}
                    onChange={(e) =>
                      onUpdate(row.id, {
                        assetType: e.target.value as AssetType,
                      })
                    }
                    className="h-9 rounded-md border bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {ASSET_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            className="w-full gap-2 mt-1"
            onClick={onAdd}
            type="button"
          >
            <Plus className="h-4 w-4" />
            Add row
          </Button>
        </div>

        <SheetFooter className="px-6 py-4 border-t bg-card/50 sm:flex-row sm:justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            className="bg-brand-gradient hover:opacity-90 gap-2"
            onClick={onSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <ImSpinner className="animate-spin h-4 w-4" />
                Saving…
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
  ...rest
}: {
  label: string;
  value: number | string;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </label>
      <Input
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 tabular-nums"
      />
    </div>
  );
}

function KpiTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "pos" | "neg";
}) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div
        className={`mt-1 font-display text-xl md:text-2xl font-semibold tabular-nums ${
          tone === "pos"
            ? "text-success"
            : tone === "neg"
            ? "text-destructive"
            : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function AllocationBars({
  title,
  rows,
  labels,
}: {
  title: string;
  rows: Record<string, number>;
  labels?: Record<string, string>;
}) {
  const entries = Object.entries(rows).sort(
    (a, b) => Number(b[1]) - Number(a[1])
  );
  return (
    <div>
      <p className="font-medium mb-2 text-sm">{title}</p>
      <div className="space-y-2">
        {entries.map(([key, pct]) => {
          const value = Number(pct) || 0;
          return (
            <div key={key} className="flex items-center gap-3">
              <span className="w-32 text-xs text-muted-foreground capitalize truncate">
                {labels?.[key] || key}
              </span>
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-2 rounded-full bg-brand-gradient"
                  style={{
                    width: `${Math.min(100, Math.max(0, value))}%`,
                  }}
                />
              </div>
              <span className="w-12 text-right text-xs tabular-nums">
                {value.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function shortLabel(s: string) {
  if (!s) return "—";
  return s.length > 38 ? `${s.slice(0, 35)}…` : s;
}
