"use client";

import { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/calculator-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  Percent,
  Calendar,
  Download,
  RotateCcw,
  Shield,
  Home,
  FileSpreadsheet,
  PieChart,
} from "lucide-react";

interface MonthlyRecord {
  month: number;
  year: number;
  monthInYear: number;
  startBalance: number;
  principalPayment: number;
  interestPayment: number;
  totalPayment: number;
  endBalance: number;
}

interface YearlyRecord {
  year: number;
  startBalance: number;
  principalPaid: number;
  interestPaid: number;
  totalPaid: number;
  endBalance: number;
}

export default function MortgageCalculator() {
  // Input states with realistic initial defaults
  const [homePrice, setHomePrice] = useState("400000");
  const [downPayment, setDownPayment] = useState("80000");
  const [downPaymentPercent, setDownPaymentPercent] = useState("20");
  const [loanTermYears, setLoanTermYears] = useState<number>(30);
  const [isCustomTerm, setIsCustomTerm] = useState(false);
  const [customTermYears, setCustomTermYears] = useState("30");
  const [interestRate, setInterestRate] = useState("6.5");
  const [propertyTax, setPropertyTax] = useState("4800");
  const [homeInsurance, setHomeInsurance] = useState("1200");
  const [pmiRate, setPmiRate] = useState("0.5");

  // Schedule view options
  const [scheduleView, setScheduleView] = useState<"yearly" | "monthly">("yearly");
  const [selectedScheduleYear, setSelectedScheduleYear] = useState<number | "all">(1);

  // Synchronize Down Payment Amount and Percentage
  const handleHomePriceChange = (val: string) => {
    setHomePrice(val);
    const priceNum = parseFloat(val);
    const pctNum = parseFloat(downPaymentPercent);
    if (!isNaN(priceNum) && !isNaN(pctNum) && priceNum >= 0) {
      const newDown = Math.round((priceNum * pctNum) / 100);
      setDownPayment(newDown.toString());
    }
  };

  const handleDownPaymentAmountChange = (val: string) => {
    setDownPayment(val);
    const downNum = parseFloat(val);
    const priceNum = parseFloat(homePrice);
    if (!isNaN(downNum) && !isNaN(priceNum) && priceNum > 0) {
      const pct = ((downNum / priceNum) * 100).toFixed(1);
      setDownPaymentPercent(pct);
    }
  };

  const handleDownPaymentPercentChange = (val: string) => {
    setDownPaymentPercent(val);
    const pctNum = parseFloat(val);
    const priceNum = parseFloat(homePrice);
    if (!isNaN(pctNum) && !isNaN(priceNum) && priceNum >= 0) {
      const newDown = Math.round((priceNum * pctNum) / 100);
      setDownPayment(newDown.toString());
    }
  };

  const handleTermSelect = (years: number) => {
    setIsCustomTerm(false);
    setLoanTermYears(years);
  };

  const handleCustomTermChange = (val: string) => {
    setCustomTermYears(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setLoanTermYears(num);
    }
  };

  const resetForm = () => {
    setHomePrice("400000");
    setDownPayment("80000");
    setDownPaymentPercent("20");
    setLoanTermYears(30);
    setIsCustomTerm(false);
    setCustomTermYears("30");
    setInterestRate("6.5");
    setPropertyTax("4800");
    setHomeInsurance("1200");
    setPmiRate("0.5");
    setSelectedScheduleYear(1);
    setScheduleView("yearly");
  };

  // Perform Calculations
  const calculations = useMemo(() => {
    const price = parseFloat(homePrice) || 0;
    const down = parseFloat(downPayment) || 0;
    const principal = Math.max(0, price - down);
    const termYears = isCustomTerm ? (parseFloat(customTermYears) || 0) : loanTermYears;
    const totalMonths = Math.max(1, Math.round(termYears * 12));
    const annualRate = parseFloat(interestRate) || 0;
    const annualTax = parseFloat(propertyTax) || 0;
    const annualIns = parseFloat(homeInsurance) || 0;
    const annualPmiPct = parseFloat(pmiRate) || 0;

    const monthlyRate = annualRate / 12 / 100;
    const monthlyTax = annualTax / 12;
    const monthlyIns = annualIns / 12;

    // PMI applies if down payment is less than 20% of home price
    const downPctActual = price > 0 ? (down / price) * 100 : 0;
    const pmiApplies = downPctActual < 20 && annualPmiPct > 0;
    const monthlyPmi = pmiApplies ? (principal * (annualPmiPct / 100)) / 12 : 0;

    // Monthly Principal & Interest Payment
    let monthlyPI = 0;
    if (principal > 0 && totalMonths > 0) {
      if (monthlyRate === 0) {
        monthlyPI = principal / totalMonths;
      } else {
        const factor = Math.pow(1 + monthlyRate, totalMonths);
        monthlyPI = (principal * monthlyRate * factor) / (factor - 1);
      }
    }

    const totalMonthlyPayment = monthlyPI + monthlyTax + monthlyIns + monthlyPmi;
    const totalPaymentsPI = monthlyPI * totalMonths;
    const totalInterestPaid = Math.max(0, totalPaymentsPI - principal);
    const totalCostOfLoan = principal + totalInterestPaid + (annualTax * termYears) + (annualIns * termYears);

    // Payoff Date calculation
    const currentDate = new Date();
    const payoffDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + totalMonths, 1);
    const payoffDateString = payoffDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    // Generate Month-by-Month Amortization Schedule
    const monthlySchedule: MonthlyRecord[] = [];
    let currentBalance = principal;

    for (let m = 1; m <= totalMonths; m++) {
      const startBal = currentBalance;
      const interestForMonth = monthlyRate > 0 ? currentBalance * monthlyRate : 0;
      let principalForMonth = monthlyPI - interestForMonth;

      if (m === totalMonths || principalForMonth > currentBalance) {
        principalForMonth = currentBalance;
        currentBalance = 0;
      } else {
        currentBalance -= principalForMonth;
      }

      monthlySchedule.push({
        month: m,
        year: Math.ceil(m / 12),
        monthInYear: ((m - 1) % 12) + 1,
        startBalance: startBal,
        principalPayment: principalForMonth,
        interestPayment: interestForMonth,
        totalPayment: principalForMonth + interestForMonth,
        endBalance: Math.max(0, currentBalance),
      });

      if (currentBalance <= 0) break;
    }

    // Generate Yearly Summary Schedule
    const yearlySchedule: YearlyRecord[] = [];
    const totalYearsCount = Math.ceil(monthlySchedule.length / 12);

    for (let y = 1; y <= totalYearsCount; y++) {
      const yearMonths = monthlySchedule.filter((item) => item.year === y);
      if (yearMonths.length === 0) continue;

      const startBal = yearMonths[0].startBalance;
      const endBal = yearMonths[yearMonths.length - 1].endBalance;
      const principalSum = yearMonths.reduce((sum, item) => sum + item.principalPayment, 0);
      const interestSum = yearMonths.reduce((sum, item) => sum + item.interestPayment, 0);

      yearlySchedule.push({
        year: y,
        startBalance: startBal,
        principalPaid: principalSum,
        interestPaid: interestSum,
        totalPaid: principalSum + interestSum,
        endBalance: endBal,
      });
    }

    // Breakdown percentages
    const piPercent = totalMonthlyPayment > 0 ? (monthlyPI / totalMonthlyPayment) * 100 : 0;
    const taxPercent = totalMonthlyPayment > 0 ? (monthlyTax / totalMonthlyPayment) * 100 : 0;
    const insPercent = totalMonthlyPayment > 0 ? (monthlyIns / totalMonthlyPayment) * 100 : 0;
    const pmiPercent = totalMonthlyPayment > 0 ? (monthlyPmi / totalMonthlyPayment) * 100 : 0;

    return {
      principal,
      termYears,
      totalMonths,
      monthlyPI,
      monthlyTax,
      monthlyIns,
      monthlyPmi,
      totalMonthlyPayment,
      totalInterestPaid,
      totalCostOfLoan,
      payoffDateString,
      downPctActual,
      monthlySchedule,
      yearlySchedule,
      piPercent,
      taxPercent,
      insPercent,
      pmiPercent,
    };
  }, [
    homePrice,
    downPayment,
    loanTermYears,
    isCustomTerm,
    customTermYears,
    interestRate,
    propertyTax,
    homeInsurance,
    pmiRate,
  ]);

  // Export Schedule to CSV
  const handleExportCSV = () => {
    let csvContent = "";
    if (scheduleView === "yearly") {
      csvContent = "Year,Beginning Balance,Principal Paid,Interest Paid,Total Payment,Ending Balance\n";
      calculations.yearlySchedule.forEach((row) => {
        csvContent += `${row.year},${row.startBalance.toFixed(2)},${row.principalPaid.toFixed(2)},${row.interestPaid.toFixed(2)},${row.totalPaid.toFixed(2)},${row.endBalance.toFixed(2)}\n`;
      });
    } else {
      csvContent = "Month,Year,Beginning Balance,Principal,Interest,Total Payment,Ending Balance\n";
      const recordsToExport =
        selectedScheduleYear === "all"
          ? calculations.monthlySchedule
          : calculations.monthlySchedule.filter((item) => item.year === selectedScheduleYear);
      recordsToExport.forEach((row) => {
        csvContent += `${row.month},${row.year},${row.startBalance.toFixed(2)},${row.principalPayment.toFixed(2)},${row.interestPayment.toFixed(2)},${row.totalPayment.toFixed(2)},${row.endBalance.toFixed(2)}\n`;
      });
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `mortgage-amortization-${scheduleView}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (val: number) => {
    return "$" + Math.round(val).toLocaleString("en-US");
  };

  const formatCurrencyExact = (val: number) => {
    return "$" + val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Structured Content for SEO & UtilitySpace Guidelines
  const howToSteps = [
    "Enter your target Home Purchase Price and specify your Down Payment in either dollars or a percentage (putting 20% or more eliminates PMI).",
    "Choose your preferred Loan Term (such as 15, 20, or 30 years, or set a custom term) and enter the annual Interest Rate offered by your mortgage lender.",
    "Add your estimated annual Property Taxes and Homeowner's Insurance to view an accurate, complete PITI (Principal, Interest, Taxes, and Insurance) monthly payment.",
    "Inspect the interactive Monthly Breakdown bar to analyze how much of your payment builds equity versus covering interest, taxes, and fees.",
    "Toggle between the Yearly and Monthly Amortization Schedule tables to track your remaining principal balance and download the complete schedule as a CSV spreadsheet.",
  ];

  const faqs = [
    {
      question: "What is the difference between a 15-year and a 30-year fixed mortgage?",
      answer:
        "A 30-year fixed-rate mortgage spreads repayment over 360 monthly installments, resulting in lower monthly payments and easier qualification for homebuyers. However, a 15-year mortgage typically offers a lower interest rate and amortizes twice as quickly, cutting your total lifetime interest expense by more than 50% to 60%. If your monthly budget accommodates the higher installment, a 15-year term builds home equity much faster.",
    },
    {
      question: "What is PMI (Private Mortgage Insurance) and when does it drop off?",
      answer:
        "Private Mortgage Insurance (PMI) is required by conventional mortgage lenders whenever a borrower's down payment is less than 20% of the home purchase price (meaning the Loan-to-Value ratio exceeds 80%). Under the federal Homeowners Protection Act (HPA), you can submit a written request to cancel PMI once your principal balance reaches 80% of original value, and your loan servicer is legally mandated to automatically terminate PMI once your balance falls to 78% of original value.",
    },
    {
      question: "How does a mortgage amortization schedule work?",
      answer:
        "An amortization schedule is an itemized breakdown of every payment throughout the loan's lifecycle. In the initial years of a mortgage, the overwhelming majority of your monthly installment goes toward interest because interest is assessed on the large remaining principal. Over time, as your principal steadily decreases, the interest share shrinks and an ever-larger portion of each payment goes directly toward paying down loan principal.",
    },
    {
      question: "What expenses are included in a PITI mortgage payment?",
      answer:
        "PITI stands for Principal, Interest, Taxes, and Insurance. Principal pays down your borrowed loan amount; Interest is the lender's financing fee; Taxes cover municipal and county property taxes held in escrow; and Insurance includes hazard/homeowner's insurance (and PMI if applicable). Many lenders require collecting taxes and insurance monthly into an escrow account to ensure timely municipal tax payments and property protection.",
    },
    {
      question: "How do extra principal payments affect my mortgage?",
      answer:
        "Every dollar paid in excess of your regular monthly payment applies directly to your loan principal. Because future interest is calculated exclusively on your remaining balance, even a modest extra payment of $100 to $200 per month can shorten a 30-year mortgage by several years and save tens of thousands of dollars in cumulative interest charges.",
    },
  ];

  const formulaExplanation =
    "The monthly principal and interest payment is calculated using the standard fixed-rate amortization equation: M = P [ r(1 + r)^n ] / [ (1 + r)^n - 1 ], where P represents the loan principal (Home Price minus Down Payment), r represents the periodic monthly interest rate (Annual Interest Rate ÷ 12 ÷ 100), and n represents the total number of monthly payments (Loan Term in Years × 12). Property taxes and homeowner's insurance are converted to monthly values (Annual Total ÷ 12) and added alongside monthly PMI (if Loan-to-Value exceeds 80%) to calculate your total monthly outlay.";

  // Filtered monthly records for table view
  const visibleMonthlyRecords = useMemo(() => {
    if (selectedScheduleYear === "all") {
      return calculations.monthlySchedule;
    }
    return calculations.monthlySchedule.filter((item) => item.year === selectedScheduleYear);
  }, [calculations.monthlySchedule, selectedScheduleYear]);

  return (
    <CalculatorLayout
      title="Mortgage Calculator"
      description="Calculate your monthly mortgage payment, interest, taxes, and explore a complete yearly and monthly amortization schedule."
      howToSteps={howToSteps}
      faqs={faqs}
      formulaExplanation={formulaExplanation}
    >
      <div className="space-y-8">
        {/* Main Grid: Inputs on Left/Top, Output Cards on Right/Bottom */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs Section (5 Cols on LG) */}
          <Card className="lg:col-span-5 shadow-sm border border-border">
            <CardHeader className="pb-4 border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
                  <Home className="w-5 h-5 text-primary" />
                  Loan Parameters
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetForm}
                  className="h-8 px-2 text-xs text-secondary-text hover:text-foreground"
                  title="Reset to default values"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" />
                  Reset
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-5">
              {/* Home Price */}
              <div className="space-y-1.5">
                <Label htmlFor="homePrice" className="text-sm font-medium text-foreground">
                  Home Price ($)
                </Label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-secondary-text absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input
                    id="homePrice"
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="400000"
                    className="pl-9 font-medium"
                    value={homePrice}
                    onChange={(e) => handleHomePriceChange(e.target.value)}
                  />
                </div>
              </div>

              {/* Down Payment (Dual Input: $ and %) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="downPayment" className="text-sm font-medium text-foreground">
                    Down Payment
                  </Label>
                  <span className="text-xs text-secondary-text">
                    Loan Amount: <strong className="text-foreground">{formatCurrency(calculations.principal)}</strong>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-secondary-text absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <Input
                      id="downPayment"
                      type="number"
                      min="0"
                      step="1000"
                      placeholder="80000"
                      className="pl-9"
                      value={downPayment}
                      onChange={(e) => handleDownPaymentAmountChange(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Percent className="w-4 h-4 text-secondary-text absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <Input
                      id="downPaymentPercent"
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      placeholder="20"
                      className="pr-9"
                      value={downPaymentPercent}
                      onChange={(e) => handleDownPaymentPercentChange(e.target.value)}
                    />
                  </div>
                </div>
                {calculations.downPctActual < 20 && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-1">
                    <Shield className="w-3.5 h-3.5 shrink-0" />
                    Down payment under 20% typically requires PMI.
                  </p>
                )}
              </div>

              {/* Loan Term Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Loan Term</Label>
                <div className="grid grid-cols-4 gap-2">
                  {[15, 20, 30].map((term) => (
                    <Button
                      key={term}
                      type="button"
                      variant={!isCustomTerm && loanTermYears === term ? "default" : "outline"}
                      size="sm"
                      className="text-xs font-semibold"
                      onClick={() => handleTermSelect(term)}
                    >
                      {term} Yrs
                    </Button>
                  ))}
                  <Button
                    type="button"
                    variant={isCustomTerm ? "default" : "outline"}
                    size="sm"
                    className="text-xs font-semibold"
                    onClick={() => setIsCustomTerm(true)}
                  >
                    Custom
                  </Button>
                </div>
                {isCustomTerm && (
                  <div className="pt-2">
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-secondary-text absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <Input
                        type="number"
                        min="1"
                        max="50"
                        placeholder="Loan term in years"
                        className="pl-9"
                        value={customTermYears}
                        onChange={(e) => handleCustomTermChange(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Interest Rate */}
              <div className="space-y-1.5">
                <Label htmlFor="interestRate" className="text-sm font-medium text-foreground">
                  Interest Rate (%)
                </Label>
                <div className="relative">
                  <Percent className="w-4 h-4 text-secondary-text absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input
                    id="interestRate"
                    type="number"
                    min="0"
                    max="25"
                    step="0.05"
                    placeholder="6.5"
                    className="pr-9 font-medium"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                  />
                </div>
              </div>

              {/* Optional Additional Costs (Taxes, Insurance, PMI) */}
              <div className="pt-2 border-t border-border space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-secondary-text">
                  Taxes, Insurance & PMI (Annual)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="propertyTax" className="text-xs text-secondary-text">
                      Property Tax ($/yr)
                    </Label>
                    <div className="relative">
                      <DollarSign className="w-3.5 h-3.5 text-secondary-text absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <Input
                        id="propertyTax"
                        type="number"
                        min="0"
                        step="100"
                        placeholder="4800"
                        className="pl-7 h-8 text-xs"
                        value={propertyTax}
                        onChange={(e) => setPropertyTax(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="homeInsurance" className="text-xs text-secondary-text">
                      Home Insurance ($/yr)
                    </Label>
                    <div className="relative">
                      <DollarSign className="w-3.5 h-3.5 text-secondary-text absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <Input
                        id="homeInsurance"
                        type="number"
                        min="0"
                        step="100"
                        placeholder="1200"
                        className="pl-7 h-8 text-xs"
                        value={homeInsurance}
                        onChange={(e) => setHomeInsurance(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pmiRate" className="text-xs text-secondary-text">
                      PMI Rate (%/yr)
                    </Label>
                    <span className="text-[11px] text-secondary-text">
                      {calculations.downPctActual >= 20 ? "0% (20%+ down payment)" : "Applied until 20% equity"}
                    </span>
                  </div>
                  <div className="relative">
                    <Percent className="w-3.5 h-3.5 text-secondary-text absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <Input
                      id="pmiRate"
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      placeholder="0.5"
                      disabled={calculations.downPctActual >= 20}
                      className="pr-7 h-8 text-xs disabled:opacity-50"
                      value={pmiRate}
                      onChange={(e) => setPmiRate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Outputs Section (7 Cols on LG) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Hero Monthly Payment Card */}
            <Card className="shadow-md border border-primary/20 bg-card overflow-hidden">
              <div className="p-6 md:p-8 bg-gradient-to-br from-primary/5 via-card to-background">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs uppercase tracking-wider font-semibold text-secondary-text">
                      Total Estimated Monthly Payment
                    </span>
                    <div className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mt-1">
                      {formatCurrencyExact(calculations.totalMonthlyPayment)}
                      <span className="text-base font-normal text-secondary-text">/mo</span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs font-medium text-secondary-text block">Target Payoff Date</span>
                    <span className="text-lg font-bold text-foreground">{calculations.payoffDateString}</span>
                  </div>
                </div>

                {/* Visual Stacked Progress Breakdown Bar */}
                <div className="mt-6 space-y-2">
                  <div className="h-4 w-full rounded-full overflow-hidden flex bg-muted">
                    <div
                      style={{ width: `${calculations.piPercent}%` }}
                      className="bg-blue-600 transition-all duration-300"
                      title={`Principal & Interest: ${formatCurrencyExact(calculations.monthlyPI)} (${calculations.piPercent.toFixed(1)}%)`}
                    />
                    <div
                      style={{ width: `${calculations.taxPercent}%` }}
                      className="bg-emerald-600 transition-all duration-300"
                      title={`Property Tax: ${formatCurrencyExact(calculations.monthlyTax)} (${calculations.taxPercent.toFixed(1)}%)`}
                    />
                    <div
                      style={{ width: `${calculations.insPercent}%` }}
                      className="bg-amber-500 transition-all duration-300"
                      title={`Homeowners Insurance: ${formatCurrencyExact(calculations.monthlyIns)} (${calculations.insPercent.toFixed(1)}%)`}
                    />
                    {calculations.pmiPercent > 0 && (
                      <div
                        style={{ width: `${calculations.pmiPercent}%` }}
                        className="bg-purple-600 transition-all duration-300"
                        title={`PMI: ${formatCurrencyExact(calculations.monthlyPmi)} (${calculations.pmiPercent.toFixed(1)}%)`}
                      />
                    )}
                  </div>

                  {/* Legend */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
                      <span className="text-secondary-text">P&I:</span>
                      <strong className="text-foreground ml-auto">{formatCurrency(calculations.monthlyPI)}</strong>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                      <span className="text-secondary-text">Taxes:</span>
                      <strong className="text-foreground ml-auto">{formatCurrency(calculations.monthlyTax)}</strong>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                      <span className="text-secondary-text">Ins:</span>
                      <strong className="text-foreground ml-auto">{formatCurrency(calculations.monthlyIns)}</strong>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-600 shrink-0" />
                      <span className="text-secondary-text">PMI:</span>
                      <strong className="text-foreground ml-auto">{formatCurrency(calculations.monthlyPmi)}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Key Loan Totals */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-card border border-border shadow-sm">
                <span className="text-xs font-medium text-secondary-text block">Principal Amount</span>
                <span className="text-xl font-bold text-foreground mt-0.5 block">
                  {formatCurrency(calculations.principal)}
                </span>
                <span className="text-[11px] text-secondary-text">
                  LTV: {(100 - calculations.downPctActual).toFixed(1)}%
                </span>
              </div>

              <div className="p-4 rounded-lg bg-card border border-border shadow-sm">
                <span className="text-xs font-medium text-secondary-text block">Total Interest Paid</span>
                <span className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5 block">
                  {formatCurrency(calculations.totalInterestPaid)}
                </span>
                <span className="text-[11px] text-secondary-text">
                  Over {calculations.termYears} years
                </span>
              </div>

              <div className="p-4 rounded-lg bg-card border border-border shadow-sm col-span-2 sm:col-span-1">
                <span className="text-xs font-medium text-secondary-text block">Total Loan Outlay</span>
                <span className="text-xl font-bold text-foreground mt-0.5 block">
                  {formatCurrency(calculations.totalCostOfLoan)}
                </span>
                <span className="text-[11px] text-secondary-text">Principal, Interest & Taxes</span>
              </div>
            </div>

            {/* Quick Insights Box */}
            <div className="p-4 rounded-lg bg-muted/40 border border-border text-sm text-secondary-text flex items-start gap-3">
              <PieChart className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="text-foreground">Payment Summary: </strong>
                Over the {calculations.termYears}-year term, you will repay{" "}
                <span className="text-foreground font-semibold">{formatCurrency(calculations.principal)}</span> in principal plus{" "}
                <span className="text-foreground font-semibold">{formatCurrency(calculations.totalInterestPaid)}</span> in finance interest. Total interest represents{" "}
                <span className="text-foreground font-semibold">
                  {calculations.principal > 0
                    ? ((calculations.totalInterestPaid / calculations.principal) * 100).toFixed(0)
                    : 0}
                  %
                </span>{" "}
                of the initial borrowed loan amount.
              </div>
            </div>
          </div>
        </div>

        {/* Amortization Schedule Section */}
        <Card className="shadow-sm border border-border">
          <CardHeader className="p-6 pb-4 border-b border-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-primary" />
                  Amortization Schedule
                </CardTitle>
                <p className="text-sm text-secondary-text mt-1">
                  Complete repayment schedule showing principal reduction and interest amortized over time.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Schedule View Selector */}
                <div className="flex items-center p-1 bg-muted rounded-lg border border-border">
                  <button
                    type="button"
                    onClick={() => setScheduleView("yearly")}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                      scheduleView === "yearly"
                        ? "bg-card text-foreground shadow-sm"
                        : "text-secondary-text hover:text-foreground"
                    }`}
                  >
                    Annual Breakdown
                  </button>
                  <button
                    type="button"
                    onClick={() => setScheduleView("monthly")}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                      scheduleView === "monthly"
                        ? "bg-card text-foreground shadow-sm"
                        : "text-secondary-text hover:text-foreground"
                    }`}
                  >
                    Monthly Breakdown
                  </button>
                </div>

                {/* CSV Download Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportCSV}
                  className="text-xs h-8 gap-1.5"
                  title="Download Amortization Table as CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </Button>
              </div>
            </div>

            {/* Year Selector Filter when in Monthly View */}
            {scheduleView === "monthly" && (
              <div className="flex items-center gap-2 pt-3 flex-wrap">
                <span className="text-xs font-medium text-secondary-text">Filter Year:</span>
                <select
                  value={selectedScheduleYear}
                  onChange={(e) =>
                    setSelectedScheduleYear(e.target.value === "all" ? "all" : Number(e.target.value))
                  }
                  className="h-8 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="all">All {calculations.yearlySchedule.length} Years (360 Months)</option>
                  {calculations.yearlySchedule.map((yr) => (
                    <option key={yr.year} value={yr.year}>
                      Year {yr.year} (Months {(yr.year - 1) * 12 + 1}–{Math.min(calculations.totalMonths, yr.year * 12)})
                    </option>
                  ))}
                </select>
                <span className="text-xs text-secondary-text">
                  Showing {visibleMonthlyRecords.length} monthly installments
                </span>
              </div>
            )}
          </CardHeader>

          <CardContent className="p-0">
            {/* Table Container with smooth scrolling */}
            <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/70 sticky top-0 z-10 border-b border-border text-secondary-text text-xs uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">
                      {scheduleView === "yearly" ? "Year" : "Month / Date"}
                    </th>
                    <th className="py-3 px-4 text-right">Beginning Balance</th>
                    <th className="py-3 px-4 text-right">Principal Paid</th>
                    <th className="py-3 px-4 text-right">Interest Paid</th>
                    <th className="py-3 px-4 text-right">Total Payment</th>
                    <th className="py-3 px-4 sm:px-6 text-right">Ending Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {scheduleView === "yearly" ? (
                    calculations.yearlySchedule.map((row) => (
                      <tr key={row.year} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4 sm:px-6 font-medium text-foreground">
                          Year {row.year}
                        </td>
                        <td className="py-3 px-4 text-right text-secondary-text">
                          {formatCurrencyExact(row.startBalance)}
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-blue-600 dark:text-blue-400">
                          {formatCurrencyExact(row.principalPaid)}
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-amber-600 dark:text-amber-400">
                          {formatCurrencyExact(row.interestPaid)}
                        </td>
                        <td className="py-3 px-4 text-right text-secondary-text">
                          {formatCurrencyExact(row.totalPaid)}
                        </td>
                        <td className="py-3 px-4 sm:px-6 text-right font-semibold text-foreground">
                          {formatCurrencyExact(row.endBalance)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    visibleMonthlyRecords.map((row) => (
                      <tr key={row.month} className="hover:bg-muted/30 transition-colors">
                        <td className="py-2.5 px-4 sm:px-6 font-medium text-foreground text-xs">
                          Month {row.month} <span className="text-secondary-text font-normal">(Yr {row.year})</span>
                        </td>
                        <td className="py-2.5 px-4 text-right text-secondary-text text-xs">
                          {formatCurrencyExact(row.startBalance)}
                        </td>
                        <td className="py-2.5 px-4 text-right font-medium text-blue-600 dark:text-blue-400 text-xs">
                          {formatCurrencyExact(row.principalPayment)}
                        </td>
                        <td className="py-2.5 px-4 text-right font-medium text-amber-600 dark:text-amber-400 text-xs">
                          {formatCurrencyExact(row.interestPayment)}
                        </td>
                        <td className="py-2.5 px-4 text-right text-secondary-text text-xs">
                          {formatCurrencyExact(row.totalPayment)}
                        </td>
                        <td className="py-2.5 px-4 sm:px-6 text-right font-semibold text-foreground text-xs">
                          {formatCurrencyExact(row.endBalance)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </CalculatorLayout>
  );
}
