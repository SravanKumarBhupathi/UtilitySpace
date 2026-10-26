"use client";

import { useState } from "react";
import { CalculatorLayout } from "@/components/calculator-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function ProfitLossCalculator() {
  const [costPrice, setCostPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ amount: number, percentage: number, isProfit: boolean, isBreakEven: boolean } | null>(null);

  const calculate = () => {
    setError(null);
    setResult(null);

    const cp = parseFloat(costPrice);
    const sp = parseFloat(sellingPrice);

    if (isNaN(cp) || isNaN(sp)) {
      setError("Please enter valid numbers for both prices.");
      return;
    }

    if (cp < 0 || sp < 0) {
       setError("Prices cannot be negative.");
       return;
    }

    const difference = sp - cp;
    let percentage = 0;

    if (cp !== 0) {
       percentage = (Math.abs(difference) / cp) * 100;
    }

    setResult({
       amount: Math.abs(difference),
       percentage,
       isProfit: difference > 0,
       isBreakEven: difference === 0
    });
  };

  const reset = () => {
    setCostPrice("");
    setSellingPrice("");
    setResult(null);
    setError(null);
  };

  return (
    <CalculatorLayout
      title="Profit and Loss Calculator"
      description="Calculate profit, loss, and margin percentage based on cost and selling price."
    >
      <Card className="shadow-md">
        <CardContent className="p-6 md:p-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="cost-price">Cost Price</Label>
                <div className="relative">
                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                   <Input
                     id="cost-price"
                     type="number"
                     placeholder="0.00"
                     className="pl-8"
                     value={costPrice}
                     onChange={(e) => setCostPrice(e.target.value)}
                   />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="selling-price">Selling Price</Label>
                <div className="relative">
                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                   <Input
                     id="selling-price"
                     type="number"
                     placeholder="0.00"
                     className="pl-8"
                     value={sellingPrice}
                     onChange={(e) => setSellingPrice(e.target.value)}
                   />
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center text-sm font-medium text-red-500 bg-red-500/10 p-3 rounded-md border border-red-500/20">
                 <AlertCircle className="w-4 h-4 mr-2 shrink-0" /> {error}
              </div>
            )}

            <Button onClick={calculate} className="w-full md:w-auto">Calculate</Button>

            {result && (
              <div className="p-6 bg-muted/50 rounded-lg border border-border mt-8 text-center animate-in fade-in zoom-in-95 duration-200">
                <p className="text-xs font-semibold text-secondary-text uppercase tracking-wider mb-2">
                   {result.isBreakEven ? "Result" : result.isProfit ? "Profit" : "Loss"}
                </p>
                <div className={`text-4xl md:text-5xl font-heading font-bold mb-4 ${result.isBreakEven ? 'text-primary' : result.isProfit ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                  {result.isBreakEven ? "Break Even" : result.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                {!result.isBreakEven && (
                   <p className="text-sm text-secondary-text font-medium">
                     {result.percentage.toFixed(2)}% margin
                   </p>
                )}
                <div className="mt-6">
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
