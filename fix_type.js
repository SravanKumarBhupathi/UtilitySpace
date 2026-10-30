const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');
code = code.replace("{guide.readingTime}", "{'readingTime' in guide ? String(guide.readingTime) : ''}");
fs.writeFileSync('src/app/page.tsx', code);
console.log("Fixed type error");
