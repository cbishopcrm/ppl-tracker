// ============================================================
// Exercise library — keyed by stable IDs
// Based on Athlean-X PPL with L4/L5-safe mods
// ============================================================
import type { Exercise } from '../types';

function ex(e: Exercise): Exercise {
  return e;
}

export const EXERCISES: Record<string, Exercise> = Object.fromEntries(
  [
    // ========== Warmup ==========
    ex({
      id: 'treadmill_walk',
      name: 'Treadmill Walk',
      category: 'cardio',
      location: ['gym', 'hotel'],
      cues: '5-minute warmup walk. Easy pace (2.5–3.5 mph). 1–3% incline if available. Get blood flowing, loosen hips.',
      defaultRestSec: 0
    }),

    // ========== Pull — hinge / hip ==========
    ex({
      id: 'trap_bar_dl_high',
      name: 'Trap Bar DL (High Handles)',
      category: 'pull',
      location: ['gym'],
      compound: true,
      cues: '4 ramp sets then 1 working set. Stand inside bar. High handles reduce ROM.',
      spineSafe: 'Replaces conventional DL. 9.2% lower spinal flexion moment.',
      defaultRestSec: 180
    }),
    ex({
      id: 'cable_pull_through',
      name: 'Cable Pull-Through',
      category: 'pull',
      location: ['gym'],
      cues: 'Hinge at hips, drive forward. Horizontal resistance = zero axial compression.',
      spineSafe: 'Top glute max activation (Contreras EMG).',
      defaultRestSec: 90
    }),
    ex({
      id: 'reverse_hyper',
      name: 'Reverse Hyperextension',
      category: 'pull',
      location: ['gym'],
      cues: 'Torso face-down (supported). Legs pendulum arc. Spine decompressed.',
      spineSafe: 'Builds posterior chain WHILE decompressing L4/L5.',
      defaultRestSec: 90
    }),
    ex({
      id: 'heavy_cable_pt',
      name: 'Heavy Cable Pull-Through',
      category: 'pull',
      location: ['gym'],
      cues: 'Heavier load, powerful hip drive.',
      spineSafe: 'Zero compression.',
      defaultRestSec: 120
    }),
    ex({
      id: 'bb_hip_thrust',
      name: 'Barbell Hip Thrust',
      category: 'pull',
      location: ['gym'],
      compound: true,
      cues: 'PPT at lockout. Force perpendicular to spine.',
      spineSafe: 'PPT cue eliminates hyperextension.',
      defaultRestSec: 120
    }),
    ex({
      id: 'banded_glute_bridge',
      name: 'Banded Glute Bridge',
      category: 'pull',
      location: ['gym', 'hotel'],
      cues: 'Floor, band above knees. 3-sec hold.',
      spineSafe: 'Floor eliminates hyperextension.',
      defaultRestSec: 60
    }),
    ex({
      id: 'frog_pump',
      name: 'Frog Pump (Banded)',
      category: 'pull',
      location: ['gym', 'hotel'],
      cues: 'Soles together. Short ROM. Max glute activation.',
      defaultRestSec: 60
    }),

    // ========== Pull — rows / lats ==========
    ex({
      id: 'chest_supported_row',
      name: 'Chest-Supported Row',
      category: 'pull',
      location: ['gym'],
      cues: '30–45° incline. Chest on pad. Load aggressively.',
      spineSafe: 'Gold standard — lowest spine loads with high lat activation.',
      defaultRestSec: 90
    }),
    ex({
      id: 'seated_cable_row',
      name: 'Seated Cable Row',
      category: 'pull',
      location: ['gym'],
      cues: 'Upright torso, feet braced. V-bar or wide bar.',
      spineSafe: 'Constant cable tension through full ROM.',
      defaultRestSec: 90
    }),
    ex({
      id: 'inverted_row',
      name: 'Inverted Row',
      category: 'pull',
      location: ['gym'],
      cues: 'Supine under barbell. Rigid plank. Adjust height for difficulty.',
      spineSafe: 'Zero axial compression. Self-limiting.',
      defaultRestSec: 60
    }),
    ex({
      id: 'weighted_pullup',
      name: 'Weighted Pull-up',
      category: 'pull',
      location: ['gym'],
      cues: 'Full dead hang. Dip belt. 30-sec hangs between.',
      spineSafe: 'Therapeutic decompression.',
      defaultRestSec: 150
    }),
    ex({
      id: 'wide_lat_pulldown',
      name: 'Wide Lat Pulldown',
      category: 'pull',
      location: ['gym'],
      cues: 'Seated, slight lean, pull to chest.',
      spineSafe: 'Adjustable load. Same lat activation.',
      defaultRestSec: 90
    }),
    ex({
      id: 'neutral_lat_pulldown',
      name: 'Neutral Lat Pulldown',
      category: 'pull',
      location: ['gym'],
      cues: 'Close handles, pull to mid-chest.',
      spineSafe: 'Easier on shoulders.',
      defaultRestSec: 90
    }),
    ex({
      id: 'db_gorilla_row_elev',
      name: 'DB Gorilla Row (Elevated)',
      category: 'pull',
      location: ['gym'],
      cues: 'Elevate DBs on plates. Slight knee bend.',
      spineSafe: 'Elevating reduces hinge depth.',
      defaultRestSec: 90
    }),
    ex({
      id: 'sa_cable_row',
      name: 'Single-Arm Cable Row',
      category: 'pull',
      location: ['gym'],
      cues: 'Standing or half-kneeling.',
      spineSafe: 'Lower spine loads (McGill).',
      defaultRestSec: 75
    }),
    ex({
      id: 'seated_machine_row',
      name: 'Seated Machine Row',
      category: 'pull',
      location: ['gym'],
      cues: 'Chest pad, full support.',
      spineSafe: 'Heaviest row safely.',
      defaultRestSec: 90
    }),
    ex({
      id: 'db_pullover',
      name: 'DB Pullover',
      category: 'pull',
      location: ['gym', 'hotel'],
      cues: 'Lie fully on bench. Feet up. Stop at ear level.',
      spineSafe: 'Feet up protects lumbar curve.',
      defaultRestSec: 75
    }),
    ex({
      id: 'sa_cable_pulldown',
      name: 'Straight-Arm Cable Pulldown',
      category: 'pull',
      location: ['gym'],
      cues: 'Slight hinge, braced core. 2-sec eccentric.',
      spineSafe: 'Constant tension. Cavaliere staple.',
      defaultRestSec: 60
    }),
    ex({
      id: 'machine_pullover',
      name: 'Machine Pullover',
      category: 'pull',
      location: ['gym'],
      cues: 'Seat/back pad stabilize torso. Zero compression.',
      spineSafe: 'Machine constrains to shoulder joint.',
      defaultRestSec: 75
    }),

    // ========== Pull — biceps ==========
    ex({
      id: 'chin_ups',
      name: 'Chin-ups to Failure',
      category: 'pull',
      location: ['gym'],
      cues: 'Underhand, full ROM. Dead hangs between sets.',
      spineSafe: 'Hanging decompresses spine.',
      defaultRestSec: 90
    }),
    ex({
      id: 'db_oh_tri_ext',
      name: 'DB Overhead Triceps Extension',
      category: 'push',
      location: ['gym', 'hotel'],
      cues: 'Seated with chair support. Ribs down.',
      defaultRestSec: 60
    }),
    ex({
      id: 'preacher_curl',
      name: 'Preacher Curl',
      category: 'pull',
      location: ['gym'],
      cues: 'EZ-bar. Pad supports upper arms.',
      spineSafe: 'Superior isolation. Zero spinal involvement.',
      defaultRestSec: 60
    }),
    ex({
      id: 'cable_pushdown',
      name: 'Cable Pushdown',
      category: 'push',
      location: ['gym'],
      cues: 'Rope attachment. Elbows pinned.',
      defaultRestSec: 60
    }),
    ex({
      id: 'incline_db_curl',
      name: 'Incline DB Curl',
      category: 'pull',
      location: ['gym', 'hotel'],
      cues: '45–60° incline (supported). Max stretch.',
      defaultRestSec: 60
    }),
    ex({
      id: 'hammer_curl',
      name: 'Hammer Curl',
      category: 'pull',
      location: ['gym', 'hotel'],
      cues: 'Neutral grip. Brachialis focus.',
      defaultRestSec: 45
    }),
    ex({
      id: 'bb_curl',
      name: 'Barbell Curl',
      category: 'pull',
      location: ['gym'],
      cues: '3-sec eccentrics. Elbows pinned.',
      defaultRestSec: 75
    }),
    ex({
      id: 'dip_machine',
      name: 'Dip Machine',
      category: 'push',
      location: ['gym'],
      cues: 'Seated, full support.',
      defaultRestSec: 75
    }),
    ex({
      id: 'oh_cable_tri',
      name: 'Overhead Cable Triceps',
      category: 'push',
      location: ['gym'],
      cues: 'Split stance. Rope above head.',
      spineSafe: 'Neutral spine maintained.',
      defaultRestSec: 60
    }),
    ex({
      id: 'lying_cable_curl',
      name: 'Lying Cable Curl',
      category: 'pull',
      location: ['gym'],
      cues: 'Supine. Stretched position.',
      spineSafe: 'Supine = no compression.',
      defaultRestSec: 60
    }),

    // ========== Push — chest ==========
    ex({
      id: 'bb_bench_press',
      name: 'Barbell Bench Press',
      category: 'push',
      location: ['gym'],
      compound: true,
      cues: 'Natural arch only. Squeeze glutes, feet flat.',
      spineSafe: 'Supine = no axial compression.',
      defaultRestSec: 180
    }),
    ex({
      id: 'db_floor_press',
      name: 'DB Floor Press',
      category: 'push',
      location: ['gym', 'hotel'],
      cues: 'Floor supports spine. Natural ROM limiter.',
      spineSafe: 'Floor eliminates arch. Corrects imbalances.',
      defaultRestSec: 120
    }),
    ex({
      id: 'standing_cable_press',
      name: 'Standing Cable Chest Press',
      category: 'push',
      location: ['gym'],
      cues: 'Horizontal resistance. Anti-rotation stabilizer.',
      spineSafe: 'Physio Steve recommends for disc patients.',
      defaultRestSec: 90
    }),
    ex({
      id: 'underhand_db_bench',
      name: 'Underhand DB Bench',
      category: 'push',
      location: ['gym', 'hotel'],
      cues: 'Supinated grip. ~30% more upper pec.',
      defaultRestSec: 120
    }),
    ex({
      id: 'low_incline_db_press',
      name: 'Low-Incline DB Press',
      category: 'push',
      location: ['gym'],
      cues: '15–30°. Gold standard upper pec.',
      spineSafe: 'Cavaliere optimal angle.',
      defaultRestSec: 120
    }),
    ex({
      id: 'low_high_cable_fly',
      name: 'Low-to-High Cable Fly',
      category: 'push',
      location: ['gym'],
      cues: 'Diagonal matches clavicular fibers.',
      defaultRestSec: 60
    }),
    ex({
      id: 'cg_bench',
      name: 'Close-Grip Bench Press',
      category: 'push',
      location: ['gym'],
      cues: 'Hands shoulder-width. Heavy tri compound.',
      defaultRestSec: 120
    }),
    ex({
      id: 'hi_lo_crossover',
      name: 'Hi-to-Low Crossover',
      category: 'push',
      location: ['gym'],
      cues: 'Pulleys at head height. Full adduction.',
      defaultRestSec: 60
    }),
    ex({
      id: 'pec_deck',
      name: 'Pec Deck / Machine Fly',
      category: 'push',
      location: ['gym'],
      cues: 'Seated, back-supported. Fixed arc.',
      spineSafe: 'Push closer to true pec failure.',
      defaultRestSec: 60
    }),
    ex({
      id: 'lying_cable_fly',
      name: 'Lying Cable Fly',
      category: 'push',
      location: ['gym'],
      cues: 'Supine between low pulleys. 3-sec eccentric.',
      spineSafe: 'Constant tension both phases.',
      defaultRestSec: 60
    }),
    ex({
      id: 'db_floor_fly',
      name: 'DB Floor Fly',
      category: 'push',
      location: ['gym', 'hotel'],
      cues: 'Floor limits ROM. Slight elbow bend.',
      defaultRestSec: 60
    }),
    ex({
      id: 'cable_crossover',
      name: 'Cable Crossover',
      category: 'push',
      location: ['gym'],
      cues: 'Standing. Horizontal resistance. Versatile.',
      defaultRestSec: 60
    }),
    ex({
      id: 'db_squeeze_press',
      name: 'DB Squeeze Press',
      category: 'push',
      location: ['gym', 'hotel'],
      cues: 'Press DBs together throughout.',
      defaultRestSec: 60
    }),

    // ========== Push — shoulders ==========
    ex({
      id: 'seated_db_press',
      name: 'Seated DB Shoulder Press',
      category: 'push',
      location: ['gym', 'hotel'],
      cues: '75–80° incline, back on pad. Ribs down.',
      spineSafe: 'Seated with support eliminates compression.',
      defaultRestSec: 120
    }),
    ex({
      id: 'hk_landmine',
      name: 'Half-Kneeling Landmine Press',
      category: 'push',
      location: ['gym'],
      cues: '~45° angle. Kneeling kills leg drive.',
      spineSafe: 'Replaces OHP. Less compression.',
      defaultRestSec: 120
    }),
    ex({
      id: 'machine_shoulder_press',
      name: 'Seated Machine Shoulder Press',
      category: 'push',
      location: ['gym'],
      cues: 'Fixed path + back pad.',
      spineSafe: 'Heavier delt loading.',
      defaultRestSec: 90
    }),
    ex({
      id: 'seated_cable_press',
      name: 'Seated Cable Shoulder Press',
      category: 'push',
      location: ['gym'],
      cues: 'Back support. Angled cable.',
      spineSafe: 'Constant tension.',
      defaultRestSec: 90
    }),
    ex({
      id: 'db_front_raise',
      name: 'DB Front Raise',
      category: 'push',
      location: ['gym', 'hotel'],
      cues: 'Light loads. Standing.',
      spineSafe: 'Zero compression.',
      defaultRestSec: 45
    }),
    ex({
      id: 'db_lateral',
      name: 'DB Lateral Raise',
      category: 'push',
      location: ['gym', 'hotel'],
      cues: 'Light load. Elbows slightly bent.',
      spineSafe: 'Premier medial delt isolation.',
      defaultRestSec: 45
    }),

    // ========== Legs ==========
    ex({
      id: 'belt_squat',
      name: 'Belt Squat',
      category: 'legs',
      location: ['gym'],
      compound: true,
      cues: 'Load bypasses spine. Push hard.',
      spineSafe: '45–52% lower erector activation, same quad.',
      defaultRestSec: 180
    }),
    ex({
      id: 'leg_press',
      name: 'Leg Press',
      category: 'legs',
      location: ['gym'],
      compound: true,
      cues: 'Full support. Stop when lumbar lifts.',
      spineSafe: 'Machine bypasses spinal load.',
      defaultRestSec: 150
    }),
    ex({
      id: 'leg_extension',
      name: 'Leg Extension',
      category: 'legs',
      location: ['gym'],
      cues: 'Seated, back support. 2-sec up, 3-sec down.',
      spineSafe: 'Purest quad isolation.',
      defaultRestSec: 75
    }),
    ex({
      id: 'hack_squat',
      name: 'Hack Squat',
      category: 'legs',
      location: ['gym'],
      cues: '45° sled with back pad.',
      spineSafe: 'Back pad stabilizes torso.',
      defaultRestSec: 150
    }),
    ex({
      id: 'db_reverse_lunge',
      name: 'DB Reverse Lunge',
      category: 'legs',
      location: ['gym', 'hotel'],
      cues: 'DBs at sides. Step back, upright.',
      spineSafe: 'No barbell compression.',
      defaultRestSec: 90
    }),
    ex({
      id: 'sl_leg_press',
      name: 'Single-Leg Leg Press',
      category: 'legs',
      location: ['gym'],
      cues: 'Full support. Stop when lumbar lifts.',
      spineSafe: 'Machine safety + unilateral.',
      defaultRestSec: 90
    }),
    ex({
      id: 'step_up',
      name: 'Step-Up',
      category: 'legs',
      location: ['gym', 'hotel'],
      cues: 'DBs at sides. Controlled. Lower step = quad.',
      spineSafe: 'Concentric-dominant.',
      defaultRestSec: 75
    }),
    ex({
      id: 'b_stance_rdl',
      name: 'B-Stance RDL',
      category: 'legs',
      location: ['gym'],
      cues: '80/20 split. Light load. Neutral spine. 3-sec eccentric.',
      spineSafe: 'If symptoms: swap to prone ham curls.',
      defaultRestSec: 90
    }),
    ex({
      id: 'hip_ext_45',
      name: '45° Hip Extension',
      category: 'legs',
      location: ['gym'],
      cues: 'Roman chair, PPT to isolate.',
      spineSafe: 'Full-length hamstring activation.',
      defaultRestSec: 75
    }),
    ex({
      id: 'sl_glute_bridge',
      name: 'Single-Leg Glute Bridge',
      category: 'legs',
      location: ['gym', 'hotel'],
      cues: 'Supine. One foot planted. Bodyweight.',
      spineSafe: 'Unilateral without spinal load.',
      defaultRestSec: 60
    }),
    ex({
      id: 'slick_bridge_curl',
      name: 'Slick Floor Bridge Curl',
      category: 'legs',
      location: ['gym'],
      cues: 'Supine, heels on slick surface. Bridge and slide.',
      spineSafe: 'Safest exercise. Zero compression.',
      defaultRestSec: 90
    }),
    ex({
      id: 'seated_ham_curl',
      name: 'Seated/Prone Ham Curl',
      category: 'legs',
      location: ['gym'],
      cues: 'Machine, zero spinal loading.',
      spineSafe: 'Precise overload.',
      defaultRestSec: 75
    }),
    ex({
      id: 'sb_ham_curl',
      name: 'Stability Ball Ham Curl',
      category: 'legs',
      location: ['gym'],
      cues: 'Supine, heels on ball.',
      spineSafe: 'Instability + greater ROM.',
      defaultRestSec: 75
    }),

    // ========== Core — McGill Big 3 ==========
    ex({
      id: 'mcgill_curlup',
      name: 'McGill Curl-Up',
      category: 'core',
      location: ['gym', 'hotel'],
      cues: 'One knee bent, hands under low back. 8–10s holds. 5→3→1 pyramid.',
      spineSafe: 'McGill Big 3 #1.',
      defaultRestSec: 30
    }),
    ex({
      id: 'dead_bug',
      name: 'Dead Bug',
      category: 'core',
      location: ['gym', 'hotel'],
      cues: 'Supine, lumbar flat. Opposite arm/leg.',
      spineSafe: 'Dynamic motor control.',
      defaultRestSec: 30
    }),
    ex({
      id: 'rkc_plank',
      name: 'RKC Plank',
      category: 'core',
      location: ['gym', 'hotel'],
      cues: 'Max PPT, glute squeeze. 10–20s.',
      spineSafe: 'Greater EMG activation than long planks.',
      defaultRestSec: 30
    }),
    ex({
      id: 'side_plank',
      name: 'Side Plank',
      category: 'core',
      location: ['gym', 'hotel'],
      cues: 'Elbow + knee, progress to feet. 5→3→1 pyramid.',
      spineSafe: 'McGill Big 3 #2. Targets QL.',
      defaultRestSec: 30
    }),
    ex({
      id: 'suitcase_carry',
      name: 'Suitcase Carry',
      category: 'core',
      location: ['gym', 'hotel'],
      cues: 'Spine vertical. Unilateral at side. 30–40m/side.',
      spineSafe: 'Dynamic anti-lateral flexion.',
      defaultRestSec: 60
    }),
    ex({
      id: 'hk_pallof',
      name: 'Half-Kneeling Pallof Press',
      category: 'core',
      location: ['gym', 'hotel'],
      cues: 'Perpendicular to cable/band. Neutral spine.',
      spineSafe: 'Precise progression.',
      defaultRestSec: 45
    }),
    ex({
      id: 'standing_pallof',
      name: 'Standing Pallof Press',
      category: 'core',
      location: ['gym', 'hotel'],
      cues: 'Cable/band at chest. Press and hold.',
      spineSafe: 'Standing = functional transfer.',
      defaultRestSec: 45
    }),
    ex({
      id: 'bird_dog',
      name: 'Bird Dog',
      category: 'core',
      location: ['gym', 'hotel'],
      cues: 'Opposite arm/leg. Spine motionless. 5→3→1.',
      spineSafe: 'McGill Big 3 #3.',
      defaultRestSec: 30
    }),
    ex({
      id: 'plank_shoulder_taps',
      name: 'Plank Shoulder Taps',
      category: 'core',
      location: ['gym', 'hotel'],
      cues: 'Forearm plank. No hip rotation.',
      spineSafe: 'Greater oblique engagement.',
      defaultRestSec: 45
    }),
    ex({
      id: 'face_pulls_hang',
      name: 'Face Pulls + Dead Hang',
      category: 'core',
      location: ['gym'],
      cues: 'Pull rope apart. Then overhand hang.',
      spineSafe: 'Decompresses L4/L5.',
      defaultRestSec: 60
    }),
    ex({
      id: 'band_pullapart_hang',
      name: 'Band Pull-Aparts + Hang',
      category: 'core',
      location: ['gym'],
      cues: 'Band horizontal. Supported hang after.',
      spineSafe: 'Scapular retraction.',
      defaultRestSec: 60
    }),
    ex({
      id: 'prone_yt_decomp',
      name: 'Prone Y/T + Decompression',
      category: 'core',
      location: ['gym', 'hotel'],
      cues: 'Y/T face-down. Prone with pillow 2–3min.',
      spineSafe: "McGill's sciatica protocol.",
      defaultRestSec: 30
    }),
    ex({
      id: 'angels_devils_pu_plus',
      name: 'Angels & Devils + Push-up Plus',
      category: 'core',
      location: ['gym', 'hotel'],
      cues: 'Prone arm cycles + push through shoulder blades.',
      spineSafe: 'Cavaliere non-negotiable correctives.',
      defaultRestSec: 45
    }),
    ex({
      id: 'prone_iyt_serratus',
      name: 'Prone I/Y/T + Serratus Punch',
      category: 'core',
      location: ['gym', 'hotel'],
      cues: 'I/Y/T prone. Supine serratus punch.',
      spineSafe: 'Y = gold standard lower trap.',
      defaultRestSec: 45
    }),
    ex({
      id: 'wall_slides_pu_plus',
      name: 'Wall Slides + Kneeling PU Plus',
      category: 'core',
      location: ['gym', 'hotel'],
      cues: 'Back on wall. Hands-and-knees protraction.',
      spineSafe: '60% less lumbar load.',
      defaultRestSec: 45
    }),

    // ========== Hotel-only variants ==========
    ex({
      id: 'db_rdl',
      name: 'DB Romanian Deadlift',
      category: 'pull',
      location: ['hotel'],
      cues: 'Two DBs along thighs. Stop at mid-shin.',
      gymRef: 'trap_bar_dl_high',
      defaultRestSec: 120
    }),
    ex({
      id: 'band_pull_through',
      name: 'Band Pull-Through',
      category: 'pull',
      location: ['hotel'],
      cues: 'Anchor band low under door. Face away, hinge and drive.',
      gymRef: 'cable_pull_through',
      defaultRestSec: 75
    }),
    ex({
      id: 'db_hip_thrust_bed',
      name: 'DB Hip Thrust (Bed Edge)',
      category: 'pull',
      location: ['hotel'],
      cues: 'Shoulders on bed edge. DB on hips with towel. PPT at top.',
      gymRef: 'bb_hip_thrust',
      defaultRestSec: 90
    }),
    ex({
      id: 'incline_db_csr',
      name: 'Incline DB Chest-Supported Row',
      category: 'pull',
      location: ['hotel'],
      cues: 'Bench at 30–45° or lean on bed-edge pillows. Neutral grip.',
      gymRef: 'chest_supported_row',
      defaultRestSec: 90
    }),
    ex({
      id: 'sa_db_row',
      name: '1-Arm DB Row',
      category: 'pull',
      location: ['hotel'],
      cues: 'Free hand on bench. Both feet on floor.',
      gymRef: 'seated_cable_row',
      defaultRestSec: 75
    }),
    ex({
      id: 'inverted_row_table',
      name: 'Inverted Row (Under Table)',
      category: 'pull',
      location: ['hotel'],
      cues: 'Supine under desk. Pull chest to edge.',
      gymRef: 'inverted_row',
      defaultRestSec: 60
    }),
    ex({
      id: 'db_pullover_floor',
      name: 'DB Pullover (Floor)',
      category: 'pull',
      location: ['hotel'],
      cues: 'Floor or bed edge. Feet up. Stop at ear level.',
      gymRef: 'db_pullover',
      defaultRestSec: 75
    }),
    ex({
      id: 'band_sa_pulldown',
      name: 'Band Straight-Arm Pulldown',
      category: 'pull',
      location: ['hotel'],
      cues: 'Band at door top. Pull to hips. 2-sec squeeze.',
      gymRef: 'sa_cable_pulldown',
      defaultRestSec: 60
    }),
    ex({
      id: 'prone_seal_row',
      name: 'Prone DB Seal Row',
      category: 'pull',
      location: ['hotel'],
      cues: 'Face-down on bed. DBs hang. Wide elbows.',
      gymRef: 'machine_pullover',
      defaultRestSec: 75
    }),
    ex({
      id: 'band_lat_pulldown',
      name: 'Band Lat Pulldown',
      category: 'pull',
      location: ['hotel'],
      cues: 'Kneel facing door, band at top. 3-sec eccentric.',
      gymRef: 'wide_lat_pulldown',
      defaultRestSec: 75
    }),
    ex({
      id: 'db_gorilla_row_hotel',
      name: 'DB Gorilla Row',
      category: 'pull',
      location: ['hotel'],
      cues: 'DBs on elevated surface. Alternating.',
      gymRef: 'db_gorilla_row_elev',
      defaultRestSec: 90
    }),
    ex({
      id: 'prone_db_row_bed',
      name: 'Prone DB Row (Bed)',
      category: 'pull',
      location: ['hotel'],
      cues: 'Face-down across bed. Wide elbows.',
      gymRef: 'sa_cable_row',
      defaultRestSec: 75
    }),
    ex({
      id: 'band_seated_row',
      name: 'Band Seated Row',
      category: 'pull',
      location: ['hotel'],
      cues: 'Band around feet. Sit on floor.',
      gymRef: 'seated_machine_row',
      defaultRestSec: 75
    }),
    ex({
      id: 'db_sumo_dl',
      name: 'DB Sumo Deadlift (Light)',
      category: 'pull',
      location: ['hotel'],
      cues: 'Wide stance, DB between feet. Upright torso.',
      gymRef: 'reverse_hyper',
      defaultRestSec: 90
    }),

    ex({
      id: 'db_bench_hotel',
      name: 'DB Bench Press',
      category: 'push',
      location: ['hotel'],
      compound: true,
      cues: 'Slow tempo. Pause 1-sec. Floor if no bench.',
      gymRef: 'bb_bench_press',
      defaultRestSec: 150
    }),
    ex({
      id: 'db_floor_press_15',
      name: 'DB Floor Press (1.5 reps)',
      category: 'push',
      location: ['hotel'],
      cues: 'Full rep + half rep = 1. Supine = safe.',
      gymRef: 'db_floor_press',
      defaultRestSec: 120
    }),
    ex({
      id: 'pushup_tempo',
      name: 'Push-Up (Tempo)',
      category: 'push',
      location: ['hotel'],
      cues: 'Feet elevated or diamond. 3-1-2 tempo.',
      gymRef: 'standing_cable_press',
      defaultRestSec: 90
    }),
    ex({
      id: 'band_crossover',
      name: 'Band Crossover',
      category: 'push',
      location: ['hotel'],
      cues: 'Door anchor. Vary heights.',
      gymRef: 'cable_crossover',
      defaultRestSec: 60
    }),
    ex({
      id: 'hk_db_press',
      name: 'Half-Kneeling DB Press',
      category: 'push',
      location: ['hotel'],
      cues: 'Kneel on pressing side. Squeeze glute. Ribs down.',
      gymRef: 'hk_landmine',
      defaultRestSec: 90
    }),
    ex({
      id: 'seated_arnold',
      name: 'Seated Arnold Press',
      category: 'push',
      location: ['hotel'],
      cues: 'Chair backrest. Rotate palms during press.',
      gymRef: 'machine_shoulder_press',
      defaultRestSec: 90
    }),
    ex({
      id: 'db_front_lat',
      name: 'DB Front + Lateral Raise',
      category: 'push',
      location: ['hotel'],
      cues: 'Standing. Light. Full delt coverage.',
      gymRef: 'seated_cable_press',
      defaultRestSec: 45
    }),
    ex({
      id: 'underhand_db_hotel',
      name: 'Underhand DB Press',
      category: 'push',
      location: ['hotel'],
      cues: 'Supinated grip. Floor prevents arch.',
      gymRef: 'underhand_db_bench',
      defaultRestSec: 120
    }),
    ex({
      id: 'pushup_feet_elev',
      name: 'Push-Up (Feet Elevated)',
      category: 'push',
      location: ['hotel'],
      cues: 'Feet on bed. 3-1-2 tempo.',
      gymRef: 'low_high_cable_fly',
      defaultRestSec: 75
    }),
    ex({
      id: 'diamond_pushup',
      name: 'Diamond Push-Up',
      category: 'push',
      location: ['hotel'],
      cues: 'Hands form diamond. Triceps focus.',
      gymRef: 'dip_machine',
      defaultRestSec: 60
    }),
    ex({
      id: 'band_pushdown',
      name: 'Band Pushdown',
      category: 'push',
      location: ['hotel'],
      cues: 'Band anchored at door top. Elbows pinned.',
      gymRef: 'cable_pushdown',
      defaultRestSec: 60
    }),
    ex({
      id: 'db_kickback',
      name: 'DB Kickback',
      category: 'push',
      location: ['hotel'],
      cues: 'Bent-over. Isolate triceps.',
      gymRef: 'cable_pushdown',
      defaultRestSec: 45
    }),
    ex({
      id: 'waiter_curl',
      name: 'DB Waiter Curl',
      category: 'pull',
      location: ['gym', 'hotel'],
      cues: 'Hold one DB vertically by the bell in both hands.',
      defaultRestSec: 60
    }),
    ex({
      id: 'concentration_curl',
      name: 'Concentration Curl',
      category: 'pull',
      location: ['gym', 'hotel'],
      cues: 'Seated. Stretched position. Elbow locked on inner thigh.',
      defaultRestSec: 45
    }),

    ex({
      id: 'goblet_squat_he',
      name: 'DB Heel-Elevated Goblet Squat',
      category: 'legs',
      location: ['hotel'],
      compound: true,
      cues: "Heavy DB at chest. Heels on book/towel. Don't go below 90°.",
      gymRef: 'belt_squat',
      defaultRestSec: 150
    }),
    ex({
      id: 'bulgarian_ss',
      name: 'DB Bulgarian Split Squat',
      category: 'legs',
      location: ['hotel'],
      cues: 'Rear foot on bed. Goblet or suitcase hold.',
      gymRef: 'leg_extension',
      defaultRestSec: 120
    }),
    ex({
      id: 'wall_sit_db',
      name: 'Wall Sit + DB',
      category: 'legs',
      location: ['hotel'],
      cues: 'Back flat on wall. DB on lap. Pure quad iso.',
      gymRef: 'hack_squat',
      defaultRestSec: 90
    }),
    ex({
      id: 'sl_hip_thrust',
      name: 'Single-Leg Hip Thrust',
      category: 'legs',
      location: ['hotel'],
      cues: 'Same setup, one foot. No load needed.',
      gymRef: 'banded_glute_bridge',
      defaultRestSec: 90
    }),
    ex({
      id: 'db_step_up',
      name: 'DB Step-Up',
      category: 'legs',
      location: ['hotel'],
      cues: 'Sturdy chair. DBs at sides.',
      gymRef: 'sl_leg_press',
      defaultRestSec: 75
    }),
    ex({
      id: 'walking_lunge',
      name: 'DB Walking Lunge',
      category: 'legs',
      location: ['hotel'],
      cues: 'DBs at sides. Hotel hallway.',
      gymRef: 'step_up',
      defaultRestSec: 90
    }),
    ex({
      id: 'bstance_db_rdl',
      name: 'B-Stance DB RDL',
      category: 'legs',
      location: ['hotel'],
      cues: 'Kickstand. DBs close to front leg. 3-sec eccentric.',
      gymRef: 'b_stance_rdl',
      defaultRestSec: 90
    }),
    ex({
      id: 'prone_db_ham_bed',
      name: 'Prone DB Ham Curl (Bed)',
      category: 'legs',
      location: ['hotel'],
      cues: 'Face-down, knees at bed edge. DB between feet.',
      gymRef: 'hip_ext_45',
      defaultRestSec: 75
    }),
    ex({
      id: 'towel_sliding_ham',
      name: 'Towel Sliding Ham Curl',
      category: 'legs',
      location: ['hotel'],
      cues: 'Bathroom tile + towel. Bridge and slide.',
      gymRef: 'slick_bridge_curl',
      defaultRestSec: 90
    }),

    ex({
      id: 'band_pallof',
      name: 'Band Pallof Press',
      category: 'core',
      location: ['hotel'],
      cues: 'Band on door anchor. Stand perpendicular.',
      gymRef: 'hk_pallof',
      defaultRestSec: 45
    }),
    ex({
      id: 'band_facepull',
      name: 'Band Face Pull + Pull-Apart',
      category: 'core',
      location: ['hotel'],
      cues: 'Door anchor face height.',
      gymRef: 'face_pulls_hang',
      defaultRestSec: 60
    }),
    ex({
      id: 'prone_yt_bed',
      name: 'Prone Y/T Raises',
      category: 'core',
      location: ['hotel'],
      cues: 'Face-down on bed. 2–5 lb DBs.',
      gymRef: 'band_pullapart_hang',
      defaultRestSec: 45
    }),
    ex({
      id: 'db_prone_rev_fly',
      name: 'DB Prone Reverse Fly',
      category: 'core',
      location: ['hotel'],
      cues: 'Face-down on bed edge. Light DBs.',
      gymRef: 'prone_yt_decomp',
      defaultRestSec: 45
    }),
    ex({
      id: 'prone_bed_decomp',
      name: 'Prone Bed Decompression',
      category: 'core',
      location: ['hotel'],
      cues: 'Face-down, arms off bed edge. Gentle traction. 3–5 min.',
      gymRef: 'face_pulls_hang',
      defaultRestSec: 0
    }),
    ex({
      id: 'band_pullapart_kn_pu',
      name: 'Band Pull-Apart + Kneeling PU Plus',
      category: 'core',
      location: ['hotel'],
      cues: 'Band horizontal. Hands-and-knees protraction.',
      gymRef: 'wall_slides_pu_plus',
      defaultRestSec: 45
    })
  ].map((e) => [e.id, e])
);
