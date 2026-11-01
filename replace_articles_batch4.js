const fs = require('fs');

const article7_id = "why-brain-prefers-short-videos-over-studying";
const article7_content = `
<h1>Why Your Brain Prefers Short Videos Over Studying</h1>
<p>Have you ever opened YouTube Shorts or Instagram Reels for five minutes, only to realise that an hour has passed?</p>
<p>But when you sit down to study, even 15 minutes can feel difficult.</p>
<p>Why does this happen?</p>
<p>The answer is connected to how we respond to entertainment, novelty, effort and distractions.</p>

<h2>1. Instant Entertainment</h2>
<p>Short videos provide quick entertainment with very little effort. You don't need to concentrate deeply or remember much.</p>
<p>Studying is different. It requires attention, understanding and mental effort.</p>

<h2>2. Endless New Content</h2>
<p>Short-video platforms continuously show new content. Every swipe brings something different, making it easy to continue watching.</p>
<p>Studying usually involves staying with one topic for a longer time, which can feel less exciting.</p>

<h2>3. Autoplay Makes It Difficult to Stop</h2>
<p>When one video ends, another appears immediately. You don't need to make a new decision to continue watching.</p>
<p>This can make you spend more time than you originally planned.</p>

<h2>4. Switching Between Tasks</h2>
<p>Constantly switching between videos, messages and study materials can interrupt concentration.</p>
<p>Your mind needs time to return to a difficult task after distractions.</p>

<h2>5. Studying Has Delayed Rewards</h2>
<p>Entertainment gives immediate enjoyment, while studying often provides results much later through better knowledge, marks or career opportunities.</p>
<p>This difference can make entertainment feel more attractive in the moment.</p>

<h2>How to Improve Your Study Focus</h2>
<ul>
  <li>Keep your phone away while studying.</li>
  <li>Start with just 15–20 minutes of focused study.</li>
  <li>Take short breaks after completing a study session.</li>
  <li>Set a daily limit for short-video apps.</li>
  <li>Decide what topic you will complete before opening your book.</li>
  <li>Avoid watching videos during study breaks if they make you lose track of time.</li>
</ul>

<h2>Final Thoughts</h2>
<p>Your brain is not necessarily lazy because you enjoy short videos. These platforms are designed to make content easy and engaging.</p>
<p>The solution is not to stop enjoying entertainment completely. It is to build a routine where you control your screen time instead of allowing it to control your day.</p>

<h2>Frequently Asked Questions</h2>
<h3>Q1. Why is studying boring compared to watching reels?</h3>
<p>Studying requires sustained effort, while short videos provide quick entertainment and frequent changes in content.</p>

<h3>Q2. Do short videos reduce concentration?</h3>
<p>Frequent distractions and task switching can make it harder to maintain attention, especially during demanding tasks.</p>

<h3>Q3. How can I stop watching reels while studying?</h3>
<p>Keep your phone away, use app limits and begin with short, manageable study sessions.</p>
`;


const article8_id = "learn-new-skills-faster-80-20-rule";
const article8_content = `
<h1>How to Learn Any New Skill Faster Using the 80/20 Rule</h1>
<p>Have you ever tried learning something new but felt overwhelmed by too much information?</p>
<p>Whether it is programming, English communication, designing or any other skill, beginners often spend too much time learning everything instead of focusing on what matters most.</p>
<p>The 80/20 rule can help.</p>

<h2>What is the 80/20 Rule?</h2>
<p>The 80/20 rule, also called the Pareto Principle, suggests that a large portion of results can sometimes come from a relatively small portion of efforts.</p>
<p>It is a useful learning strategy, not a fixed mathematical formula.</p>
<p>The idea is simple: identify the activities that contribute most to your progress and give them priority.</p>

<h2>How to Apply It While Learning a Skill</h2>
<h3>1. Identify the Most Important Basics</h3>
<p>Don't try to learn everything at once.</p>
<p>For example, if you want to learn English, begin with commonly used words, basic grammar and everyday conversations.</p>

<h3>2. Focus on Practical Activities</h3>
<p>Reading about a skill is useful, but applying it is equally important.</p>
<p>If you are learning programming, spend time writing small programs instead of only watching tutorials.</p>

<h3>3. Avoid Information Overload</h3>
<p>Beginners often collect too many courses, books and tutorials.</p>
<p>Choose one good learning resource and follow it consistently.</p>

<h3>4. Practise Every Day</h3>
<p>Even 30 minutes of focused practice can help you build consistency.</p>
<p>The important thing is to practise regularly rather than waiting for the perfect time.</p>

<h3>5. Find Your Mistakes and Improve</h3>
<p>Identify what you are struggling with and work specifically on that area.</p>
<p>Feedback and correction can make your learning more effective.</p>

<h2>Examples of the 80/20 Rule</h2>
<p><strong>English:</strong><br/>Focus on commonly used words, basic sentence structures and daily speaking practice.</p>
<p><strong>Programming:</strong><br/>Learn fundamentals, practise problem-solving and build small projects.</p>
<p><strong>Fitness:</strong><br/>Focus on consistent exercise, proper technique, recovery and a sustainable routine.</p>
<p><strong>Communication:</strong><br/>Practise explaining ideas clearly, listening carefully and speaking regularly.</p>

<h2>Common Mistakes to Avoid</h2>
<ul>
  <li>Trying to master everything at once.</li>
  <li>Watching tutorials without practising.</li>
  <li>Switching between multiple learning resources.</li>
  <li>Ignoring weak areas.</li>
  <li>Expecting instant results.</li>
</ul>

<h2>Final Thoughts</h2>
<p>Learning faster does not always mean studying for more hours.</p>
<p>It means using your time wisely, practising important things and improving consistently.</p>
<p>Remember: focus on what matters most, practise it regularly and build from there.</p>

<h2>Frequently Asked Questions</h2>
<h3>Q1. Is the 80/20 rule scientifically exact?</h3>
<p>No. It is a general principle and learning framework, not a guaranteed 80-to-20 mathematical result.</p>

<h3>Q2. Can beginners use the 80/20 rule?</h3>
<p>Yes. Beginners can use it to prioritise essential concepts and avoid unnecessary information overload.</p>

<h3>Q3. Is practice more important than watching tutorials?</h3>
<p>Both are useful, but practical application is essential for developing real skills.</p>
`;

