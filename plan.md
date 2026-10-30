1. **Tool Categories (Section 1)**
   - Replace the `Article Discovery` section or similar with a new "Tool Categories" section in `src/app/page.tsx`.
   - Calculate tool counts dynamically using `tools.filter(t => t.category === '...')`.
   - Map exactly 4 cards: PDF Tools, Image Tools, Text Tools, Developer Tools with the descriptions required.
2. **Featured Tools (Section 2)**
   - Replace the `Essential Tools` block with a dedicated "Popular Tools" section displaying 6-8 popular tools (e.g. PDF Compressor, Image Compressor, etc.). Ensure we use existing icons and working destinations.
   - Include an "Explore All Tools" button linking to `/tools`.
3. **Calculators (Section 3)**
   - Update the existing Calculators block to match the new "Free Online Calculators" section requirement.
   - Show existing calculators like Age Calculator, Percentage Calculator, etc.
   - Add a "View All Calculators" button linking to `/calculators`.
4. **Data consistency and cleanup**
   - We will replace the current `Article Discovery` and `Useful Resources` sections (including Practical guides and old tool blocks).
   - Will preserve the Hero and Trust Banner.
5. **Validation**
   - Run tests, builds, and visual verification to ensure grid alignments and theme adherence.
