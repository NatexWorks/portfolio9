import type { MetadataRoute } from "next";

const routes = [
  "/", "/services", "/work", "/work/inventory-management",
  "/work/local-discovery", "/work/cafe-presence", "/about", "/contact", "/start-project",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  if (!configuredUrl) return [];
  const origin = new URL(configuredUrl).origin;
  return routes.map((route) => ({
    url: new URL(route, origin).toString(),
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route.startsWith("/work/") ? 0.7 : 0.8,
  }));
}
