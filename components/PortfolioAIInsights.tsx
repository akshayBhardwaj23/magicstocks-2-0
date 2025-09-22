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
  BarChart,
  Bar,
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
} from "lucide-react";

/**
 * Drop-in, stylish replacement for the current "Analyze with AI" block.
 *
 * Usage:
 *   <PortfolioAIInsights data={sampleData} onRunAnalysis={() => {...}} />
 *
 * Props shape is documented at the bottom along with `sampleData` you can wire up quickly.
 */

export default function PortfolioAIInsights({
  data,
  aiText,
  onRunAnalysis,
}: {
  data: InsightsData;
  aiText?: string;
  onRunAnalysis?: () => void;
}) {
  const colors = {
    bg: "bg-neutral-900",
    card: "bg-neutral-900/60",
    ring: "ring-1 ring-white/10",
    textMuted: "text-white/70",
    pos: "text-emerald-400",
    neg: "text-rose-400",
  } as const;

  const allocColors = [
    "#60A5FA",
    "#34D399",
    "#F472B6",
    "#FBBF24",
    "#A78BFA",
    "#22D3EE",
    "#F97316",
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
    // include existing start/now points for the actual equity curve if provided
    for (const p of perfSeries)
      base.push({ date: String(p.date), value: Number(p.value) });
    // add yearly projections if present
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

  return (
    <div
      className={`w-full ${colors.bg} text-white rounded-2xl p-4 md:p-6 ${colors.ring} shadow-2xl`}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            AI Portfolio Insights
          </h2>
          <p className={`mt-1 ${colors.textMuted}`}>
            Smarter, actionable signals across performance, risk &
            diversification.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            className="bg-white/10 hover:bg-white/20"
            onClick={onRunAnalysis}
          >
            Run AI Analysis
          </Button>
          <Button
            className="gap-2"
            onClick={() => {
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
  <title>MagicStocks Portfolio Report</title>
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
  <script>
    window.onload = () => { window.print(); };
  </script>
  </head>
<body>
  <div class="no-print" style="text-align:right; margin-bottom:8px;">
    <button onclick="window.print()" style="padding:8px 12px; border-radius:8px; border:1px solid #e5e7eb; background:#f9fafb; cursor:pointer;">Print / Save as PDF</button>
  </div>
  <h1>MagicStocks Portfolio Report</h1>

  <div class="kpis">
    <div class="card"><div class="muted">Invested</div><div style="font-weight:600; font-size:18px;">₹${fmt(
      data.kpis.invested
    )}</div></div>
    <div class="card"><div class="muted">Current Value</div><div style="font-weight:600; font-size:18px;">₹${fmt(
      data.kpis.current
    )}</div></div>
    <div class="card"><div class="muted">Unrealized P&L</div><div style="font-weight:600; font-size:18px;">₹${fmt(
      data.kpis.pnl
    )}</div></div>
  </div>

  <div class="section">
    <h2>Allocation (Top)</h2>
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

  <div class="section">
    <h2>Movers</h2>
    <h3>Winners</h3>
    <ul>
      ${(data.movers.winners || [])
        .map(
          (w) =>
            `<li>${escape(w.symbol)}: ${escape(w.change)} (weight ${(
              w.weight * 100
            ).toFixed(1)}%)</li>`
        )
        .join("")}
    </ul>
    <h3>Losers</h3>
    <ul>
      ${(data.movers.losers || [])
        .map(
          (l) =>
            `<li>${escape(l.symbol)}: ${escape(l.change)} (weight ${(
              l.weight * 100
            ).toFixed(1)}%)</li>`
        )
        .join("")}
    </ul>
  </div>

  ${
    proj.value5y
      ? `<div class="section">
    <h2>Projections</h2>
    <ul>
      <li>5Y (mid): ₹${fmt(proj.value5y.mid)}</li>
      <li>10Y (mid): ₹${fmt(proj.value10y.mid)}</li>
      <li>CAGR (L/M/H): ${proj.cagr.low}% / ${proj.cagr.mid}% / ${
          proj.cagr.high
        }%</li>
    </ul>
  </div>`
      : ``
  }

  ${
    aiText
      ? `<div class="section"><h2>AI Summary</h2><pre>${escape(
          aiText
        )}</pre></div>`
      : ``
  }

  <div class="footer">Generated by MagicStocks.ai</div>
</body>
</html>`;

              const w = window.open("", "_blank", "noopener,noreferrer");
              if (!w) return;
              w.document.write(html);
              w.document.close();
            }}
          >
            Export PDF <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <KpiTile
          title="Invested"
          value={`₹${formatINR(data.kpis.invested)}`}
          sub={"Total capital deployed"}
        />
        <KpiTile
          title="Current Value"
          value={`₹${formatINR(data.kpis.current)}`}
          sub={
            <span>
              Since start:{" "}
              <span className={data.kpis.pnl >= 0 ? colors.pos : colors.neg}>
                {pct(data.kpis.pnl / data.kpis.invested)}
              </span>
            </span>
          }
        />
        <KpiTile
          title="Unrealized P&L"
          value={
            <span
              className={
                data.kpis.pnl >= 0 ? "text-emerald-300" : "text-rose-300"
              }
            >{`₹${formatINR(Math.abs(data.kpis.pnl))}`}</span>
          }
          sub={
            <span className="flex items-center gap-1">
              {data.kpis.pnl >= 0 ? (
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-rose-400" />
              )}{" "}
              {data.kpis.pnl >= 0 ? "Gain" : "Drawdown"}
            </span>
          }
        />
      </div>

      {Boolean((data as any).projection) && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <KpiTile
            title="5Y Projection"
            value={`₹${formatINR((data as any).projection.value5y.mid)}`}
            sub={
              <span className={colors.textMuted}>
                Low {(data as any).projection.cagr.low}% · Mid{" "}
                {(data as any).projection.cagr.mid}% · High{" "}
                {(data as any).projection.cagr.high}%
              </span>
            }
          />
          <KpiTile
            title="10Y Projection"
            value={`₹${formatINR((data as any).projection.value10y.mid)}`}
            sub={
              <span className={colors.textMuted}>
                Low {(data as any).projection.cagr.low}% · Mid{" "}
                {(data as any).projection.cagr.mid}% · High{" "}
                {(data as any).projection.cagr.high}%
              </span>
            }
          />
          <div className="hidden md:block" />
        </div>
      )}

      {/* Charts + Risk */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-6">
        <Card className={`${colors.card} ${colors.ring}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2">
              <LineIcon className="h-5 w-5" /> Equity Curve
            </CardTitle>
          </CardHeader>
          <CardContent className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={equityData}
                margin={{ left: 0, right: 0, top: 10, bottom: 0 }}
              >
                <XAxis dataKey="date" hide />
                <YAxis hide domain={["auto", "auto"]} />
                <Tooltip
                  contentStyle={{
                    background: "#0B0B0C",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                  }}
                  labelFormatter={() => ""}
                  formatter={(v: number) => [`₹${formatINR(v)}`, "Value"]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#86efac"
                  strokeWidth={2}
                  dot={false}
                />
                {projection && (
                  <>
                    <Line
                      type="monotone"
                      dataKey="projLow"
                      stroke="#60a5fa"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="projMid"
                      stroke="#fbbf24"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="projHigh"
                      stroke="#f472b6"
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

        <Card className={`${colors.card} ${colors.ring}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2">
              <PieIcon className="h-5 w-5" /> Allocation
            </CardTitle>
          </CardHeader>
          <CardContent className="h-56">
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
                    >
                      {allocPie.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.fill as string}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#0B0B0C",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 12,
                      }}
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
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-sm"
                        style={{ background: a.fill as string }}
                      />
                      <span className="truncate max-w-[140px]">{a.name}</span>
                    </div>
                    <span className="tabular-nums text-white/80">
                      {a.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${colors.card} ${colors.ring}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" /> Risk Meter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className={colors.textMuted}>Overall risk</span>
                <Badge variant="secondary" className="bg-white/10">
                  {riskLabel(riskPct)}
                </Badge>
              </div>
              <Progress value={riskPct} className="h-2.5" />
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-white/5 p-3">
                  <div className={colors.textMuted}>Top holding weight</div>
                  <div className="text-lg">{pct(data.risk.topHolding)}</div>
                </div>
                <div className="rounded-xl bg-white/5 p-3">
                  <div className={colors.textMuted}>Top-3 concentration</div>
                  <div className="text-lg">{pct(data.risk.top3)}</div>
                </div>
                <div className="rounded-xl bg-white/5 p-3">
                  <div className={colors.textMuted}>Sector diversification</div>
                  <div className="text-lg">
                    {pct(1 - data.risk.sectorOverlap)}
                  </div>
                </div>
                <div className="rounded-xl bg-white/5 p-3">
                  <div className={colors.textMuted}>Beta vs NIFTY</div>
                  <div className="text-lg">{data.risk.beta.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Winners & Losers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <MovementCard
          title="Winners"
          icon={<ArrowUpRight className="h-4 w-4 text-emerald-400" />}
          rows={data.movers.winners}
          positive
        />
        <MovementCard
          title="Losers"
          icon={<ArrowDownRight className="h-4 w-4 text-rose-400" />}
          rows={data.movers.losers}
        />
      </div>

      {/* AI Takeaways */}
      <Tabs defaultValue="actions" className="mt-6">
        <TabsList className="bg-white/10">
          <TabsTrigger value="actions">Actionable Next Steps</TabsTrigger>
          <TabsTrigger value="notes">AI Notes</TabsTrigger>
          <TabsTrigger value="events">Upcoming Events</TabsTrigger>
        </TabsList>
        <TabsContent value="actions" className="mt-4">
          <Card className={`${colors.card} ${colors.ring}`}>
            <CardContent className="p-4">
              {data.actions.length === 0 ? (
                <div className="text-sm text-white/70">
                  No actionable steps yet. Run analysis to generate suggestions.
                </div>
              ) : (
                <ul className="space-y-3 text-sm leading-relaxed">
                  {data.actions.map((a, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <span className="mt-1">
                        <Target className="h-4 w-4 text-sky-300" />
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
          <Card className={`${colors.card} ${colors.ring}`}>
            <CardContent className="p-4 space-y-3 text-sm">
              {data.notes.length === 0 ? (
                <div className="text-sm text-white/70">
                  No AI notes available yet.
                </div>
              ) : (
                data.notes.map((n, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="mt-0.5">
                      <AlertTriangle className="h-4 w-4 text-amber-300" />
                    </span>
                    <p className="leading-relaxed">{n}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="events" className="mt-4">
          <Card className={`${colors.card} ${colors.ring}`}>
            <CardContent className="p-0">
              {data.events.length === 0 ? (
                <div className="p-4 text-sm text-white/70">
                  No upcoming events detected.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-12 text-xs uppercase tracking-wide text-white/60 px-4 py-2">
                    <div className="col-span-3">Date</div>
                    <div className="col-span-4">Company</div>
                    <div className="col-span-3">Event</div>
                    <div className="col-span-2 text-right">Impact</div>
                  </div>
                  <Separator className="bg-white/10" />
                  {data.events.map((e, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-12 px-4 py-3 items-center hover:bg-white/5"
                    >
                      <div className="col-span-3 text-sm">{e.date}</div>
                      <div className="col-span-4 flex items-center gap-2 text-sm">
                        <Badge variant="secondary" className="bg-white/10">
                          {e.symbol}
                        </Badge>
                        <span className="truncate">{e.company}</span>
                      </div>
                      <div className="col-span-3 text-sm">{e.title}</div>
                      <div className="col-span-2 text-right text-sm">
                        <span
                          className={
                            e.impact === "High"
                              ? "text-rose-300"
                              : e.impact === "Medium"
                              ? "text-amber-300"
                              : "text-emerald-300"
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

      {/* Compliance Note */}
      <Alert className="mt-6 bg-white/5 border-white/10">
        <AlertTitle>Heads‑up</AlertTitle>
        <AlertDescription className={colors.textMuted}>
          These are AI‑assisted insights, not investment advice. Consider
          consulting a registered advisor before acting on any signal.
        </AlertDescription>
      </Alert>
    </div>
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
    <Card className="bg-neutral-900/60 ring-1 ring-white/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-white/80 text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl md:text-3xl font-semibold">{value}</div>
        {sub && <div className="text-white/60 text-sm mt-1">{sub}</div>}
      </CardContent>
    </Card>
  );
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
    <Card className="bg-neutral-900/60 ring-1 ring-white/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center gap-2">
          {icon} {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-12 text-xs uppercase tracking-wide text-white/60 px-4 py-2">
          <div className="col-span-5">Stock</div>
          <div className="col-span-3">Change</div>
          <div className="col-span-2 text-right">Weight</div>
          <div className="col-span-2 text-right">P&L</div>
        </div>
        <Separator className="bg-white/10" />
        {rows.map((r, i) => (
          <div
            key={i}
            className="grid grid-cols-12 px-4 py-3 items-center hover:bg-white/5"
          >
            <div className="col-span-5 flex items-center gap-2">
              <Badge variant="secondary" className="bg-white/10">
                {r.symbol}
              </Badge>
              <div className="truncate">{r.name}</div>
            </div>
            <div
              className={`col-span-3 text-sm ${
                positive ? "text-emerald-300" : "text-rose-300"
              }`}
            >
              {r.change}
            </div>
            <div className="col-span-2 text-right text-sm">{pct(r.weight)}</div>
            <div
              className={`col-span-2 text-right text-sm ${
                r.pnl >= 0 ? "text-emerald-300" : "text-rose-300"
              }`}
            >
              {r.pnl >= 0 ? "+" : "-"}₹{formatINR(Math.abs(r.pnl))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function pct(n: number) {
  return `${(n * 100).toFixed(1)}%`;
}
function formatINR(n: number) {
  return n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}
function riskLabel(p: number) {
  if (p < 33) return "Low";
  if (p < 66) return "Moderate";
  return "High";
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
