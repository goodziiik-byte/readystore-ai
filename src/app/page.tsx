"use client";

import type { ScanResult } from "@/lib/scanner/types";
import { defaultLocale, getDictionary, localeLabels, localeMarkets, locales, type Dictionary, type Locale } from "@/lib/i18n";
import { aiVisibilityLabel, displayEffort, displayImpact, displayOwner, displayPaymentLevel, displayPluginFix, displayStatus, localizeScanResult, pageRoleLabel, scoreBreakdownLabel } from "@/lib/report-localization";
import { AlertTriangle, ArrowRight, Bot, CheckCircle2, CreditCard, Eye, FileSearch, Gauge, Globe2, Layers3, Link2, Loader2, LockKeyhole, Mail, Search, ShieldCheck, ShoppingCart, Sparkles, Store, TrendingUp, Wrench, XCircle } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

const examples = ["casanativa.mx", "ashaskin.in", "baliminigoods.id"];
const paymentLogoByName: Record<string, string> = {
  "Mercado Pago": "/payment-logos/mercado-pago.png",
  Xendit: "/payment-logos/xendit.png",
  Midtrans: "/payment-logos/midtrans.png",
  Razorpay: "/payment-logos/razorpay.png",
  PayMongo: "/payment-logos/paymongo.png",
  VNPay: "/payment-logos/vnpay.png",
  MoMo: "/payment-logos/momo.png",
  Omise: "/payment-logos/omise.png",
  Paystack: "/payment-logos/paystack.png",
  Flutterwave: "/payment-logos/flutterwave.png",
};

export default function HomePage() {
  return <ReadystorePage locale={defaultLocale} />;
}

export function ReadystorePage({ locale }: { locale: Locale }) {
  const copy = getDictionary(locale);
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
        body: JSON.stringify({ url, locale }),
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
      <Header copy={copy} locale={locale} />

      <section className="scanner-panel hero-panel">
        <div className="hero-content">
          <div className="scanner-copy">
            <span className="eyebrow">{copy.hero.eyebrow}</span>
            <h1>{copy.hero.title}</h1>
            <p>{copy.hero.body}</p>
          </div>

          <div className="hero-stats">
            {copy.hero.stats.map((stat) => <StatCard key={stat.label} value={stat.value} label={stat.label} />)}
          </div>

          <form className="scan-form" onSubmit={submit}>
            <Search size={20} />
            <input value={url} onChange={(event) => setUrl(event.target.value)} aria-label={copy.hero.inputLabel} />
            <button disabled={loading}>
              {loading ? <Loader2 className="spin" size={18} /> : <ArrowRight size={18} />}
              {loading ? copy.hero.scanning : copy.hero.scanButton}
            </button>
          </form>
          <div className="example-row">
            {examples.map((example) => (
              <button key={example} onClick={() => setUrl(`https://${example}`)}>{example}</button>
            ))}
          </div>
          <p className="source-note">{copy.hero.source}</p>
          <div className="trust-strip">
            <span><ShieldCheck size={15} /> {copy.hero.trust[0]}</span>
            <span><LockKeyhole size={15} /> {copy.hero.trust[1]}</span>
            <span><Eye size={15} /> {copy.hero.trust[2]}</span>
          </div>
        </div>

        <HeroPreview loading={loading} copy={copy} />
      </section>

      {error && (
        <section className="message error">
          <XCircle size={18} />
          {error}
        </section>
      )}

      {!result && <MarketingSections copy={copy} />}

      {result && <Report result={result} copy={copy} locale={locale} />}

      <SiteFooter copy={copy} locale={locale} />
    </main>
  );
}

function Header({ copy, locale }: { copy: Dictionary; locale: Locale }) {
  return (
    <header className="site-header">
      <div className="brand-lockup">
        <div className="brand-mark">
          <Sparkles size={18} />
        </div>
        <div>
          <strong>Readystore AI</strong>
          <span>{copy.brand.tagline}</span>
        </div>
      </div>
      <nav className="site-nav" aria-label="Main navigation">
        <a href="#how-it-works">{copy.nav.howItWorks}</a>
        <a href="#readiness-layer">{copy.nav.plugin}</a>
        <a href="mailto:hello@readystoreai.com">{copy.nav.contact}</a>
        <LocaleSwitcher locale={locale} />
      </nav>
    </header>
  );
}

