"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useScan, type ScanCheck, type UiScanReport } from "@/components/scan-context"
import { getDictionary, localeMarkets, type Locale } from "@/lib/i18n"
import { report as sampleReport, type LayerState } from "@/lib/report-data"
import {
  displayImpact,
  displayPluginFix,
  displayStatus,
  localizeScanResult,
  scoreBreakdownLabel,
} from "@/lib/report-localization"
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileText,
  Loader2,
  MinusCircle,
  RotateCcw,
  XCircle,
} from "lucide-react"

export function ScanReport() {
  const { status, report, error, reset, locale } = useScan()
  const copy = getDictionary(locale)

  return (
    <section id="scan" className="scroll-mt-20 bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {copy.report.scanReport}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {copy.report.seesTitle}
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
            <span className="size-2.5 rounded-full bg-destructive/40" />
            <span className="size-2.5 rounded-full bg-warning/50" />
            <span className="size-2.5 rounded-full bg-success/50" />
            <span className="ml-2 font-mono text-xs text-muted-foreground">
              readystore-ai / scan
            </span>
          </div>

          <div className="p-5 sm:p-6">
            {status === "idle" && <IdleState />}
            {status === "scanning" && <ScanningState locale={locale} />}
            {status === "error" && <ErrorState message={error} onRetry={reset} />}
            {status === "done" && report && <DoneState report={report} onReset={reset} />}
          </div>
        </div>
      </div>
    </section>
  )
}

const LAYER_STYLE: Record<LayerState, { text: string; badge: string; label: string; dot: string }> = {
  pass: { text: "text-success", badge: "bg-success/10 text-success", label: "Ready", dot: "bg-success" },
  partial: { text: "text-warning", badge: "bg-warning/10 text-warning", label: "Partial", dot: "bg-warning" },
  fail: { text: "text-destructive", badge: "bg-destructive/10 text-destructive", label: "Missing", dot: "bg-destructive" },
}

function IdleState() {
  const { score, store, highlights, layers } = sampleReport
  const pct = (score.value / score.max) * 100
  const { locale } = useScan()
  const copy = getDictionary(locale)

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
          {copy.report.summary.confirmed}
        </span>
        <span className="font-mono text-xs text-muted-foreground">{store.url}</span>
      </div>

      {/* Score + summary */}
      <div className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="relative flex size-20 shrink-0 items-center justify-center">
            <svg viewBox="0 0 36 36" className="size-20 -rotate-90">
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-muted" strokeWidth="3" />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className="stroke-primary"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${(pct / 100) * 100.53} 100.53`}
              />
            </svg>
            <div className="absolute flex flex-col items-center leading-none">
              <span className="text-xl font-semibold">{score.value}</span>
              <span className="text-[10px] text-muted-foreground">/ {score.max}</span>
            </div>
          </div>
          <div>
            <p className="text-base font-semibold">{score.label}</p>
            <p className="text-xs text-muted-foreground">
              {store.platform} · {store.pagesAnalyzed} {copy.report.pagesScanned}
            </p>
          </div>
        </div>
      </div>

      {/* Highlights */}
      <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {highlights.map((h) => {
          const s = LAYER_STYLE[h.state]
          return (
            <li
              key={h.label}
              className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-background px-3 py-2.5"
            >
              <span className="flex items-center gap-2 text-sm">
                <span className={`size-2 rounded-full ${s.dot}`} />
                {h.label}
              </span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${s.badge}`}>{h.value}</span>
            </li>
          )
        })}
      </ul>

      {/* Readiness layers snapshot */}
      <p className="mt-6 text-sm font-medium">{copy.report.readinessLayers}</p>
      <ul className="mt-2 space-y-2">
        {layers.map((layer) => {
          const s = LAYER_STYLE[layer.state]
          return (
            <li
              key={layer.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-background px-3 py-2.5"
            >
              <span className="flex items-center gap-2.5 text-sm">
                <span className={`size-2 rounded-full ${s.dot}`} />
                {layer.title}
              </span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${s.badge}`}>{s.label}</span>
            </li>
          )
        })}
      </ul>

      <div className="mt-6 flex flex-col items-center gap-3 rounded-xl border border-primary/25 bg-accent/40 p-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-sm text-muted-foreground">
          {copy.report.capture.body}
        </p>
        <Button asChild size="lg" variant="outline" className="shrink-0 bg-transparent">
          <Link href="/report">
            {copy.report.scanReport}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

