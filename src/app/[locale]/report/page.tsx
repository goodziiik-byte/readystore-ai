import { Suspense } from "react"
import { ReportPageClient } from "@/components/report/report-page-client"
import { isLocale, type Locale } from "@/lib/i18n"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Scan report · Readystore AI",
  description: "AI readiness scan report for WooCommerce stores.",
}

export default async function LocalizedReportPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  if (!isLocale(locale)) {
    notFound()
  }

  return (
    <Suspense>
      <ReportPageClient locale={locale as Locale} />
    </Suspense>
  )
}
