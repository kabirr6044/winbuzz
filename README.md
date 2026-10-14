# Winbuzz assignment replica

Next.js App Router replica of the public pages at officialwinbuzz.com, captured on 13 October 2026. Reference content and styles are stored locally in `reference/pages`; images and fonts are in `public/assets`. No WordPress server is required.

## Deploy on Render

1. In Render, select **New > Blueprint** and connect `https://github.com/kabirr6044/winbuzz`.
2. Select the `main` branch. Render reads `render.yaml` and creates the `winbuzz` Docker web service in Singapore using the free plan.
3. Enter your chosen destination for `EXTERNAL_REDIRECT_URL` when prompted. Use a complete `https://` URL. This single variable controls every external link and form submission.
4. Deploy. Render builds the root `Dockerfile`, which installs locked dependencies and creates a Next.js standalone production server. The container listens on `0.0.0.0` using Render's `PORT` environment variable, defaulting to 10000. `/api/health` is the health check.

The Docker image uses Node.js 22, runs as the non-root `node` user, and includes the captured page content, local images, fonts, favicon, score fallback, and Next.js static assets. The Blueprint deploys new commits on `main` automatically. No database or persistent disk is required.

For manual Web Service setup, choose **Docker**, set Dockerfile Path to `./Dockerfile`, Docker Context to `.`, and Health Check Path to `/api/health`. Leave Docker Command blank so Render uses the image's `CMD`. Set `EXTERNAL_REDIRECT_URL` in the service environment. For an existing native Node service, change its runtime to Docker or create a new Docker service from this repository.

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
