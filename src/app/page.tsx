"use client";

import type { ScanResult } from "@/lib/scanner/types";
import { AlertTriangle, ArrowRight, Bot, CheckCircle2, CreditCard, Eye, FileSearch, Gauge, Globe2, Layers3, Loader2, Mail, Search, ShieldCheck, Sparkles, Store, TrendingUp, Wrench, XCircle } from "lucide-react";
import { FormEvent, useState } from "react";

const examples = ["casanativa.mx", "ashaskin.in", "baliminigoods.id"];

export default function HomePage() {
  const [url, setUrl] = useState("https://woocommerce.com");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const payload = await response.json();

      if (! response.ok) {
        throw new Error(payload?.error?.message ?? "Scan failed.");
      }

      setResult(payload);
    } catch (scanError) {
      setError(scanError instanceof Error ? scanError.message : "Scan failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <Header />

      <section className="scanner-panel hero-panel">
        <div className="hero-content">
          <div className="scanner-copy">
            <span className="eyebrow">AI readiness scanner for WooCommerce</span>
            <h1>AI shopping traffic is growing. Make sure your store can be read.</h1>
            <p>
              Readystore AI checks whether ChatGPT, Google AI, and shopping agents can understand
              your products, prices, stock, shipping, returns, local payment context, and checkout signals.
            </p>
          </div>

          <div className="hero-stats">
            <StatCard value="+393%" label="AI retail traffic YoY" />
            <StatCard value="+42%" label="AI traffic conversion lift" />
            <StatCard value="66%" label="Avg. product-page machine readability" />
          </div>

          <form className="scan-form" onSubmit={submit}>
            <Search size={20} />
            <input value={url} onChange={(event) => setUrl(event.target.value)} aria-label="Store URL" />
            <button disabled={loading}>
              {loading ? <Loader2 className="spin" size={18} /> : <ArrowRight size={18} />}
              {loading ? "Scanning" : "Scan my store"}
            </button>
          </form>
          <div className="example-row">
            {examples.map((example) => (
              <button key={example} onClick={() => setUrl(`https://${example}`)}>{example}</button>
            ))}
          </div>
          <p className="source-note">
            Source: Adobe Digital Insights, U.S. retail AI traffic and machine-readability report, Apr. 2026.
          </p>
        </div>

        <HeroPreview loading={loading} />
      </section>

      {error && (
        <section className="message error">
          <XCircle size={18} />
          {error}
        </section>
      )}

      {!result && <MarketingSections />}

      {result && <Report result={result} />}
    </main>
  );
}

function Header() {
  return (
    <header className="site-header">
      <div className="brand-lockup">
        <div className="brand-mark">
          <Sparkles size={18} />
        </div>
        <div>
          <strong>Readystore AI</strong>
          <span>Commerce visibility for AI shoppers</span>
        </div>
      </div>
      <div className="header-actions">
        <span>WooCommerce first</span>
        <span>Agentic commerce ready</span>
      </div>
    </header>
  );
}

function HeroPreview({ loading }: { loading: boolean }) {
  return (
    <aside className="hero-preview" aria-label="Readystore AI readiness preview">
      <div className="preview-topline">
        <span>Live readiness model</span>
        <strong>{loading ? "Scanning..." : "Before plugin"}</strong>
      </div>
      <div className="preview-score">
        <div>
          <span>AI clarity score</span>
          <strong>6.4</strong>
        </div>
        <meter min={0} max={10} value={6.4} />
      </div>
      <div className="preview-path">
        <PreviewStep icon={<Store size={16} />} title="Catalog" status="Readable" tone="good" />
        <PreviewStep icon={<ShieldCheck size={16} />} title="Trust policies" status="Missing" tone="warn" />
        <PreviewStep icon={<CreditCard size={16} />} title="Payment context" status="Partial" tone="mid" />
        <PreviewStep icon={<Globe2 size={16} />} title="AI discovery" status="Not found" tone="warn" />
      </div>
      <div className="preview-outcome">
        <TrendingUp size={17} />
        <p>Stores that expose clean product, policy, payment, and freshness signals are easier for AI shoppers to compare and recommend.</p>
      </div>
    </aside>
  );
}

