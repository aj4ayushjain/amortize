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

const MONTHS_OPTIONS = [3, 4, 5, 6, 9, 12]

export function EmergencyFundCalculator() {
  const [currency, setCurrency] = React.useState<string>(getDefaultCurrencyByLocale)
  const [monthlyExpenses, setMonthlyExpenses] = useState<string>("")
  const [monthsToCover, setMonthsToCover] = useState<string>("6")
  const [currentSavings, setCurrentSavings] = useState<string>("")
  const [errors, setErrors] = useState<{
    monthlyExpenses?: string
  }>({})
  const [results, setResults] = useState<{
    targetAmount: number
    gap: number | null
  } | null>(null)

  const formatDisplayNumber = (num: number) => {
    if (num !== 0 && !num) return ""
    const opt = CURRENCY_OPTIONS.find((o) => o.code === currency)
    const locale = opt?.locale ?? "en-US"
    const curr = opt?.code ?? "USD"
    return Intl.NumberFormat(locale, { style: "currency", currency: curr }).format(num)
  }

  const normalizeAmount = (val: string) =>
    val.replace(/,/g, "").replace(/\s+/g, "").replace(/₽/g, "")

  const validateInputs = () => {
    const raw = normalizeAmount(monthlyExpenses)
    const p = parseFloat(raw)

    if (!raw || raw.trim() === "") {
      setErrors({ monthlyExpenses: "Please enter your monthly expenses" })
      return false
    }
    if (isNaN(p) || p <= 0) {
      setErrors({ monthlyExpenses: "Please enter a valid amount" })
      return false
    }
    if (p > MAX_LOAN_AMOUNT) {
      setErrors({ monthlyExpenses: "Amount is too large" })
      return false
    }

    setErrors({})
    return true
  }

  const handleMonthlyExpensesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = normalizeAmount(e.target.value)
    if (/^\d*\.?\d*$/.test(raw)) {
      setMonthlyExpenses(raw)
      setErrors((prev) => ({ ...prev, monthlyExpenses: "" }))
    }
  }

  const handleCurrentSavingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = normalizeAmount(e.target.value)
    if (/^\d*\.?\d*$/.test(raw)) {
      setCurrentSavings(raw)
    }
  }

  const calculate = () => {
    if (!validateInputs()) return

    const expenses = parseFloat(normalizeAmount(monthlyExpenses))
    const months = parseFloat(monthsToCover)
    const current = currentSavings ? parseFloat(normalizeAmount(currentSavings)) : 0

    const targetAmount = expenses * months
    const gap = current > 0 ? Math.max(0, targetAmount - current) : null

    setResults({ targetAmount, gap })
  }

  const resetCalculator = () => {
    setMonthlyExpenses("")
    setMonthsToCover("6")
    setCurrentSavings("")
    setErrors({})
    setResults(null)
  }

  useEffect(() => {
    applySeoTags({
      title: "Emergency Fund Calculator - How Much to Save",
      description:
        "Calculate how much you need in an emergency fund based on your monthly expenses. Plan for 3–12 months of expenses.",
      canonicalPath: "/emergency-fund-calculator",
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Emergency Fund Calculator",
        url: `${SITE_URL}/emergency-fund-calculator`,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        description: "Calculate your emergency fund target based on monthly expenses.",
      },
    })
  }, [])

  return (
    <main className={CALCULATOR_MAIN_CLASS}>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">Emergency Fund Calculator</h1>
          <p className="text-gray-600 mt-4 text-sm sm:text-base">
            Find out how much you need to save for a healthy emergency fund.
          </p>
        </div>

        <Card className="shadow-lg rounded-lg">
          <CardContent className="p-4 sm:p-6 space-y-6">
            <form onSubmit={(e) => { e.preventDefault(); calculate(); }} className="space-y-4">
              <div>
                <Label htmlFor="ef-monthlyExpenses" className="block text-sm font-medium">
                  Monthly Expenses
                </Label>
                <p className="text-xs text-gray-500 mt-0.5">
                  Include rent, food, utilities, insurance, and other essentials.
                </p>
                <div className="flex items-center mt-2">
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="rounded-r-none border-r-0 min-w-[60px] px-2 bg-gray-50 focus:ring-0 focus:border-primary-500">
                      <SelectValue>{getCurrencySymbol(currency)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select Currency</SelectLabel>
                        {CURRENCY_OPTIONS.map((opt) => (
                          <SelectItem key={opt.code} value={opt.code}>
                            {opt.symbol} {opt.code}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Input
                    id="ef-monthlyExpenses"
                    type="text"
                    value={formatNumberForDisplay(monthlyExpenses, currency)}
                    onChange={handleMonthlyExpensesChange}
                    placeholder="Eg. 5,000"
                    className="rounded-l-none w-full border-l-0 focus:ring-0 focus:border-primary-500"
                  />
                </div>
                {errors.monthlyExpenses && (
                  <p className="text-red-500 text-sm mt-1" role="alert">
                    {errors.monthlyExpenses}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="ef-monthsToCover" className="block text-sm font-medium">
                  Months of Expenses to Cover
                </Label>
                <p className="text-xs text-gray-500 mt-0.5">
                  Experts typically recommend 3–6 months; 6–12 if income is less stable.
                </p>
                <Select value={monthsToCover} onValueChange={setMonthsToCover}>
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS_OPTIONS.map((m) => (
                      <SelectItem key={m} value={String(m)}>
                        {m} months
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="ef-currentSavings" className="block text-sm font-medium">
                  Current Emergency Savings <span className="text-gray-500 font-normal">(optional)</span>
                </Label>
                <div className="flex items-center mt-2">
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="rounded-r-none border-r-0 min-w-[60px] px-2 bg-gray-50 focus:ring-0 focus:border-primary-500">
                      <SelectValue>{getCurrencySymbol(currency)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select Currency</SelectLabel>
                        {CURRENCY_OPTIONS.map((opt) => (
                          <SelectItem key={opt.code} value={opt.code}>
                            {opt.symbol} {opt.code}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Input
                    id="ef-currentSavings"
                    type="text"
                    value={formatNumberForDisplay(currentSavings, currency)}
                    onChange={handleCurrentSavingsChange}
                    placeholder="Eg. 10,000"
                    className="rounded-l-none w-full border-l-0 focus:ring-0 focus:border-primary-500"
                  />
                </div>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-gray-600">Target Emergency Fund</p>
                  <p className="font-semibold">{formatDisplayNumber(results.targetAmount)}</p>
                </div>
                {results.gap !== null && (
                  <div className="p-3 bg-blue-50 rounded-md">
                    <p className="text-gray-600">Amount Left to Save</p>
                    <p className="font-semibold text-blue-700">
                      {formatDisplayNumber(results.gap)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>

        <UseOurCalculators exclude="emergency-fund" className="mt-8" />
      </div>
    </main>
  )
}
