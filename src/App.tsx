import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Analytics } from "@vercel/analytics/react"
import AmortizationInfo from "@/components/ui/info"

export default function AmortizationCalculator() {
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
      newSchedule.push({ month: i, emi: emi.toFixed(2), principal: principalPayment.toFixed(2), interest: interest.toFixed(2), balance: balance.toFixed(2) })
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-center sm:text-4xl md:text-5xl">Loan Amortization Calculator</h1>
          <p className="text-gray-600 mt-2">Easily calculate your EMI, total interest, and loan repayment schedule.</p>
        </div>
        <div className="flex justify-center">
          <Card className="shadow-lg rounded-lg w-full max-w-2xl">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-semibold text-center">Loan Amortization Calculator</h2>
              <div className="space-y-4">
                <div>
                  <Label className="block text-sm font-medium">Loan Amount</Label>
                  <Input type="text" value={formatNumber(loanAmount)} onChange={handleLoanAmountChange} placeholder="Eg. 50,000" className="mt-1" />
                  {errors.loanAmount && <p className="text-red-500 text-sm mt-1">{errors.loanAmount}</p>}
                </div>
                <div>
                  <Label className="block text-sm font-medium">Interest Rate (% per annum)</Label>
                  <Input type="number" value={interestRate} onChange={handleInterestRateChange} placeholder="Eg. 7.5" className="mt-1" />
                  {errors.interestRate && <p className="text-red-500 text-sm mt-1">{errors.interestRate}</p>}
                </div>
                <div>
                  <Label className="block text-sm font-medium">Loan Tenure (Years)</Label>
                  <Input type="number" value={loanTenure} onChange={handleLoanTenureChange} placeholder="Eg. 20" className="mt-1" />
                  {errors.loanTenure && <p className="text-red-500 text-sm mt-1">{errors.loanTenure}</p>}
                </div>
                <div className="flex space-x-4">
                  <Button variant="default" onClick={calculateEMI} className="w-1/2 text-lg py-2 !bg-black !text-white hover:!bg-gray-900 ">Calculate EMI</Button>
                  <Button variant="secondary" onClick={resetCalculator} className="w-1/2 text-lg bg-gray-200 text-black hover:bg-gray-300 py-2">Reset</Button>
                </div>
              </div>
            </CardContent>
            {schedule.length > 0 && (
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold text-center mb-3">Amortization Schedule</h3>

              <div className="overflow-x-auto max-h-96 max-w-800">
                <Table className="w-full border border-gray-300">
                  <TableHeader className="sticky top-0 bg-gray-200 text-gray-700 border-b border-gray-400">
                    <TableRow>
                      <TableHead className="p-2 text-center">Month</TableHead>
                      <TableHead className="p-2 text-right">EMI</TableHead>
                      <TableHead className="p-2 text-right">Principal</TableHead>
                      <TableHead className="p-2 text-right">Interest</TableHead>
                      <TableHead className="p-2 text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedule.map((row, index) => (
                      <TableRow key={row.month} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <TableCell className="p-2 text-center">{row.month}</TableCell>
                        <TableCell className="p-2 text-right">{row.emi}</TableCell>
                        <TableCell className="p-2 text-right">{row.principal}</TableCell>
                        <TableCell className="p-2 text-right">{row.interest}</TableCell>
                        <TableCell className="p-2 text-right">{row.balance}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          )}
          </Card>
        </div>     
        <AmortizationInfo/>
      </div> 
    <Analytics/>
    <SpeedInsights/>
    </div>
  );
}



