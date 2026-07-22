import type { ScanResult } from "@/lib/scanner/types";
import { defaultLocale, isLocale, localeMarkets, type Locale } from "@/lib/i18n";
import {
  createLeadAndReportRequest,
  markLeadReportSent,
  markReportFailed,
  markReportSent,
  sendReportEmail,
  trackEvent,
} from "@/lib/server/integrations";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const result = body.result as ScanResult | undefined;
    const locale: Locale = typeof body.locale === "string" && isLocale(body.locale) ? body.locale : defaultLocale;
    const market = typeof body.market === "string" ? body.market : localeMarkets[locale];
    const source = typeof body.source === "string" ? body.source : `scanner_report_${locale}`;
    const attribution = {
      utm_source: typeof body.utm_source === "string" ? body.utm_source : undefined,
      utm_medium: typeof body.utm_medium === "string" ? body.utm_medium : undefined,
      utm_campaign: typeof body.utm_campaign === "string" ? body.utm_campaign : undefined,
      utm_content: typeof body.utm_content === "string" ? body.utm_content : undefined,
    };

    if (!isEmail(email)) {
      return NextResponse.json({ error: { message: "Enter a valid email address." } }, { status: 400 });
    }

    if (!result?.scanId || typeof result.score !== "number") {
      return NextResponse.json({ error: { message: "Scan result is missing." } }, { status: 400 });
    }

    const { domain, lead, reportRequest } = await createLeadAndReportRequest({
      email,
      result,
      locale,
      market,
      source,
      ...attribution,
    });

    trackEvent({
      name: "pdf_requested",
      domain,
      locale,
      market,
      ...attribution,
      metadata: { email_domain: email.split("@")[1] ?? "unknown" },
    }).catch((error) => console.error("Unable to track PDF request", error));

    try {
      await sendReportEmail(email, domain, result, locale);
      await Promise.all([
        markReportSent(reportRequest.id),
        markLeadReportSent(lead.id),
      ]);
      trackEvent({
        name: "pdf_sent",
        domain,
        locale,
        market,
        ...attribution,
        metadata: { email_domain: email.split("@")[1] ?? "unknown" },
      }).catch((error) => console.error("Unable to track PDF sent", error));
    } catch (error) {
      await markReportFailed(reportRequest.id, error instanceof Error ? error.message : "Unable to send email.");
      trackEvent({
        name: "pdf_failed",
        domain,
        locale,
        market,
        ...attribution,
        metadata: { message: error instanceof Error ? error.message.slice(0, 300) : "Unable to send email." },
      }).catch((trackError) => console.error("Unable to track PDF failure", trackError));
      throw error;
    }

    return NextResponse.json({
      ok: true,
      leadId: lead.id,
      reportRequestId: reportRequest.id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to send this report.";

    return NextResponse.json(
      {
        error: {
          message,
        },
      },
      { status: 500 },
    );
  }
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
