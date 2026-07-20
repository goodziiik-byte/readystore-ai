"use client"

import { useCopy } from "@/components/use-copy"
import { EyeOff, MapPinOff, PackageX, ReceiptText } from "lucide-react"

export function ProblemSection() {
  const copy = useCopy()
  const cards = [
    { icon: EyeOff, title: copy.marketing.gap.aiTitle, body: copy.marketing.gap.body },
    { icon: PackageX, title: copy.marketing.diagnosis.cards[1].title, body: copy.marketing.diagnosis.cards[1].text },
    { icon: ReceiptText, title: copy.marketing.safety.scanItems[2], body: copy.marketing.beforeAfter.beforeItems[1] },
    { icon: MapPinOff, title: copy.marketing.payments.eyebrow, body: copy.marketing.payments.body },
  ]

  return (
    <section id="problem" className="scroll-mt-20 border-y border-border bg-muted/40 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">{copy.marketing.gap.eyebrow}</p>
          <h2 className="mt-2 text-balance text-2xl font-semibold tracking-tight sm:text-4xl">
            {copy.marketing.gap.title}
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            {copy.marketing.shift.body}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-sm"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <item.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
