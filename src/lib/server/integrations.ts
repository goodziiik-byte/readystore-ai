import type { ScanResult } from "@/lib/scanner/types";

type LeadInput = {
  email: string;
  result: ScanResult;
  locale?: string;
  market?: string;
  source?: string;
};

type StoredLead = {
  id: string;
  email: string;
  domain: string | null;
  scan_id: string | null;
};

type ReportRequest = {
  id: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

export function integrationsConfigured() {
  return {
    resend: Boolean(process.env.RESEND_API_KEY),
    supabase: Boolean(supabaseUrl && supabaseServiceKey),
  };
}

export async function persistScan(result: ScanResult) {
  if (!supabaseUrl || !supabaseServiceKey) {
    return;
  }

  await supabaseRequest("scans", {
    method: "POST",
    body: {
      id: result.scanId,
      domain: domainFromUrl(result.finalUrl || result.requestedUrl),
      final_url: result.finalUrl,
      score: result.score,
      platform: result.platform.woocommerce ? "woocommerce" : result.platform.wordpress ? "wordpress" : "unknown",
      payment_level: result.paymentVisibility.level,
      payment_label: result.paymentVisibility.label,
      result,
      source: "scanner",
      locale: "en",
    },
    prefer: "resolution=merge-duplicates",
    onConflict: "id",
  });
}

export async function createLeadAndReportRequest(input: LeadInput) {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase is not configured.");
  }

  const domain = domainFromUrl(input.result.finalUrl || input.result.requestedUrl);

  const existingLeads = await supabaseGet<StoredLead[]>(
    `leads?select=id,email,domain,scan_id&email=eq.${encodeURIComponent(input.email)}&domain=eq.${encodeURIComponent(domain)}&limit=1`,
  );

  const lead = existingLeads[0] ?? (await supabaseRequest<StoredLead[]>("leads", {
    method: "POST",
    body: {
      email: input.email,
      domain,
      scan_id: input.result.scanId,
      score: input.result.score,
      locale: input.locale ?? "en",
      market: input.market,
      source: input.source ?? "scanner_report",
      waitlist_status: "joined",
    },
    prefer: "return=representation",
  }))[0];

  const reportRequests = await supabaseRequest<ReportRequest[]>("report_requests", {
    method: "POST",
    body: {
      lead_id: lead.id,
      scan_id: input.result.scanId,
      email: input.email,
      domain,
      status: "queued",
    },
    prefer: "return=representation",
  });

  return { domain, lead, reportRequest: reportRequests[0] };
}

export async function markReportSent(reportRequestId: string) {
  if (!supabaseUrl || !supabaseServiceKey) {
    return;
  }

  await supabaseRequest(`report_requests?id=eq.${reportRequestId}`, {
    method: "PATCH",
    body: {
      status: "sent",
      sent_at: new Date().toISOString(),
    },
  });
}

export async function markLeadReportSent(leadId: string) {
  if (!supabaseUrl || !supabaseServiceKey) {
    return;
  }

  await supabaseRequest(`leads?id=eq.${leadId}`, {
    method: "PATCH",
    body: {
      report_sent_at: new Date().toISOString(),
    },
  });
}

export async function markReportFailed(reportRequestId: string, error: string) {
  if (!supabaseUrl || !supabaseServiceKey) {
    return;
  }

  await supabaseRequest(`report_requests?id=eq.${reportRequestId}`, {
    method: "PATCH",
    body: {
      status: "failed",
      error: error.slice(0, 500),
    },
  });
}

