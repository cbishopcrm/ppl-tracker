# PPL Tracker

A spine-safe Push / Pull / Legs workout tracker. Based on the [Athlean-X PPL](https://learn.athleanx.com/articles/push-pull-legs-routine-the-complete-guide) routine with L4/L5-friendly modifications (McGill, Squat University, Contreras).

**Live:** https://ppl-tracker-sooty.vercel.app

## Features

### Program
- **4 days × 2 weeks × 2 locations** — Pull / Push / Legs / Core × Week A/B × Gym/Hotel
- **3 swappable alternatives** per slot, every one with spine-safety notes
- **Stable exercise IDs** — rename an exercise without losing history
- **5-minute treadmill warmup** auto-included at the start of every session

### Tracking
- **Set-by-set logging** with a custom number pad (big keys, auto-advance, plate math)
- **Auto warmup ramp** for compound lifts (4 sets based on working weight)
- **Progression suggester** — +5 lb if you hit all reps, −5 lb if you missed all, hold otherwise
- **PR detection** with e1RM (Epley) comparison
- **Per-exercise sparklines** showing estimated 1RM over time
- **Pain / symptom log** — rate low-back feel pre and post session
- **Deload detector** — flags when progression has plateaued or overshot
- **Auto rest timer** — starts on set complete, vibrates at zero, ±15s adjust

### UX
- **Editorial dark + light mode** — warm cream/amber aesthetic, Fraunces display serif
- **PWA** — installable, works offline
- **Stat strip** — streak, weekly volume, weekly sets
- **History** — every completed session with volume / sets / duration
- **JSON export / import** and **cloud sync** (optional, requires Vercel KV)
- **Zero backend required** — all data in `localStorage` by default

## Stack

- **SvelteKit** + **TypeScript** — reactive components, zero runtime errors from typed state
- **Vitest** — 29 unit tests on pure calc utils (1RM, plate math, warmup, progression, deload, PR detection)
- **Vercel KV** (optional) — cloud sync via `/api/sync`
- Deployed to Vercel with `@sveltejs/adapter-vercel`

## Architecture

```
src/
├── lib/
│   ├── types.ts              # Exercise, Program, SetLog, Settings
│   ├── data/
│   │   ├── exercises.ts      # Library keyed by stable IDs
│   │   └── program.ts        # Program structure (references IDs)
│   ├── calc.ts               # Pure calculation utilities
│   ├── store.ts              # Reactive state (flat set log + sessions)
│   └── components/           # All Svelte components
└── routes/
    ├── +page.svelte          # Main workout view
    ├── +layout.svelte
    └── api/sync/+server.ts   # Cloud sync endpoint
```

### Data model

The set log is **flat**:

```ts
interface SetLog {
  id: string;
  sessionId: string;
  exerciseId: string;       // stable ID
  dayKey: string;
  date: number;
  index: number;
  weight: number | null;
  reps: number | null;
  rpe: number | null;
  done: boolean;
  isPR?: boolean;
  isWarmup?: boolean;
  isCardio?: boolean;
  durationSec?: number;
}
```

Querying "last 5 bench sessions", "best e1RM for deadlift", etc. is a one-liner on `state.sets.filter(...)`.

## Development

```bash
npm install
npm run dev    # http://localhost:3737
npm test       # Vitest
npm run build  # production build
```

### Enabling cloud sync

1. Add the Vercel KV (or any Upstash Redis) integration to your Vercel project.
2. Redeploy. The `/api/sync` endpoint will start returning `{ ok: true }`.
3. Hit "Check cloud status" in settings to verify.

Without KV configured, `/api/sync` returns `{ ok: false, message: "Cloud sync not configured" }` and the app continues working normally via localStorage.
