import type { ScanResult } from "@/lib/scanner/types";
import { defaultLocale, type Locale } from "@/lib/i18n";
import { displayImpact, displayPaymentLevel, displayStatus, getReportLocaleCopy, localizeScanResult } from "@/lib/report-localization";
import { Document, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer";

const colors = {
  ink: "#172033",
  muted: "#5f6b82",
  line: "#ded6c7",
  paper: "#fffdf8",
  cream: "#f6f3ec",
  teal: "#0c6b61",
  lime: "#d7ff63",
  red: "#991b1b",
  amber: "#92400e",
  green: "#166534",
};

export async function buildReportPdf(result: ScanResult, locale: Locale = defaultLocale) {
  return renderToBuffer(<ReportDocument result={localizeScanResult(result, locale)} locale={locale} />);
}

function ReportDocument({ result, locale }: { result: ScanResult; locale: Locale }) {
  const copy = getReportLocaleCopy(locale).pdf;
  const domain = domainFromUrl(result.finalUrl || result.requestedUrl);

  return (
    <Document title={`${copy.title} - ${domain}`} author="Readystore AI">
      <Page size="A4" style={styles.page}>
        <Header domain={domain} />
        <View style={styles.hero}>
          <View style={styles.heroCopy}>
            <Text style={styles.kicker}>{copy.kicker}</Text>
            <Text style={styles.title}>{copy.scoreTitle}</Text>
            <Text style={styles.body}>{result.merchantSummary.body}</Text>
          </View>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>{copy.scoreLabel}</Text>
            <Text style={styles.score}>{result.score.toFixed(1)}</Text>
            <Text style={styles.scoreOutOf}>/10</Text>
          </View>
        </View>

        <View style={styles.metricGrid}>
          <Metric label={copy.woocommerce} value={result.platform.woocommerce ? copy.confirmed : copy.unconfirmed} />
          <Metric label={copy.payment} value={displayPaymentLevel(result.paymentVisibility.level, locale)} />
          <Metric label={copy.productPages} value={`${result.productSummary.scanned}`} />
          <Metric label={copy.jsonLdBlocks} value={`${result.structuredData.jsonLdCount}`} />
        </View>

        <Section title={copy.readinessLayers}>
          <View style={styles.layerGrid}>
            {result.readinessLayers.map((layer) => (
              <View style={styles.layerCard} key={layer.id}>
                <View style={styles.layerTop}>
                  <Text style={styles.layerTitle}>{layer.title}</Text>
                  <Text style={[styles.statusPill, statusStyle(layer.status)]}>{displayStatus(layer.status, locale)}</Text>
                </View>
                <Text style={styles.smallBody}>{layer.whyItMatters}</Text>
                <Text style={styles.lift}>{copy.estLift}: {layer.estimatedLift}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title={copy.fixFirst}>
          <View style={styles.fixList}>
            {result.priorityFixes.slice(0, 5).map((fix, index) => (
              <View style={styles.fixRow} key={`${fix.title}-${index}`}>
                <Text style={styles.fixIndex}>{index + 1}</Text>
                <View style={styles.fixCopy}>
                  <Text style={styles.fixTitle}>{fix.title}</Text>
                  <Text style={styles.smallBody}>{fix.reason}</Text>
                </View>
                <Text style={[styles.impactPill, impactStyle(fix.impact)]}>{displayImpact(fix.impact, locale)}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Footer page={1} locale={locale} />
      </Page>

      <Page size="A4" style={styles.page}>
        <Header domain={domain} compact />

        <Section title={copy.productSummary}>
          <View style={styles.productGrid}>
            <Ratio label={copy.ratios[0]} value={result.productSummary.withPrice} total={result.productSummary.scanned} />
            <Ratio label={copy.ratios[1]} value={result.productSummary.withAvailability} total={result.productSummary.scanned} />
            <Ratio label={copy.ratios[2]} value={result.productSummary.withProductSchema} total={result.productSummary.scanned} />
            <Ratio label={copy.ratios[3]} value={result.productSummary.withOfferSchema} total={result.productSummary.scanned} />
            <Ratio label={copy.ratios[4]} value={result.productSummary.withAddToCart} total={result.productSummary.scanned} />
          </View>
        </Section>

        <View style={styles.twoColumns}>
          <Section title={copy.aiCan} compact>
            <BulletList items={result.aiCanUnderstand.slice(0, 6)} positive />
          </Section>
          <Section title={copy.aiMiss} compact>
            <BulletList items={result.aiMayMiss.slice(0, 6)} />
          </Section>
        </View>

        <Section title={copy.howHelp}>
          <View style={styles.valueBox}>
            <Text style={styles.valueTitle}>{copy.valueTitle}</Text>
            <Text style={styles.body}>
              {copy.valueBody}
            </Text>
            <View style={styles.valueGrid}>
              {copy.valueCards.map((card) => <MiniValue key={card.title} title={card.title} text={card.text} />)}
            </View>
          </View>
        </Section>

        <Footer page={2} locale={locale} />
      </Page>
    </Document>
  );
}

function Header({ domain, compact = false }: { domain: string; compact?: boolean }) {
  return (
    <View style={compact ? [styles.header, styles.headerCompact] : styles.header}>
      <View style={styles.brandRow}>
        <View style={styles.mark}><Text style={styles.markText}>R</Text></View>
        <View>
          <Text style={styles.brand}>Readystore AI</Text>
          <Text style={styles.brandSub}>Commerce visibility for AI shoppers</Text>
        </View>
      </View>
      <Text style={styles.domain}>{domain}</Text>
    </View>
  );
}

function Section({ title, children, compact = false }: { title: string; children: React.ReactNode; compact?: boolean }) {
  return (
    <View style={compact ? styles.sectionCompact : styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

function Ratio({ label, value, total }: { label: string; value: number; total: number }) {
  const pct = total > 0 ? value / total : 0;

  return (
    <View style={styles.ratioCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.ratioValue}>{value}/{total}</Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${Math.round(pct * 100)}%` }]} />
      </View>
    </View>
  );
}

function BulletList({ items, positive = false }: { items: string[]; positive?: boolean }) {
  return (
    <View style={styles.bulletList}>
      {items.map((item) => (
        <View style={styles.bulletRow} key={item}>
          <Text style={[styles.bulletDot, positive ? styles.dotPositive : styles.dotWarn]}>{positive ? "✓" : "!"}</Text>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function MiniValue({ title, text }: { title: string; text: string }) {
  return (
    <View style={styles.miniValue}>
      <Text style={styles.miniTitle}>{title}</Text>
      <Text style={styles.smallBody}>{text}</Text>
    </View>
  );
}

function Footer({ page, locale }: { page: number; locale: Locale }) {
  const copy = getReportLocaleCopy(locale).pdf;

  return (
    <View style={styles.footer} fixed>
      <Text>readystoreai.com</Text>
      <Text>{copy.footerPage} {page}</Text>
    </View>
  );
}

function statusStyle(status: string) {
  if (status === "strong") return styles.pillGood;
  if (status === "partial") return styles.pillMid;
  return styles.pillBad;
}

function impactStyle(impact: string) {
  if (impact === "high") return styles.impactHigh;
  if (impact === "medium") return styles.impactMedium;
  return styles.impactLow;
}

function domainFromUrl(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0] || "unknown-domain";
  }
}

const styles = StyleSheet.create({
  page: {
    padding: 34,
    backgroundColor: colors.cream,
    color: colors.ink,
    fontFamily: "Helvetica",
    fontSize: 10,
  },
  header: {
    marginBottom: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerCompact: {
    marginBottom: 16,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  mark: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  markText: {
    color: colors.lime,
    fontSize: 16,
    fontWeight: 700,
  },
  brand: {
    fontSize: 15,
    fontWeight: 700,
  },
  brandSub: {
    color: colors.muted,
    marginTop: 2,
  },
  domain: {
    color: colors.teal,
    fontSize: 12,
    fontWeight: 700,
  },
  hero: {
    border: `1 solid ${colors.ink}`,
    borderRadius: 8,
    backgroundColor: colors.paper,
    padding: 24,
    flexDirection: "row",
    gap: 18,
    marginBottom: 14,
  },
  heroCopy: {
    flex: 1,
  },
  kicker: {
    color: colors.teal,
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    fontSize: 34,
    lineHeight: 1.02,
    fontWeight: 700,
    marginBottom: 14,
  },
  body: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 1.45,
  },
  smallBody: {
    color: colors.muted,
    fontSize: 9,
    lineHeight: 1.35,
  },
  scoreCard: {
    width: 128,
    borderRadius: 8,
    backgroundColor: colors.ink,
    padding: 16,
    justifyContent: "center",
  },
  scoreLabel: {
    color: "#cbd5e1",
    fontSize: 9,
  },
  score: {
    color: colors.lime,
    fontSize: 48,
    fontWeight: 700,
    marginTop: 8,
  },
  scoreOutOf: {
    color: "#ffffff",
    fontSize: 14,
  },
  metricGrid: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  metric: {
    flex: 1,
    border: `1 solid ${colors.line}`,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    padding: 12,
  },
  metricLabel: {
    color: colors.muted,
    fontSize: 9,
  },
  metricValue: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: 700,
  },
  section: {
    marginTop: 12,
  },
  sectionCompact: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 700,
    marginBottom: 10,
  },
  layerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  layerCard: {
    width: "48.8%",
    border: `1 solid ${colors.line}`,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    padding: 12,
  },
  layerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 8,
  },
  layerTitle: {
    maxWidth: 160,
    fontSize: 11,
    fontWeight: 700,
  },
  statusPill: {
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 7,
    fontSize: 8,
    fontWeight: 700,
    textTransform: "uppercase",
  },
  pillGood: {
    backgroundColor: "#dcfce7",
    color: colors.green,
  },
  pillMid: {
    backgroundColor: "#fef3c7",
    color: colors.amber,
  },
  pillBad: {
    backgroundColor: "#fee2e2",
    color: colors.red,
  },
  lift: {
    color: colors.teal,
    fontSize: 9,
    fontWeight: 700,
    marginTop: 8,
  },
  fixList: {
    gap: 7,
  },
  fixRow: {
    border: `1 solid ${colors.line}`,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  fixIndex: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.lime,
    textAlign: "center",
    paddingTop: 6,
    fontWeight: 700,
  },
  fixCopy: {
    flex: 1,
  },
  fixTitle: {
    fontSize: 10.5,
    fontWeight: 700,
    marginBottom: 3,
  },
  impactPill: {
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontSize: 8,
    fontWeight: 700,
    textTransform: "uppercase",
  },
  impactHigh: {
    backgroundColor: "#fee2e2",
    color: colors.red,
  },
  impactMedium: {
    backgroundColor: "#fef3c7",
    color: colors.amber,
  },
  impactLow: {
    backgroundColor: "#dcfce7",
    color: colors.green,
  },
  productGrid: {
    flexDirection: "row",
    gap: 8,
  },
  ratioCard: {
    flex: 1,
    border: `1 solid ${colors.line}`,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    padding: 10,
  },
  ratioValue: {
    fontSize: 18,
    fontWeight: 700,
    marginTop: 6,
    marginBottom: 8,
  },
  barTrack: {
    height: 7,
    borderRadius: 999,
    backgroundColor: "#e5e7eb",
  },
  barFill: {
    height: 7,
    borderRadius: 999,
    backgroundColor: colors.teal,
  },
  twoColumns: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
  },
  bulletList: {
    border: `1 solid ${colors.line}`,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    padding: 12,
    gap: 8,
  },
  bulletRow: {
    flexDirection: "row",
    gap: 8,
  },
  bulletDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 9,
    paddingTop: 3,
    fontWeight: 700,
  },
  dotPositive: {
    backgroundColor: "#dcfce7",
    color: colors.green,
  },
  dotWarn: {
    backgroundColor: "#fef3c7",
    color: colors.amber,
  },
  bulletText: {
    flex: 1,
    color: colors.muted,
    fontSize: 9.5,
    lineHeight: 1.3,
  },
  valueBox: {
    border: `1 solid ${colors.ink}`,
    borderRadius: 8,
    backgroundColor: colors.paper,
    padding: 18,
  },
  valueTitle: {
    fontSize: 21,
    fontWeight: 700,
    marginBottom: 8,
  },
  valueGrid: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  miniValue: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: "#ecfeff",
    padding: 10,
  },
  miniTitle: {
    color: "#155e75",
    fontWeight: 700,
    marginBottom: 4,
  },
  footer: {
    position: "absolute",
    left: 34,
    right: 34,
    bottom: 20,
    borderTop: `1 solid ${colors.line}`,
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    color: colors.muted,
    fontSize: 8,
  },
});
