import { Suspense } from "react"
import { ReportPageClient } from "@/components/report/report-page-client"
import { defaultLocale } from "@/lib/i18n"

export const metadata = {
  title: "Scan report · Readystore AI",
  description: "AI readiness scan report for WooCommerce stores.",
}

export default function ReportPage() {
  return (
    <Suspense>
      <ReportPageClient locale={defaultLocale} />
    </Suspense>
  )
}
