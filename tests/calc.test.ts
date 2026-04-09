import { describe, it, expect } from 'vitest';
import {
  epley1RM,
  bestE1RM,
  platesPerSide,
  warmupRamp,
  suggestNextWeight,
  detectDeload,
  isPR,
  computeStreak,
  computePPLStreak,
  recoveryFor,
  setsPerCategoryThisWeek,
  VOLUME_TARGETS,
  totalVolume,
  formatVolume,
  formatDuration
} from '../src/lib/calc';
import type { SetLog, Prescription } from '../src/lib/types';

const mkSet = (p: Partial<SetLog>): SetLog => ({
  id: Math.random().toString(36),
  sessionId: 's1',
  exerciseId: 'ex1',
  dayKey: 'pull',
  date: Date.now(),
  index: 0,
  weight: null,
  reps: null,
  rpe: null,
  done: false,
  ...p
});

describe('epley1RM', () => {
  it('returns weight for 1 rep', () => {
    expect(epley1RM(100, 1)).toBe(100);
  });
  it('scales up for more reps', () => {
    expect(epley1RM(100, 10)).toBeCloseTo(133.33, 1);
    expect(epley1RM(100, 5)).toBeCloseTo(116.67, 1);
  });
  it('returns 0 for invalid input', () => {
    expect(epley1RM(0, 5)).toBe(0);
    expect(epley1RM(100, 0)).toBe(0);
  });
});

describe('bestE1RM', () => {
  it('finds max e1RM across done sets', () => {
    const sets = [
      mkSet({ weight: 100, reps: 5, done: true }),
      mkSet({ weight: 120, reps: 3, done: true }),
      mkSet({ weight: 150, reps: 5, done: false }) // not done, ignored
    ];
    const best = bestE1RM(sets);
    expect(best).toBeCloseTo(132, 0);
  });
  it('returns 0 for empty set list', () => {
    expect(bestE1RM([])).toBe(0);
  });
});

describe('platesPerSide', () => {
  it('returns empty for bar-only', () => {
    expect(platesPerSide(45, 'lb')).toEqual([]);
    expect(platesPerSide(20, 'kg')).toEqual([]);
  });
  it('calculates 135 lb as one 45', () => {
    expect(platesPerSide(135, 'lb')).toEqual([45]);
  });
  it('calculates 225 lb as two 45s', () => {
    expect(platesPerSide(225, 'lb')).toEqual([45, 45]);
  });
  it('handles mixed plates', () => {
    expect(platesPerSide(100, 'lb')).toEqual([25, 2.5]);
  });
  it('handles kg correctly', () => {
    expect(platesPerSide(100, 'kg')).toEqual([25, 15]);
  });
});

describe('warmupRamp', () => {
  it('generates 4 ramp sets for a compound', () => {
    const ramp = warmupRamp(225, 'lb');
    expect(ramp).toHaveLength(4);
    expect(ramp[0].weight).toBe(45);
    expect(ramp[3].weight).toBeLessThan(225);
  });
  it('returns empty for weight below bar', () => {
    expect(warmupRamp(40, 'lb')).toEqual([]);
  });
  it('rounds weights to 5 lb', () => {
    const ramp = warmupRamp(225, 'lb');
    ramp.forEach((set) => {
      expect(set.weight % 5).toBe(0);
    });
  });
});

describe('suggestNextWeight', () => {
  const rxObj: Prescription = {
    exerciseId: 'bench',
    sets: 3,
    repsLow: 8,
    repsHigh: 10,
    rx: '3×8–10'
  };
  it('suggests +5 lb when hit all reps at top of range', () => {
    const prev = [
      mkSet({ weight: 135, reps: 10, done: true, index: 2 }),
      mkSet({ weight: 135, reps: 10, done: true, index: 1 }),
      mkSet({ weight: 135, reps: 10, done: true, index: 0 })
    ];
    const s = suggestNextWeight(prev, rxObj);
    expect(s?.weight).toBe(140);
    expect(s?.reason).toBe('hit_all');
  });
  it('suggests deload when missed all', () => {
    const prev = [
      mkSet({ weight: 135, reps: 5, done: true, index: 2 }),
      mkSet({ weight: 135, reps: 5, done: true, index: 1 }),
      mkSet({ weight: 135, reps: 5, done: true, index: 0 })
    ];
    const s = suggestNextWeight(prev, rxObj);
    expect(s?.weight).toBe(130);
    expect(s?.reason).toBe('missed_all');
  });
  it('holds weight when mixed', () => {
    const prev = [
      mkSet({ weight: 135, reps: 10, done: true, index: 2 }),
      mkSet({ weight: 135, reps: 8, done: true, index: 1 }),
      mkSet({ weight: 135, reps: 7, done: true, index: 0 })
    ];
    const s = suggestNextWeight(prev, rxObj);
    expect(s?.weight).toBe(135);
    expect(s?.reason).toBe('mixed');
  });
  it('returns null for empty history', () => {
    expect(suggestNextWeight([], rxObj)).toBeNull();
  });
});

describe('isPR', () => {
  it('detects a new PR', () => {
    const current = mkSet({ weight: 150, reps: 5, done: true });
    const prior = [mkSet({ weight: 140, reps: 5, done: true })];
    expect(isPR(current, prior)).toBe(true);
  });
  it('rejects non-PRs', () => {
    const current = mkSet({ weight: 135, reps: 5, done: true });
    const prior = [mkSet({ weight: 140, reps: 5, done: true })];
    expect(isPR(current, prior)).toBe(false);
  });
  it('rejects first-ever set (no prior)', () => {
    const current = mkSet({ weight: 135, reps: 5, done: true });
    expect(isPR(current, [])).toBe(false);
  });
});

