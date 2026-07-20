"use client"

import { useEffect, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { useScan } from "@/components/scan-context"
import { useCopy } from "@/components/use-copy"
import { ArrowRight, Search, ShieldCheck } from "lucide-react"

export function Hero() {
  const { runScan, status, url, setUrl } = useScan()
  const copy = useCopy()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const domain = params.get("domain") || params.get("url")
    if (domain) setUrl(domain)
  }, [setUrl])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    runScan(url)
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
            {copy.hero.eyebrow}
          </span>

          <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            {copy.hero.title}
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-navy-foreground/70 sm:text-lg">
            {copy.hero.body}
          </p>

          <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-xl">
            <label htmlFor="hero-url" className="sr-only">
              {copy.hero.inputLabel}
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
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="h-10 w-full bg-transparent text-sm text-navy-foreground placeholder:text-navy-foreground/40 focus:outline-none"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={status === "scanning"}
                className="h-11 bg-lime px-5 text-base text-lime-foreground hover:bg-lime/90"
              >
                {status === "scanning" ? `${copy.hero.scanning}...` : copy.hero.scanButton}
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </form>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-navy-foreground/55">
            <ShieldCheck className="size-3.5 text-lime" />
            {copy.hero.trust.join(". ")}.
          </p>
        </div>

        <dl className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          {copy.hero.stats.map((stat) => (
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
