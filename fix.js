const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');
code = code.replace("We don't ask you to sign up", "We don&apos;t ask you to sign up");
fs.writeFileSync('src/app/page.tsx', code);
console.log("Fixed unescaped entity");
