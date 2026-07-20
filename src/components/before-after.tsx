import { ArrowRight, Check, X } from "lucide-react"

const BEFORE = [
  "Product title and image only",
  "Prices sometimes readable",
  "Policies hidden in page text",
  "Payments unclear to AI",
  "No path to checkout",
]

const AFTER = [
  "Full products, variants & stock",
  "Prices and currency exposed",
  "Shipping & returns structured",
  "Local payment methods listed",
  "Clear, reachable checkout path",
]

export function BeforeAfter() {
  return (
    <section className="border-y border-border bg-navy py-16 text-navy-foreground sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-lime">The Readystore plugin</p>
          <h2 className="mt-2 text-balance text-2xl font-semibold tracking-tight sm:text-4xl">
            From partial context to a store AI fully understands
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-navy-foreground/70">
            Install the plugin and give assistants clean, structured context about everything that
            matters to a purchase.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 items-stretch gap-4 md:grid-cols-[1fr_auto_1fr]">
          <div className="rounded-2xl border border-navy-foreground/12 bg-navy-foreground/5 p-6">
            <span className="inline-block rounded-full bg-navy-foreground/10 px-3 py-1 text-xs font-medium text-navy-foreground/70">
              Before
            </span>
            <h3 className="mt-4 text-base font-semibold">AI sees partial store context</h3>
            <ul className="mt-4 space-y-3">
              {BEFORE.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-navy-foreground/65">
                  <X className="mt-0.5 size-4 shrink-0 text-destructive" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-center">
            <span className="flex size-10 items-center justify-center rounded-full bg-lime text-lime-foreground">
              <ArrowRight className="size-5" />
            </span>
          </div>

          <div className="rounded-2xl border border-lime/40 bg-lime/10 p-6">
            <span className="inline-block rounded-full bg-lime px-3 py-1 text-xs font-medium text-lime-foreground">
              After
            </span>
            <h3 className="mt-4 text-base font-semibold">
              AI sees products, policies, payments, freshness & checkout
            </h3>
            <ul className="mt-4 space-y-3">
              {AFTER.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-navy-foreground/90">
                  <Check className="mt-0.5 size-4 shrink-0 text-lime" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
