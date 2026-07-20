"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { useScan } from "@/components/scan-context"
import { ArrowRight, Search, ShieldCheck } from "lucide-react"

const STATS = [
  { value: "393%", label: "growth in AI shopping traffic" },
  { value: "42%", label: "better conversion from AI shoppers" },
  { value: "Checkout", label: "where AI shopping is heading next" },
]

export function Hero() {
  const { runScan, status } = useScan()
  const [value, setValue] = useState("")

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    runScan(value)
    document.getElementById("scan")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <section className="relative overflow-hidden bg-navy text-navy-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--color-navy-foreground) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-navy-foreground/20 bg-navy-foreground/5 px-3 py-1 text-xs font-medium text-navy-foreground/80">
            <span className="size-1.5 rounded-full bg-lime" />
            AI readiness scanner for WooCommerce
          </span>

          <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Can AI shopping assistants actually{" "}
            <span className="text-lime">understand your store?</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-navy-foreground/70 sm:text-lg">
            Scan your WooCommerce store to see if AI can read your products, prices, stock,
            shipping, returns, local payments, and checkout path.
          </p>

          <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-xl">
            <label htmlFor="hero-url" className="sr-only">
              Your WooCommerce store URL
            </label>
            <div className="flex flex-col gap-3 rounded-xl border border-navy-foreground/15 bg-navy-foreground/5 p-2 sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-2 px-2">
                <Search className="size-4 shrink-0 text-navy-foreground/50" />
                <input
                  id="hero-url"
                  type="text"
                  inputMode="url"
                  autoComplete="url"
                  placeholder="yourstore.com"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="h-10 w-full bg-transparent text-sm text-navy-foreground placeholder:text-navy-foreground/40 focus:outline-none"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={status === "scanning"}
                className="h-11 bg-lime px-5 text-base text-lime-foreground hover:bg-lime/90"
              >
                {status === "scanning" ? "Scanning…" : "Scan my store"}
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </form>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-navy-foreground/55">
            <ShieldCheck className="size-3.5 text-lime" />
            Public pages only. No login, no checkout submission, no payment data.
          </p>
        </div>

        <dl className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-navy-foreground/12 bg-navy-foreground/5 p-5 text-left"
            >
              <dt className="text-2xl font-semibold text-lime">{stat.value}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-navy-foreground/65">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
