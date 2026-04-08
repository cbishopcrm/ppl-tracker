// ============================================================
// PPL Tracker — Workout Data
// Based on Athlean-X PPL with spine-safe modifications
// (McGill, Squat University, Contreras)
// ============================================================

// Helper: o = standard exercise, h = hotel exercise with gym reference
const o = (n, r, t, s = '') => ({ n, r, t, s });
const h = (n, r, t, g = '') => ({ n, r, t, s: '', g });

// Day labels/order
const DAY_META = [
  { key: 'pull', label: 'Pull',  day: 'Mon', icon: '⬅' },
  { key: 'push', label: 'Push',  day: 'Tue', icon: '➡' },
  { key: 'legs', label: 'Legs',  day: 'Thu', icon: '⬇' },
  { key: 'core', label: 'Core',  day: 'Fri', icon: '◎' },
];

// ============================================================
// GYM — WEEK A
// ============================================================
const G_A = [
  // --- Pull 1 ---
  [
    [
      o("Trap Bar DL (High Handles)", "1×5, RPE 7–8",
        "4 ramp-up sets. Stand inside bar. High handles reduce ROM.",
        "Replaces conventional DL. 9.2% lower spinal flexion moment."),
      o("Cable Pull-Through", "3×12–15",
        "Hinge at hips, drive forward. Horizontal resistance = zero axial compression.",
        "Top glute max activation (Contreras EMG)."),
      o("Reverse Hyperextension", "3×12–15",
        "Torso face-down (supported). Legs pendulum arc. Spine decompressed.",
        "Builds posterior chain WHILE decompressing L4/L5.")
    ],
    [
      o("Chest Supported Row", "3×8–10",
        "30–45° incline. Chest on pad. Load aggressively.",
        "Gold standard — lowest spine loads with high lat activation."),
      o("Seated Cable Row", "3–4×10–12",
        "Upright torso, feet braced. V-bar or wide bar.",
        "Constant cable tension through full ROM."),
      o("Inverted Row", "3×8–15",
        "Supine under barbell. Rigid plank. Adjust height.",
        "Zero axial compression. Self-limiting.")
    ],
    [
      o("DB Pullover", "2–3×12–15",
        "Lie fully on bench. Feet up. Stop at ear level.",
        "Feet up protects lumbar curve."),
      o("Straight-Arm Cable Pulldown", "3×12–15",
        "Slight hinge, braced core. 2-sec eccentric.",
        "Constant tension. Cavaliere staple."),
      o("Machine Pullover", "3×10–12",
        "Seat/back pad stabilize torso. Zero compression.",
        "Machine constrains to shoulder joint.")
    ],
    [
      o("Chin Curl → OH Tri Ext", "3×fail → 3×10–12",
        "Underhand chins to failure, then OH extensions. Dead hangs between.",
        "Hanging decompresses spine."),
      o("Preacher Curl + Cable Pushdown", "3×10–12 each",
        "EZ-bar preacher + rope pushdown.",
        "Superior isolation. Zero spinal involvement."),
      o("Incline DB Curl + Hammer Curl", "3×10–12 each",
        "45–60° incline (supported) + neutral hammers.",
        "Max stretch + brachialis.")
    ]
  ],

  // --- Push 1 ---
  [
    [
      o("Barbell Bench Press", "4×4–6",
        "Natural arch only. Squeeze glutes, feet flat.",
        "Supine = no axial compression."),
      o("DB Floor Press", "3–4×8–12",
        "Floor supports spine. Natural ROM limiter.",
        "Floor eliminates arch. Corrects imbalances."),
      o("Standing Cable Chest Press", "3×10–12/side",
        "Horizontal resistance. Anti-rotation stabilizer.",
        "Physio Steve recommends for disc patients.")
    ],
    [
      o("Hi-to-Low Crossover", "3×10–12",
        "Pulleys at head height. Full adduction."),
      o("Pec Deck / Machine Fly", "3×12–15",
        "Seated, back-supported. Fixed arc.",
        "Push closer to true pec failure."),
      o("Lying Cable Fly", "3×10–12",
        "Supine between low pulleys. 3-sec eccentric.",
        "Constant tension both phases.")
    ],
    [
      o("Seated DB Shoulder Press", "3×10–12",
        "75–80° incline, back on pad. Ribs down.",
        "Seated with support eliminates compression."),
      o("Standing DB Front Raise", "3–4×12–15",
        "Zero compression. Light loads.",
        "Isolates anterior delt."),
      o("Standing DB Lateral Raise", "3–4×12–15",
        "No overhead. No axial compression.",
        "Premier medial delt isolation.")
    ],
    [
      o("Lying Tri Ext → Waiter Curl", "3×10–12 → 3×10–12",
        "Arms back 20–30°. Straight into curls."),
      o("Cable Pushdown + Incline DB Curl", "3×10–12 each",
        "Rope pushdown + 45° incline curl.",
        "Lateral/medial heads + long head."),
      o("OH Cable Tri + Lying Cable Curl", "3×12–15 each",
        "OH in split stance. Lying curl supine.",
        "Premier long-head tricep.")
    ]
  ],

  // --- Legs 1 ---
  [
    [
      o("Belt Squat (or Leg Press)", "4×6–8",
        "Load bypasses spine. Push hard.",
        "45–52% lower erector activation, same quad."),
      o("Leg Extension", "3×12–15",
        "Seated, back support. 2-sec up, 3-sec down.",
        "Purest quad isolation."),
      o("Hack Squat", "3×8–12",
        "45° sled with back pad.",
        "Compound quad. Foot placement varies.")
    ],
    [
      o("BB Hip Thrust", "3×8–10",
        "PPT at lockout. Force perpendicular to spine.",
        "PPT cue eliminates hyperextension."),
      o("Banded Glute Bridge", "3×15–20",
        "Floor, band above knees. 3-sec hold.",
        "Floor eliminates hyperextension."),
      o("Cable Pull-Through", "3×12–15",
        "Horizontal cable. Hinge only.",
        "Targets glutes + hamstrings.")
    ],
    [
      o("DB Reverse Lunge", "3×8–10/leg",
        "DBs at sides. Step back, upright.",
        "No barbell compression."),
      o("Single-Leg Leg Press", "3×10–12/leg",
        "Full support. Stop when lumbar lifts.",
        "Machine safety + unilateral."),
      o("Step-Up (DBs at Sides)", "3×10–12/leg",
        "Lower step = quad; higher = glute.",
        "Concentric-dominant.")
    ],
    [
      o("B-Stance RDL", "3×8–10, 3s ecc",
        "80/20 split. Light load. Neutral spine.",
        "If symptoms: swap to prone ham curls."),
      o("45° Hip Extension", "3×10–15",
        "Roman chair, PPT to isolate.",
        "Full-length hamstring activation."),
      o("Single-Leg Glute Bridge", "3×10–12/leg",
        "Supine, zero compression.",
        "Unilateral without spinal load.")
    ]
  ],

  // --- Core 1 ---
  [
    [
      o("McGill Curl-Up", "5→3→1 (8–10s)",
        "One knee bent, hands under low back.",
        "McGill Big 3 #1."),
      o("Dead Bug", "3×8–10/side",
        "Supine, lumbar flat. Opposite arm/leg.",
        "Dynamic motor control."),
      o("RKC Plank", "3×10–20s",
        "Max PPT, glute squeeze.",
        "Greater EMG activation.")
    ],
    [
      o("Side Plank", "5→3→1/side (8–10s)",
        "Elbow + knee, progress to feet.",
        "McGill Big 3 #2. Targets QL."),
      o("Suitcase Carry", "3×30–40m/side",
        "Spine vertical. Unilateral at side.",
        "Dynamic anti-lateral flexion."),
      o("Half-Kneeling Pallof", "3×8–10/side",
        "Perpendicular to cable. Neutral spine.",
        "Precise progression.")
    ],
    [
      o("Face Pulls + Dead Hang", "3×15–20 / 3×30–60s",
        "Pull rope apart. Overhand hang.",
        "Decompresses L4/L5."),
      o("Band Pull-Aparts + Hang", "3×15–20 / 3×20–30s",
        "Band horizontal. Supported hang.",
        "Scapular retraction."),
      o("Prone Y/T + Decompression", "3×10–12 / 2–3 min",
        "Y/T face-down. Prone with pillow.",
        "McGill's sciatica protocol.")
    ],
    [
      o("Bird Dog", "5→3→1/side (8–10s)",
        "Opposite arm/leg. Spine motionless.",
        "McGill Big 3 #3."),
      o("Standing Pallof Press", "3×10–12/side",
        "Cable/band at chest. Press and hold.",
        "Standing = functional transfer."),
      o("Plank Shoulder Taps", "3×8–10/side",
        "Forearm plank. No hip rotation.",
        "Greater oblique engagement.")
    ]
  ]
];

