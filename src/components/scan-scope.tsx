"use client"

import { useCopy } from "@/components/use-copy"
import { Check, X } from "lucide-react"

export function ScanScope() {
  const copy = useCopy()

  return (
    <section id="scope" className="scroll-mt-20 border-y border-border bg-muted/40 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-primary">{copy.marketing.safety.eyebrow}</p>
          <h2 className="mt-2 text-balance text-2xl font-semibold tracking-tight sm:text-4xl">
            {copy.marketing.safety.title}
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            {copy.marketing.safety.body}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-success/30 bg-card p-6">
            <h3 className="flex items-center gap-2 text-base font-semibold">
              <span className="flex size-7 items-center justify-center rounded-full bg-success/10 text-success">
                <Check className="size-4" />
              </span>
              {copy.marketing.safety.scanTitle}
            </h3>
            <ul className="mt-4 space-y-3">
              {copy.marketing.safety.scanItems.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="flex items-center gap-2 text-base font-semibold">
              <span className="flex size-7 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <X className="size-4" />
              </span>
              {copy.marketing.safety.neverTitle}
            </h3>
            <ul className="mt-4 space-y-3">
              {copy.marketing.safety.neverItems.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <X className="mt-0.5 size-4 shrink-0 text-destructive" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
