import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PDFCompressorTool } from './pdf-compressor-tool';
import { compressPdf } from '@/lib/pdf-utils';

// Mock compressPdf
jest.mock('@/lib/pdf-utils', () => ({
  compressPdf: jest.fn(),
}));

// Mock URL.createObjectURL
beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => 'blob:test-url');
  global.URL.revokeObjectURL = jest.fn();
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('PDFCompressorTool Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles and displays errors from compressPdf', async () => {
    // Setup mock to throw error
    const errorMessage = 'Custom compression error';
    (compressPdf as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    render(<PDFCompressorTool />);

    // Create a mock PDF file
    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });

    // Select the file
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    Object.defineProperty(input, 'files', {
      value: [file]
    });
    fireEvent.change(input);

    // Wait for file to be loaded
    expect(screen.getByText('test.pdf')).toBeInTheDocument();

    // Click compress button
    const compressButton = screen.getByRole('button', { name: /compress pdf/i });
    fireEvent.click(compressButton);

    // Verify loading state
    expect(screen.getByRole('button', { name: /compressing/i })).toBeInTheDocument();

    // Wait for error to be displayed
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    // Verify loading state is reset
    expect(screen.queryByRole('button', { name: /compressing/i })).not.toBeInTheDocument();
  });

  it('displays default error message when error has no message', async () => {
    // Setup mock to throw error without message
    (compressPdf as jest.Mock).mockRejectedValueOnce({});

    render(<PDFCompressorTool />);

    // Create a mock PDF file
    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });

    // Select the file
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    Object.defineProperty(input, 'files', {
      value: [file]
    });
    fireEvent.change(input);

    // Click compress button
    const compressButton = screen.getByRole('button', { name: /compress pdf/i });
    fireEvent.click(compressButton);

    // Wait for default error message to be displayed
    await waitFor(() => {
      expect(screen.getByText('We couldn\'t compress this PDF. It might be corrupted or encrypted.')).toBeInTheDocument();
    });
  });
});
