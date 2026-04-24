# MagicStocks 2.0 — Project perspective

This note captures how the codebase reads end-to-end: what the product is trying to be, what is already in place, and where the natural next steps seem to sit. It is a working mental model, not a spec.

---

## What this application is

**MagicStocks.ai** is a **Next.js 15** web app aimed at the **Indian equity market** (NSE, BSE). Positioning (as of the compliance pass): **information and education**—the system prompt, portfolio copy, and legal pages state the product is **not** SEBI-registered and does not provide personalized buy/sell/hold or “tips.” Users are directed to qualified professionals for investment decisions.

In practice, the product bundles three main ideas:

1. **Conversational research** — A chat UI (`HomePage` + Vercel AI `useChat`) backed by a **streaming** API that calls **Perplexity** via the OpenAI-compatible client (`lib/customAiModel.ts`, model name `sonar` in `constants/constants.ts`). Responses are steered by a long **system message** tuned for Indian stocks, price formatting, and a repeatable answer skeleton.
2. **Usage economics** — Users get **credits** (`User.current_messages`, default 2 in the schema). Each completed chat turn decrements credits; at zero, the API returns a **“Credits expired”** style error the UI turns into a toast and link to **Manage Credits**.
3. **Portfolio context (education)** — A **logged-in** `/portfolio` area for **educational** portfolio views. **In-app broker OAuth (e.g. Zerodha/Upstox) is currently disabled in the UI**; existing backend routes and `BrokerConnection` can still support dev or re-enabling later. When holdings exist, the app can compute **aggregated metrics** (weights, PnL, concentration, **educational notes**—no buy/sell labels) and an optional **AI narrative** (`/api/insights/portfolio-ai`) with `PortfolioAIInsights` (illustrative compounding labeled as hypothetical).

So the “achievement so far” is a **credible v1 of an India-focused AI + learning companion**: auth, billing hooks, chat with persistence, and a portfolio view that can still surface broker-sourced data if connections exist, while public copy no longer advertises live linking.

---

## Technical stack (as implemented)

| Area | Choice |
|------|--------|
| Framework | Next.js 15 (App Router) |
| Auth | NextAuth v5 with **Google**; user bootstrap via `/api/usercreate` on sign-in |
| Data | **MongoDB** + Mongoose (`User`, `Chat`, `Order`, `BrokerConnection`) |
| AI | `ai` package + `streamText`; Perplexity API as model host |
| Payments | **Razorpay** (order creation, signature verification) |
| UI | React 18, Tailwind, Radix/shadcn-style components, Recharts on portfolio |
| Broking | Kite (Zerodha) + Upstox API routes in codebase; tokens on `BrokerConnection`; **UI link flow paused** |

---

## What has been achieved (concrete)

- **Marketing / legal surface**: home, about, contact, help/FAQ, testimonial, terms, privacy, plans/billing—enough to operate as a small SaaS front.
- **Core chat loop**: stream answers, store threads in `Chat`, burn credits, surface errors for logged-out or zero-credit users.
- **Account area**: profile, chat history, manage credits, billing history, dashboard entry points in the app shell.
- **Monetization plumbing**: Razorpay order + verify flow, `Order` model, plan types (e.g. Starter/Pro) with INR amounts in the order API.
- **Broker linking model**: one document per user per broker, unique index on `(userId, broker)`; list API returns non-secret fields only.
- **Zerodha (backend)**: auth/callback, normalized holdings when a `BrokerConnection` exists; UI to create new links is off.
- **Upstox (in progress)**: env + `lib/brokers/upstox.ts` + callback; **holdings merge still stubbed** in places; same UI pause for new links.
- **Portfolio AI**: a dedicated route composes Perplexity output with computed metrics to feed `PortfolioAIInsights`—a strong direction for “explain my book” as a first-class feature.

---

## Viewpoints and trade-offs (informal)

**Strengths**

- **Clear product wedge**: India-first prompts and suggested questions align the model with a specific user and data regime.
- **Sensible separation**: `computePortfolioInsights` as pure logic over normalized holdings keeps server routes thinner and is easy to test or replace.
- **Token hygiene**: `BrokerConnection` JSON transform strips tokens from serialized output—good instinct for anything that might leak to the client.

**Risks / gaps to be aware of**

- **Regulatory and trust**: Copy and prompts were shifted toward **education-only** language; a lawyer should still **sign off** on remaining flows (esp. marketing and any model drift).
- **Upstox completeness**: Holdings paths are not fully unified; with linking UI off, impact is mostly for **existing** stored connections and dev.
- **Credit model vs. plans**: The user document ties “plan” and `current_messages`; the exact mapping from **Razorpay plan purchase → credit top-up** should stay explicit in one place so support and the DB never disagree.
- **Ops**: Perplexity and broker APIs are **external SPOFs**; retries, idempotency on payments, and clear failure states for broker token expiry will matter in production.

**Strategic read**

The product is not “just a chat wrapper”: a **portfolio** area plus optional broker data (when re-enabled) differentiates it from a plain chat. Next steps may include new **non-OAuth** input paths, **Upstox** parity if linking returns, **token refresh** docs, and counsel-approved **compliance** copy.

---

## Suggested “north star” for the next increment (optional)

1. **Portfolio input**: e.g. manual, CSV, or upload if you avoid relying on broker OAuth in the short term.  
2. **If linking returns**: enable `normalizeUpstoxHoldings` and wire it like Zerodha; document refresh flows for Kite/Upstox as APIs require.  
3. **Clarity**: keep educational / informational language distinct from personalized investment advice.

---

*Document generated from a read-through of the repository structure, key models, API routes, and core UI entry points. Update this file as the product evolves.*
