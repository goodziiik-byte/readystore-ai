import type { Locale } from "@/lib/i18n";
import type { PaymentVisibility, ScanIssue, ScanResult } from "@/lib/scanner/types";

type ReportLocaleCopy = {
  pdf: {
    title: string;
    kicker: string;
    scoreTitle: string;
    scoreLabel: string;
    woocommerce: string;
    payment: string;
    productPages: string;
    jsonLdBlocks: string;
    readinessLayers: string;
    fixFirst: string;
    productSummary: string;
    aiCan: string;
    aiMiss: string;
    howHelp: string;
    footerPage: string;
    confirmed: string;
    unconfirmed: string;
    valueTitle: string;
    valueBody: string;
    valueCards: Array<{ title: string; text: string }>;
    ratios: string[];
    estLift: string;
  };
  email: {
    subject: (domain: string) => string;
    title: string;
    scanned: string;
    scoreLabel: string;
    topFixes: string;
    attached: string;
    noSpam: string;
    unsubscribe: string;
  };
};

const copyByLocale: Record<Locale, ReportLocaleCopy> = {
  en: {
    pdf: {
      title: "Readystore AI Report",
      kicker: "AI readiness report",
      scoreTitle: "AI readiness score for this store.",
      scoreLabel: "AI clarity score",
      woocommerce: "WooCommerce",
      payment: "Payment",
      productPages: "Product pages",
      jsonLdBlocks: "JSON-LD blocks",
      readinessLayers: "Readiness layers",
      fixFirst: "Fix these first",
      productSummary: "Product-page summary",
      aiCan: "AI can understand",
      aiMiss: "AI may miss",
      howHelp: "How Readystore AI can help",
      footerPage: "Page",
      confirmed: "Confirmed",
      unconfirmed: "Unconfirmed",
      valueTitle: "Add the missing AI readiness layer.",
      valueBody: "The plugin publishes AI discovery files, clean product and policy context, local payment signals, and ongoing monitoring so readiness does not drift as the store changes.",
      valueCards: [
        { title: "AI discovery", text: "llms.txt, store profile, clean entry points." },
        { title: "Trust context", text: "Shipping, returns, contact and policy metadata." },
        { title: "Monitoring", text: "Weekly score, fixed issues and drift alerts." },
      ],
      ratios: ["Price visible", "Availability", "Product schema", "Offer schema", "Add to cart"],
      estLift: "Est. lift",
    },
    email: {
      subject: (domain) => `AI Readiness Report for ${domain}`,
      title: "Your AI Readiness Report",
      scanned: "Readystore AI scanned",
      scoreLabel: "AI clarity score",
      topFixes: "Top fixes",
      attached: "The PDF report is attached. You are now on the Readystore AI early access list.",
      noSpam: "No spam. We will only send the product launch announcement and early-access updates.",
      unsubscribe: "Unsubscribe",
    },
  },
  es: {
    pdf: {
      title: "Reporte Readystore AI",
      kicker: "Reporte de AI readiness",
      scoreTitle: "Score de AI readiness para esta tienda.",
      scoreLabel: "AI clarity score",
      woocommerce: "WooCommerce",
      payment: "Pago",
      productPages: "Paginas de producto",
      jsonLdBlocks: "Bloques JSON-LD",
      readinessLayers: "Capas de readiness",
      fixFirst: "Corrige esto primero",
      productSummary: "Resumen de paginas de producto",
      aiCan: "La IA puede entender",
      aiMiss: "La IA puede perder",
      howHelp: "Como Readystore AI puede ayudar",
      footerPage: "Pagina",
      confirmed: "Confirmado",
      unconfirmed: "No confirmado",
      valueTitle: "Agrega la capa de AI readiness que falta.",
      valueBody: "El plugin publica archivos de discovery para IA, contexto limpio de productos y politicas, senales de pagos locales y monitoreo continuo para que la readiness no se degrade cuando la tienda cambia.",
      valueCards: [
        { title: "Discovery IA", text: "llms.txt, perfil de tienda y puntos de entrada limpios." },
        { title: "Contexto de confianza", text: "Envios, devoluciones, contacto y metadata de politicas." },
        { title: "Monitoreo", text: "Score semanal, issues corregidos y alertas de drift." },
      ],
      ratios: ["Precio visible", "Disponibilidad", "Schema Product", "Schema Offer", "Add to cart"],
      estLift: "Mejora est.",
    },
    email: {
      subject: (domain) => `Reporte de AI readiness para ${domain}`,
      title: "Tu reporte de AI readiness",
      scanned: "Readystore AI escaneo",
      scoreLabel: "AI clarity score",
      topFixes: "Fixes principales",
      attached: "El PDF esta adjunto. Ya estas en la lista de early access de Readystore AI.",
      noSpam: "Sin spam. Solo enviaremos el anuncio de lanzamiento y updates de early access.",
      unsubscribe: "Darse de baja",
    },
  },
  pt: {
    pdf: {
      title: "Relatorio Readystore AI",
      kicker: "Relatorio de AI readiness",
      scoreTitle: "Score de AI readiness para esta loja.",
      scoreLabel: "AI clarity score",
      woocommerce: "WooCommerce",
      payment: "Pagamento",
      productPages: "Paginas de produto",
      jsonLdBlocks: "Blocos JSON-LD",
      readinessLayers: "Camadas de readiness",
      fixFirst: "Corrija isto primeiro",
      productSummary: "Resumo das paginas de produto",
      aiCan: "A IA consegue entender",
      aiMiss: "A IA pode perder",
      howHelp: "Como Readystore AI pode ajudar",
      footerPage: "Pagina",
      confirmed: "Confirmado",
      unconfirmed: "Nao confirmado",
      valueTitle: "Adicione a camada de AI readiness que falta.",
      valueBody: "O plugin publica arquivos de discovery para IA, contexto limpo de produtos e politicas, sinais de pagamentos locais e monitoramento continuo para que a readiness nao se perca quando a loja muda.",
      valueCards: [
        { title: "Discovery IA", text: "llms.txt, perfil da loja e pontos de entrada limpos." },
        { title: "Contexto de confianca", text: "Frete, devolucoes, contato e metadata de politicas." },
        { title: "Monitoramento", text: "Score semanal, issues corrigidos e alertas de drift." },
      ],
      ratios: ["Preco visivel", "Disponibilidade", "Schema Product", "Schema Offer", "Add to cart"],
      estLift: "Melhora est.",
    },
    email: {
      subject: (domain) => `Relatorio de AI readiness para ${domain}`,
      title: "Seu relatorio de AI readiness",
      scanned: "Readystore AI escaneou",
      scoreLabel: "AI clarity score",
      topFixes: "Principais correcoes",
      attached: "O PDF esta anexado. Voce entrou na lista de early access da Readystore AI.",
      noSpam: "Sem spam. Enviaremos apenas o anuncio de lancamento e updates de early access.",
      unsubscribe: "Cancelar inscricao",
    },
  },
  id: {
    pdf: {
      title: "Readystore AI Report",
      kicker: "AI readiness report",
      scoreTitle: "Score AI readiness untuk toko ini.",
      scoreLabel: "AI clarity score",
      woocommerce: "WooCommerce",
      payment: "Pembayaran",
      productPages: "Halaman produk",
      jsonLdBlocks: "Blok JSON-LD",
      readinessLayers: "Readiness layers",
      fixFirst: "Perbaiki ini dulu",
      productSummary: "Ringkasan halaman produk",
      aiCan: "AI bisa memahami",
      aiMiss: "AI mungkin melewatkan",
      howHelp: "Bagaimana Readystore AI membantu",
      footerPage: "Halaman",
      confirmed: "Terkonfirmasi",
      unconfirmed: "Belum terkonfirmasi",
      valueTitle: "Tambahkan AI readiness layer yang hilang.",
      valueBody: "Plugin menerbitkan file AI discovery, konteks produk dan policy yang bersih, sinyal pembayaran lokal, dan monitoring agar readiness tidak turun saat toko berubah.",
      valueCards: [
        { title: "AI discovery", text: "llms.txt, profil toko, entry point yang bersih." },
        { title: "Konteks trust", text: "Pengiriman, retur, kontak, dan metadata policy." },
        { title: "Monitoring", text: "Score mingguan, issue yang selesai, dan alert drift." },
      ],
      ratios: ["Harga terlihat", "Availability", "Product schema", "Offer schema", "Add to cart"],
      estLift: "Est. lift",
    },
    email: {
      subject: (domain) => `AI readiness report untuk ${domain}`,
      title: "Report AI readiness Anda",
      scanned: "Readystore AI men-scan",
      scoreLabel: "AI clarity score",
      topFixes: "Perbaikan utama",
      attached: "PDF report terlampir. Anda sudah masuk early access list Readystore AI.",
      noSpam: "Tanpa spam. Kami hanya mengirim pengumuman launch dan update early access.",
      unsubscribe: "Unsubscribe",
    },
  },
};

