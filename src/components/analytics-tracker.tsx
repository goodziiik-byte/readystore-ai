"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { trackClientEvent } from "@/lib/analytics"
import type { Locale } from "@/lib/i18n"

export function AnalyticsTracker({ locale, event = "landing_view" }: { locale: Locale; event?: string }) {
  const searchParams = useSearchParams()

  useEffect(() => {
    const domain = searchParams.get("domain") || searchParams.get("url") || undefined
    trackClientEvent(event, { locale, domain })
  }, [event, locale, searchParams])

  return null
}
