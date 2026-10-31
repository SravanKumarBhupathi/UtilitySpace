1. **Investigate the 404 (Step 1)**
   - The issue causing the 404 is that `blogContent[params.slug]` returns undefined in `src/app/blog/[slug]/page.tsx` because the structure of `blog-content.ts` is actually `Record<string, { html: string, heroImage: string, imageAlt: string, relatedIds: string[] }>`, but we accidentally overrode it to `Record<string, string>` containing just raw HTML strings during the previous insertion step.
2. **Fix the Blog Routing & Data Structure (Step 2 & 3)**
   - Correct `src/data/blog-content.ts` so the newly injected articles follow the proper object structure: `{ html: "...", heroImage: "", imageAlt: "", relatedIds: [] }`.
   - Correct the `dangerouslySetInnerHTML` call in `page.tsx` to read from `content.html` instead of just `content` if it's an object, or gracefully fallback.
3. **Verify Links & Content (Step 4 & 5)**
   - Ensure the "Read More" links dynamically generated map securely to `href`.
   - Run tests for individual URL access via Playwright screenshotting `/blog/ai-skills-everyone-should-learn-2026`.
4. **Build & Report (Step 6)**
   - Re-run `npm run build`. Note findings in `FINAL_REPORT.md`.
5. Pre-commit instructions.
