import { calculateAge } from '@/lib/age-calculator';

describe('calculateAge', () => {
  it('should calculate age correctly when days and months are positive', () => {
    const result = calculateAge('1990-01-15', '2023-05-20');
    expect(result).toEqual({ years: 33, months: 4, days: 5 });
  });

  it('should calculate age correctly when days are negative (borrowing a month)', () => {
    const result = calculateAge('1990-05-20', '2023-08-15');
    // From 1990-05-20 to 2023-08-20 is 33 years and 3 months.
    // 2023-08-15 is 5 days less. Previous month is July (31 days).
    // Target day (15) - Dob day (20) = -5 days
    // Borrow a month from August (July has 31 days) -> 31 - 5 = 26 days
    // Months: 8 - 5 = 3 - 1 (borrowed) = 2 months
    // Years: 2023 - 1990 = 33 years
    expect(result).toEqual({ years: 33, months: 2, days: 26 });
  });

  it('should calculate age correctly when months are negative (borrowing a year)', () => {
    const result = calculateAge('1990-08-15', '2023-05-20');
    // Target month (5) - Dob month (8) = -3 months
    // Borrow a year -> 12 - 3 = 9 months
    // Target year (2023) - Dob year (1990) - 1 (borrowed) = 32 years
    // Target day (20) - Dob day (15) = 5 days
    expect(result).toEqual({ years: 32, months: 9, days: 5 });
  });

  it('should calculate age correctly when both days and months require borrowing', () => {
    const result = calculateAge('1990-08-20', '2023-05-15');
    // Target day (15) - Dob day (20) = -5 days
    // Previous month (April) has 30 days -> 30 - 5 = 25 days
    // Target month (5) - Dob month (8) - 1 (borrowed day) = -4 months
    // Borrow a year -> 12 - 4 = 8 months
    // Target year (2023) - Dob year (1990) - 1 (borrowed month) = 32 years
    expect(result).toEqual({ years: 32, months: 8, days: 25 });
  });

  it('should handle leap years correctly', () => {
    const result = calculateAge('2000-02-29', '2004-03-01');
    // From 2000-02-29 to 2004-02-29 is exactly 4 years
    // Plus 1 day (March 1)
    expect(result).toEqual({ years: 4, months: 0, days: 1 });

    const result2 = calculateAge('2000-02-29', '2001-03-01');
    // From 2000-02-29 to 2001-03-01 is 1 year, 0 months, 0 days
    // Note: 2001-02-28 is 1 year minus 1 day. 2001-03-01 is 1 year exactly or 1 year and 0 days if we consider month lengths.
    // In our algorithm:
    // d1 = 2000-02-29, d2 = 2001-03-01
    // years = 2001 - 2000 = 1
    // months = 2 (March) - 1 (February) = 1 (Date is 0-indexed month, so 2 - 1 = 1)
    // days = 1 - 29 = -28
    // Borrow month -> months = 0
    // Prev month of target date (2001-02) has 28 days
    // days = -28 + 28 = 0
    expect(result2).toEqual({ years: 1, months: 0, days: 0 });
  });

  it('should calculate 0 age if dates are exactly the same', () => {
    const result = calculateAge('2023-01-01', '2023-01-01');
    expect(result).toEqual({ years: 0, months: 0, days: 0 });
  });

  it('should throw an error if Date of Birth is after target date', () => {
    expect(() => calculateAge('2023-01-01', '2022-12-31')).toThrow(
      'Date of birth must be before target date'
    );
  });
});