function LocaleSwitcher({ locale }: { locale: Locale }) {
  return (
    <div className="locale-switcher" aria-label="Language switcher">
      {locales.map((item) => (
        <a className={item === locale ? "active" : ""} href={item === defaultLocale ? "/" : `/${item}`} key={item}>
          {localeLabels[item]}
        </a>
      ))}
    </div>
  );
}

function HeroPreview({ loading, copy }: { loading: boolean; copy: Dictionary }) {
  return (
    <aside className="hero-preview" aria-label={copy.preview.aria}>
      <div className="preview-topline">
        <span>{copy.preview.topline}</span>
        <strong>{loading ? copy.preview.scanning : copy.preview.before}</strong>
      </div>
      <div className="preview-score">
        <div>
          <span>{copy.preview.score}</span>
          <strong>6.4</strong>
        </div>
        <meter min={0} max={10} value={6.4} />
      </div>
      <div className="preview-path">
        <PreviewStep icon={<Store size={16} />} title={copy.preview.steps[0].title} status={copy.preview.steps[0].status} tone="good" />
        <PreviewStep icon={<ShieldCheck size={16} />} title={copy.preview.steps[1].title} status={copy.preview.steps[1].status} tone="warn" />
        <PreviewStep icon={<CreditCard size={16} />} title={copy.preview.steps[2].title} status={copy.preview.steps[2].status} tone="mid" />
        <PreviewStep icon={<Globe2 size={16} />} title={copy.preview.steps[3].title} status={copy.preview.steps[3].status} tone="warn" />
      </div>
      <div className="preview-outcome">
        <TrendingUp size={17} />
        <p>{copy.preview.outcome}</p>
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

function MarketingSections({ copy }: { copy: Dictionary }) {
  return (
    <section className="marketing-stack">
      <MarketShift copy={copy} />
      <AIShopperSimulation copy={copy} />
      <WooGap copy={copy} />
      <ScanMethod copy={copy} />
      <SafetyScan copy={copy} />
      <PaymentRails copy={copy} />
      <ReadinessLayer copy={copy} />
      <BeforeAfterLayer copy={copy} />
      <DesignPartners copy={copy} />
    </section>
  );
}

function MarketShift({ copy }: { copy: Dictionary }) {
  return (
    <section className="marketing-section market-shift">
      <div className="section-copy">
        <span className="eyebrow">{copy.marketing.shift.eyebrow}</span>
        <h2>{copy.marketing.shift.title}</h2>
        <p>{copy.marketing.shift.body}</p>
      </div>
      <div className="flow-strip" aria-label="AI shopping journey">
        <FlowNode icon={<Search size={17} />} title={copy.marketing.shift.flow[0]} />
        <FlowNode icon={<Bot size={17} />} title={copy.marketing.shift.flow[1]} />
        <FlowNode icon={<FileSearch size={17} />} title={copy.marketing.shift.flow[2]} />
        <FlowNode icon={<Store size={17} />} title={copy.marketing.shift.flow[3]} />
        <FlowNode icon={<CreditCard size={17} />} title={copy.marketing.shift.flow[4]} />
      </div>
    </section>
  );
}

function WooGap({ copy }: { copy: Dictionary }) {
  return (
    <section className="marketing-section woo-gap">
      <div className="section-copy">
        <span className="eyebrow">{copy.marketing.gap.eyebrow}</span>
        <h2>{copy.marketing.gap.title}</h2>
        <p>{copy.marketing.gap.body}</p>
      </div>
      <div className="comparison-grid">
        <SignalColumn title={copy.marketing.gap.humanTitle} items={copy.marketing.gap.humanItems} />
        <SignalColumn highlighted title={copy.marketing.gap.aiTitle} items={copy.marketing.gap.aiItems} />
      </div>
    </section>
  );
}

function AIShopperSimulation({ copy }: { copy: Dictionary }) {
  return (
    <section className="marketing-section ai-simulation">
      <div className="section-copy">
        <h2>{copy.marketing.simulation.title}</h2>
        <p>{copy.marketing.simulation.body}</p>
      </div>
      <AIRequestVideo />
    </section>
  );
}

function AIRequestVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const restartTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.muted = true;
    video.defaultPlaybackRate = 0.83;
    video.playbackRate = 0.83;

    const restart = () => {
      if (restartTimerRef.current) {
        window.clearTimeout(restartTimerRef.current);
      }

      restartTimerRef.current = window.setTimeout(() => {
        video.currentTime = 0;
        video.play().catch(() => undefined);
      }, 2500);
    };

    video.addEventListener("ended", restart);
    video.play().catch(() => undefined);

    return () => {
      video.removeEventListener("ended", restart);

      if (restartTimerRef.current) {
        window.clearTimeout(restartTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="ai-video-frame" aria-label="AI shopping request video">
      <video ref={videoRef} src="/videos/site-animation.mp4" autoPlay muted playsInline preload="metadata" />
    </div>
  );
}

function ScanMethod({ copy }: { copy: Dictionary }) {
  return (
    <section className="marketing-section scan-method" id="how-it-works">
      <div className="section-copy">
        <span className="eyebrow">{copy.marketing.diagnosis.eyebrow}</span>
        <h2>{copy.marketing.diagnosis.title}</h2>
        <p>{copy.marketing.diagnosis.body}</p>
      </div>
      <div className="method-grid">
        {copy.marketing.diagnosis.cards.map((card) => (
          <MethodCard key={card.step} step={card.step} title={card.title} text={card.text} />
        ))}
      </div>
    </section>
  );
}

function SafetyScan({ copy }: { copy: Dictionary }) {
  return (
    <section className="marketing-section safety-section">
      <div className="section-copy">
        <span className="eyebrow">{copy.marketing.safety.eyebrow}</span>
        <h2>{copy.marketing.safety.title}</h2>
        <p>{copy.marketing.safety.body}</p>
      </div>
      <div className="safety-grid">
        <SafetyColumn tone="scan" icon={<ShieldCheck size={20} />} title={copy.marketing.safety.scanTitle} items={copy.marketing.safety.scanItems} />
        <SafetyColumn tone="never" icon={<LockKeyhole size={20} />} title={copy.marketing.safety.neverTitle} items={copy.marketing.safety.neverItems} />
      </div>
    </section>
  );
}

function SafetyColumn({ tone, icon, title, items }: { tone: "scan" | "never"; icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <article className={`safety-column ${tone}`}>
      <div>
        <span>{icon}</span>
        <strong>{title}</strong>
      </div>
      <ul>
        {items.map((item) => (
          <li key={item}>
            {tone === "scan" ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

function PaymentRails({ copy }: { copy: Dictionary }) {
  return (
    <section className="marketing-section payment-rails">
      <div className="section-copy">
        <span className="eyebrow">{copy.marketing.payments.eyebrow}</span>
        <h2>{copy.marketing.payments.title}</h2>
        <p>{copy.marketing.payments.body}</p>
      </div>
      <div className="payment-badge-grid">
        {copy.marketing.payments.badges.map((badge, index) => (
          <div className="payment-badge" key={badge}>
            <div className="payment-logo-frame">
              <img src={paymentLogoByName[badge]} alt={`${badge} logo`} />
            </div>
            <strong>{badge}</strong>
            <em>{index < 3 ? "Live market" : "Target market"}</em>
          </div>
        ))}
      </div>
    </section>
  );
}

function ReadinessLayer({ copy }: { copy: Dictionary }) {
  return (
    <section className="marketing-section layer-section" id="readiness-layer">
      <div className="section-copy">
        <span className="eyebrow">{copy.marketing.layer.eyebrow}</span>
        <h2>{copy.marketing.layer.title}</h2>
        <p>{copy.marketing.layer.body}</p>
      </div>
      <div className="layer-diagram">
        <DiagramBlock icon={<Store size={18} />} title={copy.marketing.layer.diagram[0]} />
        <ArrowRight size={20} />
        <DiagramBlock active icon={<Layers3 size={18} />} title={copy.marketing.layer.diagram[1]} />
        <ArrowRight size={20} />
        <DiagramBlock icon={<Bot size={18} />} title={copy.marketing.layer.diagram[2]} />
      </div>
      <div className="mini-feature-grid">
        {copy.marketing.layer.features.map((feature) => (
          <MiniFeature key={feature.title} title={feature.title} text={feature.text} />
        ))}
      </div>
    </section>
  );
}

function BeforeAfterLayer({ copy }: { copy: Dictionary }) {
  return (
    <section className="marketing-section before-after-section">
      <div className="section-copy">
        <span className="eyebrow">{copy.marketing.beforeAfter.eyebrow}</span>
        <h2>{copy.marketing.beforeAfter.title}</h2>
        <p>{copy.marketing.beforeAfter.body}</p>
      </div>
      <div className="before-after-grid">
        <SignalColumn title={copy.marketing.beforeAfter.beforeTitle} items={copy.marketing.beforeAfter.beforeItems} />
        <SignalColumn highlighted title={copy.marketing.beforeAfter.afterTitle} items={copy.marketing.beforeAfter.afterItems} />
      </div>
    </section>
  );
}

function DesignPartners({ copy }: { copy: Dictionary }) {
  return (
    <section className="marketing-section design-partners">
      <div className="section-copy">
        <span className="eyebrow">{copy.marketing.partners.eyebrow}</span>
        <h2>{copy.marketing.partners.title}</h2>
        <p>{copy.marketing.partners.body}</p>
      </div>
      <div className="partner-card-grid">
        {copy.marketing.partners.cards.map((card, index) => (
          <article className="partner-card" key={card.title}>
            <span>0{index + 1}</span>
            <strong>{card.title}</strong>
            <p>{card.text}</p>
          </article>
        ))}
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

function Report({ result, copy, locale }: { result: ScanResult; copy: Dictionary; locale: Locale }) {
  const report = localizeScanResult(result, locale);
  const status = report.score >= 8.5
    ? copy.report.statuses.ready
    : report.score >= 7
      ? copy.report.statuses.mostly
      : report.score >= 5
        ? copy.report.statuses.needs
        : copy.report.statuses.critical;
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
        body: JSON.stringify({ email, result, locale, market: localeMarkets[locale], source: `scanner_report_${locale}` }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error?.message ?? "Unable to send report.");
      }

      setReportStatus("sent");
      setReportMessage(copy.report.capture.sent);
    } catch (error) {
      setReportStatus("error");
      setReportMessage(error instanceof Error ? error.message : copy.report.capture.fallbackError);
    }
  }

  return (
    <section className="report-stack">
      <div className="report-hero">
        <Score score={report.score} />
        <div>
          <span className="eyebrow">{copy.report.scanReport}</span>
          <h2>{status}</h2>
          <p><strong>{report.merchantSummary.headline}</strong></p>
          <p>{report.merchantSummary.body}</p>
          <p className="url-line">{report.finalUrl}</p>
        </div>
        <div className="summary-grid">
          <Summary icon={<Store size={18} />} label={copy.report.summary.woocommerce} value={report.platform.woocommerce ? copy.report.summary.confirmed : copy.report.summary.unconfirmed} />
          <Summary icon={<CreditCard size={18} />} label={copy.report.summary.payment} value={displayPaymentLevel(report.paymentVisibility.level, locale)} />
          <Summary icon={<Globe2 size={18} />} label={copy.report.summary.jsonLd} value={`${report.structuredData.jsonLdCount} ${copy.report.summary.blocks}`} />
        </div>
      </div>

      <section className="report-capture" id="report-capture">
        <div>
          <span className="eyebrow">{copy.report.capture.eyebrow}</span>
          <h2>{copy.report.capture.title}</h2>
          <p>{copy.report.capture.body}</p>
        </div>
        <div className="report-capture-form">
          <form className="report-form" onSubmit={requestReport}>
            <Mail size={18} />
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={copy.report.capture.placeholder}
              aria-label={copy.report.capture.label}
              type="email"
              required
            />
            <button disabled={reportStatus === "sending"}>
              {reportStatus === "sending" ? <Loader2 className="spin" size={17} /> : <ArrowRight size={17} />}
              {reportStatus === "sending" ? copy.report.capture.sending : copy.report.capture.button}
            </button>
          </form>
          <p className="email-disclaimer">{copy.report.capture.disclaimer}</p>
          {reportMessage && <p className={`report-message ${reportStatus}`}>{reportMessage}</p>}
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <h3>{copy.report.productSummary}</h3>
          <span>{report.productSummary.scanned} {copy.report.inspected}</span>
        </div>
        <div className="product-summary-grid">
          <RatioMetric label={copy.report.ratios[0]} value={report.productSummary.withPrice} total={report.productSummary.scanned} />
          <RatioMetric label={copy.report.ratios[1]} value={report.productSummary.withAvailability} total={report.productSummary.scanned} />
          <RatioMetric label={copy.report.ratios[2]} value={report.productSummary.withProductSchema} total={report.productSummary.scanned} />
          <RatioMetric label={copy.report.ratios[3]} value={report.productSummary.withOfferSchema} total={report.productSummary.scanned} />
          <RatioMetric label={copy.report.ratios[4]} value={report.productSummary.withAddToCart} total={report.productSummary.scanned} />
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <h3>{copy.report.readinessLayers}</h3>
          <span>{copy.report.readinessSubtitle}</span>
        </div>
        <div className="layer-list">
          {report.readinessLayers.map((layer) => (
            <article className={`layer-row ${layer.status}`} key={layer.id}>
              <div>
                <strong>{layer.title}</strong>
                <p>{layer.whyItMatters}</p>
                <ul className="evidence-list">
                  {layer.evidence.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
              <div className="layer-meta">
                <span>{copy.report.status}: {displayStatus(layer.status, locale)}</span>
                <span>{copy.report.impact}: {displayImpact(layer.impact, locale)}</span>
                <span>{copy.report.pluginFix}: {displayPluginFix(layer.pluginCanFix, locale)}</span>
                <span>{copy.report.estLift}: {layer.estimatedLift}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <h3><CreditCard size={18} /> {copy.report.paymentVisibility}</h3>
          <span className={`payment-level ${report.paymentVisibility.level}`}>{displayPaymentLevel(report.paymentVisibility.level, locale)}</span>
        </div>
        <p>{report.paymentVisibility.label}</p>
        {report.paymentVisibility.evidence.length > 0 && (
          <ul className="evidence-list">
            {report.paymentVisibility.evidence.map((item) => <li key={item}>{item}</li>)}
          </ul>
        )}
      </section>

      <CheckoutReadinessBlock result={report} copy={copy} />

      <section className="card">
        <div className="card-header">
          <h3><Wrench size={18} /> {copy.report.fixesTitle}</h3>
          <span>{report.priorityFixes.length} {copy.report.priorityFixes}</span>
        </div>
        <div className="priority-list">
          {report.priorityFixes.map((fix) => (
            <article className="priority-row" key={fix.title}>
              <div>
                <strong>{fix.title}</strong>
                <p>{fix.reason}</p>
              </div>
              <div className="priority-meta">
                <span>{copy.report.impact}: {displayImpact(fix.impact, locale)}</span>
                <span>{copy.report.effort}: {displayEffort(fix.effort, locale)}</span>
                <span>{copy.report.owner}: {displayOwner(fix.owner, locale)}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="two-col">
        <Insight title={copy.report.aiCan} items={report.aiCanUnderstand} good />
        <Insight title={copy.report.aiMiss} items={report.aiMayMiss} />
      </div>

      <section className="card">
        <div className="card-header">
          <h3><Eye size={18} /> {copy.report.seesTitle}</h3>
          <span>{report.pagesScanned.filter((page) => page.fetched).length} {copy.report.pagesScanned}</span>
        </div>
        <div className="visibility-grid">
          {Object.entries(report.aiVisibility).map(([key, value]) => (
            <div className={`visibility ${value}`} key={key}>
              <span>{aiVisibilityLabel(key, locale)}</span>
              <strong>{displayStatus(value, locale)}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <h3>{copy.report.issuesTitle}</h3>
          <span>{report.issues.length} {copy.report.found}</span>
        </div>
        <div className="issue-list">
          {report.issues.map((issue) => (
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
                {issue.canPluginFix ? copy.report.pluginCanHelp : copy.report.manual}
              </span>
            </article>
          ))}
        </div>
      </section>

      <div className="two-col">
        <section className="card">
          <h3>{copy.report.scoreBreakdown}</h3>
          <div className="breakdown">
            {Object.entries(report.scoreBreakdown).map(([key, value]) => (
              <div key={key}>
                <span>{scoreBreakdownLabel(key, locale)}</span>
                <meter min={0} max={10} value={value} />
                <strong>{value}/10</strong>
              </div>
            ))}
          </div>
        </section>
        <section className="card">
          <h3>{copy.report.discoveredPages}</h3>
          <PageSample label={copy.report.pageLabels[0]} items={report.pageSamples.products} copy={copy} />
          <PageSample label={copy.report.pageLabels[1]} items={report.pageSamples.checkout} copy={copy} />
          <PageSample label={copy.report.pageLabels[2]} items={report.pageSamples.shipping} copy={copy} />
          <PageSample label={copy.report.pageLabels[3]} items={report.pageSamples.returns} copy={copy} />
          <PageSample label={copy.report.pageLabels[4]} items={report.pageSamples.contact} copy={copy} />
        </section>
      </div>

      <section className="card">
        <div className="card-header">
          <h3>{copy.report.evidenceTitle}</h3>
          <span>{copy.report.evidenceSubtitle}</span>
        </div>
        <div className="page-evidence-list">
          {report.pagesScanned.map((page) => (
            <article className="page-evidence" key={`${page.role}-${page.url}`}>
              <div>
                <strong>{pageRoleLabel(page.role, locale)}</strong>
                <a href={page.url} target="_blank">{page.url}</a>
                {!page.fetched && <p>{page.error}</p>}
              </div>
              <div className="signal-chips">
                <SignalChip active={page.signals.hasProductSchema} label={copy.report.signals[0]} />
                <SignalChip active={page.signals.hasOfferSchema} label={copy.report.signals[1]} />
                <SignalChip active={page.signals.hasPrice} label={copy.report.signals[2]} />
                <SignalChip active={page.signals.hasAvailability} label={copy.report.signals[3]} />
                <SignalChip active={page.signals.hasPaymentSignal} label={copy.report.signals[4]} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <PluginValueBlock result={report} copy={copy} />
    </section>
  );
}

function CheckoutReadinessBlock({ result, copy }: { result: ScanResult; copy: Dictionary }) {
  return (
    <section className="card checkout-readiness-card">
      <div className="card-header">
        <h3><ShoppingCart size={18} /> {copy.report.checkoutReadiness}</h3>
        <span className={`checkout-status ${result.checkoutReadiness.status}`}>
          {copy.report.checkoutLabels[result.checkoutReadiness.status]}
        </span>
      </div>
      <p className="checkout-summary">{result.checkoutReadiness.summary}</p>
      <span className="checkout-subtitle">{copy.report.checkoutSubtitle}</span>
      <div className="checkout-check-grid">
        {result.checkoutReadiness.checks.map((check) => (
          <article className={`checkout-check ${check.status}`} key={check.id}>
            <div>
              <CheckoutCheckIcon status={check.status} />
              <strong>{check.label}</strong>
            </div>
            <span>{copy.report.checkoutLabels[check.status]}</span>
            <p>{check.explanation}</p>
            {check.evidence.length > 0 && (
              <ul className="evidence-list">
                {check.evidence.slice(0, 2).map((item) => <li key={item}>{item}</li>)}
              </ul>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function CheckoutCheckIcon({ status }: { status: ScanResult["checkoutReadiness"]["checks"][number]["status"] }) {
  if (status === "ready") {
    return <CheckCircle2 size={17} />;
  }

  if (status === "requires_plugin") {
    return <Link2 size={17} />;
  }

  return <AlertTriangle size={17} />;
}

function Score({ score }: { score: number }) {
  const tone = score >= 8 ? "good" : score >= 6 ? "warn" : "bad";

  return (
    <div className={`score ${tone}`}>
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

function PageSample({ label, items, copy }: { label: string; items: string[]; copy: Dictionary }) {
  return (
    <div className="page-sample">
      <strong>{label}</strong>
      {items.length === 0 ? <span>{copy.report.notFound}</span> : items.slice(0, 3).map((item) => <a key={item} href={item} target="_blank">{new URL(item).pathname || "/"}</a>)}
    </div>
  );
}

function SignalChip({ active, label }: { active: boolean; label: string }) {
  return <span className={`signal-chip ${active ? "active" : ""}`}>{label}</span>;
}

function PluginValueBlock({ result, copy }: { result: ScanResult; copy: Dictionary }) {
  const missingLayers = result.readinessLayers.filter((layer) => layer.status !== "strong");
  const liftText = missingLayers.length > 0
    ? missingLayers.map((layer) => `${layer.title}: ${layer.estimatedLift}`).slice(0, 3).join(" · ")
    : copy.pluginValue.strongLift;

  return (
    <section className="plugin-value">
      <div className="plugin-value-copy">
        <span className="eyebrow">{copy.pluginValue.eyebrow}</span>
        <h2>{copy.pluginValue.title}</h2>
        <p>{copy.pluginValue.body1}</p>
        <p>{copy.pluginValue.body2}</p>
        <div className="value-actions">
          <button type="button" onClick={scrollToReportCapture}>{copy.pluginValue.cta} <Mail size={17} /></button>
          <span>{copy.pluginValue.liftPrefix} {liftText}</span>
        </div>
      </div>

      <div className="value-grid">
        {copy.pluginValue.cards.map((card, index) => (
          <ValueCard
            icon={[<Layers3 size={20} key="layers" />, <ShoppingCart size={20} key="cart" />, <Wrench size={20} key="wrench" />, <TrendingUp size={20} key="trend" />][index] ?? <Sparkles size={20} />}
            title={card.title}
            text={card.text}
            outcome={card.outcome}
            key={card.title}
          />
        ))}
      </div>

      <div className="lost-opportunity">
        <AlertTriangle size={19} />
        <p>{copy.pluginValue.lost}</p>
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

function SiteFooter({ copy, locale }: { copy: Dictionary; locale: Locale }) {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <div className="brand-mark footer-mark">
          <Sparkles size={16} />
        </div>
        <div>
          <strong>Readystore AI</strong>
          <span>{copy.footer.builtBy}</span>
        </div>
      </div>
      <div className="footer-copy">
        <p>{copy.footer.body}</p>
        <a href="mailto:hello@readystoreai.com">hello@readystoreai.com</a>
      </div>
      <div className="footer-links">
        <a href={locale === defaultLocale ? "/privacy" : `/${locale}/privacy`}>{copy.footer.privacy}</a>
        <a href={locale === defaultLocale ? "/terms" : `/${locale}/terms`}>{copy.footer.terms}</a>
        <span>&copy; 2026 Readystore Labs. {copy.footer.rights}</span>
      </div>
    </footer>
  );
}
