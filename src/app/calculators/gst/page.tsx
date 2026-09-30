"use client";

import { useState } from "react";
import { CalculatorLayout } from "../layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function GSTCalculator() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("18");
  const [mode, setMode] = useState<"add" | "remove">("add");
  const [result, setResult] = useState<{ netPrice: number; gstAmount: number; totalAmount: number } | null>(null);

  const calculate = () => {
    const amt = parseFloat(amount);
    const gstRate = parseFloat(rate);

    if (!isNaN(amt) && !isNaN(gstRate)) {
      if (mode === "add") {
        const gstAmount = (amt * gstRate) / 100;
        const totalAmount = amt + gstAmount;
        setResult({ netPrice: amt, gstAmount, totalAmount });
      } else {
        const netPrice = amt - (amt * (gstRate / (100 + gstRate)));
        const gstAmount = amt - netPrice;
        setResult({ netPrice, gstAmount, totalAmount: amt });
      }
    } else {
      setResult(null);
    }
  };

  const reset = () => {
    setAmount("");
    setRate("18");
    setResult(null);
  };

  return (
    <CalculatorLayout
      title="GST Calculator"
      description="Calculate Goods and Services Tax easily."
    >
      <Card className="shadow-md">
        <CardContent className="p-6 md:p-8">
          <div className="space-y-6">
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  checked={mode === "add"}
                  onChange={() => setMode("add")}
                  className="accent-primary"
                />
                <span className="text-sm font-medium">Add GST</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  checked={mode === "remove"}
                  onChange={() => setMode("remove")}
                  className="accent-primary"
                />
                <span className="text-sm font-medium">Remove GST</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="amount">{mode === "add" ? "Net Amount" : "Total Amount"}</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="1000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rate">GST Rate (%)</Label>
                <Input
                  id="rate"
                  type="number"
                  placeholder="18"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={calculate} className="w-full md:w-auto">Calculate</Button>

            {result && (
              <div className="p-6 bg-muted/50 rounded-lg border border-border mt-8 text-center animate-in fade-in zoom-in-95 duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col items-center p-4 bg-background rounded-md border border-border">
                    <p className="text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1">Net Price</p>
                    <div className="text-xl md:text-2xl font-heading font-bold text-foreground">
                      {result.netPrice.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-background rounded-md border border-border">
                    <p className="text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1">GST Amount</p>
                    <div className="text-xl md:text-2xl font-heading font-bold text-foreground">
                      {result.gstAmount.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-background rounded-md border border-border">
                    <p className="text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1">Total Amount</p>
                    <div className="text-xl md:text-2xl font-heading font-bold text-primary">
                      {result.totalAmount.toFixed(2)}
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
