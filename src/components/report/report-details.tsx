import { report } from "@/lib/report-data"
import type { ReportModel } from "@/lib/report-model"
import { SectionCard, SectionHeading, Tag, STATE } from "@/components/report/ui"
import { AlertTriangle, Check, CheckCircle2, ExternalLink, ShieldQuestion, X } from "lucide-react"

export function Understanding({ report: data = report }: { report?: ReportModel }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <SectionCard>
        <SectionHeading title="AI can understand" />
        <ul className="space-y-2.5">
          {data.canUnderstand.map((item) => (
            <li key={item} className="flex gap-2.5 text-sm">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </SectionCard>
      <SectionCard>
        <SectionHeading title="AI may miss" />
        <ul className="space-y-2.5">
          {data.mayMiss.map((item) => (
            <li key={item} className="flex gap-2.5 text-sm">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  )
}

export function FieldGrid({ report: data = report }: { report?: ReportModel }) {
  return (
    <SectionCard>
      <SectionHeading title="How AI sees this store right now" meta={`${data.store.pagesAnalyzed} pages analyzed`} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {data.fields.map((f) => {
          const s = STATE[f.state]
          const Icon = f.state === "pass" ? Check : f.state === "partial" ? s.icon : X
          return (
            <div key={f.label} className={`rounded-xl border ${s.ring} ${s.tint} p-3`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {f.label}
                </span>
                <Icon className={`size-4 ${s.text}`} />
              </div>
              <p className={`mt-1 text-sm font-medium ${s.text}`}>{s.label}</p>
            </div>
          )
        })}
      </div>
    </SectionCard>
  )
}

export function TopIssues({ report: data = report }: { report?: ReportModel }) {
  return (
    <SectionCard>
      <SectionHeading title="Top issues" meta={`${data.topIssues.length} found`} />
      <ul className="space-y-3">
        {data.topIssues.map((issue) => (
          <li key={issue.title} className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-warning/30 bg-warning/[0.07] p-4">
            <div className="flex min-w-0 gap-3">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
              <div className="min-w-0">
                <h3 className="text-sm font-medium">{issue.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{issue.body}</p>
              </div>
            </div>
            <Tag>Plugin can help</Tag>
          </li>
        ))}
      </ul>
    </SectionCard>
  )
}

export function ScoreBreakdown({ report: data = report }: { report?: ReportModel }) {
  return (
    <SectionCard>
      <SectionHeading title="Score breakdown" />
      <div className="space-y-2.5">
        {data.scoreBreakdown.map((row) => {
          const pct = row.score * 10
          const tone = pct >= 80 ? STATE.pass : pct >= 50 ? STATE.partial : STATE.fail
          return (
            <div key={row.label} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 sm:grid-cols-[180px_1fr_auto]">
              <span className="text-sm text-muted-foreground">{row.label}</span>
              <div className="col-span-2 order-3 h-2 w-full overflow-hidden rounded-full bg-muted sm:order-none sm:col-span-1">
                <div className={`h-full rounded-full ${tone.bar}`} style={{ width: `${pct}%` }} />
              </div>
              <span className="text-sm font-medium tabular-nums">{row.score}/10</span>
            </div>
          )
        })}
      </div>
    </SectionCard>
  )
}

export function DiscoveredPages({ report: data = report }: { report?: ReportModel }) {
  return (
    <SectionCard>
      <SectionHeading title="Discovered pages" />
      <dl className="divide-y divide-border">
        {data.discoveredPages.map((page) => (
          <div key={page.label} className="flex items-center justify-between gap-4 py-2.5">
            <dt className="text-sm text-muted-foreground">{page.label}</dt>
            <dd className={`font-mono text-xs ${page.found ? "text-foreground" : "text-destructive"}`}>
              {page.found ? (
                page.path
              ) : (
                <span className="inline-flex items-center gap-1">
                  <X className="size-3.5" />
                  {page.path}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </SectionCard>
  )
}

export function Evidence({ report: data = report }: { report?: ReportModel }) {
  return (
    <SectionCard>
      <SectionHeading title="Scanned page evidence" meta="Safe GET only · no form submission" />
      <ul className="space-y-2">
        {data.evidence.map((e, i) => (
          <li key={`${e.url}-${i}`} className="rounded-xl border border-border bg-background p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                <ShieldQuestion className="size-3.5" />
                {e.type}
              </span>
              <span className="inline-flex min-w-0 items-center gap-1 truncate font-mono text-xs text-muted-foreground">
                <ExternalLink className="size-3 shrink-0" />
                <span className="truncate">{e.url}</span>
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {e.tags.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </SectionCard>
  )
}