describe('computeStreak', () => {
  const dayMs = 86400000;
  it('returns 0 for no sessions', () => {
    expect(computeStreak([])).toBe(0);
  });
  it('counts consecutive days', () => {
    const today = Date.now();
    const dates = [today, today - dayMs, today - 2 * dayMs];
    expect(computeStreak(dates)).toBe(3);
  });
  it('breaks on gap', () => {
    const today = Date.now();
    const dates = [today, today - 3 * dayMs];
    expect(computeStreak(dates)).toBe(1);
  });
});

describe('totalVolume', () => {
  it('sums weight × reps for done sets only', () => {
    const sets = [
      mkSet({ weight: 100, reps: 5, done: true }),
      mkSet({ weight: 100, reps: 5, done: true }),
      mkSet({ weight: 100, reps: 5, done: false })
    ];
    expect(totalVolume(sets)).toBe(1000);
  });
  it('ignores warmup and cardio', () => {
    const sets = [
      mkSet({ weight: 100, reps: 5, done: true }),
      mkSet({ weight: 45, reps: 10, done: true, isWarmup: true }),
      mkSet({ weight: 0, reps: 0, done: true, isCardio: true })
    ];
    expect(totalVolume(sets)).toBe(500);
  });
});

describe('formatVolume', () => {
  it('formats numbers correctly', () => {
    expect(formatVolume(500)).toBe('500');
    expect(formatVolume(1500)).toBe('1.5k');
    expect(formatVolume(12000)).toBe('12k');
  });
});

describe('formatDuration', () => {
  it('formats minutes', () => {
    expect(formatDuration(60000)).toBe('1m');
    expect(formatDuration(45 * 60000)).toBe('45m');
  });
  it('formats hours', () => {
    expect(formatDuration(60 * 60000)).toBe('1h');
    expect(formatDuration(90 * 60000)).toBe('1h 30m');
  });
});

describe('detectDeload', () => {
  it('returns no suggestion for insufficient data', () => {
    const sets: SetLog[] = [];
    const d = detectDeload(sets, 'bench');
    expect(d.suggest).toBe(false);
  });
});

describe('computePPLStreak', () => {
  const dayMs = 86400000;
  it('returns 0 for empty', () => {
    expect(computePPLStreak([])).toBe(0);
  });
  it('counts a week with 4+ sessions (same ISO week)', () => {
    const now = Date.now();
    // 4 sessions today (same ISO week guaranteed)
    const dates = [now, now - 1000, now - 2000, now - 3000];
    expect(computePPLStreak(dates)).toBeGreaterThanOrEqual(1);
  });
  it("doesn't count a week with fewer than target", () => {
    const now = Date.now();
    const dates = [now, now - dayMs];
    expect(computePPLStreak(dates, 4)).toBe(0);
  });
});

describe('recoveryFor', () => {
  it('returns null/fresh for no history', () => {
    const r = recoveryFor([], 'pull');
    expect(r.hoursSince).toBeNull();
    expect(r.fresh).toBe(true);
  });
  it('flags warm if recent', () => {
    const r = recoveryFor(
      [{ startedAt: Date.now() - 60 * 60 * 1000, dayKey: 'pull' }],
      'pull'
    );
    expect(r.warm).toBe(true);
    expect(r.fresh).toBe(false);
  });
  it('flags fresh if old', () => {
    const r = recoveryFor(
      [{ startedAt: Date.now() - 50 * 60 * 60 * 1000, dayKey: 'pull' }],
      'pull'
    );
    expect(r.fresh).toBe(true);
    expect(r.warm).toBe(false);
  });
});

describe('setsPerCategoryThisWeek', () => {
  const mk = (p: Partial<SetLog>): SetLog => ({
    id: Math.random().toString(36),
    sessionId: 's1',
    exerciseId: 'ex1',
    dayKey: 'pull',
    date: Date.now(),
    index: 0,
    weight: 100,
    reps: 5,
    rpe: null,
    done: true,
    ...p
  });
  it('counts sets by category', () => {
    const sets = [
      mk({ exerciseId: 'bench' }),
      mk({ exerciseId: 'bench' }),
      mk({ exerciseId: 'row' }),
      mk({ exerciseId: 'squat' })
    ];
    const cats: Record<string, string> = {
      bench: 'push',
      row: 'pull',
      squat: 'legs'
    };
    const v = setsPerCategoryThisWeek(sets, (id) => cats[id]);
    expect(v.push).toBe(2);
    expect(v.pull).toBe(1);
    expect(v.legs).toBe(1);
  });
  it('ignores warmup and cardio', () => {
    const sets = [
      mk({ exerciseId: 'bench', isWarmup: true }),
      mk({ exerciseId: 'bench', isCardio: true }),
      mk({ exerciseId: 'bench' })
    ];
    const v = setsPerCategoryThisWeek(sets, () => 'push');
    expect(v.push).toBe(1);
  });
});

describe('VOLUME_TARGETS', () => {
  it('exports sane defaults', () => {
    expect(VOLUME_TARGETS.push).toBeGreaterThan(0);
    expect(VOLUME_TARGETS.pull).toBeGreaterThan(0);
    expect(VOLUME_TARGETS.legs).toBeGreaterThan(0);
    expect(VOLUME_TARGETS.core).toBeGreaterThan(0);
  });
});
