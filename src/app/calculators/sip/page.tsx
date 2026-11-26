"use client";

import { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/calculator-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TrendingUp, RotateCcw, DollarSign, Percent, Calendar } from "lucide-react";

interface YearlyRow {
  year: number;
  invested: number;
  returns: number;
  totalValue: number;
}

export default function SipCalculatorPage() {
  const [monthlyInvestment, setMonthlyInvestment] = useState("500");
  const [annualReturn, setAnnualReturn] = useState("12");
  const [years, setYears] = useState("15");
  const [stepUpPercent, setStepUpPercent] = useState("0");
  const [lumpsumAmount, setLumpsumAmount] = useState("0");

  const results = useMemo(() => {
    const p = Math.max(0, parseFloat(monthlyInvestment) || 0);
    const r = Math.max(0, parseFloat(annualReturn) || 0);
    const nYears = Math.max(1, Math.min(50, Math.floor(parseFloat(years) || 1)));
    const stepUp = Math.max(0, Math.min(50, parseFloat(stepUpPercent) || 0));
    const initialLumpsum = Math.max(0, parseFloat(lumpsumAmount) || 0);

    const monthlyRate = r / 100 / 12;
    let totalInvested = initialLumpsum;
    let portfolioValue = initialLumpsum;
    let currentMonthlySip = p;
    const schedule: YearlyRow[] = [];

    for (let yr = 1; yr <= nYears; yr++) {
      for (let m = 1; m <= 12; m++) {
        portfolioValue = (portfolioValue + currentMonthlySip) * (1 + monthlyRate);
        totalInvested += currentMonthlySip;
      }
      schedule.push({
        year: yr,
        invested: Math.round(totalInvested),
        returns: Math.round(portfolioValue - totalInvested),
        totalValue: Math.round(portfolioValue),
      });
      if (stepUp > 0) {
        currentMonthlySip = currentMonthlySip * (1 + stepUp / 100);
      }
    }

    const totalVal = Math.round(portfolioValue);
    const invested = Math.round(totalInvested);
    const estReturns = Math.max(0, totalVal - invested);
    const investedPct = totalVal > 0 ? (invested / totalVal) * 100 : 100;
    const returnsPct = totalVal > 0 ? (estReturns / totalVal) * 100 : 0;

    return {
      totalValue: totalVal,
      totalInvested: invested,
      estReturns,
      investedPct,
      returnsPct,
      schedule,
    };
  }, [monthlyInvestment, annualReturn, years, stepUpPercent, lumpsumAmount]);

  const formatMoney = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);

  const handleReset = () => {
    setMonthlyInvestment("500");
    setAnnualReturn("12");
    setYears("15");
    setStepUpPercent("0");
    setLumpsumAmount("0");
  };

  const howToSteps = [
    "Enter your fixed monthly SIP contribution amount (and optional initial lumpsum deposit).",
    "Set your expected annual rate of return (e.g., 10% to 12% for broad equity index funds).",
    "Choose your investment horizon in years and optionally add an annual Step-Up percentage.",
    "Inspect the total wealth gained, invested capital ratio, and year-by-year compounding schedule.",
  ];

  const faqs = [
    {
      question: "What is a Step-Up SIP and how much difference does it make?",
      answer:
        "A Step-Up SIP automatically increases your monthly investment by a fixed percentage every year (for example, 10% annually as your salary grows). Even a modest 5%–10% annual step-up can nearly double your final corpus over a 15-to-20 year horizon compared to a flat SIP.",
    },
    {
      question: "How is SIP compounding calculated?",
      answer:
        "Each monthly installment compounds at the monthly periodic rate (Annual Return / 12) for the remaining months of your investment tenure. Early installments compound longer than later installments, creating an exponential snowball effect.",
    },
    {
      question: "Are SIP returns guaranteed?",
      answer:
        "No. Mutual funds and index ETFs fluctuate with market performance. This calculator models a steady annualized return for long-term financial planning; actual year-to-year market returns will vary.",
    },
  ];

  return (
    <CalculatorLayout
      title="SIP & Step-Up Mutual Fund Calculator"
      description="Estimate future wealth from Systematic Investment Plans (SIP), optional Step-Up annual increases, and lumpsum deposits with a full year-by-year compounding schedule."
      howToSteps={howToSteps}
      formulaExplanation="FV = P × [((1 + i)^n - 1) / i] × (1 + i), where P is the monthly SIP installment, i is the monthly interest rate (Annual Rate / 12 / 100), and n is the total number of monthly installments."
      faqs={faqs}
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Inputs */}
          <Card className="md:col-span-6 border-border shadow-sm">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <h2 className="font-heading font-semibold text-base text-foreground">
                    SIP Parameters
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

              <div className="space-y-4">
                <div>
                  <Label htmlFor="monthly-sip" className="text-xs font-semibold text-foreground mb-1.5 block">
                    Monthly Investment
                  </Label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-secondary-text absolute left-3 top-2.5" />
                    <Input
                      id="monthly-sip"
                      type="number"
                      min="0"
                      value={monthlyInvestment}
                      onChange={(e) => setMonthlyInvestment(e.target.value)}
                      className="pl-9 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="annual-return" className="text-xs font-semibold text-foreground mb-1.5 block">
                      Expected Return (% / yr)
                    </Label>
                    <div className="relative">
                      <Percent className="w-3.5 h-3.5 text-secondary-text absolute left-3 top-3" />
                      <Input
                        id="annual-return"
                        type="number"
                        min="0"
                        max="50"
                        step="0.5"
                        value={annualReturn}
                        onChange={(e) => setAnnualReturn(e.target.value)}
                        className="pl-9 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="sip-years" className="text-xs font-semibold text-foreground mb-1.5 block">
                      Time Period (Years)
                    </Label>
                    <div className="relative">
                      <Calendar className="w-3.5 h-3.5 text-secondary-text absolute left-3 top-3" />
                      <Input
                        id="sip-years"
                        type="number"
                        min="1"
                        max="50"
                        value={years}
                        onChange={(e) => setYears(e.target.value)}
                        className="pl-9 font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                  <div>
                    <Label htmlFor="step-up" className="text-xs font-semibold text-secondary-text mb-1.5 block">
                      Annual Step-Up (%)
                    </Label>
                    <Input
                      id="step-up"
                      type="number"
                      min="0"
                      max="50"
                      value={stepUpPercent}
                      onChange={(e) => setStepUpPercent(e.target.value)}
                      className="font-mono text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="lumpsum" className="text-xs font-semibold text-secondary-text mb-1.5 block">
                      Initial Lumpsum
                    </Label>
                    <Input
                      id="lumpsum"
                      type="number"
                      min="0"
                      value={lumpsumAmount}
                      onChange={(e) => setLumpsumAmount(e.target.value)}
                      className="font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Result Card */}
          <Card className="md:col-span-6 border-border shadow-sm bg-card">
            <CardContent className="p-6 space-y-6">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-secondary-text block mb-1">
                  Estimated Future Value
                </span>
                <div className="font-heading text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                  {formatMoney(results.totalValue)}
                </div>
              </div>

              {/* Visual Ratio Bar */}
              <div className="space-y-2">
                <div className="h-3.5 w-full rounded-full overflow-hidden flex bg-muted">
                  <div
                    className="bg-slate-400 dark:bg-slate-500 transition-all duration-300"
                    style={{ width: `${results.investedPct}%` }}
                    title={`Invested: ${results.investedPct.toFixed(1)}%`}
                  />
                  <div
                    className="bg-emerald-500 transition-all duration-300"
                    style={{ width: `${results.returnsPct}%` }}
                    title={`Returns: ${results.returnsPct.toFixed(1)}%`}
                  />
                </div>
                <div className="flex justify-between text-xs text-secondary-text">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-500 inline-block" />
                    Invested ({results.investedPct.toFixed(1)}%)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    Est. Returns ({results.returnsPct.toFixed(1)}%)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="p-3.5 bg-muted/40 rounded-xl border border-border">
                  <span className="text-xs text-secondary-text block mb-1">Total Invested</span>
                  <span className="font-heading font-bold text-lg text-foreground">
                    {formatMoney(results.totalInvested)}
                  </span>
                </div>
                <div className="p-3.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <span className="text-xs text-emerald-700 dark:text-emerald-300 block mb-1">
                    Wealth Gained
                  </span>
                  <span className="font-heading font-bold text-lg text-emerald-600 dark:text-emerald-400">
                    {formatMoney(results.estReturns)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Yearly Breakdown Table */}
        <Card className="border-border shadow-sm overflow-hidden">
          <div className="p-4 sm:px-6 border-b border-border bg-muted/30">
            <h3 className="font-heading font-semibold text-sm text-foreground">
              Year-by-Year Wealth Growth Schedule
            </h3>
          </div>
          <div className="overflow-x-auto max-h-80">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-muted sticky top-0 border-b border-border">
                <tr>
                  <th className="py-3 px-4 font-semibold text-foreground">Year</th>
                  <th className="py-3 px-4 text-right font-semibold text-foreground">Total Invested</th>
                  <th className="py-3 px-4 text-right font-semibold text-foreground">Est. Returns</th>
                  <th className="py-3 px-4 text-right font-semibold text-foreground">Portfolio Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-mono">
                {results.schedule.map((row) => (
                  <tr key={row.year} className="hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 px-4 font-medium text-foreground">Year {row.year}</td>
                    <td className="py-2.5 px-4 text-right text-secondary-text">
                      {formatMoney(row.invested)}
                    </td>
                    <td className="py-2.5 px-4 text-right text-emerald-600 dark:text-emerald-400 font-medium">
                      {formatMoney(row.returns)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-foreground">
                      {formatMoney(row.totalValue)}
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
