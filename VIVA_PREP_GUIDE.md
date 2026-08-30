## 6. 10 More Advanced "Trick" Viva Questions

**Q1: Since you are storing the JWT in localStorage, isn't your app vulnerable to Cross-Site Scripting (XSS)?**
*A:* Yes, localStorage can be accessed by malicious JavaScript if an XSS vulnerability exists. However, React heavily protects against XSS by automatically escaping variables embedded in JSX (e.g., {userInput}). To be completely immune, we would need to store the JWT in an httpOnly cookie, which prevents JavaScript access, but localStorage is acceptable for this MVP due to React's built-in XSS protection.

**Q2: How do you handle the "N+1 Problem" in GraphQL?**
*A:* The N+1 problem occurs when querying a list of items (like 10 Teams) and then making a separate database query for each team's Owner (1 query for teams + 10 queries for owners = 11 queries). While Prisma optimizes some of this under the hood using SQL JOINs when requested via include, in a massive GraphQL API, we would use a library like DataLoader to batch and cache these nested requests into a single query.

**Q3: Can a JWT be revoked or invalidated before it expires?**
*A:* No, not natively. JWTs are *stateless*, meaning the backend doesn't store them in a database; it only verifies the cryptographic signature. If we needed to instantly revoke a token (e.g., kicking a user out), we would have to implement a "Blacklist" in the database or Redis to check the token on every request, which slightly defeats the purpose of statelessness.

**Q4: What happens if your JWT_SECRET environment variable is leaked?**
*A:* A total security compromise. An attacker could use the leaked secret to forge valid JWTs for any userId (including Admin IDs) without needing a password. The immediate fix would be rotating (changing) the JWT_SECRET in the .env file, which instantly invalidates all currently issued tokens, forcing everyone to log in again.

**Q5: Why use crypt for user passwords but not for the shared Netflix passwords in the Vault?**
*A:* crypt is a *hashing* algorithm, which is a one-way mathematical function. We cannot reverse a bcrypt hash back into the original password, which is perfect for verifying user logins. However, for the Vault, users actually need to *see* the Netflix password. Therefore, Vault credentials must be stored in plain text (or reversibly *encrypted* using symmetric encryption like AES-256), not hashed.

**Q6: What causes an infinite loop in a React useEffect and how did you prevent it?**
*A:* An infinite loop happens if a useEffect updates a state variable, and that same state variable is listed in the dependency array (or if the dependency array is missing entirely). We prevented this by carefully declaring only the exact variables the effect relies on inside the [] dependency array.

**Q7: How does Apollo Client know to update the UI after you run a Mutation (like marking a notification as read)?**
*A:* By default, mutations don't automatically update queries unless the mutation returns the modified object with its id. In our app, we often use the onCompleted: () => refetch() callback on the mutation to tell Apollo to re-run the GET_MY_NOTIFICATIONS query and update the cache so the UI reacts instantly.

**Q8: If Vite is so fast, why doesn't everyone use it instead of Webpack/Create-React-App?**
*A:* Vite is much newer. It relies on modern browsers supporting native ES Modules (ESM) during development, skipping the bundling process entirely. Webpack bundles the entire app into a single file before serving it, which is slower but historically safer for supporting very old legacy browsers (like Internet Explorer). Since modern apps don't support IE, Vite has become the new standard.

**Q9: Since you used Serverless Postgres (Neon), what happens if 1,000 users connect at once?**
*A:* Traditional PostgreSQL databases have a hard limit on concurrent connections (often around 100). If a serverless app spins up 1,000 instances, the database crashes. Neon solves this by providing built-in "Connection Pooling" (via PgBouncer), which queues and multiplexes thousands of lightweight connections into a few heavy database connections.

**Q10: Why did you use useMemo in some React components?**
*A:* useMemo caches the result of an expensive calculation or array filtering between re-renders. If the component re-renders because a totally unrelated piece of state changed, useMemo prevents React from recalculating that data, saving CPU cycles and improving frontend performance.
## 7. Tech Stack & UI/UX Specific Questions

**Q11: Why did you choose Tailwind CSS instead of standard CSS or SCSS/SASS?**
*A:* Traditional CSS forces you to invent class names (like .btn-primary-large), which leads to naming collisions and massive CSS files over time. Tailwind is "utility-first," meaning we style directly in the HTML using predefined classes (e.g., g-blue-500 p-4). This results in zero naming collisions, faster styling, and a tiny production CSS file because Tailwind purges any class we didn't use during the build step.

**Q12: How did you implement Dark Mode, and how does Tailwind handle it?**
*A:* We used a React Context (ThemeContext) to manage a boolean state for the theme. When dark mode is active, we dynamically add the dark class to the root <html> tag. Tailwind makes styling this incredibly easy using the dark: prefix. For example, g-white dark:bg-slate-900 tells the browser to use a white background normally, but switch to dark gray if the root element has the dark class.

**Q13: From a UX perspective, why do you use Toast Notifications instead of standard lert() popups?**
*A:* A native browser lert() is synchronously blocking—it freezes the entire web page and forces the user to click "OK" before they can do anything else. Toast notifications (the popups at the bottom of the screen) are non-blocking. They provide feedback (like "Payment Successful") while allowing the user to seamlessly continue navigating the app, resulting in a much more modern and fluid User Experience.

**Q14: Explain your strategy for Responsive Design (Mobile Support).**
*A:* We followed a "Mobile-First" design strategy. By default, the Tailwind classes we write apply to mobile screens. We then use responsive breakpoints like sm: (tablets) or lg: (desktops) to adjust the layout for larger screens. For example, lex-col md:flex-row stacks elements vertically on mobile, but places them side-by-side on desktop.

**Q15: Why use Apollo Client instead of just making POST requests using etch or Axios?**
*A:* You *can* query GraphQL using standard etch. However, Apollo Client is a full state management library. It automatically handles loading states (loading), error handling (error), and most importantly, it normalizes and caches the data. If you use etch, you have to manually write React useState and useEffect hooks for every single API call. Apollo does all of that for us in one line of code.

**Q16: Why did you choose Lucide React for icons instead of FontAwesome or an icon font?**
*A:* Font icons require the browser to download an entire font file, which is heavy and bad for performance. Lucide provides icons as lightweight, inline SVG (Scalable Vector Graphic) React components. Because of a build process called "Tree-shaking," Vite only bundles the exact 10 or 20 icons we actually imported, completely ignoring the thousands of other icons in the library, keeping our app lightning fast.

**Q17: Why do you show Loading Spinners or Skeleton loaders instead of just a blank screen while data is fetching?**
*A:* This is a core UX principle related to "Perceived Performance." If the screen stays completely blank for 1 second, the user thinks the app is broken or frozen. If you show a spinning loader or a skeleton outline immediately, the app *feels* much faster and more responsive, keeping the user engaged while the network request finishes in the background.

**Q18: What is the benefit of breaking down the UI into tiny components like <Card>, <Badge>, and <Button>?**
*A:* This creates a "Design System." If the client suddenly wants all buttons to have rounded pill corners instead of square corners, we only have to change the CSS in one single file (Button.tsx), and the entire application updates instantly. It enforces visual consistency across the app and strictly follows the DRY (Don't Repeat Yourself) principle.
