import type { Metadata } from "next";
import { getMessages } from "next-intl/server";
import { LegalPage } from "@/components/legal-page";
import { routing } from "@/i18n/routing";
import en from "@/locales/en.json";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://anime-vanguards-wiki.wiki";
type Messages = typeof en;

function localizedPath(locale: string, pathname: string) {
  return `/${locale}${pathname}`;
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
  const title = `${messages.legal.privacyPolicy.title} - ${messages.site.name}`;
  const description = messages.legal.privacyPolicy.description;
  const pathname = "/privacy-policy";
  return {
    title,
    description,
    alternates: { canonical: localizedPath(locale, pathname), languages: languageAlternates(pathname) },
    openGraph: { title, description, url: `${siteUrl}${localizedPath(locale, pathname)}`, siteName: messages.site.name },
    twitter: { card: "summary", title, description },
  };
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = (await getMessages({ locale })) as Messages;
  const { title, content } = messages.legal.privacyPolicy;

  return (
    <LegalPage title={title}>
      {content.map((paragraph, idx) => (
        <p key={idx}>{paragraph}</p>
      ))}
    </LegalPage>
  );
}
