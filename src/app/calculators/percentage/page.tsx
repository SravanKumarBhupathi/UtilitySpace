"use client";

import { useState } from "react";
import { CalculatorLayout } from "@/components/calculator-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PercentageCalculator() {
  const [percent, setPercent] = useState("");
  const [value, setValue] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const p = parseFloat(percent);
    const v = parseFloat(value);

    if (!isNaN(p) && !isNaN(v)) {
      setResult((p / 100) * v);
    } else {
      setResult(null);
    }
  };

  const reset = () => {
    setPercent("");
    setValue("");
    setResult(null);
  };

  return (
    <CalculatorLayout
      title="Percentage Calculator"
      description="Calculate percentages quickly and accurately."
    >
      <Card className="shadow-md">
        <CardContent className="p-6 md:p-8">
          <div className="space-y-8">
            <div className="flex flex-col space-y-4">
              <h3 className="font-heading font-semibold text-lg">What is X% of Y?</h3>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full sm:w-1/3 flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="25"
                    value={percent}
                    onChange={(e) => setPercent(e.target.value)}
                    aria-label="Percentage"
                  />
                  <span className="text-secondary-text font-medium">%</span>
                </div>
                <span className="text-secondary-text font-medium">of</span>
                <div className="w-full sm:w-1/3">
                  <Input
                    type="number"
                    placeholder="800"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    aria-label="Value"
                  />
                </div>
                <div className="w-full sm:w-auto">
                  <Button onClick={calculate} className="w-full">Calculate</Button>
                </div>
              </div>
            </div>

            {result !== null && (
              <div className="p-6 bg-muted/50 rounded-lg border border-border mt-8 text-center animate-in fade-in zoom-in-95 duration-200">
                <p className="text-xs font-semibold text-secondary-text uppercase tracking-wider mb-2">Answer</p>
                <div className="text-4xl md:text-5xl font-heading font-bold text-primary mb-2">
                  {Number.isInteger(result) ? result : result.toFixed(2)}
                </div>
                <p className="text-sm text-secondary-text">
                  {percent}% of {value} = {result}
                </p>
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
