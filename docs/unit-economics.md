# Unit economics (illustrative — replace with your invoices)

All figures use **INR** with **USD/INR = 87** (update when you reconcile). Payment take-rate **2.5%** on gross (Razorpay + network + GST on fee). Pack defaults: **Starter ₹199 / 40 credits**, **Pro ₹799 / 250 credits**. (Display-only “list” prices for promos: **₹299** Starter, **₹999** Pro — not charged; see `PACK_*_LIST_INR` in `constants/credits.ts`.)

## 1) Net revenue per credit (after payment fees only)

| Pack    | Gross | Net (×0.975) | Credits | **Net ₹ / credit** |
|---------|------:|-------------:|--------:|-------------------:|
| Pro     | 799   | 778.3        | 250     | **3.11**          |
| Starter | 199   | 194.0        | 40      | **4.85**          |

**Break-even (variable API only):** your **fully loaded API cost per credit sold** should stay **below** these net-per-credit numbers for that pack to have **positive variable margin**.

**Why Starter 40 and Pro 250:** Starter has **higher** net ₹/credit (~**4.85**) so Pro (~**3.11**) is clearly the volume deal (≈**1.6×** lower cost per credit). At gross level, **₹199/40 ≈ ₹4.98/credit** — close to the old **₹99/20** profile so you raise cash without slashing per-credit economics on the entry pack.

---

## 2) API cost model (Perplexity + OpenAI) — source-linked

**Perplexity Sonar** (see [Perplexity pricing](https://docs.perplexity.ai/pricing)):

- Token: **$1 / 1M input** + **$1 / 1M output**
- **Request fee** (low / medium / high search context): **$5 / $8 / $12 per 1,000 requests**  
  i.e. **$0.005 / $0.008 / $0.012 per chat-class call** before tokens.

**Worked examples (from Perplexity docs, Sonar, rounded):**

- Low context, ~500+200 tokens: **~$0.0057** per call
- High context, same tokens: **~$0.0127** per call

**OpenAI gpt-4o-mini** (text/vision, order of): **$0.15/1M input, $0.60/1M output** (check [OpenAI pricing](https://openai.com/api/pricing/) for your month).

**₹ per US dollar = 87** in this document.

### 2a) One chat (1 credit)

| Scenario        | $ / chat (approx) | ₹ / credit |
|-----------------|------------------:|----------:|
| Base (low ctx)  | 0.006            | **0.52**  |
| High context    | 0.013            | **1.13**  |
| **Stress** (long: 8k in + 2k out, high ctx) | 0.012 + 0.01 tok ≈ 0.022 | **1.91**  |

**vs Pro net ₹3.11/credit:** keep average API cost per Pro credit **below ~3.1** for that pack to stay variable-positive.

### 2b) Portfolio AI run (2 credits) — 2–3 Sonar calls + long JSON

| Scenario        | $ total (rough) | ₹ total | **₹ / credit** (÷2) |
|-----------------|----------------:|--------:|-------------------:|
| 2× low-context calls + tokens | 0.014 | 1.22 | **0.61** |
| 2× high-context calls + heavier tokens | 0.040 | 3.48 | **1.74** |
| **Stress** (3× high) | 0.045 | 3.92 | **1.96** |

**vs Pro net ₹3.11/credit:** still **positive** in stress row when API ₹/credit for that 2-credit action stays below **3.1** on average (per your mix).

### 2c) Screenshot (1 credit / image), gpt-4o-mini vision

Heavily image-dependent; order **~$0.001–$0.01** per image in many cases → **₹0.09–0.87** / credit. Worst case you model **₹1.00** / image-credit for safety.

---

## 3) Fixed + overhead (concrete default budget)

| Line item        | Assumption in this model        | **₹ / month** |
|------------------|----------------------------------|-------------:|
| Vercel Pro       | ~$20 seat                        | **1,740**   |
| MongoDB Atlas    | small paid tier (not M0) ~$40   | **3,480**   |
| Domain + email + misc | round figure                | **800**     |
| **Total fixed**  |                                  | **6,020**   |

(Use **₹0** for Atlas M0 if you stay free; use **$0** Vercel hobby only if you accept limits — then recalc break-even.)

**Razorpay** is **not** in the table above: treat **~2.5% of GMV** as already removed in “net per credit” or add as separate line on real P&L.

---

## 4) Blended “are we profitable?” (single set of numbers)

**Definitions:**

- **G** = gross sales in a month (Starter + Pro), INR  
- **V** = variable API (Perplexity + OpenAI) + other purely usage-based pass-throughs, INR  
- **F** = **6,020** INR fixed (from §3)  
- **Net revenue** after Razorpay ≈ **0.975 × G**

**Pretax cash contribution (simplified):**

\[
\Pi \approx 0.975G - V - F
\]

**Example month:** G = **₹50,000** (e.g. ~50 Pro + ~15 Starter), assume **V = 0.20 × 0.975G** (20% of net to APIs — conservative if usage is light):

- Net after Razorpay ≈ 48,750  
- V ≈ 9,750  
- **Π** ≈ 48,750 − 9,750 − 6,020 ≈ **₹32,980** (before your time, tax, ad spend)

**Break-even gross G** (if V = 15% of net and F = 6,020):

- Need 0.975G × (1 − 0.15) > 6,020 → G > 6,020 / (0.975×0.85) ≈ **₹7,260 / month** gross GMV to cover this fixed + 15% variable.

If **V = 30%** of net: G > 6,020 / (0.975×0.70) ≈ **₹8,820 / month**.

---

## 5) Worse-case API (sanity check on Pro)

If **every** Pro credit corresponded to a **high-context** Sonar call at **$0.0127** + negligible tokens:

- API cost = 0.0127 × 250 × 87 = **₹276** for a user who used **all 250** Pro credits on such chats, vs net **₹778** → you still have **~₹502** before other variable costs (vision, etc.) on that one pack.

If something misconfigured so each “chat” fired **3×** high-context ($0.038/credit):

- 250 × 0.038 × 87 = **₹826** > **₹778** → **variable loss** on that pack. That’s the scenario where you must **raise price, cut credits, or cap context**.

---

## 6) Action: should you “increase cost per credit”?

- If **measured** `UsageEvent` + bills show **avg API / credit > ~₹2.4** on Pro mix (watch vs **~₹3.1** net) → **increase** `PACK_PRO_INR` or reduce `PACK_PRO_CREDITS`, or raise `CREDIT_COST_*` for heavy features.  
- If avg **&lt; ₹1.0** / credit on Pro → current list prices are **likely fine** on variable margin; grow revenue to beat **~₹7–9k** GMV/month to clear example fixeds.

**This file is not tax or accounting advice; plug your real Atlas/Vercel bills and PPLX/OpenAI CSVs.**
