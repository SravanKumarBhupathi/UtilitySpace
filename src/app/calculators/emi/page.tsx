"use client";

import { useState } from "react";
import { CalculatorLayout } from "@/components/calculator-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTenure, setLoanTenure] = useState("");
  const [result, setResult] = useState<{ emi: number; totalInterest: number; totalPayment: number } | null>(null);

  const calculate = () => {
    const principal = parseFloat(loanAmount);
    const ratePerYear = parseFloat(interestRate);
    const tenureMonths = parseFloat(loanTenure) * 12;

    if (!isNaN(principal) && !isNaN(ratePerYear) && !isNaN(tenureMonths) && ratePerYear > 0 && tenureMonths > 0) {
      const ratePerMonth = ratePerYear / 12 / 100;
      const emi = (principal * ratePerMonth * Math.pow(1 + ratePerMonth, tenureMonths)) / (Math.pow(1 + ratePerMonth, tenureMonths) - 1);
      const totalPayment = emi * tenureMonths;
      const totalInterest = totalPayment - principal;
      setResult({ emi, totalInterest, totalPayment });
    } else {
      setResult(null);
    }
  };

  const reset = () => {
    setLoanAmount("");
    setInterestRate("");
    setLoanTenure("");
    setResult(null);
  };

  return (
    <CalculatorLayout
      title="EMI Calculator"
      description="Calculate Equated Monthly Installments for loans."
    >
      <Card className="shadow-md">
        <CardContent className="p-6 md:p-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Loan Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="100000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rate">Interest Rate (% P.A.)</Label>
                <Input
                  id="rate"
                  type="number"
                  placeholder="10"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tenure">Loan Tenure (Years)</Label>
                <Input
                  id="tenure"
                  type="number"
                  placeholder="5"
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={calculate} className="w-full md:w-auto">Calculate EMI</Button>

            {result && (
              <div className="p-6 bg-muted/50 rounded-lg border border-border mt-8 text-center animate-in fade-in zoom-in-95 duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col items-center p-4 bg-background rounded-md border border-border">
                    <p className="text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1">Monthly EMI</p>
                    <div className="text-xl md:text-2xl font-heading font-bold text-primary">
                      {result.emi.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-background rounded-md border border-border">
                    <p className="text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1">Total Interest</p>
                    <div className="text-xl md:text-2xl font-heading font-bold text-foreground">
                      {result.totalInterest.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-background rounded-md border border-border">
                    <p className="text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1">Total Payment</p>
                    <div className="text-xl md:text-2xl font-heading font-bold text-foreground">
                      {result.totalPayment.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <Button variant="ghost" size="sm" onClick={reset}>Reset</Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </CalculatorLayout>
  );
}
