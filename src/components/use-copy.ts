"use client"

import { useScan } from "@/components/scan-context"
import { getDictionary } from "@/lib/i18n"

export function useCopy() {
  const { locale } = useScan()
  return getDictionary(locale)
}
