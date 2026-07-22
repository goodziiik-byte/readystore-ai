import type { Metadata } from "next"
import { ScanProvider } from "@/components/scan-context"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { defaultLocale } from "@/lib/i18n"
import { ArrowRight, CheckCircle2, Download, ExternalLink, LockKeyhole, ScanLine, ShieldCheck } from "lucide-react"

export const metadata: Metadata = {
  title: "Readystore AI Scanner for WooCommerce | WordPress Plugin",
  description:
    "Download the Readystore AI Scanner for WooCommerce. Check product, policy, checkout, payment, and llms.txt readiness for AI shopping assistants.",
  alternates: {
    canonical: "/wordpress-plugin",
  },
  openGraph: {
    title: "Readystore AI Scanner for WooCommerce",
    description:
      "A lightweight WooCommerce admin scanner for AI shopping readiness, public store trust signals, checkout path, payment context, and llms.txt.",
    url: "/wordpress-plugin",
  },
}

const checks = [
  "WooCommerce status and product catalog signals",
  "Price, stock, image, and SKU coverage",
  "Shipping, return, privacy, and terms policy hints",
  "Cart and checkout page visibility",
  "Enabled WooCommerce payment gateway context",
  "llms.txt availability for AI discovery",
]

const safety = [
  "No login to Readystore AI required",
  "No checkout submission",
  "No payment data access",
  "No customer data storage",
  "No automatic product data transfer",
  "GPL licensed WordPress plugin",
]

const roadmap = [
  {
    title: "AI storefront layer",
    body: "Publish cleaner product, policy, payment, freshness, and discovery context for AI shopping assistants.",
  },
  {
    title: "Checkout handoff",
    body: "Prepare a safe cart or payment-link handoff so buyers can finish checkout on the merchant site.",
  },
  {
    title: "Readiness monitoring",
    body: "Track whether new products, policy changes, or payment updates quietly reduce AI shopping clarity.",
  },
]

export default function WordPressPluginPage() {
  return (
    <ScanProvider locale={defaultLocale}>
      <SiteHeader />
      <main>
        <section id="scan" className="relative scroll-mt-20 overflow-hidden bg-navy text-navy-foreground">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, var(--color-navy-foreground) 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />
          <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-navy-foreground/20 bg-navy-foreground/5 px-3 py-1 text-xs font-medium text-navy-foreground/80">
                <span className="size-1.5 rounded-full bg-lime" />
                WordPress plugin
              </span>
              <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
                Readystore AI Scanner for WooCommerce
              </h1>
              <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-navy-foreground/70 sm:text-lg">
                A lightweight WooCommerce admin scan that shows whether AI shopping assistants can understand your
                products, prices, stock, policies, checkout path, payment context, and AI discovery signals.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/downloads/readystore-ai-scanner.zip"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-lime px-5 text-sm font-medium text-lime-foreground transition-colors hover:bg-lime/90"
                  download
                >
                  <Download className="size-4" />
                  Download plugin ZIP
                </a>
                <a
                  href="/en"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-navy-foreground/20 bg-navy-foreground/5 px-5 text-sm font-medium text-navy-foreground transition-colors hover:bg-navy-foreground/10"
                >
                  Run public scanner
                  <ArrowRight className="size-4" />
                </a>
              </div>
              <p className="mt-4 flex items-center gap-2 text-xs text-navy-foreground/55">
                <ShieldCheck className="size-4 text-lime" />
                Public storefront checks only. No payment data. No checkout submission.
              </p>
            </div>

            <div className="rounded-2xl border border-navy-foreground/15 bg-navy-foreground/5 p-4 shadow-2xl shadow-black/10">
              <div className="rounded-xl border border-navy-foreground/10 bg-background text-foreground">
                <div className="flex h-12 items-center gap-2 border-b border-border px-4">
                  <span className="size-3 rounded-full bg-[#f2b8a5]" />
                  <span className="size-3 rounded-full bg-[#f3cf8f]" />
                  <span className="size-3 rounded-full bg-[#8ac6a4]" />
                  <span className="ml-3 text-xs text-muted-foreground">wp-admin / Readystore AI</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-navy text-lime">
                      <ScanLine className="size-5" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                        Local scan report
                      </p>
                      <h2 className="text-2xl font-semibold tracking-tight">Partly ready for AI shoppers</h2>
                    </div>
                  </div>
                  <div className="mt-6 grid gap-3">
                    {["Product catalog 8/10", "Trust and policies 7/10", "AI discovery 4/10", "Payment context 6/10"].map(
                      (item) => (
                        <div
                          key={item}
                          className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm"
                        >
                          <span>{item}</span>
                          <CheckCircle2 className="size-4 text-primary" />
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-background py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">What it checks</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  A scanner built for WooCommerce stores preparing for AI shopping.
                </h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                  The plugin gives merchants an in-admin readiness view, then links to the public Readystore AI report
                  for an outside-in scan.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {checks.map((item) => (
                  <div key={item} className="rounded-xl border border-border bg-card p-4">
                    <CheckCircle2 className="size-5 text-primary" />
                    <p className="mt-3 text-sm font-medium leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-secondary/40 py-16">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <LockKeyhole className="size-5 text-primary" />
                <h2 className="text-2xl font-semibold tracking-tight">Privacy and safety</h2>
              </div>
              <div className="mt-6 grid gap-3">
                {safety.map((item) => (
                  <div key={item} className="flex gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Roadmap</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">Where Readystore AI is going next</h2>
              <div className="mt-6 grid gap-4">
                {roadmap.map((item) => (
                  <div key={item.title} className="rounded-xl border border-border bg-background p-4">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-background py-16">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Download</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Install the scanner in a WooCommerce test store.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Upload the ZIP in WordPress admin, activate it, then open the Readystore AI menu to see the local scan.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="/downloads/readystore-ai-scanner.zip"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                download
              >
                <Download className="size-4" />
                Download ZIP
              </a>
              <a
                href="https://wordpress.org/plugins/developers/add/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-5 text-sm font-medium transition-colors hover:bg-muted"
              >
                WordPress.org submission
                <ExternalLink className="size-4" />
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </ScanProvider>
  )
}
