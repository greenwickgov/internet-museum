# Internet Museum

A walk-through museum of internet history. Seven halls, 42 exhibits, live Wikipedia search and reading, Google search links (and optional in-page Google results), a guided audio tour and a personal collection.

## Run locally

No build step, no packages, no account. Serve `dist/` with any static server:

```
python3 -m http.server 8080 --directory dist
```

Open http://localhost:8080. Opening `index.html` straight from disk can block Wikipedia requests, so use a server.

## Publish on GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings → Pages → Build and deployment** and choose **GitHub Actions**.
3. Push to `main`, or run **Actions → Deploy Internet Museum → Run workflow**.

Asset paths are relative, so project sub-paths work. The workflow checks the catalog before deploying.

## What's inside

- **Halls and exhibits.** Each exhibit has a curator note, a "Look closer" detail, a live Wikipedia extract and image, and links to Google, Google News and Scholar. The progress count on each hall door shows how many you have visited.
- **Guided tour.** *Start the guided tour* in any hall reads each exhibit aloud with the browser's speech synthesis and moves on automatically. *Listen* reads a single exhibit. Browsers without speech synthesis simply hide the audio buttons.
- **Surprise me** opens a random exhibit.
- **Search that builds exhibits.** Type in the top bar (or press `/`). Wikipedia results appear as you type, with thumbnails and summaries. Press **Enter**, or choose *Build an exhibition from these results*, and the matches become framed exhibits in a new gallery room. They are also kept in a **Discovered** hall (up to 300) on the lobby. If the main Wikipedia API fails, search falls back to Wikipedia's REST search automatically. The Google tab offers one-click Google, Google + Wikipedia, News, Images and Scholar searches.
- **Google results in the page (optional).** Create a Programmable Search Engine and an API key at Google, then paste both into the Google tab. They are stored only in this browser's localStorage and sent only to Google's Custom Search API.
- **My collection.** Save exhibits from their placards. Saved and visited items live in localStorage under keys starting `im2-`.

## Add an exhibit

Edit `dist/catalog.js` and add a tuple to a hall:

```js
[year, "Exact Wikipedia title", "Short label", "Curator note", "Look closer detail"]
```

Then run `node scripts/validate-catalog.js` to check for gaps and duplicate titles. Museum notes are original; please check dates against reliable sources.

## Privacy

No analytics or tracking. Search and reading requests go to Wikipedia; thumbnails come from Wikimedia; fonts come from Google Fonts; optional Google results go to Google. Those providers receive standard connection information such as IP addresses. No API secret is shipped in the code.

## Licence

Code and museum notes: MIT (see `LICENSE`). Wikipedia text is CC BY-SA 4.0; image licences vary, so check the source article. This project is independent of Wikipedia, Wikimedia and Google.
