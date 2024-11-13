/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.AUTH_TRUST_HOST, // Your site's base URL
  generateRobotsTxt: true, // // Generate a robots.txt file
  exclude: [
    "/profile",
    "/manage-credits",
    "/chat-history",
    "/billing-history",
    "/dashboard",
  ], // Paths to exclude from the sitemap
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/profile",
          "/manage-credits",
          "/chat-history",
          "/billing-history",
          "/dashboard",
        ],
      },
    ],
    // additionalSitemaps: [
    //   "https://magicstocks.ai/sitemap.xml", // Your sitemap URL (you can add more if needed)
    // ],
  },
  // ...other options
};
