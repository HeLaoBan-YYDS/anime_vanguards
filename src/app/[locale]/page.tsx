import type { Metadata } from "next";
import { getMessages } from "next-intl/server";
import { JsonLd, WikiSidebar } from "@/components/site";
import { getAllContent, getDynamicNavigation, type ContentItem, CONTENT_TYPES } from "@/lib/content";
import { routing, type Locale } from "@/i18n/routing";
import en from "@/locales/en.json";
import HomePageClient from "./HomePageClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://anime-vanguards-wiki.wiki";

type Messages = typeof en;

function localizedPath(locale: string, pathname: string) {
  return locale === routing.defaultLocale ? pathname : `/${locale}${pathname === "/" ? "" : pathname}`;
}

function localizedUrl(locale: string, pathname: string) {
  const path = localizedPath(locale, pathname);
  return `${siteUrl}${path === "/" ? "" : path}`;
}

function languageAlternates(pathname: string) {
  return {
    "x-default": localizedPath(routing.defaultLocale, pathname),
    ...Object.fromEntries(routing.locales.map((locale) => [locale, localizedPath(locale, pathname)])),
  };
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await getMessages({ locale })) as Messages;
  const title = messages.home.meta.title;
  const description = messages.home.meta.description;
  const image = `${siteUrl}/images/hero.webp`;
  return {
    title,
    description,
    alternates: { canonical: localizedPath(locale, "/"), languages: languageAlternates("/") },
    openGraph: { title, description, url: localizedUrl(locale, "/"), siteName: messages.site.name, images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function LocaleHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc = locale as Locale;
  const messages = (await getMessages({ locale })) as Messages;
  const navGroups = getDynamicNavigation(loc);
  const webSite = { "@context": "https://schema.org", "@type": "WebSite", name: messages.site.name, url: siteUrl, description: messages.site.description };

  // 动态加载所有 content 目录下的文章
  const allArticles: ContentItem[] = [];
  for (const contentType of CONTENT_TYPES) {
    const items = await getAllContent(contentType, loc);
    allArticles.push(...items);
  }

  // 取最近更新的 8 篇文章（按 date 倒序）
  const recentArticles = [...allArticles]
    .sort((a, b) => {
      const dateA = a.metadata.lastModified || a.metadata.date;
      const dateB = b.metadata.lastModified || b.metadata.date;
      return dateB.localeCompare(dateA);
    })
    .slice(0, 8);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <JsonLd data={webSite} />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <HomePageClient home={messages.home} locale={locale} articles={allArticles} recentArticles={recentArticles} />
        <WikiSidebar locale={locale} navGroups={navGroups} />
      </div>
    </main>
  );
}