function ScanningState({ locale }: { locale: Locale }) {
  const copy = getDictionary(locale)
  const steps = copy.marketing.diagnosis.cards.map((card) => `${card.title}: ${card.text}`)
  return (
    <div className="py-6">
      <div className="flex items-center gap-2 text-sm font-medium text-primary">
        <Loader2 className="size-4 animate-spin" />
        {copy.hero.scanning}...
      </div>
      <ul className="mt-5 space-y-3 font-mono text-sm">
        {steps.map((step, i) => (
          <li
            key={step}
            className="flex items-center gap-2 text-muted-foreground"
            style={{ animation: `pulse 1.6s ease-in-out ${i * 0.2}s infinite` }}
          >
            <span className="size-1.5 rounded-full bg-primary" />
            {step}
          </li>
        ))}
      </ul>
      <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full w-1/3 animate-pulse rounded-full bg-primary" />
      </div>
    </div>
  )
}

function ErrorState({ message, onRetry }: { message: string | null; onRetry: () => void }) {
  const { locale } = useScan()
  const copy = getDictionary(locale)

  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="size-5" />
      </span>
      <p className="text-sm font-medium">{copy.report.capture.fallbackError}</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        {message ?? copy.report.capture.fallbackError}
      </p>
      <Button variant="outline" size="lg" onClick={onRetry} className="mt-1">
        <RotateCcw className="size-4" />
        {copy.hero.scanButton}
      </Button>
    </div>
  )
}

const STATE_STYLE: Record<
  ScanCheck["state"],
  { icon: typeof CheckCircle2; text: string; badge: string; label: string }
> = {
  pass: {
    icon: CheckCircle2,
    text: "text-success",
    badge: "bg-success/10 text-success",
    label: "Ready",
  },
  partial: {
    icon: MinusCircle,
    text: "text-warning",
    badge: "bg-warning/10 text-warning",
    label: "Partial",
  },
  fail: {
    icon: XCircle,
    text: "text-destructive",
    badge: "bg-destructive/10 text-destructive",
    label: "Missing",
  },
}

