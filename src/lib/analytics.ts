"use client"

import type { Locale } from "@/lib/i18n"

type SearchLike = {
  get(name: string): string | null
}

type ClientEvent = {
  locale?: Locale
  domain?: string
  market?: string
  metadata?: Record<string, unknown>
}

const sessionKey = "readystore_ai_session_id"

export function utmFromSearchParams(searchParams: SearchLike) {
  return {
    utm_source: searchParams.get("utm_source") ?? undefined,
    utm_medium: searchParams.get("utm_medium") ?? undefined,
    utm_campaign: searchParams.get("utm_campaign") ?? undefined,
    utm_content: searchParams.get("utm_content") ?? undefined,
  }
}

export function trackClientEvent(name: string, event: ClientEvent = {}) {
  if (typeof window === "undefined") return

  const params = new URLSearchParams(window.location.search)
  const payload = {
    name,
    ...event,
    ...utmFromSearchParams(params),
    sessionId: getSessionId(),
    path: `${window.location.pathname}${window.location.search}`,
    referrer: document.referrer || undefined,
  }
  const body = JSON.stringify(payload)

  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/event", new Blob([body], { type: "application/json" }))
      return
    }
  } catch {
    // Fall back to fetch below.
  }

  fetch("/api/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined)
}

function getSessionId() {
  try {
    const existing = window.localStorage.getItem(sessionKey)
    if (existing) return existing
    const created = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
    window.localStorage.setItem(sessionKey, created)
    return created
  } catch {
    return undefined
  }
}
