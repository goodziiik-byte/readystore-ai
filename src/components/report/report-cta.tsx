"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { utmFromSearchParams } from "@/lib/analytics"
import { defaultLocale, getDictionary, localeMarkets, type Locale } from "@/lib/i18n"
import { report } from "@/lib/report-data"
import type { ReportModel } from "@/lib/report-model"
import type { ScanResult } from "@/lib/scanner/types"
import { ArrowRight, Mail, TrendingUp } from "lucide-react"

type SendStatus = "idle" | "sending" | "sent" | "error"

export function ReportCta({
  report: data = report,
  result,
  locale = defaultLocale,
}: {
  report?: ReportModel
  result?: ScanResult | null
  locale?: Locale
}) {
  const copy = getDictionary(locale)
  const capture = copy.report.capture
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<SendStatus>("idle")
  const [error, setError] = useState("")
  const canSend = Boolean(result?.scanId && result.score !== undefined)

  async function handleSend(e: FormEvent) {
    e.preventDefault()
    if (!result || status === "sending") return

    setStatus("sending")
    setError("")

    try {
      const params = new URLSearchParams(window.location.search)
      const response = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          result,
          locale,
          market: localeMarkets[locale],
          source: `report_cta_${locale}`,
          ...utmFromSearchParams(params),
        }),
      })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload?.error?.message ?? capture.fallbackError)
      }

      setStatus("sent")
    } catch (sendError) {
      const message = sendError instanceof Error ? sendError.message : capture.fallbackError
      setStatus("error")
      setError(message)
    }
  }

  return (
    <section id="pdf-report" className="overflow-hidden rounded-2xl border border-navy bg-navy p-6 text-navy-foreground shadow-sm sm:p-8">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-foreground/10 px-3 py-1 text-xs font-medium text-lime">
        <TrendingUp className="size-3.5" />
        Estimated uplift: +0.9 to +1.7 AI readiness points
      </span>
      <h2 className="mt-4 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
        Add the AI shopping layer your store is missing
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-navy-foreground/70 text-pretty">
        Your product pages may already be readable, but AI shopping assistants also need trust,
        policy, payment, freshness, and a clean checkout path before they can recommend a store with
        confidence. The plugin fixes the gaps this scan found, keeps watching the store, and prepares
        a safe checkout handoff when a shopper asks an AI assistant to buy.
      </p>

      <form onSubmit={handleSend} className="mt-6 grid gap-3 rounded-xl border border-navy-foreground/10 bg-navy-foreground/[0.04] p-3 sm:grid-cols-[1fr_auto]">
        <label htmlFor="report-email" className="sr-only">
          {capture.label}
        </label>
        <div className="flex min-w-0 items-center gap-2 rounded-lg border border-navy-foreground/15 bg-navy-foreground/5 px-3">
          <Mail className="size-4 shrink-0 text-navy-foreground/55" />
          <input
            id="report-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={capture.placeholder}
            className="h-11 w-full bg-transparent text-sm text-navy-foreground outline-none placeholder:text-navy-foreground/45"
          />
        </div>
        <Button
          type="submit"
          size="lg"
          disabled={!canSend || status === "sending" || status === "sent"}
          className="bg-lime text-lime-foreground hover:bg-lime/90"
        >
          {status === "sending" ? capture.sending : capture.button}
          <ArrowRight className="size-4" />
        </Button>
        <p className="text-xs leading-relaxed text-navy-foreground/55 sm:col-span-2">{capture.disclaimer}</p>
        {!canSend ? (
          <p className="text-sm font-medium text-lime sm:col-span-2">Run a live scan first, then we can send the PDF report.</p>
        ) : null}
        {status === "sent" ? (
          <p className="text-sm font-medium text-lime sm:col-span-2">{capture.sent}</p>
        ) : null}
        {status === "error" ? (
          <p className="text-sm font-medium text-red-200 sm:col-span-2">{error}</p>
        ) : null}
      </form>

      <ol className="mt-8 grid gap-3 sm:grid-cols-2">
        {data.planSteps.map((step, i) => (
          <li key={step.title} className="rounded-xl border border-navy-foreground/10 bg-navy-foreground/[0.04] p-4">
            <div className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-lime text-xs font-semibold text-lime-foreground">
                {i + 1}
              </span>
              <h3 className="text-sm font-medium">{step.title}</h3>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-navy-foreground/65">{step.body}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-md bg-navy-foreground/10 px-2 py-0.5 text-navy-foreground/70">
                {step.layer}
              </span>
              <span className="font-medium text-lime">{step.delta}</span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
