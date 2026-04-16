export type CurrencyOption = { code: string; symbol: string; name: string; locale: string }

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: "INR", symbol: "₹", name: "Indian Rupee", locale: "en-IN" },
  { code: "USD", symbol: "$", name: "US Dollar", locale: "en-US" },
  { code: "EUR", symbol: "€", name: "Euro", locale: "de-DE" },
  { code: "GBP", symbol: "£", name: "British Pound", locale: "en-GB" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", locale: "ja-JP" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", locale: "en-AU" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", locale: "en-CA" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar", locale: "en-SG" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", locale: "zh-CN" },
  { code: "ZAR", symbol: "R", name: "South African Rand", locale: "en-ZA" },
  { code: "RUB", symbol: "₽", name: "Russian Ruble", locale: "ru-RU" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira", locale: "tr-TR"},
  { code: "RON", symbol: "L", name: "Romanian Leu", locale: "ro-RO"},
  { code: "BRL", symbol: "R$", name: "Brazilian Real", locale: "pt-BR"},
]

export function getDefaultCurrencyByLocale(): string {
  const locales = [...(navigator.languages || [navigator.language])]
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || ""
  if (timeZone === "Asia/Kolkata" || locales.some((l) => ["en-IN", "hi-IN", "kn-IN"].includes(l))) return "INR"
  if (timeZone === "America/Sao_Paulo" || locales.includes("pt-BR")) return "BRL"
  if (timeZone === "Asia/Tokyo" || locales.includes("ja-JP")) return "JPY"
  if (timeZone.startsWith("Europe/Moscow") || locales.includes("ru-RU")) return "RUB"
  if (timeZone === "Europe/Bucharest" || locales.includes("ro-RO")) return "RON"
  if (timeZone === "Europe/Paris" || timeZone === "Europe/Spain"  || timeZone === "Europe/Berlin" || locales.some((l) => ["fr-FR", "en-ES", "es-ES"].includes(l))) return "EUR"
  if (timeZone === "Australia/Sydney" || locales.includes("en-AU")) return "AUD"
  if (timeZone.startsWith("Canada/") || locales.includes("en-CA")) return "CAD"
  if (timeZone === "Asia/Singapore" || locales.includes("en-SG")) return "SGD"
  if (timeZone === "Asia/Shanghai" || locales.includes("zh-CN")) return "CNY"
  if (timeZone === "Africa/Johannesburg" || locales.includes("en-ZA")) return "ZAR"
  if (timeZone === "Europe/Istanbul" || locales.includes("tr-TR")) return "TRY"
  if (timeZone === "Europe/London") return "GBP"
  if (timeZone.startsWith("America/")) return "USD"
  return "INR"
}

export function getCurrencySymbol(code: string): string {
  return CURRENCY_OPTIONS.find((opt) => opt.code === code)?.symbol ?? "$"
}

export function formatNumberForDisplay(num: string, code: string): string {
  const opt = CURRENCY_OPTIONS.find((o) => o.code === code)
  return num ? new Intl.NumberFormat(opt?.locale ?? "en-US").format(Number(num)) : ""
}

export const MAX_LOAN_AMOUNT = 1e15
export const MAX_INTEREST_RATE = 100
export const MAX_LOAN_TENURE_YEARS = 100
