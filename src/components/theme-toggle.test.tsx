import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "./theme-toggle";
import { useTheme } from "next-themes";

// Mock next-themes
jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}));

// Mock lucide-react icons for easier querying
jest.mock("lucide-react", () => ({
  Sun: () => <div data-testid="sun-icon">Sun Icon</div>,
  Moon: () => <div data-testid="moon-icon">Moon Icon</div>,
}));

describe("ThemeToggle", () => {
  const mockSetTheme = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a generic button initially (not mounted)", () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme,
    });

    const { container } = render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: "Toggle theme" });
    expect(button).toBeInTheDocument();
  });

  it("renders the Moon icon when the theme is light", () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);
    expect(screen.getByTestId("moon-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("sun-icon")).not.toBeInTheDocument();
  });

  it("renders the Sun icon when the theme is dark", () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: "dark",
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);
    expect(screen.getByTestId("sun-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("moon-icon")).not.toBeInTheDocument();
  });

  it("calls setTheme with 'dark' when clicked in light theme", () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: "Toggle theme" });
    fireEvent.click(button);
    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("calls setTheme with 'light' when clicked in dark theme", () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: "dark",
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: "Toggle theme" });
    fireEvent.click(button);
    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });
});
