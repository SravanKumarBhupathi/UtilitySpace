1. **Article 3 (Why You Feel Busy All Day but Accomplish Nothing)**
   - We already have the blog data entry for `why-you-feel-busy-but-accomplish-nothing`.
   - I need to update `src/data/blog-content.ts` with the new markdown/HTML mapping structure `{ html, heroImage, imageAlt, relatedIds }` for this article.
   - Update `src/data/blog.ts` to sync the reading time and SEO metadata for it.
2. **Article 4 (Emergency Fund Explained: How Much Money Should You Save?)**
   - Similarly, overwrite the object for `emergency-fund-how-much-to-save` inside `src/data/blog-content.ts` with the full HTML representation required.
   - Adjust `src/data/blog.ts` with reading time and matching SEO schema.
3. **Verify Existing Functionality & Validate (Steps 3-5)**
   - Run a node playwright verification script fetching the pages locally to guarantee their compilation and absence of the previous 404 issue.
   - Run `npm run build` static generator to finalize.
   - Update `FINAL_REPORT.md`
