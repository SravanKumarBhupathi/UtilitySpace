export type Category = "Finance" | "Math" | "Time & Date" | "Education" | "PDF" | "Images" | "Text" | "Developer" | "Student" | "Files" | "Everyday Technology" | "Computer Basics" | "Internet" | "Android" | "Windows" | "AI" | "Technology" | "Productivity";

export interface Item {
  id: string;
  title: string;
  description: string;
  category: Category;
  href: string;
  icon?: string;
  isPopular?: boolean;
}

export interface Article extends Item {
  readingTime: string;
  date: string;
}
