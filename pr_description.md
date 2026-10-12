🎯 **What:**
The `splitPdf` exported function in `src/lib/pdf-utils.ts` was not covered by unit tests. Tests and the testing framework setup have been implemented.

📊 **Coverage:**
The following scenarios are now covered with jest tests for `splitPdf`:
- Splitting a multi-page PDF into multiple 1-page PDF documents.
- Splitting a 1-page PDF successfully.
- Handling empty / corrupted PDFs.

✨ **Result:**
The test suite can be run via `npm run test` or `npx jest src/lib/pdf-utils.test.ts` ensuring this function behaves properly. Test coverage for the repository has improved.
