import axios from "axios";

export function getUpstoxAuthUrl(state?: string): string {
  const clientId = process.env.UPSTOX_CLIENT_ID;
  const redirectUri = process.env.UPSTOX_REDIRECT_URI;
  const scopes = process.env.UPSTOX_SCOPES; // optional; some dashboards don't expose scopes
  if (!clientId || !redirectUri) throw new Error("Upstox env vars missing");

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
  });
  if (scopes && scopes.trim().length > 0) params.set("scope", scopes);
  if (state) params.set("state", state);
  return `https://api-v2.upstox.com/login/authorization/dialog?${params.toString()}`;
}

export async function exchangeUpstoxCode(code: string) {
  const clientId = process.env.UPSTOX_CLIENT_ID;
  const clientSecret = process.env.UPSTOX_CLIENT_SECRET;
  const redirectUri = process.env.UPSTOX_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri)
    throw new Error("Upstox env vars missing");

  const resp = await axios.post(
    "https://api-v2.upstox.com/login/authorization/token",
    new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }).toString(),
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );
  return resp.data;
}

export async function fetchUpstoxHoldings(accessToken: string) {
  const resp = await axios.get("https://api-v2.upstox.com/portfolio/holdings", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return resp.data?.data || [];
}
