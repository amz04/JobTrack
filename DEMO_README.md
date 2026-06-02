# JobTrack — Demo Build (fully working, no backend)

Everything runs **in the browser**. No server, no database, no API calls.
All data lives in a single in-browser store and **persists to `localStorage`**,
so your changes survive a page refresh.

## Run it

```bash
pnpm install
pnpm dev
```

Then open the URL it prints (usually http://localhost:3000).

## What actually works

- **Dashboard** — "Easy Apply / Apply Now" on a recommended job actually adds it
  to your tracker, the stat cards tick up live, the status breakdown updates, and
  the button changes to "✓ Applied". The CV card takes a real file and shows its name.
- **Deadlines** — live countdown (always correct for today's date), "Mark complete"
  removes a deadline, and "+ Add Deadline" creates a new one with auto urgency.
- **Inbox** — opening an email marks it read (the unread badge drops), "Reply" opens
  a composer with quick-reply templates, and "Archive" removes the email.
- **Settings** — edit your profile (the dashboard greeting updates to match), flip
  notification toggles, connect/disconnect platforms, and switch dark/light mode.
- **Reminder banner** — if a deadline is due within 2 days, a banner appears on load
  (respects the "Deadline Reminders" toggle in Settings).

## Demo controls

- **Reset Demo** (bottom of the sidebar) restores the original starting data.
  Press it right before you present so you always start from a clean state.

## How it's built (in case you're asked)

This is a frontend prototype with mock data. The store lives in
`client/src/contexts/AppDataContext.tsx`; the seed data is in `client/src/lib/data.ts`.
To change the starting content, edit `data.ts` and bump `STORE_VERSION` in the context
so old saved state is discarded.
