"use client";

import { useState } from "react";
import { CalculatorLayout } from "@/components/calculator-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [compoundsPerYear, setCompoundsPerYear] = useState("12"); // Default monthly

  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ interest: number; total: number } | null>(null);

  const calculate = () => {
    setError(null);
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const t = parseFloat(time);
    const n = parseFloat(compoundsPerYear);

    if (isNaN(p) || isNaN(r) || isNaN(t) || isNaN(n)) {
      setError("Please enter valid numbers for all fields.");
      setResult(null);
      return;
    }

    if (p < 0 || r < 0 || t < 0 || n <= 0) {
      setError("Values cannot be negative, and compound frequency must be positive.");
      setResult(null);
      return;
    }

    // Compound Interest formula: A = P(1 + r/n)^(nt)
    // where r is decimal rate
    const rDecimal = r / 100;
    const total = p * Math.pow(1 + (rDecimal / n), n * t);
    const interest = total - p;

    setResult({ interest, total });
  };

  const reset = () => {
    setPrincipal("");
    setRate("");
    setTime("");
    setCompoundsPerYear("12");
    setResult(null);
    setError(null);
  };

  return (
    <CalculatorLayout
      title="Compound Interest Calculator"
      description="Determine the future value of an investment or loan where interest is compounded."
    >
      <Card className="shadow-md">
        <CardContent className="p-6 md:p-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="principal">Principal Amount (₹)</Label>
                <Input
                  id="principal"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="e.g. 10000"
                  value={principal}
                  onChange={(e) => { setPrincipal(e.target.value); setError(null); }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rate">Annual Interest Rate (%)</Label>
                <Input
                  id="rate"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="e.g. 5.5"
                  value={rate}
                  onChange={(e) => { setRate(e.target.value); setError(null); }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time Duration (Years)</Label>
                <Input
                  id="time"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="e.g. 5"
                  value={time}
                  onChange={(e) => { setTime(e.target.value); setError(null); }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="compounding">Compound Frequency</Label>
                <select
                  id="compounding"
                  className="w-full bg-background border border-border rounded-md px-3 h-10 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                  value={compoundsPerYear}
                  onChange={(e) => { setCompoundsPerYear(e.target.value); setError(null); }}
                >
                  <option value="1">Annually (Once a year)</option>
                  <option value="2">Semi-Annually (Twice a year)</option>
                  <option value="4">Quarterly (4 times a year)</option>
                  <option value="12">Monthly (12 times a year)</option>
                  <option value="365">Daily (365 times a year)</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="flex items-center text-sm font-medium text-red-500 bg-red-500/10 p-3 rounded-md border border-red-500/20">
                 <AlertCircle className="w-4 h-4 mr-2 shrink-0" /> {error}
              </div>
            )}

            <Button onClick={calculate} className="w-full md:w-auto">Calculate Compound Interest</Button>

            {result && (
              <div className="p-6 bg-muted/50 rounded-lg border border-border mt-8 text-center animate-in fade-in zoom-in-95 duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col items-center p-4 bg-background rounded-md border border-border">
                     <p className="text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1">Total Interest Earned</p>
                     <div className="text-xl md:text-2xl font-heading font-bold text-primary">
                       {result.interest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                     </div>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-background rounded-md border border-border">
                     <p className="text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1">Total Amount</p>
                     <div className="text-xl md:text-2xl font-heading font-bold text-success">
                       {result.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                     </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-center gap-4">
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
