import React, { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SelectGroup } from "@radix-ui/react-select"
import {
  CURRENCY_OPTIONS,
  getDefaultCurrencyByLocale,
  getCurrencySymbol,
  formatNumberForDisplay,
  MAX_LOAN_AMOUNT,
} from "@/lib/currency"
import { applySeoTags, SITE_URL } from "@/lib/seo"
import { CALCULATOR_MAIN_CLASS } from "@/lib/layout"
import { UseOurCalculators } from "@/components/UseOurCalculators"
import { ShareCalculator } from "@/components/ShareCalculator"

const MAX_SIP_ANNUAL_RETURN_PCT = 50

export function SIPCalculator() {
  const [currency, setCurrency] = React.useState<string>(() => {
    return new URLSearchParams(window.location.search).get("currency") ?? getDefaultCurrencyByLocale()
  })
  const [monthlySip, setMonthlySip] = useState<string>(() => {
    return new URLSearchParams(window.location.search).get("sip") ?? ""
  })
  const [expectedAnnualReturn, setExpectedAnnualReturn] = useState<string>(() => {
    return new URLSearchParams(window.location.search).get("return") ?? "12"
  })
  const [years, setYears] = useState<string>(() => {
    return new URLSearchParams(window.location.search).get("years") ?? "10"
  })
  const [errors, setErrors] = useState<{
    monthlySip?: string
    expectedAnnualReturn?: string
    years?: string
  }>({})
  const [results, setResults] = useState<{
    futureValue: number
    totalInvested: number
    estimatedGain: number
  } | null>(null)

  const normalizeAmount = (val: string) => val.replace(/,/g, "").replace(/\s+/g, "").replace(/₽/g, "")

  const formatDisplayNumber = (num: number) => {
    const opt = CURRENCY_OPTIONS.find((o) => o.code === currency)
    const locale = opt?.locale ?? "en-IN"
    const curr = opt?.code ?? "INR"
    return Intl.NumberFormat(locale, { style: "currency", currency: curr }).format(num)
  }

  const validateInputs = () => {
    const e: typeof errors = {}
    const raw = normalizeAmount(monthlySip)
    const m = parseFloat(raw)
    const rate = parseFloat(expectedAnnualReturn)
    const y = parseFloat(years)

    if (!raw) {
      e.monthlySip = "Enter monthly SIP amount"
    } else if (!Number.isFinite(m) || m <= 0) {
      e.monthlySip = "Enter a valid monthly amount"
    } else if (m > MAX_LOAN_AMOUNT) {
      e.monthlySip = "Amount is too large"
    }

    if (!expectedAnnualReturn.trim()) {
      e.expectedAnnualReturn = "Enter expected annual return"
    } else if (!Number.isFinite(rate) || rate < 0 || rate > MAX_SIP_ANNUAL_RETURN_PCT) {
      e.expectedAnnualReturn = `Use a rate between 0% and ${MAX_SIP_ANNUAL_RETURN_PCT}%`
    }

    if (!years.trim()) {
      e.years = "Enter investment period in years"
    } else if (!Number.isFinite(y) || y <= 0) {
      e.years = "Enter a positive number of years"
    } else if (!Number.isInteger(y)) {
      e.years = "Use a whole number of years"
    } else if (y > 50) {
      e.years = "Use at most 50 years"
    }

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const calculate = () => {
    if (!validateInputs()) return

    const m = parseFloat(normalizeAmount(monthlySip))
    const annual = parseFloat(expectedAnnualReturn) / 100
    const y = parseInt(years, 10)
    const n = y * 12

    let futureValue: number
    if (annual === 0) {
      futureValue = m * n
    } else {
      const rMonth = (1 + annual) ** (1 / 12) - 1
      futureValue = m * (((1 + rMonth) ** n - 1) / rMonth)
    }
    const totalInvested = m * n
    const estimatedGain = futureValue - totalInvested

    setResults({ futureValue, totalInvested, estimatedGain })
  }

  const resetCalculator = () => {
    setMonthlySip("")
    setExpectedAnnualReturn("12")
    setYears("10")
    setErrors({})
    setResults(null)
  }

  const handleMonthlyChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const raw = normalizeAmount(ev.target.value)
    if (/^\d*\.?\d*$/.test(raw)) {
      setMonthlySip(raw)
      setErrors((prev) => ({ ...prev, monthlySip: "" }))
    }
  }

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search)
    if (sp.get("sip") && sp.get("return") && sp.get("years")) {
      calculate()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    applySeoTags({
      title: "SIP Calculator - Systematic Investment Plan Returns",
      description:
        "Estimate SIP maturity value and returns with monthly investments, expected annual return, and horizon (illustrative).",
      canonicalPath: "/sip-calculator",
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "SIP Calculator",
        url: `${SITE_URL}/sip-calculator`,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        description: "Systematic Investment Plan future value estimate (illustrative).",
      },
    })
  }, [])

  const rawSip = normalizeAmount(monthlySip)
  const shareUrl = results
    ? `${window.location.origin}${window.location.pathname}?sip=${rawSip}&return=${expectedAnnualReturn}&years=${years}&currency=${currency}`
    : ""
  const shareText = results
    ? `SIP estimate: ${formatDisplayNumber(parseFloat(rawSip))}/month at ${expectedAnnualReturn}% for ${years} years → ${formatDisplayNumber(results.futureValue)}`
    : ""

  return (
    <main className={CALCULATOR_MAIN_CLASS}>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">SIP Calculator</h1>
          <p className="text-gray-600 mt-4 text-sm sm:text-base max-w-2xl mx-auto">
            Project the future value of a monthly SIP using a constant expected annual return and monthly compounding
            (equivalent monthly rate). Actual mutual fund returns vary; this is for planning only.
          </p>
        </div>

        <Card className="shadow-lg rounded-lg">
          <CardContent className="p-4 sm:p-6 space-y-6">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                calculate()
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="sip-monthly" className="block text-sm font-medium">
                  Monthly SIP
                </Label>
                <div className="flex items-center mt-2">
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="rounded-r-none border-r-0 min-w-[60px] px-2 bg-gray-50 focus:ring-0 focus:border-primary-500">
                      <SelectValue>{getCurrencySymbol(currency)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Currency</SelectLabel>
                        {CURRENCY_OPTIONS.map((opt) => (
                          <SelectItem key={opt.code} value={opt.code}>
                            {opt.symbol} {opt.code}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Input
                    id="sip-monthly"
                    type="text"
                    value={formatNumberForDisplay(monthlySip, currency)}
                    onChange={handleMonthlyChange}
                    placeholder="Eg. 10,000"
                    className="rounded-l-none w-full border-l-0"
                  />
                </div>
                {errors.monthlySip && (
                  <p className="text-red-500 text-sm mt-1" role="alert">
                    {errors.monthlySip}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="sip-return" className="block text-sm font-medium">
                  Expected annual return (%)
                </Label>
                <p className="text-xs text-gray-500 mt-0.5">Illustrative CAGR; markets do not grow smoothly.</p>
                <Input
                  id="sip-return"
                  type="text"
                  inputMode="decimal"
                  value={expectedAnnualReturn}
                  onChange={(e) => {
                    const v = e.target.value
                    if (/^\d*\.?\d*$/.test(v)) {
                      setExpectedAnnualReturn(v)
                      setErrors((prev) => ({ ...prev, expectedAnnualReturn: "" }))
                    }
                  }}
                  placeholder="Eg. 12"
                  className="mt-1"
                />
                {errors.expectedAnnualReturn && (
                  <p className="text-red-500 text-sm mt-1" role="alert">
                    {errors.expectedAnnualReturn}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="sip-years" className="block text-sm font-medium">
                  Investment period (years)
                </Label>
                <Input
                  id="sip-years"
                  type="text"
                  inputMode="numeric"
                  value={years}
                  onChange={(e) => {
                    const v = e.target.value
                    if (/^\d*$/.test(v)) {
                      setYears(v)
                      setErrors((prev) => ({ ...prev, years: "" }))
                    }
                  }}
                  placeholder="Eg. 10"
                  className="mt-1"
                />
                {errors.years && (
                  <p className="text-red-500 text-sm mt-1" role="alert">
                    {errors.years}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-2">
                <Button
                  type="submit"
                  className="w-full sm:w-1/2 text-base sm:text-lg py-2 !bg-black !text-white hover:!bg-gray-900"
                >
                  Calculate
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={resetCalculator}
                  className="w-full sm:w-1/2 text-base sm:text-lg bg-gray-200 text-black hover:bg-gray-300 py-2"
                >
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>

          {results && (
            <CardContent className="border-t p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-semibold">Results</h2>
                <ShareCalculator shareUrl={shareUrl} shareText={shareText} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm sm:text-base">
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-gray-600">Future value (est.)</p>
                  <p className="font-semibold">{formatDisplayNumber(results.futureValue)}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-gray-600">Total invested</p>
                  <p className="font-semibold">{formatDisplayNumber(results.totalInvested)}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-md">
                  <p className="text-gray-600">Estimated gain</p>
                  <p className="font-semibold text-blue-800">{formatDisplayNumber(results.estimatedGain)}</p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        <UseOurCalculators exclude="sip" className="mt-8" />
      </div>
    </main>
  )
}
