"use client";
import PortfolioAIInsights, {
  InsightsData,
} from "@/components/PortfolioAIInsights";
import React, { useEffect, useState } from "react";
import { ImSpinner } from "react-icons/im";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AiSummaryCard } from "./AiSummary/AiSummary";

type Holding = {
  broker: "zerodha" | "upstox";
  symbol: string;
  quantity: number;
  avgPrice: number;
  lastPrice?: number;
  weightPct?: number;
  unrealizedPnl?: number;
};

export default function PortfolioPageClient() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [connections, setConnections] = useState<any[]>([]);
  const [aiText, setAiText] = useState<string>("");
  const [analyzing, setAnalyzing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiUi, setAiUi] = useState<InsightsData | null>(null);

  const linkZerodha = async () => {
    const res = await fetch("/api/brokers/zerodha/auth");
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  const linkUpstox = async () => {
    const res = await fetch("/api/brokers/upstox/auth");
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

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
        label: h.symbol,
        value: (h.lastPrice ?? h.avgPrice ?? 0) * (h.quantity || 0),
      }));
      const total = rows.reduce((s, r) => s + r.value, 0);
      const withPct = rows
        .map((r) => ({
          label: r.label,
          percent: total > 0 ? (r.value / total) * 100 : 0,
        }))
        .sort((a, b) => b.percent - a.percent)
        .slice(0, 8);
      return withPct;
    })(),
    risk: {
      score: insights?.riskScore ?? 0,
      topHolding: insights?.concentration?.top1Pct / 100 || 0,
      top3: insights?.concentration?.top3Pct / 100 || 0,
      sectorOverlap: insights?.sectorOverlap ?? 0,
      beta: insights?.beta ?? 1,
    },
    movers: {
      winners: (insights?.winners || []).map((w: any) => ({
        symbol: w.symbol,
        name: w.symbol,
        change: `${Number(w.pnlPct ?? 0).toFixed(1)}%`,
        weight: (w.weightPct ?? 0) / 100,
        pnl: w.pnl ?? 0,
      })),
      losers: (insights?.losers || []).map((l: any) => ({
        symbol: l.symbol,
        name: l.symbol,
        change: `${Number(l.pnlPct ?? 0).toFixed(1)}%`,
        weight: (l.weightPct ?? 0) / 100,
        pnl: l.pnl ?? 0,
      })),
    },
    actions: insights?.actions || [],
    notes: insights?.notes || [],
    events: insights?.events || [],
  };

  const reload = async () => {
    setLoading(true);
    try {
      const c = await fetch("/api/brokers/list");
      const cjson = await c.json();
      setConnections(cjson.connections || []);

      const res = await fetch("/api/insights/portfolio");
      const data = await res.json();
      setHoldings(data.holdings || []);
      setInsights(data.insights || null);
    } catch (error) {
      console.error("[portfolio] reload failed", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    reload();
  }, []);

  const prettyINR = (n: number | undefined) =>
    typeof n === "number" ? n.toLocaleString("en-IN") : "-";

  return (
    <div className="relative min-h-screen">
      {analyzing && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm grid place-items-center">
          <div className="rounded-2xl bg-white text-black px-6 py-4 shadow-xl flex items-center gap-3">
            <ImSpinner className="animate-spin" />
            <span>Analyzing portfolio…</span>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />

      <div className="mx-auto max-w-6xl p-4 sm:p-6 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Portfolio
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Link your brokers, view insights, and analyze your positions with
              AI.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={linkZerodha} className="rounded-2xl">
              Link Zerodha
            </Button>
            <Button
              onClick={linkUpstox}
              variant="secondary"
              className="rounded-2xl"
            >
              Link Upstox
            </Button>
            <Button
              variant="outline"
              onClick={reload}
              disabled={loading}
              className="rounded-2xl"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <ImSpinner className="animate-spin" /> Refreshing…
                </span>
              ) : (
                "Refresh"
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 shadow-sm border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Linked Accounts</CardTitle>
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
                      className="rounded-xl"
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
                  <div className="rounded-xl border p-6 text-center text-sm text-muted-foreground">
                    No linked accounts yet. Connect a broker to get started.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 shadow-sm border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Portfolio Insights</CardTitle>
            </CardHeader>
            <CardContent>
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
                  {insights.diversificationNote && (
                    <div className="mt-3 text-sm text-amber-600">
                      {insights.diversificationNote}
                    </div>
                  )}
                  {insights.brokerAllocation && (
                    <div className="mt-6">
                      <p className="font-medium mb-2">Broker Allocation</p>
                      <div className="space-y-2">
                        {Object.entries(insights.brokerAllocation).map(
                          ([broker, pct]: any) => (
                            <div
                              key={broker}
                              className="flex items-center gap-3"
                            >
                              <span className="w-24 capitalize text-xs text-muted-foreground">
                                {broker}
                              </span>
                              <div className="flex-1 h-2 rounded-full bg-muted">
                                <div
                                  className="h-2 rounded-full bg-primary"
                                  style={{
                                    width: `${Math.min(
                                      100,
                                      Math.max(0, Number(pct))
                                    )}%`,
                                  }}
                                />
                              </div>
                              <span className="w-12 text-right text-xs">
                                {Number(pct).toFixed(1)}%
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                  {insights.topPositions?.length > 0 && (
                    <div className="mt-6 rounded-xl border p-4">
                      <p className="font-medium mb-3">Top Positions</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {insights.topPositions.map((p: any) => (
                          <div
                            key={`${p.broker}-${p.symbol}`}
                            className="rounded-lg border p-3"
                          >
                            <div className="flex justify-between text-sm font-medium">
                              <span>{p.symbol}</span>
                              <span>{Number(p.weightPct).toFixed(1)}%</span>
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground">
                              {p.recommendation} — {p.rationale}
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

        <Card className="shadow-sm border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Holdings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="text-left">
                    <th className="px-3 py-2 font-medium">Broker</th>
                    <th className="px-3 py-2 font-medium">Symbol</th>
                    <th className="px-3 py-2 font-medium text-right">Qty</th>
                    <th className="px-3 py-2 font-medium text-right">
                      Avg Price
                    </th>
                    <th className="px-3 py-2 font-medium text-right">
                      Last Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((h, idx) => (
                    <tr
                      key={`${h.broker}-${h.symbol}`}
                      className={`border-t hover:bg-muted/40 ${
                        idx % 2 === 0 ? "bg-background" : "bg-background/60"
                      }`}
                    >
                      <td className="px-3 py-2 capitalize">
                        <span className="inline-flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-primary/70" />
                          {h.broker}
                        </span>
                      </td>
                      <td className="px-3 py-2 font-medium">{h.symbol}</td>
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
                        className="p-6 text-center text-muted-foreground"
                        colSpan={5}
                      >
                        No holdings yet. Link your broker to load data.
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
              setAiText("Failed to generate analysis.");
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
