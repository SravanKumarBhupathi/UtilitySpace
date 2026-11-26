"use client";

import { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/calculator-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Briefcase, RotateCcw, DollarSign } from "lucide-react";

type PayPeriod = "hourly" | "daily" | "weekly" | "biweekly" | "monthly" | "annual";

export default function SalaryCalculatorPage() {
  const [amount, setAmount] = useState("75000");
  const [period, setPeriod] = useState<PayPeriod>("annual");
  const [hoursPerWeek, setHoursPerWeek] = useState("40");
  const [daysPerWeek, setDaysPerWeek] = useState("5");
  const [weeksPerYear, setWeeksPerYear] = useState("52");
  const [taxRate, setTaxRate] = useState("22");
  const [deductionRate, setDeductionRate] = useState("5");

  const breakdown = useMemo(() => {
    const val = Math.max(0, parseFloat(amount) || 0);
    const hrs = Math.max(1, parseFloat(hoursPerWeek) || 40);
    const days = Math.max(1, parseFloat(daysPerWeek) || 5);
    const wks = Math.max(1, Math.min(52, parseFloat(weeksPerYear) || 52));
    const tax = Math.max(0, Math.min(80, parseFloat(taxRate) || 0));
    const ded = Math.max(0, Math.min(50, parseFloat(deductionRate) || 0));

    let annualGross = 0;
    switch (period) {
      case "hourly":
        annualGross = val * hrs * wks;
        break;
      case "daily":
        annualGross = val * days * wks;
        break;
      case "weekly":
        annualGross = val * wks;
        break;
      case "biweekly":
        annualGross = val * (wks / 2);
        break;
      case "monthly":
        annualGross = val * 12;
        break;
      case "annual":
      default:
        annualGross = val;
        break;
    }

    const totalCutPct = Math.min(95, tax + ded) / 100;
    const annualNet = annualGross * (1 - totalCutPct);
    const annualTax = annualGross * (tax / 100);
    const annualDeductions = annualGross * (ded / 100);

    const buildRow = (gross: number, net: number) => ({ gross, net });

    return {
      annualTax,
      annualDeductions,
      annual: buildRow(annualGross, annualNet),
      monthly: buildRow(annualGross / 12, annualNet / 12),
      biweekly: buildRow(annualGross / (wks / 2), annualNet / (wks / 2)),
      weekly: buildRow(annualGross / wks, annualNet / wks),
      daily: buildRow(annualGross / (wks * days), annualNet / (wks * days)),
      hourly: buildRow(annualGross / (wks * hrs), annualNet / (wks * hrs)),
    };
  }, [amount, period, hoursPerWeek, daysPerWeek, weeksPerYear, taxRate, deductionRate]);

  const fmt = (num: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: num < 500 ? 2 : 0,
      maximumFractionDigits: num < 500 ? 2 : 0,
    }).format(num);

  const handleReset = () => {
    setAmount("75000");
    setPeriod("annual");
    setHoursPerWeek("40");
    setDaysPerWeek("5");
    setWeeksPerYear("52");
    setTaxRate("22");
    setDeductionRate("5");
  };

  const howToSteps = [
    "Enter your base compensation figure and choose its pay frequency (Hourly, Monthly, Annual, etc.).",
    "Adjust your standard working hours per week, days per week, and paid weeks per year.",
    "Optionally enter your estimated effective tax rate and retirement/benefit deduction percentage.",
    "Review your side-by-side Gross vs. Net Take-Home Pay across every pay interval.",
  ];

  const faqs = [
    {
      question: "How do I quickly estimate hourly rate from an annual salary?",
      answer:
        "For a standard full-time 40-hour workweek (2,080 hours per year), divide your annual salary by 2,080. A quick mental shortcut is dividing the annual salary in thousands by 2 (for example, $80,000/year is roughly $40/hour, or precisely $38.46/hour).",
    },
    {
      question: "What is the difference between Gross Pay and Net Take-Home Pay?",
      answer:
        "Gross pay is your total contracted salary before taxes, Social Security/FICA, health insurance premiums, and retirement contributions (such as 401(k) or PF). Net pay is the actual cash deposited into your bank account.",
    },
    {
      question: "How many bi-weekly paychecks are there in a year?",
      answer:
        "There are 26 bi-weekly paychecks in a standard 52-week year (meaning two months of the year feature three paychecks instead of two). Semi-monthly pay, by contrast, issues 24 paychecks per year.",
    },
  ];

  const rows = [
    { label: "Annual", data: breakdown.annual },
    { label: "Monthly", data: breakdown.monthly },
    { label: "Bi-Weekly", data: breakdown.biweekly },
    { label: "Weekly", data: breakdown.weekly },
    { label: "Daily", data: breakdown.daily },
    { label: "Hourly", data: breakdown.hourly },
  ];

  return (
    <CalculatorLayout
      title="Salary & Take-Home Pay Calculator"
      description="Convert hourly, daily, weekly, bi-weekly, monthly, and annual compensation with customizable work schedules, effective tax rates, and retirement deductions."
      howToSteps={howToSteps}
      formulaExplanation="Annual Gross = Hourly Rate × Hours/Week × Weeks/Year. Net Take-Home Pay = Gross × (1 - Effective Tax Rate - Deduction Rate)."
      faqs={faqs}
    >
      <div className="space-y-6">
        <Card className="border-border shadow-sm">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary" />
                <h2 className="font-heading font-semibold text-base text-foreground">
                  Compensation & Schedule Inputs
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-8 text-xs text-secondary-text hover:text-foreground"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salary-amount" className="text-xs font-semibold text-foreground mb-1.5 block">
                  Pay Amount
                </Label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-secondary-text absolute left-3 top-2.5" />
                  <Input
                    id="salary-amount"
                    type="number"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-9 font-mono"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="pay-period" className="text-xs font-semibold text-foreground mb-1.5 block">
                  Pay Frequency
                </Label>
                <select
                  id="pay-period"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value as PayPeriod)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="annual">Per Year (Annual)</option>
                  <option value="monthly">Per Month</option>
                  <option value="biweekly">Bi-Weekly (Every 2 Weeks)</option>
                  <option value="weekly">Per Week</option>
                  <option value="daily">Per Day</option>
                  <option value="hourly">Per Hour</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 border-t border-border">
              <div>
                <Label htmlFor="hrs-week" className="text-[11px] font-semibold text-secondary-text mb-1 block">
                  Hours / Week
                </Label>
                <Input
                  id="hrs-week"
                  type="number"
                  min="1"
                  max="168"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(e.target.value)}
                  className="font-mono text-xs h-9"
                />
              </div>
              <div>
                <Label htmlFor="days-week" className="text-[11px] font-semibold text-secondary-text mb-1 block">
                  Days / Week
                </Label>
                <Input
                  id="days-week"
                  type="number"
                  min="1"
                  max="7"
                  value={daysPerWeek}
                  onChange={(e) => setDaysPerWeek(e.target.value)}
                  className="font-mono text-xs h-9"
                />
              </div>
              <div>
                <Label htmlFor="wks-year" className="text-[11px] font-semibold text-secondary-text mb-1 block">
                  Weeks / Year
                </Label>
                <Input
                  id="wks-year"
                  type="number"
                  min="1"
                  max="52"
                  value={weeksPerYear}
                  onChange={(e) => setWeeksPerYear(e.target.value)}
                  className="font-mono text-xs h-9"
                />
              </div>
              <div>
                <Label htmlFor="tax-rate" className="text-[11px] font-semibold text-secondary-text mb-1 block">
                  Est. Tax (%)
                </Label>
                <Input
                  id="tax-rate"
                  type="number"
                  min="0"
                  max="80"
                  step="0.5"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="font-mono text-xs h-9"
                />
              </div>
              <div>
                <Label htmlFor="ded-rate" className="text-[11px] font-semibold text-secondary-text mb-1 block">
                  401k / Ded. (%)
                </Label>
                <Input
                  id="ded-rate"
                  type="number"
                  min="0"
                  max="50"
                  step="0.5"
                  value={deductionRate}
                  onChange={(e) => setDeductionRate(e.target.value)}
                  className="font-mono text-xs h-9"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Highlight Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-border shadow-sm">
            <CardContent className="p-5">
              <span className="text-xs text-secondary-text font-medium block mb-1">Annual Gross Pay</span>
              <span className="font-heading text-2xl font-bold text-foreground">
                {fmt(breakdown.annual.gross)}
              </span>
            </CardContent>
          </Card>
          <Card className="border-emerald-500/30 bg-emerald-500/5 shadow-sm">
            <CardContent className="p-5">
              <span className="text-xs text-emerald-700 dark:text-emerald-300 font-medium block mb-1">
                Annual Take-Home (Net)
              </span>
              <span className="font-heading text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {fmt(breakdown.annual.net)}
              </span>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm">
            <CardContent className="p-5">
              <span className="text-xs text-secondary-text font-medium block mb-1">
                Monthly Take-Home
              </span>
              <span className="font-heading text-2xl font-bold text-primary">
                {fmt(breakdown.monthly.net)}
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Full Pay Breakdown Table */}
        <Card className="border-border shadow-sm overflow-hidden">
          <div className="p-4 sm:px-6 border-b border-border bg-muted/30 flex items-center justify-between">
            <h3 className="font-heading font-semibold text-sm text-foreground">
              Gross vs. Net Compensation Breakdown
            </h3>
            <span className="text-xs text-secondary-text font-mono">
              Taxes: {fmt(breakdown.annualTax)}/yr • Deductions: {fmt(breakdown.annualDeductions)}/yr
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-muted border-b border-border text-xs">
                <tr>
                  <th className="py-3 px-4 font-semibold text-foreground">Pay Frequency</th>
                  <th className="py-3 px-4 text-right font-semibold text-foreground">Gross Pay</th>
                  <th className="py-3 px-4 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                    Net Take-Home
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-mono text-xs sm:text-sm">
                {rows.map((r) => (
                  <tr key={r.label} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-sans font-medium text-foreground">{r.label}</td>
                    <td className="py-3 px-4 text-right text-secondary-text">{fmt(r.data.gross)}</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      {fmt(r.data.net)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </CalculatorLayout>
  );
}
