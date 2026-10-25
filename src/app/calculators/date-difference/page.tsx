"use client";

import { useState } from "react";
import { CalculatorLayout } from "@/components/calculator-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function DateDifferenceCalculator() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ years: number; months: number; days: number, totalDays: number } | null>(null);

  const calculate = () => {
    setError(null);
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    const d1 = new Date(startDate);
    const d2 = new Date(endDate);

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      setError("Please enter valid dates.");
      return;
    }

    if (d1 > d2) {
      setError("Start date cannot be after the end date.");
      setResult(null);
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

    const totalTime = Math.abs(d2.getTime() - d1.getTime());
    const totalDays = Math.ceil(totalTime / (1000 * 60 * 60 * 24));

    setResult({ years, months, days, totalDays });
  };

  const reset = () => {
    setStartDate("");
    setEndDate("");
    setResult(null);
    setError(null);
  };

  return (
    <CalculatorLayout
      title="Date Difference Calculator"
      description="Calculate the exact duration between two dates in years, months, and days."
    >
      <Card className="shadow-md">
        <CardContent className="p-6 md:p-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => { setStartDate(e.target.value); setError(null); }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => { setEndDate(e.target.value); setError(null); }}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center text-sm font-medium text-red-500 bg-red-500/10 p-3 rounded-md border border-red-500/20">
                 <AlertCircle className="w-4 h-4 mr-2 shrink-0" /> {error}
              </div>
            )}

            <Button onClick={calculate} className="w-full md:w-auto">Calculate Difference</Button>

            {result && (
              <div className="p-6 bg-muted/50 rounded-lg border border-border mt-8 text-center animate-in fade-in zoom-in-95 duration-200">
                <p className="text-xs font-semibold text-secondary-text uppercase tracking-wider mb-2">Duration</p>
                <div className="text-3xl md:text-4xl font-heading font-bold text-primary mb-2 flex justify-center gap-4">
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

                <div className="mt-4 pt-4 border-t border-border flex justify-center items-center gap-6 text-sm">
                   <div className="flex flex-col">
                      <span className="font-semibold">{result.totalDays.toLocaleString()}</span>
                      <span className="text-xs text-secondary-text">Total Days</span>
                   </div>
                </div>

                <div className="mt-6 flex justify-center gap-4">
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
