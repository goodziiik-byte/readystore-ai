"use client"

import { Button } from "@/components/ui/button"
import { report } from "@/lib/report-data"
import type { ReportModel } from "@/lib/report-model"
import { ArrowRight, TrendingUp } from "lucide-react"

export function ReportCta({ report: data = report }: { report?: ReportModel }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-navy bg-navy p-6 text-navy-foreground shadow-sm sm:p-8">
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

      <div className="mt-6">
        <Button size="lg" className="bg-lime text-lime-foreground hover:bg-lime/90">
          Join the waitlist and get the PDF report
          <ArrowRight className="size-4" />
        </Button>
      </div>

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
