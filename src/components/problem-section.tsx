import { EyeOff, MapPinOff, PackageX, ReceiptText } from "lucide-react"

const PROBLEMS = [
  {
    icon: EyeOff,
    title: "AI reads a fraction of your store",
    body: "Assistants often see partial context — a title and image — but miss the details that drive a purchase.",
  },
  {
    icon: PackageX,
    title: "Stock & variants get lost",
    body: "If availability and options aren't machine-readable, AI can recommend items you can't actually sell.",
  },
  {
    icon: ReceiptText,
    title: "Policies stay invisible",
    body: "Shipping, returns, and fees buried in pages mean AI can't answer the questions shoppers ask most.",
  },
  {
    icon: MapPinOff,
    title: "Local payments go unseen",
    body: "Regional methods like MercadoPago or Midtrans are what convert — but AI has to know they exist.",
  },
]

export function ProblemSection() {
  return (
    <section id="problem" className="scroll-mt-20 border-y border-border bg-muted/40 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">The problem</p>
          <h2 className="mt-2 text-balance text-2xl font-semibold tracking-tight sm:text-4xl">
            Shoppers are asking AI before they buy. Most stores aren&apos;t ready.
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            AI shopping is moving from discovery toward checkout. If assistants can&apos;t read
            your store cleanly, you lose the sale before a customer ever lands on your page.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROBLEMS.map((item) => (
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
