const fs = require('fs');
let code = fs.readFileSync('src/components/hero-search.tsx', 'utf8');
const eventListener = `
  React.useEffect(() => {
    const handleOpenHeroSearch = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsFocused(true);
      if (customEvent.detail?.query) {
        setQuery(customEvent.detail.query);
        setTimeout(() => {
            document.querySelector('input[placeholder="Search tools, calculators, and guides..."]')?.focus();
        }, 50);
      }
    };
    window.addEventListener("open-hero-search", handleOpenHeroSearch);
    return () => window.removeEventListener("open-hero-search", handleOpenHeroSearch);
  }, []);
`;

// Insert after the first useEffect
code = code.replace(/return \(\) => document\.removeEventListener\("mousedown", handleClickOutside\);\n  \}, \[\]\);/, "return () => document.removeEventListener(\"mousedown\", handleClickOutside);\n  }, []);\n" + eventListener);

fs.writeFileSync('src/components/hero-search.tsx', code);
