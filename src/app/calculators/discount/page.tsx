"use client";

import { useState } from "react";
import { CalculatorLayout } from "../layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [result, setResult] = useState<{ saved: number; final: number } | null>(null);

  const calculate = () => {
    const price = parseFloat(originalPrice);
    const discount = parseFloat(discountPercent);

    if (!isNaN(price) && !isNaN(discount)) {
      const saved = (price * discount) / 100;
      const final = price - saved;
      setResult({ saved, final });
    } else {
      setResult(null);
    }
  };

  const reset = () => {
    setOriginalPrice("");
    setDiscountPercent("");
    setResult(null);
  };

  return (
    <CalculatorLayout
      title="Discount Calculator"
      description="Find out the final price after a discount."
    >
      <Card className="shadow-md">
        <CardContent className="p-6 md:p-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price">Original Price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text">$</span>
                  <Input
                    id="price"
                    type="number"
                    placeholder="100.00"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount">Discount Percentage</Label>
                <div className="relative">
                  <Input
                    id="discount"
                    type="number"
                    placeholder="20"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-text">%</span>
                </div>
              </div>
            </div>

            <Button onClick={calculate} className="w-full md:w-auto">Calculate Discount</Button>

            {result && (
              <div className="p-6 bg-muted/50 rounded-lg border border-border mt-8 text-center animate-in fade-in zoom-in-95 duration-200">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center p-4 bg-background rounded-md border border-border">
                    <p className="text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1">Final Price</p>
                    <div className="text-2xl md:text-3xl font-heading font-bold text-success">
                      ${result.final.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-background rounded-md border border-border">
                    <p className="text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1">You Save</p>
                    <div className="text-2xl md:text-3xl font-heading font-bold text-primary">
                      ${result.saved.toFixed(2)}
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
