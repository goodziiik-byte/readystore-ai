import { defaultLocale, isLocale, localeMarkets, type Locale } from "@/lib/i18n";
import { trackEvent, type AnalyticsEventInput } from "@/lib/server/integrations";
import { NextResponse } from "next/server";

const allowedEvents = new Set([
  "landing_view",
  "report_view",
  "scan_cta_clicked",
  "scan_started",
  "scan_success",
  "scan_error",
  "pdf_requested",
  "pdf_sent",
  "pdf_failed",
]);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" && allowedEvents.has(body.name) ? body.name : "";

    if (!name) {
      return NextResponse.json({ ok: true });
    }

    const locale: Locale = typeof body.locale === "string" && isLocale(body.locale) ? body.locale : defaultLocale;
    const event: AnalyticsEventInput = {
      name,
      domain: typeof body.domain === "string" ? body.domain : undefined,
      locale,
      market: typeof body.market === "string" ? body.market : localeMarkets[locale],
      sessionId: typeof body.sessionId === "string" ? body.sessionId : undefined,
      path: typeof body.path === "string" ? body.path : undefined,
      referrer: typeof body.referrer === "string" ? body.referrer : undefined,
      utm_source: typeof body.utm_source === "string" ? body.utm_source : undefined,
      utm_medium: typeof body.utm_medium === "string" ? body.utm_medium : undefined,
      utm_campaign: typeof body.utm_campaign === "string" ? body.utm_campaign : undefined,
      utm_content: typeof body.utm_content === "string" ? body.utm_content : undefined,
      metadata: isPlainRecord(body.metadata) ? body.metadata : undefined,
    };

    await trackEvent(event);
  } catch (error) {
    console.error("Unable to track analytics event", error);
  }

  return NextResponse.json({ ok: true });
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
