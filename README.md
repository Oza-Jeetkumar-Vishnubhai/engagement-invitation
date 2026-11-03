# Ring Ceremony Invitation

A one-page animated invitation: gate-fold doors with a "Tap to open" seal → curtains draw back → names → scratch-the-heart date reveal with confetti → countdown, events, venue, dress code, RSVP.

## Personalise

Edit **`invite.config.js`**: names, parents, date/time, welcome note, events, venue + Google Maps link, dress code, RSVP WhatsApp number.

Optional files in `public/`:
- `couple.jpg` — photo shown under the date (hidden if missing)
- `music.mp3` — background music that starts when the card is opened (the toggle is hidden if missing)

## Run locally

```bash
node node_modules/next/dist/bin/next dev
```

Open http://localhost:3000 (use your browser's phone view for the real feel).

## Publish and share

```bash
node node_modules/next/dist/bin/next build
```

This writes a static site to `out/`. Upload that folder to any static host — e.g. Netlify (drag & drop at app.netlify.com/drop) or Vercel — and share the link on WhatsApp.
