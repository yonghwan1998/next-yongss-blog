import type { MetadataRoute } from "next";

function getSiteUrl() {
  const configuredUrl = process.env.SITE_URL ?? process.env.VERCEL_PROJECT_PRODUCTION_URL;

  if (!configuredUrl) {
    return "http://localhost:3000";
  }

  const urlWithProtocol = configuredUrl.startsWith("http://") || configuredUrl.startsWith("https://")
    ? configuredUrl
    : `https://${configuredUrl}`;

  return urlWithProtocol.replace(/\/+$/, "");
}

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