const issueCopy: Record<Locale, Record<string, Pick<ScanIssue, "category" | "title" | "explanation">>> = {
  en: {},
  es: {
    "woocommerce-not-confirmed": {
      category: "Plataforma",
      title: "WooCommerce no se pudo confirmar con confianza",
      explanation: "El scanner no encontro suficientes senales WooCommerce para tratar esta tienda como lead calificado para el plugin.",
    },
    "product-schema-missing": {
      category: "Datos estructurados",
      title: "Product schema falta o esta incompleto",
      explanation: "Los asistentes de compra IA pueden tener problemas para comparar productos sin metadata Product y Offer legible por maquina.",
    },
    "availability-missing": {
      category: "Datos de producto",
      title: "La disponibilidad no esta clara",
      explanation: "La IA puede no saber si los productos estan en stock, agotados o disponibles bajo pedido.",
    },
    "payment-provider-not-detected": {
      category: "Pago",
      title: "El proveedor de pago no es visible para el scanner",
      explanation: "El checkout puede funcionar para humanos, pero los agentes IA pueden no entender el contexto de pago.",
    },
    "policy-pages-weak": {
      category: "Confianza",
      title: "Envios o devoluciones son dificiles de encontrar",
      explanation: "Los asistentes IA suelen necesitar informacion de entrega y devoluciones para recomendar una tienda con confianza.",
    },
    "checkout-path-blocked": {
      category: "Checkout",
      title: "El camino de checkout para IA esta bloqueado o poco claro",
      explanation: "La IA puede leer productos, pero aun fallar al guiar al comprador desde producto hasta checkout y pago.",
    },
    "checkout-handoff-needs-plugin": {
      category: "Checkout",
      title: "El handoff seguro de checkout IA no esta confirmado",
      explanation: "La tienda tiene algunas senales de compra, pero generar un link seguro de checkout o pago requiere una conexion aprobada por el merchant.",
    },
    "llms-txt-missing": {
      category: "Superficies IA",
      title: "llms.txt no esta publicado",
      explanation: "Un manifest simple para IA puede hacer que informacion clave de tienda y productos sea mas facil de encontrar.",
    },
  },
  pt: {
    "woocommerce-not-confirmed": {
      category: "Plataforma",
      title: "WooCommerce nao foi confirmado com confianca",
      explanation: "O scanner nao encontrou sinais suficientes de WooCommerce para tratar esta loja como lead qualificado para o plugin.",
    },
    "product-schema-missing": {
      category: "Dados estruturados",
      title: "Product schema esta ausente ou incompleto",
      explanation: "Assistentes de compra IA podem ter dificuldade para comparar produtos sem metadata Product e Offer legivel por maquina.",
    },
    "availability-missing": {
      category: "Dados de produto",
      title: "A disponibilidade nao esta clara",
      explanation: "A IA pode nao saber se os produtos estao em estoque, esgotados ou disponiveis por encomenda.",
    },
    "payment-provider-not-detected": {
      category: "Pagamento",
      title: "O provedor de pagamento nao esta visivel para o scanner",
      explanation: "O checkout pode funcionar para humanos, mas agentes IA podem nao entender o contexto de pagamento.",
    },
    "policy-pages-weak": {
      category: "Confianca",
      title: "Frete ou politica de devolucao sao dificeis de encontrar",
      explanation: "Assistentes IA normalmente precisam de informacoes de entrega e devolucao para recomendar uma loja com confianca.",
    },
    "checkout-path-blocked": {
      category: "Checkout",
      title: "O caminho de checkout para IA esta bloqueado ou pouco claro",
      explanation: "A IA pode ler produtos, mas ainda falhar ao guiar o comprador do produto ate checkout e pagamento.",
    },
    "checkout-handoff-needs-plugin": {
      category: "Checkout",
      title: "O handoff seguro de checkout IA nao esta confirmado",
      explanation: "A loja tem alguns sinais de compra, mas gerar um link seguro de checkout ou pagamento exige uma conexao aprovada pelo merchant.",
    },
    "llms-txt-missing": {
      category: "Superficies IA",
      title: "llms.txt nao esta publicado",
      explanation: "Um manifest simples para IA pode tornar dados da loja e produtos mais faceis de encontrar.",
    },
  },
  id: {
    "woocommerce-not-confirmed": {
      category: "Platform",
      title: "WooCommerce belum bisa dikonfirmasi dengan yakin",
      explanation: "Scanner tidak menemukan cukup sinyal WooCommerce untuk menganggap toko ini lead plugin yang qualified.",
    },
    "product-schema-missing": {
      category: "Structured data",
      title: "Product schema hilang atau belum lengkap",
      explanation: "AI shopping assistants bisa kesulitan membandingkan produk tanpa metadata Product dan Offer yang machine-readable.",
    },
    "availability-missing": {
      category: "Product data",
      title: "Availability belum jelas",
      explanation: "AI mungkin tidak tahu apakah produk ready stock, sold out, atau bisa backorder.",
    },
    "payment-provider-not-detected": {
      category: "Payment",
      title: "Provider pembayaran tidak terlihat oleh scanner",
      explanation: "Checkout mungkin bekerja untuk manusia, tetapi agen AI bisa tidak memahami konteks pembayaran.",
    },
    "policy-pages-weak": {
      category: "Trust",
      title: "Info pengiriman atau retur sulit ditemukan",
      explanation: "AI assistants sering butuh info delivery dan retur agar bisa merekomendasikan merchant dengan confidence.",
    },
    "checkout-path-blocked": {
      category: "Checkout",
      title: "AI checkout path blocked atau tidak jelas",
      explanation: "AI bisa membaca produk, tapi tetap gagal memandu buyer dari produk ke checkout dan pembayaran.",
    },
    "checkout-handoff-needs-plugin": {
      category: "Checkout",
      title: "Safe AI checkout handoff belum terkonfirmasi",
      explanation: "Toko punya sebagian buying-path signals, tapi membuat checkout atau payment link yang aman membutuhkan koneksi plugin yang disetujui merchant.",
    },
    "llms-txt-missing": {
      category: "AI surfaces",
      title: "llms.txt belum dipublish",
      explanation: "Manifest AI sederhana membantu data toko dan feed produk lebih mudah ditemukan.",
    },
  },
};

