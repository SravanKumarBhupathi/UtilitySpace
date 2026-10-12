import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RemoveSpacesTool from './page';

describe('RemoveSpacesTool', () => {
  let originalClipboard: any;
  let writeTextMock: jest.Mock;

  beforeAll(() => {
    originalClipboard = navigator.clipboard;
    writeTextMock = jest.fn();

    // Assign instead of defineProperty which can be problematic in jest
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });
  });

  afterAll(() => {
    Object.assign(navigator, {
      clipboard: originalClipboard,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    writeTextMock.mockClear();
  });

  it('renders correctly', () => {
    render(<RemoveSpacesTool />);
    expect(screen.getAllByText('Clean Text').length).toBeGreaterThan(0);
  });

  it('handles copy error gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Setup mock to reject
    writeTextMock.mockRejectedValueOnce(new Error('Clipboard error'));

    render(<RemoveSpacesTool />);

    const textarea = screen.getByPlaceholderText('Paste your messy text here...');

    fireEvent.change(textarea, { target: { value: 'Some text to copy' } });

    // Check that button is not disabled
    const copyButton = screen.getByTitle('Copy text');
    expect(copyButton).not.toBeDisabled();

    // Click the button using act since it triggers an async state update
    await act(async () => {
      fireEvent.click(copyButton);
    });

    expect(writeTextMock).toHaveBeenCalledWith('Some text to copy');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to copy text:', expect.any(Error));

    consoleErrorSpy.mockRestore();
  });

  it('successfully copies text', async () => {
    // Setup mock to resolve
    writeTextMock.mockResolvedValueOnce(undefined);

    render(<RemoveSpacesTool />);

    const textarea = screen.getByPlaceholderText('Paste your messy text here...');

    fireEvent.change(textarea, { target: { value: 'Some text to copy' } });

    const copyButton = screen.getByTitle('Copy text');

    await act(async () => {
      fireEvent.click(copyButton);
    });

    expect(writeTextMock).toHaveBeenCalledWith('Some text to copy');

    await waitFor(() => {
      expect(screen.getByText('Copied')).toBeInTheDocument();
    });
  });

  it('does not copy if text is empty', async () => {
    render(<RemoveSpacesTool />);

    const copyButton = screen.getByTitle('Copy text');
    expect(copyButton).toBeDisabled();

    // Even if we try to click it
    fireEvent.click(copyButton);

    expect(writeTextMock).not.toHaveBeenCalled();
  });

  it('clears text correctly', async () => {
    render(<RemoveSpacesTool />);

    const textarea = screen.getByPlaceholderText('Paste your messy text here...');

    fireEvent.change(textarea, { target: { value: 'Some text to clear' } });
    expect(textarea).toHaveValue('Some text to clear');

    const clearButton = screen.getByTitle('Clear text');

    await act(async () => {
      fireEvent.click(clearButton);
    });

    expect(textarea).toHaveValue('');
  });

  it('processes text correctly', async () => {
    render(<RemoveSpacesTool />);

    const textarea = screen.getByPlaceholderText('Paste your messy text here...');

    fireEvent.change(textarea, { target: { value: 'Line 1\n\nLine 2   has   spaces' } });

    const cleanButton = screen.getByRole('button', { name: /Clean Text/i });

    await act(async () => {
      fireEvent.click(cleanButton);
    });

    expect(textarea).toHaveValue('Line 1\nLine 2 has spaces');
  });

});
