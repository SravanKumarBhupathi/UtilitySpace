"use client";

import { useState } from "react";
import { CalculatorLayout } from "@/components/calculator-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, RotateCcw, AlertCircle } from "lucide-react";

interface SemesterRow {
  id: string;
  name: string;
  gpa: string;
  credits: string;
}

export default function CGPACalculator() {
  const [semesters, setSemesters] = useState<SemesterRow[]>([
    { id: "1", name: "Semester 1", gpa: "3.6", credits: "20" },
    { id: "2", name: "Semester 2", gpa: "3.8", credits: "22" },
    { id: "3", name: "Semester 3", gpa: "3.5", credits: "20" },
    { id: "4", name: "Semester 4", gpa: "3.7", credits: "21" },
  ]);
  const [result, setResult] = useState<{ cgpa: number; totalCredits: number; percentage10: number; percentage4: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addSemester = () => {
    setSemesters((prev) => [
      ...prev,
      { id: Date.now().toString(), name: `Semester ${prev.length + 1}`, gpa: "3.5", credits: "20" },
    ]);
  };

  const removeSemester = (id: string) => {
    if (semesters.length <= 1) {
      setError("You must have at least one semester.");
      return;
    }
    setSemesters((prev) => prev.filter((s) => s.id !== id));
  };

  const updateSemester = (id: string, field: keyof SemesterRow, value: string) => {
    setSemesters((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const calculate = () => {
    setError(null);
    let totalCredits = 0;
    let totalPoints = 0;

    for (const s of semesters) {
      const gpa = parseFloat(s.gpa);
      const cr = parseFloat(s.credits);

      if (isNaN(gpa) || gpa < 0 || gpa > 10) {
        setError(`Please enter a valid GPA (0 to 10) for ${s.name}.`);
        setResult(null);
        return;
      }

      if (isNaN(cr) || cr <= 0) {
        setError(`Please enter valid credit hours for ${s.name}.`);
        setResult(null);
        return;
      }

      totalCredits += cr;
      totalPoints += gpa * cr;
    }

    if (totalCredits === 0) {
      setError("Total credits cannot be zero.");
      setResult(null);
      return;
    }

    const cgpa = totalPoints / totalCredits;
    // Common conversion formulas:
    // Scale of 10: Percentage = CGPA * 9.5
    // Scale of 4: Percentage = (CGPA / 4) * 100
    const percentage10 = cgpa <= 10 ? Math.min(100, cgpa * 9.5) : 0;
    const percentage4 = cgpa <= 4 ? (cgpa / 4) * 100 : 0;

    setResult({ cgpa, totalCredits, percentage10, percentage4 });
  };

  const reset = () => {
    setSemesters([
      { id: "1", name: "Semester 1", gpa: "3.6", credits: "20" },
      { id: "2", name: "Semester 2", gpa: "3.8", credits: "22" },
      { id: "3", name: "Semester 3", gpa: "3.5", credits: "20" },
      { id: "4", name: "Semester 4", gpa: "3.7", credits: "21" },
    ]);
    setResult(null);
    setError(null);
  };

  const howToSteps = [
    "Enter each semester's SGPA (Semester Grade Point Average) or GPA.",
    "Enter the total credit hours registered or completed in that semester.",
    "Add more semesters using 'Add Semester' or adjust the existing entries.",
    "Click 'Calculate CGPA' to view your cumulative grade point average and equivalent percentage conversions.",
  ];

  const faqs = [
    {
      question: "How do you convert CGPA to percentage?",
      answer: "For a 10-point scale (common in CBSE and Indian universities), the standard formula is Percentage = CGPA x 9.5. For a 4.0 scale (common in US universities), the conversion is Percentage = (CGPA / 4.0) x 100.",
    },
    {
      question: "Why can't I just take the simple average of my semester GPAs?",
      answer: "If semesters have different total credit weights (e.g. 24 credits in Semester 2 vs. 18 credits in Semester 1), a semester with more credits has a proportionally higher impact on your cumulative academic standing. A weighted calculation is required.",
    },
    {
      question: "Is this calculator suitable for college and university grading systems?",
      answer: "Yes. Whether your university operates on a 4.0 or 10.0 scale, the weighted credit formula accurately computes your exact cumulative performance.",
    },
  ];

  const formulaExplanation = "CGPA = Sum(Semester GPA x Semester Credits) / Sum(Total Semester Credits).";

  return (
    <CalculatorLayout
      title="CGPA Calculator"
      description="Calculate your overall Cumulative Grade Point Average (CGPA) and convert your score to an estimated percentage."
      howToSteps={howToSteps}
      faqs={faqs}
      formulaExplanation={formulaExplanation}
    >
      <div className="space-y-6">
        <Card className="shadow-md">
          <CardContent className="p-6 space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-secondary-text">
                    <th className="pb-3 font-semibold">Semester / Term</th>
                    <th className="pb-3 font-semibold w-36">GPA / SGPA</th>
                    <th className="pb-3 font-semibold w-36">Total Credits</th>
                    <th className="pb-3 font-semibold w-12 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {semesters.map((sem) => (
                    <tr key={sem.id}>
                      <td className="py-3 pr-4">
                        <Input
                          value={sem.name}
                          onChange={(e) => updateSemester(sem.id, "name", e.target.value)}
                          placeholder="e.g. Semester 1"
                          className="h-9"
                        />
                      </td>
                      <td className="py-3 pr-4">
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          max="10"
                          value={sem.gpa}
                          onChange={(e) => updateSemester(sem.id, "gpa", e.target.value)}
                          placeholder="e.g. 3.75"
                          className="h-9"
                        />
                      </td>
                      <td className="py-3 pr-4">
                        <Input
                          type="number"
                          step="1"
                          min="1"
                          value={sem.credits}
                          onChange={(e) => updateSemester(sem.id, "credits", e.target.value)}
                          placeholder="e.g. 20"
                          className="h-9"
                        />
                      </td>
                      <td className="py-3 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSemester(sem.id)}
                          className="h-8 w-8 text-secondary-text hover:text-red-500"
                          title="Remove semester"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-500 font-medium">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border">
              <Button type="button" variant="outline" size="sm" onClick={addSemester} className="gap-1.5">
                <Plus className="w-4 h-4" /> Add Semester
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={reset} className="gap-1.5">
                  <RotateCcw className="w-4 h-4" /> Reset
                </Button>
                <Button type="button" onClick={calculate} className="px-6">
                  Calculate CGPA
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card className="border-primary/30 bg-primary/5 shadow-md">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="p-4 bg-card rounded-xl border border-border">
                  <span className="text-xs uppercase tracking-wider text-secondary-text font-bold">Your CGPA</span>
                  <p className="text-4xl font-extrabold text-primary mt-1">{result.cgpa.toFixed(2)}</p>
                  <span className="text-xs text-secondary-text mt-1 block">Cumulative Average</span>
                </div>
                <div className="p-4 bg-card rounded-xl border border-border">
                  <span className="text-xs uppercase tracking-wider text-secondary-text font-bold">Total Credits</span>
                  <p className="text-3xl font-bold text-foreground mt-1">{result.totalCredits}</p>
                  <span className="text-xs text-secondary-text mt-1 block">Accumulated Credits</span>
                </div>
                <div className="p-4 bg-card rounded-xl border border-border">
                  <span className="text-xs uppercase tracking-wider text-secondary-text font-bold">Approx. Percentage</span>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {result.cgpa <= 4 ? `${result.percentage4.toFixed(1)}%` : `${result.percentage10.toFixed(1)}%`}
                  </p>
                  <span className="text-xs text-secondary-text mt-1 block">
                    {result.cgpa <= 4 ? "4.0 Scale Formula" : "9.5 Multiplier Formula"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </CalculatorLayout>
  );
}
