import { scanStore } from "@/lib/scanner/scan";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { persistScan } from "@/lib/server/integrations";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const url = typeof body.url === "string" ? body.url : "";
    const locale: Locale = typeof body.locale === "string" && isLocale(body.locale) ? body.locale : defaultLocale;
    const attribution = {
      utm_source: typeof body.utm_source === "string" ? body.utm_source : undefined,
      utm_medium: typeof body.utm_medium === "string" ? body.utm_medium : undefined,
      utm_campaign: typeof body.utm_campaign === "string" ? body.utm_campaign : undefined,
      utm_content: typeof body.utm_content === "string" ? body.utm_content : undefined,
    };
    const result = await scanStore(url);

    persistScan(result, locale, attribution).catch((error) => {
      console.error("Unable to persist scan", error);
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to scan this URL.";

    return NextResponse.json(
      {
        error: {
          message,
        },
      },
      { status: 400 },
    );
  }
}
