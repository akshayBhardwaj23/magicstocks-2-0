import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Target,
  PieChart as PieIcon,
  ShieldAlert,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  LineChart as LineIcon,
  Sparkles,
} from "lucide-react";

export default function PortfolioAIInsights({
  data,
  aiText,
  onRunAnalysis,
}: {
  data: InsightsData;
  aiText?: string;
  onRunAnalysis?: () => void;
}) {
  const allocColors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(var(--primary))",
    "hsl(var(--accent))",
  ];

  const allocPie = data.allocations.map((a, i) => ({
    name: a.label,
    value: Number(a.percent.toFixed(2)),
    fill: allocColors[i % allocColors.length],
  }));
  const perfSeries = data.performance.series;
  const projection: any = (data as any).projection;
  const equityData = (() => {
    const base: {
      date: string;
      value?: number;
      projLow?: number;
      projMid?: number;
      projHigh?: number;
    }[] = [];
    for (const p of perfSeries)
      base.push({ date: String(p.date), value: Number(p.value) });
    if (projection && data.kpis?.current) {
      const current = Number(data.kpis.current);
      const { low, mid, high } = projection.cagr || {};
      const cLow = Number(low),
        cMid = Number(mid),
        cHigh = Number(high);
      const years = 10;
      for (let y = 0; y <= years; y++) {
        const label = y === 0 ? "Now" : `Y${y}`;
        const row: any = { date: label };
        if (y === 0) {
          row.projLow = current;
          row.projMid = current;
          row.projHigh = current;
        } else {
          const fv = (rate: number) => current * Math.pow(1 + rate / 100, y);
          if (Number.isFinite(cLow)) row.projLow = Math.round(fv(cLow));
          if (Number.isFinite(cMid)) row.projMid = Math.round(fv(cMid));
          if (Number.isFinite(cHigh)) row.projHigh = Math.round(fv(cHigh));
        }
        base.push(row);
      }
    }
    return base;
  })();

  const riskPct = Math.min(100, Math.max(0, Math.round(data.risk.score * 100)));
  const tooltipStyle = {
    background: "hsl(var(--popover))",
    border: "1px solid hsl(var(--border))",
    borderRadius: 12,
    color: "hsl(var(--popover-foreground))",
  } as const;

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <div className="absolute inset-0 hero-spotlight pointer-events-none" />
        <div className="relative px-5 py-6 md:px-7 md:py-8 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary border-primary/20"
              >
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                AI portfolio context
              </Badge>
              <h2 className="mt-3 font-display text-2xl md:text-3xl font-semibold tracking-tight">
                Educational view of your holdings
              </h2>
              <p className="mt-1 text-sm md:text-base text-muted-foreground max-w-2xl">
                Numbers and themes for learning—not a recommendation to
                transact.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={onRunAnalysis}>
                Run AI context
              </Button>
              <Button
                className="gap-2 bg-brand-gradient hover:opacity-90 transition"
                onClick={() => exportPdf(data, aiText)}
              >
                Export PDF <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-5 md:p-7 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KpiTile
            title="Invested"
            value={`₹${formatINR(data.kpis.invested)}`}
            sub={"Total capital deployed"}
          />
          <KpiTile
            title="Current value"
            value={`₹${formatINR(data.kpis.current)}`}
            sub={
              <span>
                Since start:{" "}
                <span
                  className={
                    data.kpis.pnl >= 0 ? "text-success" : "text-destructive"
                  }
                >
                  {pct(data.kpis.pnl / Math.max(1, data.kpis.invested))}
                </span>
              </span>
            }
          />
          <KpiTile
            title="Unrealized P&L"
            value={
              <span
                className={
                  data.kpis.pnl >= 0 ? "text-success" : "text-destructive"
                }
              >{`₹${formatINR(Math.abs(data.kpis.pnl))}`}</span>
            }
            sub={
              <span className="flex items-center gap-1">
                {data.kpis.pnl >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}{" "}
                {data.kpis.pnl >= 0 ? "Gain" : "Drawdown"}
              </span>
            }
          />
        </div>

        {Boolean((data as any).projection) && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Illustrative compounding only—hypothetical numbers for
              education, not a promise of future results or a recommendation to
              hold, buy, or sell.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <KpiTile
                title="5Y illustration (mid)"
                value={`₹${formatINR((data as any).projection.value5y.mid)}`}
                sub={
                  <span className="text-muted-foreground">
                    Low {(data as any).projection.cagr.low}% · Mid{" "}
                    {(data as any).projection.cagr.mid}% · High{" "}
                    {(data as any).projection.cagr.high}%
                  </span>
                }
              />
              <KpiTile
                title="10Y illustration (mid)"
                value={`₹${formatINR((data as any).projection.value10y.mid)}`}
                sub={
                  <span className="text-muted-foreground">
                    Low {(data as any).projection.cagr.low}% · Mid{" "}
                    {(data as any).projection.cagr.mid}% · High{" "}
                    {(data as any).projection.cagr.high}%
                  </span>
                }
              />
              <div className="hidden md:block" />
            </div>
          </div>
        )}

        {/* Charts + risk */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card className="surface-soft">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <LineIcon className="h-4 w-4 text-primary" /> Equity curve
              </CardTitle>
            </CardHeader>
            <CardContent className="h-56 pt-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={equityData}
                  margin={{ left: 0, right: 0, top: 10, bottom: 0 }}
                >
                  <XAxis dataKey="date" hide />
                  <YAxis hide domain={["auto", "auto"]} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelFormatter={() => ""}
                    formatter={(v: number) => [`₹${formatINR(v)}`, "Value"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                  {projection && (
                    <>
                      <Line
                        type="monotone"
                        dataKey="projLow"
                        stroke="hsl(var(--chart-3))"
                        strokeDasharray="4 4"
                        strokeWidth={1.5}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="projMid"
                        stroke="hsl(var(--chart-4))"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="projHigh"
                        stroke="hsl(var(--chart-5))"
                        strokeDasharray="4 4"
                        strokeWidth={1.5}
                        dot={false}
                      />
                    </>
                  )}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="surface-soft">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <PieIcon className="h-4 w-4 text-primary" /> Allocation
              </CardTitle>
            </CardHeader>
            <CardContent className="h-56 pt-0">
              <div className="h-full grid grid-cols-2">
                <div className="h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={allocPie}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={55}
                        outerRadius={80}
                        stroke="hsl(var(--card))"
                      >
                        {allocPie.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.fill as string}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={tooltipStyle}
                        formatter={(v: number, n: string) => [`${v}%`, n]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="pl-3 space-y-2 overflow-y-auto">
                  {allocPie.map((a, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-2 text-sm"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="h-2.5 w-2.5 rounded-sm shrink-0"
                          style={{ background: a.fill as string }}
                        />
                        <span className="truncate">{a.name}</span>
                      </div>
                      <span className="tabular-nums text-muted-foreground">
                        {a.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="surface-soft">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldAlert className="h-4 w-4 text-primary" /> Risk meter
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Overall risk</span>
                  <Badge variant="secondary">{riskLabel(riskPct)}</Badge>
                </div>
                <Progress value={riskPct} className="h-2.5" />
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <RiskTile
                    label="Top holding weight"
                    value={pct(data.risk.topHolding)}
                  />
                  <RiskTile
                    label="Top-3 concentration"
                    value={pct(data.risk.top3)}
                  />
                  <RiskTile
                    label="Sector diversification"
                    value={pct(1 - data.risk.sectorOverlap)}
                  />
                  <RiskTile
                    label="Beta vs NIFTY"
                    value={data.risk.beta.toFixed(2)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Movers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <MovementCard
            title="Winners"
            icon={<ArrowUpRight className="h-4 w-4 text-success" />}
            rows={data.movers.winners}
            positive
          />
          <MovementCard
            title="Losers"
            icon={<ArrowDownRight className="h-4 w-4 text-destructive" />}
            rows={data.movers.losers}
          />
        </div>

        {/* AI takeaways */}
        <Tabs defaultValue="actions">
          <TabsList>
            <TabsTrigger value="actions">Educational points</TabsTrigger>
            <TabsTrigger value="notes">AI notes</TabsTrigger>
            <TabsTrigger value="events">Upcoming events</TabsTrigger>
          </TabsList>
          <TabsContent value="actions" className="mt-4">
            <Card>
              <CardContent className="p-4">
                {data.actions.length === 0 ? (
                  <EmptyHint text="No educational points yet. Run AI context to generate learning notes." />
                ) : (
                  <ul className="space-y-3 text-sm leading-relaxed">
                    {data.actions.map((a, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <span className="mt-1">
                          <Target className="h-4 w-4 text-primary" />
                        </span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="notes" className="mt-4">
            <Card>
              <CardContent className="p-4 space-y-3 text-sm">
                {data.notes.length === 0 ? (
                  <EmptyHint text="No AI notes available yet." />
                ) : (
                  data.notes.map((n, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="mt-0.5">
                        <AlertTriangle className="h-4 w-4 text-warning" />
                      </span>
                      <p className="leading-relaxed">{n}</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="events" className="mt-4">
            <Card>
              <CardContent className="p-0">
                {data.events.length === 0 ? (
                  <div className="p-4">
                    <EmptyHint text="No upcoming events detected." />
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-12 text-xs uppercase tracking-wide text-muted-foreground px-4 py-2">
                      <div className="col-span-3">Date</div>
                      <div className="col-span-4">Company</div>
                      <div className="col-span-3">Event</div>
                      <div className="col-span-2 text-right">Impact</div>
                    </div>
                    <Separator />
                    {data.events.map((e, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-12 px-4 py-3 items-center hover:bg-muted/40"
                      >
                        <div className="col-span-3 text-sm">{e.date}</div>
                        <div className="col-span-4 flex items-center gap-2 text-sm">
                          <Badge variant="secondary">{e.symbol}</Badge>
                          <span className="truncate">{e.company}</span>
                        </div>
                        <div className="col-span-3 text-sm">{e.title}</div>
                        <div className="col-span-2 text-right text-sm">
                          <span
                            className={
                              e.impact === "High"
                                ? "text-destructive"
                                : e.impact === "Medium"
                                ? "text-warning"
                                : "text-success"
                            }
                          >
                            {e.impact}
                          </span>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Alert className="bg-muted/50 border-primary/20">
          <AlertTitle className="font-semibold">Important</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            MagicStocks.ai is not a SEBI-registered investment adviser or
            research analyst. Content here is for information and education
            only—it is not investment, legal, or tax advice. Consult a
            SEBI-registered investment adviser or other qualified professional
            before making investment decisions.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

function KpiTile({
  title,
  value,
  sub,
}: {
  title: React.ReactNode;
  value: React.ReactNode;
  sub?: React.ReactNode;
}) {
  return (
    <Card className="surface-soft">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground font-medium">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl md:text-3xl font-display font-semibold tabular-nums">
          {value}
        </div>
        {sub && <div className="text-muted-foreground text-sm mt-1">{sub}</div>}
      </CardContent>
    </Card>
  );
}

function RiskTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-background p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-base font-semibold tabular-nums">
        {value}
      </div>
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return <div className="text-sm text-muted-foreground">{text}</div>;
}

function MovementCard({
  title,
  icon,
  rows,
  positive = false,
}: {
  title: string;
  icon: React.ReactNode;
  rows: MovementRow[];
  positive?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          {icon} {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {rows.length === 0 ? (
          <div className="p-4">
            <EmptyHint text="No data yet." />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-12 text-xs uppercase tracking-wide text-muted-foreground px-4 py-2">
              <div className="col-span-5">Stock</div>
              <div className="col-span-3">Change</div>
              <div className="col-span-2 text-right">Weight</div>
              <div className="col-span-2 text-right">P&L</div>
            </div>
            <Separator />
            {rows.map((r, i) => (
              <div
                key={i}
                className="grid grid-cols-12 px-4 py-3 items-center hover:bg-muted/40"
              >
                <div className="col-span-5 flex items-center gap-2 min-w-0">
                  <Badge variant="secondary" className="shrink-0">
                    {r.symbol}
                  </Badge>
                  <div className="truncate text-sm">{r.name}</div>
                </div>
                <div
                  className={`col-span-3 text-sm ${
                    positive ? "text-success" : "text-destructive"
                  }`}
                >
                  {r.change}
                </div>
                <div className="col-span-2 text-right text-sm tabular-nums">
                  {pct(r.weight)}
                </div>
                <div
                  className={`col-span-2 text-right text-sm tabular-nums ${
                    r.pnl >= 0 ? "text-success" : "text-destructive"
                  }`}
                >
                  {r.pnl >= 0 ? "+" : "-"}₹{formatINR(Math.abs(r.pnl))}
                </div>
              </div>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function pct(n: number) {
  if (!Number.isFinite(n)) return "0.0%";
  return `${(n * 100).toFixed(1)}%`;
}
function formatINR(n: number) {
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}
function riskLabel(p: number) {
  if (p < 33) return "Low";
  if (p < 66) return "Moderate";
  return "High";
}

function exportPdf(data: InsightsData, aiText?: string) {
  const fmt = (n: number) =>
    n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  const proj: any = (data as any).projection || {};
  const escape = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>MagicStocks — educational portfolio context</title>
<style>
  body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color: #0b0b0c; padding: 24px; }
  h1 { font-size: 22px; margin: 0 0 12px; }
  h2 { font-size: 16px; margin: 20px 0 8px; }
  ul { margin: 6px 0 12px 18px; }
  .kpis { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; }
  .card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px; }
  .muted { color: #6b7280; }
  .section { margin-top: 16px; }
  .footer { margin-top: 24px; font-size: 12px; color: #6b7280; }
  @media print { .no-print { display: none; } }
</style>
<script>window.onload = () => { window.print(); };</script>
</head>
<body>
<div class="no-print" style="text-align:right; margin-bottom:8px;">
  <button onclick="window.print()" style="padding:8px 12px; border-radius:8px; border:1px solid #e5e7eb; background:#f9fafb; cursor:pointer;">Print / Save as PDF</button>
</div>
<h1>MagicStocks — educational portfolio context</h1>

<div class="kpis">
  <div class="card"><div class="muted">Invested</div><div style="font-weight:600; font-size:18px;">₹${fmt(
    data.kpis.invested
  )}</div></div>
  <div class="card"><div class="muted">Current value</div><div style="font-weight:600; font-size:18px;">₹${fmt(
    data.kpis.current
  )}</div></div>
  <div class="card"><div class="muted">Unrealized P&amp;L</div><div style="font-weight:600; font-size:18px;">₹${fmt(
    data.kpis.pnl
  )}</div></div>
</div>

<div class="section">
  <h2>Allocation (top)</h2>
  <ul>
    ${(data.allocations || [])
      .map((a) => `<li>${escape(a.label)}: ${a.percent.toFixed(2)}%</li>`)
      .join("")}
  </ul>
</div>

<div class="section">
  <h2>Risk</h2>
  <ul>
    <li>Overall score: ${(data.risk.score * 100).toFixed(0)}%</li>
    <li>Top holding: ${(data.risk.topHolding * 100).toFixed(1)}%</li>
    <li>Top-3 concentration: ${(data.risk.top3 * 100).toFixed(1)}%</li>
    <li>Beta vs NIFTY: ${data.risk.beta.toFixed(2)}</li>
  </ul>
</div>

${
  proj.value5y
    ? `<div class="section">
  <h2>Illustrative projections (education only)</h2>
  <ul>
    <li>5Y (mid): ₹${fmt(proj.value5y.mid)}</li>
    <li>10Y (mid): ₹${fmt(proj.value10y.mid)}</li>
    <li>CAGR (L/M/H): ${proj.cagr.low}% / ${proj.cagr.mid}% / ${proj.cagr.high}%</li>
  </ul>
</div>`
    : ``
}
${
  aiText
    ? `<div class="section"><h2>Educational AI text</h2><pre>${escape(
        aiText
      )}</pre></div>`
    : ``
}

<div class="footer">Information and education only. Not SEBI-regulated investment advice. Generated by MagicStocks.ai</div>
</body>
</html>`;

  const w = window.open("", "_blank", "noopener,noreferrer");
  if (!w) return;
  w.document.write(html);
  w.document.close();
}

// ---------- Types ----------
export type InsightsData = {
  kpis: { invested: number; current: number; pnl: number };
  performance: { series: { date: string; value: number }[] };
  allocations: { label: string; percent: number }[];
  risk: {
    score: number;
    topHolding: number;
    top3: number;
    sectorOverlap: number;
    beta: number;
  };
  movers: { winners: MovementRow[]; losers: MovementRow[] };
  actions: string[];
  notes: string[];
  events: {
    date: string;
    symbol: string;
    company: string;
    title: string;
    impact: "Low" | "Medium" | "High";
  }[];
};

export type MovementRow = {
  symbol: string;
  name: string;
  change: string;
  weight: number;
  pnl: number;
};
