import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="legal-page">
      <section className="legal-card">
        <Link href="/">Back to Readystore AI</Link>
        <h1>Terms of Use</h1>
        <p>Last updated: July 14, 2026</p>

        <h2>Service</h2>
        <p>
          Readystore AI provides an AI readiness scan for WooCommerce and ecommerce storefronts.
          The report is a diagnostic aid, not a guarantee of search ranking, AI recommendation,
          traffic, conversion, or revenue.
        </p>

        <h2>Public pages only</h2>
        <p>
          You should only scan websites you own, operate, or are authorized to test. The scanner
          performs safe public-page requests and does not submit checkout, login, or payment forms.
        </p>

        <h2>Accuracy</h2>
        <p>
          Scan results depend on public site availability, crawler access, server responses, and
          current detector logic. Some sites may block automated requests or expose different data
          to different visitors.
        </p>

        <h2>Early access</h2>
        <p>
          Joining the waitlist does not create a paid subscription. Plugin availability, pricing,
          and functionality may change before launch.
        </p>

        <h2>Contact</h2>
        <p>
          Questions: <a href="mailto:hello@readystoreai.com">hello@readystoreai.com</a>
        </p>
      </section>
    </main>
  );
}
