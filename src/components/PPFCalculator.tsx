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

/** Typical annual PPF deposit cap under Section 80C (India); soft warning only. */
const PPF_ANNUAL_CAP_INR = 150_000

const TENURE_OPTIONS = [15, 20, 25, 30, 35, 40, 45, 50] as const

export function PPFCalculator() {
  const [currency, setCurrency] = React.useState<string>(getDefaultCurrencyByLocale)
  const [monthlyDeposit, setMonthlyDeposit] = useState<string>("")
  const [annualRate, setAnnualRate] = useState<string>("7.1")
  const [tenureYears, setTenureYears] = useState<string>("15")
  const [errors, setErrors] = useState<{
    monthlyDeposit?: string
    annualRate?: string
    tenureYears?: string
  }>({})
  const [results, setResults] = useState<{
    maturityValue: number
    totalDeposited: number
    interestEarned: number
    overAnnualCap: boolean
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
    const raw = normalizeAmount(monthlyDeposit)
    const m = parseFloat(raw)
    const rate = parseFloat(annualRate)
    const years = parseInt(tenureYears, 10)

    if (!raw) {
      e.monthlyDeposit = "Enter monthly contribution"
    } else if (!Number.isFinite(m) || m <= 0) {
      e.monthlyDeposit = "Enter a valid monthly amount"
    } else if (m > MAX_LOAN_AMOUNT) {
      e.monthlyDeposit = "Amount is too large"
    }

    if (!annualRate.trim()) {
      e.annualRate = "Enter annual interest rate"
    } else if (!Number.isFinite(rate) || rate < 0 || rate > 30) {
      e.annualRate = "Use a rate between 0% and 30%"
    }

    if (!Number.isFinite(years) || years < 15 || years > 50) {
      e.tenureYears = "Choose a tenure between 15 and 50 years"
    }

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const calculate = () => {
    if (!validateInputs()) return

    const m = parseFloat(normalizeAmount(monthlyDeposit))
    const annual = parseFloat(annualRate) / 100
    const years = parseInt(tenureYears, 10)
    const n = years * 12

    let maturityValue: number
    if (annual === 0) {
      maturityValue = m * n
    } else {
      const rMonth = (1 + annual) ** (1 / 12) - 1
      maturityValue = m * (((1 + rMonth) ** n - 1) / rMonth)
    }
    const totalDeposited = m * n
    const interestEarned = maturityValue - totalDeposited

    const annualDeposited = m * 12
    const overAnnualCap = currency === "INR" && annualDeposited > PPF_ANNUAL_CAP_INR + 1e-6

    setResults({
      maturityValue,
      totalDeposited,
      interestEarned,
      overAnnualCap,
    })
  }

  const resetCalculator = () => {
    setMonthlyDeposit("")
    setAnnualRate("7.1")
    setTenureYears("15")
    setErrors({})
    setResults(null)
  }

  const handleMonthlyChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const raw = normalizeAmount(ev.target.value)
    if (/^\d*\.?\d*$/.test(raw)) {
      setMonthlyDeposit(raw)
      setErrors((prev) => ({ ...prev, monthlyDeposit: "" }))
    }
  }

  useEffect(() => {
    applySeoTags({
      title: "PPF Calculator - Public Provident Fund Maturity",
      description:
        "Estimate PPF maturity value, total deposits, and interest with monthly contributions and annual compounding (illustrative).",
      canonicalPath: "/ppf-calculator",
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "PPF Calculator",
        url: `${SITE_URL}/ppf-calculator`,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        description: "Public Provident Fund maturity estimate for India (illustrative).",
      },
    })
  }, [])

  return (
    <main className={CALCULATOR_MAIN_CLASS}>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">PPF Calculator</h1>
          <p className="text-gray-600 mt-4 text-sm sm:text-base max-w-2xl mx-auto">
            Illustrative maturity for monthly deposits using an equivalent monthly rate from the annual rate (compound
            interest). Actual PPF rules, rates, and 5th-of-month credit can differ—verify with official sources.
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
                <Label htmlFor="ppf-monthly" className="block text-sm font-medium">
                  Monthly deposit
                </Label>
                <p className="text-xs text-gray-500 mt-0.5">
                  PPF allows up to ₹1.5 lakh per financial year total (we warn if monthly × 12 exceeds that in INR).
                </p>
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
                    id="ppf-monthly"
                    type="text"
                    value={formatNumberForDisplay(monthlyDeposit, currency)}
                    onChange={handleMonthlyChange}
                    placeholder="Eg. 12,500"
                    className="rounded-l-none w-full border-l-0"
                  />
                </div>
                {errors.monthlyDeposit && (
                  <p className="text-red-500 text-sm mt-1" role="alert">
                    {errors.monthlyDeposit}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="ppf-rate" className="block text-sm font-medium">
                  Expected annual interest rate (%)
                </Label>
                <Input
                  id="ppf-rate"
                  type="text"
                  inputMode="decimal"
                  value={annualRate}
                  onChange={(e) => {
                    const v = e.target.value
                    if (/^\d*\.?\d*$/.test(v)) {
                      setAnnualRate(v)
                      setErrors((prev) => ({ ...prev, annualRate: "" }))
                    }
                  }}
                  placeholder="Eg. 7.1"
                  className="mt-1"
                />
                {errors.annualRate && (
                  <p className="text-red-500 text-sm mt-1" role="alert">
                    {errors.annualRate}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="ppf-tenure" className="block text-sm font-medium">
                  Tenure (years)
                </Label>
                <p className="text-xs text-gray-500 mt-0.5">Minimum initial block is 15 years; longer tenures include extensions.</p>
                <Select value={tenureYears} onValueChange={setTenureYears}>
                  <SelectTrigger id="ppf-tenure" className="mt-1 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TENURE_OPTIONS.map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y} years
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.tenureYears && (
                  <p className="text-red-500 text-sm mt-1" role="alert">
                    {errors.tenureYears}
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
              <h2 className="text-lg sm:text-xl font-semibold text-center">Results</h2>
              {results.overAnnualCap && (
                <p className="text-amber-800 bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-center">
                  Monthly × 12 exceeds ₹1.5 lakh/year—PPF has an annual deposit cap; adjust for a realistic scenario.
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm sm:text-base">
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-gray-600">Maturity value (est.)</p>
                  <p className="font-semibold">{formatDisplayNumber(results.maturityValue)}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-gray-600">Total deposited</p>
                  <p className="font-semibold">{formatDisplayNumber(results.totalDeposited)}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-md">
                  <p className="text-gray-600">Interest (est.)</p>
                  <p className="font-semibold text-blue-800">{formatDisplayNumber(results.interestEarned)}</p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        <UseOurCalculators exclude="ppf" className="mt-8" />
      </div>
    </main>
  )
}
