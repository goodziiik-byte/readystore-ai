import { type LayerState, type report as sampleReport } from "@/lib/report-data"
import type { PageObservation, ReadinessLayer, ScanResult } from "@/lib/scanner/types"

export type ReportModel = typeof sampleReport

function layerState(status: ReadinessLayer["status"]): LayerState {
  if (status === "strong") return "pass"
  if (status === "partial") return "partial"
  return "fail"
}

function checkoutState(status: ScanResult["checkoutReadiness"]["status"]): LayerState {
  if (status === "ready_to_guide") return "partial"
  if (status === "partially_ready") return "partial"
  return "fail"
}

function checkState(status: ScanResult["checkoutReadiness"]["checks"][number]["status"]): LayerState {
  if (status === "ready") return "pass"
  if (status === "partial" || status === "requires_plugin") return "partial"
  return "fail"
}

function visibilityState(value: "clear" | "partial" | "missing"): LayerState {
  if (value === "clear") return "pass"
  if (value === "partial") return "partial"
  return "fail"
}

function ratioState(value: number, total: number): LayerState {
  if (total <= 0) return "fail"
  if (value === total) return "pass"
  if (value > 0) return "partial"
  return "fail"
}

function scoreLabel(score: number) {
  if (score >= 8) return "Mostly ready"
  if (score >= 6) return "Needs a few fixes"
  if (score >= 4) return "Needs fixes"
  return "Critical gaps"
}

function shortUrl(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "")
  }
}

function firstPath(urls: string[], fallback = "Not found") {
  const url = urls[0]
  if (!url) return fallback
  try {
    const parsed = new URL(url)
    return parsed.pathname || "/"
  } catch {
    return url
  }
}

function observationsByRole(pages: PageObservation[], role: PageObservation["role"]) {
  return pages.filter((page) => page.role === role)
}

function observationTags(page: PageObservation) {
  const tags: string[] = []
  if (page.fetched) tags.push(`HTTP ${page.status ?? 200}`)
  if (page.signals.hasProductSchema) tags.push("Product schema")
  if (page.signals.hasOfferSchema) tags.push("Offer")
  if (page.signals.hasPrice) tags.push("Price detected")
  if (page.signals.hasAvailability) tags.push("Stock detected")
  if (page.signals.hasPaymentSignal) tags.push("Payment signal")
  if (page.signals.hasCheckoutForm) tags.push("Checkout form")
  if (page.signals.hasBotProtectionSignal) tags.push("Bot protection signal")
  if (!tags.length && page.error) tags.push(page.error)
  return tags.length ? tags : ["Scanned"]
}

