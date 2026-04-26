"use client";
import PortfolioAIInsights, {
  InsightsData,
} from "@/components/PortfolioAIInsights";
import React, { useEffect, useRef, useState } from "react";
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
import { AiSummaryCard } from "./AiSummary/AiSummary";
import { toast } from "@/hooks/use-toast";
import {
  AlertCircle,
  Camera,
  Image as ImageIcon,
  Info,
  RefreshCw,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";

const SHOW_BROKER_LINK_UI = false;

type Holding = {
  broker: "zerodha" | "upstox" | "upload";
  symbol: string;
  quantity: number;
  avgPrice: number;
  lastPrice?: number;
  weightPct?: number;
  unrealizedPnl?: number;
  assetType?: string;
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

const ASSET_LABEL: Record<string, string> = {
  stock: "Stocks",
  etf: "ETFs",
  mutual_fund: "Mutual funds",
  foreign_stock: "Foreign stocks",
  gold_bond: "Gold / SGB",
  debt: "Debt / bonds",
  other: "Other",
};

const SOURCE_LABEL: Record<string, string> = {
  zerodha: "Zerodha",
  upstox: "Upstox",
  upload: "Screenshot",
};

export default function PortfolioPageClient() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [connections, setConnections] = useState<any[]>([]);
  const [aiText, setAiText] = useState<string>("");
  const [analyzing, setAnalyzing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [dataSource, setDataSource] =
    useState<"screenshot" | "broker" | "none">("none");
  const [aiUi, setAiUi] = useState<InsightsData | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fallbackData: InsightsData = {
    kpis: {
      invested:
        insights?.totalInvested ??
        holdings.reduce((s, h) => s + (h.avgPrice || 0) * (h.quantity || 0), 0),
      current:
        insights?.totalCurrent ??
        holdings.reduce(
          (s, h) => s + (h.lastPrice ?? h.avgPrice ?? 0) * (h.quantity || 0),
          0
        ),
      pnl:
        insights?.totalUnrealizedPnl ??
        holdings.reduce(
          (s, h) =>
            s +
            ((h.lastPrice ?? h.avgPrice ?? 0) - (h.avgPrice || 0)) *
              (h.quantity || 0),
          0
        ),
    },
    performance: {
      series: (() => {
        const invested =
          insights?.totalInvested ??
          holdings.reduce(
            (s, h) => s + (h.avgPrice || 0) * (h.quantity || 0),
            0
          );
        const current =
          insights?.totalCurrent ??
          holdings.reduce(
            (s, h) => s + (h.lastPrice ?? h.avgPrice ?? 0) * (h.quantity || 0),
            0
          );
        return [
          { date: "Start", value: Math.max(0, invested) },
          { date: "Now", value: Math.max(0, current) },
        ];
      })(),
    },
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
      } else {
        setHoldings([]);
        setInsights(null);
        setDataSource("none");
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
      toast({
        title: "Holdings imported",
        description: `${json.count ?? 0} rows extracted from your screenshots.`,
      });
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
        description: "Your uploaded data has been cleared.",
      });
      await reload();
    } catch {
      toast({
        variant: "destructive",
        title: "Couldn’t remove uploaded data",
        description: "Please try again.",
      });
    }
  };

  const prettyINR = (n: number | undefined) =>
    typeof n === "number" ? n.toLocaleString("en-IN") : "-";

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
              Upload screenshots from any broker app or statement and we’ll
              read holdings into a single educational view. Nothing here is
              investment advice. In-app broker linking is paused for now.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
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
                Upload up to 6 images (PNG/JPG/WebP). AI parses tickers,
                quantity, average and current price.
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

              <div className="flex items-start gap-2 rounded-lg border bg-background/60 p-3 text-xs text-muted-foreground">
                <Info className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                <span>
                  Tip: capture the holdings list with rows visible. Crop out
                  account numbers; we don’t need them and they’re your data.
                </span>
              </div>

              {dataSource === "screenshot" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full gap-2 text-destructive hover:text-destructive"
                  onClick={clearSnapshot}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove uploaded data
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
                    {dataSource === "screenshot"
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
                  {dataSource === "screenshot" ? "Screenshot" : "Broker"}
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
                  : "Upload a screenshot to populate this view"}
              </CardDescription>
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
                        <span className="block truncate max-w-[280px]" title={h.symbol}>
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
                            No holdings loaded yet. Upload a screenshot of your
                            broker app or statement to get started.
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
  const entries = Object.entries(rows).sort((a, b) => Number(b[1]) - Number(a[1]));
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
