import type { MetadataRoute } from "next";

import { labEntries, researchArticles } from "@/data/content";
import { projectEntries } from "@/data/projects";

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

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const toAbsoluteUrl = (path: string) => new URL(path, `${siteUrl}/`).toString();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: toAbsoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: toAbsoluteUrl("/about"), changeFrequency: "monthly", priority: 0.7 },
    { url: toAbsoluteUrl("/projects"), changeFrequency: "weekly", priority: 0.8 },
    { url: toAbsoluteUrl("/research"), changeFrequency: "weekly", priority: 0.8 },
    { url: toAbsoluteUrl("/labs"), changeFrequency: "weekly", priority: 0.8 },
  ];

  const researchRoutes: MetadataRoute.Sitemap = researchArticles.map((article) => ({
    url: toAbsoluteUrl(article.href),
    lastModified: article.date.replaceAll(".", "-"),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const labRoutes: MetadataRoute.Sitemap = labEntries.map((lab) => ({
    url: toAbsoluteUrl(lab.href),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const projectPaths = new Set(
    projectEntries.flatMap((project) => (
      project.links
        ?.filter((link) => !link.external && link.href.startsWith("/projects/"))
        .map((link) => link.href) ?? []
    )),
  );
  const projectRoutes: MetadataRoute.Sitemap = Array.from(projectPaths, (path) => ({
    url: toAbsoluteUrl(path),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...researchRoutes, ...labRoutes, ...projectRoutes];
}
