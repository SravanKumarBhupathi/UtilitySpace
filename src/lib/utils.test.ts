import { cn } from "./utils"

describe("cn utility", () => {
  it("should merge tailwind classes properly", () => {
    // Tailwind specific merging (overriding same utility class)
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500")
    expect(cn("px-2 py-1", "p-4")).toBe("p-4")
  })

  it("should combine simple strings", () => {
    expect(cn("test-class", "another-class")).toBe("test-class another-class")
  })

  it("should conditionally apply classes based on boolean values", () => {
    expect(cn("test-class", true && "cond-class", false && "no-class")).toBe("test-class cond-class")
  })

  it("should handle conditional objects", () => {
    expect(cn("test-class", {
      "is-true": true,
      "is-false": false
    })).toBe("test-class is-true")
  })

  it("should handle arrays of classes", () => {
    expect(cn(["class1", "class2"], "class3")).toBe("class1 class2 class3")
  })

  it("should handle undefined and null values gracefully", () => {
    expect(cn("class1", undefined, null, "class2")).toBe("class1 class2")
  })
})
