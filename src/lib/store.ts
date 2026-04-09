// ============================================================
// State store — single source of truth
// Persists to localStorage, reactive via Svelte stores
// ============================================================
import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import type {
  AppState,
  Settings,
  SetLog,
  ActiveSession,
  CompletedSession,
  Location,
  WeekVariant,
  BodyWeightLog,
  UndoEntry
} from './types';
import { nanoid, totalVolume, isPR as detectPR, bestE1RM } from './calc';

const STORAGE_KEY = 'ppl:v2';

const defaultSettings: Settings = {
  location: 'gym',
  week: 'a',
  unit: 'lb',
  defaultRestSec: 90,
  autoProgression: true,
  warmupEnabled: true,
  hapticsEnabled: true,
  cardio: { enabled: true, type: 'treadmill', durationMin: 5 }
};

const defaultState: AppState = {
  settings: defaultSettings,
  sets: [],
  sessions: [],
  active: null,
  slotSelections: {},
  bodyWeights: [],
  nextDayIndex: 0
};

function loadInitial(): AppState {
  if (!browser) return structuredClone(defaultState);
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultState);
    const parsed = JSON.parse(raw);
    // Migration: old shape stored treadmillMin at top of settings
    const migratedSettings = { ...defaultSettings, ...(parsed.settings ?? {}) };
    if (parsed.settings && 'treadmillMin' in parsed.settings) {
      migratedSettings.cardio = {
        enabled: parsed.settings.treadmillMin > 0,
        type: 'treadmill',
        durationMin: parsed.settings.treadmillMin || 5
      };
    }
    if (!migratedSettings.cardio || typeof migratedSettings.cardio !== 'object') {
      migratedSettings.cardio = { enabled: true, type: 'treadmill', durationMin: 5 };
    }
    return {
      ...structuredClone(defaultState),
      ...parsed,
      settings: migratedSettings,
      bodyWeights: Array.isArray(parsed.bodyWeights) ? parsed.bodyWeights : []
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

// Dark-only — force it on the root element once.
if (browser) {
  document.documentElement.dataset.theme = 'dark';
}

// ------------------------------------------------------------
// Haptics helper
// ------------------------------------------------------------
export function haptic(pattern: number | number[] = 30) {
  if (!browser) return;
  if (!get(state).settings.hapticsEnabled) return;
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try { navigator.vibrate(pattern); } catch {}
  }
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
      slotSelections: {},
      skippedSlots: []
    };
    return { ...s, active: session };
  });
  haptic(20);
}

export function endSession(discard = false) {
  state.update((s) => {
    if (!s.active) return s;
    if (discard) {
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
    // Advance to next day in the PPL sequence
    const nextIdx = (s.nextDayIndex + 1) % 4;
    return { ...s, active: null, sessions: [completed, ...s.sessions], nextDayIndex: nextIdx };
  });
  haptic([60, 40, 60, 40, 100]);
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

export function skipSlot(slotIdx: number) {
  state.update((s) => {
    if (!s.active) return s;
    const skipped = new Set(s.active.skippedSlots ?? []);
    skipped.add(slotIdx);
    return { ...s, active: { ...s.active, skippedSlots: Array.from(skipped) } };
  });
}

export function unskipSlot(slotIdx: number) {
  state.update((s) => {
    if (!s.active) return s;
    return {
      ...s,
      active: {
        ...s.active,
        skippedSlots: (s.active.skippedSlots ?? []).filter((i) => i !== slotIdx)
      }
    };
  });
}

// ------------------------------------------------------------
// Set logging
// ------------------------------------------------------------
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

/** Buffer of recently-deleted items for undo. */
export const undoBuffer = writable<UndoEntry[]>([]);
const UNDO_MS = 5000;

export function removeSet(id: string) {
  const cur = get(state).sets.find((s) => s.id === id);
  if (!cur) return;
  state.update((s) => ({ ...s, sets: s.sets.filter((x) => x.id !== id) }));
  // Push to undo buffer
  const entry: UndoEntry = {
    id: nanoid(),
    expiresAt: Date.now() + UNDO_MS,
    label: 'Set deleted',
    type: 'set-delete',
    payload: cur
  };
  undoBuffer.update((b) => [...b, entry]);
  setTimeout(() => {
    undoBuffer.update((b) => b.filter((e) => e.id !== entry.id));
  }, UNDO_MS);
}

export function performUndo() {
  const entries = get(undoBuffer);
  if (entries.length === 0) return;
  const last = entries[entries.length - 1];
  if (last.type === 'set-delete') {
    state.update((s) => ({ ...s, sets: [...s.sets, last.payload] }));
  }
  undoBuffer.update((b) => b.filter((e) => e.id !== last.id));
}

export function toggleSetDone(id: string) {
  let didMarkPR = false;
  state.update((s) => {
    const set = s.sets.find((x) => x.id === id);
    if (!set) return s;
    const newDone = !set.done;
    let pr = false;
    if (newDone && set.weight && set.reps && !set.isWarmup && !set.isCardio && !set.isTime) {
      const priorSets = s.sets.filter(
        (x) => x.exerciseId === set.exerciseId && x.id !== id && x.done && !x.isWarmup
      );
      pr = detectPR({ ...set, done: true }, priorSets);
      if (pr) didMarkPR = true;
    }
    return {
      ...s,
      sets: s.sets.map((x) =>
        x.id === id ? { ...x, done: newDone, isPR: pr || undefined } : x
      )
    };
  });
  if (didMarkPR) haptic([40, 30, 40, 30, 80]);
  else haptic(25);
}

// ------------------------------------------------------------
// Body weight
// ------------------------------------------------------------
export function logBodyWeight(weight: number) {
  if (!weight || weight <= 0) return;
  const entry: BodyWeightLog = {
    id: nanoid(),
    date: Date.now(),
    weight
  };
  state.update((s) => ({
    ...s,
    bodyWeights: [entry, ...s.bodyWeights]
  }));
}

export function removeBodyWeight(id: string) {
  state.update((s) => ({ ...s, bodyWeights: s.bodyWeights.filter((b) => b.id !== id) }));
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
      settings: { ...defaultSettings, ...parsed.settings },
      bodyWeights: Array.isArray(parsed.bodyWeights) ? parsed.bodyWeights : []
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
    if (set.isWarmup || set.isCardio || set.isTime) continue;
    if (!set.weight || !set.reps) continue;
    vol += set.weight * set.reps;
    sets++;
  }
  return { volume: Math.round(vol), sets };
});
