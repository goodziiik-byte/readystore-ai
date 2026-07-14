export type Severity = "critical" | "high" | "medium" | "low";

export type ScanIssue = {
  id: string;
  category: string;
  severity: Severity;
  title: string;
  explanation: string;
  evidence: string[];
  canPluginFix: boolean;
};

export type DetectedProvider = {
  id: string;
  name: string;
  confidence: number;
  evidence: string[];
};

export type PageSamples = {
  products: string[];
  cart: string[];
  checkout: string[];
  shipping: string[];
  returns: string[];
  contact: string[];
  policies: string[];
};

export type PageRole = "homepage" | "product" | "cart" | "checkout" | "shipping" | "returns" | "contact" | "policy";

export type PageObservation = {
  url: string;
  role: PageRole;
  fetched: boolean;
  status?: number;
  title?: string;
  error?: string;
  signals: {
    hasPrice: boolean;
    hasCurrency: boolean;
    hasAvailability: boolean;
    hasAddToCart: boolean;
    hasProductSchema: boolean;
    hasOfferSchema: boolean;
    hasPaymentSignal: boolean;
    hasContactSignal: boolean;
  };
  schemaTypes: string[];
  paymentProviders: DetectedProvider[];
  evidenceText: string;
};

export type AiVisibilitySnapshot = {
  productIdentity: "clear" | "partial" | "missing";
  price: "clear" | "partial" | "missing";
  availability: "clear" | "partial" | "missing";
  shipping: "clear" | "partial" | "missing";
  returns: "clear" | "partial" | "missing";
  payment: "clear" | "partial" | "missing";
  checkout: "clear" | "partial" | "missing";
};

export type ProductSummary = {
  scanned: number;
  withPrice: number;
  withAvailability: number;
  withProductSchema: number;
  withOfferSchema: number;
  withAddToCart: number;
};

export type PaymentVisibility = {
  level: "confirmed_provider" | "generic_payment_visible" | "not_visible";
  label: string;
  evidence: string[];
};

export type PriorityFix = {
  title: string;
  impact: "high" | "medium" | "low";
  effort: "low" | "medium" | "high";
  owner: "plugin" | "merchant" | "both";
  reason: string;
};

export type MerchantSummary = {
  headline: string;
  body: string;
};

export type ReadinessLayer = {
  id: "catalog" | "trust" | "ai_discovery" | "checkout_payment";
  title: string;
  status: "strong" | "partial" | "missing";
  impact: "high" | "medium" | "low";
  pluginCanFix: "yes" | "partial" | "no";
  estimatedLift: string;
  whyItMatters: string;
  evidence: string[];
};

export type ScoreBreakdown = {
  platform: number;
  productData: number;
  structuredData: number;
  priceAndCurrency: number;
  stockAvailability: number;
  shippingReturns: number;
  paymentCheckout: number;
  aiSurfaces: number;
  crawlability: number;
};

export type ScanResult = {
  scanId: string;
  requestedUrl: string;
  finalUrl: string;
  scannedAt: string;
  pageTitle: string;
  platform: {
    wordpress: boolean;
    woocommerce: boolean;
    ecommerce: boolean;
    confidence: number;
    evidence: string[];
  };
  paymentProviders: DetectedProvider[];
  pageSamples: PageSamples;
  structuredData: {
    jsonLdCount: number;
    schemaTypes: string[];
    hasProductSchema: boolean;
    hasOfferSchema: boolean;
  };
  signals: {
    hasPrice: boolean;
    hasCurrency: boolean;
    hasAvailability: boolean;
    hasLlmsTxt: boolean;
    hasRobotsTxt: boolean;
    hasSitemapHint: boolean;
  };
  pagesScanned: PageObservation[];
  aiVisibility: AiVisibilitySnapshot;
  productSummary: ProductSummary;
  paymentVisibility: PaymentVisibility;
  priorityFixes: PriorityFix[];
  merchantSummary: MerchantSummary;
  readinessLayers: ReadinessLayer[];
  score: number;
  scoreBreakdown: ScoreBreakdown;
  aiCanUnderstand: string[];
  aiMayMiss: string[];
  issues: ScanIssue[];
};
