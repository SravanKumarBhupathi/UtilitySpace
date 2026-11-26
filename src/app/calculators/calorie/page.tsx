"use client";

import { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/calculator-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Flame, RotateCcw } from "lucide-react";

type ActivityLevel = "1.2" | "1.375" | "1.55" | "1.725" | "1.9";
type MacroPreset = "balanced" | "high-protein" | "low-carb";

export default function CalorieCalculatorPage() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState("28");
  const [weightKg, setWeightKg] = useState("72");
  const [heightCm, setHeightCm] = useState("175");

  const [weightLbs, setWeightLbs] = useState("158");
  const [heightFt, setHeightFt] = useState("5");
  const [heightIn, setHeightIn] = useState("9");

  const [activity, setActivity] = useState<ActivityLevel>("1.55");
  const [macroPreset, setMacroPreset] = useState<MacroPreset>("balanced");

  const calc = useMemo(() => {
    const a = Math.max(10, Math.min(110, parseFloat(age) || 25));
    let wKg = 70;
    let hCm = 175;

    if (unit === "metric") {
      wKg = Math.max(20, parseFloat(weightKg) || 70);
      hCm = Math.max(80, parseFloat(heightCm) || 175);
    } else {
      wKg = Math.max(20, (parseFloat(weightLbs) || 154) * 0.45359237);
      const totalIn = (parseFloat(heightFt) || 5) * 12 + (parseFloat(heightIn) || 0);
      hCm = Math.max(80, totalIn * 2.54);
    }

    // Mifflin-St Jeor Equation
    const baseBmr = 10 * wKg + 6.25 * hCm - 5 * a;
    const bmr = Math.round(gender === "male" ? baseBmr + 5 : baseBmr - 161);
    const tdee = Math.round(bmr * parseFloat(activity));

    const ratios =
      macroPreset === "high-protein"
        ? { p: 0.35, c: 0.4, f: 0.25 }
        : macroPreset === "low-carb"
        ? { p: 0.3, c: 0.2, f: 0.5 }
        : { p: 0.3, c: 0.4, f: 0.3 };

    const macros = {
      proteinG: Math.round((tdee * ratios.p) / 4),
      carbsG: Math.round((tdee * ratios.c) / 4),
      fatsG: Math.round((tdee * ratios.f) / 9),
    };

    return {
      bmr,
      tdee,
      mildLoss: Math.max(1200, tdee - 250),
      weightLoss: Math.max(1200, tdee - 500),
      mildGain: tdee + 250,
      muscleGain: tdee + 500,
      macros,
    };
  }, [unit, gender, age, weightKg, heightCm, weightLbs, heightFt, heightIn, activity, macroPreset]);

  const handleReset = () => {
    setAge("28");
    setWeightKg("72");
    setHeightCm("175");
    setWeightLbs("158");
    setHeightFt("5");
    setHeightIn("9");
    setActivity("1.55");
    setMacroPreset("balanced");
  };

  const howToSteps = [
    "Choose Metric (kg/cm) or Imperial (lbs/ft/in) units and select your biological sex and age.",
    "Enter your current weight and height.",
    "Select the daily physical activity level that best matches your weekly exercise routine.",
    "Review your Basal Metabolic Rate (BMR), Maintenance TDEE, weight goals, and daily macro targets.",
  ];

  const faqs = [
    {
      question: "What is the difference between BMR and TDEE?",
      answer:
        "BMR (Basal Metabolic Rate) is the minimum number of calories your body burns at complete rest just to sustain vital organs, breathing, and circulation. TDEE (Total Daily Energy Expenditure) multiplies your BMR by an activity factor to estimate total calories burned daily including movement and workouts.",
    },
    {
      question: "How accurate is the Mifflin-St Jeor equation?",
      answer:
        "The Mifflin-St Jeor formula is clinically recognized by dietitians and sports nutritionists as the most accurate predictive equation for estimating resting metabolic rate in healthy adults.",
    },
    {
      question: "How large a calorie deficit is safe for sustainable fat loss?",
      answer:
        "A moderate daily deficit of 250 to 500 calories below your maintenance TDEE typically yields 0.25 kg to 0.5 kg (0.5 to 1 lb) of sustainable weekly fat loss while preserving lean muscle mass.",
    },
  ];

  return (
    <CalculatorLayout
      title="Calorie, BMR & TDEE Calculator"
      description="Calculate your Basal Metabolic Rate (BMR), Total Daily Energy Expenditure (TDEE), personalized fat loss or muscle gain calorie goals, and daily macronutrients."
      howToSteps={howToSteps}
      formulaExplanation="Mifflin-St Jeor BMR: (10 × weight in kg) + (6.25 × height in cm) − (5 × age) + s (where s = +5 for males, −161 for females). TDEE = BMR × Activity Multiplier."
      faqs={faqs}
    >
      <div className="space-y-6">
        <Card className="border-border shadow-sm">
          <CardContent className="p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-primary" />
                <h2 className="font-heading font-semibold text-base text-foreground">
                  Body & Activity Metrics
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <div className="inline-flex rounded-lg bg-muted p-0.5 border border-border">
                  <button
                    type="button"
                    onClick={() => setUnit("metric")}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                      unit === "metric"
                        ? "bg-card text-foreground shadow-sm"
                        : "text-secondary-text hover:text-foreground"
                    }`}
                  >
                    Metric
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnit("imperial")}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                      unit === "imperial"
                        ? "bg-card text-foreground shadow-sm"
                        : "text-secondary-text hover:text-foreground"
                    }`}
                  >
                    Imperial
                  </button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="h-8 text-xs text-secondary-text hover:text-foreground"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold text-foreground mb-1.5 block">Sex</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGender("male")}
                    className={`h-10 rounded-lg border text-xs font-semibold transition-all ${
                      gender === "male"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border text-secondary-text hover:text-foreground"
                    }`}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender("female")}
                    className={`h-10 rounded-lg border text-xs font-semibold transition-all ${
                      gender === "female"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border text-secondary-text hover:text-foreground"
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="cal-age" className="text-xs font-semibold text-foreground mb-1.5 block">
                  Age (Years)
                </Label>
                <Input
                  id="cal-age"
                  type="number"
                  min="10"
                  max="110"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="font-mono"
                />
              </div>
            </div>

            {unit === "metric" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="w-kg" className="text-xs font-semibold text-foreground mb-1.5 block">
                    Weight (kg)
                  </Label>
                  <Input
                    id="w-kg"
                    type="number"
                    min="20"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="font-mono"
                  />
                </div>
                <div>
                  <Label htmlFor="h-cm" className="text-xs font-semibold text-foreground mb-1.5 block">
                    Height (cm)
                  </Label>
                  <Input
                    id="h-cm"
                    type="number"
                    min="80"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    className="font-mono"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="w-lbs" className="text-xs font-semibold text-foreground mb-1.5 block">
                    Weight (lbs)
                  </Label>
                  <Input
                    id="w-lbs"
                    type="number"
                    min="40"
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(e.target.value)}
                    className="font-mono"
                  />
                </div>
                <div>
                  <Label htmlFor="h-ft" className="text-xs font-semibold text-foreground mb-1.5 block">
                    Height (ft)
                  </Label>
                  <Input
                    id="h-ft"
                    type="number"
                    min="2"
                    max="8"
                    value={heightFt}
                    onChange={(e) => setHeightFt(e.target.value)}
                    className="font-mono"
                  />
                </div>
                <div>
                  <Label htmlFor="h-in" className="text-xs font-semibold text-foreground mb-1.5 block">
                    Height (in)
                  </Label>
                  <Input
                    id="h-in"
                    type="number"
                    min="0"
                    max="11"
                    value={heightIn}
                    onChange={(e) => setHeightIn(e.target.value)}
                    className="font-mono"
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="activity-level" className="text-xs font-semibold text-foreground mb-1.5 block">
                Activity Level
              </Label>
              <select
                id="activity-level"
                value={activity}
                onChange={(e) => setActivity(e.target.value as ActivityLevel)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="1.2">Sedentary (Little or no exercise, desk job)</option>
                <option value="1.375">Lightly Active (Light exercise 1–3 days/week)</option>
                <option value="1.55">Moderately Active (Moderate exercise 3–5 days/week)</option>
                <option value="1.725">Very Active (Hard exercise 6–7 days/week)</option>
                <option value="1.9">Extra Active (Physical labor or twice-daily training)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* TDEE & Goal Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="border-primary/30 bg-primary/5 shadow-sm">
            <CardContent className="p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary block mb-1">
                Maintenance Calories (TDEE)
              </span>
              <div className="font-heading text-3xl font-extrabold text-foreground">
                {calc.tdee.toLocaleString()} <span className="text-base font-normal text-secondary-text">kcal/day</span>
              </div>
              <p className="text-xs text-secondary-text mt-1">
                Basal Metabolic Rate (BMR): <strong>{calc.bmr.toLocaleString()} kcal/day</strong>
              </p>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardContent className="p-5 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-secondary-text">Mild Fat Loss (-0.25 kg/wk)</span>
                <span className="font-mono font-bold text-foreground">{calc.mildLoss} kcal</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary-text">Fat Loss (-0.5 kg/wk)</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {calc.weightLoss} kcal
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary-text">Lean Bulk (+0.25 kg/wk)</span>
                <span className="font-mono font-bold text-foreground">{calc.mildGain} kcal</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary-text">Muscle Gain (+0.5 kg/wk)</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                  {calc.muscleGain} kcal
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Macro Split */}
        <Card className="border-border shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-heading font-semibold text-sm text-foreground">
                Daily Macronutrients (at Maintenance)
              </h3>
              <div className="flex gap-1.5">
                {(["balanced", "high-protein", "low-carb"] as MacroPreset[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setMacroPreset(p)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                      macroPreset === p
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-secondary-text hover:text-foreground"
                    }`}
                  >
                    {p.replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-muted/40 rounded-xl border border-border">
                <span className="text-xs text-secondary-text block mb-1">Protein</span>
                <span className="font-heading text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {calc.macros.proteinG}g
                </span>
              </div>
              <div className="p-4 bg-muted/40 rounded-xl border border-border">
                <span className="text-xs text-secondary-text block mb-1">Carbohydrates</span>
                <span className="font-heading text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {calc.macros.carbsG}g
                </span>
              </div>
              <div className="p-4 bg-muted/40 rounded-xl border border-border">
                <span className="text-xs text-secondary-text block mb-1">Dietary Fats</span>
                <span className="font-heading text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {calc.macros.fatsG}g
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CalculatorLayout>
  );
}
