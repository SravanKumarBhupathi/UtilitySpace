"use client";

import { useState } from "react";
import { CalculatorLayout } from "@/components/calculator-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [targetDate, setTargetDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ years: number; months: number; days: number } | null>(null);

const calculate = () => {
    setError(null);
    if (!dob) {
      setError("Please select a date of birth.");
      return;
    }

    const [y1, m1, day1] = dob.split('-').map(Number);
    const d1 = new Date(y1, m1 - 1, day1);
    const [y2, m2, day2] = targetDate.split('-').map(Number);
    const d2 = new Date(y2, m2 - 1, day2);

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      setError("Please enter valid dates.");
      return;
    }

    if (d1 > d2) {
      setError("Date of birth cannot be after the target date.");
      setResult(null);
      return;
    }

let years = d2.getFullYear() - d1.getFullYear();
    let months = d2.getMonth() - d1.getMonth();
    let days = d2.getDate() - d1.getDate();

    if (days < 0) {
      months -= 1;
      // Get the number of days in the previous month of the end date
      let prevMonth = d2.getMonth() - 1;
      let yearOfPrevMonth = d2.getFullYear();
      if (prevMonth < 0) {
        prevMonth = 11;
        yearOfPrevMonth -= 1;
      }
      const daysInPrevMonth = new Date(yearOfPrevMonth, prevMonth + 1, 0).getDate();
      days += daysInPrevMonth;
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
    setError(null);
  };

  const howToSteps = [
    "Select your Date of Birth using the calendar date picker.",
    "The 'Age At Date' defaults to today, but you can select any past or future reference date (useful for exam eligibility deadlines).",
    "Click 'Calculate Age' to see your precise chronological age in exact years, months, and days.",
  ];

  const faqs = [
    {
      question: "How does this calculator account for leap years and varying month lengths?",
      answer: "Our algorithm accurately handles Gregorian leap years (February 29) and dynamically determines the exact number of calendar days in each preceding month, preventing common timezone-shift errors.",
    },
    {
      question: "Can I calculate my age on an upcoming exam cut-off date?",
      answer: "Yes. Simply change the 'Age At Date' to the examination eligibility deadline (e.g., January 1 or August 1 of the testing year) to verify whether you fall within the mandatory age window.",
    },
    {
      question: "Is my birthdate saved anywhere?",
      answer: "No. Calculations execute strictly inside your local browser. Your personal dates and identity information are never logged or transmitted.",
    },
  ];

  const formulaExplanation = "Chronological age is calculated by decomposing both the birthdate and target date into local year, month, and day components, sequentially subtracting days (borrowing previous month length when needed) and months (borrowing 12 months from years when needed).";

  return (
    <CalculatorLayout
      title="Age Calculator"
      description="Calculate exact age in years, months, and days."
      howToSteps={howToSteps}
      faqs={faqs}
      formulaExplanation={formulaExplanation}
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

            {error && (
              <div className="flex items-center text-sm font-medium text-red-500 bg-red-500/10 p-3 rounded-md border border-red-500/20">
                 <AlertCircle className="w-4 h-4 mr-2" /> {error}
              </div>
            )}

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
