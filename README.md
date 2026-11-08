# Internet Museum

A living museum of the internet. 218 curated exhibits span seven collections, with a 1960s–2020s timeline, live Wikipedia search and reading, related-article trails, bookmarks, and recommendations that adapt to visitor interests.

## Run

No build, API key, account, database or npm packages are required. Serve `dist/` using any static web server (for example `python3 -m http.server 8080 --directory dist`) and open the resulting URL. Direct file:// access may prevent cross-origin requests; use a web server.

## Publish on GitHub Pages

In repository **Settings → Pages → Build and deployment**, select **GitHub Actions**. The included workflow publishes `dist/` on pushes to main. Run **Actions → Deploy Internet Museum → Run workflow** after enabling Pages if the initial run occurred before configuration.

All asset paths are relative, so the site supports project subpaths. Any static hosting provider can serve dist unchanged.

## How smart learning works

This is a transparent local recommendation engine, not a trained large language model. Opening an exhibit increases its collection's score; matching search terms add smaller weights. Unseen entries are ranked by those interest weights. New Wikipedia search results are retained in a local **Discovered** gallery capped at 300 entries. Searches return up to 20 Wikipedia matches per request and may include subjects beyond internet history.

The browser stores interests, up to 100 visited titles, 30 recent search terms, discoveries and bookmarks under `internet-museum-v1` in localStorage. **Pause learning** stops new interest/discovery updates. **Reset interests** clears search terms, interests, viewing history and discovered entries while preserving bookmarks. Browser site-data removal clears all saved data. Storage failures fall back to session-only behaviour. There is no shared server-side learning, user authentication or cross-device sync.

## Wikipedia integration

The site calls the English Wikipedia MediaWiki Action API directly with anonymous CORS requests. Search uses generator=search; reading uses TextExtracts, links, pageimages and info. Extracts are cached in memory for the current page session. Requests have a 15-second timeout; failures show useful fallback links and retry controls. Text is rendered as escaped plain text. External HTML is never injected.

Each article includes source attribution, a CC BY-SA 4.0 notice and a link to the full Wikipedia article and its revision history. Article images, where provided, have their own licences; consult the source article's image description page for authorship and reuse terms. This project is independent of Wikipedia and Wikimedia.

Museum descriptions and artwork are original. Dates represent curatorial timeline placements, sometimes a formative event rather than an exact launch date. Consult live source articles for detailed chronology. Entries are selected exhibits, not a claim to exhaustively document the whole internet.

## Privacy and external requests

No analytics or tracking service is included. Search and reading requests go to Wikipedia; optional article thumbnails come from Wikimedia. Fonts load from Google Fonts. These providers receive standard connection information, including IP addresses. There is no API secret in the browser.

## Contribute

Edit `dist/catalog.js` to add exhibit tuples: `[year, Wikipedia article title, visual label, original description]` inside the appropriate collection. Use the exact Wikipedia title, check dates and descriptions against reliable sources, and avoid duplicate titles. Expand styles in `dist/style.css` and behaviour in `dist/app.js`.

## Verification

JavaScript syntax and catalog uniqueness have been checked. Browser checks cover live Wikipedia article loading, live search, bookmark persistence, discovered-article persistence, and learning pause controls. The responsive layout uses breakpoints at 1000px and 700px; dedicated device testing is still recommended.

## Licence

Original code and curatorial descriptions: MIT, see LICENSE. Wikipedia content is separately licensed under CC BY-SA 4.0 and applicable additional terms; image licences vary. Fonts retain their respective licences.
