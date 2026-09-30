import { Item } from "./types";

export const calculators: Item[] = [
  {
    id: "percentage",
    title: "Percentage Calculator",
    description: "Calculate percentages quickly and accurately.",
    category: "Math",
    href: "/calculators/percentage",
    icon: "Percent",
    isPopular: true,
  },
  {
    id: "age",
    title: "Age Calculator",
    description: "Calculate exact age in years, months, and days.",
    category: "Time & Date",
    href: "/calculators/age",
    icon: "CalendarDays",
    isPopular: true,
  },
  {
    id: "discount",
    title: "Discount Calculator",
    description: "Find out the final price after a discount.",
    category: "Finance",
    href: "/calculators/discount",
    icon: "Tags",
    isPopular: true,
  },
  {
    id: "emi",
    title: "EMI Calculator",
    description: "Calculate Equated Monthly Installments for loans.",
    category: "Finance",
    href: "/calculators/emi",
    icon: "Calculator",
    isPopular: true,
  },
  {
    id: "gst",
    title: "GST Calculator",
    description: "Calculate Goods and Services Tax easily.",
    category: "Finance",
    href: "/calculators/gst",
    icon: "Receipt",
    isPopular: true,
  },
];
