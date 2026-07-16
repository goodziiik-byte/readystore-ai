import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReadystorePage } from "../page";

const siteUrl = "https://www.readystoreai.com";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const copy = getDictionary(locale as Locale);
  const canonical = `/${locale}`;
  const title = `${copy.meta.title} | AI Readiness Scanner for WooCommerce`;
  const description = copy.meta.description;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: "/en",
        es: "/es",
        pt: "/pt",
        id: "/id",
        "x-default": "/",
      },
    },
    openGraph: {
      type: "website",
      url: `${siteUrl}${canonical}`,
      title,
      description,
      siteName: "Readystore AI",
      images: [
        {
          url: "/og/readystore-og.png",
          width: 1200,
          height: 630,
          alt: "Readystore AI scanner preview",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og/readystore-og.png"],
    },
  };
}

export default async function LocalizedHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <ReadystorePage locale={locale as Locale} />;
}
