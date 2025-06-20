import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, HelpCircle, Info, TrendingDown, TrendingUp } from "lucide-react"

export default function AmortizationInfo() {
  return (
    <div className="space-y-12 bg-gray-100" itemScope itemType="https://schema.org/HowTo">

      <meta itemProp="name" content="How to understand loan amortization" />
      <meta
        itemProp="description"
        content="Learn how loan amortization works and how to calculate your loan payments"
      />
      
      <br />
      <br />  

      <section id="what-is-amortization" aria-labelledby="what-is-heading">
        <div className="flex items-center gap-2 mb-4">
          <Info className="h-5 w-5 text-primary" />
          <h2
            id="what-is-heading"
            className="text-2xl font-semibold"
            itemProp="step"
            itemScope
            itemType="https://schema.org/HowToStep"
          >
            <meta itemProp="name" content="Understand what amortization is" />
            What is Amortization?
          </h2>
        </div>
        <div className="flex items-center gap-2 m-4">
          <p className="text-gray-700">Amortization refers to the process of repaying a loan through scheduled, periodic payments that cover both principal and interest. Over the time, interest component decreases while the principal component increases.</p>

        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
              <CardTitle className="text-xl">Understanding Amortization</CardTitle>
              <CardDescription>The basics of loan repayment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div itemProp="text">
                <p>
                  Amortization refers to the process of paying off a debt (typically a home, car loan, or personal
                  loan) through regular payments over time. Each payment consists of both principal and interest, with
                  the proportion changing over the life of the loan.
                </p>
                <p className="mt-3">
                  In the early years of a loan, a larger portion of each payment goes toward interest rather than paying
                  down the principal. As time passes, this ratio shifts, with more of each payment going toward the
                  principal balance.
                </p>
              </div>
              <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                <TrendingDown className="h-4 w-4" />
                <span>Interest portion decreases over time</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>Principal portion increases over time</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">How Amortization Works</CardTitle>
              <CardDescription>The mathematics behind your payments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div itemProp="text">
                <p>
                  The amortization formula calculates your fixed monthly payment based on the principal amount, interest
                  rate, and loan term. This payment remains constant throughout the loan term (for fixed-rate loans).
                </p>
                <p className="mt-3">The formula for calculating the EMI installments is:</p>
              </div>
              <div className="p-4 bg-muted rounded-md text-center">
                <p className="font-mono">EMI = P × r × (1 + r)ⁿ ÷ [(1 + r)ⁿ - 1]</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Where: P = Principal, r = Monthly interest rate, n = Number of payments
                </p>
              </div>
              <p>
                Each payment is split between interest and principal. The interest portion is calculated by multiplying
                the current loan balance by the monthly interest rate.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section
        id="benefits"
        aria-labelledby="benefits-heading"
        itemProp="step"
        itemScope
        itemType="https://schema.org/HowToStep"
      >
        <meta itemProp="name" content="Understand the benefits of amortization" />
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="h-5 w-5 text-primary" />
          <h2 id="benefits-heading" className="text-2xl font-semibold">
            Benefits of Understanding Amortization
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Better Financial Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <p itemProp="text">
                Understanding how your loan amortizes helps you plan your finances more effectively. You'll know exactly
                how much you're paying in interest versus principal at any point in the loan term.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Informed Refinancing Decisions</CardTitle>
            </CardHeader>
            <CardContent>
              <p itemProp="text">
                By reviewing your amortization schedule, you can determine the best time to refinance your loan. This is
                especially useful when interest rates drop or your financial situation changes.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Early Payoff Strategies</CardTitle>
            </CardHeader>
            <CardContent>
              <p itemProp="text">
                With an amortization schedule, you can see how making extra payments reduces your loan term and saves on
                interest. Even small additional payments can lead to significant savings over time.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="faq" aria-labelledby="faq-heading" itemProp="step" itemScope itemType="https://schema.org/HowToStep">
        <meta itemProp="name" content="Review frequently asked questions" />
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="h-5 w-5 text-primary" />
          <h2 id="faq-heading" className="text-2xl font-semibold">
            Frequently Asked Questions
          </h2>
        </div>
        <Card>
          <CardContent className="pt-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What happens if I make extra payments?</AccordionTrigger>
                <AccordionContent>
                  <p itemProp="text">
                    Making extra payments reduces your principal balance faster, which means less interest accrues over
                    time. This can significantly shorten your loan term and reduce the total interest paid. Most loans
                    allow you to make additional payments without penalty, but it's always good to check your loan
                    terms.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How does amortization differ for different loan types?</AccordionTrigger>
                <AccordionContent>
                  <div itemProp="text">
                    <p>Different loan types have different amortization structures:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>
                        <strong>Fixed-rate mortgages</strong>: Consistent payment amount throughout the loan term.
                      </li>
                      <li>
                        <strong>Adjustable-rate mortgages (ARMs)</strong>: Payments may change when the interest rate
                        adjusts.
                      </li>
                      <li>
                        <strong>Interest-only loans</strong>: Initial payments cover only interest, with principal
                        payments starting later.
                      </li>
                      <li>
                        <strong>Balloon loans</strong>: Regular payments followed by one large payment at the end of the
                        term.
                      </li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Why does more of my payment go to interest at the beginning?</AccordionTrigger>
                <AccordionContent>
                  <p itemProp="text">
                    This happens because interest is calculated based on the outstanding principal balance. At the
                    beginning of the loan, your principal balance is at its highest, so more interest accrues. As you
                    pay down the principal over time, less interest accrues, and more of each payment goes toward
                    reducing the principal.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Can I change my amortization schedule?</AccordionTrigger>
                <AccordionContent>
                  <div itemProp="text">
                    <p>Yes, you can change your amortization schedule by:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Making extra payments toward the principal</li>
                      <li>Refinancing your loan with different terms</li>
                      <li>Requesting a loan modification from lender</li>
                      <li>Switching from a 30-year to a 15-year loan (or vice versa)</li>
                    </ul>
                    <p className="mt-2">
                      Each of these actions can affect how quickly your loan amortizes and how much interest you pay
                      over time.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>How accurate is an amortization calculator?</AccordionTrigger>
                <AccordionContent>
                  <div itemProp="text">
                    <p>
                      Amortization calculators provide a good estimate of your payment schedule based on the information
                      you provide. However, actual loan payments may vary slightly due to:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Rounding differences</li>
                      <li>Payment processing dates</li>
                      <li>Escrow adjustments (for mortgages)</li>
                      <li>Changes in insurance or tax costs over time</li>
                    </ul>
                    <p className="mt-2">
                      For the most accurate information, always refer to your loan agreement and statements from your
                      lender.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </section>

      <section
        id="tips"
        aria-labelledby="tips-heading"
        className="mb-10"
        itemProp="step"
        itemScope
        itemType="https://schema.org/HowToStep"
      >
        <meta itemProp="name" content="Learn tips for managing your loan" />
        <div className="flex items-center gap-2 mb-4">
          <Info className="h-5 w-5 text-primary" />
          <h2 id="tips-heading" className="text-2xl font-semibold">
            Tips for Managing Your Loan
          </h2>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Strategies to Save on Interest</h3>
                <ul className="space-y-2" itemProp="text">
                  <li className="flex gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold">1</span>
                    </div>
                    <span>Make bi-weekly payments instead of monthly payments</span>
                  </li>
                  <li className="flex gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold">2</span>
                    </div>
                    <span>Round up your payments to the nearest $50 or $100</span>
                  </li>
                  <li className="flex gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold">3</span>
                    </div>
                    <span>Make one extra payment per year</span>
                  </li>
                  <li className="flex gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold">4</span>
                    </div>
                    <span>Apply windfalls (tax refunds, bonuses) to your principal</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-medium">When to Consider Refinancing</h3>
                <ul className="space-y-2" itemProp="text">
                  <li className="flex gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold">1</span>
                    </div>
                    <span>When interest rates drop significantly (usually by 1% or more)</span>
                  </li>
                  <li className="flex gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold">2</span>
                    </div>
                    <span>When your credit score has improved substantially</span>
                  </li>
                  <li className="flex gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold">3</span>
                    </div>
                    <span>When you want to change your loan term (shorter or longer)</span>
                  </li>
                  <li className="flex gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold">4</span>
                    </div>
                    <span>When you want to switch from an adjustable to a fixed rate</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <footer className="border-t pt-8 pb-12">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            This calculator is for educational purposes only. The information provided is an estimate and should not be
            considered financial advice.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Always consult with a qualified financial professional before making important financial decisions.
          </p>
        </div>
      </footer>
    </div>
  )
}

