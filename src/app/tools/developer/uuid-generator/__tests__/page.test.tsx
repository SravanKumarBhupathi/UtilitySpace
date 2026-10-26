import { render, screen, fireEvent } from "@testing-library/react";
import UuidGenerator from "../page";
import '@testing-library/jest-dom';

// Mock ToolLayout
jest.mock("@/components/tool-layout", () => ({
  ToolLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="tool-layout">{children}</div>,
}));

describe("UuidGenerator", () => {
  let originalCrypto: any;

  beforeEach(() => {
    originalCrypto = global.crypto;
  });

  afterEach(() => {
    Object.defineProperty(global, "crypto", {
      value: originalCrypto,
      writable: true,
      configurable: true,
    });
  });

  it("should use crypto.randomUUID when available", () => {
    const mockRandomUUID = jest.fn().mockReturnValue("123e4567-e89b-12d3-a456-426614174000");

    Object.defineProperty(global, "crypto", {
      value: { randomUUID: mockRandomUUID },
      writable: true,
      configurable: true,
    });

    render(<UuidGenerator />);
    const generateBtn = screen.getByText("Generate 1");
    fireEvent.click(generateBtn);

    expect(mockRandomUUID).toHaveBeenCalled();
    expect(screen.getByText("123e4567-e89b-12d3-a456-426614174000")).toBeInTheDocument();
  });

  it("should fallback to crypto.getRandomValues when crypto.randomUUID is not available", () => {
    const mockGetRandomValues = jest.fn().mockImplementation((arr) => {
      arr[0] = 5; // mock some random value
      return arr;
    });

    Object.defineProperty(global, "crypto", {
      value: { getRandomValues: mockGetRandomValues },
      writable: true,
      configurable: true,
    });

    render(<UuidGenerator />);
    const generateBtn = screen.getByText("Generate 1");
    fireEvent.click(generateBtn);

    expect(mockGetRandomValues).toHaveBeenCalled();
    // The specific UUID will depend on the mocked getRandomValues
    // We just check it generates *something* in the UUID format
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    // Find the generated text
    const uuidElements = screen.getAllByText(uuidPattern);
    expect(uuidElements.length).toBeGreaterThan(0);
  });
});
