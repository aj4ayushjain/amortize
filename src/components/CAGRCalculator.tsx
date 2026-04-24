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

const MAX_CAGR_YEARS = 200

export function CAGRCalculator() {
  const [currency, setCurrency] = React.useState<string>(() => {
    return new URLSearchParams(window.location.search).get("currency") ?? getDefaultCurrencyByLocale()
  })
  const [beginningValue, setBeginningValue] = useState<string>(() => {
    return new URLSearchParams(window.location.search).get("begin") ?? ""
  })
  const [endingValue, setEndingValue] = useState<string>(() => {
    return new URLSearchParams(window.location.search).get("end") ?? ""
  })
  const [years, setYears] = useState<string>(() => {
    return new URLSearchParams(window.location.search).get("years") ?? "5"
  })
  const [errors, setErrors] = useState<{
    beginningValue?: string
    endingValue?: string
    years?: string
  }>({})
  const [results, setResults] = useState<{
    cagrPct: number
    totalReturnPct: number
  } | null>(null)

  const normalizeAmount = (val: string) => val.replace(/,/g, "").replace(/\s+/g, "").replace(/₽/g, "")

  const formatDisplayNumber = (num: number) => {
    const opt = CURRENCY_OPTIONS.find((o) => o.code === currency)
    const locale = opt?.locale ?? "en-US"
    const curr = opt?.code ?? "USD"
    return Intl.NumberFormat(locale, { style: "currency", currency: curr }).format(num)
  }

  const validateInputs = () => {
    const e: typeof errors = {}
    const begin = parseFloat(normalizeAmount(beginningValue))
    const end = parseFloat(normalizeAmount(endingValue))
    const y = parseFloat(years)

    if (!normalizeAmount(beginningValue)) {
      e.beginningValue = "Enter beginning value"
    } else if (!Number.isFinite(begin) || begin <= 0) {
      e.beginningValue = "Enter a positive beginning amount"
    } else if (begin > MAX_LOAN_AMOUNT) {
      e.beginningValue = "Amount is too large"
    }

    if (!normalizeAmount(endingValue)) {
      e.endingValue = "Enter ending value"
    } else if (!Number.isFinite(end) || end <= 0) {
      e.endingValue = "Enter a positive ending amount"
    } else if (end > MAX_LOAN_AMOUNT) {
      e.endingValue = "Amount is too large"
    }

    if (!years.trim()) {
      e.years = "Enter the investment period in years"
    } else if (!Number.isFinite(y) || y <= 0) {
      e.years = "Enter a positive number of years"
    } else if (y > MAX_CAGR_YEARS) {
      e.years = `Use at most ${MAX_CAGR_YEARS} years`
    }

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const calculate = () => {
    if (!validateInputs()) return

    const begin = parseFloat(normalizeAmount(beginningValue))
    const end = parseFloat(normalizeAmount(endingValue))
    const y = parseFloat(years)

    const totalReturnPct = (end / begin - 1) * 100
    const cagrPct = (Math.pow(end / begin, 1 / y) - 1) * 100

    setResults({ cagrPct, totalReturnPct })
  }

  const resetCalculator = () => {
    setBeginningValue("")
    setEndingValue("")
    setYears("5")
    setErrors({})
    setResults(null)
  }

  const handleBeginningChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const raw = normalizeAmount(ev.target.value)
    if (/^\d*\.?\d*$/.test(raw)) {
      setBeginningValue(raw)
      setErrors((prev) => ({ ...prev, beginningValue: "" }))
    }
  }

  const handleEndingChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const raw = normalizeAmount(ev.target.value)
    if (/^\d*\.?\d*$/.test(raw)) {
      setEndingValue(raw)
      setErrors((prev) => ({ ...prev, endingValue: "" }))
    }
  }

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search)
    if (sp.get("begin") && sp.get("end") && sp.get("years")) {
      calculate()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    applySeoTags({
      title: "CAGR Calculator - Compound Annual Growth Rate",
      description:
        "Calculate CAGR and total return from beginning value, ending value, and number of years.",
      canonicalPath: "/cagr-calculator",
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "CAGR Calculator",
        url: `${SITE_URL}/cagr-calculator`,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        description: "Compound annual growth rate from initial and final investment values.",
      },
    })
  }, [])

  const rawBegin = normalizeAmount(beginningValue)
  const rawEnd = normalizeAmount(endingValue)
  const shareUrl = results
    ? `${window.location.origin}${window.location.pathname}?begin=${rawBegin}&end=${rawEnd}&years=${years}&currency=${currency}`
    : ""
  const shareText = results
    ? `CAGR: ${formatDisplayNumber(parseFloat(rawBegin))} → ${formatDisplayNumber(parseFloat(rawEnd))} in ${years} years = ${results.cagrPct.toFixed(2)}% CAGR`
    : ""

  return (
    <main className={CALCULATOR_MAIN_CLASS}>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">CAGR Calculator</h1>
          <p className="text-gray-600 mt-4 text-sm sm:text-base max-w-2xl mx-auto">
            CAGR is the smoothed annual rate that grows the beginning amount to the ending amount over the period.
            It assumes compounding; use the same units for both values.
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
                <Label htmlFor="cagr-begin" className="block text-sm font-medium">
                  Beginning value
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
                    id="cagr-begin"
                    type="text"
                    value={formatNumberForDisplay(beginningValue, currency)}
                    onChange={handleBeginningChange}
                    placeholder="Eg. 100,000"
                    className="rounded-l-none w-full border-l-0"
                  />
                </div>
                {errors.beginningValue && (
                  <p className="text-red-500 text-sm mt-1" role="alert">
                    {errors.beginningValue}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="cagr-end" className="block text-sm font-medium">
                  Ending value
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
                    id="cagr-end"
                    type="text"
                    value={formatNumberForDisplay(endingValue, currency)}
                    onChange={handleEndingChange}
                    placeholder="Eg. 150,000"
                    className="rounded-l-none w-full border-l-0"
                  />
                </div>
                {errors.endingValue && (
                  <p className="text-red-500 text-sm mt-1" role="alert">
                    {errors.endingValue}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="cagr-years" className="block text-sm font-medium">
                  Period (years)
                </Label>
                <p className="text-xs text-gray-500 mt-0.5">Decimals allowed (e.g. 2.5 years).</p>
                <Input
                  id="cagr-years"
                  type="text"
                  inputMode="decimal"
                  value={years}
                  onChange={(e) => {
                    const v = e.target.value
                    if (/^\d*\.?\d*$/.test(v)) {
                      setYears(v)
                      setErrors((prev) => ({ ...prev, years: "" }))
                    }
                  }}
                  placeholder="Eg. 5"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-gray-600">CAGR</p>
                  <p className="font-semibold">{results.cagrPct.toFixed(4)}%</p>
                  <p className="text-xs text-gray-500 mt-1">Annualized compound growth</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-gray-600">Total return</p>
                  <p className="font-semibold">{results.totalReturnPct.toFixed(4)}%</p>
                  <p className="text-xs text-gray-500 mt-1">Over the full period (not annualized)</p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        <UseOurCalculators exclude="cagr" className="mt-8" />
      </div>
    </main>
  )
}
