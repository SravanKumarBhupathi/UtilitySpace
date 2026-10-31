const fs = require('fs');

const articles = [
  {
    id: "ai-skills-everyone-should-learn-2026",
    title: "10 AI Skills Everyone Should Learn in 2026",
    category: "AI & Technology",
    description: "Artificial intelligence is changing how people study, work, and solve everyday problems. Discover ten practical AI skills that beginners can start learning to stay adaptable in 2026.",
    content: `
      <p>Artificial intelligence is no longer something limited to software engineers and technology companies. Students use it to understand difficult subjects. Professionals use it to organize work. Businesses use it to analyze information and improve productivity.</p>
      <p>But simply knowing how to open an AI chatbot is not enough. The real advantage comes from understanding how to use AI effectively, verify its output, and combine it with your own skills.</p>
      <p>Here are ten useful AI skills worth developing.</p>

      <h3>1. Writing Effective Prompts</h3>
      <p>Learn how to explain what you want clearly. A useful prompt should include:</p>
      <ul>
        <li>Your objective.</li>
        <li>Relevant background.</li>
        <li>Required output format.</li>
        <li>Important restrictions.</li>
        <li>An example when necessary.</li>
      </ul>
      <p>Instead of asking AI to "help me study," explain your exam, available time, current knowledge, and preferred learning style.</p>

      <h3>2. AI-Assisted Research</h3>
      <p>Learn how to use AI to organize information, compare ideas, summarize documents, and identify unanswered questions. Always verify important facts using reliable sources.</p>

      <h3>3. AI Content Creation</h3>
      <p>Explore how AI can assist with drafting articles, creating video scripts, brainstorming ideas, improving presentations, and editing written content. The goal is to improve your work, not blindly publish generated material.</p>

      <h3>4. Data Analysis</h3>
      <p>Learn how to interpret spreadsheets, identify patterns, create charts, and understand basic data. AI can help explain complicated datasets, but you should still check the calculations.</p>

      <h3>5. Automation</h3>
      <p>Understand how repetitive tasks can be automated. Examples include organizing files, creating reminders, processing information, and connecting everyday applications.</p>

      <h3>6. AI Image and Video Creation</h3>
      <p>Learn the basics of image generation, video generation, editing, and visual storytelling.</p>

      <h3>7. Coding With AI Assistance</h3>
      <p>AI can help beginners understand programming concepts, debug errors, and build small projects. However, understanding the generated code remains important.</p>

      <h3>8. Critical Thinking and Fact Checking</h3>
      <p>AI can produce incorrect information confidently. Learn to verify important claims, compare multiple sources, check dates and context, and identify unsupported conclusions.</p>

      <h3>9. Privacy and Responsible AI Usage</h3>
      <p>Never assume that every AI service handles sensitive information in the same way. Understand privacy settings and avoid uploading passwords, identity documents, financial statements, or confidential work information unless you have verified that the service is appropriate.</p>

      <h3>10. Communication and Problem Solving</h3>
      <p>AI does not replace the need to understand people, communicate clearly, and make thoughtful decisions. These human abilities remain valuable when working with technology.</p>

      <h3>How to Start</h3>
      <p>Choose one AI skill and practice it for 20–30 minutes every day. Build a small project instead of collecting dozens of tools.</p>

      <h3>Final Thought</h3>
      <p>The future is not simply about using more AI tools. It is about becoming someone who can solve problems effectively with or without AI.</p>
    `
  },
  {
    id: "identify-ai-generated-scams-and-deepfake-videos",
    title: "How to Identify AI-Generated Scams and Deepfake Videos",
    category: "Digital Safety",
    description: "AI-generated voices, images, and videos can make online scams more convincing. Learn the warning signs and practical steps to verify suspicious messages and requests.",
    content: `
      <p>Imagine receiving a video call from someone who looks and sounds exactly like a family member. They urgently ask you to transfer money. Would you immediately believe them?</p>
      <p>Modern artificial intelligence can generate realistic voices, images, and videos. Scammers may misuse these technologies to impersonate relatives, public figures, company employees, or other trusted people. Here are ways to protect yourself.</p>

      <h3>1. Be Careful With Urgent Money Requests</h3>
      <p>Scammers often create panic. Common messages include:</p>
      <ul>
        <li>I need money immediately.</li>
        <li>My phone is not working.</li>
        <li>Please transfer money now.</li>
        <li>Do not tell anyone about this.</li>
      </ul>
      <p>Urgency is a reason to verify, not a reason to skip verification.</p>

      <h3>2. Verify Through Another Communication Channel</h3>
      <p>If someone asks for money through a video call or voice message, contact them through a previously known phone number. Do not rely only on the contact details provided in the suspicious message.</p>

      <h3>3. Look for Contextual Inconsistencies</h3>
      <p>Pay attention to unusual requests, strange wording, unexpected payment destinations, inconsistent personal details, and requests to bypass normal procedures. Visual imperfections can sometimes provide clues, but modern deepfakes may not have obvious flaws.</p>

      <h3>4. Never Share OTPs or Passwords</h3>
      <p>A genuine-looking video does not justify sharing an OTP, PIN, password, or banking credentials.</p>

      <h3>5. Check Suspicious Links</h3>
      <p>Before opening a link, inspect the domain carefully. Look for misspellings, unexpected domains, and requests for unnecessary personal information.</p>

      <h3>6. Be Careful With Fake Job Offers</h3>
      <p>Scammers may impersonate recruiters and ask candidates to pay registration, training, or verification fees. Verify the employer and recruitment process through official channels.</p>

      <h3>7. Report Suspicious Activity</h3>
      <p>Save relevant evidence and contact the appropriate platform or authorities. In India, cybercrime complaints can be reported through the official National Cyber Crime Reporting Portal.</p>

      <h3>Final Thought</h3>
      <p>Technology makes communication easier, but it also gives scammers new ways to create convincing identities. Whenever a request involves money, personal information, or account access, verify it independently.</p>
    `
  },
  {
    id: "skills-that-improve-employability-2026",
    title: "7 Skills That Can Make You More Employable in 2026",
    category: "Career & Skills",
    description: "Degrees matter, but practical abilities also influence career opportunities. Explore seven valuable skills that students and professionals can develop to improve their workplace readiness.",
    content: `
      <p>Getting a job is not only about collecting certificates. Employers also look for people who can solve problems, communicate clearly, learn quickly, and complete practical tasks.</p>
      <p>As workplaces adopt new technologies, the ability to adapt is becoming increasingly important. Here are seven skills worth developing.</p>

      <h3>1. Digital Literacy</h3>
      <p>Understand common workplace software, online collaboration tools, spreadsheets, and digital communication.</p>

      <h3>2. AI Literacy</h3>
      <p>Learn how AI tools work, where they are useful, and how to verify their output.</p>

      <h3>3. Communication</h3>
      <p>Practice explaining ideas clearly. Improve written communication, speaking, listening, professional email writing, and interview communication.</p>

      <h3>4. Problem Solving</h3>
      <p>Learn how to break complicated problems into smaller steps. Employers value people who can identify issues and propose practical solutions.</p>

      <h3>5. Data Literacy</h3>
      <p>Understand basic spreadsheets, charts, percentages, and data interpretation.</p>

      <h3>6. Adaptability</h3>
      <p>Technology and workplace expectations change. Develop the habit of learning new systems without waiting for someone to teach every step.</p>

      <h3>7. Practical Project Experience</h3>
      <p>Build projects that demonstrate what you can actually do. For example:</p>
      <ul>
        <li>A website.</li>
        <li>A data dashboard.</li>
        <li>A small automation project.</li>
        <li>A portfolio.</li>
        <li>A practical case study.</li>
      </ul>
      <p>A project provides evidence of your abilities.</p>

      <h3>A Simple Development Plan</h3>
      <ul>
        <li><strong>Week 1:</strong> Improve communication.</li>
        <li><strong>Week 2:</strong> Learn spreadsheet and digital skills.</li>
        <li><strong>Week 3:</strong> Practice an AI-assisted workflow.</li>
        <li><strong>Week 4:</strong> Complete a small practical project.</li>
      </ul>
      <p>Repeat the process with more advanced challenges.</p>

      <h3>Final Thought</h3>
      <p>You do not need to master everything at once. Choose a career direction, identify the skills it requires, and build evidence of your ability through consistent practice.</p>
    `
  },
  {
    id: "why-you-feel-busy-but-accomplish-nothing",
    title: "Why You Feel Busy All Day but Accomplish Nothing",
    category: "Psychology & Productivity",
    description: "You can spend an entire day switching between tasks, checking notifications, and planning without completing anything important. Understand why this happens and how to regain control.",
    content: `
      <p>Have you ever reached the end of the day and wondered where all your time went?</p>
      <p>You were active throughout the day. You checked messages, opened applications, watched videos, answered notifications, and planned your next task. But the important work is still unfinished.</p>
      <p>This happens because being busy and being productive are not the same thing.</p>

      <h3>1. Constant Task Switching</h3>
      <p>Every time you move between unrelated tasks, you need to redirect your attention. Repeated switching can make work feel longer and more difficult.</p>
      <p><strong>Solution:</strong> Work on one important task at a time.</p>

      <h3>2. Notifications Interrupt Your Attention</h3>
      <p>A small notification can turn into several minutes of scrolling.</p>
      <p><strong>Solution:</strong> Silence unnecessary notifications during focused work.</p>

      <h3>3. Planning Feels Like Progress</h3>
      <p>Creating lists and organizing schedules can feel satisfying. But planning is not the same as completing the work.</p>
      <p><strong>Solution:</strong> After planning, begin the smallest useful action immediately.</p>

      <h3>4. Too Many Priorities</h3>
      <p>When everything feels important, it becomes difficult to decide what deserves attention.</p>
      <p><strong>Solution:</strong> Choose three important tasks for the day.</p>

      <h3>5. Fear of Starting</h3>
      <p>Sometimes we delay work because it feels difficult, uncertain, or uncomfortable.</p>
      <p><strong>Solution:</strong> Use a five-minute starting rule. Commit to working for just five minutes.</p>

      <h3>6. No Clear Definition of Done</h3>
      <p>A vague task such as "study mathematics" is difficult to begin. A specific task such as "solve 15 percentage questions" is easier to complete.</p>

      <h3>A Simple Daily System</h3>
      <ul>
        <li>Select one important task.</li>
        <li>Break it into smaller steps.</li>
        <li>Work without unnecessary interruptions.</li>
        <li>Take a short break.</li>
        <li>Review what you completed.</li>
      </ul>

      <h3>Final Thought</h3>
      <p>A productive day does not need to be filled with activity. Sometimes completing one meaningful task is better than spending the entire day doing ten unrelated things.</p>
    `
  },
  {
    id: "emergency-fund-how-much-to-save",
    title: "Emergency Fund Explained: How Much Money Should You Save?",
    category: "Personal Finance",
    description: "Unexpected expenses can disturb even a carefully planned budget. Understand what an emergency fund is, how to estimate your target, and how to build one gradually.",
    content: `
      <p>What would happen if your income stopped tomorrow? Would you have enough savings to manage essential expenses?</p>
      <p>An emergency fund is money kept aside for unexpected situations such as job loss, urgent repairs, or necessary medical expenses. It is not money intended for shopping, entertainment, or speculative investments.</p>

      <h3>1. Why Is an Emergency Fund Important?</h3>
      <p>It can help you manage unexpected costs without immediately depending on loans or credit cards.</p>

      <h3>2. How Much Should You Save?</h3>
      <p>A common starting guideline is to aim for three to six months of essential expenses. Your actual target depends on income stability, family responsibilities, existing debt, insurance coverage, and monthly commitments.</p>

      <h3>3. Calculate Your Target</h3>
      <p>First identify essential monthly expenses: rent, groceries, electricity, transportation, necessary healthcare, loan payments, and other unavoidable costs.</p>
      <p>Multiply your monthly essential expenses by the number of months you want to cover.</p>
      <p><strong>Example:</strong> If your essential expenses are ₹15,000 per month:<br/>
      Three months of expenses = ₹45,000.<br/>
      Six months of expenses = ₹90,000.</p>
      <p>These are illustrative calculations, not a recommendation that every person needs the same amount.</p>

      <h3>4. How to Build an Emergency Fund</h3>
      <p>Start with an achievable monthly amount. For example, save ₹500. Increase it when possible. Direct part of unexpected income toward savings, and review the target when your expenses change.</p>

      <h3>5. Where Should You Keep It?</h3>
      <p>Prioritize accessibility and capital preservation. Understand withdrawal restrictions, deposit insurance limits, and product risks before choosing an account or financial product. Do not place your entire emergency fund into volatile investments.</p>

      <h3>6. Avoid Common Mistakes</h3>
      <ul>
        <li>Using emergency savings for unnecessary purchases.</li>
        <li>Setting an unrealistic target.</li>
        <li>Ignoring inflation and changing expenses.</li>
        <li>Keeping the money in an inaccessible investment.</li>
        <li>Forgetting to replenish money after using it.</li>
      </ul>

      <h3>Final Thought</h3>
      <p>An emergency fund is not built in one day. Even a small, consistent saving habit can help create a stronger financial safety net.</p>
      <p><em>This article is general educational information, not personalized financial advice.</em></p>
    `
  },
  {
    id: "build-resume-with-no-work-experience",
    title: "How to Build a Strong Resume With No Work Experience",
    category: "Career & Skills",
    description: "No full-time job experience does not mean you have nothing valuable to show. Learn how to present your education, projects, internships, and practical skills effectively.",
    content: `
      <p>One of the biggest challenges for fresh graduates is preparing a resume when they have little or no full-time work experience. Many candidates make the mistake of thinking they have nothing important to include.</p>
      <p>But a resume is not only a record of previous jobs. It is a summary of your education, skills, projects, and potential.</p>

      <h3>1. Start With Clear Contact Information</h3>
      <p>Include your full name, professional email, phone number, city and location, and relevant portfolio or LinkedIn profile. Avoid unnecessary personal information.</p>

      <h3>2. Write a Short Professional Summary</h3>
      <p>Explain your education, important skills, and the type of opportunity you are seeking. Keep it honest and specific.</p>

      <h3>3. Highlight Technical and Practical Skills</h3>
      <p>Include skills you can actually demonstrate, such as programming languages, database knowledge, communication, spreadsheet skills, or development tools. Do not add skills simply because they appear in job descriptions.</p>

      <h3>4. Add Academic and Personal Projects</h3>
      <p>Projects can demonstrate practical knowledge. For every project explain what you built, which technologies you used, what problem it solves, and what your contribution was.</p>

      <h3>5. Include Internships and Training</h3>
      <p>Mention genuine internships, training programs, and relevant certifications. Clearly distinguish internships from full-time employment.</p>

      <h3>6. Keep Formatting Simple</h3>
      <p>Use clear headings, consistent fonts, proper spacing, bullet points, and a readable layout.</p>

      <h3>7. Customize for Each Job</h3>
      <p>Compare the job requirements with your actual experience. Highlight the most relevant skills and projects.</p>

      <h3>Common Mistakes</h3>
      <ul>
        <li>Adding fake experience.</li>
        <li>Using exaggerated skill ratings.</li>
        <li>Including irrelevant information.</li>
        <li>Writing long paragraphs.</li>
        <li>Making spelling mistakes.</li>
        <li>Using an unnecessarily complicated design.</li>
      </ul>

      <h3>Final Thought</h3>
      <p>Your first resume does not need to show years of experience. It needs to show what you have learned, what you have built, and what you can contribute.</p>
    `
  },
  {
    id: "protect-personal-data-online",
    title: "10 Simple Ways to Protect Your Personal Data Online",
    category: "Digital Safety",
    description: "Your personal information is valuable. Learn practical habits that can reduce the risk of account theft, phishing, identity misuse, and accidental data exposure.",
    content: `
      <p>We use the internet for banking, shopping, communication, education, and entertainment. Every activity may involve sharing some amount of personal information. Protecting that information is an important part of everyday digital life.</p>
      <p>Here are ten practical habits.</p>

      <h3>1. Use Strong, Unique Passwords</h3>
      <p>Avoid reusing the same password across multiple important accounts. Consider using a reputable password manager.</p>

      <h3>2. Enable Multi-Factor Authentication</h3>
      <p>Use an additional verification method where available. An authenticator application or passkey may provide stronger protection than relying only on passwords.</p>

      <h3>3. Never Share OTPs</h3>
      <p>Do not disclose OTPs, PINs, or account recovery codes to unknown callers or messages.</p>

      <h3>4. Check Website Addresses</h3>
      <p>Look carefully at the website domain before entering credentials.</p>

      <h3>5. Avoid Suspicious Attachments</h3>
      <p>Unexpected files and links may contain harmful content or lead to fraudulent websites.</p>

      <h3>6. Keep Devices Updated</h3>
      <p>Install security updates for your operating system, browser, and important applications.</p>

      <h3>7. Review App Permissions</h3>
      <p>Check whether an application genuinely needs access to your contacts, microphone, camera, or location.</p>

      <h3>8. Be Careful With Public Wi-Fi</h3>
      <p>Avoid accessing sensitive accounts over networks you do not trust. Use secure connections and verify the network.</p>

      <h3>9. Back Up Important Data</h3>
      <p>Maintain appropriate backups of important personal documents and files.</p>

      <h3>10. Think Before Sharing</h3>
      <p>Avoid publicly posting sensitive information such as identity details, travel plans, or private documents.</p>

      <h3>Final Thought</h3>
      <p>Online safety is not one application or one setting. It is a collection of small habits that reduce avoidable risks.</p>
    `
  },
  {
    id: "why-brain-prefers-short-videos-over-studying",
    title: "Why Your Brain Prefers Short Videos Over Studying",
    category: "Psychology & Productivity",
    description: "Short videos provide quick entertainment and require little effort to start. Understand why they can become distracting and how to rebuild a healthier study routine.",
    content: `
      <p>You sit down to study. You open your phone for just one minute. One short video becomes another, and before you realize it, a large part of your study time has disappeared.</p>
      <p>Why does this happen?</p>
      <p>Short-form content is designed to be easy to consume. You do not need to choose a movie, understand a complicated story, or commit to a long activity. You simply swipe.</p>

      <h3>1. Very Low Starting Effort</h3>
      <p>Watching a short video requires almost no preparation. Studying, on the other hand, may require concentration, understanding, and effort.</p>

      <h3>2. Constant Novelty</h3>
      <p>Short videos frequently change topics, visuals, sounds, and emotions. This variety can make ordinary tasks feel less immediately stimulating.</p>

      <h3>3. Endless Scrolling</h3>
      <p>Many platforms automatically present another video. There is no natural stopping point.</p>

      <h3>4. Avoiding Difficult Tasks</h3>
      <p>Sometimes people use entertainment to escape uncertainty, stress, or difficult work. The problem is not entertainment itself. The problem is losing control over when it stops.</p>

      <h3>How to Regain Control:</h3>
      <ul>
        <li>Keep your phone away while studying.</li>
        <li>Disable unnecessary notifications.</li>
        <li>Start with a 20-minute focused session.</li>
        <li>Define a specific study goal.</li>
        <li>Take planned breaks.</li>
        <li>Avoid opening entertainment applications during breaks if they regularly lead to long scrolling sessions.</li>
        <li>Track completed work instead of measuring productivity only by study hours.</li>
      </ul>

      <h3>Final Thought</h3>
      <p>You do not need to eliminate entertainment from your life. You need to make sure that entertainment does not control your priorities.</p>
    `
  },
  {
    id: "learn-new-skills-faster-80-20-rule",
    title: "How to Learn Any New Skill Faster Using the 80/20 Rule",
    category: "Education & Learning",
    description: "Learning everything at once can slow you down. Use the 80/20 principle to identify high-value skills, practice effectively, and make faster progress.",
    content: `
      <p>Have you ever started learning something new and felt overwhelmed by the amount of information? You open a course, watch multiple tutorials, download notes, and collect resources. But after several days, you still struggle to perform the actual task.</p>
      <p>A better approach is to focus on the small number of activities that produce meaningful progress. This is the idea behind the 80/20 principle.</p>
      <p>The principle is often used to describe how a relatively small number of factors can contribute to a large portion of results. It is a useful thinking framework, not a guaranteed mathematical rule for every learning situation.</p>

      <h3>Step 1: Define the Result</h3>
      <p>Instead of saying "I want to learn programming," define a practical outcome. Example: "I want to build a simple website."</p>

      <h3>Step 2: Identify the Essential Skills</h3>
      <p>Find the fundamental concepts required to achieve that result. Avoid studying advanced topics before understanding the basics.</p>

      <h3>Step 3: Learn Through Practice</h3>
      <p>Spend time applying what you learn. If you are learning Excel, create spreadsheets. If you are learning programming, build small programs. If you are learning communication, practice speaking.</p>

      <h3>Step 4: Get Feedback</h3>
      <p>Identify mistakes and correct them. Feedback helps prevent repeated errors.</p>

      <h3>Step 5: Repeat and Improve</h3>
      <p>Build increasingly difficult projects. Review what you can do independently.</p>

      <h3>A Simple Daily Plan:</h3>
      <ul>
        <li>15 minutes learning.</li>
        <li>25 minutes practical work.</li>
        <li>10 minutes revision.</li>
      </ul>
      <p>Adjust the schedule to your own circumstances.</p>

      <h3>Final Thought</h3>
      <p>Do not confuse collecting information with developing a skill. Real learning happens when you can use what you understand.</p>
    `
  },
  {
    id: "practical-ways-to-save-money-every-month",
    title: "15 Practical Ways to Save Money Without Changing Your Lifestyle",
    category: "Personal Finance",
    description: "Saving money does not always require major sacrifices. Small changes to spending, subscriptions, shopping habits, and financial planning can make everyday expenses easier to manage.",
    content: `
      <p>Saving money does not mean you must stop enjoying life. The goal is to understand where your money goes and reduce unnecessary expenses without sacrificing important needs.</p>
      <p>Here are fifteen practical ideas.</p>

      <ol>
        <li><strong>Track Monthly Expenses:</strong> Understand how much you spend and where it goes.</li>
        <li><strong>Review Subscriptions:</strong> Cancel services you rarely use.</li>
        <li><strong>Plan Grocery Shopping:</strong> Make a shopping list before visiting a store.</li>
        <li><strong>Compare Prices:</strong> Compare equivalent products before purchasing.</li>
        <li><strong>Avoid Impulse Buying:</strong> Wait before making non-essential purchases.</li>
        <li><strong>Prepare a Monthly Budget:</strong> Give your money a clear purpose.</li>
        <li><strong>Reduce Food Waste:</strong> Plan meals and use groceries efficiently.</li>
        <li><strong>Use Public Transport When Practical:</strong> Compare transportation costs and convenience.</li>
        <li><strong>Review Mobile and Internet Plans:</strong> Choose plans that match your actual usage.</li>
        <li><strong>Set Automatic Savings:</strong> Move a manageable amount into savings regularly.</li>
        <li><strong>Avoid Unnecessary Debt:</strong> Understand borrowing costs before using credit.</li>
        <li><strong>Maintain Important Appliances:</strong> Basic maintenance can help avoid unnecessary replacement costs.</li>
        <li><strong>Use Cashback Carefully:</strong> Do not spend extra money simply to receive rewards.</li>
        <li><strong>Compare Insurance Coverage:</strong> Understand coverage, exclusions, and renewal terms before making changes.</li>
        <li><strong>Review Your Budget Every Month:</strong> Identify what worked and what needs improvement.</li>
      </ol>

      <h3>Final Thought</h3>
      <p>Financial improvement does not always begin with earning more. Sometimes it begins with understanding how you use the money you already have.</p>
      <p><em>This article provides general educational information, not personalized financial advice.</em></p>
    `
  }
];

