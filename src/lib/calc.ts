// ============================================================
// Pure calculation utilities — tested via Vitest
// ============================================================
import type { SetLog, Prescription, Exercise } from './types';

// ------------------------------------------------------------
// Estimated 1RM (Epley formula)
// ------------------------------------------------------------
export function epley1RM(weight: number, reps: number): number {
  if (weight <= 0 || reps <= 0) return 0;
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
}

export function bestE1RM(sets: SetLog[]): number {
  let best = 0;
  for (const s of sets) {
    if (!s.done || !s.weight || !s.reps) continue;
    const e = epley1RM(s.weight, s.reps);
    if (e > best) best = e;
  }
  return best;
}

// ------------------------------------------------------------
// Plate math — figure out what to load on each side of a bar
// ------------------------------------------------------------
export const PLATES_LB = [45, 35, 25, 10, 5, 2.5];
export const PLATES_KG = [25, 20, 15, 10, 5, 2.5, 1.25];
export const BAR_LB = 45;
export const BAR_KG = 20;

export function platesPerSide(target: number, unit: 'lb' | 'kg', bar?: number): number[] {
  const barWeight = bar ?? (unit === 'lb' ? BAR_LB : BAR_KG);
  const plates = unit === 'lb' ? PLATES_LB : PLATES_KG;
  let remaining = (target - barWeight) / 2;
  if (remaining <= 0) return [];
  const result: number[] = [];
  for (const p of plates) {
    while (remaining >= p - 0.001) {
      result.push(p);
      remaining -= p;
    }
  }
  return result;
}

// ------------------------------------------------------------
// Warmup ramp set generator
// ------------------------------------------------------------
export interface RampSet {
  weight: number;
  reps: number;
  isWarmup: true;
}

/** Generate 4 warmup ramp sets for a compound lift. Rounds to nearest 5 lb / 2.5 kg. */
export function warmupRamp(
  workingWeight: number,
  unit: 'lb' | 'kg' = 'lb',
  bar?: number
): RampSet[] {
  const barWeight = bar ?? (unit === 'lb' ? BAR_LB : BAR_KG);
  if (workingWeight <= barWeight) return [];
  const step = unit === 'lb' ? 5 : 2.5;
  const round = (w: number) => Math.max(barWeight, Math.round(w / step) * step);
  return [
    { weight: barWeight, reps: 8, isWarmup: true },
    { weight: round(workingWeight * 0.5), reps: 5, isWarmup: true },
    { weight: round(workingWeight * 0.7), reps: 3, isWarmup: true },
    { weight: round(workingWeight * 0.85), reps: 1, isWarmup: true }
  ];
}

// ------------------------------------------------------------
// Progression suggester
// Returns a suggestion for next working weight based on last session's performance
// ------------------------------------------------------------
export interface ProgressionSuggestion {
  weight: number;
  delta: number;
  reason: 'hit_all' | 'missed_all' | 'mixed' | 'no_data';
}

export function suggestNextWeight(
  prevSets: SetLog[],
  rx: Prescription,
  unit: 'lb' | 'kg' = 'lb'
): ProgressionSuggestion | null {
  const done = prevSets.filter((s) => s.done && s.weight != null && s.reps != null);
  if (done.length === 0) return null;

  const step = unit === 'lb' ? 5 : 2.5;
  const lastWeight = done[0].weight!;
  const hitAll = done.length >= rx.sets && done.every((s) => (s.reps ?? 0) >= rx.repsLow);
  const missedAll = done.every((s) => (s.reps ?? 0) < rx.repsLow);

  if (hitAll && done.every((s) => (s.reps ?? 0) >= rx.repsHigh)) {
    return { weight: lastWeight + step, delta: step, reason: 'hit_all' };
  }
  if (missedAll) {
    return { weight: Math.max(step, lastWeight - step), delta: -step, reason: 'missed_all' };
  }
  return { weight: lastWeight, delta: 0, reason: 'mixed' };
}

// ------------------------------------------------------------
// Deload detector
// Suggest a deload if: 3+ consecutive successful weeks OR 2+ consecutive misses
// ------------------------------------------------------------
export interface DeloadState {
  suggest: boolean;
  reason: 'prs_stalled' | 'consecutive_gains' | 'consecutive_misses' | null;
  weeksSinceLastDeload: number;
}

export function detectDeload(allSets: SetLog[], exerciseId: string): DeloadState {
  const exSets = allSets
    .filter((s) => s.exerciseId === exerciseId && s.done && !s.isWarmup)
    .sort((a, b) => a.date - b.date);
  if (exSets.length < 9) return { suggest: false, reason: null, weeksSinceLastDeload: 0 };

  // Group by week
  const byWeek = new Map<number, SetLog[]>();
  for (const s of exSets) {
    const wk = Math.floor(s.date / (7 * 24 * 3600 * 1000));
    if (!byWeek.has(wk)) byWeek.set(wk, []);
    byWeek.get(wk)!.push(s);
  }
  const weeks = Array.from(byWeek.entries()).sort((a, b) => a[0] - b[0]);
  if (weeks.length < 3) return { suggest: false, reason: null, weeksSinceLastDeload: 0 };

  // Check e1RM trend across last 3 weeks
  const recent3 = weeks.slice(-3).map(([, sets]) => bestE1RM(sets));
  const [a, b, c] = recent3;
  if (c < a * 0.97 && b < a * 0.98) {
    return { suggest: true, reason: 'prs_stalled', weeksSinceLastDeload: weeks.length };
  }
  if (c > a * 1.06) {
    return { suggest: true, reason: 'consecutive_gains', weeksSinceLastDeload: weeks.length };
  }
  return { suggest: false, reason: null, weeksSinceLastDeload: weeks.length };
}

// ------------------------------------------------------------
// PR detection
// ------------------------------------------------------------
export function isPR(currentSet: SetLog, priorSets: SetLog[]): boolean {
  if (!currentSet.weight || !currentSet.reps) return false;
  const current = epley1RM(currentSet.weight, currentSet.reps);
  if (current <= 0) return false;
  const priorBest = bestE1RM(priorSets.filter((s) => s.id !== currentSet.id && !s.isWarmup));
  return current > priorBest && priorBest > 0;
}

// ------------------------------------------------------------
// Streak computation
// ------------------------------------------------------------
export function computeStreak(sessionDates: number[]): number {
  if (sessionDates.length === 0) return 0;
  const DAY = 86400000;
  const seen = new Set(sessionDates.map((d) => new Date(d).toDateString()));
  let streak = 0;
  let cur = new Date();
  // If no workout today, start counting from yesterday
  if (!seen.has(cur.toDateString())) {
    cur = new Date(Date.now() - DAY);
  }
  while (seen.has(cur.toDateString())) {
    streak++;
    cur = new Date(cur.getTime() - DAY);
  }
  return streak;
}

// ------------------------------------------------------------
// Total volume
// ------------------------------------------------------------
export function totalVolume(sets: SetLog[]): number {
  let v = 0;
  for (const s of sets) {
    if (!s.done || s.isWarmup || s.isCardio) continue;
    if (!s.weight || !s.reps) continue;
    v += s.weight * s.reps;
  }
  return Math.round(v);
}

// ------------------------------------------------------------
// Format helpers
// ------------------------------------------------------------
export function formatVolume(n: number): string {
  if (n >= 10000) return `${(n / 1000).toFixed(0)}k`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function formatDuration(ms: number): string {
  const m = Math.floor(ms / 60000);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return `${h}h${rm ? ` ${rm}m` : ''}`;
}

export function nanoid(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
