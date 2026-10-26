"use client";

import { useState } from "react";
import { CalculatorLayout } from "@/components/calculator-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function ExamPercentageCalculator() {
  const [totalMarks, setTotalMarks] = useState("");
  const [obtainedMarks, setObtainedMarks] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ percentage: number } | null>(null);

  const calculate = () => {
    setError(null);
    setResult(null);

    const total = parseFloat(totalMarks);
    const obtained = parseFloat(obtainedMarks);

    if (isNaN(total) || isNaN(obtained)) {
      setError("Please enter valid numbers.");
      return;
    }

    if (total <= 0) {
       setError("Total marks must be greater than zero.");
       return;
    }

    if (obtained < 0) {
       setError("Obtained marks cannot be negative.");
       return;
    }

    if (obtained > total) {
       setError("Obtained marks cannot exceed total marks.");
       return;
    }

    const percentage = (obtained / total) * 100;
    setResult({ percentage });
  };

  const reset = () => {
    setTotalMarks("");
    setObtainedMarks("");
    setResult(null);
    setError(null);
  };

  return (
    <CalculatorLayout
      title="Marks & Exam Percentage Calculator"
      description="Quickly convert your test scores and exam marks into a percentage."
    >
      <Card className="shadow-md">
        <CardContent className="p-6 md:p-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="obtained">Marks Obtained</Label>
                <Input
                  id="obtained"
                  type="number"
                  placeholder="e.g. 425"
                  value={obtainedMarks}
                  onChange={(e) => setObtainedMarks(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total">Total Maximum Marks</Label>
                <Input
                  id="total"
                  type="number"
                  placeholder="e.g. 500"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(e.target.value)}
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
                <p className="text-xs font-semibold text-secondary-text uppercase tracking-wider mb-2">Your Score</p>
                <div className="text-4xl md:text-5xl font-heading font-bold text-primary mb-2 flex justify-center items-baseline">
                  {result.percentage.toFixed(2)}%
                </div>
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
