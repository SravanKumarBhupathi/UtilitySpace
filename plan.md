1. **Article 7 (Why Your Brain Prefers Short Videos Over Studying)**
   - Extract the article data into HTML conforming to the `{ html, heroImage, imageAlt, relatedIds }` object format required by `src/data/blog-content.ts` to prevent 404s.
   - Update `src/data/blog.ts` with correct metadata and calculated reading time.
2. **Article 8 (How to Learn Any New Skill Faster Using the 80/20 Rule)**
   - Perform the same data generation and mapping logic for this article into `src/data/blog-content.ts`.
   - Ensure SEO fields and accurate reading time are assigned in `src/data/blog.ts`.
3. **Verify Routing & Next.js Build**
   - Execute Playwright integration test ensuring the new articles (and the prior batch) render successfully and do not trigger a 404.
   - Run Next.js static build to affirm no compilation warnings are thrown.
4. Update `FINAL_REPORT.md` with tests ran, files updated, and build results.
5. Code review / pre-commit.
