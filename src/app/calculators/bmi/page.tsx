"use client";

import { useState } from "react";
import { CalculatorLayout } from "@/components/calculator-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RotateCcw, AlertCircle, Heart } from "lucide-react";

export default function BMICalculator() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");

  // Metric fields
  const [heightCm, setHeightCm] = useState("175");
  const [weightKg, setWeightKg] = useState("70");

  // Imperial fields
  const [heightFt, setHeightFt] = useState("5");
  const [heightIn, setHeightIn] = useState("9");
  const [weightLbs, setWeightLbs] = useState("154");

  const [result, setResult] = useState<{
    bmi: number;
    category: string;
    categoryColor: string;
    healthyWeightRange: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = () => {
    setError(null);
    let hM = 0;
    let wKg = 0;

    if (unit === "metric") {
      const h = parseFloat(heightCm);
      const w = parseFloat(weightKg);
      if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
        setError("Please enter valid positive height and weight values.");
        setResult(null);
        return;
      }
      hM = h / 100;
      wKg = w;
    } else {
      const ft = parseFloat(heightFt);
      const inch = parseFloat(heightIn) || 0;
      const lbs = parseFloat(weightLbs);
      if (isNaN(ft) || isNaN(lbs) || ft < 0 || lbs <= 0) {
        setError("Please enter valid positive feet, inches, and weight values.");
        setResult(null);
        return;
      }
      const totalInches = ft * 12 + inch;
      if (totalInches <= 0) {
        setError("Height must be greater than zero.");
        setResult(null);
        return;
      }
      hM = totalInches * 0.0254;
      wKg = lbs * 0.45359237;
    }

    const bmi = wKg / (hM * hM);
    let category = "";
    let categoryColor = "";

    if (bmi < 18.5) {
      category = "Underweight";
      categoryColor = "text-amber-500 bg-amber-500/10 border-amber-500/20";
    } else if (bmi < 25) {
      category = "Normal weight";
      categoryColor = "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    } else if (bmi < 30) {
      category = "Overweight";
      categoryColor = "text-orange-500 bg-orange-500/10 border-orange-500/20";
    } else {
      category = "Obesity";
      categoryColor = "text-rose-500 bg-rose-500/10 border-rose-500/20";
    }

    // Healthy weight range for this height (BMI 18.5 - 24.9)
    const minWKg = 18.5 * (hM * hM);
    const maxWKg = 24.9 * (hM * hM);
    let healthyWeightRange = "";

    if (unit === "metric") {
      healthyWeightRange = `${minWKg.toFixed(1)} kg — ${maxWKg.toFixed(1)} kg`;
    } else {
      const minLbs = minWKg * 2.20462;
      const maxLbs = maxWKg * 2.20462;
      healthyWeightRange = `${minLbs.toFixed(1)} lbs — ${maxLbs.toFixed(1)} lbs`;
    }

    setResult({ bmi, category, categoryColor, healthyWeightRange });
  };

  const reset = () => {
    setHeightCm("");
    setWeightKg("");
    setHeightFt("");
    setHeightIn("");
    setWeightLbs("");
    setResult(null);
    setError(null);
  };

  const howToSteps = [
    "Select your preferred measurement units: Metric (centimeters & kilograms) or Imperial (feet, inches & pounds).",
    "Enter your accurate height and current body weight.",
    "Click 'Calculate BMI' to see your score, your official WHO weight category, and your personalized healthy weight target range.",
  ];

  const faqs = [
    {
      question: "What is a healthy BMI according to the World Health Organization?",
      answer: "For adults, the WHO categorizes a BMI between 18.5 and 24.9 as Normal / Healthy weight. Less than 18.5 is considered Underweight, 25.0 to 29.9 is Overweight, and 30.0 or higher is classified as Obese.",
    },
    {
      question: "Does BMI distinguish between muscle mass and body fat?",
      answer: "No. BMI is a screening ratio of total body mass to height. It does not measure body composition directly. Athletes and bodybuilders with high muscle density may score in the 'overweight' range despite having low body fat.",
    },
    {
      question: "Is this calculator suitable for children and teenagers?",
      answer: "This calculator uses adult WHO criteria. For children and adolescents aged 2 to 19, pediatricians use BMI-for-age percentiles because body composition changes rapidly as youth grow.",
    },
  ];

  const formulaExplanation = "Metric Formula: BMI = weight (kg) / [height (m)]². Imperial Formula: BMI = 703 x weight (lbs) / [height (in)]².";

  return (
    <CalculatorLayout
      title="BMI Calculator"
      description="Calculate your Body Mass Index (BMI) and discover your healthy weight range based on World Health Organization (WHO) standards."
      howToSteps={howToSteps}
      faqs={faqs}
      formulaExplanation={formulaExplanation}
    >
      <div className="space-y-6">
        <Card className="shadow-md">
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="flex justify-center">
              <div className="inline-flex rounded-lg border border-border p-1 bg-muted/50">
                <button
                  type="button"
                  onClick={() => { setUnit("metric"); setResult(null); }}
                  className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                    unit === "metric" ? "bg-background text-foreground shadow-sm" : "text-secondary-text hover:text-foreground"
                  }`}
                >
                  Metric Units (cm, kg)
                </button>
                <button
                  type="button"
                  onClick={() => { setUnit("imperial"); setResult(null); }}
                  className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                    unit === "imperial" ? "bg-background text-foreground shadow-sm" : "text-secondary-text hover:text-foreground"
                  }`}
                >
                  Imperial Units (ft, in, lbs)
                </button>
              </div>
            </div>

            {unit === "metric" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="heightCm">Height (cm)</Label>
                  <Input
                    id="heightCm"
                    type="number"
                    min="30"
                    max="280"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    placeholder="e.g. 175"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weightKg">Weight (kg)</Label>
                  <Input
                    id="weightKg"
                    type="number"
                    min="1"
                    max="400"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    placeholder="e.g. 70"
                    className="h-11"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="heightFt">Height (Feet)</Label>
                    <Input
                      id="heightFt"
                      type="number"
                      min="1"
                      max="8"
                      value={heightFt}
                      onChange={(e) => setHeightFt(e.target.value)}
                      placeholder="e.g. 5"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heightIn">Height (Inches)</Label>
                    <Input
                      id="heightIn"
                      type="number"
                      min="0"
                      max="11"
                      value={heightIn}
                      onChange={(e) => setHeightIn(e.target.value)}
                      placeholder="e.g. 9"
                      className="h-11"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weightLbs">Weight (Pounds / lbs)</Label>
                  <Input
                    id="weightLbs"
                    type="number"
                    min="1"
                    max="800"
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(e.target.value)}
                    placeholder="e.g. 154"
                    className="h-11"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-500 font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex gap-3 pt-2 border-t border-border">
              <Button type="button" onClick={calculate} className="flex-1 h-11 text-base font-semibold">
                Calculate BMI
              </Button>
              <Button type="button" variant="outline" onClick={reset} className="gap-1.5 h-11">
                <RotateCcw className="w-4 h-4" /> Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card className="border-primary/30 bg-primary/5 shadow-md animate-in fade-in">
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="p-4 bg-card rounded-xl border border-border flex flex-col justify-center">
                  <span className="text-xs uppercase tracking-wider text-secondary-text font-bold">Your BMI</span>
                  <p className="text-5xl font-extrabold text-primary mt-1">{result.bmi.toFixed(1)}</p>
                  <span className="text-xs text-secondary-text mt-1">kg/m²</span>
                </div>
                <div className="p-4 bg-card rounded-xl border border-border flex flex-col justify-center">
                  <span className="text-xs uppercase tracking-wider text-secondary-text font-bold">Category</span>
                  <div className="mt-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold border ${result.categoryColor}`}>
                      {result.category}
                    </span>
                  </div>
                  <span className="text-xs text-secondary-text mt-2">WHO Standard</span>
                </div>
                <div className="p-4 bg-card rounded-xl border border-border flex flex-col justify-center">
                  <span className="text-xs uppercase tracking-wider text-secondary-text font-bold">Healthy Weight Range</span>
                  <p className="text-xl font-bold text-foreground mt-2">{result.healthyWeightRange}</p>
                  <span className="text-xs text-secondary-text mt-1">For your height</span>
                </div>
              </div>

              {/* WHO Range Bar */}
              <div className="bg-card p-4 rounded-xl border border-border space-y-2">
                <div className="flex justify-between text-xs font-semibold text-secondary-text">
                  <span>Underweight (&lt; 18.5)</span>
                  <span>Normal (18.5–24.9)</span>
                  <span>Overweight (25–29.9)</span>
                  <span>Obese (30+)</span>
                </div>
                <div className="h-3 w-full rounded-full bg-muted flex overflow-hidden">
                  <div className="bg-amber-400 h-full w-[25%]" title="Underweight" />
                  <div className="bg-emerald-500 h-full w-[25%]" title="Normal" />
                  <div className="bg-orange-400 h-full w-[25%]" title="Overweight" />
                  <div className="bg-rose-500 h-full w-[25%]" title="Obese" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </CalculatorLayout>
  );
}
