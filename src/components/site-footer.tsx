import { Mail, ScanLine } from "lucide-react"
import { defaultLocale, getDictionary, type Locale } from "@/lib/i18n"

export function SiteFooter({ locale = defaultLocale }: { locale?: Locale }) {
  const year = new Date().getFullYear()
  const copy = getDictionary(locale)
  const localePrefix = locale === defaultLocale ? "" : `/${locale}`

  return (
    <footer className="border-t border-border bg-navy text-navy-foreground">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row">
          <div className="max-w-xs">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-navy-foreground/10">
                <ScanLine className="size-4 text-lime" />
              </span>
              <span className="text-base font-semibold tracking-tight">
                Readystore<span className="text-lime"> AI</span>
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-navy-foreground/60">
              {copy.footer.body}
            </p>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <a
              href="mailto:hello@readystoreai.com"
              className="flex items-center gap-2 text-navy-foreground/70 transition-colors hover:text-navy-foreground"
            >
              <Mail className="size-4" />
              hello@readystoreai.com
            </a>
            <a href={`${localePrefix}/privacy`} className="text-navy-foreground/70 transition-colors hover:text-navy-foreground">
              {copy.footer.privacy}
            </a>
            <a href={`${localePrefix}/terms`} className="text-navy-foreground/70 transition-colors hover:text-navy-foreground">
              {copy.footer.terms}
            </a>
            <a href="/wordpress-plugin" className="text-navy-foreground/70 transition-colors hover:text-navy-foreground">
              WordPress plugin
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-navy-foreground/10 pt-6 text-xs text-navy-foreground/50">
          © {year} Readystore AI. {copy.footer.rights}
        </div>
      </div>
    </footer>
  )
}