// ============================================================
// GYM — WEEK B
// ============================================================
const G_B = [
  // --- Pull 2 ---
  [
    [
      o("Hip Thrust + Cable Pull-Through", "3–4×8–10 / 3×12–15",
        "Hip thrusts (zero compression) + pull-throughs.",
        "Replaces snatch grip DL."),
      o("Reverse Hyperextension", "3×12–15",
        "Supported. Pendulum arc. Decompresses.",
        "Therapeutic + strength."),
      o("Heavy Cable Pull-Through", "4×8–12",
        "Heavier load, powerful hip drive.",
        "Zero compression.")
    ],
    [
      o("Weighted Pull-up", "3×6–8",
        "Full dead hang. Dip belt. 30-sec hangs between.",
        "Therapeutic decompression."),
      o("Wide Lat Pulldown", "3×8–12",
        "Seated, slight lean, pull to chest.",
        "Adjustable load. Same lat activation."),
      o("Neutral Lat Pulldown", "3×10–12",
        "Close handles, mid-chest.",
        "Easier on shoulders.")
    ],
    [
      o("DB Gorilla Row (Elevated)", "3×6–8/arm",
        "Elevate DBs on plates. Slight knee bend.",
        "Elevating reduces hinge depth."),
      o("Single-Arm Cable Row", "3×10–12/arm",
        "Standing or half-kneeling.",
        "Lower spine loads (McGill)."),
      o("Seated Machine Row", "3×10–12",
        "Chest pad, full support.",
        "Heaviest row safely.")
    ],
    [
      o("BB Curl → Tri Pushdown", "3×6–8 → 3×10–12",
        "3-sec eccentrics. Elbows pinned."),
      o("Preacher + OH Cable Tri", "3×10–12 each",
        "Preacher pad. OH in split stance.",
        "Superior isolation."),
      o("Incline DB Curl + Dip Machine", "3×10–12 each",
        "45° incline. Seated dip.",
        "Max stretch. Full support.")
    ]
  ],

  // --- Push 2 ---
  [
    [
      o("Half-Kneeling Landmine Press", "3×8–12/arm",
        "~45° angle. Kneeling kills leg drive.",
        "Replaces OHP. Less compression."),
      o("Seated Machine Shoulder Press", "3×10–12",
        "Fixed path + back pad.",
        "Heavier delt loading."),
      o("Seated Cable Shoulder Press", "3×12–15/arm",
        "Back support. Angled cable.",
        "Constant tension.")
    ],
    [
      o("Underhand DB Bench", "3×8–10",
        "Supinated grip. ~30% more upper pec."),
      o("Low-Incline DB Press", "3×8–12",
        "15–30°. Gold standard upper pec.",
        "Cavaliere optimal angle."),
      o("Low-to-High Cable Fly", "3×12–15",
        "Diagonal matches clavicular fibers.",
        "Constant tension.")
    ],
    [
      o("DB Floor Fly", "3×10–12",
        "Floor limits ROM. Slight elbow bend."),
      o("Cable Crossover", "3×12–15",
        "Standing. Horizontal resistance.",
        "Constant tension. Versatile."),
      o("DB Squeeze Press", "3×10–12",
        "Press DBs together throughout.",
        "Inner pec fibers.")
    ],
    [
      o("Close Grip Bench → DB Curl", "3×6–8 → 3×10–12",
        "Heavy tri compound, then curls."),
      o("Dip Machine + EZ Cable Curl", "3×10–12 each",
        "Seated dip. Cable curl.",
        "Heavier loading + constant tension."),
      o("OH Cable Tri + Concentration Curl", "3×10–12 each",
        "Split-stance OH. Seated concentration.",
        "Stretched position.")
    ]
  ],

  // --- Legs 2 ---
  [
    [
      o("Belt Squat (or Leg Press)", "4×6–8",
        "Same as V1. Zero compression.",
        "Goblet squat if no machine."),
      o("Leg Extension", "3×12–15",
        "Seated. Slow tempo.",
        "Purest quad isolation."),
      o("Hack Squat", "3×8–12",
        "Back pad on 45° sled.",
        "Compound quad.")
    ],
    [
      o("BB Hip Thrust", "3×8–10",
        "PPT at lockout. Pause 1–2 sec."),
      o("Banded Glute Bridge", "3×15–20",
        "Floor. Band above knees.",
        "Eliminates hyperextension."),
      o("Frog Pump (Banded)", "3×20–25",
        "Soles together. Short ROM.",
        "Max glute activation.")
    ],
    [
      o("DB Reverse Lunge", "3×8–10/leg",
        "DBs at sides. Step back."),
      o("Single-Leg Leg Press", "3×10–12/leg",
        "Full support. Unilateral.",
        "Spine not limiter."),
      o("Step-Up", "3×10–12/leg",
        "DBs at sides. Controlled.",
        "Concentric-dominant.")
    ],
    [
      o("Slick Floor Bridge Curl", "2–3× fail",
        "Supine, heels on slick surface. Bridge and slide.",
        "Safest exercise. Zero compression."),
      o("Seated/Prone Ham Curl", "3×10–15",
        "Machine, zero spinal loading.",
        "Precise overload."),
      o("Stability Ball Ham Curl", "3×10–15",
        "Supine, heels on ball.",
        "Instability + greater ROM.")
    ]
  ],

  // --- Core 2 ---
  [
    [
      o("McGill Curl-Up", "5→3→1 (8–10s)",
        "Same. Consistent practice."),
      o("Dead Bug", "3×8–10/side",
        "Same. Lumbar flat."),
      o("RKC Plank", "3×10–20s",
        "Same. Max tension.")
    ],
    [
      o("Side Plank", "5→3→1/side",
        "Same.",
        "QL endurance."),
      o("Suitcase Carry", "3×30–40m/side",
        "Same.",
        "Greater activation."),
      o("Half-Kneeling Pallof", "3×8–10/side",
        "Same.",
        "Glute engagement.")
    ],
    [
      o("Angels & Devils + Pushup Plus", "3×15–20 / 3×fail",
        "Prone arm cycles. Push through shoulder blades.",
        "Cavaliere non-negotiable correctives."),
      o("Prone I/Y/T + Serratus Punch", "2×8–10 / 2×12–15",
        "I/Y/T prone. Supine punch.",
        "Y = gold standard lower trap."),
      o("Wall Slides + Kneeling PU Plus", "3×10–12 / 3×12–15",
        "Back on wall. Hands-and-knees protraction.",
        "60% less lumbar load.")
    ],
    [
      o("Bird Dog", "5→3→1/side",
        "Same."),
      o("Standing Pallof Press", "3×10–12/side",
        "Same.",
        "Progressive overload."),
      o("Plank Shoulder Taps", "3×8–10/side",
        "Same.",
        "Greater rotational demand.")
    ]
  ]
];

