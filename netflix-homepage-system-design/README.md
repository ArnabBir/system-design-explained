# Frame — Netflix Homepage System Design Playbook

A responsive, interactive learning app for a Netflix-style homepage architecture. Built with React, TypeScript, Vite, and Lucide icons.

## Run

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. To build and preview:

```sh
npm run build
npm run preview
```

## Explore

- Ten detailed chapters covering requirements, request flows, personalization, APIs, caching, event pipelines, resilience, and experiments.
- Clickable architecture components with inputs, outputs, failure behavior, and deep-dive links.
- A playable six-step request journey and four explanatory failure/load scenarios.
- Expandable learning cards, chapter search (⌘/Ctrl K), bookmarks, and completion tracking.
- Responsive navigation, keyboard-accessible dialogs, reduced-motion support, and browser-local persistence.

## Content boundaries

This is an independent educational reference architecture, not Netflix's internal production blueprint. Latencies, scale estimates, API schemas, topology, and scenarios are explicitly illustrative. Scenarios explain design decisions; they do not run a backend or real performance simulation. Public references are available through **Sources & design notes** in the app.

Artwork is CSS-generated. Google Fonts are optional; system fonts provide fallbacks. No backend, credentials, or environment configuration is needed. Bookmarks and completion are stored only in the current browser.