const fixCopy: Record<Locale, Record<string, { title: string; reason: string }>> = {
  en: {},
  es: {
    "Expose Product and Offer schema on product pages": {
      title: "Exponer Product y Offer schema en paginas de producto",
      reason: "Los asistentes de compra IA necesitan datos machine-readable de producto, precio y oferta para comparar productos de forma confiable.",
    },
    "Make shipping and return policy machine-readable": {
      title: "Hacer envios y devoluciones legibles para maquinas",
      reason: "Los asistentes IA pueden evitar recomendar tiendas cuando los terminos de entrega y devolucion no estan claros.",
    },
    "Expose checkout and payment provider context": {
      title: "Exponer contexto de checkout y proveedor de pago",
      reason: "El checkout puede funcionar para humanos, pero agentes IA necesitan un resumen seguro de como se completa el pago.",
    },
    "Publish an llms.txt AI discovery manifest": {
      title: "Publicar un manifest llms.txt para discovery IA",
      reason: "Un manifest simple ayuda a los asistentes a encontrar metadata de tienda, feeds de producto y URLs de politicas.",
    },
    "Expose stock and availability consistently": {
      title: "Exponer stock y disponibilidad de forma consistente",
      reason: "Productos con disponibilidad poco clara son candidatos mas debiles para recomendaciones asistidas por IA.",
    },
    "Make the buying path clear for AI shoppers": {
      title: "Hacer claro el camino de compra para compradores IA",
      reason: "Aunque los productos sean legibles, los asistentes IA necesitan un camino claro desde seleccion de producto hasta carrito, checkout y pago seguro.",
    },
    "Add AI-friendly checkout handoff": {
      title: "Agregar handoff de checkout para IA",
      reason: "La tienda es parcialmente legible para IA, pero el plugin es necesario para preparar un link seguro de checkout o pago.",
    },
  },
  pt: {
    "Expose Product and Offer schema on product pages": {
      title: "Expor Product e Offer schema nas paginas de produto",
      reason: "Assistentes de compra IA precisam de dados machine-readable de produto, preco e oferta para comparar produtos com confianca.",
    },
    "Make shipping and return policy machine-readable": {
      title: "Tornar frete e devolucoes legiveis por maquina",
      reason: "Assistentes IA podem evitar recomendar lojas quando entrega e devolucao nao estao claras.",
    },
    "Expose checkout and payment provider context": {
      title: "Expor contexto de checkout e provedor de pagamento",
      reason: "O checkout pode funcionar para humanos, mas agentes IA precisam de um resumo seguro de como o pagamento e concluido.",
    },
    "Publish an llms.txt AI discovery manifest": {
      title: "Publicar um manifest llms.txt para discovery IA",
      reason: "Um manifest simples ajuda assistentes a encontrar metadata da loja, feeds de produto e URLs de politicas.",
    },
    "Expose stock and availability consistently": {
      title: "Expor estoque e disponibilidade de forma consistente",
      reason: "Produtos com disponibilidade pouco clara sao candidatos mais fracos para recomendacoes assistidas por IA.",
    },
    "Make the buying path clear for AI shoppers": {
      title: "Deixar o caminho de compra claro para compradores IA",
      reason: "Mesmo quando produtos sao legiveis, assistentes IA precisam de um caminho claro da selecao de produto ao carrinho, checkout e pagamento seguro.",
    },
    "Add AI-friendly checkout handoff": {
      title: "Adicionar handoff de checkout para IA",
      reason: "A loja esta parcialmente legivel para IA, mas o plugin e necessario para preparar um link seguro de checkout ou pagamento.",
    },
  },
  id: {
    "Expose Product and Offer schema on product pages": {
      title: "Expose Product dan Offer schema di halaman produk",
      reason: "AI shopping assistants butuh data produk, harga, dan offer yang machine-readable agar bisa membandingkan produk dengan yakin.",
    },
    "Make shipping and return policy machine-readable": {
      title: "Buat shipping dan return policy machine-readable",
      reason: "AI assistants bisa menghindari rekomendasi toko saat delivery dan return terms tidak jelas.",
    },
    "Expose checkout and payment provider context": {
      title: "Expose konteks checkout dan payment provider",
      reason: "Checkout mungkin bekerja untuk manusia, tapi AI agents butuh ringkasan aman tentang cara pembayaran diselesaikan.",
    },
    "Publish an llms.txt AI discovery manifest": {
      title: "Publish llms.txt AI discovery manifest",
      reason: "Manifest sederhana membantu assistants menemukan metadata toko, product feeds, dan URL policy.",
    },
    "Expose stock and availability consistently": {
      title: "Expose stock dan availability secara konsisten",
      reason: "Produk dengan availability tidak jelas lebih lemah untuk rekomendasi yang dibantu AI.",
    },
    "Make the buying path clear for AI shoppers": {
      title: "Buat buying path jelas untuk AI shoppers",
      reason: "Walaupun produk terbaca, AI assistants butuh path jelas dari pilihan produk ke cart, checkout, dan safe payment handoff.",
    },
    "Add AI-friendly checkout handoff": {
      title: "Tambahkan checkout handoff untuk AI",
      reason: "Toko ini sebagian terbaca oleh AI, tapi plugin dibutuhkan untuk menyiapkan checkout atau payment link yang aman untuk shopper.",
    },
  },
};

export function getReportLocaleCopy(locale: Locale) {
  return copyByLocale[locale] ?? copyByLocale.en;
}

export function localizeScanResult(result: ScanResult, locale: Locale): ScanResult {
  if (locale === "en") {
    return result;
  }

  return {
    ...result,
    paymentVisibility: localizePaymentVisibility(result.paymentVisibility, locale),
    checkoutReadiness: localizeCheckoutReadiness(result.checkoutReadiness, locale),
    priorityFixes: result.priorityFixes.map((fix) => {
      const localized = fixCopy[locale][fix.title];
      return localized ? { ...fix, ...localized } : fix;
    }),
    merchantSummary: buildLocalizedMerchantSummary(result, locale),
    readinessLayers: result.readinessLayers.map((layer) => ({
      ...layer,
      title: layerTitle(layer.id, locale),
      whyItMatters: layerWhy(layer.id, locale),
      evidence: layerEvidence(result, layer.id, locale),
    })),
    aiCanUnderstand: buildLocalizedCanUnderstand(result, locale),
    aiMayMiss: buildLocalizedMayMiss(result, locale),
    issues: result.issues.map((issue) => ({
      ...issue,
      ...(issueCopy[locale][issue.id] ?? {}),
      evidence: localizeEvidence(issue.evidence, locale),
    })),
  };
}