// ============================================================
// HOTEL — WEEK A
// ============================================================
const H_A = [
  // --- Pull 1 ---
  [
    [
      h("DB Romanian Deadlift", "3–4×8–12",
        "Two DBs along thighs. Stop at mid-shin. Progress to single-leg.",
        "Gym: Trap bar DL"),
      h("Band Pull-Through", "3×12–15",
        "Anchor band low under door. Face away, hinge and drive.",
        "Gym: Cable pull-through"),
      h("DB Hip Thrust (Bed Edge)", "3–4×12–15",
        "Shoulders on bed edge. DB on hips with towel. PPT at top.",
        "Gym: Reverse hyper")
    ],
    [
      h("Incline DB Chest-Supported Row", "3–4×10–12",
        "Bench at 30–45° or lean on bed-edge pillows. Neutral grip.",
        "Gym: Chest supported row"),
      h("1-Arm DB Row (Bench)", "3–4×10–12/arm",
        "Free hand on bench. Both feet on floor.",
        "Gym: Seated cable row"),
      h("Inverted Row (Under Table)", "3×8–12",
        "Supine under desk. Pull chest to edge.",
        "Gym: Inverted row")
    ],
    [
      h("DB Pullover (Floor)", "3×12–15",
        "Floor or bed edge. Feet up. Stop at ear level.",
        "Gym: DB pullover"),
      h("Band Straight-Arm Pulldown", "3×12–15",
        "Band at door top. Pull to hips. 2-sec squeeze.",
        "Gym: SA cable pulldown"),
      h("Prone DB Seal Row", "3×10–12",
        "Face-down on bed. DBs hang. Wide elbows.",
        "Gym: Machine pullover")
    ],
    [
      h("Band Lat Pulldown → DB Curl", "3×12–15 → 3×10–12",
        "Kneel facing door, pull band. Then alternating curls, 3-sec ecc.",
        "Gym: Chin curl → OH tri"),
      h("Incline DB Curl + DB Kickback", "3×10–12 each",
        "45° bench + bent-over kickbacks.",
        "Gym: Preacher + pushdown"),
      h("Hammer Curl + DB OH Tri Ext", "3×10–12 each",
        "Standing hammers + seated OH ext with chair support.",
        "Gym: Incline curl + hammer")
    ]
  ],

  // --- Push 1 ---
  [
    [
      h("DB Bench Press (or Floor Press)", "4×8–12, tempo 3-1-2",
        "Slow tempo. Pause 1-sec. Floor if no bench.",
        "Gym: BB bench press"),
      h("DB Floor Press (1.5 reps)", "3–4×10–12",
        "Full rep + half rep = 1. Supine = safe.",
        "Gym: DB floor press"),
      h("Push-Up Variations (Tempo)", "4×10–15, 3-1-2",
        "Feet elevated or diamond. Tempo = intensity.",
        "Gym: Cable chest press")
    ],
    [
      h("DB Floor Fly + Band Crossover", "3×12–15 each",
        "Floor flys + band at chest on door.",
        "Gym: Hi-to-low crossover"),
      h("DB Squeeze Fly (Floor)", "3×12–15",
        "Floor fly, squeeze DBs at top 2 sec. Towel under back.",
        "Gym: Pec deck"),
      h("Band Crossover", "3×12–15",
        "Door anchor. Vary heights.",
        "Gym: Lying cable fly")
    ],
    [
      h("Seated DB Press (Chair)", "3×10–12",
        "Chair with backrest. Towel behind low back.",
        "Gym: Seated DB press"),
      h("Half-Kneeling DB Press", "3×10–12/arm",
        "Kneel on pressing side. Squeeze glute. Ribs down.",
        "Gym: Front raise"),
      h("Standing DB Lateral Raise", "3–4×12–15",
        "Light load. No overhead.",
        "Gym: Lateral raise")
    ],
    [
      h("DB Skull Crusher → Waiter Curl", "3×10–15 → 3×12–15",
        "Floor skull crushers. Then waiter curls.",
        "Gym: Lying tri → waiter"),
      h("Band Pushdown + Incline DB Curl", "3×12–15 each",
        "Band at door top. 45° bench curl.",
        "Gym: Cable pushdown + incline"),
      h("DB OH Tri Ext + Hammer Curl", "3×10–12 each",
        "Seated OH ext (chair). Standing hammers.",
        "Gym: OH cable + lying curl")
    ]
  ],

  // --- Legs 1 ---
  [
    [
      h("DB Heel-Elevated Goblet Squat", "3–4×10–15, tempo 3-1-2",
        "Heavy DB at chest. Heels on book/towel. Don't go below 90°.",
        "Gym: Belt squat / leg press"),
      h("DB Bulgarian Split Squat", "3×8–12/leg",
        "Rear foot on bed. Goblet or suitcase hold.",
        "Gym: Leg extension"),
      h("Wall Sit + DB", "3×30–60s",
        "Back flat on wall. DB on lap. Pure quad iso.",
        "Gym: Hack squat")
    ],
    [
      h("DB Hip Thrust (Bed Edge)", "3–4×12–15",
        "Shoulder blades on bed. DB across hips. Towel. PPT.",
        "Gym: BB hip thrust"),
      h("Single-Leg Hip Thrust", "3×10–12/leg",
        "Same setup, one foot. No load needed.",
        "Gym: Banded bridge"),
      h("Banded Glute Bridge", "3×15–20",
        "Floor. Band above knees. 3-sec hold.",
        "Gym: Cable pull-through")
    ],
    [
      h("DB Reverse Lunge", "3×10–12/leg",
        "Suitcase grip. Step back. Upright.",
        "Gym: DB reverse lunge"),
      h("DB Step-Up", "3×10–12/leg",
        "Sturdy chair. DBs at sides.",
        "Gym: Single-leg press"),
      h("DB Walking Lunge", "3×8–10/leg",
        "DBs at sides. Hotel hallway.",
        "Gym: Step-up")
    ],
    [
      h("B-Stance DB RDL", "3×10–12/side, 3s ecc",
        "Kickstand. DBs close to front leg. Neutral spine.",
        "Gym: B-stance RDL"),
      h("Prone DB Ham Curl (Bed)", "3×12–15",
        "Face-down, knees at bed edge. DB between feet.",
        "Gym: 45° hip ext"),
      h("Towel Sliding Ham Curl", "3–4×8–12",
        "Bathroom tile + towel. Bridge and slide.",
        "Gym: SL glute bridge")
    ]
  ],

  // --- Core 1 ---
  [
    [
      h("McGill Curl-Up", "5→3→1 (8–10s)",
        "Same as gym."),
      h("Dead Bug", "3×8–10/side",
        "Same as gym."),
      h("RKC Plank", "3×10–20s",
        "Same as gym.")
    ],
    [
      h("Side Plank", "5→3→1/side",
        "Same as gym."),
      h("Suitcase Carry", "3×30–40m/side",
        "Hotel hallway. One heavy DB."),
      h("Band Pallof Press", "3×8–12/side",
        "Band on door anchor. Stand perpendicular.",
        "Gym: HK Pallof")
    ],
    [
      h("Band Face Pull + Pull-Apart", "3×15–20 each",
        "Door anchor face height.",
        "Gym: Cable face pull"),
      h("Prone Y/T Raises", "3×10–12 each",
        "Face-down on bed. 2–5 lb DBs.",
        "Gym: Band pull-aparts"),
      h("DB Prone Reverse Fly", "3×12–15",
        "Face-down on bed edge. Light DBs.",
        "Gym: Prone Y/T")
    ],
    [
      h("Bird Dog", "5→3→1/side",
        "Same as gym."),
      h("Plank Shoulder Taps", "3×8–10/side",
        "Forearm plank. No hip rotation.",
        "Gym: Pallof press"),
      h("Prone Bed Decompression", "3–5 min",
        "Face-down, arms off bed edge. Gentle traction.",
        "Gym: Dead hang")
    ]
  ]
];

