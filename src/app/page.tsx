import { AiShopper } from "@/components/ai-shopper"
import { AnalyticsTracker } from "@/components/analytics-tracker"
import { BeforeAfter } from "@/components/before-after"
import { CtaSection } from "@/components/cta-section"
import { Hero } from "@/components/hero"
import { PaymentContext } from "@/components/payment-context"
import { ProblemSection } from "@/components/problem-section"
import { ScanProvider } from "@/components/scan-context"
import { ScanScope } from "@/components/scan-scope"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { defaultLocale, type Locale } from "@/lib/i18n"
import { Suspense } from "react"

export default function HomePage() {
  return <ReadystorePage locale={defaultLocale} />
}

export function ReadystorePage({ locale }: { locale: Locale }) {
  return (
    <ScanProvider locale={locale}>
      <Suspense fallback={null}>
        <AnalyticsTracker locale={locale} event="landing_view" />
      </Suspense>
      <SiteHeader />
      <main>
        <Hero />
        <ProblemSection />
        <AiShopper />
        <ScanScope />
        <PaymentContext />
        <BeforeAfter />
        <CtaSection />
      </main>
      <SiteFooter locale={locale} />
    </ScanProvider>
  )
}
