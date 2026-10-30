1. Update `src/components/header.tsx` to add active state using `usePathname` and verify correct navigation structure.
2. Update `src/components/mobile-navigation.tsx` similarly.
3. Update `src/app/page.tsx` to add the new Hero Section with a search box at the top, modifying the content accordingly.
4. Improve `src/components/global-search.tsx` to:
   - Handle focus on keydown down/up (keyboard navigation).
   - Enter to select the focused item.
   - Improve search logic using keywords/description as well.
5. Fix lint and build issues, run tests.
