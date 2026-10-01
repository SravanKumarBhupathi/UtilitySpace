export interface AgeResult {
  years: number;
  months: number;
  days: number;
}

export function calculateAge(dobStr: string, targetDateStr: string): AgeResult {
  const d1 = new Date(dobStr);
  const d2 = new Date(targetDateStr);

  if (d1 > d2) {
    throw new Error("Date of birth must be before target date");
  }

  let years = d2.getFullYear() - d1.getFullYear();
  let months = d2.getMonth() - d1.getMonth();
  let days = d2.getDate() - d1.getDate();

  if (days < 0) {
    months -= 1;
    // Get the number of days in the previous month of the target date
    const prevMonth = new Date(d2.getFullYear(), d2.getMonth(), 0).getDate();
    days += prevMonth;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}
