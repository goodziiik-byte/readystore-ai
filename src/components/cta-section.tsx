"use client"

import { Button } from "@/components/ui/button"
import { useScan } from "@/components/scan-context"
import { useCopy } from "@/components/use-copy"
import { ArrowRight, ScanLine } from "lucide-react"

export function CtaSection() {
  const { scrollToScanner } = useScan()
  const copy = useCopy()

  return (
    <section id="early-access" className="scroll-mt-20 bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm sm:p-12">
          <span className="mx-auto flex size-10 items-center justify-center rounded-xl bg-navy text-lime">
            <ScanLine className="size-5" />
          </span>
          <h2 className="mt-5 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            {copy.report.capture.title}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            {copy.report.capture.body}
          </p>

          <div className="mt-8 flex items-center justify-center">
            <Button size="lg" onClick={scrollToScanner}>
              {copy.hero.scanButton}
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
