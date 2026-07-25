/** Strip spaces, dashes, and other non-digits. */
export function digitsOnly(input: string): string {
  return input.replace(/\D/g, "")
}

/** ISO/IEC 7812 lengths common for payment cards. */
export const VALID_CARD_LENGTHS = [13, 14, 15, 16, 17, 18, 19] as const

/** Luhn (mod 10) checksum — format check only, not account verification. */
export function passesLuhn(digits: string): boolean {
  if (!/^\d+$/.test(digits) || digits.length < 2) return false

  let sum = 0
  let doubleNext = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits.charCodeAt(i) - 48
    if (doubleNext) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
    doubleNext = !doubleNext
  }
  return sum % 10 === 0
}

export function detectCardBrand(digits: string): string | undefined {
  if (/^4\d{12}(\d{3}){0,2}$/.test(digits)) return "Visa"
  if (/^(5[1-5]|2[2-7]\d)\d{14}$/.test(digits)) return "Mastercard"
  if (/^3[47]\d{13}$/.test(digits)) return "American Express"
  if (/^6(?:011|5\d{2})\d{12}$/.test(digits)) return "Discover"
  if (/^3(?:0[0-5]|[68]\d)\d{11,16}$/.test(digits)) return "Diners Club"
  if (/^(?:2131|1800|35\d{3})\d{11}$/.test(digits)) return "JCB"
  return undefined
}

export type LuhnCheckResult =
  | { status: "empty" }
  | { status: "invalid_chars" }
  | { status: "invalid_length"; length: number }
  | { status: "invalid_luhn"; digits: string }
  | { status: "valid"; digits: string; brand?: string }

export function checkCreditCardNumber(input: string): LuhnCheckResult {
  const trimmed = input.trim()
  if (!trimmed) return { status: "empty" }

  if (/\D/.test(trimmed.replace(/[\s-]/g, ""))) {
    return { status: "invalid_chars" }
  }

  const digits = digitsOnly(trimmed)
  if (!digits) return { status: "empty" }

  if (!(VALID_CARD_LENGTHS as readonly number[]).includes(digits.length)) {
    return { status: "invalid_length", length: digits.length }
  }

  if (!passesLuhn(digits)) {
    return { status: "invalid_luhn", digits }
  }

  return { status: "valid", digits, brand: detectCardBrand(digits) }
}

/** Display helper: groups of 4 from the right (Amex-style 4-6-5 optional — keep simple 4-wide). */
export function formatCardNumberDisplay(digits: string): string {
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim()
}
