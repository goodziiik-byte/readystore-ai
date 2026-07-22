import type { Locale } from "@/lib/i18n";

type LegalPageCopy = {
  back: string;
  updated: string;
  sections: Array<{
    title: string;
    body: string;
  }>;
  contactLabel: string;
};

export const privacyCopy: Record<Locale, LegalPageCopy> = {
  en: {
    back: "Back to Readystore AI",
    updated: "Last updated: July 14, 2026",
    sections: [
      { title: "What we collect", body: "When you scan a store, Readystore AI stores the submitted domain, public scan result, readiness score, detected signals, and timestamp. If you request a report, we also store your email address and report delivery status." },
      { title: "Product analytics", body: "We store basic first-party event data such as page path, locale, submitted domain, UTM campaign parameters, scan status, and PDF request status so we can understand whether the scanner is working. We do not use third-party advertising pixels on the scanner flow." },
      { title: "What we scan", body: "We scan public storefront pages only. We do not log in, submit checkout forms, collect passwords, or access private store data." },
      { title: "How we use your email", body: "We use your email to send the requested PDF report, confirm early access, and announce the product launch. We do not sell your email or send unrelated marketing." },
      { title: "Subprocessors", body: "We use Vercel for hosting, Supabase for database storage, and Resend for transactional email delivery." },
    ],
    contactLabel: "Questions or deletion requests:",
  },
  es: {
    back: "Volver a Readystore AI",
    updated: "Actualizado: 14 de julio de 2026",
    sections: [
      { title: "Que recopilamos", body: "Cuando escaneas una tienda, Readystore AI guarda el dominio enviado, el resultado publico del scan, el readiness score, las senales detectadas y la fecha. Si pides un reporte, tambien guardamos tu email y el estado de entrega." },
      { title: "Analitica de producto", body: "Guardamos eventos basicos first-party como ruta de pagina, idioma, dominio enviado, parametros UTM, estado del scan y estado de solicitud del PDF para entender si el scanner funciona. No usamos pixeles publicitarios de terceros en el flujo del scanner." },
      { title: "Que escaneamos", body: "Escaneamos solo paginas publicas de la tienda. No iniciamos sesion, no enviamos formularios de checkout, no recopilamos passwords y no accedemos a datos privados." },
      { title: "Como usamos tu email", body: "Usamos tu email para enviar el PDF solicitado, confirmar early access y anunciar el lanzamiento del producto. No vendemos tu email ni enviamos marketing no relacionado." },
      { title: "Subprocesadores", body: "Usamos Vercel para hosting, Supabase para base de datos y Resend para entrega de emails transaccionales." },
    ],
    contactLabel: "Preguntas o solicitudes de eliminacion:",
  },
  pt: {
    back: "Voltar para Readystore AI",
    updated: "Atualizado em: 14 de julho de 2026",
    sections: [
      { title: "O que coletamos", body: "Quando voce escaneia uma loja, o Readystore AI armazena o dominio enviado, o resultado publico do scan, o readiness score, os sinais detectados e a data. Se voce pedir um relatorio, tambem armazenamos seu email e o status de envio." },
      { title: "Analitica de produto", body: "Armazenamos eventos basicos first-party como caminho da pagina, idioma, dominio enviado, parametros UTM, status do scan e status do pedido de PDF para entender se o scanner esta funcionando. Nao usamos pixels de publicidade de terceiros no fluxo do scanner." },
      { title: "O que escaneamos", body: "Escaneamos apenas paginas publicas da loja. Nao fazemos login, nao enviamos formularios de checkout, nao coletamos senhas e nao acessamos dados privados." },
      { title: "Como usamos seu email", body: "Usamos seu email para enviar o PDF solicitado, confirmar early access e anunciar o lancamento do produto. Nao vendemos seu email nem enviamos marketing nao relacionado." },
      { title: "Subprocessadores", body: "Usamos Vercel para hospedagem, Supabase para armazenamento de dados e Resend para entrega de emails transacionais." },
    ],
    contactLabel: "Perguntas ou pedidos de exclusao:",
  },
  id: {
    back: "Kembali ke Readystore AI",
    updated: "Terakhir diperbarui: 14 Juli 2026",
    sections: [
      { title: "Data yang kami simpan", body: "Saat Anda melakukan scan toko, Readystore AI menyimpan domain yang dikirim, hasil scan publik, readiness score, sinyal yang terdeteksi, dan timestamp. Jika Anda meminta report, kami juga menyimpan alamat email dan status pengiriman report." },
      { title: "Product analytics", body: "Kami menyimpan event first-party dasar seperti path halaman, locale, domain yang dikirim, parameter UTM, status scan, dan status request PDF agar kami tahu apakah scanner berjalan baik. Kami tidak memakai pixel iklan pihak ketiga di alur scanner." },
      { title: "Apa yang kami scan", body: "Kami hanya scan halaman publik storefront. Kami tidak login, tidak submit form checkout, tidak mengumpulkan password, dan tidak mengakses data private toko." },
      { title: "Bagaimana kami memakai email", body: "Kami memakai email Anda untuk mengirim PDF report, mengonfirmasi early access, dan mengumumkan product launch. Kami tidak menjual email Anda atau mengirim marketing yang tidak relevan." },
      { title: "Subprocessors", body: "Kami memakai Vercel untuk hosting, Supabase untuk database, dan Resend untuk pengiriman email transaksional." },
    ],
    contactLabel: "Pertanyaan atau permintaan penghapusan:",
  },
};

