"use client";

import { useState } from "react";
import { CalculatorLayout } from "../layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [targetDate, setTargetDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<{ years: number; months: number; days: number } | null>(null);

  const calculate = () => {
    if (!dob) return;

    const d1 = new Date(dob);
    const d2 = new Date(targetDate);

    if (d1 > d2) {
      alert("Date of birth must be before target date");
      return;
    }

    let years = d2.getFullYear() - d1.getFullYear();
    let months = d2.getMonth() - d1.getMonth();
    let days = d2.getDate() - d1.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(d2.getFullYear(), d2.getMonth(), 0).getDate();
      days += prevMonth;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    setResult({ years, months, days });
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
