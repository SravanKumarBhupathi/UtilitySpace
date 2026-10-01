import React from 'react';
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DiscountCalculator from "./page";

// Mock the CalculatorLayout to avoid rendering complex nested components in unit tests
jest.mock("@/components/calculator-layout", () => ({
  CalculatorLayout: ({ children, title }: { children: React.ReactNode; title: string }) => (
    <div data-testid="calculator-layout" data-title={title}>
      {children}
    </div>
  ),
}));

describe("DiscountCalculator", () => {
  it("renders the calculator correctly", () => {
    render(<DiscountCalculator />);
    expect(screen.getByText("Original Price")).toBeInTheDocument();
    expect(screen.getByText("Discount Percentage")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Calculate Discount" })).toBeInTheDocument();
  });

  it("calculates the discount correctly for valid inputs", async () => {
    render(<DiscountCalculator />);

    const user = userEvent.setup();
    const priceInput = screen.getByLabelText("Original Price");
    const discountInput = screen.getByLabelText("Discount Percentage");
    const calculateButton = screen.getByRole("button", { name: "Calculate Discount" });

    await user.type(priceInput, "100");
    await user.type(discountInput, "20");
    await user.click(calculateButton);

    expect(screen.getByText("Final Price")).toBeInTheDocument();
    expect(screen.getByText("$80.00")).toBeInTheDocument();
    expect(screen.getByText("You Save")).toBeInTheDocument();
    expect(screen.getByText("$20.00")).toBeInTheDocument();
  });

  it("calculates with decimals correctly", async () => {
    render(<DiscountCalculator />);

    const user = userEvent.setup();
    const priceInput = screen.getByLabelText("Original Price");
    const discountInput = screen.getByLabelText("Discount Percentage");
    const calculateButton = screen.getByRole("button", { name: "Calculate Discount" });

    await user.type(priceInput, "49.99");
    await user.type(discountInput, "15");
    await user.click(calculateButton);

    expect(screen.getByText("Final Price")).toBeInTheDocument();
    expect(screen.getByText("$42.49")).toBeInTheDocument();
    expect(screen.getByText("You Save")).toBeInTheDocument();
    expect(screen.getByText("$7.50")).toBeInTheDocument();
  });

  it("shows nothing when calculating with empty inputs", async () => {
    render(<DiscountCalculator />);

    const user = userEvent.setup();
    const calculateButton = screen.getByRole("button", { name: "Calculate Discount" });

    await user.click(calculateButton);

    expect(screen.queryByText("Final Price")).not.toBeInTheDocument();
  });

  it("shows nothing when calculating with invalid inputs", async () => {
    render(<DiscountCalculator />);

    const user = userEvent.setup();
    const priceInput = screen.getByLabelText("Original Price");
    const calculateButton = screen.getByRole("button", { name: "Calculate Discount" });

    // Only filling price, not discount
    await user.type(priceInput, "100");
    await user.click(calculateButton);

    expect(screen.queryByText("Final Price")).not.toBeInTheDocument();
  });

  it("resets the form correctly", async () => {
    render(<DiscountCalculator />);

    const user = userEvent.setup();
    const priceInput = screen.getByLabelText("Original Price");
    const discountInput = screen.getByLabelText("Discount Percentage");
    const calculateButton = screen.getByRole("button", { name: "Calculate Discount" });

    await user.type(priceInput, "100");
    await user.type(discountInput, "20");
    await user.click(calculateButton);

    expect(screen.getByText("$80.00")).toBeInTheDocument();

    const resetButton = screen.getByRole("button", { name: "Reset" });
    await user.click(resetButton);

    // After reset, results should be hidden
    expect(screen.queryByText("Final Price")).not.toBeInTheDocument();

    // Inputs should be empty
    expect(priceInput).toHaveValue(null);
    expect(discountInput).toHaveValue(null);
  });
});
