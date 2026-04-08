// ============================================================
// Program structure — references exercise IDs
// ============================================================
import type { Day, ProgramVariant, Prescription } from '../types';

/** Shorthand for a prescription */
function rx(
  exerciseId: string,
  sets: number,
  repsLow: number,
  repsHigh: number,
  rx: string,
  opts: Partial<Prescription> = {}
): Prescription {
  return { exerciseId, sets, repsLow, repsHigh, rx, ...opts };
}

// ============================================================
// GYM — Week A
// ============================================================
const G_A_PULL: Day = {
  key: 'pull',
  label: 'Pull',
  weekday: 'Mon',
  icon: '◂',
  slots: [
    {
      alternatives: [
        rx('trap_bar_dl_high', 1, 5, 5, '1×5 @ RPE 7–8', { rpe: 7.5 }),
        rx('cable_pull_through', 3, 12, 15, '3×12–15'),
        rx('reverse_hyper', 3, 12, 15, '3×12–15')
      ]
    },
    {
      alternatives: [
        rx('chest_supported_row', 3, 8, 10, '3×8–10'),
        rx('seated_cable_row', 4, 10, 12, '3–4×10–12'),
        rx('inverted_row', 3, 8, 15, '3×8–15')
      ]
    },
    {
      alternatives: [
        rx('db_pullover', 3, 12, 15, '2–3×12–15'),
        rx('sa_cable_pulldown', 3, 12, 15, '3×12–15'),
        rx('machine_pullover', 3, 10, 12, '3×10–12')
      ]
    },
    {
      alternatives: [
        rx('chin_ups', 3, 6, 12, '3×fail', { superset: 'db_oh_tri_ext' }),
        rx('preacher_curl', 3, 10, 12, '3×10–12', { superset: 'cable_pushdown' }),
        rx('incline_db_curl', 3, 10, 12, '3×10–12', { superset: 'hammer_curl' })
      ]
    }
  ]
};

const G_A_PUSH: Day = {
  key: 'push',
  label: 'Push',
  weekday: 'Tue',
  icon: '▸',
  slots: [
    {
      alternatives: [
        rx('bb_bench_press', 4, 4, 6, '4×4–6'),
        rx('db_floor_press', 4, 8, 12, '3–4×8–12'),
        rx('standing_cable_press', 3, 10, 12, '3×10–12/side')
      ]
    },
    {
      alternatives: [
        rx('hi_lo_crossover', 3, 10, 12, '3×10–12'),
        rx('pec_deck', 3, 12, 15, '3×12–15'),
        rx('lying_cable_fly', 3, 10, 12, '3×10–12')
      ]
    },
    {
      alternatives: [
        rx('seated_db_press', 3, 10, 12, '3×10–12'),
        rx('db_front_raise', 4, 12, 15, '3–4×12–15'),
        rx('db_lateral', 4, 12, 15, '3–4×12–15')
      ]
    },
    {
      alternatives: [
        rx('cable_pushdown', 3, 10, 12, '3×10–12', { superset: 'waiter_curl' }),
        rx('cable_pushdown', 3, 10, 12, '3×10–12', { superset: 'incline_db_curl' }),
        rx('oh_cable_tri', 3, 12, 15, '3×12–15', { superset: 'lying_cable_curl' })
      ]
    }
  ]
};

const G_A_LEGS: Day = {
  key: 'legs',
  label: 'Legs',
  weekday: 'Thu',
  icon: '▾',
  slots: [
    {
      alternatives: [
        rx('belt_squat', 4, 6, 8, '4×6–8'),
        rx('leg_extension', 3, 12, 15, '3×12–15'),
        rx('hack_squat', 3, 8, 12, '3×8–12')
      ]
    },
    {
      alternatives: [
        rx('bb_hip_thrust', 3, 8, 10, '3×8–10'),
        rx('banded_glute_bridge', 3, 15, 20, '3×15–20'),
        rx('cable_pull_through', 3, 12, 15, '3×12–15')
      ]
    },
    {
      alternatives: [
        rx('db_reverse_lunge', 3, 8, 10, '3×8–10/leg'),
        rx('sl_leg_press', 3, 10, 12, '3×10–12/leg'),
        rx('step_up', 3, 10, 12, '3×10–12/leg')
      ]
    },
    {
      alternatives: [
        rx('b_stance_rdl', 3, 8, 10, '3×8–10, 3s ecc'),
        rx('hip_ext_45', 3, 10, 15, '3×10–15'),
        rx('sl_glute_bridge', 3, 10, 12, '3×10–12/leg')
      ]
    }
  ]
};

