"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useScan } from "@/components/scan-context"
import { useCopy } from "@/components/use-copy"
import { defaultLocale, localeLabels, locales } from "@/lib/i18n"
import { ScanLine } from "lucide-react"

export function SiteHeader() {
  const { locale, scrollToScanner } = useScan()
  const copy = useCopy()
  const [search, setSearch] = useState("")

  useEffect(() => {
    setSearch(window.location.search)
  }, [])

  const nav = [
    { label: copy.nav.howItWorks, href: "#problem" },
    { label: "AI shopper", href: "#simulation" },
    { label: copy.marketing.safety.scanTitle, href: "#scope" },
    { label: copy.report.summary.payment, href: "#payments" },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-navy text-navy-foreground">
            <ScanLine className="size-4 text-lime" />
          </span>
          <span className="text-base font-semibold tracking-tight">
            Readystore<span className="text-primary"> AI</span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden rounded-lg border border-border bg-card p-1 sm:flex" aria-label="Language switcher">
            {locales.map((item) => (
              <a
                key={item}
                href={`${item === defaultLocale ? "/" : `/${item}`}${search}`}
                className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                  item === locale ? "bg-navy text-navy-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {localeLabels[item]}
              </a>
            ))}
          </div>
          <Button size="lg" onClick={scrollToScanner}>
            {copy.hero.scanButton}
          </Button>
        </div>
      </div>
    </header>
  )
}
