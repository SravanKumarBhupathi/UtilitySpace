export type Category = string;

export type ToolStatus = "active" | "coming-soon" | "beta";

export interface Item {
  id: string;
  title: string;
  description: string;
  category: Category;
  href: string;
  icon?: string;
  isPopular?: boolean;
  status?: ToolStatus;
  seoTitle?: string;
  seoDescription?: string;
  relatedTools?: string[];
  relatedGuides?: string[];
}

export interface Article extends Item {
  readingTime: string;
  date: string;
}