const G_A_CORE: Day = {
  key: 'core',
  label: 'Core',
  weekday: 'Fri',
  icon: '◎',
  slots: [
    {
      alternatives: [
        rx('mcgill_curlup', 5, 1, 1, '5→3→1 (8–10s)'),
        rx('dead_bug', 3, 8, 10, '3×8–10/side'),
        rx('rkc_plank', 3, 10, 20, '3×10–20s')
      ]
    },
    {
      alternatives: [
        rx('side_plank', 5, 1, 1, '5→3→1/side'),
        rx('suitcase_carry', 3, 30, 40, '3×30–40m/side'),
        rx('hk_pallof', 3, 8, 10, '3×8–10/side')
      ]
    },
    {
      alternatives: [
        rx('face_pulls_hang', 3, 15, 20, '3×15–20 / 30–60s hang'),
        rx('band_pullapart_hang', 3, 15, 20, '3×15–20 / 20–30s hang'),
        rx('prone_yt_decomp', 3, 10, 12, '3×10–12 / 2–3 min')
      ]
    },
    {
      alternatives: [
        rx('bird_dog', 5, 1, 1, '5→3→1/side'),
        rx('standing_pallof', 3, 10, 12, '3×10–12/side'),
        rx('plank_shoulder_taps', 3, 8, 10, '3×8–10/side')
      ]
    }
  ]
};

// ============================================================
// GYM — Week B (variants)
// ============================================================
const G_B_PULL: Day = {
  ...G_A_PULL,
  slots: [
    {
      alternatives: [
        rx('bb_hip_thrust', 4, 8, 10, '3–4×8–10'),
        rx('reverse_hyper', 3, 12, 15, '3×12–15'),
        rx('heavy_cable_pt', 4, 8, 12, '4×8–12')
      ]
    },
    {
      alternatives: [
        rx('weighted_pullup', 3, 6, 8, '3×6–8'),
        rx('wide_lat_pulldown', 3, 8, 12, '3×8–12'),
        rx('neutral_lat_pulldown', 3, 10, 12, '3×10–12')
      ]
    },
    {
      alternatives: [
        rx('db_gorilla_row_elev', 3, 6, 8, '3×6–8/arm'),
        rx('sa_cable_row', 3, 10, 12, '3×10–12/arm'),
        rx('seated_machine_row', 3, 10, 12, '3×10–12')
      ]
    },
    {
      alternatives: [
        rx('bb_curl', 3, 6, 8, '3×6–8', { superset: 'cable_pushdown' }),
        rx('preacher_curl', 3, 10, 12, '3×10–12', { superset: 'oh_cable_tri' }),
        rx('incline_db_curl', 3, 10, 12, '3×10–12', { superset: 'dip_machine' })
      ]
    }
  ]
};

const G_B_PUSH: Day = {
  ...G_A_PUSH,
  slots: [
    {
      alternatives: [
        rx('hk_landmine', 3, 8, 12, '3×8–12/arm'),
        rx('machine_shoulder_press', 3, 10, 12, '3×10–12'),
        rx('seated_cable_press', 3, 12, 15, '3×12–15/arm')
      ]
    },
    {
      alternatives: [
        rx('underhand_db_bench', 3, 8, 10, '3×8–10'),
        rx('low_incline_db_press', 3, 8, 12, '3×8–12'),
        rx('low_high_cable_fly', 3, 12, 15, '3×12–15')
      ]
    },
    {
      alternatives: [
        rx('db_floor_fly', 3, 10, 12, '3×10–12'),
        rx('cable_crossover', 3, 12, 15, '3×12–15'),
        rx('db_squeeze_press', 3, 10, 12, '3×10–12')
      ]
    },
    {
      alternatives: [
        rx('cg_bench', 3, 6, 8, '3×6–8', { superset: 'incline_db_curl' }),
        rx('dip_machine', 3, 10, 12, '3×10–12', { superset: 'preacher_curl' }),
        rx('oh_cable_tri', 3, 10, 12, '3×10–12', { superset: 'concentration_curl' })
      ]
    }
  ]
};

