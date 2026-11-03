# Ring Ceremony Invitation

An animated one-page invitation (gate-fold doors → curtains → names → scratch-the-heart date → countdown, events, venue, RSVP), plus an admin portal for sending **personal invitation links** on WhatsApp and tracking replies.

## Personalise

Edit **`invite.config.js`**: names, parents, date/time, welcome note, events, venue + Google Maps link, dress code, and the WhatsApp message that goes with each personal invite.

Optional files in `public/`:
- `couple.jpg` — photo shown under the date (hidden if missing)
- `music.mp3` — background music that starts when the card is opened (hidden if missing)

## Guest portal (`/admin`)

- Add guests one by one or paste a list (`Name, Phone, People` per line, or straight from Excel). 10-digit numbers get `+91` automatically.
- **Send on WhatsApp** opens WhatsApp with the guest's number and a ready message containing their personal link (`/i/xxxxxxxx`). Tap send, and they're marked *Sent*.
- Each personal link greets the guest by name and limits the RSVP to the number of people invited.
- The dashboard shows who has been sent the link, who opened it, who's coming (and how many), and their messages. Replies from the general link (`/`) are listed separately.

### One-time setup on Vercel

1. **Database:** Project → **Storage** → **Create Database** → **Neon** (free) → connect it to this project. This sets `DATABASE_URL`; the tables are created automatically.
2. **Password:** Project → **Settings** → **Environment Variables** → add `ADMIN_PASSWORD` with a strong password.
3. **Redeploy:** Deployments → ⋯ → Redeploy (or just push a commit).

Then open `https://<your-site>/admin`.

## Run locally

Create `.env.local` with `ADMIN_PASSWORD=something`, then run:

```bash
node node_modules/next/dist/bin/next dev
```

Without `DATABASE_URL`, local data is saved to `.data/db.json`. Open http://localhost:3000 and http://localhost:3000/admin.
