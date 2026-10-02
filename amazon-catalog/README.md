# Catalog — an interactive system design fieldguide

An independent educational application about an Amazon-style catalog. Eight chapters cover identity, ingestion, quality, canonical storage, discovery, page composition and recovery. This is a proposed reference architecture, not documentation of Amazon's private implementation.

## Run

```sh
npm install
npm run dev
```

## Production

```sh
npm run build
npm run preview
```

## Browser checks

With the dev server running, run `npx playwright test --workers=1`.
The test configuration defaults to port 5174 and the installed macOS Google Chrome binary.
Override `BASE_URL` and `CHROME_PATH` for other environments, for example:

```sh
BASE_URL=http://127.0.0.1:5173 CHROME_PATH=/path/to/chrome npx playwright test --workers=1
```

The suite checks content/graph integrity, bookmarks and progress after reload, corrupt storage, search-filter reset, journey controls, recovery math, chapter exercises, mobile focus management and horizontal overflow. Screenshots are written to the ignored `test-results/` directory.

React + TypeScript + Vite, with Lucide icons and plain CSS. No backend required. Fonts have local system fallbacks; product artwork is CSS and diagrams are SVG.

## Explore

- Search full chapter content (Cmd/Ctrl+K focuses search); saved-only filtering is reset by a general search.
- Expand concept cards and engineering failure notes.
- Select diagram components and play, pause, restart or step through a product update.
- Change outage duration and recovery throughput in the index-lag lab. Calculations assume constant arrival/service rates; all inputs are illustrative.
- Bookmark chapters and track completion. URL hashes support deep links and browser history.
- Mobile navigation supports Escape and focus containment; the graph uses the same topology at every viewport size with labeled horizontal scrolling.

## Data and evidence

`src/content.ts` holds chapters, source ledger, stable node and edge IDs, and journey steps. `src/Graph.tsx` resolves connectors from IDs. Counts, reading time and progress are derived from the content.

Public API facts are attributed to Amazon's Catalog Items and Listings Items documentation; the transactional outbox discussion is grounded in AWS Prescriptive Guidance. Exact URLs, claim scopes and read status appear in the app source notes and content ledger. Bottle SKUs and revision numbers are illustrative, not actual Amazon records.

Bookmarks and completion live in browser storage under `catalog-fieldguide:v1`. Invalid JSON and unknown chapter IDs are ignored; unavailable storage falls back to session memory. Clear this key in browser developer tools to reset progress. No account or analytics service is involved.
