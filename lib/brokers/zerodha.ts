import axios from "axios";
import crypto from "crypto";

export function getZerodhaAuthUrl(): string {
  const apiKey = process.env.ZERODHA_API_KEY;
  if (!apiKey) throw new Error("ZERODHA_API_KEY not set");
  return `https://kite.trade/connect/login?api_key=${apiKey}`;
}

export async function exchangeZerodhaRequestToken(requestToken: string) {
  const apiKey = process.env.ZERODHA_API_KEY;
  const apiSecret = process.env.ZERODHA_API_SECRET;
  if (!apiKey || !apiSecret) throw new Error("Zerodha env vars missing");

  const checksum = crypto
    .createHash("sha256")
    .update(apiKey + requestToken + apiSecret)
    .digest("hex");

  const resp = await axios.post(
    "https://api.kite.trade/session/token",
    new URLSearchParams({
      api_key: apiKey,
      request_token: requestToken,
      checksum,
    }).toString(),
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );

  return resp.data?.data;
}

export async function fetchZerodhaHoldings(
  accessToken: string,
  apiKey?: string
) {
  const key = apiKey || process.env.ZERODHA_API_KEY;
  if (!key) throw new Error("ZERODHA_API_KEY not set");

  const resp = await axios.get("https://api.kite.trade/portfolio/holdings", {
    headers: {
      Authorization: `token ${key}:${accessToken}`,
      "X-Kite-Version": "3",
    },
  });
  return resp.data?.data || [];
}
