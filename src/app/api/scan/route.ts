import { scanStore } from "@/lib/scanner/scan";
import { persistScan } from "@/lib/server/integrations";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const url = typeof body.url === "string" ? body.url : "";
    const result = await scanStore(url);

    persistScan(result).catch((error) => {
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