let blogDataContent = fs.readFileSync('src/data/blog.ts', 'utf8');
let blogContentData = fs.readFileSync('src/data/blog-content.ts', 'utf8');

function calcReadTime(text) {
   const words = text.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
   return Math.max(1, Math.ceil(words / 200)) + " min read";
}

let newBlogEntries = '';
let newContentEntries = '';

articles.forEach(article => {
   if (blogDataContent.indexOf('id: "' + article.id + '"') === -1) {
       newBlogEntries += `
  {
    id: "${article.id}",
    title: "${article.title}",
    description: "${article.description}",
    category: "${article.category}",
    href: "/blog/${article.id}",
    readingTime: "${calcReadTime(article.content)}",
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
  },
`;
   }

   if (blogContentData.indexOf('"' + article.id + '":') === -1) {
       const escapedContent = article.content.replace(/`/g, "\\`");
       newContentEntries += `
  "${article.id}": \`${escapedContent}\`,
`;
   }
});

if (newBlogEntries) {
    blogDataContent = blogDataContent.replace('export const blogPosts: Article[] = [', 'export const blogPosts: Article[] = [\n' + newBlogEntries);
    fs.writeFileSync('src/data/blog.ts', blogDataContent);
}

if (newContentEntries) {
    blogContentData = blogContentData.replace('export const blogContent: Record<string, string> = {', 'export const blogContent: Record<string, string> = {\n' + newContentEntries);
    fs.writeFileSync('src/data/blog-content.ts', blogContentData);
}

console.log("Added 10 new blog articles.");

let categoryFile = fs.readFileSync('src/data/categories.ts', 'utf8');

const newCategories = `
export const blogCategories = [
  { name: "AI & Technology", slug: "ai-technology" },
  { name: "Career & Skills", slug: "career-skills" },
  { name: "Personal Finance", slug: "personal-finance" },
  { name: "Psychology & Productivity", slug: "psychology-productivity" },
  { name: "Digital Safety", slug: "digital-safety" },
  { name: "Education & Learning", slug: "education-learning" },
  { name: "Lifestyle & Personal Development", slug: "lifestyle" },
  { name: "General Knowledge", slug: "general-knowledge" }
];
`;

if (categoryFile.indexOf('export const blogCategories') === -1) {
    categoryFile += newCategories;
    fs.writeFileSync('src/data/categories.ts', categoryFile);
}
