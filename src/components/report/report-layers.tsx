import { report } from "@/lib/report-data"
import type { ReportModel } from "@/lib/report-model"
import { SectionCard, SectionHeading, StatusBadge, Tag, STATE } from "@/components/report/ui"
import { ArrowRight, CreditCard, Wrench } from "lucide-react"

export function ProductSummary({ report: data = report }: { report?: ReportModel }) {
  return (
    <SectionCard>
      <SectionHeading title="Product page summary" meta={`${data.productSummary.pages} product pages inspected`} />
      <div className="grid gap-4 sm:grid-cols-2">
        {data.productSummary.metrics.map((m) => {
          const pct = (m.score / m.max) * 100
          const tone = pct >= 90 ? STATE.pass : pct >= 60 ? STATE.partial : STATE.fail
          return (
            <div key={m.label}>
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-muted-foreground">{m.label}</span>
                <span className="font-medium tabular-nums">
                  {m.score}/{m.max}
                </span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className={`h-full rounded-full ${tone.bar}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </SectionCard>
  )
}

export function ReadinessLayers({ report: data = report }: { report?: ReportModel }) {
  return (
    <SectionCard>
      <SectionHeading title="Readiness layers" meta="What is strong and what still blocks AI confidence" />
      <div className="space-y-3">
        {data.layers.map((layer) => {
          const s = STATE[layer.state]
          return (
            <div key={layer.id} className={`rounded-xl border ${s.ring} ${s.tint} p-4`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-medium">{layer.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Impact: {layer.impact}</span>
                  <StatusBadge state={layer.state} />
                </div>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground text-pretty">
                {layer.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {layer.tags.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </SectionCard>
  )
}

export function PaymentVisibility({ report: data = report }: { report?: ReportModel }) {
  const state = data.highlights.find((item) => item.label === "Payment provider")?.state ?? "partial"
  const description =
    state === "fail"
      ? "Payment context was not clearly visible on public pages."
      : "Payment context is visible on-site, but AI checkout handoff still requires a controlled plugin layer."

  return (
    <SectionCard>
      <SectionHeading title="Payment visibility" />
      <div className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border ${STATE[state].ring} ${STATE[state].tint} p-4`}>
        <div className="flex items-center gap-3">
          <span className={`flex size-10 items-center justify-center rounded-lg ${STATE[state].badge}`}>
            <CreditCard className="size-5" />
          </span>
          <div>
            <p className="text-sm font-medium">Provider signal: {data.store.paymentProvider}</p>
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
        <StatusBadge state={state} label={data.store.paymentProvider} />
      </div>
    </SectionCard>
  )
}

export function CheckoutCheck({ report: data = report }: { report?: ReportModel }) {
  const { checkout } = data
  return (
    <SectionCard>
      <SectionHeading title="AI checkout check" />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground text-pretty">
          {checkout.summary} Can a customer be guided from product to paid checkout?
        </p>
        <StatusBadge state={checkout.state} label="Partially ready" />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {checkout.steps.map((step, i) => {
          const s = STATE[step.state]
          const Icon = s.icon
          return (
            <div key={step.title} className="relative rounded-xl border border-border bg-background p-4">
              <div className="flex items-center gap-2">
                <Icon className={`size-4 ${s.text}`} />
                <span className="text-sm font-medium">{step.title}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              <p className="mt-3 text-xs font-medium text-muted-foreground">{step.meta}</p>
              {i < checkout.steps.length - 1 && (
                <ArrowRight className="absolute -right-2.5 top-1/2 hidden size-4 -translate-y-1/2 text-border sm:block" />
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {checkout.signals.map((sig) => {
          const s = STATE[sig.state]
          return (
            <div key={sig.title} className={`rounded-xl border ${s.ring} ${s.tint} p-4`}>
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-medium">{sig.title}</span>
                <StatusBadge state={sig.state} />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{sig.body}</p>
              <p className="mt-3 text-xs font-medium text-muted-foreground">{sig.meta}</p>
            </div>
          )
        })}
      </div>
    </SectionCard>
  )
}

export function PriorityFixes({ report: data = report }: { report?: ReportModel }) {
  return (
    <SectionCard>
      <SectionHeading title="Fix these first" meta={`${data.priorityFixes.length} priority fixes`} />
      <ol className="space-y-3">
        {data.priorityFixes.map((fix, i) => (
          <li key={fix.title} className="flex gap-4 rounded-xl border border-border bg-background p-4">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-semibold text-navy-foreground">
              {i + 1}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Wrench className="size-4 text-primary" />
                <h3 className="font-medium">{fix.title}</h3>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground text-pretty">{fix.body}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Tag>Impact: {fix.impact}</Tag>
                <Tag>Effort: {fix.effort}</Tag>
                <Tag>Layer: {fix.layer}</Tag>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </SectionCard>
  )
}
