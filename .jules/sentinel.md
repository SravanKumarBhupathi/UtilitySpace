## 2023-10-24 - [Fix weak random number generation for UUIDs]
**Vulnerability:** The UUID generator tool was using Math.random() to generate UUIDs, which is not cryptographically secure and could lead to predictable UUIDs.
**Learning:** Even when comments claim "using crypto API", the actual implementation may fallback to weak RNGs like Math.random() out of convenience or copy-pasting outdated snippets.
**Prevention:** Always use standard crypto APIs like crypto.randomUUID() for secure UUID generation instead of relying on insecure implementations like Math.random(). For environments lacking crypto.randomUUID(), fallback to crypto.getRandomValues().