export const termsCopy: Record<Locale, LegalPageCopy> = {
  en: {
    back: "Back to Readystore AI",
    updated: "Last updated: July 14, 2026",
    sections: [
      { title: "Service", body: "Readystore AI provides an AI readiness scan for WooCommerce and ecommerce storefronts. The report is a diagnostic aid, not a guarantee of search ranking, AI recommendation, traffic, conversion, or revenue." },
      { title: "Public pages only", body: "You should only scan websites you own, operate, or are authorized to test. The scanner performs safe public-page requests and does not submit checkout, login, or payment forms." },
      { title: "Accuracy", body: "Scan results depend on public site availability, crawler access, server responses, and current detector logic. Some sites may block automated requests or expose different data to different visitors." },
      { title: "Early access", body: "Joining the waitlist does not create a paid subscription. Plugin availability, pricing, and functionality may change before launch." },
    ],
    contactLabel: "Questions:",
  },
  es: {
    back: "Volver a Readystore AI",
    updated: "Actualizado: 14 de julio de 2026",
    sections: [
      { title: "Servicio", body: "Readystore AI ofrece un scan de AI readiness para WooCommerce y tiendas ecommerce. El reporte es una herramienta de diagnostico, no una garantia de ranking, recomendacion por IA, trafico, conversion o ingresos." },
      { title: "Solo paginas publicas", body: "Debes escanear solo sitios que posees, operas o tienes autorizacion para probar. El scanner hace requests seguros a paginas publicas y no envia formularios de checkout, login o pago." },
      { title: "Precision", body: "Los resultados dependen de la disponibilidad publica del sitio, acceso para crawlers, respuestas del servidor y la logica actual del detector. Algunos sitios pueden bloquear requests automatizados o mostrar datos distintos a visitantes distintos." },
      { title: "Early access", body: "Unirse a la waitlist no crea una suscripcion paga. Disponibilidad, pricing y funcionalidad del plugin pueden cambiar antes del lanzamiento." },
    ],
    contactLabel: "Preguntas:",
  },
  pt: {
    back: "Voltar para Readystore AI",
    updated: "Atualizado em: 14 de julho de 2026",
    sections: [
      { title: "Servico", body: "Readystore AI oferece um scan de AI readiness para WooCommerce e lojas ecommerce. O relatorio e uma ferramenta de diagnostico, nao uma garantia de ranking, recomendacao por IA, trafego, conversao ou receita." },
      { title: "Apenas paginas publicas", body: "Voce deve escanear apenas sites que possui, opera ou tem autorizacao para testar. O scanner faz requests seguros a paginas publicas e nao envia formularios de checkout, login ou pagamento." },
      { title: "Precisao", body: "Os resultados dependem da disponibilidade publica do site, acesso para crawlers, respostas do servidor e logica atual do detector. Alguns sites podem bloquear requests automatizados ou mostrar dados diferentes para visitantes diferentes." },
      { title: "Early access", body: "Entrar na waitlist nao cria uma assinatura paga. Disponibilidade, preco e funcionalidade do plugin podem mudar antes do lancamento." },
    ],
    contactLabel: "Perguntas:",
  },
  id: {
    back: "Kembali ke Readystore AI",
    updated: "Terakhir diperbarui: 14 Juli 2026",
    sections: [
      { title: "Layanan", body: "Readystore AI menyediakan AI readiness scan untuk WooCommerce dan ecommerce storefronts. Report ini adalah alat diagnosis, bukan jaminan ranking, rekomendasi AI, traffic, conversion, atau revenue." },
      { title: "Hanya halaman publik", body: "Anda sebaiknya hanya scan website yang Anda miliki, operasikan, atau diizinkan untuk test. Scanner melakukan request aman ke halaman publik dan tidak submit form checkout, login, atau pembayaran." },
      { title: "Akurasi", body: "Hasil scan bergantung pada ketersediaan publik website, akses crawler, respons server, dan logic detector saat ini. Beberapa website dapat memblokir automated requests atau menampilkan data berbeda ke visitor berbeda." },
      { title: "Early access", body: "Bergabung ke waitlist tidak membuat paid subscription. Ketersediaan plugin, pricing, dan functionality dapat berubah sebelum launch." },
    ],
    contactLabel: "Pertanyaan:",
  },
};
