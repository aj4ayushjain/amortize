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
  MAX_INTEREST_RATE,
  MAX_LOAN_TENURE_YEARS,
} from "@/lib/currency"
import { applySeoTags, SITE_URL } from "@/lib/seo"
import { CALCULATOR_MAIN_CLASS } from "@/lib/layout"
import { UseOurCalculators } from "@/components/UseOurCalculators"
import { ShareCalculator } from "@/components/ShareCalculator"

export function ExtraPaymentsCalculator() {
  const [currency, setCurrency] = React.useState<string>(() => {
    return new URLSearchParams(window.location.search).get("currency") ?? getDefaultCurrencyByLocale()
  })
  const [loanAmount, setLoanAmount] = useState<string>(() => {
    return new URLSearchParams(window.location.search).get("amount") ?? ""
  })
  const [interestRate, setInterestRate] = useState<string>(() => {
    return new URLSearchParams(window.location.search).get("rate") ?? ""
  })
  const [loanTenure, setLoanTenure] = useState<string>(() => {
    return new URLSearchParams(window.location.search).get("tenure") ?? ""
  })
  const [extraPayment, setExtraPayment] = useState<string>(() => {
    return new URLSearchParams(window.location.search).get("extra") ?? ""
  })
  const [errors, setErrors] = useState<{
    loanAmount?: string
    interestRate?: string
    loanTenure?: string
    extraPayment?: string
  }>({})
  const [results, setResults] = useState<{
    regularEmi: number
    newTenureMonths: number
    totalInterestWithoutExtra: number
    totalInterestWithExtra: number
    interestSaved: number
    monthsSaved: number
  } | null>(null)

  const formatDisplayNumber = (num: number) => {
    if (num !== 0 && !num) return ""
    const opt = CURRENCY_OPTIONS.find((o) => o.code === currency)
    const locale = opt?.locale ?? "en-US"
    const curr = opt?.code ?? "USD"
    return Intl.NumberFormat(locale, { style: "currency", currency: curr }).format(num)
  }

  const validateInputs = () => {
    let isValid = true
    const newErrors: { loanAmount?: string; interestRate?: string; loanTenure?: string; extraPayment?: string } = {}
    const p = parseFloat(loanAmount.replace(/,/g, "").replace(/\s+/g, "").replace(/₽/g, ""))
    const r = parseFloat(interestRate)
    const t = parseFloat(loanTenure)
    const ex = parseFloat(extraPayment.replace(/,/g, "").replace(/\s+/g, "").replace(/₽/g, ""))

    const rawLoan = loanAmount.replace(/,/g, "").replace(/\s+/g, "").replace(/₽/g, "")
    const rawExtra = extraPayment.replace(/,/g, "").replace(/\s+/g, "").replace(/₽/g, "")

    if (!rawLoan || rawLoan.trim() === "") {
      newErrors.loanAmount = "Please enter a loan amount"
      isValid = false
    } else if (isNaN(p) || p <= 0) {
      newErrors.loanAmount = "Please enter a valid loan amount"
      isValid = false
    } else if (p > MAX_LOAN_AMOUNT) {
      newErrors.loanAmount = "Loan amount is too large"
      isValid = false
    }

    if (!interestRate || interestRate.trim() === "") {
      newErrors.interestRate = "Please enter an interest rate"
      isValid = false
    } else if (isNaN(r) || r <= 0) {
      newErrors.interestRate = "Please enter a valid interest rate"
      isValid = false
    } else if (r > MAX_INTEREST_RATE) {
      newErrors.interestRate = "Interest rate cannot exceed 100%"
      isValid = false
    }

    if (!loanTenure || loanTenure.trim() === "") {
      newErrors.loanTenure = "Please enter loan tenure"
      isValid = false
    } else if (isNaN(t) || t <= 0) {
      newErrors.loanTenure = "Please enter a valid loan tenure"
      isValid = false
    } else if (t >= MAX_LOAN_TENURE_YEARS || !Number.isInteger(t)) {
      newErrors.loanTenure = "Loan tenure must be a whole number between 1 and 99 years"
      isValid = false
    }

    if (!rawExtra || rawExtra.trim() === "") {
      newErrors.extraPayment = "Please enter a monthly prepayment amount"
      isValid = false
    } else if (isNaN(ex) || ex < 0) {
      newErrors.extraPayment = "Prepayment must be 0 or greater"
      isValid = false
    } else if (ex > MAX_LOAN_AMOUNT) {
      newErrors.extraPayment = "Prepayment amount is too large"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const rawLoanAmount = () => loanAmount.replace(/,/g, "").replace(/\s+/g, "").replace(/₽/g, "")
  const rawExtraPayment = () => extraPayment.replace(/,/g, "").replace(/\s+/g, "").replace(/₽/g, "")

  const handleExtraLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, "").replace(/\s+/g, "").replace(/₽/g, "")
    if (/^\d*$/.test(raw)) {
      setLoanAmount(raw)
      setErrors((prev) => ({ ...prev, loanAmount: "" }))
    }
  }
  const handleExtraPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, "").replace(/\s+/g, "").replace(/₽/g, "")
    if (/^\d*\.?\d*$/.test(raw)) {
      setExtraPayment(raw)
      setErrors((prev) => ({ ...prev, extraPayment: "" }))
    }
  }
  const handleExtraInterestRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    if (/^\d*\.?\d*$/.test(v)) {
      setInterestRate(v)
      setErrors((prev) => ({ ...prev, interestRate: "" }))
    }
  }
  const handleExtraLoanTenureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    if (/^\d*$/.test(v)) {
      setLoanTenure(v)
      setErrors((prev) => ({ ...prev, loanTenure: "" }))
    }
  }

  const calculateExtraPayments = () => {
    if (!validateInputs()) return

    const principal = parseFloat(rawLoanAmount())
    const annualRate = parseFloat(interestRate)
    const tenureYears = parseFloat(loanTenure)
    const extra = parseFloat(rawExtraPayment() || "0")

    const monthlyRate = annualRate / 100 / 12
    const totalMonths = Math.round(tenureYears * 12)
    const regularEmi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1)

    const totalInterestWithoutExtra = regularEmi * totalMonths - principal

    let balance = principal
    let months = 0
    let totalInterestWithExtra = 0
    const paymentWithExtra = regularEmi + extra

    if (paymentWithExtra <= balance * monthlyRate) {
      setErrors((prev) => ({
        ...prev,
        extraPayment: "Prepayment is too low to reduce loan balance with this rate.",
      }))
      return
    }

    while (balance > 0 && months < 1200) {
      const monthlyInterest = balance * monthlyRate
      totalInterestWithExtra += monthlyInterest
      let principalPayment = paymentWithExtra - monthlyInterest

      if (principalPayment > balance) {
        principalPayment = balance
      }

      balance -= principalPayment
      months += 1
    }

    const interestSaved = totalInterestWithoutExtra - totalInterestWithExtra
    const monthsSaved = totalMonths - months

    setResults({
      regularEmi,
      newTenureMonths: months,
      totalInterestWithoutExtra,
      totalInterestWithExtra,
      interestSaved,
      monthsSaved,
    })
  }

  const resetCalculator = () => {
    setLoanAmount("")
    setInterestRate("")
    setLoanTenure("")
    setExtraPayment("")
    setErrors({})
    setResults(null)
  }

  const formatTenure = (months: number) => {
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12
    return `${years} years ${remainingMonths} months`
  }

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search)
    if (sp.get("amount") && sp.get("rate") && sp.get("tenure") && sp.get("extra")) {
      calculateExtraPayments()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    applySeoTags({
      title: "Loan Prepayment Calculator - Save Interest on Your Loan",
      description:
        "Use the Loan Prepayment Calculator to see how prepaying principal reduces loan tenure and total interest cost.",
      canonicalPath: "/extra-payments-calculator",
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Loan Prepayment Calculator",
        url: `${SITE_URL}/extra-payments-calculator`,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        description:
          "Interactive loan prepayment calculator to estimate interest savings and reduced repayment time.",
      },
    })
  }, [])

  const shareUrl = results
    ? `${window.location.origin}${window.location.pathname}?amount=${rawLoanAmount()}&rate=${interestRate}&tenure=${loanTenure}&extra=${rawExtraPayment()}&currency=${currency}`
    : ""
  const shareText = results
    ? `Prepayment savings: ${formatDisplayNumber(parseFloat(rawLoanAmount()))} at ${interestRate}% with ${formatDisplayNumber(parseFloat(rawExtraPayment()))} extra/month — save ${formatDisplayNumber(results.interestSaved)}, ${results.monthsSaved} months sooner`
    : ""

  return (
    <main className={CALCULATOR_MAIN_CLASS}>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">Loan Prepayment Calculator</h1>
          <p className="text-gray-600 mt-4 text-sm sm:text-base">
            See how prepaying principal each month can reduce your tenure and save interest.
          </p>
        </div>

        <Card className="shadow-lg rounded-lg">
          <CardContent className="p-4 sm:p-6 space-y-6">
            <form onSubmit={(e) => { e.preventDefault(); calculateExtraPayments(); }} className="space-y-4">
              <div>
                <Label htmlFor="extra-loanAmount" className="block text-sm font-medium">Loan Amount</Label>
                <div className="flex items-center mt-2">
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="rounded-r-none border-r-0 min-w-[60px] px-2 bg-gray-50 focus:ring-0 focus:border-primary-500">
                      <SelectValue>{getCurrencySymbol(currency)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select Currency</SelectLabel>
                        {CURRENCY_OPTIONS.map((opt) => (
                          <SelectItem key={opt.code} value={opt.code}>{opt.symbol} {opt.code}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Input
                    id="extra-loanAmount"
                    type="text"
                    value={formatNumberForDisplay(loanAmount, currency)}
                    onChange={handleExtraLoanAmountChange}
                    placeholder="Eg. 250,000"
                    className="rounded-l-none w-full border-l-0 focus:ring-0 focus:border-primary-500"
                  />
                </div>
                {errors.loanAmount && <p className="text-red-500 text-sm mt-1" role="alert">{errors.loanAmount}</p>}
              </div>

              <div>
                <Label htmlFor="extra-interestRate" className="block text-sm font-medium">Interest Rate (% per annum)</Label>
                <Input
                  id="extra-interestRate"
                  type="text"
                  value={interestRate}
                  onChange={handleExtraInterestRateChange}
                  placeholder="Eg. 7.5"
                  className="mt-1 w-full"
                />
                {errors.interestRate && <p className="text-red-500 text-sm mt-1">{errors.interestRate}</p>}
              </div>

              <div>
                <Label htmlFor="extra-loanTenure" className="block text-sm font-medium">Loan Tenure (Years)</Label>
                <Input
                  id="extra-loanTenure"
                  type="text"
                  value={loanTenure}
                  onChange={handleExtraLoanTenureChange}
                  placeholder="Eg. 20"
                  className="mt-1 w-full"
                />
                {errors.loanTenure && <p className="text-red-500 text-sm mt-1">{errors.loanTenure}</p>}
              </div>

              <div>
                <Label htmlFor="extra-payment" className="block text-sm font-medium">Prepayment Per Month</Label>
                <div className="flex items-center mt-2">
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="rounded-r-none border-r-0 min-w-[60px] px-2 bg-gray-50 focus:ring-0 focus:border-primary-500">
                      <SelectValue>{getCurrencySymbol(currency)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select Currency</SelectLabel>
                        {CURRENCY_OPTIONS.map((opt) => (
                          <SelectItem key={opt.code} value={opt.code}>{opt.symbol} {opt.code}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Input
                    id="extra-payment"
                    type="text"
                    value={formatNumberForDisplay(extraPayment, currency)}
                    onChange={handleExtraPaymentChange}
                    placeholder="Eg. 200"
                    className="rounded-l-none w-full border-l-0 focus:ring-0 focus:border-primary-500"
                  />
                </div>
                {errors.extraPayment && <p className="text-red-500 text-sm mt-1">{errors.extraPayment}</p>}
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-2">
                <Button type="submit" className="w-full sm:w-1/2 text-base sm:text-lg py-2 !bg-black !text-white hover:!bg-gray-900">
                  Calculate
                </Button>
                <Button type="button" variant="secondary" onClick={resetCalculator} className="w-full sm:w-1/2 text-base sm:text-lg bg-gray-200 text-black hover:bg-gray-300 py-2">
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
                  <p className="text-gray-600">Regular Monthly EMI</p>
                  <p className="font-semibold">{formatDisplayNumber(results.regularEmi)}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-gray-600">New Tenure</p>
                  <p className="font-semibold">{formatTenure(results.newTenureMonths)}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-gray-600">Interest Without Prepayment</p>
                  <p className="font-semibold">{formatDisplayNumber(results.totalInterestWithoutExtra)}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-gray-600">Interest With Prepayment</p>
                  <p className="font-semibold">{formatDisplayNumber(results.totalInterestWithExtra)}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-md">
                  <p className="text-gray-600">Interest Saved</p>
                  <p className="font-semibold text-green-700">{formatDisplayNumber(results.interestSaved)}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-md">
                  <p className="text-gray-600">Time Saved</p>
                  <p className="font-semibold text-green-700">{results.monthsSaved} months</p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        <UseOurCalculators exclude="loan-prepayment" className="mt-8" />
      </div>
    </main>
  )
}