function PreviewStep({ icon, title, status, tone }: { icon: React.ReactNode; title: string; status: string; tone: "good" | "mid" | "warn" }) {
  return (
    <div className={`preview-step ${tone}`}>
      <span>{icon}</span>
      <strong>{title}</strong>
      <em>{status}</em>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="stat-card">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function MarketingSections() {
  return (
    <section className="marketing-stack">
      <MarketShift />
      <WooGap />
      <ScanMethod />
      <ReadinessLayer />
    </section>
  );
}

function MarketShift() {
  return (
    <section className="marketing-section market-shift">
      <div className="section-copy">
        <span className="eyebrow">Market shift</span>
        <h2>AI shoppers are becoming a new acquisition channel.</h2>
        <p>They compare products before your analytics ever sees a visitor. If the store is hard to read, it can be skipped early.</p>
      </div>
      <div className="flow-strip" aria-label="AI shopping journey">
        <FlowNode icon={<Search size={17} />} title="Search" />
        <FlowNode icon={<Bot size={17} />} title="AI answer" />
        <FlowNode icon={<FileSearch size={17} />} title="Compare" />
        <FlowNode icon={<Store size={17} />} title="Recommend" />
        <FlowNode icon={<CreditCard size={17} />} title="Checkout" />
      </div>
    </section>
  );
}

function WooGap() {
  return (
    <section className="marketing-section woo-gap">
      <div className="section-copy">
        <span className="eyebrow">The WooCommerce gap</span>
        <h2>Humans see a store. AI needs signals.</h2>
        <p>A product page can look fine and still miss policy, payment, discovery, or freshness context.</p>
      </div>
      <div className="comparison-grid">
        <SignalColumn title="Human shoppers see" items={["Photos", "Price", "Add to cart", "Delivery text"]} />
        <SignalColumn highlighted title="AI shoppers need" items={["Product schema", "Stock status", "Policy metadata", "Payment context"]} />
      </div>
    </section>
  );
}

function ScanMethod() {
  return (
    <section className="marketing-section scan-method">
      <div className="section-copy">
        <span className="eyebrow">How diagnosis works</span>
        <h2>We scan more than the homepage.</h2>
        <p>Readystore AI checks the surfaces an agent would use to decide whether your store is safe to recommend.</p>
      </div>
      <div className="method-grid">
        <MethodCard step="01" title="Discover" text="Products, policies, checkout hints." />
        <MethodCard step="02" title="Extract" text="Schema, prices, stock, payments." />
        <MethodCard step="03" title="Score" text="Catalog, trust, checkout, discovery." />
        <MethodCard step="04" title="Fix" text="Ranked actions and plugin coverage." />
      </div>
    </section>
  );
}

function ReadinessLayer() {
  return (
    <section className="marketing-section layer-section">
      <div className="section-copy">
        <span className="eyebrow">After the scan</span>
        <h2>The plugin adds the missing AI readiness layer.</h2>
        <p>It keeps WooCommerce readable as products, prices, stock, payments, and policies change.</p>
      </div>
      <div className="layer-diagram">
        <DiagramBlock icon={<Store size={18} />} title="WooCommerce store" />
        <ArrowRight size={20} />
        <DiagramBlock active icon={<Layers3 size={18} />} title="Readystore AI layer" />
        <ArrowRight size={20} />
        <DiagramBlock icon={<Bot size={18} />} title="AI shopping agents" />
      </div>
      <div className="mini-feature-grid">
        <MiniFeature title="AI discovery" text="llms.txt and store profile." />
        <MiniFeature title="Clean context" text="Products, policies, payments." />
        <MiniFeature title="Ongoing reports" text="Catch readiness drift." />
      </div>
    </section>
  );
}

function FlowNode({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flow-node">
      <span>{icon}</span>
      <strong>{title}</strong>
    </div>
  );
}

function SignalColumn({ title, items, highlighted = false }: { title: string; items: string[]; highlighted?: boolean }) {
  return (
    <div className={`signal-column ${highlighted ? "highlighted" : ""}`}>
      <strong>{title}</strong>
      <ul>
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}

function MethodCard({ step, title, text }: { step: string; title: string; text: string }) {
  return (
    <article className="method-card">
      <span>{step}</span>
      <strong>{title}</strong>
      <p>{text}</p>
    </article>
  );
}

function DiagramBlock({ icon, title, active = false }: { icon: React.ReactNode; title: string; active?: boolean }) {
  return (
    <div className={`diagram-block ${active ? "active" : ""}`}>
      <span>{icon}</span>
      <strong>{title}</strong>
    </div>
  );
}

function MiniFeature({ title, text }: { title: string; text: string }) {
  return (
    <article className="mini-feature">
      <strong>{title}</strong>
      <p>{text}</p>
    </article>
  );
}

function Report({ result }: { result: ScanResult }) {
  const status = result.score >= 8.5 ? "AI-ready" : result.score >= 7 ? "Mostly ready" : result.score >= 5 ? "Needs fixes" : "Critical gaps";
  const [email, setEmail] = useState("");
  const [reportStatus, setReportStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [reportMessage, setReportMessage] = useState("");

  async function requestReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setReportStatus("sending");
    setReportMessage("");

    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, result }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error?.message ?? "Unable to send report.");
      }

      setReportStatus("sent");
      setReportMessage("Report sent. You are on the early access list.");
    } catch (error) {
      setReportStatus("error");
      setReportMessage(error instanceof Error ? error.message : "Unable to send report.");
    }
  }

  return (
    <section className="report-stack">
      <div className="report-hero">
        <Score score={result.score} />
        <div>
          <span className="eyebrow">Scan report</span>
          <h2>{status}</h2>
          <p><strong>{result.merchantSummary.headline}</strong></p>
          <p>{result.merchantSummary.body}</p>
          <p className="url-line">{result.finalUrl}</p>
        </div>
        <div className="summary-grid">
          <Summary icon={<Store size={18} />} label="WooCommerce" value={result.platform.woocommerce ? "Confirmed" : "Unconfirmed"} />
          <Summary icon={<CreditCard size={18} />} label="Payment" value={paymentLabel(result.paymentVisibility.level)} />
          <Summary icon={<Globe2 size={18} />} label="JSON-LD" value={`${result.structuredData.jsonLdCount} blocks`} />
        </div>
      </div>

      <section className="report-capture" id="report-capture">
        <div>
          <span className="eyebrow">Get the full report</span>
          <h2>Email yourself the PDF and join early access.</h2>
          <p>We will send the readiness report, top fixes, and plugin waitlist confirmation.</p>
        </div>
        <div className="report-capture-form">
          <form className="report-form" onSubmit={requestReport}>
            <Mail size={18} />
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@store.com"
              aria-label="Email address"
              type="email"
              required
            />
            <button disabled={reportStatus === "sending"}>
              {reportStatus === "sending" ? <Loader2 className="spin" size={17} /> : <ArrowRight size={17} />}
              {reportStatus === "sending" ? "Sending" : "Send PDF"}
            </button>
          </form>
          <p className="email-disclaimer">
            No spam. We will only send this report, the product launch announcement, and early-access updates.
            You can unsubscribe anytime.
          </p>
          {reportMessage && <p className={`report-message ${reportStatus}`}>{reportMessage}</p>}
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <h3>Product-page summary</h3>
          <span>{result.productSummary.scanned} product pages inspected</span>
        </div>
        <div className="product-summary-grid">
          <RatioMetric label="Price visible" value={result.productSummary.withPrice} total={result.productSummary.scanned} />
          <RatioMetric label="Availability visible" value={result.productSummary.withAvailability} total={result.productSummary.scanned} />
          <RatioMetric label="Product schema" value={result.productSummary.withProductSchema} total={result.productSummary.scanned} />
          <RatioMetric label="Offer schema" value={result.productSummary.withOfferSchema} total={result.productSummary.scanned} />
          <RatioMetric label="Add to cart" value={result.productSummary.withAddToCart} total={result.productSummary.scanned} />
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <h3>Readiness layers</h3>
          <span>What is strong vs what still blocks AI confidence</span>
        </div>
        <div className="layer-list">
          {result.readinessLayers.map((layer) => (
            <article className={`layer-row ${layer.status}`} key={layer.id}>
              <div>
                <strong>{layer.title}</strong>
                <p>{layer.whyItMatters}</p>
                <ul className="evidence-list">
                  {layer.evidence.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
              <div className="layer-meta">
                <span>Status: {layer.status}</span>
                <span>Impact: {layer.impact}</span>
                <span>Plugin fix: {layer.pluginCanFix}</span>
                <span>Est. lift: {layer.estimatedLift}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <h3><CreditCard size={18} /> Payment visibility</h3>
          <span className={`payment-level ${result.paymentVisibility.level}`}>{paymentLabel(result.paymentVisibility.level)}</span>
        </div>
        <p>{result.paymentVisibility.label}</p>
        {result.paymentVisibility.evidence.length > 0 && (
          <ul className="evidence-list">
            {result.paymentVisibility.evidence.map((item) => <li key={item}>{item}</li>)}
          </ul>
        )}
      </section>

      <section className="card">
        <div className="card-header">
          <h3><Wrench size={18} /> Fix these first</h3>
          <span>{result.priorityFixes.length} priority fixes</span>
        </div>
        <div className="priority-list">
          {result.priorityFixes.map((fix) => (
            <article className="priority-row" key={fix.title}>
              <div>
                <strong>{fix.title}</strong>
                <p>{fix.reason}</p>
              </div>
              <div className="priority-meta">
                <span>Impact: {fix.impact}</span>
                <span>Effort: {fix.effort}</span>
                <span>Owner: {fix.owner}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="two-col">
        <Insight title="AI can understand" items={result.aiCanUnderstand} good />
        <Insight title="AI may miss" items={result.aiMayMiss} />
      </div>

      <section className="card">
        <div className="card-header">
          <h3><Eye size={18} /> How AI sees this store right now</h3>
          <span>{result.pagesScanned.filter((page) => page.fetched).length} pages scanned</span>
        </div>
        <div className="visibility-grid">
          {Object.entries(result.aiVisibility).map(([key, value]) => (
            <div className={`visibility ${value}`} key={key}>
              <span>{labelize(key)}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <h3>Top issues</h3>
          <span>{result.issues.length} found</span>
        </div>
        <div className="issue-list">
          {result.issues.map((issue) => (
            <article className="issue-row" key={issue.id}>
              <SeverityIcon severity={issue.severity} />
              <div>
                <strong>{issue.title}</strong>
                <p>{issue.explanation}</p>
                {issue.evidence.length > 0 && (
                  <ul className="evidence-list">
                    {issue.evidence.slice(0, 3).map((item) => <li key={item}>{item}</li>)}
                  </ul>
                )}
              </div>
              <span className={`fix-chip ${issue.canPluginFix ? "auto" : "manual"}`}>
                {issue.canPluginFix ? "Plugin can help" : "Manual"}
              </span>
            </article>
          ))}
        </div>
      </section>

      <div className="two-col">
        <section className="card">
          <h3>Score breakdown</h3>
          <div className="breakdown">
            {Object.entries(result.scoreBreakdown).map(([key, value]) => (
              <div key={key}>
                <span>{labelize(key)}</span>
                <meter min={0} max={10} value={value} />
                <strong>{value}/10</strong>
              </div>
            ))}
          </div>
        </section>
        <section className="card">
          <h3>Discovered pages</h3>
          <PageSample label="Products" items={result.pageSamples.products} />
          <PageSample label="Checkout" items={result.pageSamples.checkout} />
          <PageSample label="Shipping" items={result.pageSamples.shipping} />
          <PageSample label="Returns" items={result.pageSamples.returns} />
          <PageSample label="Contact" items={result.pageSamples.contact} />
        </section>
      </div>

      <section className="card">
        <div className="card-header">
          <h3>Scanned page evidence</h3>
          <span>Safe GET only, no form submission</span>
        </div>
        <div className="page-evidence-list">
          {result.pagesScanned.map((page) => (
            <article className="page-evidence" key={`${page.role}-${page.url}`}>
              <div>
                <strong>{page.role}</strong>
                <a href={page.url} target="_blank">{page.url}</a>
                {!page.fetched && <p>{page.error}</p>}
              </div>
              <div className="signal-chips">
                <SignalChip active={page.signals.hasProductSchema} label="Product schema" />
                <SignalChip active={page.signals.hasOfferSchema} label="Offer" />
                <SignalChip active={page.signals.hasPrice} label="Price" />
                <SignalChip active={page.signals.hasAvailability} label="Stock" />
                <SignalChip active={page.signals.hasPaymentSignal} label="Payment" />
              </div>
            </article>
          ))}
        </div>
      </section>

      <PluginValueBlock result={result} />
    </section>
  );
}

function Score({ score }: { score: number }) {
  return (
    <div className="score">
      <Gauge size={22} />
      <strong>{score.toFixed(1)}</strong>
      <span>/10</span>
    </div>
  );
}

function Summary({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="summary-item">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function RatioMetric({ label, value, total }: { label: string; value: number; total: number }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="ratio-metric">
      <span>{label}</span>
      <strong>{value}/{total}</strong>
      <meter min={0} max={100} value={pct} />
    </div>
  );
}

function Insight({ title, items, good = false }: { title: string; items: string[]; good?: boolean }) {
  return (
    <section className={`card insight ${good ? "good" : ""}`}>
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{good ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}{item}</li>
        ))}
      </ul>
    </section>
  );
}

function SeverityIcon({ severity }: { severity: string }) {
  return (
    <span className={`severity ${severity}`}>
      {severity === "critical" ? <XCircle size={18} /> : <AlertTriangle size={18} />}
    </span>
  );
}

function PageSample({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="page-sample">
      <strong>{label}</strong>
      {items.length === 0 ? <span>Not found</span> : items.slice(0, 3).map((item) => <a key={item} href={item} target="_blank">{new URL(item).pathname || "/"}</a>)}
    </div>
  );
}

function SignalChip({ active, label }: { active: boolean; label: string }) {
  return <span className={`signal-chip ${active ? "active" : ""}`}>{label}</span>;
}

function PluginValueBlock({ result }: { result: ScanResult }) {
  const missingLayers = result.readinessLayers.filter((layer) => layer.status !== "strong");
  const liftText = missingLayers.length > 0
    ? missingLayers.map((layer) => `${layer.title}: ${layer.estimatedLift}`).slice(0, 3).join(" · ")
    : "This store is already strong; the plugin keeps it monitored as products and checkout settings change.";

  return (
    <section className="plugin-value">
      <div className="plugin-value-copy">
        <span className="eyebrow">Readystore AI plugin</span>
        <h2>Add the AI readiness layer your store is missing.</h2>
        <p>
          Your product pages may already be readable, but AI shopping assistants also need trust,
          policy, payment, freshness, and discovery signals before they can recommend a store with confidence.
        </p>
        <p>
          The plugin fixes the gaps this scan found, then keeps watching the store so new products,
          price changes, payment updates, and policy changes do not quietly break AI readiness again.
        </p>
        <div className="value-actions">
          <button type="button" onClick={scrollToReportCapture}>Join waitlist and get PDF report <Mail size={17} /></button>
          <span>Estimated readiness lift: {liftText}</span>
        </div>
      </div>

      <div className="value-grid">
        <ValueCard
          icon={<Layers3 size={20} />}
          title="Create an AI storefront layer"
          text="Publish llms.txt, store profile, product feed, policy links, and checkout context in a clean machine-readable format."
          outcome="AI can find and understand the store beyond regular product pages."
        />
        <ValueCard
          icon={<Wrench size={20} />}
          title="Fix what merchants do not usually see"
          text="Repair schema gaps, expose shipping and return metadata, summarize local payment context, and catch price/stock inconsistencies."
          outcome="Fewer silent reasons for AI assistants to skip or mistrust the store."
        />
        <ValueCard
          icon={<TrendingUp size={20} />}
          title="Track the before and after"
          text="Monitor score changes, fixed issues, product coverage, feed health, crawler access, and later AI-assisted traffic or checkout handoffs."
          outcome="A clear story of what improved after the plugin was installed."
        />
      </div>

      <div className="lost-opportunity">
        <AlertTriangle size={19} />
        <p>
          Without this layer, the store may still sell to humans, but AI shoppers can miss delivery terms,
          return confidence, payment context, or fresh product data. In comparison-style shopping, unclear stores
          are easier to leave out.
        </p>
      </div>
    </section>
  );
}

function scrollToReportCapture() {
  document.getElementById("report-capture")?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function ValueCard({ icon, title, text, outcome }: { icon: React.ReactNode; title: string; text: string; outcome: string }) {
  return (
    <article className="value-card">
      <div className="value-icon">{icon}</div>
      <strong>{title}</strong>
      <p>{text}</p>
      <span>{outcome}</span>
    </article>
  );
}

function paymentLabel(level: ScanResult["paymentVisibility"]["level"]): string {
  return {
    confirmed_provider: "Confirmed provider",
    generic_payment_visible: "Generic payment visible",
    not_visible: "Not visible",
  }[level];
}

function labelize(key: string): string {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
}
