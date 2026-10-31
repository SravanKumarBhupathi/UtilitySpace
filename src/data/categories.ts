import { Category } from "./types";

export interface CategoryInfo {
  name: Category;
  description: string;
  icon: string;
}

export const toolCategories: CategoryInfo[] = [
  {
    name: "PDF",
    description: "Convert, merge, split and optimize PDF files.",
    icon: "FileText",
  },
  {
    name: "Images",
    description: "Resize, compress and convert images.",
    icon: "Image",
  },
  {
    name: "Text",
    description: "Format, transform and analyze text.",
    icon: "Type",
  },
  {
    name: "Developer",
    description: "Useful utilities for developers.",
    icon: "Code",
  },
  {
    name: "Student",
    description: "Tools designed for students.",
    icon: "GraduationCap",
  },
  {
    name: "Files",
    description: "Everyday file utilities and converters.",
    icon: "Files",
  },
];

export const blogCategories = [
  { name: "AI & Technology", slug: "ai-technology" },
  { name: "Career & Skills", slug: "career-skills" },
  { name: "Personal Finance", slug: "personal-finance" },
  { name: "Psychology & Productivity", slug: "psychology-productivity" },
  { name: "Digital Safety", slug: "digital-safety" },
  { name: "Education & Learning", slug: "education-learning" },
  { name: "Lifestyle & Personal Development", slug: "lifestyle" },
  { name: "General Knowledge", slug: "general-knowledge" }
];
