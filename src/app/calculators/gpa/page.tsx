"use client";

import { useState } from "react";
import { CalculatorLayout } from "@/components/calculator-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, RotateCcw, AlertCircle } from "lucide-react";

interface CourseRow {
  id: string;
  name: string;
  gradePoint: string;
  credits: string;
}

const GRADE_OPTIONS = [
  { label: "A+ (4.0)", value: "4.0" },
  { label: "A  (4.0)", value: "4.0" },
  { label: "A- (3.7)", value: "3.7" },
  { label: "B+ (3.3)", value: "3.3" },
  { label: "B  (3.0)", value: "3.0" },
  { label: "B- (2.7)", value: "2.7" },
  { label: "C+ (2.3)", value: "2.3" },
  { label: "C  (2.0)", value: "2.0" },
  { label: "C- (1.7)", value: "1.7" },
  { label: "D  (1.0)", value: "1.0" },
  { label: "F  (0.0)", value: "0.0" },
];

export default function GPACalculator() {
  const [courses, setCourses] = useState<CourseRow[]>([
    { id: "1", name: "Course 1", gradePoint: "4.0", credits: "3" },
    { id: "2", name: "Course 2", gradePoint: "3.7", credits: "4" },
    { id: "3", name: "Course 3", gradePoint: "3.3", credits: "3" },
    { id: "4", name: "Course 4", gradePoint: "3.0", credits: "3" },
  ]);
  const [result, setResult] = useState<{ gpa: number; totalCredits: number; totalPoints: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addCourse = () => {
    setCourses((prev) => [
      ...prev,
      { id: Date.now().toString(), name: `Course ${prev.length + 1}`, gradePoint: "4.0", credits: "3" },
    ]);
  };

  const removeCourse = (id: string) => {
    if (courses.length <= 1) {
      setError("You must have at least one course.");
      return;
    }
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const updateCourse = (id: string, field: keyof CourseRow, value: string) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const calculate = () => {
    setError(null);
    let totalCredits = 0;
    let totalPoints = 0;

    for (const c of courses) {
      const cr = parseFloat(c.credits);
      const gp = parseFloat(c.gradePoint);

      if (isNaN(cr) || cr <= 0) {
        setError(`Please enter a valid positive credit value for ${c.name || "all courses"}.`);
        setResult(null);
        return;
      }
      if (isNaN(gp) || gp < 0) {
        setError(`Please select or enter a valid grade point for ${c.name || "all courses"}.`);
        setResult(null);
        return;
      }

      totalCredits += cr;
      totalPoints += cr * gp;
    }

    if (totalCredits === 0) {
      setError("Total credits cannot be zero.");
      setResult(null);
      return;
    }

    const gpa = totalPoints / totalCredits;
    setResult({ gpa, totalCredits, totalPoints });
  };

  const reset = () => {
    setCourses([
      { id: "1", name: "Course 1", gradePoint: "4.0", credits: "3" },
      { id: "2", name: "Course 2", gradePoint: "3.7", credits: "4" },
      { id: "3", name: "Course 3", gradePoint: "3.3", credits: "3" },
      { id: "4", name: "Course 4", gradePoint: "3.0", credits: "3" },
    ]);
    setResult(null);
    setError(null);
  };

  const howToSteps = [
    "Enter your course names or subject titles.",
    "Select your letter grade (A+, A, B+, B, etc.) or corresponding grade points (4.0 scale).",
    "Enter the number of credit hours assigned to each course.",
    "Add more courses using 'Add Course' if needed, or remove unneeded subjects.",
    "Click 'Calculate GPA' to determine your weighted semester Grade Point Average.",
  ];

  const faqs = [
    {
      question: "How is a weighted GPA calculated?",
      answer: "Each course's grade points are multiplied by its credit hours to determine Quality Points. Total quality points are then divided by the total credit hours taken.",
    },
    {
      question: "What is the standard 4.0 GPA grade point scale?",
      answer: "Standard US college scale: A = 4.0, A- = 3.7, B+ = 3.3, B = 3.0, B- = 2.7, C+ = 2.3, C = 2.0, C- = 1.7, D = 1.0, and F = 0.0.",
    },
    {
      question: "What is the difference between GPA and CGPA?",
      answer: "GPA measures performance across a single academic term or semester. CGPA (Cumulative Grade Point Average) measures your overall cumulative academic standing across all semesters combined.",
    },
  ];

  const formulaExplanation = "Semester GPA = Sum(Course Grade Points x Course Credit Hours) / Sum(Course Credit Hours).";

  return (
    <CalculatorLayout
      title="GPA Calculator"
      description="Calculate your semester Grade Point Average (GPA) using your course grades and credit hours."
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
                    <th className="pb-3 font-semibold">Course / Subject</th>
                    <th className="pb-3 font-semibold w-40">Grade</th>
                    <th className="pb-3 font-semibold w-28">Credits</th>
                    <th className="pb-3 font-semibold w-12 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {courses.map((course) => (
                    <tr key={course.id} className="group">
                      <td className="py-3 pr-4">
                        <Input
                          value={course.name}
                          onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                          placeholder="e.g. Mathematics"
                          className="h-9"
                        />
                      </td>
                      <td className="py-3 pr-4">
                        <select
                          value={course.gradePoint}
                          onChange={(e) => updateCourse(course.id, "gradePoint", e.target.value)}
                          className="h-9 w-full rounded-md border border-border bg-card px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          {GRADE_OPTIONS.map((g) => (
                            <option key={g.label} value={g.value}>
                              {g.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 pr-4">
                        <Input
                          type="number"
                          min="0.5"
                          step="0.5"
                          value={course.credits}
                          onChange={(e) => updateCourse(course.id, "credits", e.target.value)}
                          placeholder="3"
                          className="h-9"
                        />
                      </td>
                      <td className="py-3 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCourse(course.id)}
                          className="h-8 w-8 text-secondary-text hover:text-red-500"
                          title="Remove course"
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
              <Button type="button" variant="outline" size="sm" onClick={addCourse} className="gap-1.5">
                <Plus className="w-4 h-4" /> Add Course
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={reset} className="gap-1.5">
                  <RotateCcw className="w-4 h-4" /> Reset
                </Button>
                <Button type="button" onClick={calculate} className="px-6">
                  Calculate GPA
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
                  <span className="text-xs uppercase tracking-wider text-secondary-text font-bold">Your GPA</span>
                  <p className="text-4xl font-extrabold text-primary mt-1">{result.gpa.toFixed(2)}</p>
                  <span className="text-xs text-secondary-text mt-1 block">out of 4.00</span>
                </div>
                <div className="p-4 bg-card rounded-xl border border-border">
                  <span className="text-xs uppercase tracking-wider text-secondary-text font-bold">Total Credits</span>
                  <p className="text-3xl font-bold text-foreground mt-1">{result.totalCredits}</p>
                  <span className="text-xs text-secondary-text mt-1 block">Credit Hours</span>
                </div>
                <div className="p-4 bg-card rounded-xl border border-border">
                  <span className="text-xs uppercase tracking-wider text-secondary-text font-bold">Total Grade Points</span>
                  <p className="text-3xl font-bold text-foreground mt-1">{result.totalPoints.toFixed(2)}</p>
                  <span className="text-xs text-secondary-text mt-1 block">Quality Points</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </CalculatorLayout>
  );
}