export function displayPaymentLevel(level: PaymentVisibility["level"], locale: Locale): string {
  const values: Record<Locale, Record<PaymentVisibility["level"], string>> = {
    en: {
      confirmed_provider: "Confirmed provider",
      generic_payment_visible: "Generic payment visible",
      not_visible: "Not visible",
    },
    es: {
      confirmed_provider: "Proveedor confirmado",
      generic_payment_visible: "Pago generico visible",
      not_visible: "No visible",
    },
    pt: {
      confirmed_provider: "Provedor confirmado",
      generic_payment_visible: "Pagamento generico visivel",
      not_visible: "Nao visivel",
    },
    id: {
      confirmed_provider: "Provider terkonfirmasi",
      generic_payment_visible: "Pembayaran generik terlihat",
      not_visible: "Tidak terlihat",
    },
  };

  return values[locale][level];
}

export function displayStatus(status: string, locale: Locale): string {
  const values: Record<Locale, Record<string, string>> = {
    en: { strong: "strong", partial: "partial", missing: "missing" },
    es: { strong: "fuerte", partial: "parcial", missing: "faltante" },
    pt: { strong: "forte", partial: "parcial", missing: "ausente" },
    id: { strong: "kuat", partial: "parsial", missing: "hilang" },
  };

  return values[locale][status] ?? status;
}

export function displayImpact(impact: string, locale: Locale): string {
  const values: Record<Locale, Record<string, string>> = {
    en: { high: "high", medium: "medium", low: "low" },
    es: { high: "alto", medium: "medio", low: "bajo" },
    pt: { high: "alto", medium: "medio", low: "baixo" },
    id: { high: "tinggi", medium: "medium", low: "rendah" },
  };

  return values[locale][impact] ?? impact;
}

export function displayEffort(effort: string, locale: Locale): string {
  const values: Record<Locale, Record<string, string>> = {
    en: { high: "high", medium: "medium", low: "low" },
    es: { high: "alto", medium: "medio", low: "bajo" },
    pt: { high: "alto", medium: "medio", low: "baixo" },
    id: { high: "tinggi", medium: "medium", low: "rendah" },
  };

  return values[locale][effort] ?? effort;
}

export function displayOwner(owner: string, locale: Locale): string {
  const values: Record<Locale, Record<string, string>> = {
    en: { plugin: "plugin", merchant: "merchant", both: "both" },
    es: { plugin: "plugin", merchant: "merchant", both: "ambos" },
    pt: { plugin: "plugin", merchant: "merchant", both: "ambos" },
    id: { plugin: "plugin", merchant: "merchant", both: "keduanya" },
  };

  return values[locale][owner] ?? owner;
}

export function displayPluginFix(value: string, locale: Locale): string {
  const values: Record<Locale, Record<string, string>> = {
    en: { yes: "yes", partial: "partial", no: "no" },
    es: { yes: "si", partial: "parcial", no: "no" },
    pt: { yes: "sim", partial: "parcial", no: "nao" },
    id: { yes: "ya", partial: "parsial", no: "tidak" },
  };

  return values[locale][value] ?? value;
}

export function scoreBreakdownLabel(key: string, locale: Locale): string {
  const labels: Record<Locale, Record<string, string>> = {
    en: {
      platform: "Platform",
      productData: "Product data",
      structuredData: "Structured data",
      priceAndCurrency: "Price and currency",
      stockAvailability: "Stock availability",
      shippingReturns: "Shipping and returns",
      paymentCheckout: "Checkout path",
      aiSurfaces: "AI surfaces",
      crawlability: "Crawlability",
    },
    es: {
      platform: "Plataforma",
      productData: "Datos de producto",
      structuredData: "Datos estructurados",
      priceAndCurrency: "Precio y moneda",
      stockAvailability: "Stock y disponibilidad",
      shippingReturns: "Envios y devoluciones",
      paymentCheckout: "Camino de checkout",
      aiSurfaces: "Superficies IA",
      crawlability: "Crawlability",
    },
    pt: {
      platform: "Plataforma",
      productData: "Dados de produto",
      structuredData: "Dados estruturados",
      priceAndCurrency: "Preco e moeda",
      stockAvailability: "Estoque e disponibilidade",
      shippingReturns: "Frete e devolucoes",
      paymentCheckout: "Caminho de checkout",
      aiSurfaces: "Superficies IA",
      crawlability: "Crawlability",
    },
    id: {
      platform: "Platform",
      productData: "Product data",
      structuredData: "Structured data",
      priceAndCurrency: "Harga dan mata uang",
      stockAvailability: "Stock availability",
      shippingReturns: "Shipping dan retur",
      paymentCheckout: "Checkout path",
      aiSurfaces: "AI surfaces",
      crawlability: "Crawlability",
    },
  };

  return labels[locale][key] ?? labels.en[key] ?? key;
}

export function aiVisibilityLabel(key: string, locale: Locale): string {
  return visibilityLabel(key, locale);
}

export function pageRoleLabel(role: string, locale: Locale): string {
  const labels: Record<Locale, Record<string, string>> = {
    en: { homepage: "homepage", product: "product", cart: "cart", checkout: "checkout", shipping: "shipping", returns: "returns", contact: "contact", policy: "policy" },
    es: { homepage: "homepage", product: "producto", cart: "carrito", checkout: "checkout", shipping: "envios", returns: "devoluciones", contact: "contacto", policy: "politica" },
    pt: { homepage: "homepage", product: "produto", cart: "carrinho", checkout: "checkout", shipping: "frete", returns: "devolucoes", contact: "contato", policy: "politica" },
    id: { homepage: "homepage", product: "produk", cart: "cart", checkout: "checkout", shipping: "pengiriman", returns: "retur", contact: "kontak", policy: "policy" },
  };

  return labels[locale][role] ?? role;
}

function localizePaymentVisibility(payment: PaymentVisibility, locale: Locale): PaymentVisibility {
  const providers = payment.evidence
    .map((item) => item.split(":")[0])
    .filter(Boolean);
  const providerList = Array.from(new Set(providers)).join(", ");

  if (payment.level === "confirmed_provider") {
    return {
      ...payment,
      label: ({
        es: `Senal de proveedor confirmada${providerList ? `: ${providerList}` : ""}`,
        pt: `Sinal de provedor confirmado${providerList ? `: ${providerList}` : ""}`,
        id: `Sinyal provider terkonfirmasi${providerList ? `: ${providerList}` : ""}`,
      } as Partial<Record<Locale, string>>)[locale] ?? payment.label,
    };
  }

  if (payment.level === "generic_payment_visible") {
    return {
      ...payment,
      label: ({
        es: "Lenguaje de pago o checkout visible, pero no se confirmo un proveedor local conocido.",
        pt: "Linguagem de pagamento ou checkout visivel, mas nenhum provedor local conhecido foi confirmado.",
        id: "Bahasa pembayaran atau checkout terlihat, tetapi provider lokal yang dikenal belum terkonfirmasi.",
      } as Partial<Record<Locale, string>>)[locale] ?? payment.label,
    };
  }

  return {
    ...payment,
    label: ({
      es: "El contexto de pago no es visible para el scanner.",
      pt: "O contexto de pagamento nao esta visivel para o scanner.",
      id: "Konteks pembayaran tidak terlihat oleh scanner.",
    } as Partial<Record<Locale, string>>)[locale] ?? payment.label,
  };
}

