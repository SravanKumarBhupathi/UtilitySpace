"use client";

import { useState } from "react";
import { CalculatorLayout } from "../layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

export default function AverageCalculator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{ average: number; sum: number; count: number; min: number; max: number } | null>(null);
  const [error, setError] = useState("");

  const calculate = () => {
    // split by comma, space, or newline
    const items = input.split(/[, \n]+/).filter(i => i.trim() !== "");

    if (items.length === 0) {
      setError("Please enter some numbers");
      setResult(null);
      return;
    }

    const numbers = items.map(Number);

    if (numbers.some(isNaN)) {
      setError("Input contains invalid numbers. Please use only digits, decimals, and separators (comma, space, or new line).");
      setResult(null);
      return;
    }

    const sum = numbers.reduce((a, b) => a + b, 0);
    const count = numbers.length;
    const average = sum / count;
    const min = Math.min(...numbers);
    const max = Math.max(...numbers);

    setResult({ average, sum, count, min, max });
    setError("");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const reset = () => {
    setInput("");
    setResult(null);
    setError("");
  };

  return (
    <CalculatorLayout
      title="Average Calculator"
      description="Quickly calculate the average, sum, minimum, and maximum of a set of numbers."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-md">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="numbers">Enter numbers</Label>
              <p className="text-xs text-secondary-text mb-2">Separate numbers using commas, spaces, or new lines.</p>
              <textarea
                id="numbers"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. 10, 15, 20, 25"
                className="w-full h-48 p-3 text-sm border border-border bg-card rounded-md resize-y focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary shadow-sm"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 font-medium">{error}</p>
            )}

            <div className="flex gap-3">
              <Button onClick={calculate} className="flex-1">Calculate</Button>
              <Button variant="outline" onClick={reset}>Clear</Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card className="shadow-md border-primary/20 bg-primary/5 animate-in fade-in duration-200">
            <CardContent className="p-6">
              <div className="text-center mb-8">
                <p className="text-xs font-semibold text-secondary-text uppercase tracking-wider mb-2">Average (Mean)</p>
                <div className="text-4xl md:text-5xl font-heading font-bold text-primary flex items-center justify-center gap-3">
                  {Number.isInteger(result.average) ? result.average : result.average.toFixed(4).replace(/\.?0+$/, '')}
                  <Button variant="ghost" size="icon" onClick={() => copyToClipboard(result.average.toString())} className="h-8 w-8 text-secondary-text hover:text-primary">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background rounded-md p-3 border border-border">
                  <p className="text-xs font-medium text-secondary-text">Count</p>
                  <p className="font-semibold text-lg">{result.count}</p>
                </div>
                <div className="bg-background rounded-md p-3 border border-border">
                  <p className="text-xs font-medium text-secondary-text">Sum</p>
                  <p className="font-semibold text-lg">{result.sum}</p>
                </div>
                <div className="bg-background rounded-md p-3 border border-border">
                  <p className="text-xs font-medium text-secondary-text">Minimum</p>
                  <p className="font-semibold text-lg">{result.min}</p>
                </div>
                <div className="bg-background rounded-md p-3 border border-border">
                  <p className="text-xs font-medium text-secondary-text">Maximum</p>
                  <p className="font-semibold text-lg">{result.max}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </CalculatorLayout>
  );
}
