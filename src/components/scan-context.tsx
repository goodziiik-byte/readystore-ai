"use client"

import type { Locale } from "@/lib/i18n"
import type { ScanResult } from "@/lib/scanner/types"
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

export type ScanStatus = "idle" | "scanning" | "done" | "error"

export type ScanCheck = {
  id: string
  label: string
  state: "pass" | "partial" | "fail"
}

export type UiScanReport = {
  url: string
  score: number
  checks: ScanCheck[]
  raw: ScanResult
}

type ScanContextValue = {
  url: string
  setUrl: (url: string) => void
  status: ScanStatus
  report: UiScanReport | null
  error: string | null
  locale: Locale
  runScan: (url: string) => Promise<void>
  reset: () => void
  scrollToScanner: () => void
}

const ScanContext = createContext<ScanContextValue | null>(null)

function normalizeUrl(raw: string): string | null {
  const value = raw.trim()
  if (!value) return null
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`

  try {
    const parsed = new URL(withProtocol)
    if (!parsed.hostname.includes(".")) return null
    return parsed.origin + (parsed.pathname === "/" ? "" : parsed.pathname)
  } catch {
    return null
  }
}

function stateFromVisibility(value: "clear" | "partial" | "missing"): ScanCheck["state"] {
  if (value === "clear") return "pass"
  if (value === "partial") return "partial"
  return "fail"
}

function stateFromRatio(value: number, total: number): ScanCheck["state"] {
  if (total <= 0) return "fail"
  if (value === total) return "pass"
  if (value > 0) return "partial"
  return "fail"
}

function toUiReport(result: ScanResult, locale: Locale): UiScanReport {
  const productTotal = result.productSummary.scanned
  const labels = {
    en: {
      products: "Product catalog readable",
      prices: "Prices & currency exposed",
      stock: "Stock availability visible",
      shipping: "Shipping options clear",
      returns: "Return policy discoverable",
      payments: "Local payment methods listed",
      checkout: "Checkout path reachable",
    },
    es: {
      products: "Catalogo de productos legible",
      prices: "Precios y moneda visibles",
      stock: "Disponibilidad visible",
      shipping: "Envio claro",
      returns: "Devoluciones encontrables",
      payments: "Pagos locales visibles",
      checkout: "Camino de checkout alcanzable",
    },
    pt: {
      products: "Catalogo de produtos legivel",
      prices: "Precos e moeda visiveis",
      stock: "Disponibilidade visivel",
      shipping: "Frete claro",
      returns: "Devolucoes encontraveis",
      payments: "Pagamentos locais visiveis",
      checkout: "Caminho de checkout acessivel",
    },
    id: {
      products: "Katalog produk terbaca",
      prices: "Harga dan mata uang terlihat",
      stock: "Ketersediaan stok terlihat",
      shipping: "Opsi pengiriman jelas",
      returns: "Policy retur ditemukan",
      payments: "Metode pembayaran lokal terlihat",
      checkout: "Path checkout bisa dijangkau",
    },
  }[locale]
  return {
    url: result.finalUrl || result.requestedUrl,
    score: Math.round(result.score * 10),
    raw: result,
    checks: [
      {
        id: "products",
        label: labels.products,
        state: result.platform.woocommerce || productTotal > 0 ? "pass" : "partial",
      },
      {
        id: "prices",
        label: labels.prices,
        state: stateFromRatio(result.productSummary.withPrice, productTotal),
      },
      {
        id: "stock",
        label: labels.stock,
        state: stateFromRatio(result.productSummary.withAvailability, productTotal),
      },
      {
        id: "shipping",
        label: labels.shipping,
        state: stateFromVisibility(result.aiVisibility.shipping),
      },
      {
        id: "returns",
        label: labels.returns,
        state: stateFromVisibility(result.aiVisibility.returns),
      },
      {
        id: "payments",
        label: labels.payments,
        state:
          result.paymentVisibility.level === "confirmed_provider"
            ? "pass"
            : result.paymentVisibility.level === "generic_payment_visible"
              ? "partial"
              : "fail",
      },
      {
        id: "checkout",
        label: labels.checkout,
        state:
          result.checkoutReadiness.status === "ready_to_guide"
            ? "pass"
            : result.checkoutReadiness.status === "partially_ready"
              ? "partial"
              : "fail",
      },
    ],
  }
}

export function ScanProvider({ children, locale }: { children: ReactNode; locale: Locale }) {
  const [url, setUrl] = useState("")
  const [status, setStatus] = useState<ScanStatus>("idle")
  const [report, setReport] = useState<UiScanReport | null>(null)
  const [error, setError] = useState<string | null>(null)

  const scrollToScanner = useCallback(() => {
    document.getElementById("scan")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [])

  const runScan = useCallback(
    async (rawUrl: string) => {
      const normalized = normalizeUrl(rawUrl)

      if (!normalized) {
        setStatus("error")
        setReport(null)
        setError("Enter a valid store URL, e.g. https://yourstore.com")
        return
      }

      setError(null)
      setUrl(normalized)
      setStatus("scanning")
      setReport(null)

      try {
        const response = await fetch("/api/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: normalized, locale }),
        })
        const payload = await response.json()

        if (!response.ok) {
          throw new Error(payload?.error?.message ?? "Scan failed.")
        }

        setReport(toUiReport(payload as ScanResult, locale))
        setStatus("done")
      } catch (scanError) {
        setStatus("error")
        setError(scanError instanceof Error ? scanError.message : "Scan failed.")
      }
    },
    [locale],
  )

  const reset = useCallback(() => {
    setStatus("idle")
    setReport(null)
    setError(null)
  }, [])

  const value = useMemo(
    () => ({ url, setUrl, status, report, error, locale, runScan, reset, scrollToScanner }),
    [url, status, report, error, locale, runScan, reset, scrollToScanner],
  )

  return <ScanContext.Provider value={value}>{children}</ScanContext.Provider>
}

export function useScan() {
  const ctx = useContext(ScanContext)
  if (!ctx) throw new Error("useScan must be used within a ScanProvider")
  return ctx
}
