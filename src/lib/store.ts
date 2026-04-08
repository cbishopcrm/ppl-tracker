// ============================================================
// State store — single source of truth
// Persists to localStorage, reactive via Svelte stores
// ============================================================
import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import type { AppState, Settings, SetLog, ActiveSession, CompletedSession, Location, WeekVariant } from './types';
import { nanoid, epley1RM, bestE1RM, totalVolume, isPR as detectPR } from './calc';

const STORAGE_KEY = 'ppl:v2';

const defaultSettings: Settings = {
  location: 'gym',
  week: 'a',
  unit: 'lb',
  theme: 'system',
  defaultRestSec: 90,
  autoProgression: true,
  warmupEnabled: true,
  treadmillMin: 5
};

const defaultState: AppState = {
  settings: defaultSettings,
  sets: [],
  sessions: [],
  active: null,
  slotSelections: {}
};

function loadInitial(): AppState {
  if (!browser) return structuredClone(defaultState);
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultState);
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(defaultState),
      ...parsed,
      settings: { ...defaultSettings, ...(parsed.settings ?? {}) }
    };
  } catch (e) {
    console.warn('PPL: failed to load state', e);
    return structuredClone(defaultState);
  }
}

// ------------------------------------------------------------
// Main writable store
// ------------------------------------------------------------
export const state = writable<AppState>(loadInitial());

// Debounced persist
let saveTimer: ReturnType<typeof setTimeout> | null = null;
state.subscribe((s) => {
  if (!browser) return;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch (e) {
      console.warn('PPL: save failed', e);
    }
  }, 150);
});

// Apply theme when it changes
if (browser) {
  state.subscribe((s) => {
    const theme = s.settings.theme;
    const dark =
      theme === 'dark' ||
      (theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  });
  // Watch system preference changes
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const s = get(state);
    if (s.settings.theme === 'system') {
      document.documentElement.dataset.theme = e.matches ? 'dark' : 'light';
    }
  });
}

// ------------------------------------------------------------
// Setting mutations
// ------------------------------------------------------------
export function setSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
  state.update((s) => ({ ...s, settings: { ...s.settings, [key]: value } }));
}

// ------------------------------------------------------------
// Slot selection
// ------------------------------------------------------------
export function slotKey(loc: Location, wk: WeekVariant, dayKey: string, slotIdx: number): string {
  return `${loc}_${wk}_${dayKey}_${slotIdx}`;
}

export function selectAlt(dayKey: string, slotIdx: number, altIdx: number) {
  state.update((s) => {
    const key = slotKey(s.settings.location, s.settings.week, dayKey, slotIdx);
    return { ...s, slotSelections: { ...s.slotSelections, [key]: altIdx } };
  });
}

export function getAltIndex(s: AppState, dayKey: string, slotIdx: number): number {
  const key = slotKey(s.settings.location, s.settings.week, dayKey, slotIdx);
  return s.slotSelections[key] ?? 0;
}

// ------------------------------------------------------------
// Session lifecycle
// ------------------------------------------------------------
export function startSession(dayKey: string) {
  state.update((s) => {
    if (s.active) return s;
    const session: ActiveSession = {
      id: nanoid(),
      startedAt: Date.now(),
      dayKey,
      location: s.settings.location,
      week: s.settings.week,
      exerciseSets: {},
      slotSelections: {}
    };
    return { ...s, active: session };
  });
}

export function endSession(discard = false) {
  state.update((s) => {
    if (!s.active) return s;
    if (discard) {
      // Remove any logged sets tied to this session
      return {
        ...s,
        sets: s.sets.filter((x) => x.sessionId !== s.active!.id),
        active: null
      };
    }
    const mySets = s.sets.filter((x) => x.sessionId === s.active!.id && x.done);
    if (mySets.length === 0) {
      return {
        ...s,
        sets: s.sets.filter((x) => x.sessionId !== s.active!.id),
        active: null
      };
    }
    const completed: CompletedSession = {
      ...s.active,
      endedAt: Date.now(),
      durationSec: Math.round((Date.now() - s.active.startedAt) / 1000),
      totalVolume: totalVolume(mySets),
      totalSets: mySets.filter((x) => !x.isWarmup && !x.isCardio).length
    };
    return { ...s, active: null, sessions: [completed, ...s.sessions] };
  });
}

export function setPainBefore(v: number) {
  state.update((s) => (s.active ? { ...s, active: { ...s.active, painBefore: v } } : s));
}
export function setPainAfter(v: number) {
  state.update((s) => (s.active ? { ...s, active: { ...s.active, painAfter: v } } : s));
}
export function setSessionNotes(v: string) {
  state.update((s) => (s.active ? { ...s, active: { ...s.active, notes: v } } : s));
}

