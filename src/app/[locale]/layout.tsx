import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { JsonLd, SiteFooter, SiteHeader } from "@/components/site";
import { routing } from "@/i18n/routing";
import en from "@/locales/en.json";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://anime-vanguards-wiki.wiki";

type Messages = typeof en;

function localizedRootUrl(locale: string) {
  return `${siteUrl}/${locale}`;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await getMessages({ locale })) as Messages;
  const siteName = messages.site.name;
  const siteDescription = messages.site.description;
  const image = `${siteUrl}/images/hero.webp`;
  const url = localizedRootUrl(locale);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: messages.home.meta.title, template: "%s" },
    description: siteDescription,
    openGraph: { type: "website", locale, url, siteName, title: siteName, description: siteDescription, images: [{ url: image, width: 1280, height: 720, alt: siteName }] },
    twitter: { card: "summary_large_image", title: siteName, description: siteDescription, images: [image] },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const messages = (await getMessages()) as Messages;
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": messages.site.name,
    "url": siteUrl,
    "logo": `${siteUrl}/android-chrome-512x512.png`,
    "image": `${siteUrl}/images/hero.webp`,
  };

  return (
    <html lang={locale} className={`${inter.variable}`} suppressHydrationWarning>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-GBF02C3ST1" />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-GBF02C3ST1');
        `}
      </Script>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <NextIntlClientProvider messages={messages}>
            <JsonLd data={organization} />
            <SiteHeader locale={locale} />
            {children}
            <SiteFooter locale={locale} />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
