import { render, screen, fireEvent } from "@testing-library/react";
import SlugGeneratorTool from "./page";

// Mock ToolLayout since it's a wrapper and might have other dependencies
jest.mock("@/components/tool-layout", () => ({
  ToolLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tool-layout">{children}</div>
  ),
}));

describe("SlugGeneratorTool", () => {
  it("renders correctly", () => {
    render(<SlugGeneratorTool />);
    expect(screen.getByLabelText(/Original Text/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: /Generate Slug/i })).toBeTruthy();
  });

  it("generates a basic slug", () => {
    render(<SlugGeneratorTool />);

    const input = screen.getByLabelText(/Original Text/i);
    fireEvent.change(input, { target: { value: "This is a Great Title for a Blog Post!" } });

    const generateBtn = screen.getByRole("button", { name: /Generate Slug/i });
    fireEvent.click(generateBtn);

    const slugInput = screen.getByDisplayValue("this-is-a-great-title-for-a-blog-post");
    expect(slugInput).toBeTruthy();
  });

  it("handles accented characters", () => {
    render(<SlugGeneratorTool />);

    const input = screen.getByLabelText(/Original Text/i);
    fireEvent.change(input, { target: { value: "Café au lait and piñata" } });

    const generateBtn = screen.getByRole("button", { name: /Generate Slug/i });
    fireEvent.click(generateBtn);

    const slugInput = screen.getByDisplayValue("cafe-au-lait-and-pinata");
    expect(slugInput).toBeTruthy();
  });

  it("removes special characters and punctuation", () => {
    render(<SlugGeneratorTool />);

    const input = screen.getByLabelText(/Original Text/i);
    fireEvent.change(input, { target: { value: "Hello, World! @#$%^&*()_+={}|[]\\:\";'<>?,./" } });

    const generateBtn = screen.getByRole("button", { name: /Generate Slug/i });
    fireEvent.click(generateBtn);

    // Note the current regex keeps `_` and `-` because they are `\w` or explicitly allowed
    const slugInput = screen.getByDisplayValue("hello-world-_");
    expect(slugInput).toBeTruthy();
  });

  it("removes multiple spaces", () => {
    render(<SlugGeneratorTool />);

    const input = screen.getByLabelText(/Original Text/i);
    fireEvent.change(input, { target: { value: "Multiple   spaces   here" } });

    const generateBtn = screen.getByRole("button", { name: /Generate Slug/i });
    fireEvent.click(generateBtn);

    const slugInput = screen.getByDisplayValue("multiple-spaces-here");
    expect(slugInput).toBeTruthy();
  });

  it("uses underscore separator when selected", () => {
    render(<SlugGeneratorTool />);

    const input = screen.getByLabelText(/Original Text/i);
    fireEvent.change(input, { target: { value: "This is a test" } });

    const underscoreRadio = screen.getByRole("radio", { name: /Underscores/i });
    fireEvent.click(underscoreRadio);

    const generateBtn = screen.getByRole("button", { name: /Generate Slug/i });
    fireEvent.click(generateBtn);

    const slugInput = screen.getByDisplayValue("this_is_a_test");
    expect(slugInput).toBeTruthy();
  });

  it("trims leading and trailing whitespace", () => {
    render(<SlugGeneratorTool />);

    const input = screen.getByLabelText(/Original Text/i);
    fireEvent.change(input, { target: { value: "  lots of space  " } });

    const generateBtn = screen.getByRole("button", { name: /Generate Slug/i });
    fireEvent.click(generateBtn);

    const slugInput = screen.getByDisplayValue("lots-of-space");
    expect(slugInput).toBeTruthy();
  });
});
