"use client"

import { useEffect, useMemo, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Loader2, ScanLine, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SiteFooter } from "@/components/site-footer"
import { ReportHeader } from "@/components/report/report-header"
import {
  CheckoutCheck,
  PaymentVisibility,
  PriorityFixes,
  ProductSummary,
  ReadinessLayers,
} from "@/components/report/report-layers"
import {
  DiscoveredPages,
  Evidence,
  FieldGrid,
  ScoreBreakdown,
  TopIssues,
  Understanding,
} from "@/components/report/report-details"
import { ReportCta } from "@/components/report/report-cta"
import { trackClientEvent, utmFromSearchParams } from "@/lib/analytics"
import { defaultLocale, type Locale } from "@/lib/i18n"
import { report as sampleReport } from "@/lib/report-data"
import { scanResultToReport, type ReportModel } from "@/lib/report-model"
import type { ScanResult } from "@/lib/scanner/types"

type ReportStatus = "idle" | "loading" | "ready" | "error"

function normalizeUrl(raw: string) {
  const value = raw.trim()
  if (!value) return null
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`

  try {
    const parsed = new URL(withProtocol)
    if (!parsed.hostname.includes(".")) return null
    return parsed.origin + (parsed.pathname === "/" ? "" : parsed.pathname)
  } catch {
    return null
  }
}

function localePath(locale: Locale) {
  return locale === defaultLocale ? "" : `/${locale}`
}

export function ReportPageClient({ locale = defaultLocale }: { locale?: Locale }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const domainFromUrl = searchParams.get("domain") || searchParams.get("url") || ""
  const [input, setInput] = useState(domainFromUrl)
  const [status, setStatus] = useState<ReportStatus>(domainFromUrl ? "loading" : "idle")
  const [error, setError] = useState("")
  const [liveReport, setLiveReport] = useState<ReportModel | null>(null)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)

  const isLive = status === "ready" && liveReport
  const report = useMemo(() => liveReport ?? sampleReport, [liveReport])

  useEffect(() => {
    setInput(domainFromUrl)

    if (!domainFromUrl) {
      setStatus("idle")
      setLiveReport(null)
      setScanResult(null)
      setError("")
      return
    }

    trackClientEvent("report_view", { locale, domain: domainFromUrl })

    const normalized = normalizeUrl(domainFromUrl)
    if (!normalized) {
      setStatus("error")
      setLiveReport(null)
      setScanResult(null)
      setError("Enter a valid store URL, for example https://yourstore.com")
      trackClientEvent("scan_error", {
        locale,
        domain: domainFromUrl,
        metadata: { reason: "invalid_url" },
      })
      return
    }

    const controller = new AbortController()
    const normalizedUrl = normalized

    async function runScan() {
      setStatus("loading")
      setLiveReport(null)
      setScanResult(null)
      setError("")
      trackClientEvent("scan_started", { locale, domain: normalizedUrl })

      try {
        const response = await fetch("/api/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: normalizedUrl, locale, ...utmFromSearchParams(searchParams) }),
          signal: controller.signal,
        })
        const payload = await response.json()

        if (!response.ok) {
          throw new Error(payload?.error?.message ?? "Unable to scan this store.")
        }

        const result = payload as ScanResult
        setScanResult(result)
        setLiveReport(scanResultToReport(result))
        setStatus("ready")
        trackClientEvent("scan_success", {
          locale,
          domain: normalizedUrl,
          metadata: {
            score: result.score,
            finalUrl: result.finalUrl,
            payment: result.paymentVisibility.label,
            woocommerce: result.platform.woocommerce,
          },
        })
      } catch (scanError) {
        if (controller.signal.aborted) return
        setStatus("error")
        setScanResult(null)
        const message = scanError instanceof Error ? scanError.message : "Unable to scan this store."
        setError(message)
        trackClientEvent("scan_error", { locale, domain: normalizedUrl, metadata: { message } })
      }
    }

    runScan()

    return () => controller.abort()
  }, [domainFromUrl, locale])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const normalized = normalizeUrl(input)
    if (!normalized) {
      setStatus("error")
      setScanResult(null)
      setError("Enter a valid store URL, for example https://yourstore.com")
      trackClientEvent("scan_error", { locale, domain: input, metadata: { reason: "invalid_url" } })
      return
    }

    trackClientEvent("scan_cta_clicked", { locale, domain: normalized, metadata: { source: "report_page" } })
    const params = new URLSearchParams(searchParams.toString())
    params.set("domain", normalized)
    params.delete("url")
    router.push(`${localePath(locale)}/report?${params.toString()}`)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link href={`${localePath(locale) || "/"}`} className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-navy text-navy-foreground">
              <ScanLine className="size-4 text-lime" />
            </span>
            <span className="text-base font-semibold tracking-tight">
              Readystore<span className="text-primary"> AI</span>
            </span>
          </Link>
          <Button asChild variant="outline" size="lg">
            <Link href={`${localePath(locale) || "/"}`}>
              <ArrowLeft className="size-4" />
              New scan
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 space-y-4 px-4 py-8 sm:px-6 sm:py-10">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center"
        >
          <label htmlFor="report-domain" className="sr-only">
            Store URL
          </label>
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-input bg-background px-3">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input
              id="report-domain"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="yourstore.com"
              className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <Button type="submit" size="lg" disabled={status === "loading"}>
            {status === "loading" ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Scanning
              </>
            ) : (
              "Run scan"
            )}
          </Button>
        </form>

        {status === "loading" ? (
          <section className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
            <Loader2 className="mx-auto size-6 animate-spin text-primary" />
            <h1 className="mt-4 text-2xl font-semibold tracking-tight">Scanning this store</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Checking products, structured data, policies, payment signals, and checkout path.
            </p>
          </section>
        ) : null}

        {status === "error" ? (
          <section className="rounded-2xl border border-destructive/30 bg-destructive/[0.04] p-8 text-center shadow-sm">
            <h1 className="text-2xl font-semibold tracking-tight">Unable to scan this store</h1>
            <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">{error}</p>
          </section>
        ) : null}

        {status === "idle" ? (
          <ReportHeader report={sampleReport} isSample />
        ) : null}

        {isLive ? (
          <>
            <ReportHeader report={report} isSample={false} />
            <ProductSummary report={report} />
            <ReadinessLayers report={report} />
            <PaymentVisibility report={report} />
            <CheckoutCheck report={report} />
            <PriorityFixes report={report} />
            <Understanding report={report} />
            <FieldGrid report={report} />
            <TopIssues report={report} />
            <ScoreBreakdown report={report} />
            <DiscoveredPages report={report} />
            <Evidence report={report} />
            <ReportCta report={report} result={scanResult} locale={locale} />
          </>
        ) : null}
      </main>

      <SiteFooter locale={locale} />
    </div>
  )
}
