"use client";
import React, { useEffect, useState } from "react";
import { ImSpinner } from "react-icons/im";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Holding = {
  broker: "zerodha" | "upstox";
  symbol: string;
  quantity: number;
  avgPrice: number;
  lastPrice?: number;
  weightPct?: number;
  unrealizedPnl?: number;
};

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [connections, setConnections] = useState<any[]>([]);
  const [aiText, setAiText] = useState<string>("");
  const [analyzing, setAnalyzing] = useState(false);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold">Portfolio</h1>
      <div className="flex gap-2">
        <Button onClick={linkZerodha}>Link Zerodha</Button>
        <Button onClick={linkUpstox}>Link Upstox</Button>
        <Button variant="outline" onClick={reload} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {connections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Linked Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {connections.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between border rounded p-2"
                >
                  <div>
                    <span className="font-medium capitalize">{c.broker}</span>
                    {c.displayName ? (
                      <span className="text-muted-foreground">
                        {" "}
                        — {c.displayName}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex gap-2">
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
                </div>
              ))}
              {connections.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No linked accounts.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {insights && (
        <Card>
          <CardHeader>
            <CardTitle>Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Invested</p>
                <p className="text-xl font-semibold">
                  ₹{insights.totalInvested}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Value</p>
                <p className="text-xl font-semibold">
                  ₹{insights.totalCurrent}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unrealized P&L</p>
                <p
                  className={`text-xl font-semibold ${
                    insights.totalUnrealizedPnl >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  ₹{insights.totalUnrealizedPnl}
                </p>
              </div>
            </div>
            {insights.diversificationNote && (
              <p className="mt-2 text-sm text-amber-600">
                {insights.diversificationNote}
              </p>
            )}
            {insights.topPositions?.length > 0 && (
              <div className="mt-4">
                <p className="font-medium mb-2">Top Positions</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {insights.topPositions.map((p: any) => (
                    <div
                      key={`${p.broker}-${p.symbol}`}
                      className="rounded border p-2"
                    >
                      <div className="flex justify-between">
                        <span>{p.symbol}</span>
                        <span>{p.weightPct.toFixed(1)}%</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {p.recommendation} — {p.rationale}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left p-2">Broker</th>
                  <th className="text-left p-2">Symbol</th>
                  <th className="text-right p-2">Qty</th>
                  <th className="text-right p-2">Avg Price</th>
                  <th className="text-right p-2">Last Price</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h) => (
                  <tr key={`${h.broker}-${h.symbol}`} className="border-t">
                    <td className="p-2">{h.broker}</td>
                    <td className="p-2">{h.symbol}</td>
                    <td className="p-2 text-right">{h.quantity}</td>
                    <td className="p-2 text-right">₹{h.avgPrice}</td>
                    <td className="p-2 text-right">₹{h.lastPrice ?? "-"}</td>
                  </tr>
                ))}
                {holdings.length === 0 && (
                  <tr>
                    <td className="p-4 text-center" colSpan={5}>
                      No holdings yet. Link your broker to load data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analyze with AI</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-2">
            <Button
              disabled={analyzing}
              onClick={async () => {
                setAiText("");
                setAnalyzing(true);
                try {
                  const res = await fetch("/api/insights/portfolio-ai", {
                    method: "POST",
                  });
                  const data = await res.json();
                  setAiText(data.text || "");
                } catch (error) {
                  console.error("[portfolio] AI analysis failed", error);
                  setAiText("Failed to generate analysis. Please try again.");
                } finally {
                  setAnalyzing(false);
                }
              }}
            >
              {analyzing ? (
                <span className="flex items-center gap-2">
                  <ImSpinner className="animate-spin" />
                  Analyzing...
                </span>
              ) : (
                "Run Analysis"
              )}
            </Button>
          </div>
          <pre className="whitespace-pre-wrap text-sm bg-muted p-3 rounded">
            {analyzing && !aiText
              ? "Generating analysis..."
              : aiText || "Click Run Analysis to generate AI insights."}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
