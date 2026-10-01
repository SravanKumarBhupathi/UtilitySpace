import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CaseConverter from './page';

// Mock ToolLayout and Button to isolate the page component
jest.mock('@/components/tool-layout', () => ({
  ToolLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="tool-layout">{children}</div>,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

describe('CaseConverter Component', () => {
  beforeEach(() => {
    // Clear clipboard mock before each test
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(),
      },
    });
  });

  test('renders correctly', () => {
    render(<CaseConverter />);
    expect(screen.getByPlaceholderText(/Type or paste your text here to convert/i)).toBeInTheDocument();
  });

  test('converts to UPPERCASE', async () => {
    render(<CaseConverter />);
    const textarea = screen.getByPlaceholderText(/Type or paste your text here to convert/i);

    await userEvent.type(textarea, 'hello world');
    expect(textarea).toHaveValue('hello world');

    const uppercaseBtn = screen.getByText('UPPERCASE');
    fireEvent.click(uppercaseBtn);

    expect(textarea).toHaveValue('HELLO WORLD');
  });

  test('converts to lowercase', async () => {
    render(<CaseConverter />);
    const textarea = screen.getByPlaceholderText(/Type or paste your text here to convert/i);

    await userEvent.type(textarea, 'HELLO WORLD');

    const lowercaseBtn = screen.getByText('lowercase');
    fireEvent.click(lowercaseBtn);

    expect(textarea).toHaveValue('hello world');
  });

  test('converts to Title Case', async () => {
    render(<CaseConverter />);
    const textarea = screen.getByPlaceholderText(/Type or paste your text here to convert/i);

    await userEvent.type(textarea, 'this is a test sentence');

    const titleCaseBtn = screen.getByText('Title Case');
    fireEvent.click(titleCaseBtn);

    expect(textarea).toHaveValue('This Is A Test Sentence');
  });

  test('converts to Sentence case', async () => {
    render(<CaseConverter />);
    const textarea = screen.getByPlaceholderText(/Type or paste your text here to convert/i);

    await userEvent.type(textarea, 'this is a test. another test. wow.');

    const sentenceCaseBtn = screen.getByText('Sentence case');
    fireEvent.click(sentenceCaseBtn);

    expect(textarea).toHaveValue('This is a test. Another test. Wow.');
  });

  test('converts to aLtErNaTiNg cAsE', async () => {
    render(<CaseConverter />);
    const textarea = screen.getByPlaceholderText(/Type or paste your text here to convert/i);

    await userEvent.type(textarea, 'alternating');

    const alternatingCaseBtn = screen.getByText('aLtErNaTiNg cAsE');
    fireEvent.click(alternatingCaseBtn);

    expect(textarea).toHaveValue('aLtErNaTiNg');
  });

  test('clears text', async () => {
    render(<CaseConverter />);
    const textarea = screen.getByPlaceholderText(/Type or paste your text here to convert/i);

    await userEvent.type(textarea, 'some text to clear');

    const clearBtn = screen.getByText('Clear');
    fireEvent.click(clearBtn);

    expect(textarea).toHaveValue('');
  });

  test('copies to clipboard', async () => {
    render(<CaseConverter />);
    const textarea = screen.getByPlaceholderText(/Type or paste your text here to convert/i);

    await userEvent.type(textarea, 'text to copy');

    const copyBtn = screen.getByText('Copy');
    fireEvent.click(copyBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('text to copy');
  });
});
