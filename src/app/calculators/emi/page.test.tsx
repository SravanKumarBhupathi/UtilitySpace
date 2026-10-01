import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EMICalculator from './page';

// Mock the components that might use features not supported in jsdom
jest.mock('@/components/calculator-layout', () => {
  return {
    CalculatorLayout: ({ children, title }: { children: React.ReactNode, title: string }) => (
      <div data-testid="calculator-layout" aria-label={title}>
        {children}
      </div>
    ),
  };
});

describe('EMICalculator', () => {
  it('renders initial form correctly', () => {
    render(<EMICalculator />);

    expect(screen.getByText('Loan Amount')).toBeInTheDocument();
    expect(screen.getByText('Interest Rate (% P.A.)')).toBeInTheDocument();
    expect(screen.getByText('Loan Tenure (Years)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Calculate EMI' })).toBeInTheDocument();

    // Result section should not be visible initially
    expect(screen.queryByText('Monthly EMI')).not.toBeInTheDocument();
  });

  it('calculates EMI correctly with valid inputs', () => {
    render(<EMICalculator />);

    // Inputs
    const amountInput = screen.getByLabelText('Loan Amount');
    const rateInput = screen.getByLabelText('Interest Rate (% P.A.)');
    const tenureInput = screen.getByLabelText('Loan Tenure (Years)');

    fireEvent.change(amountInput, { target: { value: '100000' } });
    fireEvent.change(rateInput, { target: { value: '10' } });
    fireEvent.change(tenureInput, { target: { value: '5' } });

    // Calculate
    fireEvent.click(screen.getByRole('button', { name: 'Calculate EMI' }));

    // Assert results
    // Principal = 100000
    // Rate = 10% / year = 10 / 12 / 100 per month = 0.008333...
    // Tenure = 5 years = 60 months
    // EMI = (100000 * 0.008333 * (1 + 0.008333)^60) / ((1 + 0.008333)^60 - 1)
    // EMI ≈ 2124.70
    // Total Payment = 2124.70 * 60 = 127482.27
    // Total Interest = 127482.27 - 100000 = 27482.27

    expect(screen.getByText('Monthly EMI')).toBeInTheDocument();
    expect(screen.getByText('2124.70')).toBeInTheDocument();
    expect(screen.getByText('Total Interest')).toBeInTheDocument();
    expect(screen.getByText('27482.27')).toBeInTheDocument();
    expect(screen.getByText('Total Payment')).toBeInTheDocument();
    expect(screen.getByText('127482.27')).toBeInTheDocument();
  });

  it('does not calculate or show results for invalid inputs', () => {
    render(<EMICalculator />);

    const amountInput = screen.getByLabelText('Loan Amount');
    const rateInput = screen.getByLabelText('Interest Rate (% P.A.)');

    // Missing tenure
    fireEvent.change(amountInput, { target: { value: '100000' } });
    fireEvent.change(rateInput, { target: { value: '10' } });

    fireEvent.click(screen.getByRole('button', { name: 'Calculate EMI' }));

    expect(screen.queryByText('Monthly EMI')).not.toBeInTheDocument();
  });

  it('clears form and results when reset is clicked', () => {
    render(<EMICalculator />);

    // Fill form and calculate
    const amountInput = screen.getByLabelText('Loan Amount');
    const rateInput = screen.getByLabelText('Interest Rate (% P.A.)');
    const tenureInput = screen.getByLabelText('Loan Tenure (Years)');

    fireEvent.change(amountInput, { target: { value: '100000' } });
    fireEvent.change(rateInput, { target: { value: '10' } });
    fireEvent.change(tenureInput, { target: { value: '5' } });

    fireEvent.click(screen.getByRole('button', { name: 'Calculate EMI' }));

    // Verify result is shown
    expect(screen.getByText('Monthly EMI')).toBeInTheDocument();

    // Click reset
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));

    // Verify inputs are cleared
    expect(amountInput).toHaveValue(null);
    expect(rateInput).toHaveValue(null);
    expect(tenureInput).toHaveValue(null);

    // Verify results are hidden
    expect(screen.queryByText('Monthly EMI')).not.toBeInTheDocument();
  });
});
