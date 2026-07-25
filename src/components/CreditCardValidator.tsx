import React, { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { applySeoTags, SITE_URL } from "@/lib/seo"
import { CALCULATOR_MAIN_CLASS } from "@/lib/layout"
import { UseOurCalculators } from "@/components/UseOurCalculators"
import {
  checkCreditCardNumber,
  digitsOnly,
  formatCardNumberDisplay,
  type LuhnCheckResult,
} from "@/lib/luhn"

const MAX_CARD_DIGITS = 19

export function CreditCardValidator() {
  const [cardNumber, setCardNumber] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [result, setResult] = useState<LuhnCheckResult | null>(null)

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const raw = digitsOnly(ev.target.value).slice(0, MAX_CARD_DIGITS)
    setCardNumber(raw)
    setError("")
    setResult(null)
  }

  const validate = () => {
    const checked = checkCreditCardNumber(cardNumber)
    if (checked.status === "empty") {
      setError("Enter a card number")
      setResult(null)
      return
    }
    if (checked.status === "invalid_chars") {
      setError("Use digits only (spaces and dashes are OK)")
      setResult(null)
      return
    }
    setError("")
    setResult(checked)
  }

  const reset = () => {
    setCardNumber("")
    setError("")
    setResult(null)
  }

  useEffect(() => {
    applySeoTags({
      title: "Credit Card Number Validator - Luhn Check",
      description:
        "Validate credit or debit card numbers using the Luhn (mod 10) algorithm. Format check only—not a live card verification.",
      canonicalPath: "/credit-card-validator",
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Credit Card Number Validator",
        url: `${SITE_URL}/credit-card-validator`,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        description: "Validate credit card number format with the Luhn algorithm.",
      },
    })
  }, [])

  return (
    <main className={CALCULATOR_MAIN_CLASS}>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">Credit Card Number Validator</h1>
          <p className="text-gray-600 mt-4 text-sm sm:text-base max-w-2xl mx-auto">
            Check whether a card number is structurally valid using the Luhn (mod 10) checksum. This does not verify
            that a card is active, funded, or real.
          </p>
        </div>

        <Card className="shadow-lg rounded-lg">
          <CardContent className="p-4 sm:p-6 space-y-6">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                validate()
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="card-number" className="block text-sm font-medium">
                  Card number
                </Label>
                <p className="text-xs text-gray-500 mt-0.5">13–19 digits; spaces or dashes are stripped automatically.</p>
                <Input
                  id="card-number"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={formatCardNumberDisplay(cardNumber)}
                  onChange={handleChange}
                  placeholder="Eg. 4111 1111 1111 1111"
                  className="mt-2 font-mono tracking-wide"
                  aria-describedby={error ? "card-number-error" : undefined}
                />
                {error && (
                  <p id="card-number-error" className="text-red-500 text-sm mt-1" role="alert">
                    {error}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-2">
                <Button
                  type="submit"
                  className="w-full sm:w-1/2 text-base sm:text-lg py-2 !bg-black !text-white hover:!bg-gray-900"
                >
                  Validate
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={reset}
                  className="w-full sm:w-1/2 text-base sm:text-lg bg-gray-200 text-black hover:bg-gray-300 py-2"
                >
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>

          {result && result.status !== "empty" && (
            <CardContent className="border-t p-4 sm:p-6 space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-center">Result</h2>

              {result.status === "invalid_length" && (
                <div className="p-4 rounded-md bg-amber-50 border border-amber-200 text-center" role="status">
                  <p className="font-semibold text-amber-900">Invalid length</p>
                  <p className="text-sm text-amber-800 mt-1">
                    Found {result.length} digits. Payment cards are usually 13–19 digits.
                  </p>
                </div>
              )}

              {result.status === "invalid_luhn" && (
                <div className="p-4 rounded-md bg-red-50 border border-red-200 text-center" role="status">
                  <p className="font-semibold text-red-900">Invalid card number</p>
                  <p className="text-sm text-red-800 mt-1">
                    This number failed the Luhn checksum (likely a typo or wrong format).
                  </p>
                </div>
              )}

              {result.status === "valid" && (
                <div className="p-4 rounded-md bg-green-50 border border-green-200 text-center" role="status">
                  <p className="font-semibold text-green-900">Valid format</p>
                  <p className="text-sm text-green-800 mt-1 font-mono">
                    {formatCardNumberDisplay(result.digits)}
                  </p>
                  {result.brand && (
                    <p className="text-sm text-green-800 mt-2">Likely network: {result.brand}</p>
                  )}
                  <p className="text-xs text-green-700 mt-3">
                    Passed Luhn check only—do not store or transmit real card data unnecessarily.
                  </p>
                </div>
              )}
            </CardContent>
          )}
        </Card>

        <UseOurCalculators exclude="credit-card-validator" className="mt-8" />
      </div>
    </main>
  )
}
