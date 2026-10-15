# Winbuzz assignment replica

Next.js App Router replica of the public pages at officialwinbuzz.com, captured on 13 October 2026. Reference content and styles are stored locally in `reference/pages`; images and fonts are in `public/assets`. No WordPress server is required.

## Deploy on Render

1. In Render, select **New > Blueprint** and connect `https://github.com/kabirr6044/winbuzz`.
2. Select the `main` branch. Render reads `render.yaml` and creates the `winbuzz` Docker web service in Singapore using the free plan.
3. Enter your chosen destination for `EXTERNAL_REDIRECT_URL` when prompted. Use a complete `https://` URL. This single variable controls every external link and form submission.
4. Deploy. Render builds the root `Dockerfile`, which installs locked dependencies and creates a Next.js standalone production server. The container listens on `0.0.0.0` using Render's `PORT` environment variable, defaulting to 10000. `/api/health` is the health check.

The Docker image uses Node.js 22, runs as the non-root `node` user, and includes the captured page content, local images, fonts, favicon, score fallback, and Next.js static assets. The Blueprint deploys new commits on `main` automatically. No database or persistent disk is required.

For manual Web Service setup, choose **Docker**, set Dockerfile Path to `./Dockerfile`, Docker Context to `.`, and Health Check Path to `/api/health`. Leave Docker Command blank so Render uses the image's `CMD`. Set `EXTERNAL_REDIRECT_URL` in the service environment. For an existing native Node service, change its runtime to Docker or create a new Docker service from this repository.

## Technical SEO

The canonical origin is hardcoded as `https://winbuzz-dsym.onrender.com` in `lib/seo.mjs` until the final domain is supplied. Canonicals, `/sitemap.xml`, and the sitemap reference in `/robots.txt` all use that single value. Change it in code and redeploy when switching to the final domain; no domain environment variable is needed.

The 105 content and blog-pagination routes use `index, follow` and self-referencing canonicals. All 164 tag archives plus the author/category archives remain `noindex, follow` and are excluded from the sitemap. The score widget, specification document, redirect endpoint and APIs carry noindex response headers. Robots.txt allows crawling so search engines can see noindex directives. Unknown routes return real 404 responses.

All 271 captured pages have unique titles and descriptions; blog pagination has page-specific metadata. Metadata changes do not alter the captured HTML, visible headings, styles, images, favicon or navigation. Duplicate article content is still present: metadata fixes do not replace editorial consolidation or original content work. Titles for eight duplicate article routes are distinguished; no article routes are redirected.

After deployment, inspect `/sitemap.xml` and `/robots.txt`, verify the chosen domain in Google Search Console, and submit the sitemap. Configure alternate hostnames with your host so the preferred custom domain is used consistently. Indexability does not guarantee ranking.

To verify a running production build, set `AUDIT_BASE_URL` to its URL and run `node scripts/check-seo.mjs`. The page-wise content plan and pre-change technical audit are retained in `docs/seo` as dated planning evidence, not current deployment results.

## Deploy on Vercel

Import `kabirr6044/winbuzz` from GitHub with framework preset **Next.js**, repository root as the root directory, Node.js **22.x**, build command `npm run build`, and the default output directory. No custom start command, port setting or `vercel.json` is required. Set only `EXTERNAL_REDIRECT_URL` to the intended complete destination URL. Apply environment-variable changes with a new deployment.

Vercel uses native Next.js output; Docker deployments retain standalone output. Explicit file tracing includes the captured JSON pages in the catch-all server function, so article routes can read their local content on Vercel. SSR, API routes, redirect behaviour, local assets and SEO metadata remain the same. Canonicals and sitemap URLs deliberately continue pointing to the current Render origin until it is changed in `lib/seo.mjs` after the final domain is supplied.

To build and test the container locally:

```sh
docker build -t winbuzz .
docker run --rm -p 10000:10000 -e EXTERNAL_REDIRECT_URL=https://example.com winbuzz
```

Open http://localhost:10000. Redirect destinations are runtime variables; do not pass credentials or `.env` files into the image build. `.dockerignore` excludes local environment files, dependencies, build output, and QA files from the build context.

Render setup references: [Docker deployment](https://render.com/docs/docker) and [Blueprint configuration](https://render.com/docs/blueprint-spec).

## Run

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open http://localhost:3000. Set `EXTERNAL_REDIRECT_URL` in `.env.local` to your chosen destination and restart the server. The default is https://example.com. All external navigation uses `/out`, which sends a 303 redirect to this server-side environment variable. Forms discard their values and redirect there too: no OTP, authentication, payment processing, or submission storage. Inputs have no name attributes, so values are not appended to redirect URLs.

The printable document is `docs/Winbuzz-website-specification.html`, also served at `/specification.html`. It lists all 271 captured routes and documents page contents, theme tokens, typography, language, assets, responsive layout, and interactions. A DOCX source is retained in `docs` but could not be visually rendered because this environment does not bundle LibreOffice.

```powershell
npm run build
npm start
npm run audit
```

The original external cricket iframe is rendered locally at `/scores`, using the provider's original CSS and downloaded Roboto/Lato fonts. `/api/scores` refreshes the public match feed every 30 seconds and uses the saved provider data if the feed is unavailable. All score-card and provider links use `/out`. No user information is sent to the score provider.

The review carousel uses the original downloaded Swiper library and source configuration: 400ms transitions, 20px spacing, 3000ms autoplay, container-based 1.2/2/3-slide breakpoints, drag/swipe, pagination, keyboard, navigation arrows, and pause on hover. Autoplay respects reduced motion. Analytics are removed. The source brand and copy are retained for the assignment; they belong to their respective owners.

Responsive browser evidence is saved in `docs/visual-qa/browser-audit.json`: all 271 routes were checked at 320, 375, 425, 768, 1024, 1280, 1440, and 1920px (2168 checks). Sixteen source layouts were compared at those widths for static text geometry, typography, colors, and corners. Mobile/tablet/desktop comparison screenshots are in the same folder. The direct viewport comparison with the third-party score provider was blocked by browser permission; the local widget was tested separately.
