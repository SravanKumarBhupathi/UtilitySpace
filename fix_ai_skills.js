const fs = require('fs');
let content = fs.readFileSync('src/data/blog-content.ts', 'utf8');

// The reason it might be 404ing or returning the homepage title is that the id `ai-skills-everyone-should-learn-2026`
// was inadvertently missed or corrupted during the last replacement. Let's make sure it's strictly defined.

const article1_id = "ai-skills-everyone-should-learn-2026";
if (content.indexOf(`"${article1_id}": {`) === -1) {
    console.log("AI Skills article content is missing or malformed.");
} else {
    console.log("AI Skills article content exists.");
}
