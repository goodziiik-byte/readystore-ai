import { isLocale, locales, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { ReadystorePage } from "../page";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocalizedHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <ReadystorePage locale={locale as Locale} />;
}
