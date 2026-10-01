"use client";

import { useState } from "react";
import { CalculatorLayout } from "@/components/calculator-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { calculateAge, AgeResult } from "@/lib/age-calculator";

export default function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [targetDate, setTargetDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<AgeResult | null>(null);

  const calculate = () => {
    if (!dob) return;

    try {
      const age = calculateAge(dob, targetDate);
      setResult(age);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const reset = () => {
    setDob("");
    setTargetDate(new Date().toISOString().split('T')[0]);
    setResult(null);
  };

  return (
    <CalculatorLayout
      title="Age Calculator"
      description="Calculate exact age in years, months, and days."
    >
      <Card className="shadow-md">
        <CardContent className="p-6 md:p-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target">Age at the Date of</Label>
                <Input
                  id="target"
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={calculate} className="w-full md:w-auto">Calculate Age</Button>

            {result && (
              <div className="p-6 bg-muted/50 rounded-lg border border-border mt-8 text-center animate-in fade-in zoom-in-95 duration-200">
                <p className="text-xs font-semibold text-secondary-text uppercase tracking-wider mb-2">Age</p>
                <div className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4 flex justify-center gap-4">
                  <div className="flex flex-col items-center">
                    <span>{result.years}</span>
                    <span className="text-sm font-normal text-secondary-text">years</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span>{result.months}</span>
                    <span className="text-sm font-normal text-secondary-text">months</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span>{result.days}</span>
                    <span className="text-sm font-normal text-secondary-text">days</span>
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
