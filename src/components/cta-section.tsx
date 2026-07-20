"use client"

import { Button } from "@/components/ui/button"
import { useScan } from "@/components/scan-context"
import { ArrowRight, ScanLine } from "lucide-react"

export function CtaSection() {
  const { scrollToScanner } = useScan()

  return (
    <section id="early-access" className="scroll-mt-20 bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm sm:p-12">
          <span className="mx-auto flex size-10 items-center justify-center rounded-xl bg-navy text-lime">
            <ScanLine className="size-5" />
          </span>
          <h2 className="mt-5 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            Get your report and join early access
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            Run a free scan, get a full PDF report, and join our design partner list to shape the
            Readystore AI plugin.
          </p>

          <div className="mt-8 flex items-center justify-center">
            <Button size="lg" onClick={scrollToScanner}>
              Run a free scan
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
