import Link from "next/link"
import { Button } from "@/components/ui/button"
import { report } from "@/lib/report-data"
import type { ReportModel } from "@/lib/report-model"
import { SectionCard, StatusBadge, SectionHeading } from "@/components/report/ui"
import { ArrowRight, FileText, Globe } from "lucide-react"

function ScoreGauge({ value, max }: { value: number; max: number }) {
  const pct = value / max
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const dash = circumference * pct
  const tone = pct >= 0.75 ? "text-success" : pct >= 0.45 ? "text-warning" : "text-destructive"

  return (
    <div className="relative flex size-32 shrink-0 items-center justify-center">
      <svg className="size-32 -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r={radius} fill="none" strokeWidth="10" className="stroke-muted" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          className={`${tone} stroke-current transition-all`}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-3xl font-semibold ${tone}`}>{value}</span>
        <span className="text-xs text-muted-foreground">/ {max}</span>
      </div>
    </div>
  )
}

export function ReportHeader({ report: data = report, isSample = true }: { report?: ReportModel; isSample?: boolean }) {
  return (
    <div className="space-y-4">
      <SectionCard>
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <ScoreGauge value={data.score.value} max={data.score.max} />
          <div className="min-w-0">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Scan report
            </span>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              {data.score.label}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
              {data.score.summary}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-5">
          {data.highlights.map((h) => (
            <span
              key={h.label}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-sm"
            >
              <span className="text-muted-foreground">{h.label}</span>
              <StatusBadge state={h.state} label={h.value} />
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Globe className="size-3.5" />
          <span className="font-mono">{data.store.fullUrl}</span>
          <span aria-hidden>·</span>
          <span>{data.store.platform}</span>
          <span aria-hidden>·</span>
          <span>Scanned {data.store.scannedAt}</span>
        </div>
      </SectionCard>

      {isSample ? <PdfCapture /> : null}
    </div>
  )
}

function PdfCapture() {
  return (
    <section className="rounded-2xl border-2 border-lime bg-lime/15 p-5 shadow-sm sm:p-6">
      <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
        <FileText className="size-5 text-primary" />
        This is a sample report
      </h2>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
        Scan a live WooCommerce store to email yourself a real PDF report with detected issues,
        prioritized fixes, and early access confirmation.
      </p>
      <Button asChild size="lg" className="mt-4 h-11">
        <Link href="/#scan">
          Run a live scan
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </section>
  )
}
