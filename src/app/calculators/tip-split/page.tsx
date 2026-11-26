"use client";

import { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/calculator-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Receipt, RotateCcw, DollarSign, Users } from "lucide-react";

export default function TipSplitCalculatorPage() {
  const [billAmount, setBillAmount] = useState("120.00");
  const [tipPercent, setTipPercent] = useState("18");
  const [peopleCount, setPeopleCount] = useState("4");
  const [roundUpPerPerson, setRoundUpPerPerson] = useState(false);

  const summary = useMemo(() => {
    const bill = Math.max(0, parseFloat(billAmount) || 0);
    const tipPct = Math.max(0, Math.min(200, parseFloat(tipPercent) || 0));
    const people = Math.max(1, Math.floor(parseFloat(peopleCount) || 1));

    const rawTip = bill * (tipPct / 100);
    const rawTotal = bill + rawTip;
    let perPersonTotal = rawTotal / people;

    if (roundUpPerPerson) {
      perPersonTotal = Math.ceil(perPersonTotal);
    }

    const finalTotal = roundUpPerPerson ? perPersonTotal * people : rawTotal;
    const finalTip = finalTotal - bill;
    const tipPerPerson = finalTip / people;

    return {
      tipAmount: finalTip,
      totalAmount: finalTotal,
      perPersonTotal,
      tipPerPerson,
      billPerPerson: bill / people,
    };
  }, [billAmount, tipPercent, peopleCount, roundUpPerPerson]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);

  const handleReset = () => {
    setBillAmount("120.00");
    setTipPercent("18");
    setPeopleCount("4");
    setRoundUpPerPerson(false);
  };

  const howToSteps = [
    "Enter your total pre-tax or final bill amount.",
    "Tap one of the quick tip presets (10%, 15%, 18%, 20%, 25%) or enter a custom tip percentage.",
    "Enter the number of people splitting the check.",
    "Optionally toggle 'Round Up Per Person' to eliminate awkward cents when settling with friends.",
  ];

  const faqs = [
    {
      question: "Should I calculate tip before or after sales tax?",
      answer:
        "Standard etiquette is to calculate gratuity on the pre-tax subtotal. However, many point-of-sale terminals compute suggested percentages on the post-tax total. Entering your pre-tax subtotal gives the classic calculation.",
    },
    {
      question: "What is a standard restaurant tip percentage?",
      answer:
        "In the United States and Canada, 15% to 20% is standard for sit-down table service, 18% to 20% is customary for large groups, and 10% to 15% is common for takeout or buffet service.",
    },
    {
      question: "How does Round Up Per Person work?",
      answer:
        "Rounding up rounds each individual's share to the nearest whole dollar, adjusting the final total and tip slightly upward so everyone pays an exact, clean dollar amount.",
    },
  ];

  return (
    <CalculatorLayout
      title="Tip & Bill Split Calculator"
      description="Quickly calculate gratuity and split restaurant checks or group bills evenly between friends with quick presets and whole-dollar rounding."
      howToSteps={howToSteps}
      formulaExplanation="Total Tip = Bill × (Tip % / 100). Per-Person Share = (Bill + Total Tip) / Number of People."
      faqs={faqs}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <Card className="md:col-span-7 border-border shadow-sm">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-primary" />
                <h2 className="font-heading font-semibold text-base text-foreground">
                  Bill Details
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

            <div>
              <Label htmlFor="bill-amount" className="text-xs font-semibold text-foreground mb-1.5 block">
                Bill Amount
              </Label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-secondary-text absolute left-3 top-2.5" />
                <Input
                  id="bill-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  className="pl-9 font-mono text-base"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="tip-pct" className="text-xs font-semibold text-foreground">
                  Tip Percentage (%)
                </Label>
                <span className="font-mono text-xs font-bold text-primary">{tipPercent}%</span>
              </div>
              <div className="grid grid-cols-5 gap-2 mb-3">
                {["10", "15", "18", "20", "25"].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setTipPercent(pct)}
                    className={`py-2 rounded-lg border text-xs font-bold transition-all ${
                      tipPercent === pct
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-background border-border text-secondary-text hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
              <Input
                id="tip-pct"
                type="number"
                min="0"
                max="200"
                value={tipPercent}
                onChange={(e) => setTipPercent(e.target.value)}
                className="font-mono text-sm"
                placeholder="Custom tip %"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border items-center">
              <div>
                <Label htmlFor="people-count" className="text-xs font-semibold text-foreground mb-1.5 block">
                  Split Between (People)
                </Label>
                <div className="relative">
                  <Users className="w-4 h-4 text-secondary-text absolute left-3 top-2.5" />
                  <Input
                    id="people-count"
                    type="number"
                    min="1"
                    max="100"
                    value={peopleCount}
                    onChange={(e) => setPeopleCount(e.target.value)}
                    className="pl-9 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="round-up"
                  checked={roundUpPerPerson}
                  onChange={(e) => setRoundUpPerPerson(e.target.checked)}
                  className="h-4 w-4 rounded accent-primary"
                />
                <Label htmlFor="round-up" className="text-xs font-semibold text-foreground cursor-pointer">
                  Round Up Per Person
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-5 border-primary/30 bg-primary/5 shadow-sm">
          <CardContent className="p-6 space-y-5">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-primary block mb-1">
                Total Per Person
              </span>
              <div className="font-heading text-4xl font-extrabold text-foreground">
                {fmt(summary.perPersonTotal)}
              </div>
              <p className="text-xs text-secondary-text mt-1">
                Includes {fmt(summary.billPerPerson)} bill + {fmt(summary.tipPerPerson)} tip each
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-border text-sm">
              <div className="flex justify-between">
                <span className="text-secondary-text">Total Tip</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {fmt(summary.tipAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-text">Grand Total</span>
                <span className="font-mono font-bold text-foreground">
                  {fmt(summary.totalAmount)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CalculatorLayout>
  );
}
