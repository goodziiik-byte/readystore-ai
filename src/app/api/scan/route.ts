import { scanStore } from "@/lib/scanner/scan";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { persistScan } from "@/lib/server/integrations";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const url = typeof body.url === "string" ? body.url : "";
    const locale: Locale = typeof body.locale === "string" && isLocale(body.locale) ? body.locale : defaultLocale;
    const result = await scanStore(url);

    persistScan(result, locale).catch((error) => {
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