// ============================================================
// HOTEL — WEEK B
// ============================================================
const H_B = [
  // --- Pull 2 ---
  [
    [
      h("DB Hip Thrust + Band Pull-Through", "3×12–15 / 3×12–15",
        "Bed edge thrust + band low under door.",
        "Gym: Hip thrust + cable PT"),
      h("DB Sumo DL (Light)", "3×10–12",
        "Wide stance, DB between feet. Upright.",
        "Gym: Reverse hyper"),
      h("Band Pull-Through (Heavy)", "4×10–12",
        "Double up bands. Powerful drive.",
        "Gym: Heavy cable PT")
    ],
    [
      h("Heavy 1-Arm DB Row", "3–4×8–10/arm",
        "Heaviest DB. Hand on bed. Both feet down.",
        "Gym: Weighted pull-up"),
      h("Band Lat Pulldown (Heavy)", "3–4×8–12",
        "Choke up for resistance. 3-sec ecc.",
        "Gym: Wide lat pulldown"),
      h("Chest-Supported DB Row", "3×10–12",
        "Lean on bed-edge pillows. Row two DBs.",
        "Gym: Neutral pulldown")
    ],
    [
      h("DB Gorilla Row", "3×8–10/arm",
        "DBs on elevated surface. Alternating.",
        "Gym: DB gorilla row"),
      h("Prone DB Row (Bed)", "3×10–12",
        "Face-down across bed. Wide elbows.",
        "Gym: SA cable row"),
      h("Band Seated Row", "3×12–15",
        "Band around feet. Sit on floor.",
        "Gym: Seated machine row")
    ],
    [
      h("DB Curl → Band Pushdown", "3×10–12 → 3×12–15",
        "Alternating curls (3s ecc) + band at door top.",
        "Gym: BB curl → pushdown"),
      h("Incline DB Curl + OH Tri Ext", "3×10–12 each",
        "45° bench. Seated OH ext.",
        "Gym: Preacher + OH tri"),
      h("Concentration Curl + Diamond PU", "3×10–12 / 3×fail",
        "Seated concentration. Diamond push-ups.",
        "Gym: Incline curl + dip")
    ]
  ],

  // --- Push 2 ---
  [
    [
      h("Half-Kneeling DB Press", "3×10–12/arm",
        "Kneel on pressing side. Squeeze glute. Ribs down.",
        "Gym: Landmine press"),
      h("Seated Arnold Press", "3×10–12",
        "Chair backrest. Rotate palms during press.",
        "Gym: Machine shoulder press"),
      h("DB Front + Lateral Raise", "3×10–12 each",
        "Standing. Light. Full delt coverage.",
        "Gym: Cable shoulder press")
    ],
    [
      h("Underhand DB Press (Floor OK)", "3×10–12",
        "Supinated grip. Floor prevents arch.",
        "Gym: Underhand DB bench"),
      h("Low-Incline DB Press", "3×8–12",
        "15–30° if adjustable. Otherwise underhand.",
        "Gym: Low-incline press"),
      h("Push-Up (Feet Elevated)", "3×10–15",
        "Feet on bed. Tempo 3-1-2.",
        "Gym: Low-high cable fly")
    ],
    [
      h("DB Floor Fly", "3×12–15",
        "Towel under upper back for range.",
        "Gym: DB floor fly"),
      h("DB Squeeze Press", "3×10–15",
        "DBs together throughout.",
        "Gym: Cable crossover"),
      h("Band Crossover", "3×12–15",
        "Door anchor chest height.",
        "Gym: DB squeeze press")
    ],
    [
      h("Squeeze Press → Concentration Curl", "3×10–15 → 3×10–12",
        "Neutral grip squeeze for tris. Seated concentration.",
        "Gym: CG bench → curl"),
      h("Band Pushdown + DB Curl", "3×12–15 each",
        "Band at door. Seated DB curls.",
        "Gym: Dip machine + EZ curl"),
      h("Diamond PU + Incline DB Curl", "3×fail / 3×10–12",
        "Zero-equipment tris. 45° curls.",
        "Gym: OH tri + conc curl")
    ]
  ],

  // --- Legs 2 ---
  [
    [
      h("DB Bulgarian Split Squat", "3×8–12/leg",
        "Rear foot on bed. Tempo 3-1-2.",
        "Gym: Belt squat / leg press"),
      h("Goblet Squat (Narrow + Elevated)", "3×12–15, tempo 3-2-1",
        "Narrow stance, heels up. 2-sec pause.",
        "Gym: Leg extension"),
      h("Wall Sit + DB", "3×30–60s",
        "Back on wall. DB on lap.",
        "Gym: Hack squat")
    ],
    [
      h("DB Hip Thrust", "3–4×12–15",
        "Bed edge. DB on hips. PPT.",
        "Gym: BB hip thrust"),
      h("Banded Glute Bridge", "3×15–20",
        "Floor. Band above knees.",
        "Gym: Banded bridge"),
      h("Frog Pump (Banded)", "3×20–25",
        "Soles together. Band above knees.",
        "Gym: Frog pump")
    ],
    [
      h("DB Step-Up", "3×10–12/leg",
        "Sturdy chair. DBs at sides.",
        "Gym: DB reverse lunge"),
      h("DB Reverse Lunge", "3×10–12/leg",
        "Suitcase grip. Step back.",
        "Gym: SL leg press"),
      h("DB Walking Lunge", "3×8–10/leg",
        "Hotel hallway.",
        "Gym: Step-up")
    ],
    [
      h("Towel Sliding Ham Curl", "3–4×8–12",
        "Bathroom tile + towel. Bridge and slide.",
        "Gym: Slick floor curl"),
      h("Prone DB Ham Curl (Bed)", "3×12–15",
        "Face-down. DB between feet. Slow tempo.",
        "Gym: Prone ham curl"),
      h("Single-Leg Glute Bridge", "3×10–12/leg",
        "Supine. One foot planted. BW only.",
        "Gym: Stability ball curl")
    ]
  ],

  // --- Core 2 ---
  [
    [
      h("McGill Curl-Up", "5→3→1", "Same."),
      h("Dead Bug", "3×8–10/side", "Same."),
      h("RKC Plank", "3×10–20s", "Same.")
    ],
    [
      h("Side Plank", "5→3→1/side", "Same."),
      h("Suitcase Carry", "3×30–40m/side", "Hotel hallway."),
      h("Band Pallof Press", "3×8–12/side", "Band on door.", "Gym: HK Pallof")
    ],
    [
      h("Band Face Pull + Pull-Apart", "3×15–20 each",
        "Door anchor.",
        "Gym: Angels & devils"),
      h("Prone Y/T + Decompression", "3×10–12 / 2–3 min",
        "Y/T on bed. Prone with pillow.",
        "Gym: Prone I/Y/T"),
      h("Band Pull-Apart + KN PU Plus", "3×15–20 / 3×12–15",
        "Band horizontal. Hands-and-knees protraction.",
        "Gym: Wall slides + PU plus")
    ],
    [
      h("Bird Dog", "5→3→1/side", "Same."),
      h("Plank Shoulder Taps", "3×8–10/side",
        "Forearm plank. No rotation.",
        "Gym: Pallof press"),
      h("Prone Bed Decompression", "3–5 min",
        "Gentle traction breathing.",
        "Gym: Dead hang")
    ]
  ]
];

// Export as global
window.PPL_DATA = { G_A, G_B, H_A, H_B, DAY_META };
