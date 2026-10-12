import { render, screen, waitFor } from '@testing-library/react';
import WordCounter from '../page';
import userEvent from '@testing-library/user-event';

// Mock ToolLayout to avoid rendering complexity
jest.mock('@/components/tool-layout', () => {
  return {
    ToolLayout: ({ children, title }: { children: React.ReactNode, title: string }) => (
      <div data-testid="tool-layout">
        <h1>{title}</h1>
        {children}
      </div>
    )
  };
});

describe('WordCounter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component correctly', () => {
    render(<WordCounter />);
    expect(screen.getByText('Word Counter')).toBeInTheDocument();
  });

  it('accurately counts standard text inputs', async () => {
    const user = userEvent.setup();
    render(<WordCounter />);

    const textarea = screen.getByPlaceholderText('Type or paste your text here...');
    await user.type(textarea, 'Hello world. This is a test paragraph.\n\nThis is a second paragraph!');

    // Words: Hello, world, This, is, a, test, paragraph, This, is, a, second, paragraph (12)
    const wordCount = screen.getByText('Words').previousSibling?.textContent;
    expect(wordCount).toBe('12');

    // Sentences: Hello world. | This is a test paragraph. | This is a second paragraph! (3)
    // Checking exact DOM structure - the value is typically next to or preceded by the label
    expect(screen.getByText('Sentences').nextSibling?.textContent).toBe('3');

    // Paragraphs: 2
    expect(screen.getByText('Paragraphs').nextSibling?.textContent).toBe('2');
  });

  it('handles empty states correctly', async () => {
    render(<WordCounter />);

    const wordCount = screen.getByText('Words').previousSibling?.textContent;
    expect(wordCount).toBe('0');
    expect(screen.getByText('Sentences').nextSibling?.textContent).toBe('0');
    expect(screen.getByText('Paragraphs').nextSibling?.textContent).toBe('0');
    expect(screen.getByText('Characters (no spaces)').nextSibling?.textContent).toBe('0');
  });

  it('handles whitespace-only text appropriately', async () => {
    const user = userEvent.setup();
    render(<WordCounter />);

    const textarea = screen.getByPlaceholderText('Type or paste your text here...');
    await user.type(textarea, '   \n   \t  ');

    const wordCount = screen.getByText('Words').previousSibling?.textContent;
    expect(wordCount).toBe('0');
    expect(screen.getByText('Sentences').nextSibling?.textContent).toBe('0');
    expect(screen.getByText('Paragraphs').nextSibling?.textContent).toBe('0');
    expect(screen.getByText('Characters (no spaces)').nextSibling?.textContent).toBe('0');
  });

  it('correctly handles punctuation and edge cases', async () => {
    const user = userEvent.setup();
    render(<WordCounter />);

    const textarea = screen.getByPlaceholderText('Type or paste your text here...');
    // Type text and await it to fully populate
    await user.type(textarea, 'word-with-hyphen, word_with_underscore! What about... multiple dots?!');

    // Words: word-with-hyphen, word_with_underscore, What, about, multiple, dots (6)
    const wordCount = screen.getByText('Words').previousSibling?.textContent;
    expect(wordCount).toBe('6');

    // Sentences: word-with-hyphen, word_with_underscore! | What about... | multiple dots?! (3)
    expect(screen.getByText('Sentences').nextSibling?.textContent).toBe('3');
  });

  it('handles the clear functionality', async () => {
    const user = userEvent.setup();
    render(<WordCounter />);

    const textarea = screen.getByPlaceholderText('Type or paste your text here...');
    await user.type(textarea, 'Test text');

    // Verify text is present
    expect(textarea).toHaveValue('Test text');
    expect(screen.getByText('Words').previousSibling?.textContent).toBe('2');

    // Click clear button
    const clearButton = screen.getByTitle('Clear text');
    await user.click(clearButton);

    // Verify text is cleared
    expect(textarea).toHaveValue('');
    expect(screen.getByText('Words').previousSibling?.textContent).toBe('0');
  });

  it('handles clipboard copy error path', async () => {
    const user = userEvent.setup();

    // We must mock it after userEvent.setup() because userEvent sets up its own clipboard stub
    const writeTextMock = jest.fn().mockRejectedValue(new Error('Clipboard error'));

    // Access the clipboard object that userEvent attached to navigator, or original if it failed
    if (navigator.clipboard) {
      navigator.clipboard.writeText = writeTextMock;
    } else {
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true
      });
    }

    // Spy on console.error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<WordCounter />);

    // Add some text to enable the copy button
    const textarea = screen.getByPlaceholderText('Type or paste your text here...');
    await user.type(textarea, 'Test text');

    // Click copy button
    const copyButton = screen.getByTitle('Copy text');
    await user.click(copyButton);

    // Wait for console.error to be called
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to copy text:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
});
