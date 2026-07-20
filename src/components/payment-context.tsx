import { Globe } from "lucide-react"

const PROVIDERS = [
  { name: "MercadoPago", src: "/logos/mercadopago.png" },
  { name: "Xendit", src: "/logos/xendit.png" },
  { name: "Midtrans", src: "/logos/midtrans.png" },
  { name: "Razorpay", src: "/logos/razorpay.png" },
  { name: "PayMongo", src: "/logos/paymongo.png" },
  { name: "VNPay", src: "/logos/vnpay.png" },
  { name: "MoMo", src: "/logos/momo.png" },
  { name: "Omise / Opn", src: "/logos/omise.png" },
  { name: "Paystack", src: "/logos/paystack.png" },
  { name: "Flutterwave", src: "/logos/flutterwave.png" },
]

export function PaymentContext() {
  return (
    <section id="payments" className="scroll-mt-20 bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="flex items-center justify-center gap-2 text-sm font-medium text-primary">
            <Globe className="size-4" />
            Local payments matter
          </p>
          <h2 className="mt-2 text-balance text-2xl font-semibold tracking-tight sm:text-4xl">
            Built for the payment methods that actually convert
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Shoppers in Latin America, Southeast Asia, and Africa buy with local methods. We check
            whether AI can see the ones your store supports.
          </p>
        </div>

        <ul className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {PROVIDERS.map((provider) => (
            <li
              key={provider.name}
              className="flex h-24 items-center justify-center rounded-xl border border-border bg-white p-4 shadow-sm"
            >
              <img
                src={provider.src || "/placeholder.svg"}
                alt={`${provider.name} logo`}
                className="max-h-10 w-auto max-w-full object-contain"
                loading="lazy"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