function localizeCheckoutReadiness(checkout: ScanResult["checkoutReadiness"], locale: Locale): ScanResult["checkoutReadiness"] {
  const statusCopy = {
    en: {
      ready_to_guide: "Ready to guide a buyer",
      partially_ready: "Partially ready",
      blocked_or_unclear: "Blocked or unclear",
    },
    es: {
      ready_to_guide: "Listo para guiar al comprador",
      partially_ready: "Parcialmente listo",
      blocked_or_unclear: "Bloqueado o poco claro",
    },
    pt: {
      ready_to_guide: "Pronto para guiar o comprador",
      partially_ready: "Parcialmente pronto",
      blocked_or_unclear: "Bloqueado ou pouco claro",
    },
    id: {
      ready_to_guide: "Siap memandu buyer",
      partially_ready: "Sebagian siap",
      blocked_or_unclear: "Blocked atau tidak jelas",
    },
  }[locale];
  const summaryCopy = {
    en: {
      ready_to_guide: "AI assistants can understand the public buying path, but automated payment handoff still requires the plugin.",
      partially_ready: "AI assistants can understand parts of the buying path, but checkout/payment handoff is not fully machine-readable yet.",
      blocked_or_unclear: "AI assistants may struggle to guide a buyer through cart, checkout, or payment with confidence.",
    },
    es: {
      ready_to_guide: "Los asistentes IA pueden entender el camino publico de compra, pero el handoff automatico de pago todavia requiere el plugin.",
      partially_ready: "Los asistentes IA pueden entender partes del camino de compra, pero el handoff de checkout/pago aun no es completamente legible por maquina.",
      blocked_or_unclear: "Los asistentes IA pueden tener problemas para guiar al comprador por carrito, checkout o pago con confianza.",
    },
    pt: {
      ready_to_guide: "Assistentes IA conseguem entender o caminho publico de compra, mas o handoff automatico de pagamento ainda requer o plugin.",
      partially_ready: "Assistentes IA conseguem entender partes do caminho de compra, mas o handoff de checkout/pagamento ainda nao e totalmente legivel por maquina.",
      blocked_or_unclear: "Assistentes IA podem ter dificuldade para guiar o comprador por carrinho, checkout ou pagamento com confianca.",
    },
    id: {
      ready_to_guide: "AI assistants bisa memahami public buying path, tapi automated payment handoff tetap membutuhkan plugin.",
      partially_ready: "AI assistants bisa memahami sebagian buying path, tapi checkout/payment handoff belum sepenuhnya machine-readable.",
      blocked_or_unclear: "AI assistants bisa kesulitan memandu buyer melewati cart, checkout, atau payment dengan confidence.",
    },
  }[locale];

  return {
    ...checkout,
    label: statusCopy[checkout.status],
    summary: summaryCopy[checkout.status],
    checks: checkout.checks.map((check) => {
      const localized = checkoutCheckCopy(check.id, locale);
      return {
        ...check,
        label: localized.label,
        explanation: localized.explanation,
        evidence: localizeCheckoutEvidence(check.evidence, locale),
      };
    }),
  };
}

function buildLocalizedMerchantSummary(result: ScanResult, locale: Locale) {
  const headline = localizedHeadline(result.score, locale);
  const product = result.productSummary;
  const visibility = result.aiVisibility;
  const missing = Object.entries(visibility).filter(([, value]) => value === "missing").map(([key]) => visibilityLabel(key, locale));
  const partial = Object.entries(visibility).filter(([, value]) => value === "partial").map(([key]) => visibilityLabel(key, locale));

  const productLine = product.scanned > 0
    ? {
      en: `The scanner inspected ${product.scanned} product pages: ${product.withPrice}/${product.scanned} show price signals, ${product.withAvailability}/${product.scanned} show availability signals, and ${product.withProductSchema}/${product.scanned} expose Product schema.`,
      es: `El scanner reviso ${product.scanned} paginas de producto: ${product.withPrice}/${product.scanned} muestran senales de precio, ${product.withAvailability}/${product.scanned} muestran disponibilidad y ${product.withProductSchema}/${product.scanned} exponen Product schema.`,
      pt: `O scanner analisou ${product.scanned} paginas de produto: ${product.withPrice}/${product.scanned} mostram sinais de preco, ${product.withAvailability}/${product.scanned} mostram disponibilidade e ${product.withProductSchema}/${product.scanned} expoem Product schema.`,
      id: `Scanner memeriksa ${product.scanned} halaman produk: ${product.withPrice}/${product.scanned} punya sinyal harga, ${product.withAvailability}/${product.scanned} punya sinyal availability, dan ${product.withProductSchema}/${product.scanned} expose Product schema.`,
    }[locale]
    : {
      en: "The scanner could not inspect product pages from the discovered links.",
      es: "El scanner no pudo revisar paginas de producto desde los links encontrados.",
      pt: "O scanner nao conseguiu analisar paginas de produto a partir dos links encontrados.",
      id: "Scanner tidak bisa memeriksa halaman produk dari link yang ditemukan.",
    }[locale];

  const riskLine = missing.length > 0
    ? {
      en: `Missing areas: ${missing.join(", ")}.`,
      es: `Areas faltantes: ${missing.join(", ")}.`,
      pt: `Areas ausentes: ${missing.join(", ")}.`,
      id: `Area yang hilang: ${missing.join(", ")}.`,
    }[locale]
    : partial.length > 0
      ? {
        en: `Partially visible areas: ${partial.join(", ")}.`,
        es: `Areas parcialmente visibles: ${partial.join(", ")}.`,
        pt: `Areas parcialmente visiveis: ${partial.join(", ")}.`,
        id: `Area yang terlihat parsial: ${partial.join(", ")}.`,
      }[locale]
      : {
        en: "No major visibility area is completely missing in this scan.",
        es: "No hay areas principales completamente faltantes en este scan.",
        pt: "Nenhuma area principal esta completamente ausente neste scan.",
        id: "Tidak ada area visibilitas utama yang sepenuhnya hilang dalam scan ini.",
      }[locale];

  return {
    headline,
    body: `${productLine} ${riskLine} ${paymentContextLabel(locale)}: ${localizePaymentVisibility(result.paymentVisibility, locale).label}`,
  };
}

function localizedHeadline(score: number, locale: Locale): string {
  if (locale === "es") {
    if (score >= 8) return "La IA puede entender lo basico de esta tienda, pero aun quedan brechas de confianza y discovery.";
    if (score >= 6) return "La IA puede leer partes de esta tienda, pero contexto importante de compra sigue poco claro.";
    return "Los asistentes de compra IA pueden tener dificultad para recomendar esta tienda con confianza.";
  }

  if (locale === "pt") {
    if (score >= 8) return "A IA consegue entender o basico desta loja, mas ainda existem lacunas de confianca e discovery.";
    if (score >= 6) return "A IA consegue ler partes desta loja, mas contexto importante de compra ainda esta pouco claro.";
    return "Assistentes de compra IA podem ter dificuldade para recomendar esta loja com confianca.";
  }

  if (score >= 8) return "AI bisa memahami dasar toko ini, tetapi masih ada gap trust dan discovery.";
  if (score >= 6) return "AI bisa membaca sebagian toko ini, tetapi konteks pembelian penting masih belum jelas.";
  return "AI shopping assistants mungkin kesulitan merekomendasikan toko ini dengan confidence.";
}

