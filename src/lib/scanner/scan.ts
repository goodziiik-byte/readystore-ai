import * as cheerio from "cheerio";
import { detectPageSamples, detectPaymentProviders } from "./detectors";
import { buildScore } from "./scoring";
import type { DetectedProvider, PageObservation, PageRole, PaymentVisibility, PriorityFix, ProductSummary, ReadinessLayer, ScanResult } from "./types";
import { normalizeUrl, sameOrigin } from "./url";

const USER_AGENT = "AIReadinessScanner/0.1 (+https://example.com)";
const FETCH_TIMEOUT_MS = 18_000;
const SECONDARY_FETCH_TIMEOUT_MS = 7_000;

export async function scanStore(inputUrl: string): Promise<ScanResult> {
  const url = normalizeUrl(inputUrl);
  const homepage = await fetchHomepage(url, inputUrl);
  const $ = cheerio.load(homepage.text);
  const homepageObservation = observePage(homepage.finalUrl, "homepage", homepage.text, 200);
  const internalLinks = extractInternalLinks($, new URL(homepage.finalUrl));
  const pageSamples = detectPageSamples(internalLinks);
  const pagesToFetch = selectPagesToFetch(pageSamples);
  const secondaryPages = await Promise.all(pagesToFetch.map((page) => fetchObservation(page.url, page.role)));
  const pagesScanned = [homepageObservation, ...secondaryPages];
  const combined = pagesScanned.map((page) => `${page.evidenceText}\n${pageTextForScoring(page)}`).join("\n");
  const structuredData = aggregateStructuredData(pagesScanned);
  const platform = detectPlatform(combined);
  const paymentProviders = mergeProviders(pagesScanned.flatMap((page) => page.paymentProviders));
  const signals = {
    hasPrice: pagesScanned.some((page) => page.signals.hasPrice),
    hasCurrency: pagesScanned.some((page) => page.signals.hasCurrency),
    hasAvailability: pagesScanned.some((page) => page.signals.hasAvailability),
    hasLlmsTxt: await hasPath(url, "/llms.txt"),
    hasRobotsTxt: await hasPath(url, "/robots.txt"),
    hasSitemapHint: /sitemap/i.test(combined) || await hasPath(url, "/sitemap.xml"),
  };
  const aiVisibility = buildAiVisibility(pageSamples, pagesScanned, structuredData, paymentProviders);
  const productSummary = buildProductSummary(pagesScanned);
  const paymentVisibility = buildPaymentVisibility(pagesScanned, paymentProviders);

  const base = {
    scanId: crypto.randomUUID(),
    requestedUrl: inputUrl,
    finalUrl: homepage.finalUrl,
    scannedAt: new Date().toISOString(),
    pageTitle: homepageObservation.title ?? "",
    platform,
    paymentProviders,
    pageSamples,
    structuredData,
    signals,
    pagesScanned,
    aiVisibility,
    productSummary,
    paymentVisibility,
  };
  const scored = buildScore(base);

  return {
    ...base,
    ...scored,
    priorityFixes: buildPriorityFixes(scored.issues, aiVisibility, paymentVisibility),
    merchantSummary: buildMerchantSummary(scored.score, aiVisibility, paymentVisibility, productSummary),
    readinessLayers: buildReadinessLayers(productSummary, aiVisibility, paymentVisibility, signals),
  };
}

