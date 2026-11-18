"use client";

import { useState } from "react";
import { CalculatorLayout } from "@/components/calculator-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function GSTCalculator() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("18");
  const [mode, setMode] = useState<"add" | "remove">("add");
  const [result, setResult] = useState<{
    netPrice: number;
    gstAmount: number;
    totalAmount: number;
    cgst: number;
    sgst: number;
  } | null>(null);

  const GST_SLABS = [5, 12, 18, 28];

  const calculate = () => {
    const amt = parseFloat(amount);
    const gstRate = parseFloat(rate);

    if (!isNaN(amt) && !isNaN(gstRate) && amt >= 0 && gstRate >= 0) {
      if (mode === "add") {
        const gstAmount = (amt * gstRate) / 100;
        const totalAmount = amt + gstAmount;
        setResult({
          netPrice: amt,
          gstAmount,
          totalAmount,
          cgst: gstAmount / 2,
          sgst: gstAmount / 2,
        });
      } else {
        const netPrice = amt / (1 + (gstRate / 100));
        const gstAmount = amt - netPrice;
        setResult({
          netPrice,
          gstAmount,
          totalAmount: amt,
          cgst: gstAmount / 2,
          sgst: gstAmount / 2,
        });
      }
    } else {
      setResult(null);
    }
  };

  const reset = () => {
    setAmount("");
    setRate("18");
    setResult(null);
  };

  const howToSteps = [
    "Enter the initial transaction value (Net price or Total gross invoice amount) into the Amount input field.",
    "Select a standard GST slab button (5%, 12%, 18%, or 28%), or enter a custom tax rate in the GST Rate (%) field.",
    "Select your calculation mode: 'Add GST' (GST Exclusive: calculates tax added on top of your net price) or 'Remove GST' (GST Inclusive: extracts tax already embedded inside the gross amount).",
    "Click 'Calculate' to see the exact breakdown of Net Price, total GST amount, equal CGST/SGST intrastate split, and Total Gross Price.",
  ];

  const faqs = [
    {
      question: "What is the difference between CGST, SGST, and IGST?",
      answer: "Under the Goods and Services Tax (GST) system, taxes are classified according to location: CGST (Central Goods and Services Tax) is collected by the central government on intrastate transactions (buyer and seller in the same state). SGST (State Goods and Services Tax) is collected by the state government on intrastate sales. In every intrastate sale, total GST is divided equally between CGST and SGST (for instance, an 18% slab splits into 9% CGST and 9% SGST). IGST (Integrated Goods and Services Tax) is levied on interstate transactions (across state borders) and shared between central and state governments.",
    },
    {
      question: "What is the formula for reverse (inclusive) GST?",
      answer: "When a price already includes GST and you need to find the pre-tax base price, use the formula: Net Base Price = Total Amount / (1 + (GST Rate / 100)). To find the tax component alone: GST Amount = Total Amount - Net Base Price, or GST Amount = Total Amount × [GST Rate / (100 + GST Rate)].",
    },
    {
      question: "What is the difference between GST Inclusive and GST Exclusive pricing?",
      answer: "GST Exclusive means the price displayed does not yet include tax; GST is calculated and added on top of the net price during checkout (Total = Net + GST). GST Inclusive means the displayed price already includes the applicable tax amount, typical for consumer retail goods and restaurant menus.",
    },
    {
      question: "What are the common GST tax slabs?",
      answer: "Most goods and services are classified into five standard GST tiers: 0% (unprocessed grains, fresh milk, vegetables), 5% (packaged food, domestic transport, essential medicines), 12% (business software, cell phones, processed food), 18% (IT services, financial services, standard electronics), and 28% (luxury vehicles, high-end electronics, tobacco, aerated drinks).",
    },
  ];

  const formulaExplanation = "GST Calculation Formulas:\n\n1. GST Exclusive (Add GST to Net Price):\n• GST Amount = (Net Amount × GST Rate) / 100\n• Total Gross Price = Net Amount + GST Amount\n• CGST (Central Tax) = GST Amount / 2\n• SGST (State Tax) = GST Amount / 2\n\n2. GST Inclusive (Remove / Reverse GST from Gross Price):\n• Net Base Price = Total Amount / (1 + (GST Rate / 100))\n• GST Amount = Total Amount - Net Base Price = Total Amount × [GST Rate / (100 + GST Rate)]\n• CGST = GST Amount / 2\n• SGST = GST Amount / 2";

  return (
    <CalculatorLayout
      title="GST Calculator"
      description="Calculate Goods and Services Tax (GST) inclusive and exclusive amounts, CGST, and SGST breakdowns easily."
      howToSteps={howToSteps}
      faqs={faqs}
      formulaExplanation={formulaExplanation}
    >
      <Card className="shadow-md">
        <CardContent className="p-6 md:p-8">
          <div className="space-y-6">
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  checked={mode === "add"}
                  onChange={() => setMode("add")}
                  className="accent-primary w-4 h-4"
                />
                <span className="text-sm font-medium">Add GST (Exclusive)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  checked={mode === "remove"}
                  onChange={() => setMode("remove")}
                  className="accent-primary w-4 h-4"
                />
                <span className="text-sm font-medium">Remove GST (Inclusive)</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="amount">{mode === "add" ? "Net Initial Amount" : "Total Gross Amount"}</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="1000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="rate">GST Rate (%)</Label>
                  <div className="flex gap-1">
                    {GST_SLABS.map((slab) => (
                      <button
                        key={slab}
                        type="button"
                        onClick={() => setRate(slab.toString())}
                        className={`text-xs px-2 py-0.5 rounded border transition-colors ${
                          rate === slab.toString()
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted text-secondary-text hover:text-foreground border-border"
                        }`}
                      >
                        {slab}%
                      </button>
                    ))}
                  </div>
                </div>
                <Input
                  id="rate"
                  type="number"
                  placeholder="18"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={calculate} className="w-full md:w-auto">Calculate</Button>

            {result && (
              <div className="p-6 bg-muted/50 rounded-lg border border-border mt-8 text-center animate-in fade-in zoom-in-95 duration-200 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col items-center p-4 bg-background rounded-md border border-border">
                    <p className="text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1">Net Price</p>
                    <div className="text-xl md:text-2xl font-heading font-bold text-foreground">
                      ₹{result.netPrice.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-background rounded-md border border-border">
                    <p className="text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1">Total GST Amount</p>
                    <div className="text-xl md:text-2xl font-heading font-bold text-foreground">
                      ₹{result.gstAmount.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-background rounded-md border border-border">
                    <p className="text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1">Total Gross Amount</p>
                    <div className="text-xl md:text-2xl font-heading font-bold text-primary">
                      ₹{result.totalAmount.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* CGST / SGST Intrastate Tax Breakdown */}
                <div className="p-4 bg-card rounded-md border border-border flex flex-col sm:flex-row justify-around gap-4 text-sm">
                  <div>
                    <span className="text-secondary-text font-medium">CGST (Central): </span>
                    <span className="font-semibold text-foreground">₹{result.cgst.toFixed(2)} ({(parseFloat(rate) / 2 || 0)}%)</span>
                  </div>
                  <div>
                    <span className="text-secondary-text font-medium">SGST (State): </span>
                    <span className="font-semibold text-foreground">₹{result.sgst.toFixed(2)} ({(parseFloat(rate) / 2 || 0)}%)</span>
                  </div>
                </div>

                <div>
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
