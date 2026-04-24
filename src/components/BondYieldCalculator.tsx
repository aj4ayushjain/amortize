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

const MAX_BOND_YEARS = 100

function bondPriceFromYieldPerPeriod(
  face: number,
  couponAnnualPct: number,
  r: number,
  periodsPerYear: number,
  years: number
): number {
  const n = Math.round(years * periodsPerYear)
  if (r <= 0 || !Number.isFinite(r)) return Number.POSITIVE_INFINITY
  const coupon = (face * (couponAnnualPct / 100)) / periodsPerYear
  let pv = 0
  for (let i = 1; i <= n; i++) {
    pv += coupon / (1 + r) ** i
  }
  pv += face / (1 + r) ** n
  return pv
}

/** Periodic yield r such that PV(r) = price. Returns NaN if not bracketed. */
function solveYieldPerPeriod(
  face: number,
  couponAnnualPct: number,
  price: number,
  periodsPerYear: number,
  years: number
): number {
  const pvAt = (r: number) => bondPriceFromYieldPerPeriod(face, couponAnnualPct, r, periodsPerYear, years)

  const loStart = 1e-12
  const pLo = pvAt(loStart)
  if (!Number.isFinite(pLo) || pLo < price) return Number.NaN

  let hi = 0.01
  let pHi = pvAt(hi)
  let guard = 0
  while (pHi > price && hi < 1e6 && guard++ < 100) {
    hi *= 1.3
    pHi = pvAt(hi)
  }
  if (pHi > price) return Number.NaN

  let lo = loStart
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2
    const pm = pvAt(mid)
    if (pm > price) lo = mid
    else hi = mid
  }
  return (lo + hi) / 2
}

