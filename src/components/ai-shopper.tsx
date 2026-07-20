"use client"

import { Bot } from "lucide-react"
import { useEffect, useRef } from "react"
import { useCopy } from "@/components/use-copy"

export function AiShopper() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const copy = useCopy()

  useEffect(() => {
    if (videoRef.current) {
      // Slow the animation down by 20%
      videoRef.current.playbackRate = 0.8
    }
  }, [])

  return (
    <section id="simulation" className="scroll-mt-20 bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-primary">{copy.marketing.shift.eyebrow}</p>
            <h2 className="mt-2 text-balance text-2xl font-semibold tracking-tight sm:text-4xl">
              {copy.marketing.simulation.title}
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              {copy.marketing.simulation.body}
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {copy.marketing.safety.scanItems.map(
                (item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <span className="size-1.5 rounded-full bg-primary" />
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3 sm:px-6">
              <Bot className="size-4 text-primary" />
              <span className="text-sm font-medium">{copy.marketing.simulation.title}</span>
            </div>
            <video
              ref={videoRef}
              className="aspect-video w-full object-cover"
              src="/video/ai-shopper.mp4"
              autoPlay
              loop
              muted
              playsInline
              aria-label="Animation of an AI assistant answering shopper questions using a store's public data"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
