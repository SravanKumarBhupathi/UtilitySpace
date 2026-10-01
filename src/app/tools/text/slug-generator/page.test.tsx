import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SlugGeneratorTool from './page';

describe('SlugGeneratorTool', () => {
  const setup = async () => {
    const user = userEvent.setup();
    render(<SlugGeneratorTool />);
    const input = screen.getByLabelText(/Original Text/i);
    const generateBtn = screen.getByRole('button', { name: /Generate Slug/i });
    return { user, input, generateBtn };
  };

  it('generates a basic slug', async () => {
    const { user, input, generateBtn } = await setup();
    await user.type(input, 'Hello World');
    await user.click(generateBtn);

    await waitFor(() => expect(screen.getByText('URL Slug')).toBeInTheDocument());
    const slugInput = screen.getAllByRole('textbox')[1];
    expect(slugInput).toHaveValue('hello-world');
  });

  it('removes accents and diacritics', async () => {
    const { user, input, generateBtn } = await setup();
    await user.type(input, 'Café & Résumé');
    await user.click(generateBtn);

    await waitFor(() => expect(screen.getByText('URL Slug')).toBeInTheDocument());
    const slugInput = screen.getAllByRole('textbox')[1];
    expect(slugInput).toHaveValue('cafe-resume');
  });

  it('handles multiple spaces', async () => {
    const { user, input, generateBtn } = await setup();
    await user.type(input, 'Multiple    Spaces');
    await user.click(generateBtn);

    await waitFor(() => expect(screen.getByText('URL Slug')).toBeInTheDocument());
    const slugInput = screen.getAllByRole('textbox')[1];
    expect(slugInput).toHaveValue('multiple-spaces');
  });

  it('removes special characters', async () => {
    const { user, input, generateBtn } = await setup();
    await user.type(input, 'Special !@#$%^&*() Chars');
    await user.click(generateBtn);

    await waitFor(() => expect(screen.getByText('URL Slug')).toBeInTheDocument());
    const slugInput = screen.getAllByRole('textbox')[1];
    expect(slugInput).toHaveValue('special-chars');
  });

  it('trims leading and trailing spaces', async () => {
    const { user, input, generateBtn } = await setup();
    await user.type(input, '  Trim me  ');
    await user.click(generateBtn);

    await waitFor(() => expect(screen.getByText('URL Slug')).toBeInTheDocument());
    const slugInput = screen.getAllByRole('textbox')[1];
    expect(slugInput).toHaveValue('trim-me');
  });

  it('removes multiple consecutive separators', async () => {
    const { user, input, generateBtn } = await setup();
    await user.type(input, 'Hello---World');
    await user.click(generateBtn);

    await waitFor(() => expect(screen.getByText('URL Slug')).toBeInTheDocument());
    const slugInput = screen.getAllByRole('textbox')[1];
    expect(slugInput).toHaveValue('hello-world');
  });

  it('uses underscore separator when selected', async () => {
    const { user, input, generateBtn } = await setup();

    const underscoreRadio = screen.getByLabelText(/Underscores/i);
    await user.click(underscoreRadio);

    await user.type(input, 'Hello World Again');
    await user.click(generateBtn);

    await waitFor(() => expect(screen.getByText('URL Slug')).toBeInTheDocument());
    const slugInput = screen.getAllByRole('textbox')[1];
    expect(slugInput).toHaveValue('hello_world_again');
  });

  it('clears input and output when clear is clicked', async () => {
    const { user, input, generateBtn } = await setup();
    await user.type(input, 'To Be Cleared');
    await user.click(generateBtn);

    await waitFor(() => expect(screen.getByText('URL Slug')).toBeInTheDocument());

    const clearBtn = screen.getByRole('button', { name: /Clear/i });
    await user.click(clearBtn);

    expect(input).toHaveValue('');
    expect(screen.queryByText('URL Slug')).not.toBeInTheDocument();
  });
});
