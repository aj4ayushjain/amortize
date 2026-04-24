# Amortization.in

A free, open-source suite of financial calculators — loan EMI, SIP, PPF, CAGR, bond yield, and more. Built with React and TypeScript, deployed at [amortization.in](https://www.amortization.in).

## Calculators

| Calculator | Route |
|---|---|
| Loan Amortization | `/` |
| Home Loan | `/home-loan-calculator` |
| Car Loan | `/car-loan-calculator` |
| Personal Loan | `/personal-loan-calculator` |
| Bike Loan | `/bike-loan-calculator` |
| Extra Payments | `/extra-payments-calculator` |
| Emergency Fund | `/emergency-fund-calculator` |
| SIP | `/sip-calculator` |
| PPF | `/ppf-calculator` |
| CAGR | `/cagr-calculator` |
| Bond Yield | `/bond-yield-calculator` |

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** — dev server and bundler
- **Tailwind CSS v4** — styling
- **shadcn/ui** (Radix UI) — components
- **React Router v7** — client-side routing
- **ExcelJS** + **jsPDF** — export amortization schedules
- **Vitest** — unit tests

## Prerequisites

Make sure you have the following installed before you begin:

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

To check your versions:

```bash
node -v
npm -v
```

## Getting Started

**1. Clone the repository**

```bash
git clone https://github.com/your-username/amortize.git
cd amortize
```

**2. Install dependencies**

```bash
npm install
```

**3. Start the development server**

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. The page reloads automatically as you edit files.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server at `localhost:5173` |
| `npm run build` | Type-check and build for production (output in `dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |
| `npm test` | Run all unit tests once |
| `npm run test:watch` | Run tests in watch mode (re-runs on file save) |

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI primitives (Button, Input, Card…)
│   ├── LoanCalculator.tsx
│   ├── SIPCalculator.tsx
│   └── ...              # One file per calculator
├── lib/
│   ├── currency.ts      # Currency options, formatting, locale detection
│   ├── seo.ts           # SEO tag helpers
│   └── utils.ts
├── services/
│   ├── scheduleExcel.ts # Export amortization schedule to .xlsx
│   └── schedulePDF.ts   # Export amortization schedule to .pdf
├── test/
│   └── loanCalculator.test.ts
└── App.tsx              # Route definitions
```

## Running Tests

```bash
npm test
```

Tests are written with [Vitest](https://vitest.dev/) and live in `src/test/`. To run in watch mode while developing:

```bash
npm run test:watch
```

## Building for Production

```bash
npm run build
```

The compiled output lands in the `dist/` folder. You can preview it locally before deploying:

```bash
npm run preview
```

## Deployment

The project is configured for [Vercel](https://vercel.com/). Connect your GitHub repository to Vercel and it will deploy automatically on every push to `master`. The `vercel.json` at the root handles SPA routing rewrites.

## Contributing

1. Fork the repository and create a new branch from `master`
2. Make your changes
3. Run `npm test` and `npm run lint` to make sure nothing is broken
4. Open a pull request with a clear description of what you changed and why

## License

MIT
