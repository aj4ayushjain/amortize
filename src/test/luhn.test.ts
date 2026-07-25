import { describe, it, expect } from "vitest"
import { passesLuhn, checkCreditCardNumber, digitsOnly, detectCardBrand } from "@/lib/luhn"

describe("passesLuhn", () => {
  it("accepts known-valid test numbers", () => {
    expect(passesLuhn("4111111111111111")).toBe(true)
    expect(passesLuhn("5555555555554444")).toBe(true)
    expect(passesLuhn("378282246310005")).toBe(true)
    expect(passesLuhn("6011111111111117")).toBe(true)
  })

  it("rejects a single-digit change", () => {
    expect(passesLuhn("4111111111111112")).toBe(false)
  })

  it("rejects too-short input", () => {
    expect(passesLuhn("1")).toBe(false)
  })
})

describe("checkCreditCardNumber", () => {
  it("strips spaces and dashes", () => {
    const r = checkCreditCardNumber("4111 1111-1111 1111")
    expect(r.status).toBe("valid")
    if (r.status === "valid") expect(r.digits).toBe("4111111111111111")
  })

  it("reports invalid length", () => {
    expect(checkCreditCardNumber("411111111111").status).toBe("invalid_length")
  })

  it("detects Visa brand when valid", () => {
    const r = checkCreditCardNumber("4111111111111111")
    expect(r.status).toBe("valid")
    if (r.status === "valid") expect(r.brand).toBe("Visa")
  })
})

describe("digitsOnly", () => {
  it("removes non-digits", () => {
    expect(digitsOnly("4532 0151-1283 0366")).toBe("4532015112830366")
  })
})

describe("detectCardBrand", () => {
  it("identifies Mastercard", () => {
    expect(detectCardBrand("5555555555554444")).toBe("Mastercard")
  })
})