function buildLocalizedCanUnderstand(result: ScanResult, locale: Locale): string[] {
  const items: string[] = [];
  const productPages = result.pagesScanned.filter((page) => page.role === "product" && page.fetched);

  const t = {
    en: {
      woocommerce: "The store appears to use WooCommerce.",
      products: `The scanner found ${productPages.length} product pages to inspect.`,
      price: "Visible product price signals exist.",
      currency: "Currency signals are visible.",
      schema: `Structured data is present, including: ${result.structuredData.schemaTypes.slice(0, 5).join(", ")}.`,
      payment: `Payment context mentions ${result.paymentProviders.map((provider) => provider.name).join(", ")}.`,
      contact: "Contact pages or channels are discoverable.",
      fallback: "The scanner found only weak machine-readable commerce signals.",
    },
    es: {
      woocommerce: "La tienda parece usar WooCommerce.",
      products: `El scanner encontro ${productPages.length} paginas de producto para revisar.`,
      price: "Existen senales visibles de precio.",
      currency: "Las senales de moneda son visibles.",
      schema: `Hay datos estructurados, incluyendo: ${result.structuredData.schemaTypes.slice(0, 5).join(", ")}.`,
      payment: `El contexto de pago menciona ${result.paymentProviders.map((provider) => provider.name).join(", ")}.`,
      contact: "Paginas o canales de contacto son descubribles.",
      fallback: "El scanner encontro solo senales de comercio machine-readable debiles.",
    },
    pt: {
      woocommerce: "A loja parece usar WooCommerce.",
      products: `O scanner encontrou ${productPages.length} paginas de produto para analisar.`,
      price: "Existem sinais visiveis de preco.",
      currency: "Sinais de moeda estao visiveis.",
      schema: `Dados estruturados estao presentes, incluindo: ${result.structuredData.schemaTypes.slice(0, 5).join(", ")}.`,
      payment: `O contexto de pagamento menciona ${result.paymentProviders.map((provider) => provider.name).join(", ")}.`,
      contact: "Paginas ou canais de contato sao descobertos.",
      fallback: "O scanner encontrou apenas sinais fracos de comercio machine-readable.",
    },
    id: {
      woocommerce: "Toko terlihat menggunakan WooCommerce.",
      products: `Scanner menemukan ${productPages.length} halaman produk untuk dicek.`,
      price: "Sinyal harga produk terlihat.",
      currency: "Sinyal mata uang terlihat.",
      schema: `Structured data tersedia, termasuk: ${result.structuredData.schemaTypes.slice(0, 5).join(", ")}.`,
      payment: `Konteks pembayaran menyebut ${result.paymentProviders.map((provider) => provider.name).join(", ")}.`,
      contact: "Halaman atau channel kontak bisa ditemukan.",
      fallback: "Scanner hanya menemukan sinyal commerce machine-readable yang lemah.",
    },
  }[locale];

  if (result.platform.woocommerce) items.push(t.woocommerce);
  if (productPages.length > 0) items.push(t.products);
  if (result.signals.hasPrice) items.push(t.price);
  if (result.signals.hasCurrency) items.push(t.currency);
  if (result.structuredData.jsonLdCount > 0) items.push(t.schema);
  if (result.paymentProviders.length > 0) items.push(t.payment);
  if (result.pageSamples.contact.length > 0) items.push(t.contact);

  return items.length > 0 ? items : [t.fallback];
}

function buildLocalizedMayMiss(result: ScanResult, locale: Locale): string[] {
  const items: string[] = [];
  const t = {
    en: {
      schema: "Product and Offer schema may be missing.",
      availability: "Stock or availability may be unclear.",
      shipping: "Shipping information may be hard to discover.",
      returns: "Return policy may be hard to discover.",
      payment: "Payment provider context may be invisible to AI.",
      checkoutBlocked: "The buying path from product to checkout may be blocked or unclear.",
      checkoutPartial: "Safe AI checkout handoff requires a plugin connection.",
      llms: "No llms.txt AI discovery manifest was found.",
      fallback: "No major AI-readiness gaps were detected in this first scan.",
    },
    es: {
      schema: "Product y Offer schema pueden faltar.",
      availability: "Stock o disponibilidad pueden no estar claros.",
      shipping: "La informacion de envio puede ser dificil de encontrar.",
      returns: "La politica de devolucion puede ser dificil de encontrar.",
      payment: "El contexto del proveedor de pago puede ser invisible para IA.",
      checkoutBlocked: "El camino desde producto hasta checkout puede estar bloqueado o poco claro.",
      checkoutPartial: "El handoff seguro de checkout IA requiere una conexion con plugin.",
      llms: "No se encontro manifest llms.txt para AI discovery.",
      fallback: "No se detectaron gaps mayores de AI readiness en este primer scan.",
    },
    pt: {
      schema: "Product e Offer schema podem estar ausentes.",
      availability: "Estoque ou disponibilidade podem nao estar claros.",
      shipping: "Informacoes de frete podem ser dificeis de encontrar.",
      returns: "Politica de devolucao pode ser dificil de encontrar.",
      payment: "O contexto do provedor de pagamento pode estar invisivel para IA.",
      checkoutBlocked: "O caminho do produto ate o checkout pode estar bloqueado ou pouco claro.",
      checkoutPartial: "O handoff seguro de checkout IA requer uma conexao com plugin.",
      llms: "Nenhum manifest llms.txt de AI discovery foi encontrado.",
      fallback: "Nenhuma lacuna grande de AI readiness foi detectada neste primeiro scan.",
    },
    id: {
      schema: "Product dan Offer schema mungkin hilang.",
      availability: "Stock atau availability mungkin belum jelas.",
      shipping: "Informasi pengiriman mungkin sulit ditemukan.",
      returns: "Return policy mungkin sulit ditemukan.",
      payment: "Konteks payment provider mungkin tidak terlihat oleh AI.",
      checkoutBlocked: "Buying path dari produk ke checkout mungkin blocked atau tidak jelas.",
      checkoutPartial: "Safe AI checkout handoff membutuhkan koneksi plugin.",
      llms: "Manifest llms.txt untuk AI discovery tidak ditemukan.",
      fallback: "Tidak ada gap AI readiness besar yang terdeteksi dalam scan pertama ini.",
    },
  }[locale];

  if (!result.structuredData.hasProductSchema) items.push(t.schema);
  if (!result.signals.hasAvailability) items.push(t.availability);
  if (result.aiVisibility.shipping === "missing") items.push(t.shipping);
  if (result.aiVisibility.returns === "missing") items.push(t.returns);
  if (result.paymentProviders.length === 0) items.push(t.payment);
  if (result.checkoutReadiness.status === "blocked_or_unclear") items.push(t.checkoutBlocked);
  if (result.checkoutReadiness.status === "partially_ready") items.push(t.checkoutPartial);
  if (!result.signals.hasLlmsTxt) items.push(t.llms);

  return items.length > 0 ? items : [t.fallback];
}