const G_B_LEGS: Day = {
  ...G_A_LEGS,
  slots: [
    {
      alternatives: [
        rx('belt_squat', 4, 6, 8, '4×6–8'),
        rx('leg_extension', 3, 12, 15, '3×12–15'),
        rx('hack_squat', 3, 8, 12, '3×8–12')
      ]
    },
    {
      alternatives: [
        rx('bb_hip_thrust', 3, 8, 10, '3×8–10'),
        rx('banded_glute_bridge', 3, 15, 20, '3×15–20'),
        rx('frog_pump', 3, 20, 25, '3×20–25')
      ]
    },
    {
      alternatives: [
        rx('db_reverse_lunge', 3, 8, 10, '3×8–10/leg'),
        rx('sl_leg_press', 3, 10, 12, '3×10–12/leg'),
        rx('step_up', 3, 10, 12, '3×10–12/leg')
      ]
    },
    {
      alternatives: [
        rx('slick_bridge_curl', 3, 10, 15, '2–3×fail'),
        rx('seated_ham_curl', 3, 10, 15, '3×10–15'),
        rx('sb_ham_curl', 3, 10, 15, '3×10–15')
      ]
    }
  ]
};

const G_B_CORE: Day = {
  ...G_A_CORE,
  slots: [
    G_A_CORE.slots[0],
    G_A_CORE.slots[1],
    {
      alternatives: [
        rx('angels_devils_pu_plus', 3, 15, 20, '3×15–20 / 3×fail'),
        rx('prone_iyt_serratus', 2, 8, 10, '2×8–10 / 2×12–15'),
        rx('wall_slides_pu_plus', 3, 10, 12, '3×10–12 / 3×12–15')
      ]
    },
    G_A_CORE.slots[3]
  ]
};

// ============================================================
// HOTEL — Week A
// ============================================================
const H_A_PULL: Day = {
  ...G_A_PULL,
  slots: [
    {
      alternatives: [
        rx('db_rdl', 4, 8, 12, '3–4×8–12'),
        rx('band_pull_through', 3, 12, 15, '3×12–15'),
        rx('db_hip_thrust_bed', 4, 12, 15, '3–4×12–15')
      ]
    },
    {
      alternatives: [
        rx('incline_db_csr', 4, 10, 12, '3–4×10–12'),
        rx('sa_db_row', 4, 10, 12, '3–4×10–12/arm'),
        rx('inverted_row_table', 3, 8, 12, '3×8–12')
      ]
    },
    {
      alternatives: [
        rx('db_pullover_floor', 3, 12, 15, '3×12–15'),
        rx('band_sa_pulldown', 3, 12, 15, '3×12–15'),
        rx('prone_seal_row', 3, 10, 12, '3×10–12')
      ]
    },
    {
      alternatives: [
        rx('band_lat_pulldown', 3, 12, 15, '3×12–15', { superset: 'incline_db_curl' }),
        rx('incline_db_curl', 3, 10, 12, '3×10–12', { superset: 'db_kickback' }),
        rx('hammer_curl', 3, 10, 12, '3×10–12', { superset: 'db_oh_tri_ext' })
      ]
    }
  ]
};

const H_A_PUSH: Day = {
  ...G_A_PUSH,
  slots: [
    {
      alternatives: [
        rx('db_bench_hotel', 4, 8, 12, '4×8–12, tempo 3-1-2', { tempo: '3-1-2' }),
        rx('db_floor_press_15', 4, 10, 12, '3–4×10–12'),
        rx('pushup_tempo', 4, 10, 15, '4×10–15', { tempo: '3-1-2' })
      ]
    },
    {
      alternatives: [
        rx('db_floor_fly', 3, 12, 15, '3×12–15'),
        rx('band_crossover', 3, 12, 15, '3×12–15'),
        rx('db_squeeze_press', 3, 12, 15, '3×12–15')
      ]
    },
    {
      alternatives: [
        rx('seated_db_press', 3, 10, 12, '3×10–12'),
        rx('hk_db_press', 3, 10, 12, '3×10–12/arm'),
        rx('db_lateral', 4, 12, 15, '3–4×12–15')
      ]
    },
    {
      alternatives: [
        rx('db_oh_tri_ext', 3, 10, 15, '3×10–15', { superset: 'waiter_curl' }),
        rx('band_pushdown', 3, 12, 15, '3×12–15', { superset: 'incline_db_curl' }),
        rx('db_oh_tri_ext', 3, 10, 12, '3×10–12', { superset: 'hammer_curl' })
      ]
    }
  ]
};

