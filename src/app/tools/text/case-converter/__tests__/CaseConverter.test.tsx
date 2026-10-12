import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import CaseConverter from '../page';

// Mock the ToolLayout to simplify testing
jest.mock('@/components/tool-layout', () => ({
  ToolLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="tool-layout">{children}</div>,
}));

describe('CaseConverter', () => {
  let originalClipboard: any;

  beforeAll(() => {
    // Note: The global setup in jest.setup.ts defines property clipboard.
    // We just override the writeText function here instead of redefining clipboard completely to avoid UserEvent conflicts.
    originalClipboard = global.navigator.clipboard;
  });

  afterAll(() => {
    // Restore
    Object.defineProperty(global.navigator, 'clipboard', {
      value: originalClipboard,
      configurable: true
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<CaseConverter />);
    expect(screen.getByTestId('tool-layout')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Type or paste your text here/i)).toBeInTheDocument();

    // Check buttons
    expect(screen.getByText('UPPERCASE')).toBeInTheDocument();
    expect(screen.getByText('lowercase')).toBeInTheDocument();
    expect(screen.getByText('Title Case')).toBeInTheDocument();
  });

  it('updates text when typed', () => {
    render(<CaseConverter />);
    const textarea = screen.getByPlaceholderText(/Type or paste your text here/i);

    fireEvent.change(textarea, { target: { value: 'hello world' } });
    expect(textarea).toHaveValue('hello world');
  });

  it('converts to uppercase', () => {
    render(<CaseConverter />);
    const textarea = screen.getByPlaceholderText(/Type or paste your text here/i);

    fireEvent.change(textarea, { target: { value: 'hello world' } });
    fireEvent.click(screen.getByText('UPPERCASE'));
    expect(textarea).toHaveValue('HELLO WORLD');
  });

  it('converts to lowercase', () => {
    render(<CaseConverter />);
    const textarea = screen.getByPlaceholderText(/Type or paste your text here/i);

    fireEvent.change(textarea, { target: { value: 'HELLO WORLD' } });
    fireEvent.click(screen.getByText('lowercase'));
    expect(textarea).toHaveValue('hello world');
  });

  it('converts to Title Case', () => {
    render(<CaseConverter />);
    const textarea = screen.getByPlaceholderText(/Type or paste your text here/i);

    fireEvent.change(textarea, { target: { value: 'hello world' } });
    fireEvent.click(screen.getByText('Title Case'));
    expect(textarea).toHaveValue('Hello World');
  });

  it('converts to Sentence case', () => {
    render(<CaseConverter />);
    const textarea = screen.getByPlaceholderText(/Type or paste your text here/i);

    fireEvent.change(textarea, { target: { value: 'hello world. how are you?' } });
    fireEvent.click(screen.getByText('Sentence case'));
    expect(textarea).toHaveValue('Hello world. How are you?');
  });

  it('converts to aLtErNaTiNg cAsE', () => {
    render(<CaseConverter />);
    const textarea = screen.getByPlaceholderText(/Type or paste your text here/i);

    fireEvent.change(textarea, { target: { value: 'hello world' } });
    fireEvent.click(screen.getByText('aLtErNaTiNg cAsE'));
    expect(textarea).toHaveValue('hElLo wOrLd');
  });

  it('converts to iNVERSE cASE', () => {
    render(<CaseConverter />);
    const textarea = screen.getByPlaceholderText(/Type or paste your text here/i);

    fireEvent.change(textarea, { target: { value: 'Hello World' } });
    fireEvent.click(screen.getByText('iNVERSE cASE'));
    expect(textarea).toHaveValue('hELLO wORLD');
  });

  it('converts to camelCase', () => {
    render(<CaseConverter />);
    const textarea = screen.getByPlaceholderText(/Type or paste your text here/i);

    fireEvent.change(textarea, { target: { value: 'hello world' } });
    fireEvent.click(screen.getByText('camelCase'));
    expect(textarea).toHaveValue('helloWorld');
  });

  it('converts to PascalCase', () => {
    render(<CaseConverter />);
    const textarea = screen.getByPlaceholderText(/Type or paste your text here/i);

    fireEvent.change(textarea, { target: { value: 'hello world' } });
    fireEvent.click(screen.getByText('PascalCase'));
    expect(textarea).toHaveValue('HelloWorld');
  });

  it('converts to snake_case', () => {
    render(<CaseConverter />);
    const textarea = screen.getByPlaceholderText(/Type or paste your text here/i);

    fireEvent.change(textarea, { target: { value: 'hello world' } });
    fireEvent.click(screen.getByText('snake_case'));
    expect(textarea).toHaveValue('hello_world');
  });

  it('handles clipboard copy error gracefully', async () => {
    // Mock clipboard writeText to throw an error
    const mockWriteText = jest.fn().mockRejectedValue(new Error('Clipboard error'));

    Object.defineProperty(global.navigator, 'clipboard', {
      value: {
        writeText: mockWriteText,
      },
      configurable: true
    });

    // Mock console.error to prevent it from cluttering the test output
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<CaseConverter />);
    const textarea = screen.getByPlaceholderText(/Type or paste your text here/i);

    fireEvent.change(textarea, { target: { value: 'text to copy' } });

    // Click the copy button
    const copyButton = screen.getByText('Copy');
    fireEvent.click(copyButton);

    // Verify writeText was called
    expect(mockWriteText).toHaveBeenCalledWith('text to copy');

    // Verify error was logged
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to copy text:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it('copy button is disabled when text is empty', () => {
    render(<CaseConverter />);
    const copyButton = screen.getByText('Copy').closest('button');
    expect(copyButton).toBeDisabled();
  });

  it('copies text successfully', async () => {
    const mockWriteText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(global.navigator, 'clipboard', {
      value: {
        writeText: mockWriteText,
      },
      configurable: true
    });

    render(<CaseConverter />);
    const textarea = screen.getByPlaceholderText(/Type or paste your text here/i);

    fireEvent.change(textarea, { target: { value: 'text to copy' } });

    const copyButton = screen.getByText('Copy');
    fireEvent.click(copyButton);

    expect(mockWriteText).toHaveBeenCalledWith('text to copy');

    // Wait for the button text to change to "Copied"
    expect(await screen.findByText('Copied')).toBeInTheDocument();
  });

  it('clears text', () => {
    render(<CaseConverter />);
    const textarea = screen.getByPlaceholderText(/Type or paste your text here/i);

    fireEvent.change(textarea, { target: { value: 'hello world' } });
    const clearButton = screen.getByText('Clear');
    fireEvent.click(clearButton);

    expect(textarea).toHaveValue('');
  });
});

describe('CaseConverter - Empty Text Edge Cases', () => {
  it('does not copy when text is empty and copyToClipboard is called directly', async () => {
    // For coverage of `if (!text) return;` inside copyToClipboard
    // Since the button is disabled, we'll enable it for the test
    const mockWriteText = jest.fn();
    Object.defineProperty(global.navigator, 'clipboard', {
      value: {
        writeText: mockWriteText,
      },
      configurable: true
    });

    render(<CaseConverter />);

    // Find the button and remove the disabled attribute so we can click it
    const copyButton = screen.getByText('Copy').closest('button');
    if (copyButton) {
      copyButton.removeAttribute('disabled');
      fireEvent.click(copyButton);
    }

    expect(mockWriteText).not.toHaveBeenCalled();
  });
});

describe('CaseConverter - setTimeout', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('resets copied state after timeout', async () => {
    const mockWriteText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(global.navigator, 'clipboard', {
      value: {
        writeText: mockWriteText,
      },
      configurable: true
    });

    render(<CaseConverter />);
    const textarea = screen.getByPlaceholderText(/Type or paste your text here/i);

    fireEvent.change(textarea, { target: { value: 'text to copy' } });

    const copyButton = screen.getByText('Copy');
    fireEvent.click(copyButton);

    // Should show "Copied" immediately
    expect(await screen.findByText('Copied')).toBeInTheDocument();

    // Fast forward the timer by 2000ms inside act
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Should revert to "Copy"
    expect(await screen.findByText('Copy')).toBeInTheDocument();
  });
});
