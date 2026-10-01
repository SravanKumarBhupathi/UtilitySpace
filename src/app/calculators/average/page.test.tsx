import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AverageCalculator from "./page";

// Mock the CalculatorLayout to avoid rendering complex layout and Next.js specific things if any
jest.mock("@/components/calculator-layout", () => {
  return {
    CalculatorLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="calculator-layout">{children}</div>,
  };
});

// Since the component is a client component, and directly calls navigator.clipboard
// we can mock the entire clipboard globally
const mockWriteText = jest.fn();

beforeAll(() => {
  Object.defineProperty(global.navigator, 'clipboard', {
    value: { writeText: mockWriteText },
    writable: true,
    configurable: true
  });
});

afterAll(() => {
  Object.defineProperty(global.navigator, 'clipboard', {
    value: undefined,
    writable: true,
    configurable: true
  });
});


describe("AverageCalculator", () => {
  beforeEach(() => {
    mockWriteText.mockClear();
  });

  it("renders correctly", () => {
    render(<AverageCalculator />);
    expect(screen.getByLabelText(/Enter numbers/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Calculate/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Clear/i })).toBeInTheDocument();
  });

  it("shows an error when input is empty", async () => {
    const user = userEvent.setup();
    render(<AverageCalculator />);

    await user.click(screen.getByRole("button", { name: /Calculate/i }));

    expect(screen.getByText("Please enter some numbers")).toBeInTheDocument();
    expect(screen.queryByText(/Average \(Mean\)/i)).not.toBeInTheDocument();
  });

  it("shows an error when input only contains separators", async () => {
    const user = userEvent.setup();
    render(<AverageCalculator />);

    await user.type(screen.getByLabelText(/Enter numbers/i), "   ,,,  \n\n ");
    await user.click(screen.getByRole("button", { name: /Calculate/i }));

    expect(screen.getByText("Please enter some numbers")).toBeInTheDocument();
  });

  it("shows an error when input contains non-numeric values", async () => {
    const user = userEvent.setup();
    render(<AverageCalculator />);

    await user.type(screen.getByLabelText(/Enter numbers/i), "10, 20, abc, 30");
    await user.click(screen.getByRole("button", { name: /Calculate/i }));

    expect(screen.getByText(/Input contains invalid numbers/i)).toBeInTheDocument();
  });

  it("calculates correctly with comma separation", async () => {
    const user = userEvent.setup();
    render(<AverageCalculator />);

    await user.type(screen.getByLabelText(/Enter numbers/i), "10,20,30,40");
    await user.click(screen.getByRole("button", { name: /Calculate/i }));

    expect(screen.getAllByText("25")[0]).toBeInTheDocument(); // Average
    expect(screen.getAllByText("4")[0]).toBeInTheDocument(); // Count
    expect(screen.getAllByText("100")[0]).toBeInTheDocument(); // Sum
    expect(screen.getAllByText("10")[0]).toBeInTheDocument(); // Min
    expect(screen.getAllByText("40")[0]).toBeInTheDocument(); // Max
  });

  it("calculates correctly with space separation", async () => {
    const user = userEvent.setup();
    render(<AverageCalculator />);

    await user.type(screen.getByLabelText(/Enter numbers/i), "1 2 3 4 5");
    await user.click(screen.getByRole("button", { name: /Calculate/i }));

    expect(screen.getAllByText("3")[0]).toBeInTheDocument(); // Average
    expect(screen.getAllByText("5")[0]).toBeInTheDocument(); // Count
    expect(screen.getAllByText("15")[0]).toBeInTheDocument(); // Sum
    expect(screen.getAllByText("1")[0]).toBeInTheDocument(); // Min
    expect(screen.getAllByText("5")[1]).toBeInTheDocument(); // Max
  });

  it("calculates correctly with newline separation", async () => {
    const user = userEvent.setup();
    render(<AverageCalculator />);

    await user.type(screen.getByLabelText(/Enter numbers/i), "10\n20\n30");
    await user.click(screen.getByRole("button", { name: /Calculate/i }));

    expect(screen.getAllByText("20")[0]).toBeInTheDocument(); // Average
    expect(screen.getAllByText("3")[0]).toBeInTheDocument(); // Count
    expect(screen.getAllByText("60")[0]).toBeInTheDocument(); // Sum
    expect(screen.getAllByText("10")[0]).toBeInTheDocument(); // Min
    expect(screen.getAllByText("30")[0]).toBeInTheDocument(); // Max
  });

  it("calculates correctly with mixed separators", async () => {
    const user = userEvent.setup();
    render(<AverageCalculator />);

    await user.type(screen.getByLabelText(/Enter numbers/i), "5, 10\n15   ,20");
    await user.click(screen.getByRole("button", { name: /Calculate/i }));

    expect(screen.getAllByText("12.5")[0]).toBeInTheDocument(); // Average
    expect(screen.getAllByText("4")[0]).toBeInTheDocument(); // Count
    expect(screen.getAllByText("50")[0]).toBeInTheDocument(); // Sum
    expect(screen.getAllByText("5")[0]).toBeInTheDocument(); // Min
    expect(screen.getAllByText("20")[0]).toBeInTheDocument(); // Max
  });

  it("formats decimal average correctly and removes trailing zeros", async () => {
    const user = userEvent.setup();
    render(<AverageCalculator />);

    // 10 / 3 = 3.333333...
    await user.type(screen.getByLabelText(/Enter numbers/i), "10, 0, 0");
    await user.click(screen.getByRole("button", { name: /Calculate/i }));

    // Average should be 3.3333
    expect(screen.getAllByText("3.3333")[0]).toBeInTheDocument();
  });

  it("clears the input, result, and errors when Clear button is clicked", async () => {
    const user = userEvent.setup();
    render(<AverageCalculator />);

    const input = screen.getByLabelText(/Enter numbers/i);

    // Cause an error
    await user.type(input, "invalid");
    await user.click(screen.getByRole("button", { name: /Calculate/i }));
    expect(screen.getByText(/Input contains invalid numbers/i)).toBeInTheDocument();

    // Click clear
    await user.click(screen.getByRole("button", { name: /Clear/i }));

    // Verify error is gone and input is empty
    expect(screen.queryByText(/Input contains invalid numbers/i)).not.toBeInTheDocument();
    expect(input).toHaveValue("");

    // Calculate a valid result
    await user.type(input, "10, 20");
    await user.click(screen.getByRole("button", { name: /Calculate/i }));
    expect(screen.getAllByText("15")[0]).toBeInTheDocument(); // Average

    // Click clear again
    await user.click(screen.getByRole("button", { name: /Clear/i }));

    // Verify result is gone and input is empty
    expect(screen.queryByText("15")).not.toBeInTheDocument();
    expect(input).toHaveValue("");
  });
});