const H_A_LEGS: Day = {
  ...G_A_LEGS,
  slots: [
    {
      alternatives: [
        rx('goblet_squat_he', 4, 10, 15, '3–4×10–15', { tempo: '3-1-2' }),
        rx('bulgarian_ss', 3, 8, 12, '3×8–12/leg'),
        rx('wall_sit_db', 3, 30, 60, '3×30–60s')
      ]
    },
    {
      alternatives: [
        rx('db_hip_thrust_bed', 4, 12, 15, '3–4×12–15'),
        rx('sl_hip_thrust', 3, 10, 12, '3×10–12/leg'),
        rx('banded_glute_bridge', 3, 15, 20, '3×15–20')
      ]
    },
    {
      alternatives: [
        rx('db_reverse_lunge', 3, 10, 12, '3×10–12/leg'),
        rx('db_step_up', 3, 10, 12, '3×10–12/leg'),
        rx('walking_lunge', 3, 8, 10, '3×8–10/leg')
      ]
    },
    {
      alternatives: [
        rx('bstance_db_rdl', 3, 10, 12, '3×10–12/side, 3s ecc'),
        rx('prone_db_ham_bed', 3, 12, 15, '3×12–15'),
        rx('towel_sliding_ham', 4, 8, 12, '3–4×8–12')
      ]
    }
  ]
};

const H_A_CORE: Day = {
  ...G_A_CORE,
  slots: [
    G_A_CORE.slots[0],
    {
      alternatives: [
        rx('side_plank', 5, 1, 1, '5→3→1/side'),
        rx('suitcase_carry', 3, 30, 40, '3×30–40m/side'),
        rx('band_pallof', 3, 8, 12, '3×8–12/side')
      ]
    },
    {
      alternatives: [
        rx('band_facepull', 3, 15, 20, '3×15–20 each'),
        rx('prone_yt_bed', 3, 10, 12, '3×10–12 each'),
        rx('db_prone_rev_fly', 3, 12, 15, '3×12–15')
      ]
    },
    {
      alternatives: [
        rx('bird_dog', 5, 1, 1, '5→3→1/side'),
        rx('plank_shoulder_taps', 3, 8, 10, '3×8–10/side'),
        rx('prone_bed_decomp', 1, 1, 1, '3–5 min')
      ]
    }
  ]
};

// ============================================================
// HOTEL — Week B
// ============================================================
const H_B_PULL: Day = {
  ...G_A_PULL,
  slots: [
    {
      alternatives: [
        rx('db_hip_thrust_bed', 3, 12, 15, '3×12–15'),
        rx('db_sumo_dl', 3, 10, 12, '3×10–12'),
        rx('band_pull_through', 4, 10, 12, '4×10–12')
      ]
    },
    {
      alternatives: [
        rx('sa_db_row', 4, 8, 10, '3–4×8–10/arm'),
        rx('band_lat_pulldown', 4, 8, 12, '3–4×8–12'),
        rx('incline_db_csr', 3, 10, 12, '3×10–12')
      ]
    },
    {
      alternatives: [
        rx('db_gorilla_row_hotel', 3, 8, 10, '3×8–10/arm'),
        rx('prone_db_row_bed', 3, 10, 12, '3×10–12'),
        rx('band_seated_row', 3, 12, 15, '3×12–15')
      ]
    },
    {
      alternatives: [
        rx('incline_db_curl', 3, 10, 12, '3×10–12', { superset: 'band_pushdown' }),
        rx('incline_db_curl', 3, 10, 12, '3×10–12', { superset: 'db_oh_tri_ext' }),
        rx('concentration_curl', 3, 10, 12, '3×10–12', { superset: 'diamond_pushup' })
      ]
    }
  ]
};

