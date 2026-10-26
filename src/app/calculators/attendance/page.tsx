"use client";

import { useState } from "react";
import { CalculatorLayout } from "@/components/calculator-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function AttendanceCalculator() {
  const [totalClasses, setTotalClasses] = useState("");
  const [attendedClasses, setAttendedClasses] = useState("");
  const [targetPercentage, setTargetPercentage] = useState("75");
  const [error, setError] = useState<string | null>(null);

  const [result, setResult] = useState<{
    currentPercent: number;
    classesNeeded: number;
    classesCanMiss: number;
    target: number;
  } | null>(null);

  const calculate = () => {
    setError(null);
    setResult(null);

    const total = parseInt(totalClasses, 10);
    const attended = parseInt(attendedClasses, 10);
    const target = parseFloat(targetPercentage);

    if (isNaN(total) || isNaN(attended) || isNaN(target)) {
      setError("Please enter valid numbers in all fields.");
      return;
    }

    if (total <= 0) {
       setError("Total classes must be greater than zero.");
       return;
    }

    if (attended < 0) {
       setError("Attended classes cannot be negative.");
       return;
    }

    if (attended > total) {
       setError("Attended classes cannot be greater than total classes.");
       return;
    }

    if (target < 0 || target > 100) {
       setError("Target percentage must be between 0 and 100.");
       return;
    }

    const currentPercent = (attended / total) * 100;
    let classesNeeded = 0;
    let classesCanMiss = 0;

    if (currentPercent < target) {
       // Need to attend more
       // Formula: (attended + x) / (total + x) = target / 100
       // 100*attended + 100*x = target*total + target*x
       // x*(100 - target) = target*total - 100*attended
       // x = (target*total - 100*attended) / (100 - target)
       if (target === 100) {
          classesNeeded = Infinity;
       } else {
          classesNeeded = Math.ceil((target * total - 100 * attended) / (100 - target));
       }
    } else {
       // Can miss some classes
       // Formula: attended / (total + y) = target / 100
       // 100*attended = target*total + target*y
       // y = (100*attended - target*total) / target
       if (target === 0) {
          classesCanMiss = Infinity;
       } else {
          classesCanMiss = Math.floor((100 * attended - target * total) / target);
       }
    }

    setResult({ currentPercent, classesNeeded, classesCanMiss, target });
  };

  const reset = () => {
    setTotalClasses("");
    setAttendedClasses("");
    setTargetPercentage("75");
    setResult(null);
    setError(null);
  };

  return (
    <CalculatorLayout
      title="Attendance Calculator"
      description="Calculate your current attendance percentage and see how many classes you need to attend or can skip to maintain your target."
    >
      <Card className="shadow-md">
        <CardContent className="p-6 md:p-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="total">Total Classes Conducted</Label>
                <Input
                  id="total"
                  type="number"
                  placeholder="e.g. 50"
                  value={totalClasses}
                  onChange={(e) => setTotalClasses(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="attended">Classes Attended</Label>
                <Input
                  id="attended"
                  type="number"
                  placeholder="e.g. 35"
                  value={attendedClasses}
                  onChange={(e) => setAttendedClasses(e.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="target">Target Percentage (%)</Label>
                <Input
                  id="target"
                  type="number"
                  placeholder="75"
                  value={targetPercentage}
                  onChange={(e) => setTargetPercentage(e.target.value)}
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
                <p className="text-xs font-semibold text-secondary-text uppercase tracking-wider mb-2">Current Attendance</p>
                <div className={`text-4xl md:text-5xl font-heading font-bold mb-4 ${result.currentPercent >= result.target ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                  {result.currentPercent.toFixed(2)}%
                </div>

                <div className="mt-6 p-4 bg-background rounded-md border border-border">
                   {result.currentPercent < result.target ? (
                      result.classesNeeded === Infinity ? (
                         <p className="text-sm">You can never reach 100% since you have already missed classes.</p>
                      ) : (
                         <p className="text-sm">
                           You need to attend <strong>{result.classesNeeded}</strong> more classes consecutively to reach your {result.target}% target.
                         </p>
                      )
                   ) : (
                      result.classesCanMiss === Infinity ? (
                         <p className="text-sm">Your target is 0%, you don&apos;t need to attend any classes.</p>
                      ) : (
                         <p className="text-sm">
                           You can afford to miss <strong>{result.classesCanMiss}</strong> consecutive classes and still remain above {result.target}%.
                         </p>
                      )
                   )}
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
