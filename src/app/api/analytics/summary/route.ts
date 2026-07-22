import { getRecentAnalyticsEvents } from "@/lib/server/integrations";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const token = process.env.ANALYTICS_READ_KEY;
  const key = new URL(request.url).searchParams.get("key");

  if (!token || key !== token) {
    return NextResponse.json({ error: { message: "Not found." } }, { status: 404 });
  }

  const events = await getRecentAnalyticsEvents();
  const byName = countBy(events, (event) => event.name);
  const byCampaign = countBy(events, (event) => event.utm_campaign ?? "unknown");
  const funnelByCampaign = events.reduce<Record<string, Record<string, number>>>((acc, event) => {
    const campaign = event.utm_campaign ?? "unknown";
    acc[campaign] ??= {};
    acc[campaign][event.name] = (acc[campaign][event.name] ?? 0) + 1;
    return acc;
  }, {});

  return NextResponse.json({
    totalEvents: events.length,
    byName,
    byCampaign,
    funnelByCampaign,
    latest: events.slice(0, 25),
  });
}

function countBy<T>(items: T[], getKey: (item: T) => string) {
  return items.reduce<Record<string, number>>((acc, item) => {
    const key = getKey(item);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}