export function BondYieldCalculator() {
  const [currency, setCurrency] = React.useState<string>(() => {
    return new URLSearchParams(window.location.search).get("currency") ?? getDefaultCurrencyByLocale()
  })
  const [faceValue, setFaceValue] = useState<string>(() => {
    return new URLSearchParams(window.location.search).get("face") ?? ""
  })
  const [couponRate, setCouponRate] = useState<string>(() => {
    return new URLSearchParams(window.location.search).get("coupon") ?? ""
  })
  const [price, setPrice] = useState<string>(() => {
    return new URLSearchParams(window.location.search).get("price") ?? ""
  })
  const [yearsToMaturity, setYearsToMaturity] = useState<string>(() => {
    return new URLSearchParams(window.location.search).get("maturity") ?? ""
  })
  const [frequency, setFrequency] = useState<string>(() => {
    return new URLSearchParams(window.location.search).get("freq") ?? "2"
  })
  const [errors, setErrors] = useState<{
    faceValue?: string
    couponRate?: string
    price?: string
    yearsToMaturity?: string
  }>({})
  const [results, setResults] = useState<{
    currentYieldPct: number
    ytmEffectiveAnnualPct: number
    ytmNominalAnnualPct: number
    annualCouponCash: number
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
    const face = parseFloat(normalizeAmount(faceValue))
    const coupon = parseFloat(couponRate)
    const px = parseFloat(normalizeAmount(price))
    const y = parseFloat(yearsToMaturity)

    if (!normalizeAmount(faceValue)) {
      e.faceValue = "Enter face (par) value"
    } else if (!Number.isFinite(face) || face <= 0) {
      e.faceValue = "Enter a valid face value"
    } else if (face > MAX_LOAN_AMOUNT) {
      e.faceValue = "Amount is too large"
    }

    if (!couponRate.trim()) {
      e.couponRate = "Enter annual coupon rate"
    } else if (!Number.isFinite(coupon) || coupon < 0 || coupon > 100) {
      e.couponRate = "Coupon must be between 0 and 100%"
    }

    if (!normalizeAmount(price)) {
      e.price = "Enter current bond price"
    } else if (!Number.isFinite(px) || px <= 0) {
      e.price = "Enter a valid price"
    } else if (px > MAX_LOAN_AMOUNT) {
      e.price = "Amount is too large"
    }

    if (!yearsToMaturity.trim()) {
      e.yearsToMaturity = "Enter years to maturity"
    } else if (!Number.isFinite(y) || y <= 0) {
      e.yearsToMaturity = "Enter a positive number of years"
    } else if (y > MAX_BOND_YEARS) {
      e.yearsToMaturity = `Use at most ${MAX_BOND_YEARS} years`
    }

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const calculate = () => {
    if (!validateInputs()) return

    const face = parseFloat(normalizeAmount(faceValue))
    const coupon = parseFloat(couponRate)
    const px = parseFloat(normalizeAmount(price))
    const years = parseFloat(yearsToMaturity)
    const m = parseInt(frequency, 10)

    const annualCouponCash = face * (coupon / 100)
    const currentYieldPct = (annualCouponCash / px) * 100

    const ytmPerPeriod = solveYieldPerPeriod(face, coupon, px, m, years)
    if (!Number.isFinite(ytmPerPeriod)) {
      setErrors((prev) => ({ ...prev, price: "Could not solve yield—check inputs (price vs coupons)." }))
      setResults(null)
      return
    }

    const ytmNominalAnnualPct = ytmPerPeriod * m * 100
    const ytmEffectiveAnnualPct = ((1 + ytmPerPeriod) ** m - 1) * 100

    setResults({
      currentYieldPct,
      ytmEffectiveAnnualPct,
      ytmNominalAnnualPct,
      annualCouponCash,
    })
  }

  const resetCalculator = () => {
    setFaceValue("")
    setCouponRate("")
    setPrice("")
    setYearsToMaturity("")
    setFrequency("2")
    setErrors({})
    setResults(null)
  }

  const handleFaceChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const raw = normalizeAmount(ev.target.value)
    if (/^\d*\.?\d*$/.test(raw)) {
      setFaceValue(raw)
      setErrors((prev) => ({ ...prev, faceValue: "" }))
    }
  }
  const handlePriceChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const raw = normalizeAmount(ev.target.value)
    if (/^\d*\.?\d*$/.test(raw)) {
      setPrice(raw)
      setErrors((prev) => ({ ...prev, price: "" }))
    }
  }

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search)
    if (sp.get("face") && sp.get("coupon") && sp.get("price") && sp.get("maturity")) {
      calculate()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    applySeoTags({
      title: "Bond Yield Calculator - Current Yield & YTM",
      description:
        "Calculate bond current yield and yield to maturity (YTM) from price, coupon, face value, and maturity.",
      canonicalPath: "/bond-yield-calculator",
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Bond Yield Calculator",
        url: `${SITE_URL}/bond-yield-calculator`,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        description: "Estimate current yield and yield to maturity for a fixed-rate bond.",
      },
    })
  }, [])

  const rawFace = normalizeAmount(faceValue)
  const rawPrice = normalizeAmount(price)
  const shareUrl = results
    ? `${window.location.origin}${window.location.pathname}?face=${rawFace}&coupon=${couponRate}&price=${rawPrice}&maturity=${yearsToMaturity}&freq=${frequency}&currency=${currency}`
    : ""
  const shareText = results
    ? `Bond yield: ${formatDisplayNumber(parseFloat(rawFace))} face, ${couponRate}% coupon at ${formatDisplayNumber(parseFloat(rawPrice))}, ${yearsToMaturity} years → YTM ${results.ytmNominalAnnualPct.toFixed(2)}%`
    : ""

  return (
    <main className={CALCULATOR_MAIN_CLASS}>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">Bond Yield Calculator</h1>
          <p className="text-gray-600 mt-4 text-sm sm:text-base max-w-2xl mx-auto">
            Current yield and yield to maturity (YTM) for a plain fixed-coupon bond. Assumes coupons are paid on schedule
            and the bond is held to maturity.
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
                <Label htmlFor="bond-face" className="block text-sm font-medium">
                  Face (par) value
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
                    id="bond-face"
                    type="text"
                    value={formatNumberForDisplay(faceValue, currency)}
                    onChange={handleFaceChange}
                    placeholder="Eg. 1,000"
                    className="rounded-l-none w-full border-l-0"
                  />
                </div>
                {errors.faceValue && (
                  <p className="text-red-500 text-sm mt-1" role="alert">
                    {errors.faceValue}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="bond-coupon" className="block text-sm font-medium">
                  Annual coupon rate (%)
                </Label>
                <Input
                  id="bond-coupon"
                  type="text"
                  inputMode="decimal"
                  value={couponRate}
                  onChange={(e) => {
                    const v = e.target.value
                    if (/^\d*\.?\d*$/.test(v)) {
                      setCouponRate(v)
                      setErrors((prev) => ({ ...prev, couponRate: "" }))
                    }
                  }}
                  placeholder="Eg. 5"
                  className="mt-1"
                />
                {errors.couponRate && (
                  <p className="text-red-500 text-sm mt-1" role="alert">
                    {errors.couponRate}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="bond-price" className="block text-sm font-medium">
                  Current market price
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
                    id="bond-price"
                    type="text"
                    value={formatNumberForDisplay(price, currency)}
                    onChange={handlePriceChange}
                    placeholder="Eg. 950"
                    className="rounded-l-none w-full border-l-0"
                  />
                </div>
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1" role="alert">
                    {errors.price}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="bond-years" className="block text-sm font-medium">
                  Years to maturity
                </Label>
                <Input
                  id="bond-years"
                  type="text"
                  inputMode="decimal"
                  value={yearsToMaturity}
                  onChange={(e) => {
                    const v = e.target.value
                    if (/^\d*\.?\d*$/.test(v)) {
                      setYearsToMaturity(v)
                      setErrors((prev) => ({ ...prev, yearsToMaturity: "" }))
                    }
                  }}
                  placeholder="Eg. 10"
                  className="mt-1"
                />
                {errors.yearsToMaturity && (
                  <p className="text-red-500 text-sm mt-1" role="alert">
                    {errors.yearsToMaturity}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="bond-frequency" className="block text-sm font-medium">
                  Coupon payments per year
                </Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger id="bond-frequency" className="mt-1 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 (annual)</SelectItem>
                    <SelectItem value="2">2 (semi-annual)</SelectItem>
                  </SelectContent>
                </Select>
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
              <p className="text-xs text-gray-500 text-center">
                Annual coupon: {formatDisplayNumber(results.annualCouponCash)}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-gray-600">Current yield</p>
                  <p className="font-semibold">{results.currentYieldPct.toFixed(4)}%</p>
                  <p className="text-xs text-gray-500 mt-1">Annual coupon ÷ price</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-gray-600">YTM (effective annual)</p>
                  <p className="font-semibold">{results.ytmEffectiveAnnualPct.toFixed(4)}%</p>
                  <p className="text-xs text-gray-500 mt-1">Compounded per payment period</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md sm:col-span-2">
                  <p className="text-gray-600">YTM (nominal annual, {frequency === "2" ? "bond-style ×2" : "×1"})</p>
                  <p className="font-semibold">{results.ytmNominalAnnualPct.toFixed(4)}%</p>
                  <p className="text-xs text-gray-500 mt-1">Periodic yield × payments per year</p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        <UseOurCalculators exclude="bond-yield" className="mt-8" />
      </div>
    </main>
  )
}
