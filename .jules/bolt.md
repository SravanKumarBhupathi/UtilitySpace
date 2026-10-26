## 2023-10-25 - [Pre-computation]
**Learning:** Found an opportunity to optimize search in `GlobalSearch` component. The array concatenation and mapping happens on every render inside `React.useMemo` despite `tools`, `calculators`, `guides`, `knowledge`, `blogPosts` being static imports.
**Action:** Move the initial allItems array creation outside the component to prevent recreating the large combined array on every keystroke when searching.
