import { CheckCircle2, MinusCircle, XCircle } from "lucide-react"
import type { LayerState } from "@/lib/report-data"

export const STATE = {
  pass: {
    icon: CheckCircle2,
    label: "Ready",
    text: "text-success",
    badge: "bg-success/10 text-success",
    ring: "border-success/30",
    tint: "bg-success/[0.06]",
    bar: "bg-success",
  },
  partial: {
    icon: MinusCircle,
    label: "Partial",
    text: "text-warning",
    badge: "bg-warning/10 text-warning",
    ring: "border-warning/30",
    tint: "bg-warning/[0.07]",
    bar: "bg-warning",
  },
  fail: {
    icon: XCircle,
    label: "Missing",
    text: "text-destructive",
    badge: "bg-destructive/10 text-destructive",
    ring: "border-destructive/30",
    tint: "bg-destructive/[0.05]",
    bar: "bg-destructive",
  },
} as const

export function StatusBadge({ state, label }: { state: LayerState; label?: string }) {
  const s = STATE[state]
  const Icon = s.icon
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${s.badge}`}
    >
      <Icon className="size-3.5" />
      {label ?? s.label}
    </span>
  )
}

export function SectionCard({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={`rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6 ${className}`}
    >
      {children}
    </section>
  )
}

export function SectionHeading({
  title,
  meta,
}: {
  title: string
  meta?: string
}) {
  return (
    <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {meta && <span className="text-xs font-medium text-muted-foreground">{meta}</span>}
    </div>
  )
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-border bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
      {children}
    </span>
  )
}
