1. **Helpful Guides (Section 1)**
   - Add a new section in `src/app/page.tsx` titled "Helpful Guides" right below the Calculators section.
   - Fetch 4 specific existing guides from `src/data/guides.ts` based on title or ID.
   - Design matching Phase 2 UI specs. Add an "Explore All Guides" button.
2. **Blog Articles (Section 2)**
   - Add a new section "Latest Insights & Articles" below Guides.
   - Map top 3-4 posts from `src/data/blog.ts` displaying category, date, title, description, and link.
   - Add "Explore All Articles" button.
3. **Trust & Privacy (Section 3)**
   - Replace the old "Trust Banner" block with a modern "Compact benefits" block.
   - Use the text requested: Free online tools, Simple interface, No account required, Browser-based processing.
4. **Footer Redesign (Section 4)**
   - Edit `src/components/footer.tsx` to match the exact link structure requested in the prompt. Replace 'UtilitySpace' with 'UtilitySpace.online'.
   - Ensure dynamic year and correct categorizations (Tools with subset tools, Calculators, Content, Information).
5. **Validation (Section 6)**
   - Run tests, builds, linting, visual Playwright script.
