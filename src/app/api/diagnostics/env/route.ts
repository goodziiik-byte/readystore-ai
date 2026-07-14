import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    resendApiKey: Boolean(process.env.RESEND_API_KEY),
    reportFromEmail: Boolean(process.env.REPORT_FROM_EMAIL),
    reportReplyTo: Boolean(process.env.REPORT_REPLY_TO),
    supabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL),
    supabaseServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY),
    siteUrl: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
    runtime: "vercel-node",
  });
}