export function scanResultToReport(result: ScanResult): ReportModel {
  const product = result.productSummary
  const productPages = observationsByRole(result.pagesScanned, "product")
  const provider = result.paymentProviders[0]?.name ?? result.paymentVisibility.label
  const score = Number(result.score.toFixed(1))
  const pagesAnalyzed = result.pagesScanned.filter((page) => page.fetched).length
  const checkout = result.checkoutReadiness
  const scoreBreakdown = result.scoreBreakdown

  return {
    store: {
      platform: result.platform.woocommerce ? "WooCommerce" : result.platform.ecommerce ? "Ecommerce" : "Unknown",
      url: shortUrl(result.finalUrl || result.requestedUrl),
      fullUrl: result.finalUrl || result.requestedUrl,
      scannedAt: new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric" }).format(
        new Date(result.scannedAt),
      ),
      pagesAnalyzed,
      productPagesInspected: product.scanned,
      paymentProvider: provider,
    },
    score: {
      value: score,
      max: 10,
      label: result.merchantSummary.headline || scoreLabel(score),
      summary: result.merchantSummary.body,
    },
    highlights: [
      {
        label: "Price signals",
        value: product.withPrice > 0 ? "Detected" : "Missing",
        state: ratioState(product.withPrice, product.scanned),
      },
      {
        label: "Payment provider",
        value: result.paymentVisibility.label,
        state: result.paymentVisibility.level === "not_visible" ? "fail" : "partial",
      },
      {
        label: "Product schema",
        value: `${product.withProductSchema} / ${product.scanned} pages`,
        state: ratioState(product.withProductSchema, product.scanned),
      },
      {
        label: "Shipping & returns",
        value:
          result.aiVisibility.shipping === "missing" || result.aiVisibility.returns === "missing"
            ? "Needs work"
            : "Detected",
        state:
          result.aiVisibility.shipping === "clear" && result.aiVisibility.returns === "clear"
            ? "pass"
            : result.aiVisibility.shipping === "missing" || result.aiVisibility.returns === "missing"
              ? "fail"
              : "partial",
      },
    ],
    productSummary: {
      pages: product.scanned,
      metrics: [
        { label: "Price visible", score: product.withPrice, max: product.scanned },
        { label: "Availability visible", score: product.withAvailability, max: product.scanned },
        { label: "Product schema", score: product.withProductSchema, max: product.scanned },
        { label: "Offer schema", score: product.withOfferSchema, max: product.scanned },
        { label: "Add to cart", score: product.withAddToCart, max: product.scanned },
      ],
    },
    layers: result.readinessLayers.map((layer) => ({
      id: layer.id,
      title: layer.title,
      state: layerState(layer.status),
      description: layer.whyItMatters,
      tags: layer.evidence.length ? layer.evidence : [`Plugin fix: ${layer.pluginCanFix}`, `Lift: ${layer.estimatedLift}`],
      impact: layer.impact[0].toUpperCase() + layer.impact.slice(1),
    })),
    checkout: {
      state: checkoutState(checkout.status),
      summary: checkout.summary,
      steps: checkout.checks.slice(0, 3).map((check) => ({
        title: check.label,
        state: checkState(check.status),
        body: check.explanation,
        meta: check.evidence[0] ?? check.status.replaceAll("_", " "),
      })),
      signals: checkout.checks.slice(3, 6).map((check) => ({
        title: check.label,
        state: checkState(check.status),
        body: check.explanation,
        meta: check.evidence[0] ?? check.status.replaceAll("_", " "),
      })),
    },
    priorityFixes: result.priorityFixes.map((fix) => ({
      title: fix.title,
      body: fix.reason,
      impact: fix.impact[0].toUpperCase() + fix.impact.slice(1),
      effort: fix.effort[0].toUpperCase() + fix.effort.slice(1),
      layer: fix.owner === "plugin" ? "Plugin" : fix.owner === "merchant" ? "Merchant" : "Merchant + plugin",
    })),
    canUnderstand: result.aiCanUnderstand,
    mayMiss: result.aiMayMiss,
    fields: [
      { label: "price", state: visibilityState(result.aiVisibility.price) },
      { label: "title", state: visibilityState(result.aiVisibility.productIdentity) },
      { label: "availability", state: visibilityState(result.aiVisibility.availability) },
      { label: "shipping", state: visibilityState(result.aiVisibility.shipping) },
      { label: "platform", state: result.platform.woocommerce ? "pass" : result.platform.ecommerce ? "partial" : "fail" },
      { label: "payment", state: visibilityState(result.aiVisibility.payment) },
      { label: "returns", state: visibilityState(result.aiVisibility.returns) },
      { label: "checkout", state: visibilityState(result.aiVisibility.checkout) },
    ],
    topIssues: result.issues.slice(0, 5).map((issue) => ({
      title: issue.title,
      body: issue.explanation,
    })),
    scoreBreakdown: [
      { label: "Platform", score: scoreBreakdown.platform },
      { label: "Product data", score: scoreBreakdown.productData },
      { label: "Structured data", score: scoreBreakdown.structuredData },
      { label: "Price and currency", score: scoreBreakdown.priceAndCurrency },
      { label: "Stock availability", score: scoreBreakdown.stockAvailability },
      { label: "Shipping and returns", score: scoreBreakdown.shippingReturns },
      { label: "Checkout path", score: scoreBreakdown.paymentCheckout },
      { label: "AI surfaces", score: scoreBreakdown.aiSurfaces },
      { label: "Crawlability", score: scoreBreakdown.crawlability },
    ],
    discoveredPages: [
      { label: "Products", path: firstPath(result.pageSamples.products), found: result.pageSamples.products.length > 0 },
      { label: "Cart", path: firstPath(result.pageSamples.cart), found: result.pageSamples.cart.length > 0 },
      { label: "Checkout", path: firstPath(result.pageSamples.checkout), found: result.pageSamples.checkout.length > 0 },
      { label: "Shipping", path: firstPath(result.pageSamples.shipping), found: result.pageSamples.shipping.length > 0 },
      { label: "Returns", path: firstPath(result.pageSamples.returns), found: result.pageSamples.returns.length > 0 },
      { label: "Contact", path: firstPath(result.pageSamples.contact), found: result.pageSamples.contact.length > 0 },
    ],
    evidence: result.pagesScanned
      .filter((page) => page.fetched || page.error)
      .slice(0, 10)
      .map((page) => ({
        type: page.role[0].toUpperCase() + page.role.slice(1),
        url: page.url,
        tags: observationTags(page),
      })),
    planSteps: [
      {
        title: "Create an AI storefront layer",
        body: "Publish product, policy, payment, and checkout context in clean machine-readable surfaces.",
        layer: "AI discovery",
        delta: "+0.4 to +0.9",
      },
      {
        title: "Prepare the checkout handoff",
        body: "Expose cart, checkout, shipping, and local payment context so assistants know the safe next step.",
        layer: "Checkout",
        delta: "+0.2 to +0.6",
      },
      {
        title: "Fix trust gaps",
        body: "Make shipping, returns, contact, and policy context easy for AI shoppers to verify.",
        layer: "Trust",
        delta: "+0.5 to +1.1",
      },
      {
        title: "Track before and after",
        body: "Monitor score changes, fixed issues, product coverage, feed health, crawler access, and checkout handoff readiness.",
        layer: "Monitoring",
        delta: "ongoing",
      },
    ],
  }
}
