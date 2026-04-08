// ============================================================
// Core types — everything keyed by stable IDs
// ============================================================

export type Location = 'gym' | 'hotel';
export type WeekVariant = 'a' | 'b';
export type Unit = 'lb' | 'kg';
export type Theme = 'system' | 'light' | 'dark';

/** An exercise definition in the library. ID is stable forever. */
export interface Exercise {
  id: string;                    // stable key: e.g. 'trap_bar_dl'
  name: string;                   // display name
  category: 'push' | 'pull' | 'legs' | 'core' | 'cardio' | 'warmup';
  location: Location[];           // where it can be done
  spineSafe?: string;             // spine-safety note (badge)
  cues?: string;                  // coaching cue text
  gymRef?: string;                // for hotel variants that mirror a gym exercise
  compound?: boolean;             // true = warmup ramp gets generated
  defaultRestSec?: number;        // per-exercise rest override
}

/** A prescription — how this exercise is programmed today. */
export interface Prescription {
  exerciseId: string;
  sets: number;                   // target working sets
  repsLow: number;
  repsHigh: number;
  rx: string;                     // human-readable override e.g. "3×8–10"
  rpe?: number;                   // target RPE
  tempo?: string;                 // e.g. "3-1-2"
  cues?: string;                  // override the exercise's cue
  rest?: number;                  // override rest
  superset?: string;              // id of paired exercise for alternating sets
}

/** A swappable slot: pick one of the alternatives. */
export interface Slot {
  alternatives: Prescription[];
}

/** A single workout day. */
export interface Day {
  key: 'pull' | 'push' | 'legs' | 'core';
  label: string;
  weekday: string;                // preferred day-of-week
  icon: string;
  slots: Slot[];                  // variable number of exercise slots
}

/** A complete program variant (gym+week or hotel+week combo). */
export interface ProgramVariant {
  location: Location;
  week: WeekVariant;
  days: Day[];
}

/** A single logged set. */
export interface SetLog {
  id: string;                     // nanoid or timestamp+random
  sessionId: string;
  exerciseId: string;
  dayKey: string;                 // 'pull' | 'push' | 'legs' | 'core'
  date: number;                   // epoch ms
  index: number;                  // set index within the exercise that session
  weight: number | null;
  reps: number | null;
  rpe: number | null;             // 6-10, optional
  done: boolean;
  isPR?: boolean;
  isWarmup?: boolean;
  isCardio?: boolean;             // treadmill etc
  durationSec?: number;           // for cardio
}

/** An in-progress session (nothing persisted until ended). */
export interface ActiveSession {
  id: string;
  startedAt: number;
  dayKey: string;
  location: Location;
  week: WeekVariant;
  /** exerciseId + slotIndex -> set logs (in order) */
  exerciseSets: Record<string, SetLog[]>;
  /** selected alternative per slot */
  slotSelections: Record<number, number>;
  painBefore?: number;            // 1-10 low-back feel at start
  painAfter?: number;              // 1-10 at end
  notes?: string;
}

/** A finished session that lives in history. */
export interface CompletedSession extends ActiveSession {
  endedAt: number;
  durationSec: number;
  totalVolume: number;
  totalSets: number;
}

export interface Settings {
  location: Location;
  week: WeekVariant;
  unit: Unit;
  theme: Theme;
  defaultRestSec: number;
  autoProgression: boolean;       // suggest next weight
  warmupEnabled: boolean;         // auto-generate warmup ramp
  treadmillMin: number;           // pre-session walk duration
  syncCode?: string;              // cloud sync pairing code
}

export interface AppState {
  settings: Settings;
  sets: SetLog[];                 // FLAT set log — the source of truth
  sessions: CompletedSession[];
  active: ActiveSession | null;
  /** persistent slot selection across all sessions */
  slotSelections: Record<string, number>;  // key = `${loc}_${week}_${dayKey}_${slotIdx}`
}
