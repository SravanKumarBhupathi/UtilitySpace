"use client";

import { useState } from "react";
import { CalculatorLayout } from "@/components/calculator-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function PercentageChangeCalculator() {
  const [oldValue, setOldValue] = useState("");
  const [newValue, setNewValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ change: number, type: 'increase' | 'decrease' | 'none', difference: number } | null>(null);

  const calculate = () => {
    setError(null);
    setResult(null);

    const oldNum = parseFloat(oldValue);
    const newNum = parseFloat(newValue);

    if (isNaN(oldNum) || isNaN(newNum)) {
      setError("Please enter valid numbers in both fields.");
      return;
    }

    if (oldNum === 0 && newNum !== 0) {
      setError("Percentage change from zero is undefined (cannot divide by zero).");
      return;
    }

    const difference = newNum - oldNum;

    if (oldNum === 0 && newNum === 0) {
       setResult({ change: 0, type: 'none', difference: 0 });
       return;
    }

    const change = (difference / Math.abs(oldNum)) * 100;

    let type: 'increase' | 'decrease' | 'none' = 'none';
    if (change > 0) type = 'increase';
    if (change < 0) type = 'decrease';

    setResult({ change: Math.abs(change), type, difference: Math.abs(difference) });
  };

  const reset = () => {
    setOldValue("");
    setNewValue("");
    setResult(null);
    setError(null);
  };

  return (
    <CalculatorLayout
      title="Percentage Change Calculator"
      description="Calculate the percentage increase or decrease between two numbers."
    >
      <Card className="shadow-md">
        <CardContent className="p-6 md:p-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="old-value">Original Value</Label>
                <Input
                  id="old-value"
                  type="number"
                  placeholder="e.g. 100"
                  value={oldValue}
                  onChange={(e) => setOldValue(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-value">New Value</Label>
                <Input
                  id="new-value"
                  type="number"
                  placeholder="e.g. 120"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                />
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
                <p className="text-xs font-semibold text-secondary-text uppercase tracking-wider mb-2">Percentage Change</p>
                <div className="text-4xl md:text-5xl font-heading font-bold mb-4 flex justify-center items-baseline gap-2">
                  <span className={result.type === 'increase' ? 'text-green-600 dark:text-green-500' : result.type === 'decrease' ? 'text-red-600 dark:text-red-500' : 'text-primary'}>
                    {result.change.toFixed(2)}%
                  </span>
                  <span className="text-lg font-normal text-secondary-text capitalize">
                    {result.type}
                  </span>
                </div>
                <p className="text-sm text-secondary-text mb-4">
                  Absolute difference: <strong>{result.difference}</strong>
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
