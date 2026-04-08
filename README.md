# PPL Tracker

A spine-safe Push / Pull / Legs workout tracker. Based on the [Athlean-X PPL](https://learn.athleanx.com/articles/push-pull-legs-routine-the-complete-guide) routine with L4/L5-friendly modifications (McGill, Squat University, Contreras).

**Live:** _deployed on Vercel_

## Features

- **4 days:** Pull · Push · Legs · Core (with auto-select by weekday)
- **Weeks A / B** for variation
- **Gym** and **Hotel** (DB + bands) modes
- **Alternatives:** 3 swappable options per exercise with spine-safe notes
- **Set-by-set logging:** weight × reps per set, tap to complete
- **Auto rest timer** with vibration when done
- **Previous workout shown** as placeholder — progressive overload at a glance
- **PR detection** with celebratory toast
- **Streak + weekly volume + sets** stats
- **Full history** of all sessions
- **JSON export / import** for backup
- **PWA:** installable, works offline
- **Zero backend** — all data in `localStorage`

## Stack

- Plain HTML / CSS / vanilla JS (no framework, no build step)
- Service worker for offline support
- Deployed to Vercel as a static site

## Local dev

```bash
# any static server works
python -m http.server 3000
# or
npx serve .
```

Open `http://localhost:3000`.

## Deploy

```bash
vercel --prod
```

## Data

All workout data lives in `data.js`. Tweak reps/sets/exercises there to customize.
