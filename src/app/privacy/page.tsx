import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <section className="legal-card">
        <Link href="/">Back to Readystore AI</Link>
        <h1>Privacy Policy</h1>
        <p>Last updated: July 14, 2026</p>

        <h2>What we collect</h2>
        <p>
          When you scan a store, Readystore AI stores the submitted domain, public scan result,
          readiness score, detected signals, and timestamp. If you request a report, we also store
          your email address and report delivery status.
        </p>

        <h2>What we scan</h2>
        <p>
          We scan public storefront pages only. We do not log in, submit checkout forms, collect
          passwords, or access private store data.
        </p>

        <h2>How we use your email</h2>
        <p>
          We use your email to send the requested PDF report, confirm early access, and announce
          the product launch. We do not sell your email or send unrelated marketing.
        </p>

        <h2>Subprocessors</h2>
        <p>
          We use Vercel for hosting, Supabase for database storage, and Resend for transactional
          email delivery.
        </p>

        <h2>Contact</h2>
        <p>
          Questions or deletion requests: <a href="mailto:hello@readystoreai.com">hello@readystoreai.com</a>
        </p>
      </section>
    </main>
  );
}