let blogContentData = fs.readFileSync('src/data/blog-content.ts', 'utf8');

function fixStructure(contentStr, id, html) {
    const escapedHtml = html.replace(/`/g, "\\`");

    const correctRegex = new RegExp(`"${id}": \\{[\\s\\S]*?\\},`, "g");

    if (contentStr.match(correctRegex)) {
        return contentStr.replace(correctRegex, `"${id}": {
    heroImage: "",
    imageAlt: "",
    relatedIds: [],
    html: \`${escapedHtml}\`
  },`);
    } else {
        const fallbackRegex = new RegExp(`"${id}": \\\`([\\s\\S]*?)\\\`,`, "g");
        if (contentStr.match(fallbackRegex)) {
            return contentStr.replace(fallbackRegex, `"${id}": {
    heroImage: "",
    imageAlt: "",
    relatedIds: [],
    html: \`${escapedHtml}\`
  },`);
        } else {
            return contentStr.replace('export const blogContent: Record<string, { html: string; heroImage: string; imageAlt: string; relatedIds: string[] }> = {', 'export const blogContent: Record<string, { html: string; heroImage: string; imageAlt: string; relatedIds: string[] }> = {\n  "' + id + '": {\n    heroImage: "",\n    imageAlt: "",\n    relatedIds: [],\n    html: `' + escapedHtml + '`\n  },');
        }
    }
}

blogContentData = fixStructure(blogContentData, article7_id, article7_content);
blogContentData = fixStructure(blogContentData, article8_id, article8_content);

fs.writeFileSync('src/data/blog-content.ts', blogContentData);
console.log("Updated article 7 and 8 content data structure.");

let blogData = fs.readFileSync('src/data/blog.ts', 'utf8');

// Update meta for 7 and 8
blogData = blogData.replace(
  /id: "why-brain-prefers-short-videos-over-studying",\s*title: "[^"]*",\s*description: "[^"]*",\s*category: "[^"]*",\s*href: "[^"]*",\s*readingTime: "[^"]*"/,
  `id: "why-brain-prefers-short-videos-over-studying",
    title: "Why Your Brain Prefers Short Videos Over Studying",
    description: "Discover why short videos feel more attractive than studying and learn simple ways to improve your focus and reduce distractions.",
    category: "Psychology & Productivity",
    href: "/blog/why-brain-prefers-short-videos-over-studying",
    readingTime: "3 min read"`
);
blogData = blogData.replace(
  /id: "learn-new-skills-faster-80-20-rule",\s*title: "[^"]*",\s*description: "[^"]*",\s*category: "[^"]*",\s*href: "[^"]*",\s*readingTime: "[^"]*"/,
  `id: "learn-new-skills-faster-80-20-rule",
    title: "How to Learn Any New Skill Faster Using the 80/20 Rule",
    description: "Learn how to use the 80/20 rule to focus on important activities, avoid wasting time and develop new skills more efficiently.",
    category: "Education & Learning",
    href: "/blog/learn-new-skills-faster-80-20-rule",
    readingTime: "3 min read"`
);

fs.writeFileSync('src/data/blog.ts', blogData);
console.log("Updated article 7 and 8 SEO meta.");
