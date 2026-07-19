import type { ScanIssue, ScanResult, ScoreBreakdown } from "./types";

type ScoreInput = Omit<ScanResult, "score" | "scoreBreakdown" | "issues" | "aiCanUnderstand" | "aiMayMiss" | "priorityFixes" | "merchantSummary" | "readinessLayers">;

export function buildScore(input: ScoreInput): Pick<ScanResult, "score" | "scoreBreakdown" | "issues" | "aiCanUnderstand" | "aiMayMiss"> {
  const breakdown: ScoreBreakdown = {
    platform: input.platform.woocommerce ? 10 : input.platform.wordpress ? 6 : input.platform.ecommerce ? 4 : 1,
    productData: input.pageSamples.products.length > 0 ? 7 : 3,
    structuredData: input.structuredData.hasProductSchema ? 9 : input.structuredData.jsonLdCount > 0 ? 5 : 1,
    priceAndCurrency: scorePair(input.signals.hasPrice, input.signals.hasCurrency),
    stockAvailability: input.signals.hasAvailability ? 8 : 2,
    shippingReturns: Math.min(10, (input.pageSamples.shipping.length > 0 ? 4 : 0) + (input.pageSamples.returns.length > 0 ? 4 : 0) + (input.pageSamples.contact.length > 0 ? 2 : 0)),
    paymentCheckout: scoreCheckoutPath(input),
    aiSurfaces: input.signals.hasLlmsTxt ? 9 : input.signals.hasSitemapHint ? 4 : 1,
    crawlability: input.signals.hasRobotsTxt ? 8 : 5,
  };

  const weighted =
    breakdown.platform * 0.12 +
    breakdown.productData * 0.12 +
    breakdown.structuredData * 0.15 +
    breakdown.priceAndCurrency * 0.12 +
    breakdown.stockAvailability * 0.1 +
    breakdown.shippingReturns * 0.1 +
    breakdown.paymentCheckout * 0.12 +
    breakdown.aiSurfaces * 0.1 +
    breakdown.crawlability * 0.07;

  const issues = buildIssues(input);
  const aiCanUnderstand = buildCanUnderstand(input);
  const aiMayMiss = buildMayMiss(input);

  return {
    score: Math.round(weighted * 10) / 10,
    scoreBreakdown: breakdown,
    issues,
    aiCanUnderstand,
    aiMayMiss,
  };
}

function scorePair(first: boolean, second: boolean): number {
  if (first && second) {
    return 9;
  }

  if (first || second) {
    return 5;
  }

  return 1;
}

function scoreCheckoutPath(input: ScoreInput): number {
  const statusScore = {
    ready: 10,
    partial: 6,
    requires_plugin: 4,
    blocked: 0,
  };

  const checks = input.checkoutReadiness.checks;
  const scoreFor = (id: string): number => {
    const check = checks.find((item) => item.id === id);
    return check ? statusScore[check.status] : 0;
  };

  const weighted =
    scoreFor("product_selectable") * 0.16 +
    scoreFor("cart_reachable") * 0.14 +
    scoreFor("checkout_reachable") * 0.18 +
    scoreFor("payment_context") * 0.2 +
    scoreFor("trust_policies") * 0.12 +
    scoreFor("safe_payment_link") * 0.2;

  const publicScanCap =
    input.checkoutReadiness.status === "ready_to_guide"
      ? 8
      : input.checkoutReadiness.status === "partially_ready"
        ? 7
        : 5;

  return Math.round(Math.min(publicScanCap, weighted) * 10) / 10;
}

