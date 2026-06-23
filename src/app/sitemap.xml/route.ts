import { CONTENT_TYPES } from "@/config/navigation";
import { routing } from "@/i18n/routing";
import { getAllContentPaths } from "@/lib/content";

function localizedPath(locale: string, pathname: string) {
  return `/${locale}${pathname === "/" ? "" : pathname}`;
}

function absoluteUrl(siteUrl: string, locale: string, pathname: string) {
  const path = localizedPath(locale, pathname);
  return `${siteUrl}${path === "/" ? "" : path}`;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function languageAlternateLinks(siteUrl: string, pathname: string) {
  const links = [
    ["x-default", absoluteUrl(siteUrl, routing.defaultLocale, pathname)] as const,
    ...routing.locales.map((locale) => [locale, absoluteUrl(siteUrl, locale, pathname)] as const),
  ];

  return links
    .map(([hreflang, href]) => `    <xhtml:link rel="alternate" hreflang="${escapeXml(hreflang)}" href="${escapeXml(href)}" />`)
    .join("\n");
}

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://anime-vanguards-wiki.wiki";
  const lastModified = new Date().toISOString();
  const staticPaths = ["/", ...CONTENT_TYPES.map((contentType) => `/${contentType}`), "/privacy-policy", "/terms-of-service", "/copyright", "/about"];

  const contentPaths = await getAllContentPaths("en");
  const dynamicPaths = contentPaths.map((item) => `/${[item.contentType, ...item.slug].join("/")}`);
  const paths = [...staticPaths, ...dynamicPaths];
  const contentTypePaths = new Set(CONTENT_TYPES.map((contentType) => `/${contentType}`));

  const urls = routing.locales.flatMap((locale) =>
    paths.map((path) => {
      const priority = path === "/" ? "1.0" : contentTypePaths.has(path) ? "0.8" : "0.6";
      const changeFrequency = path === "/" ? "daily" : "weekly";

      return [
        "  <url>",
        `    <loc>${escapeXml(absoluteUrl(siteUrl, locale, path))}</loc>`,
        `    <lastmod>${lastModified}</lastmod>`,
        `    <changefreq>${changeFrequency}</changefreq>`,
        `    <priority>${priority}</priority>`,
        languageAlternateLinks(siteUrl, path),
        "  </url>",
      ].join("\n");
    }),
  );

  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");

  return new Response(sitemap, {
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