function layerTitle(id: ScanResult["readinessLayers"][number]["id"], locale: Locale): string {
  const labels = {
    en: {
      catalog: "Product catalog layer",
      trust: "Trust and policy layer",
      ai_discovery: "AI discovery layer",
      checkout_payment: "Checkout and payment layer",
    },
    es: {
      catalog: "Capa de catalogo de producto",
      trust: "Capa de confianza y politicas",
      ai_discovery: "Capa de AI discovery",
      checkout_payment: "Capa de checkout y pago",
    },
    pt: {
      catalog: "Camada de catalogo de produto",
      trust: "Camada de confianca e politicas",
      ai_discovery: "Camada de AI discovery",
      checkout_payment: "Camada de checkout e pagamento",
    },
    id: {
      catalog: "Product catalog layer",
      trust: "Trust dan policy layer",
      ai_discovery: "AI discovery layer",
      checkout_payment: "Checkout dan payment layer",
    },
  }[locale];

  return labels[id];
}

function layerWhy(id: ScanResult["readinessLayers"][number]["id"], locale: Locale): string {
  const labels = {
    en: {
      catalog: "AI assistants need reliable product identity, price, stock, and Product/Offer schema before they can compare items.",
      trust: "In comparison tasks, AI assistants need shipping, returns, contact, and policy context to judge whether the store is safe to recommend.",
      ai_discovery: "AI-readable manifests and feeds make important store, product, policy, and checkout metadata easier to discover and keep fresh.",
      checkout_payment: "AI agents should know whether the buyer must complete checkout on the merchant site and which local payment provider or method is available.",
    },
    es: {
      catalog: "Los asistentes IA necesitan identidad de producto, precio, stock y schema Product/Offer confiables antes de comparar items.",
      trust: "En tareas de comparacion, la IA necesita contexto de envios, devoluciones, contacto y politicas para juzgar si la tienda es segura de recomendar.",
      ai_discovery: "Manifests y feeds legibles para IA hacen que metadata de tienda, producto, politicas y checkout sea mas facil de descubrir y mantener fresca.",
      checkout_payment: "Los agentes IA deben saber si el comprador debe completar checkout en el sitio y que proveedor o metodo de pago local esta disponible.",
    },
    pt: {
      catalog: "Assistentes IA precisam de identidade de produto, preco, estoque e schema Product/Offer confiaveis antes de comparar itens.",
      trust: "Em comparacoes, a IA precisa de contexto de frete, devolucoes, contato e politicas para julgar se a loja e segura de recomendar.",
      ai_discovery: "Manifests e feeds legiveis para IA tornam metadata de loja, produto, politicas e checkout mais facil de descobrir e manter atualizada.",
      checkout_payment: "Agentes IA devem saber se o comprador precisa concluir checkout no site e qual provedor ou metodo de pagamento local esta disponivel.",
    },
    id: {
      catalog: "AI assistants butuh identitas produk, harga, stock, dan Product/Offer schema yang reliabel sebelum membandingkan item.",
      trust: "Dalam comparison task, AI butuh konteks shipping, retur, kontak, dan policy untuk menilai apakah toko aman direkomendasikan.",
      ai_discovery: "Manifest dan feed yang AI-readable membuat metadata toko, produk, policy, dan checkout lebih mudah ditemukan dan tetap fresh.",
      checkout_payment: "AI agents perlu tahu apakah buyer harus checkout di situs merchant dan payment provider atau metode lokal apa yang tersedia.",
    },
  }[locale];

  return labels[id];
}

function layerEvidence(result: ScanResult, id: ScanResult["readinessLayers"][number]["id"], locale: Locale): string[] {
  const products = result.productSummary;
  const visibility = result.aiVisibility;

  if (id === "catalog") {
    return [
      `${products.scanned} ${productPagesScannedLabel(locale)}`,
      `${products.withPrice}/${products.scanned} ${showPriceLabel(locale)}`,
      `${products.withAvailability}/${products.scanned} ${showAvailabilityLabel(locale)}`,
      `${products.withProductSchema}/${products.scanned} ${exposeProductSchemaLabel(locale)}`,
    ];
  }

  if (id === "trust") {
    return [
      `${shippingVisibilityLabel(locale)}: ${displayStatus(visibility.shipping, locale)}`,
      `${returnVisibilityLabel(locale)}: ${displayStatus(visibility.returns, locale)}`,
    ];
  }

  if (id === "ai_discovery") {
    return [
      `llms.txt: ${foundMissing(result.signals.hasLlmsTxt, locale)}`,
      `${sitemapHintLabel(locale)}: ${foundMissing(result.signals.hasSitemapHint, locale)}`,
    ];
  }

  return [
    localizePaymentVisibility(result.paymentVisibility, locale).label,
    `${checkoutVisibilityLabel(locale)}: ${displayStatus(visibility.checkout, locale)}`,
  ];
}

function localizeEvidence(items: string[], locale: Locale): string[] {
  return items.map((item) => item
    .replace(": no Product schema found", `: ${noProductSchemaLabel(locale)}`)
    .replace(": availability signal missing", `: ${availabilityMissingLabel(locale)}`)
    .replace(": no known local payment provider detected", `: ${paymentProviderMissingLabel(locale)}`));
}

function visibilityLabel(key: string, locale: Locale) {
  const labels: Record<Locale, Record<string, string>> = {
    en: { productIdentity: "product identity", price: "price", availability: "availability", shipping: "shipping", returns: "returns", payment: "payment", checkout: "checkout" },
    es: { productIdentity: "identidad de producto", price: "precio", availability: "disponibilidad", shipping: "envio", returns: "devoluciones", payment: "pago", checkout: "checkout" },
    pt: { productIdentity: "identidade de produto", price: "preco", availability: "disponibilidade", shipping: "frete", returns: "devolucoes", payment: "pagamento", checkout: "checkout" },
    id: { productIdentity: "identitas produk", price: "harga", availability: "availability", shipping: "pengiriman", returns: "retur", payment: "payment", checkout: "checkout" },
  };

  return labels[locale][key] ?? key;
}

function paymentContextLabel(locale: Locale) {
  return { en: "Payment visibility", es: "Visibilidad de pago", pt: "Visibilidade de pagamento", id: "Payment visibility" }[locale];
}

function productPagesScannedLabel(locale: Locale) {
  return { en: "product pages scanned", es: "paginas de producto revisadas", pt: "paginas de produto analisadas", id: "halaman produk dicek" }[locale];
}

function showPriceLabel(locale: Locale) {
  return { en: "show price", es: "muestran precio", pt: "mostram preco", id: "menampilkan harga" }[locale];
}

function showAvailabilityLabel(locale: Locale) {
  return { en: "show availability", es: "muestran disponibilidad", pt: "mostram disponibilidade", id: "menampilkan availability" }[locale];
}

function exposeProductSchemaLabel(locale: Locale) {
  return { en: "expose Product schema", es: "exponen Product schema", pt: "expoem Product schema", id: "expose Product schema" }[locale];
}

function shippingVisibilityLabel(locale: Locale) {
  return { en: "Shipping visibility", es: "Visibilidad de envio", pt: "Visibilidade de frete", id: "Shipping visibility" }[locale];
}