// ------------------------------------------------------------
// Set logging
// ------------------------------------------------------------
/** Add a new blank set for an exercise in the current session. */
export function addBlankSet(exerciseId: string, dayKey: string, opts: Partial<SetLog> = {}) {
  state.update((s) => {
    if (!s.active) return s;
    const existing = s.sets.filter(
      (x) => x.sessionId === s.active!.id && x.exerciseId === exerciseId
    );
    const newSet: SetLog = {
      id: nanoid(),
      sessionId: s.active.id,
      exerciseId,
      dayKey,
      date: Date.now(),
      index: existing.length,
      weight: null,
      reps: null,
      rpe: null,
      done: false,
      ...opts
    };
    return { ...s, sets: [...s.sets, newSet] };
  });
}

export function updateSet(id: string, patch: Partial<SetLog>) {
  state.update((s) => ({
    ...s,
    sets: s.sets.map((x) => (x.id === id ? { ...x, ...patch } : x))
  }));
}

export function removeSet(id: string) {
  state.update((s) => ({ ...s, sets: s.sets.filter((x) => x.id !== id) }));
}

export function toggleSetDone(id: string) {
  state.update((s) => {
    const set = s.sets.find((x) => x.id === id);
    if (!set) return s;
    const newDone = !set.done;
    let pr = false;
    if (newDone && set.weight && set.reps && !set.isWarmup && !set.isCardio) {
      const priorSets = s.sets.filter(
        (x) => x.exerciseId === set.exerciseId && x.id !== id && x.done && !x.isWarmup
      );
      pr = detectPR({ ...set, done: true }, priorSets);
    }
    return {
      ...s,
      sets: s.sets.map((x) =>
        x.id === id ? { ...x, done: newDone, isPR: pr || undefined } : x
      )
    };
  });
}

// ------------------------------------------------------------
// Derived helpers
// ------------------------------------------------------------
export function getSetsForExercise(s: AppState, exerciseId: string, sessionId?: string): SetLog[] {
  return s.sets.filter(
    (x) => x.exerciseId === exerciseId && (!sessionId || x.sessionId === sessionId)
  );
}

/** Last completed sets for an exercise (from history). */
export function lastCompletedSets(s: AppState, exerciseId: string): SetLog[] {
  const sessionsByDate = [...new Set(s.sets.filter((x) => x.exerciseId === exerciseId && x.done && !x.isWarmup).map((x) => x.sessionId))];
  if (sessionsByDate.length === 0) return [];
  // Find the most recent session with this exercise (that isn't the active one)
  const activeId = s.active?.id;
  const eligible = s.sets
    .filter((x) => x.exerciseId === exerciseId && x.done && !x.isWarmup && x.sessionId !== activeId)
    .sort((a, b) => b.date - a.date);
  if (eligible.length === 0) return [];
  const mostRecentSession = eligible[0].sessionId;
  return eligible
    .filter((x) => x.sessionId === mostRecentSession)
    .sort((a, b) => a.index - b.index);
}

export function bestE1RMForExercise(s: AppState, exerciseId: string): number {
  return bestE1RM(s.sets.filter((x) => x.exerciseId === exerciseId));
}

// ------------------------------------------------------------
// Data IO
// ------------------------------------------------------------
export function exportJSON(): string {
  return JSON.stringify(get(state), null, 2);
}

export function importJSON(raw: string): boolean {
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return false;
    if (!parsed.settings || !Array.isArray(parsed.sets)) return false;
    state.set({
      ...structuredClone(defaultState),
      ...parsed,
      settings: { ...defaultSettings, ...parsed.settings }
    });
    return true;
  } catch {
    return false;
  }
}

export function resetAll() {
  if (browser) localStorage.removeItem(STORAGE_KEY);
  state.set(structuredClone(defaultState));
}

// ------------------------------------------------------------
// Derived stores
// ------------------------------------------------------------
export const settings = derived(state, (s) => s.settings);
export const activeSession = derived(state, (s) => s.active);
export const weekStats = derived(state, (s) => {
  const weekAgo = Date.now() - 7 * 86400000;
  const recent = s.sets.filter((x) => x.date >= weekAgo && x.done);
  let vol = 0;
  let sets = 0;
  for (const set of recent) {
    if (set.isWarmup || set.isCardio) continue;
    if (!set.weight || !set.reps) continue;
    vol += set.weight * set.reps;
    sets++;
  }
  const sessionDates = s.sessions
    .filter((x) => x.startedAt >= weekAgo)
    .map((x) => x.startedAt);
  return { volume: Math.round(vol), sets, sessionsThisWeek: sessionDates.length };
});
