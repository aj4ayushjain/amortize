import { Link } from "react-router-dom"

export type CalculatorPageId =
  | "amortization"
  | "loan-prepayment"
  | "emergency-fund"
  | "bond-yield"
  | "ppf"

type CalculatorLink = {
  id: CalculatorPageId
  path: string
  title: string
  description: string
  cta: string
}

const CALCULATORS: CalculatorLink[] = [
  {
    id: "amortization",
    path: "/",
    title: "Loan Amortization Calculator",
    description: "Calculate EMI and view your full monthly principal and interest split.",
    cta: "Use Amortization Calculator",
  },
  {
    id: "loan-prepayment",
    path: "/extra-payments-calculator",
    title: "Loan Prepayment Calculator",
    description: "See how prepaying principal can shorten tenure and save interest.",
    cta: "Use Loan Prepayment Calculator",
  },
  {
    id: "emergency-fund",
    path: "/emergency-fund-calculator",
    title: "Emergency Fund Calculator",
    description: "Calculate how much you need to save for a safety net.",
    cta: "Use Emergency Fund Calculator",
  },
  {
    id: "bond-yield",
    path: "/bond-yield-calculator",
    title: "Bond Yield Calculator",
    description: "Current yield and yield to maturity (YTM) from price, coupon, and maturity.",
    cta: "Use Bond Yield Calculator",
  },
  {
    id: "ppf",
    path: "/ppf-calculator",
    title: "PPF Calculator",
    description: "Estimate Public Provident Fund maturity with monthly deposits (illustrative).",
    cta: "Use PPF Calculator",
  },
]

type UseOurCalculatorsProps = {
  /** Hide the card for the calculator page the user is already on */
  exclude?: CalculatorPageId
  className?: string
}

export function UseOurCalculators({ exclude, className = "" }: UseOurCalculatorsProps) {
  const items = exclude ? CALCULATORS.filter((c) => c.id !== exclude) : CALCULATORS

  if (items.length === 0) return null

  return (
    <section
      className={`rounded-lg border bg-white p-4 sm:p-6 shadow-sm ${className}`}
      aria-labelledby="use-our-calculators-heading"
    >
      <h2 id="use-our-calculators-heading" className="text-xl sm:text-2xl font-semibold text-center">
        Use Our Calculators
      </h2>
      <p className="text-gray-600 text-sm sm:text-base text-center mt-2">
        Explore our free calculators for loans, payments, and savings.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        {items.map((calc) => (
          <div key={calc.id} className="rounded-md border p-4 bg-gray-50">
            <h3 className="font-semibold text-base sm:text-lg">{calc.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{calc.description}</p>
            <Link
              to={calc.path}
              className="inline-block mt-3 text-sm font-medium text-black underline underline-offset-4"
            >
              {calc.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
