import React, { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSanitize from "rehype-sanitize";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ImSpinner } from "react-icons/im";

// ---- Drop-in AI Summary Card ----
export function AiSummaryCard({
  text,
  loading = false,
  filename = "magicstocks-analysis.md",
}: {
  text: string | null | undefined;
  loading?: boolean;
  filename?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const safeText = useMemo(
    () => (typeof text === "string" ? text.trim() : ""),
    [text]
  );

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(safeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const onDownload = () => {
    const blob = new Blob([safeText || ""], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onPrint = () => {
    // open a minimal print view
    const w = window.open(
      "",
      "_blank",
      "noopener,noreferrer,width=900,height=1200"
    );
    if (!w) return;
    w.document.write(`
      <html>
        <head>
          <title>AI Summary</title>
          <style>
            body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height: 1.5; padding: 24px; }
            h1,h2,h3 { margin-top: 1.2em; }
            code, pre { background: #f6f8fa; padding: 2px 4px; border-radius: 4px; }
            pre { padding: 12px; overflow: auto; }
            ul { margin-left: 1.2em; }
          </style>
        </head>
        <body>
          <pre>${safeText.replace(
            /[&<>"']/g,
            (m) =>
              ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
              }[m] as string)
          )}</pre>
          <script>window.onload = () => window.print()</script>
        </body>
      </html>
    `);
    w.document.close();
  };

  return (
    <Card className="mt-4 shadow-sm border-border/60">
      <CardHeader className="pb-3">
        <div className="flex items-end justify-between gap-2">
          <CardTitle className="text-base">AI Summary</CardTitle>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onCopy}
              disabled={!safeText}
            >
              {copied ? "Copied!" : "Copy"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onDownload}
              disabled={!safeText}
            >
              Download
            </Button>
            <Button size="sm" onClick={onPrint} disabled={!safeText}>
              Print
            </Button>
          </div>
        </div>
      </CardHeader>

      <Separator className="opacity-40" />

      <CardContent>
        {loading && !safeText ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground p-4">
            <ImSpinner className="animate-spin" /> Generating analysis…
          </div>
        ) : !safeText ? (
          <div className="text-sm text-muted-foreground p-4">
            Click <span className="font-medium">Run Analysis</span> to generate
            AI insights.
          </div>
        ) : (
          <>
            <div
              className={[
                "prose prose-sm max-w-none dark:prose-invert",
                "prose-h2:scroll-mt-24 prose-h3:scroll-mt-24",
                "prose-li:leading-6",
                !expanded ? "relative max-h-80 overflow-hidden" : "",
              ].join(" ")}
            >
              {/* Fade overlay when collapsed */}
              {!expanded && (
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
              )}

              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                  rehypeSlug,
                  [rehypeAutolinkHeadings, { behavior: "wrap" }],
                  rehypeSanitize, // keep safe: no raw HTML execution
                ]}
                components={{
                  a: (props) => (
                    <a
                      {...props}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-dotted"
                    />
                  ),
                  li: ({ children, ...props }) => (
                    <li {...props} className="marker:text-primary/80">
                      {children}
                    </li>
                  ),
                  code: ({ inline, children, ...props }: any) =>
                    inline ? (
                      <code
                        {...props}
                        className="px-1 py-0.5 rounded bg-muted text-foreground"
                      >
                        {children}
                      </code>
                    ) : (
                      <pre className="p-3 rounded-lg bg-muted overflow-auto">
                        <code {...props}>{children}</code>
                      </pre>
                    ),
                  blockquote: ({ children, ...props }) => (
                    <blockquote
                      {...props}
                      className="border-l-2 pl-3 italic text-muted-foreground bg-muted/40 rounded-r"
                    >
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {safeText}
              </ReactMarkdown>
            </div>

            {/* Expand / collapse */}
            <div className="mt-3">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setExpanded((v) => !v)}
              >
                {expanded ? "Show less" : "Show more"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