function DoneState({
  report,
  onReset,
}: {
  report: UiScanReport
  onReset: () => void
}) {
  const scoreColor =
    report.score >= 75 ? "text-success" : report.score >= 45 ? "text-warning" : "text-destructive"
  const { locale } = useScan()
  const copy = getDictionary(locale)
  const localized = localizeScanResult(report.raw, locale)
  const stateLabels: Record<ScanCheck["state"], string> = {
    pass: copy.report.checkoutLabels.ready,
    partial: copy.report.checkoutLabels.partial,
    fail: copy.report.checkoutLabels.blocked,
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <p className="font-mono text-xs text-muted-foreground">{report.url}</p>
          <p className="mt-1 text-sm font-medium">{copy.report.seesTitle}</p>
        </div>
        <div className={`text-4xl font-semibold ${scoreColor}`}>
          {report.score}
          <span className="text-lg text-muted-foreground">/100</span>
        </div>
      </div>

      <ul className="mt-5 space-y-2">
        {report.checks.map((check) => {
          const s = STATE_STYLE[check.state]
          const Icon = s.icon
          return (
            <li
              key={check.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-background px-3 py-2.5"
            >
              <span className="flex items-center gap-2.5 text-sm">
                <Icon className={`size-4 ${s.text}`} />
                {check.label}
              </span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${s.badge}`}>
                {stateLabels[check.state]}
              </span>
            </li>
          )
        })}
      </ul>

      <LiveReportDetails result={localized} locale={locale} />

      <ReportEmailForm report={report} />

      <button
        onClick={onReset}
        className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <RotateCcw className="size-3.5" />
        {copy.hero.scanButton}
      </button>
    </div>
  )
}

function LiveReportDetails({ result, locale }: { result: UiScanReport["raw"]; locale: Locale }) {
  const copy = getDictionary(locale)
  const product = result.productSummary

  return (
    <div className="mt-6 space-y-4">
      <section className="rounded-xl border border-border bg-background p-4">
        <h3 className="text-sm font-semibold">{copy.report.readinessLayers}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{result.merchantSummary.body}</p>
        <div className="mt-4 space-y-2">
          {result.readinessLayers.map((layer) => (
            <div key={layer.id} className="rounded-lg border border-border/70 bg-card p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold">{layer.title}</p>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${layer.status === "strong" ? "bg-success/10 text-success" : layer.status === "partial" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>
                  {displayStatus(layer.status, locale)}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{layer.whyItMatters}</p>
              <div className="mt-2 grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
                <span>{copy.report.impact}: {displayImpact(layer.impact, locale)}</span>
                <span>{copy.report.pluginFix}: {displayPluginFix(layer.pluginCanFix, locale)}</span>
                <span>{copy.report.estLift}: {layer.estimatedLift}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-background p-4">
          <h3 className="text-sm font-semibold">{copy.report.productSummary}</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>{product.scanned} {copy.report.inspected}</li>
            <li>{product.withPrice}/{product.scanned} {copy.report.ratios[0]}</li>
            <li>{product.withAvailability}/{product.scanned} {copy.report.ratios[1]}</li>
            <li>{product.withProductSchema}/{product.scanned} {copy.report.ratios[2]}</li>
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-background p-4">
          <h3 className="text-sm font-semibold">{copy.report.checkoutReadiness}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{result.checkoutReadiness.summary}</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {result.checkoutReadiness.checks.map((check) => (
              <li key={check.id}>{check.label}: {copy.report.checkoutLabels[check.status]}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-success/25 bg-success/5 p-4">
          <h3 className="text-sm font-semibold">{copy.report.aiCan}</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {result.aiCanUnderstand.slice(0, 5).map((item) => <li key={item}>- {item}</li>)}
          </ul>
        </div>
        <div className="rounded-xl border border-warning/30 bg-warning/5 p-4">
          <h3 className="text-sm font-semibold">{copy.report.aiMiss}</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {result.aiMayMiss.slice(0, 5).map((item) => <li key={item}>- {item}</li>)}
          </ul>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-background p-4">
        <h3 className="text-sm font-semibold">{copy.report.scoreBreakdown}</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {Object.entries(result.scoreBreakdown).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2 text-sm">
              <span className="text-muted-foreground">{scoreBreakdownLabel(key, locale)}</span>
              <span className="font-medium">{value}/10</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function ReportEmailForm({ report }: { report: UiScanReport }) {
  const { locale } = useScan()
  const copy = getDictionary(locale)
  const [email, setEmail] = useState("")
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [message, setMessage] = useState("")

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return

    setState("sending")
    setMessage("")

    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          result: report.raw,
          locale,
          market: localeMarkets[locale],
          source: `scanner_report_${locale}`,
        }),
      })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload?.error?.message ?? copy.report.capture.fallbackError)
      }

      setState("sent")
      setMessage(`${copy.report.capture.sent} ${email}`)
    } catch (error) {
      setState("error")
      setMessage(error instanceof Error ? error.message : copy.report.capture.fallbackError)
    }
  }

  return (
    <div className="mt-6 rounded-xl border border-primary/25 bg-accent/40 p-4">
      {state === "sent" ? (
        <div className="flex items-center gap-2.5 text-sm">
          <CheckCircle2 className="size-4 text-success" />
          <span>{message}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <p className="flex items-center gap-2 text-sm font-medium">
            <FileText className="size-4 text-primary" />
            {copy.report.capture.eyebrow}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {copy.report.capture.body}
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <label htmlFor="report-email" className="sr-only">
              {copy.report.capture.label}
            </label>
            <input
              id="report-email"
              type="email"
              required
              placeholder={copy.report.capture.placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-3 focus:ring-ring/30"
            />
            <Button type="submit" size="lg" className="h-10" disabled={state === "sending"}>
              {state === "sending" ? `${copy.report.capture.sending}...` : copy.report.capture.button}
            </Button>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {copy.report.capture.disclaimer}
          </p>
          {state === "error" && message ? (
            <p className="mt-2 text-xs font-medium text-destructive">{message}</p>
          ) : null}
        </form>
      )}
    </div>
  )
}
