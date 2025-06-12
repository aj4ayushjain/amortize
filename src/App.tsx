import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import AmortizationInfo from "@/components/ui/info"
import { BlogList } from "@/components/blog/BlogList"
import { BlogPost } from "@/components/blog/BlogPost"
import { Routes, Route } from "react-router-dom"

function AmortizationCalculator() {
  const [loanAmount, setLoanAmount] = useState<string>("")
  const [interestRate, setInterestRate] = useState<string>("")
  const [loanTenure, setLoanTenure] = useState<string>("")
  const [schedule, setSchedule] = useState<Array<{ month: number; emi: string; principal: string; interest: string; balance: string }>>([])
  

  const [errors, setErrors] = useState<{
    loanAmount?: string
    interestRate?: string
    loanTenure?: string
  }>({})


  const validateInputs = () => {
    let isValid = true
    let newErrors = {}
    if (!loanAmount || parseFloat(loanAmount) <= 0) {
      newErrors = { ...newErrors, loanAmount: "Please enter a valid loan amount" }
      isValid = false
    }
    if (!interestRate || parseFloat(interestRate) <= 0) {
      newErrors = { ...newErrors, interestRate: "Please enter a valid interest rate" }
      isValid = false
    }
    if (!loanTenure || parseFloat(loanTenure) <= 0) {
      newErrors = { ...newErrors, loanTenure: "Please enter a valid loan tenure" }
      isValid = false
    }
    setErrors(newErrors)
    return isValid
  }

  const formatNumber = (num: string) => {
    return num ? new Intl.NumberFormat("en-IN").format(Number(num)) : ""
  }

  const formatDisplayNumber = (num: number) => {

    return num ? new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(num) : ""
  }

  const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "") // Remove commas
    if (/^\d*$/.test(value)) {
      setLoanAmount(value)
      setErrors({ ...errors, loanAmount: "" })
    }
  }
  

  const handleInterestRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*\.?\d*$/.test(value)) { // Allows numbers and one decimal
      setInterestRate(value)
      setErrors({ ...errors, interestRate: "" })
    }
  }
  
  const handleLoanTenureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*$/.test(value)) { // Only allows whole numbers (no decimals)
      setLoanTenure(value)
      setErrors({ ...errors, loanTenure: "" })
    }
  }
  
  const calculateEMI = () => {

    if (!validateInputs()) return

    const principal = parseFloat(loanAmount)
    const rate = parseFloat(interestRate)
    const tenure = parseFloat(loanTenure)
    if (isNaN(principal) || isNaN(rate) || isNaN(tenure) || principal <= 0 || rate <= 0 || tenure <= 0) return
    
    const monthlyRate = rate / 100 / 12
    const numPayments = tenure * 12
    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1)

    let balance = principal
    let newSchedule = []
    for (let i = 1; i <= numPayments; i++) {
      let interest = balance * monthlyRate
      let principalPayment = emi - interest
      balance -= principalPayment
      newSchedule.push({ month: i, 
                         emi: formatDisplayNumber(emi), 
                         principal: formatDisplayNumber(principalPayment),
                        interest: formatDisplayNumber(interest),
                         balance: formatDisplayNumber(balance) })
    }
    setSchedule(newSchedule)
  }

  const resetCalculator = () => {
    setLoanAmount("")
    setInterestRate("")
    setLoanTenure("")
    setSchedule([])
    setErrors({})
  }

  return (
    <main className="container mx-auto px-4 py-6 pt-20 max-w-6xl">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl">
            Loan Amortization Calculator
          </h1>
          <p className="text-gray-600 mt-4 text-sm sm:text-base">
            Calculate your EMI, total interest, and view detailed loan repayment schedule
          </p>
        </div>
        
        <Card className="shadow-lg rounded-lg">
          <CardContent className="p-4 sm:p-6 space-y-6">
            <form onSubmit={(e) => { e.preventDefault(); calculateEMI(); }} className="space-y-4">
              <div>
                <Label htmlFor="loanAmount" className="block text-sm font-medium">Loan Amount</Label>
                <Input 
                  id="loanAmount"
                  type="text" 
                  value={formatNumber(loanAmount)} 
                  onChange={handleLoanAmountChange} 
                  placeholder="Eg. 50,000" 
                  className="mt-1 w-full"
                  aria-label="Loan Amount"
                  aria-describedby="loanAmount-error"
                />
                {errors.loanAmount && (
                  <p id="loanAmount-error" className="text-red-500 text-sm mt-1" role="alert">
                    {errors.loanAmount}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="interestRate" className="block text-sm font-medium">Interest Rate (% per annum)</Label>
                <Input 
                  id="interestRate"
                  type="number" 
                  value={interestRate} 
                  onChange={handleInterestRateChange} 
                  placeholder="Eg. 7.5" 
                  className="mt-1 w-full"
                  aria-label="Interest Rate"
                  aria-describedby="interestRate-error"
                />
                {errors.interestRate && (
                  <p id="interestRate-error" className="text-red-500 text-sm mt-1" role="alert">
                    {errors.interestRate}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="loanTenure" className="block text-sm font-medium">Loan Tenure (Years)</Label>
                <Input 
                  id="loanTenure"
                  type="number" 
                  value={loanTenure} 
                  onChange={handleLoanTenureChange} 
                  placeholder="Eg. 20" 
                  className="mt-1 w-full"
                  aria-label="Loan Tenure"
                  aria-describedby="loanTenure-error"
                />
                {errors.loanTenure && (
                  <p id="loanTenure-error" className="text-red-500 text-sm mt-1" role="alert">
                    {errors.loanTenure}
                  </p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-2">
                <Button 
                  type="submit"
                  variant="default" 
                  className="w-full sm:w-1/2 text-base sm:text-lg py-2 !bg-black !text-white hover:!bg-gray-900"
                >
                  Calculate EMI
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
          
          {schedule.length > 0 && (
            <CardContent className="border-t p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-center mb-4">Amortization Schedule</h2>
              <div className="overflow-x-auto max-h-[calc(100vh-24rem)]">
                <Table className="w-full border border-gray-200 text-sm sm:text-base">
                  <TableHeader className="sticky top-0 bg-gray-100">
                    <TableRow>
                      <TableHead className="p-2 sm:p-3 text-center">Month</TableHead>
                      <TableHead className="p-2 sm:p-3 text-right">EMI</TableHead>
                      <TableHead className="p-2 sm:p-3 text-right">Principal</TableHead>
                      <TableHead className="p-2 sm:p-3 text-right">Interest</TableHead>
                      <TableHead className="p-2 sm:p-3 text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedule.map((row, index) => (
                      <TableRow key={row.month} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <TableCell className="p-2 sm:p-3 text-center">{row.month}</TableCell>
                        <TableCell className="p-2 sm:p-3 text-right">{row.emi}</TableCell>
                        <TableCell className="p-2 sm:p-3 text-right">{row.principal}</TableCell>
                        <TableCell className="p-2 sm:p-3 text-right">{row.interest}</TableCell>
                        <TableCell className="p-2 sm:p-3 text-right">{row.balance}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          )}
        </Card>
        
        <div className="mt-8">
          <AmortizationInfo />
        </div>
      </div>
    </main>
  );
}

function Blog() {
  return (
    <main className="container mx-auto px-4 py-6 pt-20 max-w-6xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8">Blog</h1>
      <BlogList />
    </main>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<AmortizationCalculator />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
    </div>
  );
}
