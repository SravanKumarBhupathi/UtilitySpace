🎯 **What:** The testing gap addressed
The utility functions in `src/lib/data/exams.ts` (`getExamBySlug`, `getExamsByCategory`, and `searchExams`) were previously untested. This PR introduces comprehensive unit tests for these functions to ensure their reliability.

📊 **Coverage:** What scenarios are now tested
- **`getExamBySlug`**: Tested for returning the correct exam with a valid slug, and returning `undefined` for an invalid slug.
- **`getExamsByCategory`**: Tested for returning all exams in a specific category, and returning an empty array when no exams exist in the category.
- **`searchExams`**: Tested for partial matches in exam name, organization, category, and slug. Tested for case insensitivity, empty matches, and returning the full list when the search query is empty.

✨ **Result:** The improvement in test coverage
The `src/lib/data/exams.ts` utility functions are now 100% covered, ensuring that any future changes to these utilities or underlying datasets will be validated against expected behavior, reducing the chance of regressions.
