# A Seat at the Table

An English-language business dining guide for University of Arizona students. An independent educational project by Omar Quispe Avalos.

## Run locally

Use Node.js **24.x** and npm. The version is pinned in `package.json` and `.nvmrc`:

```powershell
npm ci
$env:ASTRO_TELEMETRY_DISABLED='1'
npm run dev
```

Open the printed local URL, normally http://127.0.0.1:4321/.

## Build and verify

```powershell
npm run build
npm test
npm run preview
# In a second terminal, against the running preview:
npx playwright test
```

The browser suite uses installed Microsoft Edge by default. Set `PLAYWRIGHT_CHANNEL=chrome` for installed Chrome. `TEST_BASE_URL` overrides the origin for every browser test, including no-JavaScript checks. Run it only against a local preview or an already-approved deployment; the tests do not publish anything.

## Architecture

Astro prerenders 14 documents: homepage, chapter index, six chapters, table, dinner, survey, resources, assignment submission, and 404. React hydrates the three learning activities and the shared dining-room scene on the homepage. Educational content is in Markdown; scenario, survey, table, and source data are typed. State is in memory and no survey answers are collected, persisted, or sent to an API. Content and static activity reference guides work without JavaScript.

Three.js builds an original guided dining room with 17 selectable objects. GSAP coordinates interruptible camera travel and activity feedback; keyboard input and reduced motion skip camera travel. The 3D engine is dynamically imported only on home/table. Rendering runs on demand. A vector-rendered 3D view recovers when WebGL is unavailable, and an accessible 2D SVG map remains available. Fonts are self-hosted. `public/licenses` contains the font licenses. Photo provenance and educational citations are on `/resources/`; the editorial images are AI-generated illustrations of a fictional setting; the diagram provides instructional positions. Carreño provides the historical foundation, with contemporary university and etiquette sources supplying current professional context.

## Assignment checklist

| Rubric item | Points | Evidence |
| --- | ---: | --- |
| Internal link | 10 | Real links between homepage, chapters and activities |
| External link | 10 | Linked educational institutions and reference pages |
| Graphic | 10 | Original 3D dining room, 17-element SVG setting, rendered stills and disclosed AI-generated editorial illustrations |
| Advanced feature | 20 | Six-decision recruiting-dinner simulation, feedback and final review |
| Basic website design | 30 | Responsive layouts, readable type, navigation, whitespace and keyboard access |
| References | 5 | Contextual source links, bibliography, credits and consultation date |
| Spelling and grammar | 5 | Original English educational copy |
| General style | 10 | Consistent cinematic dining room and editorial visual identity |
| Learning survey | Required | Ten published questions: six knowledge, two confidence, two reflection |
| Submission form | Required | `/submission/`, personalized for Omar Quispe Avalos and printable |

The deadline is not in the supplied documents. Verify it in D2L: late submission carries a 10-point deduction. The form is personalized for Omar Quispe Avalos. On local previews its URL remains blank and printing is blocked until a public HTTPS address is entered. Validation rejects local/private addresses; it does not prove that a remote address is live or accessible. Confirm the final address without signing in before submission. The standard completed form fits one A4 sheet; edited text prints in full. Uploading the form to D2L remains the student's action.

## Hosting

The source is prepared for Vercel: Node `24.x`, framework `astro`, build `npm run build`, output `dist`. **Do not link a new project, push to a deployment branch, or publish without the user's explicit approval.** Production was updated and verified anonymously on November 9, 2026: https://a-seat-at-the-table-opal.vercel.app. See DEPLOYMENT.md and AUDIT-RELEASE.md for evidence and manual limitations. After future approved deployments, verify anonymous access, internal pages, and assets before marking publication complete. Keep account credentials and claim secrets out of the repository.

## Verification limits

Automated axe checks are a useful accessibility screen, not formal certification. Browser checks cover current Edge, keyboard operation, local form behavior, reduced motion, no-JavaScript reading, and 320/390/768/1440px layouts. Other browser engines still warrant a manual spot check before a high-stakes release.

## Regenerating scene artwork

Run the production preview, then run `node scripts/capture-dining-stills.mjs` (requires installed Edge by default). This renders the original scene into four optimized WebP assets. Rebuild afterward. TEST_BASE_URL and PLAYWRIGHT_CHANNEL override the preview origin and browser. See REVIEW-DESIGN.md and VALIDATION.md for the latest review and checks.