function returnVisibilityLabel(locale: Locale) {
  return { en: "Return policy visibility", es: "Visibilidad de devoluciones", pt: "Visibilidade de devolucoes", id: "Return policy visibility" }[locale];
}

function sitemapHintLabel(locale: Locale) {
  return { en: "Sitemap hint", es: "Sitemap hint", pt: "Sitemap hint", id: "Sitemap hint" }[locale];
}

function checkoutVisibilityLabel(locale: Locale) {
  return { en: "Checkout visibility", es: "Visibilidad de checkout", pt: "Visibilidade de checkout", id: "Checkout visibility" }[locale];
}

function checkoutCheckCopy(id: ScanResult["checkoutReadiness"]["checks"][number]["id"], locale: Locale) {
  const labels = {
    en: {
      product_selectable: {
        label: "Product can be selected",
        explanation: "Product pages expose add-to-cart or buying controls.",
      },
      cart_reachable: {
        label: "Cart page can be reached",
        explanation: "A public cart page was discovered and loaded with a safe GET request.",
      },
      checkout_reachable: {
        label: "Checkout page can be reached",
        explanation: "The checkout page loaded publicly. The scanner checks visibility only and does not submit checkout forms.",
      },
      payment_context: {
        label: "Payment options are understandable",
        explanation: "A known regional payment provider was detected.",
      },
      trust_policies: {
        label: "Shipping and returns are clear before purchase",
        explanation: "AI assistants may not have enough delivery or return confidence before recommending checkout.",
      },
      safe_payment_link: {
        label: "Safe payment link for AI shopper",
        explanation: "Creating a safe checkout or payment link requires the WooCommerce plugin and merchant-approved payment gateway adapter.",
      },
    },
    es: {
      product_selectable: {
        label: "El producto se puede seleccionar",
        explanation: "Las paginas de producto exponen controles de compra o agregar al carrito.",
      },
      cart_reachable: {
        label: "El carrito se puede abrir",
        explanation: "Se encontro una pagina publica de carrito y cargo con una request GET segura.",
      },
      checkout_reachable: {
        label: "El checkout se puede abrir",
        explanation: "La pagina de checkout cargo publicamente. El scanner solo revisa visibilidad y no envia formularios.",
      },
      payment_context: {
        label: "Las opciones de pago se entienden",
        explanation: "Se detecto un proveedor regional de pago conocido.",
      },
      trust_policies: {
        label: "Envios y devoluciones son claros antes de comprar",
        explanation: "La IA puede no tener suficiente confianza de entrega o devolucion antes de recomendar checkout.",
      },
      safe_payment_link: {
        label: "Link de pago seguro para comprador IA",
        explanation: "Crear un link seguro de checkout o pago requiere el plugin WooCommerce y un adaptador de pago aprobado por el merchant.",
      },
    },
    pt: {
      product_selectable: {
        label: "O produto pode ser selecionado",
        explanation: "Paginas de produto expoem controles de compra ou adicionar ao carrinho.",
      },
      cart_reachable: {
        label: "O carrinho pode ser aberto",
        explanation: "Uma pagina publica de carrinho foi encontrada e carregou com uma request GET segura.",
      },
      checkout_reachable: {
        label: "O checkout pode ser aberto",
        explanation: "A pagina de checkout carregou publicamente. O scanner so verifica visibilidade e nao envia formularios.",
      },
      payment_context: {
        label: "As opcoes de pagamento sao compreensiveis",
        explanation: "Um provedor regional de pagamento conhecido foi detectado.",
      },
      trust_policies: {
        label: "Frete e devolucoes sao claros antes da compra",
        explanation: "A IA pode nao ter confianca suficiente sobre entrega ou devolucao antes de recomendar checkout.",
      },
      safe_payment_link: {
        label: "Link de pagamento seguro para comprador IA",
        explanation: "Criar um link seguro de checkout ou pagamento requer o plugin WooCommerce e um adaptador de gateway aprovado pelo merchant.",
      },
    },
    id: {
      product_selectable: {
        label: "Produk bisa dipilih",
        explanation: "Halaman produk mengekspos add-to-cart atau buying controls.",
      },
      cart_reachable: {
        label: "Halaman cart bisa dibuka",
        explanation: "Halaman cart publik ditemukan dan dimuat dengan safe GET request.",
      },
      checkout_reachable: {
        label: "Halaman checkout bisa dibuka",
        explanation: "Halaman checkout terbuka secara publik. Scanner hanya mengecek visibilitas dan tidak submit form checkout.",
      },
      payment_context: {
        label: "Opsi pembayaran bisa dipahami",
        explanation: "Provider pembayaran regional yang dikenal terdeteksi.",
      },
      trust_policies: {
        label: "Shipping dan retur jelas sebelum purchase",
        explanation: "AI assistants mungkin belum punya delivery atau return confidence yang cukup sebelum merekomendasikan checkout.",
      },
      safe_payment_link: {
        label: "Safe payment link untuk AI shopper",
        explanation: "Membuat checkout atau payment link yang aman membutuhkan plugin WooCommerce dan adapter payment gateway yang disetujui merchant.",
      },
    },
  }[locale];

  return labels[id];
}

function localizeCheckoutEvidence(items: string[], locale: Locale): string[] {
  return items.map((item) => item
    .replace("Public scanner does not create carts, submit checkout, or touch payment data.", {
      en: "Public scanner does not create carts, submit checkout, or touch payment data.",
      es: "El scanner publico no crea carritos, no envia checkout y no toca datos de pago.",
      pt: "O scanner publico nao cria carrinhos, nao envia checkout e nao toca dados de pagamento.",
      id: "Public scanner tidak membuat cart, tidak submit checkout, dan tidak menyentuh data pembayaran.",
    }[locale])
    .replace("scanned product pages expose add-to-cart signals", {
      en: "scanned product pages expose add-to-cart signals",
      es: "paginas escaneadas exponen senales de agregar al carrito",
      pt: "paginas escaneadas expoem sinais de adicionar ao carrinho",
      id: "halaman produk yang discan expose add-to-cart signals",
    }[locale])
    .replace("reachable", {
      en: "reachable",
      es: "accesible",
      pt: "acessivel",
      id: "bisa dibuka",
    }[locale]));
}

function foundMissing(found: boolean, locale: Locale) {
  if (found) return { en: "found", es: "encontrado", pt: "encontrado", id: "ditemukan" }[locale];
  return { en: "missing", es: "faltante", pt: "ausente", id: "hilang" }[locale];
}

function noProductSchemaLabel(locale: Locale) {
  return { en: "no Product schema found", es: "no se encontro Product schema", pt: "Product schema nao encontrado", id: "Product schema tidak ditemukan" }[locale];
}

function availabilityMissingLabel(locale: Locale) {
  return { en: "availability signal missing", es: "senal de disponibilidad faltante", pt: "sinal de disponibilidade ausente", id: "sinyal availability hilang" }[locale];
}

function paymentProviderMissingLabel(locale: Locale) {
  return { en: "no known local payment provider detected", es: "no se detecto proveedor local conocido", pt: "nenhum provedor local conhecido detectado", id: "provider pembayaran lokal tidak terdeteksi" }[locale];
}
