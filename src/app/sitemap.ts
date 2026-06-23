import type { MetadataRoute } from "next";
import { getAllContentPaths } from "@/lib/content";
import { CONTENT_TYPES } from "@/config/navigation";
import { routing } from "@/i18n/routing";

function localizedPath(locale: string, pathname: string) {
  return locale === routing.defaultLocale ? pathname : `/${locale}${pathname === "/" ? "" : pathname}`;
}

function absoluteUrl(siteUrl: string, locale: string, pathname: string) {
  const path = localizedPath(locale, pathname);
  return `${siteUrl}${path === "/" ? "" : path}`;
}

function languageAlternates(siteUrl: string, pathname: string) {
  return {
    "x-default": absoluteUrl(siteUrl, routing.defaultLocale, pathname),
    ...Object.fromEntries(routing.locales.map((locale) => [locale, absoluteUrl(siteUrl, locale, pathname)])),
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://anime-vanguards-wiki.wiki";

  // Static paths that always exist
  const staticPaths = ["/", ...CONTENT_TYPES.map((contentType) => `/${contentType}`), "/privacy-policy", "/terms-of-service", "/copyright", "/about"];

  // Dynamic paths: scan actual MDX content files
  const contentPaths = await getAllContentPaths("en");
  const dynamicPaths = contentPaths.map((item) => `/${[item.contentType, ...item.slug].join("/")}`);

  const paths = [...staticPaths, ...dynamicPaths];
  const contentTypePaths = new Set(CONTENT_TYPES.map((contentType) => `/${contentType}`));

  return routing.locales.flatMap((locale) =>
    paths.map((path) => ({
      url: absoluteUrl(siteUrl, locale, path),
      lastModified: new Date(),
      changeFrequency: path === "/" ? ("daily" as const) : ("weekly" as const),
      priority: path === "/" ? 1 : contentTypePaths.has(path) ? 0.8 : 0.6,
      alternates: { languages: languageAlternates(siteUrl, path) },
    })),
  );
}
