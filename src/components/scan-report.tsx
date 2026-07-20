"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useScan, type ScanCheck, type UiScanReport } from "@/components/scan-context"
import { localeMarkets } from "@/lib/i18n"
import { report as sampleReport, type LayerState } from "@/lib/report-data"
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
  const { status, report, error, reset } = useScan()

  return (
    <section id="scan" className="scroll-mt-20 bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Your AI readiness report
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            A live preview of how AI assistants read your store.
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
            {status === "scanning" && <ScanningState />}
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

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
          Example report
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
              {store.platform} · {store.pagesAnalyzed} pages analyzed
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
      <p className="mt-6 text-sm font-medium">Readiness layers</p>
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
          This is a sample. Scan your store above to generate your own — or explore the full report.
        </p>
        <Button asChild size="lg" variant="outline" className="shrink-0 bg-transparent">
          <Link href="/report">
            View full example report
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

function ScanningState() {
  const steps = [
    "Fetching public pages",
    "Reading product & price data",
    "Checking policies & payments",
    "Tracing checkout path",
  ]
  return (
    <div className="py-6">
      <div className="flex items-center gap-2 text-sm font-medium text-primary">
        <Loader2 className="size-4 animate-spin" />
        Scanning your store…
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
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="size-5" />
      </span>
      <p className="text-sm font-medium">We couldn&apos;t scan that URL</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        {message ?? "Something went wrong. Please try again."}
      </p>
      <Button variant="outline" size="lg" onClick={onRetry} className="mt-1">
        <RotateCcw className="size-4" />
        Try again
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

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <p className="font-mono text-xs text-muted-foreground">{report.url}</p>
          <p className="mt-1 text-sm font-medium">AI readiness score</p>
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
                {s.label}
              </span>
            </li>
          )
        })}
      </ul>

      <ReportEmailForm report={report} />

      <button
        onClick={onReset}
        className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <RotateCcw className="size-3.5" />
        Scan another store
      </button>
    </div>
  )
}

function ReportEmailForm({ report }: { report: UiScanReport }) {
  const { locale } = useScan()
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
        throw new Error(payload?.error?.message ?? "Unable to send report.")
      }

      setState("sent")
      setMessage(`Thanks — your full PDF report is on its way to ${email}.`)
    } catch (error) {
      setState("error")
      setMessage(error instanceof Error ? error.message : "Unable to send report.")
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
            Get the full PDF report
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            A detailed breakdown with fixes, sent to your inbox.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <label htmlFor="report-email" className="sr-only">
              Email address
            </label>
            <input
              id="report-email"
              type="email"
              required
              placeholder="you@yourstore.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-3 focus:ring-ring/30"
            />
            <Button type="submit" size="lg" className="h-10" disabled={state === "sending"}>
              {state === "sending" ? "Sending..." : "Email me the report"}
            </Button>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            No spam. We only send this report, product launch announcements, and early-access
            updates. You can unsubscribe anytime.
          </p>
          {state === "error" && message ? (
            <p className="mt-2 text-xs font-medium text-destructive">{message}</p>
          ) : null}
        </form>
      )}
    </div>
  )
}
