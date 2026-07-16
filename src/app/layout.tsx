import type { Metadata } from "next";
import "./styles.css";

const siteUrl = "https://www.readystoreai.com";
const title = "Readystore AI | AI Readiness Scanner for WooCommerce";
const description = "Scan whether ChatGPT, Google AI, and shopping agents can understand your WooCommerce products, prices, stock, shipping, returns, payments, and checkout signals.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: "Readystore AI",
  authors: [{ name: "Readystore Labs", url: siteUrl }],
  creator: "Readystore Labs",
  publisher: "Readystore Labs",
  category: "ecommerce",
  keywords: [
    "WooCommerce AI readiness",
    "agentic commerce",
    "AI shopping agents",
    "WooCommerce scanner",
    "llms.txt",
    "structured data",
    "ecommerce SEO",
  ],
  alternates: {
    canonical: "/",
    languages: {
      en: "/en",
      es: "/es",
      pt: "/pt",
      id: "/id",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Readystore AI",
    title,
    description,
    locale: "en_US",
    images: [
      {
        url: "/og/readystore-og.png",
        width: 1200,
        height: 630,
        alt: "Readystore AI scanner preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og/readystore-og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Readystore Labs",
      url: siteUrl,
      email: "hello@readystoreai.com",
      brand: {
        "@type": "Brand",
        name: "Readystore AI",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Readystore AI",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: siteUrl,
      description,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/PreOrder",
      },
      publisher: {
        "@type": "Organization",
        name: "Readystore Labs",
      },
    },
  ];

  return (
    <html lang="en">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
