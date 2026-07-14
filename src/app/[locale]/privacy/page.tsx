import { defaultLocale, getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { privacyCopy } from "@/lib/legal-copy";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocalizedPrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const copy = getDictionary(locale as Locale);
  const legal = privacyCopy[locale as Locale];
  const home = locale === defaultLocale ? "/" : `/${locale}`;

  return (
    <main className="legal-page">
      <section className="legal-card">
        <Link href={home}>{legal.back}</Link>
        <h1>{copy.footer.privacy}</h1>
        <p>{legal.updated}</p>

        {legal.sections.map((section) => (
          <div key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </div>
        ))}

        <h2>Contact</h2>
        <p>
          {legal.contactLabel} <a href="mailto:hello@readystoreai.com">hello@readystoreai.com</a>
        </p>
      </section>
    </main>
  );
}
