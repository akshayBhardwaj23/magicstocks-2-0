This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Broker Integrations (India)

**Note:** OAuth “link broker” buttons are currently **turned off** in the app UI, but server routes and env-based integration may still be used for development or when you re-enable the flow.

To enable Zerodha and Upstox **API** integration (e.g. for dev or a future UI), add these to your `.env.local`:

# Zerodha

ZERODHA_API_KEY=your_kite_api_key
ZERODHA_API_SECRET=your_kite_api_secret

# Upstox

UPSTOX_CLIENT_ID=your_upstox_client_id
UPSTOX_CLIENT_SECRET=your_upstox_client_secret
UPSTOX_REDIRECT_URI=https://your-domain.com/api/brokers/upstox/callback

# Optional scopes (only if your Upstox console shows them)

# UPSTOX_SCOPES="read accounts read portfoliouser profile"

Also set NEXTAUTH_URL to your domain so callbacks can redirect back:
NEXTAUTH_URL=http://localhost:3001
