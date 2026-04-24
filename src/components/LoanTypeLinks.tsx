import { Link } from "react-router-dom"

type LoanTypeEntry = {
  id: string
  path: string
  title: string
  subtitle: string
}

const LOAN_TYPES: LoanTypeEntry[] = [
  {
    id: "home-loan",
    path: "/home-loan-calculator",
    title: "Home Loan",
    subtitle: "20 yr · 8.5% p.a.",
  },
  {
    id: "car-loan",
    path: "/car-loan-calculator",
    title: "Car Loan",
    subtitle: "5 yr · 9.5% p.a.",
  },
  {
    id: "personal-loan",
    path: "/personal-loan-calculator",
    title: "Personal Loan",
    subtitle: "3 yr · 14% p.a.",
  },
  {
    id: "bike-loan",
    path: "/bike-loan-calculator",
    title: "Bike Loan",
    subtitle: "3 yr · 10.5% p.a.",
  },
]

type LoanTypeLinksProps = {
  exclude?: string
}

export function LoanTypeLinks({ exclude }: LoanTypeLinksProps) {
  const items = exclude ? LOAN_TYPES.filter((l) => l.id !== exclude) : LOAN_TYPES

  if (items.length === 0) return null

  return (
    <section className="rounded-lg border bg-white p-4 sm:p-6 shadow-sm" aria-labelledby="loan-types-heading">
      <h2 id="loan-types-heading" className="text-lg sm:text-xl font-semibold text-center">
        Calculate for a Specific Loan Type
      </h2>
      <p className="text-gray-500 text-sm text-center mt-1">
        Pre-filled with typical values — change any input to match your loan.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        {items.map((loan) => (
          <Link
            key={loan.id}
            to={loan.path}
            className="flex flex-col items-center justify-center rounded-md border p-3 bg-gray-50 hover:bg-gray-100 transition-colors text-center"
          >
            <span className="font-medium text-sm sm:text-base">{loan.title}</span>
            <span className="text-xs text-gray-500 mt-0.5">{loan.subtitle}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