function buildIssues(input: ScoreInput): ScanIssue[] {
  const issues: ScanIssue[] = [];

  if (! input.platform.woocommerce) {
    issues.push({
      id: "woocommerce-not-confirmed",
      category: "Platform",
      severity: input.platform.wordpress ? "high" : "critical",
      title: "WooCommerce could not be confidently confirmed",
      explanation: "The scanner did not find enough WooCommerce signals to treat this as a qualified plugin lead.",
      evidence: input.platform.evidence,
      canPluginFix: false,
    });
  }

  if (! input.structuredData.hasProductSchema) {
    issues.push({
      id: "product-schema-missing",
      category: "Structured data",
      severity: "high",
      title: "Product schema is missing or incomplete",
      explanation: "AI shopping assistants may struggle to compare products without machine-readable Product and Offer metadata.",
      evidence: input.pagesScanned
        .filter((page) => page.role === "product")
        .map((page) => `${page.url}: ${page.schemaTypes.length > 0 ? page.schemaTypes.join(", ") : "no Product schema found"}`)
        .slice(0, 5),
      canPluginFix: true,
    });
  }

  if (! input.signals.hasAvailability) {
    issues.push({
      id: "availability-missing",
      category: "Product data",
      severity: "high",
      title: "Availability is unclear",
      explanation: "AI assistants may not know whether products are in stock, out of stock, or backorderable.",
      evidence: input.pagesScanned
        .filter((page) => page.role === "product")
        .map((page) => `${page.url}: availability signal missing`)
        .slice(0, 5),
      canPluginFix: true,
    });
  }

  if (input.paymentProviders.length === 0) {
    issues.push({
      id: "payment-provider-not-detected",
      category: "Payment",
      severity: "medium",
      title: "Payment provider is not visible to the scanner",
      explanation: "The checkout may work for humans, but AI agents may not understand the payment context.",
      evidence: input.pagesScanned
        .filter((page) => ["cart", "checkout", "homepage"].includes(page.role))
        .map((page) => `${page.url}: no known local payment provider detected`)
        .slice(0, 5),
      canPluginFix: true,
    });
  }

  if (input.pageSamples.shipping.length === 0 || input.pageSamples.returns.length === 0) {
    issues.push({
      id: "policy-pages-weak",
      category: "Trust",
      severity: "medium",
      title: "Shipping or return policy is hard to discover",
      explanation: "AI assistants often need delivery and return information to recommend a merchant confidently.",
      evidence: [...input.pageSamples.shipping, ...input.pageSamples.returns],
      canPluginFix: true,
    });
  }

  if (input.checkoutReadiness.status === "blocked_or_unclear") {
    issues.push({
      id: "checkout-path-blocked",
      category: "Checkout",
      severity: "high",
      title: "AI checkout path is blocked or unclear",
      explanation: "AI assistants may be able to read products, but still fail to guide a buyer from product selection to checkout and payment.",
      evidence: input.checkoutReadiness.checks
        .filter((check) => check.status === "blocked")
        .flatMap((check) => check.evidence.length > 0 ? check.evidence : [check.explanation])
        .slice(0, 5),
      canPluginFix: true,
    });
  } else if (input.checkoutReadiness.status === "partially_ready") {
    issues.push({
      id: "checkout-handoff-needs-plugin",
      category: "Checkout",
      severity: "medium",
      title: "Safe AI checkout handoff is not confirmed",
      explanation: "The public store has some buying-path signals, but generating a safe checkout or payment link requires a merchant-approved plugin connection.",
      evidence: input.checkoutReadiness.checks
        .filter((check) => check.status === "partial" || check.status === "requires_plugin")
        .flatMap((check) => check.evidence.length > 0 ? check.evidence : [check.explanation])
        .slice(0, 5),
      canPluginFix: true,
    });
  }

  if (! input.signals.hasLlmsTxt) {
    issues.push({
      id: "llms-txt-missing",
      category: "AI surfaces",
      severity: "low",
      title: "llms.txt is not published",
      explanation: "A simple AI discovery manifest can make important store and product feeds easier to find.",
      evidence: [],
      canPluginFix: true,
    });
  }

  return issues.sort((a, b) => severityWeight(b.severity) - severityWeight(a.severity)).slice(0, 8);
}

function buildCanUnderstand(input: ScoreInput): string[] {
  const items = [];
  const productPages = input.pagesScanned.filter((page) => page.role === "product" && page.fetched);

  if (input.platform.woocommerce) items.push("The store appears to use WooCommerce.");
  if (productPages.length > 0) items.push(`The scanner found ${productPages.length} product pages to inspect.`);
  if (input.signals.hasPrice) items.push("Visible product price signals exist.");
  if (input.signals.hasCurrency) items.push("Currency signals are visible.");
  if (input.structuredData.jsonLdCount > 0) items.push(`Structured data is present, including: ${input.structuredData.schemaTypes.slice(0, 5).join(", ")}.`);
  if (input.paymentProviders.length > 0) items.push(`Payment context mentions ${input.paymentProviders.map((provider) => provider.name).join(", ")}.`);
  if (input.pageSamples.contact.length > 0) items.push("Contact pages or channels are discoverable.");

  return items.length > 0 ? items : ["The scanner found only weak machine-readable commerce signals."];
}

function buildMayMiss(input: ScoreInput): string[] {
  const items = [];

  if (! input.structuredData.hasProductSchema) items.push("Product and Offer schema may be missing.");
  if (! input.signals.hasAvailability) items.push("Stock or availability may be unclear.");
  if (input.aiVisibility.shipping === "missing") items.push("Shipping information may be hard to discover.");
  if (input.aiVisibility.returns === "missing") items.push("Return policy may be hard to discover.");
  if (input.paymentProviders.length === 0) items.push("Payment provider context may be invisible to AI.");
  if (input.checkoutReadiness.status === "blocked_or_unclear") items.push("The buying path from product to checkout may be blocked or unclear.");
  if (input.checkoutReadiness.status === "partially_ready") items.push("Safe AI checkout handoff requires a plugin connection.");
  if (! input.signals.hasLlmsTxt) items.push("No llms.txt AI discovery manifest was found.");

  return items.length > 0 ? items : ["No major AI-readiness gaps were detected in this first scan."];
}

function severityWeight(severity: ScanIssue["severity"]): number {
  return {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  }[severity];
}
