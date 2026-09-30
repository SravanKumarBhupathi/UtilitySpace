import { Item } from "./types";

export const tools: Item[] = [
  {
    id: "image-compressor",
    title: "Image Compressor",
    description: "Reduce image file size without losing quality.",
    category: "Images",
    href: "/tools/image/compressor",
    icon: "ImageMinus",
    isPopular: true,
  },
  {
    id: "image-resizer",
    title: "Image Resizer",
    description: "Resize images to exact pixel dimensions.",
    category: "Images",
    href: "/tools/image/resizer",
    icon: "Maximize",
    isPopular: true,
  },
  {
    id: "word-counter",
    title: "Word Counter",
    description: "Count words, characters, and sentences in your text.",
    category: "Text",
    href: "/tools/text/word-counter",
    icon: "Type",
    isPopular: true,
  },
  {
    id: "case-converter",
    title: "Text Case Converter",
    description: "Convert text to UPPERCASE, lowercase, Title Case, etc.",
    category: "Text",
    href: "/tools/text/case-converter",
    icon: "CaseSensitive",
    isPopular: true,
  },
  {
    id: "json-formatter",
    title: "JSON Formatter",
    description: "Beautify and format JSON data for readability.",
    category: "Developer",
    href: "/tools/developer/json-formatter",
    icon: "Braces",
    isPopular: true,
  },
];
