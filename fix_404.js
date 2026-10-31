const fs = require('fs');

let blogContentData = fs.readFileSync('src/data/blog-content.ts', 'utf8');

// The type in blog-content.ts is:
// export const blogContent: Record<string, { html: string; heroImage: string; imageAlt: string; relatedIds: string[] }> = {
// When we added the new articles, we did: "id": `content` which doesn't match { html, heroImage, imageAlt, relatedIds }

const article1_id = "ai-skills-everyone-should-learn-2026";
const article2_id = "identify-ai-generated-scams-and-deepfake-videos";

// Function to fix the structure
function fixStructure(contentStr, id) {
    const regex = new RegExp(`"${id}": \\\`([\\s\\S]*?)\\\`,`, "g");
    return contentStr.replace(regex, `"${id}": {
    heroImage: "",
    imageAlt: "",
    relatedIds: [],
    html: \`$1\`
  },`);
}

blogContentData = fixStructure(blogContentData, article1_id);
blogContentData = fixStructure(blogContentData, article2_id);

// If the type signature was accidentally changed to Record<string, string>, fix it back.
if (blogContentData.includes('export const blogContent: Record<string, string> = {')) {
    blogContentData = blogContentData.replace(
        'export const blogContent: Record<string, string> = {',
        'export const blogContent: Record<string, { html: string; heroImage: string; imageAlt: string; relatedIds: string[] }> = {'
    );
}

fs.writeFileSync('src/data/blog-content.ts', blogContentData);
console.log("Fixed content data structure");

let pageTsx = fs.readFileSync('src/app/blog/[slug]/page.tsx', 'utf8');
pageTsx = pageTsx.replace(
    'dangerouslySetInnerHTML={{ __html: content }}',
    'dangerouslySetInnerHTML={{ __html: typeof content === "string" ? content : content.html }}'
);
fs.writeFileSync('src/app/blog/[slug]/page.tsx', pageTsx);
console.log("Fixed page.tsx rendering");
