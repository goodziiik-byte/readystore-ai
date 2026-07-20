import Link from "next/link"
import { ArrowLeft, ScanLine } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SiteFooter } from "@/components/site-footer"
import { ReportHeader } from "@/components/report/report-header"
import {
  ProductSummary,
  ReadinessLayers,
  PaymentVisibility,
  CheckoutCheck,
  PriorityFixes,
} from "@/components/report/report-layers"
import {
  Understanding,
  FieldGrid,
  TopIssues,
  ScoreBreakdown,
  DiscoveredPages,
  Evidence,
} from "@/components/report/report-details"
import { ReportCta } from "@/components/report/report-cta"

export const metadata = {
  title: "Scan report · Readystore AI",
  description: "AI readiness scan report for presidential.coffee — how AI assistants read the store.",
}

export default function ReportPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-navy text-navy-foreground">
              <ScanLine className="size-4 text-lime" />
            </span>
            <span className="text-base font-semibold tracking-tight">
              Readystore<span className="text-primary"> AI</span>
            </span>
          </Link>
          <Button asChild variant="outline" size="lg">
            <Link href="/">
              <ArrowLeft className="size-4" />
              New scan
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 space-y-4 px-4 py-8 sm:px-6 sm:py-10">
        <ReportHeader />
        <ProductSummary />
        <ReadinessLayers />
        <PaymentVisibility />
        <CheckoutCheck />
        <PriorityFixes />
        <Understanding />
        <FieldGrid />
        <TopIssues />
        <ScoreBreakdown />
        <DiscoveredPages />
        <Evidence />
        <ReportCta />
      </main>

      <SiteFooter />
    </div>
  )
}