const H_B_PUSH: Day = {
  ...G_A_PUSH,
  slots: [
    {
      alternatives: [
        rx('hk_db_press', 3, 10, 12, '3×10–12/arm'),
        rx('seated_arnold', 3, 10, 12, '3×10–12'),
        rx('db_front_lat', 3, 10, 12, '3×10–12 each')
      ]
    },
    {
      alternatives: [
        rx('underhand_db_hotel', 3, 10, 12, '3×10–12'),
        rx('low_incline_db_press', 3, 8, 12, '3×8–12'),
        rx('pushup_feet_elev', 3, 10, 15, '3×10–15')
      ]
    },
    {
      alternatives: [
        rx('db_floor_fly', 3, 12, 15, '3×12–15'),
        rx('db_squeeze_press', 3, 10, 15, '3×10–15'),
        rx('band_crossover', 3, 12, 15, '3×12–15')
      ]
    },
    {
      alternatives: [
        rx('db_squeeze_press', 3, 10, 15, '3×10–15', { superset: 'concentration_curl' }),
        rx('band_pushdown', 3, 12, 15, '3×12–15', { superset: 'incline_db_curl' }),
        rx('diamond_pushup', 3, 10, 15, '3×fail', { superset: 'incline_db_curl' })
      ]
    }
  ]
};

const H_B_LEGS: Day = {
  ...G_A_LEGS,
  slots: [
    {
      alternatives: [
        rx('bulgarian_ss', 3, 8, 12, '3×8–12/leg'),
        rx('goblet_squat_he', 3, 12, 15, '3×12–15', { tempo: '3-2-1' }),
        rx('wall_sit_db', 3, 30, 60, '3×30–60s')
      ]
    },
    {
      alternatives: [
        rx('db_hip_thrust_bed', 4, 12, 15, '3–4×12–15'),
        rx('banded_glute_bridge', 3, 15, 20, '3×15–20'),
        rx('frog_pump', 3, 20, 25, '3×20–25')
      ]
    },
    {
      alternatives: [
        rx('db_step_up', 3, 10, 12, '3×10–12/leg'),
        rx('db_reverse_lunge', 3, 10, 12, '3×10–12/leg'),
        rx('walking_lunge', 3, 8, 10, '3×8–10/leg')
      ]
    },
    {
      alternatives: [
        rx('towel_sliding_ham', 4, 8, 12, '3–4×8–12'),
        rx('prone_db_ham_bed', 3, 12, 15, '3×12–15'),
        rx('sl_glute_bridge', 3, 10, 12, '3×10–12/leg')
      ]
    }
  ]
};

const H_B_CORE: Day = {
  ...G_A_CORE,
  slots: [
    G_A_CORE.slots[0],
    {
      alternatives: [
        rx('side_plank', 5, 1, 1, '5→3→1/side'),
        rx('suitcase_carry', 3, 30, 40, '3×30–40m/side'),
        rx('band_pallof', 3, 8, 12, '3×8–12/side')
      ]
    },
    {
      alternatives: [
        rx('band_facepull', 3, 15, 20, '3×15–20 each'),
        rx('prone_yt_decomp', 3, 10, 12, '3×10–12 / 2–3 min'),
        rx('band_pullapart_kn_pu', 3, 15, 20, '3×15–20 / 3×12–15')
      ]
    },
    {
      alternatives: [
        rx('bird_dog', 5, 1, 1, '5→3→1/side'),
        rx('plank_shoulder_taps', 3, 8, 10, '3×8–10/side'),
        rx('prone_bed_decomp', 1, 1, 1, '3–5 min')
      ]
    }
  ]
};

// ============================================================
// Export
// ============================================================
export const PROGRAM: Record<string, ProgramVariant> = {
  gym_a: { location: 'gym', week: 'a', days: [G_A_PULL, G_A_PUSH, G_A_LEGS, G_A_CORE] },
  gym_b: { location: 'gym', week: 'b', days: [G_B_PULL, G_B_PUSH, G_B_LEGS, G_B_CORE] },
  hotel_a: { location: 'hotel', week: 'a', days: [H_A_PULL, H_A_PUSH, H_A_LEGS, H_A_CORE] },
  hotel_b: { location: 'hotel', week: 'b', days: [H_B_PULL, H_B_PUSH, H_B_LEGS, H_B_CORE] }
};

export function getProgram(location: 'gym' | 'hotel', week: 'a' | 'b'): ProgramVariant {
  return PROGRAM[`${location}_${week}`];
}

export const DAY_ORDER = ['pull', 'push', 'legs', 'core'] as const;
