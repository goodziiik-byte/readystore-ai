export type LayerState = "pass" | "partial" | "fail"

export const report = {
  store: {
    platform: "WooCommerce",
    url: "presidential.coffee",
    fullUrl: "https://presidential.coffee/",
    scannedAt: "20 Jul 2026",
    pagesAnalyzed: 10,
    productPagesInspected: 5,
    paymentProvider: "Omise / Opn",
  },
  score: {
    value: 7.3,
    max: 10,
    label: "Mostly ready",
    summary:
      "AI can read parts of this store, but important buying context is still unclear. The scanner inspected 5 product pages: 5/5 show price signals, 5/5 show availability signals, and 4/5 expose Product schema. Missing areas: shipping, returns.",
  },
  highlights: [
    { label: "Price signals", value: "Confirmed", state: "pass" as LayerState },
    { label: "Payment provider", value: "Confirmed provider", state: "pass" as LayerState },
    { label: "Product schema", value: "4 / 5 pages", state: "partial" as LayerState },
    { label: "Shipping & returns", value: "Not found", state: "fail" as LayerState },
  ],
  productSummary: {
    pages: 5,
    metrics: [
      { label: "Price schema", score: 5, max: 5 },
      { label: "Availability index", score: 5, max: 5 },
      { label: "Product schema", score: 4, max: 5 },
      { label: "Offer schema", score: 5, max: 5 },
      { label: "Currency signals", score: 5, max: 5 },
    ],
  },
  layers: [
    {
      id: "catalog",
      title: "Product catalog layer",
      state: "pass" as LayerState,
      description:
        "AI assistants read reliable product identity, price, stock, and Product Offer schema before they can compete here.",
      tags: ["5 product pages scanned", "5/5 price schema", "5/5 availability index", "4/5 Product schema evidence"],
      impact: "High",
    },
    {
      id: "trust",
      title: "Trust and policy layer",
      state: "fail" as LayerState,
      description:
        "AI assistants need shipping, returns, contact, and policy context to judge whether the store is safe to recommend.",
      tags: ["Shipping visibility: missing", "Return policy visibility: missing"],
      impact: "Medium",
    },
    {
      id: "discovery",
      title: "AI discovery layer",
      state: "partial" as LayerState,
      description:
        "AI assistants and feeds make important store, product, policy, and checkout metadata easier to discover and keep fresh.",
      tags: ["No feed anomaly", "Sitemap not found", "llms.txt not found"],
      impact: "Medium",
    },
    {
      id: "checkout",
      title: "Checkout handoff layer",
      state: "partial" as LayerState,
      description:
        "AI agents should know whether the buyer must complete checkout on the merchant site and which local payment provider or method is available.",
      tags: ["Confirmed provider signal: Omise / Opn", "Checkout visibility: partial"],
      impact: "Medium",
    },
  ],
  checkout: {
    state: "partial" as LayerState,
    summary:
      "AI assistants can understand parts of the buying path, but checkout/payment handoff is not fully machine-readable yet.",
    steps: [
      {
        title: "Product can be understood",
        state: "pass" as LayerState,
        body: "Product pages expose identity and price signals.",
        meta: "5 / 5 selected product pages inspected",
      },
      {
        title: "Cart page can be reached",
        state: "partial" as LayerState,
        body: "AI can reach a cart URL, but a session may be required to add items.",
        meta: "Cart URL detected",
      },
      {
        title: "Checkout page can be reached",
        state: "partial" as LayerState,
        body: "The checkout page loaded publicly. The scanner shares visibility only and does not submit checkout data.",
        meta: "Requires plugin for safe handoff",
      },
    ],
    signals: [
      {
        title: "Payment options are understandable",
        state: "pass" as LayerState,
        body: "Payment provider is exposed on-site.",
        meta: "Omise / Opn: on-site",
      },
      {
        title: "Shipping and returns are clear before purchase",
        state: "fail" as LayerState,
        body: "AI assistants may not know shipping and return terms because they are unclear.",
        meta: "Shipping: missing · Returns: missing",
      },
      {
        title: "Safe payment link for AI shopper",
        state: "partial" as LayerState,
        body: "Creating a safe checkout or payment link requires the Readystore AI plugin so an AI agent can complete a payment safely.",
        meta: "Checkout: overridable with plugin",
      },
    ],
  },
  priorityFixes: [
    {
      title: "Make shipping and return policy machine-readable",
      body: "AI assistants may avoid recommending stores when delivery and return terms are unclear.",
      impact: "High",
      effort: "Low",
      layer: "Trust and policy",
    },
    {
      title: "Add AI-friendly checkout handoff",
      body: "This store is partly readable for AI, but the plugin is needed to prepare a safe checkout/payment link for the shopper.",
      impact: "Medium",
      effort: "Low",
      layer: "Checkout",
    },
    {
      title: "Publish an llms.txt AI discovery manifest",
      body: "A simple AI-readable manifest helps assistants find store metadata, product feeds, and policy URLs.",
      impact: "Medium",
      effort: "Low",
      layer: "AI discovery",
    },
  ],
  canUnderstand: [
    "The store appears to use WooCommerce",
    "The scanner found 5 product pages to inspect",
    "Visible product price signals exist",
    "Currency signals are visible",
    "Structured data is present: Breadcrumb, ListItem, Product, Offer, UnitPriceSpecification",
    "Payment context mentions Omise / Opn",
    "Contact pages or channels are discoverable",
  ],
  mayMiss: [
    "Shipping information may be hard to discover",
    "Return policy may be hard to discover",
    "Safe AI checkout handoff requires a plugin connection",
    "No llms.txt AI discovery manifest was found",
  ],
  fields: [
    { label: "price", state: "pass" as LayerState },
    { label: "title", state: "pass" as LayerState },
    { label: "availability", state: "pass" as LayerState },
    { label: "shipping", state: "fail" as LayerState },
    { label: "brand", state: "pass" as LayerState },
    { label: "payment", state: "partial" as LayerState },
    { label: "returns", state: "fail" as LayerState },
    { label: "currency", state: "pass" as LayerState },
  ],
  topIssues: [
    {
      title: "Shipping or return policy is hard to discover",
      body: "AI assistants often need shipping and return information to recommend a merchant confidently.",
    },
    {
      title: "Safe AI checkout handoff is not confirmed",
      body: "The public store has some buying path signals, but generating a safe checkout or payment link requires a merchant-approved plugin connection.",
    },
    {
      title: "llms.txt is not published",
      body: "A simple AI discovery manifest can make important store and product feeds easier to find.",
    },
  ],
  scoreBreakdown: [
    { label: "Platform", score: 10 },
    { label: "Product data", score: 10 },
    { label: "Structured data", score: 9 },
    { label: "Price and currency", score: 9 },
    { label: "Stock availability", score: 9 },
    { label: "Shipping and returns", score: 3 },
    { label: "Checkout path", score: 7 },
    { label: "AI surfaces", score: 8 },
    { label: "Crawlability", score: 4 },
  ],
  discoveredPages: [
    { label: "Products", path: "/shop/", found: true },
    { label: "Product data", path: "/product/luwak-250g/", found: true },
    { label: "Checkout", path: "/checkout/", found: true },
    { label: "Checkout (localized)", path: "/finalize-compra/", found: true },
    { label: "Shipping", path: "Not found", found: false },
    { label: "Returns", path: "Not found", found: false },
    { label: "Contact", path: "/contact/us/", found: true },
  ],
  evidence: [
    { type: "Homepage", url: "https://presidential.coffee/", tags: ["HTML", "Structured data"] },
    {
      type: "Product",
      url: "https://presidential.coffee/product/luwak-250g/",
      tags: ["Product schema", "Price detected", "In stock"],
    },
    {
      type: "Product",
      url: "https://presidential.coffee/product/robusta-350g/",
      tags: ["Product schema", "Price detected"],
    },
    {
      type: "Product",
      url: "https://presidential.coffee/product/blends-350g/",
      tags: ["Product schema", "Price detected"],
    },
    {
      type: "Product",
      url: "https://presidential.coffee/product/kopi-arabica/",
      tags: ["Price detected", "In stock"],
    },
    {
      type: "Product",
      url: "https://presidential.coffee/product/excelsa-350g/",
      tags: ["Product schema", "Price detected"],
    },
    { type: "Cart", url: "https://presidential.coffee/cart/", tags: ["Reachable"] },
    { type: "Checkout", url: "https://presidential.coffee/checkout/", tags: ["Public", "GET only"] },
  ],
  planSteps: [
    {
      title: "Check what an AI shopper sees today",
      body: "Publish llms.txt, store profile, product feed, policy links, and checkout context in a clean, machine-readable format.",
      layer: "AI discovery layer",
      delta: "+0.6 to +0.9",
    },
    {
      title: "Prepare the checkout handoff",
      body: "Expose cart, checkout, shipping, and local payment context so AI assistants know how a buyer can complete the purchase safely.",
      layer: "Checkout handoff layer",
      delta: "+0.3 to +0.6",
    },
    {
      title: "Fix what merchants do not usually see",
      body: "Repair schema gaps, expose shipping and return metadata, normalize local payment context, and catch crawlability issues.",
      layer: "Trust and policy layer",
      delta: "+0.4 to +0.8",
    },
    {
      title: "Track the before and after",
      body: "Monitor score changes, fixed issues, product coverage, feed health, and crawler access, then re-scan over the months in a structured layout.",
      layer: "Monitoring",
      delta: "ongoing",
    },
  ],
}
