"use client";

import { useState } from "react";
import { CalculatorLayout } from "@/components/calculator-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type CalculationMode = "whatIs" | "increaseDecrease" | "fraction" | "reverse";

export default function PercentageCalculator() {
  const [mode, setMode] = useState<CalculationMode>("whatIs");
  const [val1, setVal1] = useState("");
  const [val2, setVal2] = useState("");
  const [result, setResult] = useState<{
    value: number;
    explanation: string;
    subtext?: string;
  } | null>(null);

  const calculate = () => {
    const num1 = parseFloat(val1);
    const num2 = parseFloat(val2);

    if (isNaN(num1) || isNaN(num2)) {
      setResult(null);
      return;
    }

    if (mode === "whatIs") {
      const res = (num1 / 100) * num2;
      setResult({
        value: res,
        explanation: `${num1}% of ${num2} = ${Number.isInteger(res) ? res : res.toFixed(2)}`,
      });
    } else if (mode === "increaseDecrease") {
      if (num1 === 0) {
        setResult(null);
        return;
      }
      const diff = num2 - num1;
      const pctChange = (diff / Math.abs(num1)) * 100;
      const isIncrease = pctChange >= 0;
      setResult({
        value: pctChange,
        explanation: `${isIncrease ? "Increase" : "Decrease"} of ${Math.abs(pctChange).toFixed(2)}%`,
        subtext: `Absolute change: ${diff >= 0 ? "+" : ""}${diff.toFixed(2)} (from ${num1} to ${num2})`,
      });
    } else if (mode === "fraction") {
      if (num2 === 0) {
        setResult(null);
        return;
      }
      const pct = (num1 / num2) * 100;
      setResult({
        value: pct,
        explanation: `${num1} is ${pct.toFixed(2)}% of ${num2}`,
      });
    } else if (mode === "reverse") {
      if (num2 === 0) {
        setResult(null);
        return;
      }
      const original = num1 / (num2 / 100);
      setResult({
        value: original,
        explanation: `${num1} is ${num2}% of ${original.toFixed(2)}`,
        subtext: `Original value before ${num2}% was applied`,
      });
    }
  };

  const handleModeChange = (newMode: CalculationMode) => {
    setMode(newMode);
    setResult(null);
  };

  const reset = () => {
    setVal1("");
    setVal2("");
    setResult(null);
  };

  const howToSteps = [
    "Select your desired percentage calculation mode: 'X% of Y', '% Increase / Decrease', 'X is what % of Y', or 'Reverse %'.",
    "Enter your numeric values into the corresponding input fields.",
    "Click 'Calculate' to instantly see the computed percentage result and visual breakdown.",
    "Review the resulting answer or click 'Reset' to clear the inputs and run another calculation.",
  ];

  const faqs = [
    {
      question: "How do you calculate percentage increase or decrease?",
      answer: "To calculate percentage change: subtract the old value from the new value, divide that difference by the absolute value of the original number, and multiply by 100. Formula: Percentage Change = ((New Value - Old Value) / |Old Value|) × 100. A positive outcome indicates an increase, while a negative outcome indicates a decrease.",
    },
    {
      question: "What is a reverse percentage and when is it used?",
      answer: "A reverse percentage finds the original amount before a percentage was added or subtracted. For example, if a jacket on sale for $80 has already been discounted by 20%, the original price was: $80 / (1 - 0.20) = $100. If an invoice of $118 includes 18% tax, the pre-tax base price was: $118 / (1 + 0.18) = $100.",
    },
    {
      question: "How do you calculate what percentage one number is of another?",
      answer: "To find what percentage X is of Y, divide the part (X) by the total whole (Y) and multiply the result by 100: Percentage = (X / Y) × 100. For example, if you scored 45 marks out of 60 on an exam, (45 / 60) × 100 = 75%.",
    },
    {
      question: "Can percentage increase exceed 100%?",
      answer: "Yes. When a value doubles, that represents a 100% increase. If a value triples, it is a 200% increase. Unlike percentage shares of a fixed whole (which typically range between 0% and 100%), percentage increases can grow infinitely.",
    },
  ];

  const formulaExplanation = "Percentage Formulas:\n1. Basic Percentage: Value = (P / 100) × V (where P is the percentage and V is the total value).\n2. Percentage Change: Change (%) = ((V₂ - V₁) / |V₁|) × 100 (where V₁ is the initial value and V₂ is the final value).\n3. Percentage Share: Share (%) = (Part / Whole) × 100.\n4. Reverse Percentage (Tax / Markup): Original Value = Total / (1 + (Rate / 100)).\n5. Reverse Percentage (Discount): Original Value = Sale Price / (1 - (Discount / 100)).";

  return (
    <CalculatorLayout
      title="Percentage Calculator"
      description="Calculate percentages, percentage increases, decreases, and reverse percentages quickly and accurately."
      howToSteps={howToSteps}
      faqs={faqs}
      formulaExplanation={formulaExplanation}
    >
      <Card className="shadow-md">
        <CardContent className="p-6 md:p-8 space-y-6">
          {/* Mode Selector */}
          <div className="flex flex-wrap gap-2 justify-center pb-2 border-b border-border">
            <Button
              variant={mode === "whatIs" ? "default" : "outline"}
              size="sm"
              onClick={() => handleModeChange("whatIs")}
            >
              What is X% of Y?
            </Button>
            <Button
              variant={mode === "increaseDecrease" ? "default" : "outline"}
              size="sm"
              onClick={() => handleModeChange("increaseDecrease")}
            >
              % Increase / Decrease
            </Button>
            <Button
              variant={mode === "fraction" ? "default" : "outline"}
              size="sm"
              onClick={() => handleModeChange("fraction")}
            >
              X is what % of Y?
            </Button>
            <Button
              variant={mode === "reverse" ? "default" : "outline"}
              size="sm"
              onClick={() => handleModeChange("reverse")}
            >
              Reverse % (X is Y% of ?)
            </Button>
          </div>

          <div className="space-y-6">
            {mode === "whatIs" && (
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full sm:w-1/3 flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="25"
                    value={val1}
                    onChange={(e) => setVal1(e.target.value)}
                    aria-label="Percentage"
                  />
                  <span className="text-secondary-text font-medium">%</span>
                </div>
                <span className="text-secondary-text font-medium">of</span>
                <div className="w-full sm:w-1/3">
                  <Input
                    type="number"
                    placeholder="800"
                    value={val2}
                    onChange={(e) => setVal2(e.target.value)}
                    aria-label="Value"
                  />
                </div>
                <div className="w-full sm:w-auto">
                  <Button onClick={calculate} className="w-full">Calculate</Button>
                </div>
              </div>
            )}

            {mode === "increaseDecrease" && (
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full sm:w-1/3">
                  <label className="text-xs text-secondary-text block mb-1">Initial Value (From)</label>
                  <Input
                    type="number"
                    placeholder="50"
                    value={val1}
                    onChange={(e) => setVal1(e.target.value)}
                    aria-label="Initial Value"
                  />
                </div>
                <span className="text-secondary-text font-medium mt-5">to</span>
                <div className="w-full sm:w-1/3">
                  <label className="text-xs text-secondary-text block mb-1">Final Value (To)</label>
                  <Input
                    type="number"
                    placeholder="75"
                    value={val2}
                    onChange={(e) => setVal2(e.target.value)}
                    aria-label="Final Value"
                  />
                </div>
                <div className="w-full sm:w-auto mt-5">
                  <Button onClick={calculate} className="w-full">Calculate</Button>
                </div>
              </div>
            )}

            {mode === "fraction" && (
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full sm:w-1/3">
                  <label className="text-xs text-secondary-text block mb-1">Part (X)</label>
                  <Input
                    type="number"
                    placeholder="25"
                    value={val1}
                    onChange={(e) => setVal1(e.target.value)}
                    aria-label="Part X"
                  />
                </div>
                <span className="text-secondary-text font-medium mt-5">is what % of</span>
                <div className="w-full sm:w-1/3">
                  <label className="text-xs text-secondary-text block mb-1">Total (Y)</label>
                  <Input
                    type="number"
                    placeholder="100"
                    value={val2}
                    onChange={(e) => setVal2(e.target.value)}
                    aria-label="Total Y"
                  />
                </div>
                <div className="w-full sm:w-auto mt-5">
                  <Button onClick={calculate} className="w-full">Calculate</Button>
                </div>
              </div>
            )}

            {mode === "reverse" && (
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full sm:w-1/3">
                  <label className="text-xs text-secondary-text block mb-1">Final Value (X)</label>
                  <Input
                    type="number"
                    placeholder="80"
                    value={val1}
                    onChange={(e) => setVal1(e.target.value)}
                    aria-label="Final Value"
                  />
                </div>
                <span className="text-secondary-text font-medium mt-5">is</span>
                <div className="w-full sm:w-1/3 flex items-center gap-2">
                  <div className="w-full">
                    <label className="text-xs text-secondary-text block mb-1">Percentage (Y)</label>
                    <Input
                      type="number"
                      placeholder="20"
                      value={val2}
                      onChange={(e) => setVal2(e.target.value)}
                      aria-label="Percentage"
                    />
                  </div>
                  <span className="text-secondary-text font-medium mt-5">% of what?</span>
                </div>
                <div className="w-full sm:w-auto mt-5">
                  <Button onClick={calculate} className="w-full">Calculate</Button>
                </div>
              </div>
            )}

            {result !== null && (
              <div className="p-6 bg-muted/50 rounded-lg border border-border mt-8 text-center animate-in fade-in zoom-in-95 duration-200">
                <p className="text-xs font-semibold text-secondary-text uppercase tracking-wider mb-2">Answer</p>
                <div className="text-4xl md:text-5xl font-heading font-bold text-primary mb-2">
                  {Number.isInteger(result.value) ? result.value : result.value.toFixed(2)}
                  {mode === "increaseDecrease" || mode === "fraction" ? "%" : ""}
                </div>
                <p className="text-sm font-medium text-foreground">
                  {result.explanation}
                </p>
                {result.subtext && (
                  <p className="text-xs text-secondary-text mt-1">
                    {result.subtext}
                  </p>
                )}
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
