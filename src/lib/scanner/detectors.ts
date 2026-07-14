import type { DetectedProvider, PageSamples } from "./types";

type KeywordProvider = {
  id: string;
  name: string;
  patterns: RegExp[];
};

export const paymentProviders: KeywordProvider[] = [
  { id: "mercadopago", name: "MercadoPago", patterns: [/mercado\s*pago/i, /mercadopago/i] },
  { id: "razorpay", name: "Razorpay", patterns: [/razorpay/i] },
  { id: "payu", name: "PayU", patterns: [/\bpayu\b/i, /payu\.in/i] },
  { id: "cashfree", name: "Cashfree", patterns: [/cashfree/i] },
  { id: "xendit", name: "Xendit", patterns: [/xendit/i] },
  { id: "midtrans", name: "Midtrans", patterns: [/midtrans/i, /snap\.js/i] },
  { id: "paymongo", name: "PayMongo", patterns: [/paymongo/i] },
  { id: "gcash", name: "GCash", patterns: [/\bgcash\b/i] },
  { id: "vnpay", name: "VNPay", patterns: [/vnpay/i] },
  { id: "momo", name: "MoMo", patterns: [/\bmomo\b/i] },
  { id: "omise_opn", name: "Omise/Opn", patterns: [/omise/i, /\bopn payments?\b/i, /opn\.payments?/i] },
  { id: "twoc2p", name: "2C2P", patterns: [/2c2p/i] },
  { id: "promptpay", name: "PromptPay", patterns: [/promptpay/i, /prompt\s*pay/i] },
  { id: "paystack", name: "Paystack", patterns: [/paystack/i] },
  { id: "flutterwave", name: "Flutterwave", patterns: [/flutterwave/i, /\bravepay\b/i] },
];

export function detectPaymentProviders(text: string): DetectedProvider[] {
  return paymentProviders
    .map((provider) => {
      const evidence = provider.patterns
        .filter((pattern) => pattern.test(text))
        .map((pattern) => pattern.source.replace(/\\/g, ""));

      return {
        id: provider.id,
        name: provider.name,
        confidence: Math.min(100, evidence.length * 45),
        evidence,
      };
    })
    .filter((provider) => provider.evidence.length > 0)
    .sort((a, b) => b.confidence - a.confidence);
}

export function detectPageSamples(urls: string[]): PageSamples {
  return {
    products: takeMatching(urls, [/\/product\//i, /\/shop\//i, /\/produk\//i, /\/produto\//i, /\/producto\//i, /\/collections?\//i]),
    cart: takeMatching(urls, [/\/cart\b/i, /\/keranjang/i, /\/carrito/i, /\/carrinho/i]),
    checkout: takeMatching(urls, [/\/checkout\b/i, /\/order/i, /\/finalizar/i, /\/pagar/i]),
    shipping: takeMatching(urls, [/shipping/i, /delivery/i, /pengiriman/i, /envio/i, /entrega/i, /frete/i]),
    returns: takeMatching(urls, [/return/i, /refund/i, /returns/i, /devolu/i, /troca/i, /pengembalian/i]),
    contact: takeMatching(urls, [/contact/i, /kontak/i, /contato/i, /contacto/i, /whatsapp/i]),
    policies: takeMatching(urls, [/privacy/i, /terms/i, /policy/i, /politica/i, /kebijakan/i]),
  };
}

function takeMatching(urls: string[], patterns: RegExp[], limit = 6): string[] {
  const matches = urls.filter((url) => patterns.some((pattern) => pattern.test(url)));
  return Array.from(new Set(matches)).slice(0, limit);
}