export async function sendReportEmail(email: string, domain: string, result: ScanResult) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.REPORT_FROM_EMAIL ?? "Readystore AI <reports@readystoreai.com>";
  const replyTo = process.env.REPORT_REPLY_TO;
  const unsubscribeEmail = replyTo ?? "reports@readystoreai.com";
  const unsubscribeUrl = `mailto:${unsubscribeEmail}?subject=Unsubscribe%20Readystore%20AI`;

  if (!apiKey) {
    throw new Error("Resend is not configured.");
  }

  const pdf = buildPdfReport(result);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      reply_to: replyTo,
      subject: `AI Readiness Report for ${domain}`,
      headers: {
        "List-Unsubscribe": `<${unsubscribeUrl}>`,
      },
      html: buildEmailHtml(domain, result, unsubscribeUrl),
      attachments: [
        {
          filename: `readystore-ai-report-${domain}.pdf`,
          content: pdf.toString("base64"),
        },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend failed: ${body}`);
  }
}

async function supabaseRequest<T = unknown>(
  path: string,
  options: {
    method: "POST" | "PATCH";
    body: Record<string, unknown>;
    prefer?: string;
    onConflict?: string;
  },
): Promise<T> {
  const query = options.onConflict ? `${path.includes("?") ? "&" : "?"}on_conflict=${options.onConflict}` : "";
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}${query}`, {
    method: options.method,
    headers: {
      apikey: supabaseServiceKey ?? "",
      Authorization: `Bearer ${supabaseServiceKey}`,
      "Content-Type": "application/json",
      Prefer: options.prefer ?? "return=minimal",
    },
    body: JSON.stringify(options.body),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase request failed: ${body}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

async function supabaseGet<T = unknown>(path: string): Promise<T> {
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    method: "GET",
    headers: {
      apikey: supabaseServiceKey ?? "",
      Authorization: `Bearer ${supabaseServiceKey}`,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase request failed: ${body}`);
  }

  return response.json() as Promise<T>;
}

function buildEmailHtml(domain: string, result: ScanResult, unsubscribeUrl: string) {
  const fixes = result.priorityFixes.slice(0, 3).map((fix) => `<li><strong>${escapeHtml(fix.title)}</strong> — ${escapeHtml(fix.reason)}</li>`).join("");

  return `
    <div style="font-family:Arial,sans-serif;color:#172033;line-height:1.5">
      <h1 style="margin:0 0 12px">Your AI Readiness Report</h1>
      <p style="margin:0 0 16px">Readystore AI scanned <strong>${escapeHtml(domain)}</strong>.</p>
      <div style="padding:16px;border:1px solid #ded6c7;border-radius:8px;margin:16px 0">
        <p style="margin:0;color:#64748b">AI clarity score</p>
        <p style="font-size:42px;font-weight:700;margin:4px 0">${result.score.toFixed(1)}/10</p>
        <p style="margin:0">${escapeHtml(result.merchantSummary.headline)}</p>
      </div>
      <h2 style="font-size:18px">Top fixes</h2>
      <ul>${fixes}</ul>
      <p>The PDF report is attached. Reply to this email if you want early access to the WooCommerce plugin.</p>
      <p style="margin-top:24px;color:#64748b;font-size:12px">
        No spam. We will only send the product launch announcement and early-access updates.
        <a href="${unsubscribeUrl}" style="color:#0c6b61">Unsubscribe</a>.
      </p>
    </div>
  `;
}

function buildPdfReport(result: ScanResult) {
  const lines = [
    "Readystore AI Report",
    "",
    `Store: ${domainFromUrl(result.finalUrl || result.requestedUrl)}`,
    `Score: ${result.score.toFixed(1)}/10`,
    "",
    result.merchantSummary.headline,
    result.merchantSummary.body,
    "",
    "Top fixes:",
    ...result.priorityFixes.slice(0, 5).map((fix, index) => `${index + 1}. ${fix.title} (${fix.impact} impact)`),
    "",
    "Readiness layers:",
    ...result.readinessLayers.map((layer) => `${layer.title}: ${layer.status} | ${layer.estimatedLift}`),
  ];

  return minimalPdf(lines);
}

function minimalPdf(lines: string[]) {
  const escapedLines = lines.map((line) => pdfEscape(line).slice(0, 110));
  const textCommands = escapedLines.map((line, index) => {
    const y = 760 - index * 18;
    return `BT /F1 11 Tf 50 ${y} Td (${line}) Tj ET`;
  }).join("\n");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(textCommands)} >>\nstream\n${textCommands}\nendstream`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(pdf);
}

function domainFromUrl(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0] || "unknown-domain";
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function pdfEscape(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
}