async function fetchText(url: string, timeoutMs = FETCH_TIMEOUT_MS): Promise<{ text: string; finalUrl: string; status: number }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      redirect: "follow",
      signal: controller.signal,
    });

    if (! response.ok) {
      throw new Error(`Site returned HTTP ${response.status}.`);
    }

    const contentType = response.headers.get("content-type") ?? "";

    if (! /text\/html|application\/xhtml\+xml/i.test(contentType)) {
      throw new Error(`Expected HTML but received ${contentType || "unknown content type"}.`);
    }

    return {
      text: await response.text(),
      finalUrl: response.url,
      status: response.status,
    };
  } catch (error) {
    throw new Error(formatFetchError(error, timeoutMs));
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchHomepage(url: URL, originalInput: string): Promise<{ text: string; finalUrl: string; status: number }> {
  let httpsError: unknown = null;

  try {
    return await fetchText(url.toString(), FETCH_TIMEOUT_MS);
  } catch (error) {
    httpsError = error;
    const userProvidedProtocol = /^https?:\/\//i.test(originalInput.trim());

    if (url.protocol === "https:" && ! userProvidedProtocol) {
      const httpUrl = new URL(url.toString());
      httpUrl.protocol = "http:";

      try {
        return await fetchText(httpUrl.toString(), FETCH_TIMEOUT_MS);
      } catch {
        // Preserve the original HTTPS error because it is usually more relevant.
      }
    }

    throw httpsError;
  }
}

async function fetchObservation(url: string, role: PageRole): Promise<PageObservation> {
  try {
    const page = await fetchText(url, SECONDARY_FETCH_TIMEOUT_MS);
    return observePage(page.finalUrl, role, page.text, page.status);
  } catch (error) {
    return {
      url,
      role,
      fetched: false,
      error: error instanceof Error ? error.message : "Page could not be fetched.",
      signals: {
        hasPrice: false,
        hasCurrency: false,
        hasAvailability: false,
        hasAddToCart: false,
        hasProductSchema: false,
        hasOfferSchema: false,
        hasPaymentSignal: false,
        hasContactSignal: false,
      },
      schemaTypes: [],
      paymentProviders: [],
      evidenceText: "",
    };
  }
}

function observePage(url: string, role: PageRole, html: string, status: number): PageObservation {
  const $ = cheerio.load(html);
  const text = $.root().text().replace(/\s+/g, " ").slice(0, 80_000);
  const combined = `${html.slice(0, 200_000)}\n${text}`;
  const structuredData = extractStructuredData($);
  const paymentProviders = detectPaymentProviders(combined);

  return {
    url,
    role,
    fetched: true,
    status,
    title: $("title").first().text().trim(),
    signals: {
      hasPrice: hasPrice(combined),
      hasCurrency: hasCurrency(combined),
      hasAvailability: hasAvailability(combined),
      hasAddToCart: /\b(add to cart|buy now|beli sekarang|masukkan keranjang|tambah ke keranjang|add_to_cart|single_add_to_cart_button)\b/i.test(combined),
      hasProductSchema: structuredData.hasProductSchema,
      hasOfferSchema: structuredData.hasOfferSchema,
      hasPaymentSignal: paymentProviders.length > 0 || /\b(payment|pembayaran|bayar|checkout|mercadopago|razorpay|xendit|midtrans|paymongo|paystack)\b/i.test(combined),
      hasContactSignal: /\b(contact|kontak|hubungi|whatsapp|wa\.me|mailto:|phone|tel:|contato|contacto)\b/i.test(combined),
    },
    schemaTypes: structuredData.schemaTypes,
    paymentProviders,
    evidenceText: combined.slice(0, 60_000),
  };
}

function selectPagesToFetch(samples: ReturnType<typeof detectPageSamples>): Array<{ url: string; role: PageRole }> {
  const selected: Array<{ url: string; role: PageRole }> = [];
  const add = (role: PageRole, urls: string[], limit: number) => {
    urls.slice(0, limit).forEach((url) => selected.push({ url, role }));
  };

  add("product", samples.products, 5);
  add("cart", samples.cart, 1);
  add("checkout", samples.checkout, 1);
  add("shipping", samples.shipping, 1);
  add("returns", samples.returns, 1);
  add("contact", samples.contact, 1);
  add("policy", samples.policies, 1);

  const seen = new Set<string>();
  return selected.filter((page) => {
    if (seen.has(page.url)) return false;
    seen.add(page.url);
    return true;
  }).slice(0, 10);
}

function pageTextForScoring(page: PageObservation): string {
  return [
    page.url,
    page.title ?? "",
    page.schemaTypes.join(" "),
    page.paymentProviders.map((provider) => provider.name).join(" "),
    Object.entries(page.signals).filter(([, value]) => value).map(([key]) => key).join(" "),
  ].join(" ");
}

function extractInternalLinks($: cheerio.CheerioAPI, base: URL): string[] {
  const links = new Set<string>();

  $("a[href]").each((_, element) => {
    const href = $(element).attr("href");

    if (! href) return;

    const normalized = sameOrigin(base, href);

    if (normalized) {
      links.add(normalized);
    }
  });

  return Array.from(links).slice(0, 250);
}

function extractStructuredData($: cheerio.CheerioAPI): ScanResult["structuredData"] {
  const types = new Set<string>();
  let hasOfferSchema = false;

  $('script[type="application/ld+json"]').each((_, element) => {
    const raw = $(element).contents().text();

    try {
      collectSchemaTypes(JSON.parse(raw), types);
      if (/\"Offer\"|\"AggregateOffer\"/i.test(raw)) {
        hasOfferSchema = true;
      }
    } catch {
      // Ignore malformed JSON-LD in this first scanner pass.
    }
  });

  return {
    jsonLdCount: $('script[type="application/ld+json"]').length,
    schemaTypes: Array.from(types).slice(0, 20),
    hasProductSchema: types.has("Product"),
    hasOfferSchema,
  };
}

function aggregateStructuredData(pages: PageObservation[]): ScanResult["structuredData"] {
  const schemaTypes = new Set<string>();

  pages.forEach((page) => {
    page.schemaTypes.forEach((type) => schemaTypes.add(type));
  });

  return {
    jsonLdCount: pages.reduce((count, page) => count + (page.schemaTypes.length > 0 ? 1 : 0), 0),
    schemaTypes: Array.from(schemaTypes).slice(0, 30),
    hasProductSchema: pages.some((page) => page.signals.hasProductSchema),
    hasOfferSchema: pages.some((page) => page.signals.hasOfferSchema),
  };
}

function collectSchemaTypes(value: unknown, types: Set<string>): void {
  if (Array.isArray(value)) {
    value.forEach((item) => collectSchemaTypes(item, types));
    return;
  }

  if (! value || typeof value !== "object") {
    return;
  }

  const record = value as Record<string, unknown>;
  const type = record["@type"];

  if (Array.isArray(type)) {
    type.forEach((item) => typeof item === "string" && types.add(item));
  } else if (typeof type === "string") {
    types.add(type);
  }

  Object.values(record).forEach((item) => collectSchemaTypes(item, types));
}

function detectPlatform(text: string): ScanResult["platform"] {
  const evidence = [];

  if (/wp-content|wp-json|wordpress/i.test(text)) evidence.push("WordPress signals found");
  if (/woocommerce|wc-ajax|woocommerce-page|add_to_cart|add-to-cart/i.test(text)) evidence.push("WooCommerce signals found");
  if (/cart|checkout|add to cart|buy now|shop now|product/i.test(text)) evidence.push("Commerce language found");

  const wordpress = /wp-content|wp-json|wordpress/i.test(text);
  const woocommerce = /woocommerce|wc-ajax|woocommerce-page|add_to_cart|add-to-cart/i.test(text);
  const ecommerce = woocommerce || /cart|checkout|add to cart|buy now|shop now|product/i.test(text);

  return {
    wordpress,
    woocommerce,
    ecommerce,
    confidence: woocommerce ? 92 : wordpress ? 65 : ecommerce ? 45 : 10,
    evidence,
  };
}

async function hasPath(base: URL, path: string): Promise<boolean> {
  const target = new URL(path, base.origin);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4_000);

  try {
    const response = await fetch(target, {
      method: "GET",
      headers: { "User-Agent": USER_AGENT },
      signal: controller.signal,
    });

    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

function mergeProviders(providers: DetectedProvider[]): DetectedProvider[] {
  const byId = new Map<string, DetectedProvider>();

  providers.forEach((provider) => {
    const current = byId.get(provider.id);

    if (! current) {
      byId.set(provider.id, { ...provider });
      return;
    }

    current.confidence = Math.min(100, current.confidence + provider.confidence);
    current.evidence = Array.from(new Set([...current.evidence, ...provider.evidence])).slice(0, 8);
  });

  return Array.from(byId.values()).sort((a, b) => b.confidence - a.confidence);
}

function buildAiVisibility(
  samples: ReturnType<typeof detectPageSamples>,
  pages: PageObservation[],
  structuredData: ScanResult["structuredData"],
  paymentProviders: DetectedProvider[],
): ScanResult["aiVisibility"] {
  const productPages = pages.filter((page) => page.role === "product" && page.fetched);
  const any = (predicate: (page: PageObservation) => boolean) => pages.some(predicate);
  const productAny = (predicate: (page: PageObservation) => boolean) => productPages.some(predicate);

  return {
    productIdentity: structuredData.hasProductSchema || productPages.length >= 3 ? "clear" : productPages.length > 0 ? "partial" : "missing",
    price: productAny((page) => page.signals.hasPrice && page.signals.hasCurrency) ? "clear" : any((page) => page.signals.hasPrice) ? "partial" : "missing",
    availability: productAny((page) => page.signals.hasAvailability) ? "clear" : any((page) => page.signals.hasAvailability) ? "partial" : "missing",
    shipping: samples.shipping.length > 0 || pages.some((page) => page.role === "shipping" && page.fetched) ? "partial" : "missing",
    returns: samples.returns.length > 0 || pages.some((page) => page.role === "returns" && page.fetched) ? "partial" : "missing",
    payment: paymentProviders.length > 0 ? "partial" : any((page) => page.signals.hasPaymentSignal) ? "partial" : "missing",
    checkout: samples.checkout.length > 0 || any((page) => page.role === "checkout" && page.fetched) ? "partial" : "missing",
  };
}

function buildProductSummary(pages: PageObservation[]): ProductSummary {
  const products = pages.filter((page) => page.role === "product" && page.fetched);

  return {
    scanned: products.length,
    withPrice: products.filter((page) => page.signals.hasPrice).length,
    withAvailability: products.filter((page) => page.signals.hasAvailability).length,
    withProductSchema: products.filter((page) => page.signals.hasProductSchema).length,
    withOfferSchema: products.filter((page) => page.signals.hasOfferSchema).length,
    withAddToCart: products.filter((page) => page.signals.hasAddToCart).length,
  };
}

function buildPaymentVisibility(pages: PageObservation[], providers: DetectedProvider[]): PaymentVisibility {
  if (providers.length > 0) {
    return {
      level: "confirmed_provider",
      label: `Confirmed provider signal: ${providers.map((provider) => provider.name).join(", ")}`,
      evidence: providers.flatMap((provider) => provider.evidence.map((item) => `${provider.name}: ${item}`)).slice(0, 6),
    };
  }

  const genericPages = pages.filter((page) => page.signals.hasPaymentSignal);

  if (genericPages.length > 0) {
    return {
      level: "generic_payment_visible",
      label: "Payment or checkout language is visible, but no known local provider was confirmed.",
      evidence: genericPages.map((page) => `${page.role}: ${page.url}`).slice(0, 6),
    };
  }

  return {
    level: "not_visible",
    label: "Payment context is not visible to the scanner.",
    evidence: [],
  };
}

function buildPriorityFixes(
  issues: ScanResult["issues"],
  visibility: ScanResult["aiVisibility"],
  payment: PaymentVisibility,
): PriorityFix[] {
  const fixes: PriorityFix[] = [];
  const hasIssue = (id: string) => issues.some((issue) => issue.id === id);

  if (hasIssue("product-schema-missing")) {
    fixes.push({
      title: "Expose Product and Offer schema on product pages",
      impact: "high",
      effort: "medium",
      owner: "plugin",
      reason: "AI shopping assistants need machine-readable product, price, and offer data to compare products reliably.",
    });
  }

  if (visibility.shipping === "missing" || visibility.returns === "missing") {
    fixes.push({
      title: "Make shipping and return policy machine-readable",
      impact: "high",
      effort: "low",
      owner: "both",
      reason: "AI assistants may avoid recommending stores when delivery and return terms are unclear.",
    });
  }

  if (payment.level !== "confirmed_provider") {
    fixes.push({
      title: "Expose checkout and payment provider context",
      impact: "medium",
      effort: "low",
      owner: "plugin",
      reason: "The checkout may work for humans, but AI agents need a safe summary of how payment is completed.",
    });
  }

  if (hasIssue("llms-txt-missing")) {
    fixes.push({
      title: "Publish an llms.txt AI discovery manifest",
      impact: "medium",
      effort: "low",
      owner: "plugin",
      reason: "A simple AI-readable manifest helps assistants find store metadata, product feeds, and policy URLs.",
    });
  }

  if (hasIssue("availability-missing")) {
    fixes.push({
      title: "Expose stock and availability consistently",
      impact: "high",
      effort: "medium",
      owner: "both",
      reason: "Products with unclear availability are weaker candidates for AI-assisted recommendations.",
    });
  }

  return fixes.slice(0, 4);
}

function buildMerchantSummary(
  score: number,
  visibility: ScanResult["aiVisibility"],
  payment: PaymentVisibility,
  products: ProductSummary,
): ScanResult["merchantSummary"] {
  const headline = score >= 8
    ? "AI can understand the basics of this store, but a few trust and discovery gaps remain."
    : score >= 6
      ? "AI can read parts of this store, but important buying context is still unclear."
      : "AI shopping assistants may struggle to confidently recommend this store.";

  const missing = Object.entries(visibility)
    .filter(([, value]) => value === "missing")
    .map(([key]) => key.replace(/([A-Z])/g, " $1").toLowerCase());
  const partial = Object.entries(visibility)
    .filter(([, value]) => value === "partial")
    .map(([key]) => key.replace(/([A-Z])/g, " $1").toLowerCase());

  const productLine = products.scanned > 0
    ? `The scanner inspected ${products.scanned} product pages: ${products.withPrice}/${products.scanned} show price signals, ${products.withAvailability}/${products.scanned} show availability signals, and ${products.withProductSchema}/${products.scanned} expose Product schema.`
    : "The scanner could not inspect product pages from the discovered links.";
  const riskLine = missing.length > 0
    ? `Missing areas: ${missing.join(", ")}.`
    : partial.length > 0
      ? `Partially visible areas: ${partial.join(", ")}.`
      : "No major visibility area is completely missing in this scan.";

  return {
    headline,
    body: `${productLine} ${riskLine} Payment visibility: ${payment.label}`,
  };
}

function buildReadinessLayers(
  products: ProductSummary,
  visibility: ScanResult["aiVisibility"],
  payment: PaymentVisibility,
  signals: ScanResult["signals"],
): ReadinessLayer[] {
  const productStrong = products.scanned > 0
    && products.withPrice === products.scanned
    && products.withAvailability >= Math.max(1, products.scanned - 1)
    && products.withProductSchema >= Math.ceil(products.scanned * 0.6);
  const trustMissing = visibility.shipping === "missing" || visibility.returns === "missing";
  const checkoutMissing = visibility.checkout === "missing";

  return [
    {
      id: "catalog",
      title: "Product catalog layer",
      status: productStrong ? "strong" : products.scanned > 0 ? "partial" : "missing",
      impact: "high",
      pluginCanFix: productStrong ? "partial" : "yes",
      estimatedLift: productStrong ? "+0.1 to +0.3" : "+0.8 to +1.8",
      whyItMatters: "AI assistants need reliable product identity, price, stock, and Product/Offer schema before they can compare items.",
      evidence: [
        `${products.scanned} product pages scanned`,
        `${products.withPrice}/${products.scanned} show price`,
        `${products.withAvailability}/${products.scanned} show availability`,
        `${products.withProductSchema}/${products.scanned} expose Product schema`,
      ],
    },
    {
      id: "trust",
      title: "Trust and policy layer",
      status: trustMissing ? "missing" : visibility.shipping === "partial" || visibility.returns === "partial" ? "partial" : "strong",
      impact: "medium",
      pluginCanFix: "partial",
      estimatedLift: trustMissing ? "+0.5 to +1.1" : "+0.1 to +0.4",
      whyItMatters: "In comparison tasks, AI assistants need shipping, returns, contact, and policy context to judge whether the store is safe to recommend.",
      evidence: [
        `Shipping visibility: ${visibility.shipping}`,
        `Return policy visibility: ${visibility.returns}`,
      ],
    },
    {
      id: "ai_discovery",
      title: "AI discovery layer",
      status: signals.hasLlmsTxt ? "strong" : signals.hasSitemapHint ? "partial" : "missing",
      impact: "medium",
      pluginCanFix: "yes",
      estimatedLift: signals.hasLlmsTxt ? "+0.0 to +0.2" : "+0.4 to +0.9",
      whyItMatters: "AI-readable manifests and feeds make important store, product, policy, and checkout metadata easier to discover and keep fresh.",
      evidence: [
        `llms.txt: ${signals.hasLlmsTxt ? "found" : "missing"}`,
        `Sitemap hint: ${signals.hasSitemapHint ? "found" : "missing"}`,
      ],
    },
    {
      id: "checkout_payment",
      title: "Checkout and payment layer",
      status: payment.level === "confirmed_provider" && !checkoutMissing ? "strong" : payment.level === "not_visible" && checkoutMissing ? "missing" : "partial",
      impact: "medium",
      pluginCanFix: "partial",
      estimatedLift: payment.level === "confirmed_provider" ? "+0.2 to +0.5" : "+0.5 to +1.2",
      whyItMatters: "AI agents should know whether the buyer must complete checkout on the merchant site and which local payment provider or method is available.",
      evidence: [
        payment.label,
        `Checkout visibility: ${visibility.checkout}`,
      ],
    },
  ];
}

function hasPrice(text: string): boolean {
  return /(\$|€|£|₹|rp\.?|idr|inr|mxn|brl|ars|₱|php|฿|vnd|₫)\s?[\d,.]+|[\d,.]+\s?(usd|idr|inr|mxn|brl|ars|php|vnd)/i.test(text);
}

function hasCurrency(text: string): boolean {
  return /\b(usd|idr|inr|mxn|brl|ars|php|vnd|thb|ngn|zar)\b|(\$|€|£|₹|₱|₫|฿|rp\.?)/i.test(text);
}

function hasAvailability(text: string): boolean {
  return /\b(in stock|out of stock|available|availability|stok|stock|tersedia|agotado|disponible|em estoque|sold out|habis|preorder|pre-order)\b/i.test(text);
}

function formatFetchError(error: unknown, timeoutMs: number): string {
  if (error instanceof DOMException && error.name === "AbortError") {
    return `The site did not respond within ${Math.round(timeoutMs / 1000)} seconds.`;
  }

  if (error instanceof Error) {
    const cause = typeof error.cause === "object" && error.cause !== null ? error.cause as { code?: string; message?: string } : null;
    const code = cause?.code ?? "";
    const message = `${error.message} ${cause?.message ?? ""}`.trim();

    if (/abort|timed? out|timeout/i.test(message)) {
      return `The site did not respond within ${Math.round(timeoutMs / 1000)} seconds.`;
    }

    if (["ENOTFOUND", "EAI_AGAIN"].includes(code) || /getaddrinfo|ENOTFOUND|EAI_AGAIN/i.test(message)) {
      return "The domain could not be resolved. Check that the store URL is correct.";
    }

    if (["ECONNREFUSED", "ECONNRESET"].includes(code) || /ECONNREFUSED|ECONNRESET|socket|connection/i.test(message)) {
      return "The site refused or reset the connection during scanning. Try again in a moment.";
    }

    if (/certificate|TLS|SSL/i.test(message)) {
      return "The site has an HTTPS/TLS problem that prevented the scanner from loading it.";
    }

    if (/fetch failed/i.test(message)) {
      return "The scanner could not load this site. It may be temporarily blocking server-side requests or timing out.";
    }

    return message || "The scanner could not load this site.";
  }

  return "The scanner could not load this site.";
}
