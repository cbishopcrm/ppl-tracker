// ============================================================
// Theme definitions — each theme is a set of CSS variable overrides
// Applied at runtime via document.documentElement.style.setProperty()
// ============================================================

export interface ThemeDef {
  id: string;
  name: string;
  group: 'Original' | 'Video Games' | 'World of Warcraft';
  preview: [string, string, string]; // [bg, surface, accent] for swatch
  vars: Record<string, string>;
}

// Base dark vars (also the fallback in app.css)
const DARK_BASE: Record<string, string> = {
  '--bg': '#000000',
  '--bg-2': '#0b0b0d',
  '--surface': '#1d1d1f',
  '--surface-2': '#2a2a2d',
  '--surface-3': '#3a3a3d',
  '--line': 'rgba(255,255,255,0.08)',
  '--line-2': 'rgba(255,255,255,0.14)',
  '--ink': '#f5f5f7',
  '--ink-2': '#a1a1a6',
  '--ink-3': '#86868b',
  '--ink-4': '#6e6e73',
  '--accent': '#0071e3',
  '--accent-2': '#147ce5',
  '--accent-hover': '#0077ed',
  '--accent-soft': 'rgba(0,113,227,0.14)',
  '--accent-line': 'rgba(0,113,227,0.35)',
  '--grad': 'linear-gradient(135deg, #0071e3 0%, #6e45e2 50%, #c963d8 100%)',
  '--ok': '#30d158',
  '--ok-soft': 'rgba(48,209,88,0.14)',
  '--warn': '#ff453a',
  '--warn-soft': 'rgba(255,69,58,0.14)',
  '--info': '#64d2ff',
  '--info-soft': 'rgba(100,210,255,0.14)',
  '--pr': '#ffd60a',
  '--pr-soft': 'rgba(255,214,10,0.14)',
};

/** Helper: create a dark theme by overriding select vars from the base */
function dark(
  id: string,
  name: string,
  group: ThemeDef['group'],
  preview: [string, string, string],
  overrides: Record<string, string>
): ThemeDef {
  return { id, name, group, preview, vars: { ...DARK_BASE, ...overrides } };
}

/** Helper: create a light theme */
function light(
  id: string,
  name: string,
  group: ThemeDef['group'],
  preview: [string, string, string],
  overrides: Record<string, string>
): ThemeDef {
  const LIGHT_BASE: Record<string, string> = {
    '--bg': '#f5f5f7',
    '--bg-2': '#eaeaec',
    '--surface': '#ffffff',
    '--surface-2': '#f0f0f2',
    '--surface-3': '#e4e4e6',
    '--line': 'rgba(0,0,0,0.08)',
    '--line-2': 'rgba(0,0,0,0.14)',
    '--ink': '#1d1d1f',
    '--ink-2': '#4a4a4e',
    '--ink-3': '#6e6e73',
    '--ink-4': '#a1a1a6',
    '--accent': '#0071e3',
    '--accent-2': '#0060c0',
    '--accent-hover': '#0077ed',
    '--accent-soft': 'rgba(0,113,227,0.10)',
    '--accent-line': 'rgba(0,113,227,0.30)',
    '--grad': 'linear-gradient(135deg, #0071e3 0%, #6e45e2 50%, #c963d8 100%)',
    '--ok': '#28a745',
    '--ok-soft': 'rgba(40,167,69,0.10)',
    '--warn': '#dc3545',
    '--warn-soft': 'rgba(220,53,69,0.10)',
    '--info': '#0077b6',
    '--info-soft': 'rgba(0,119,182,0.10)',
    '--pr': '#b8860b',
    '--pr-soft': 'rgba(184,134,11,0.12)',
  };
  return { id, name, group, preview, vars: { ...LIGHT_BASE, ...overrides } };
}

// ============================================================
// ORIGINAL THEMES
// ============================================================

export const THEMES: ThemeDef[] = [
  // --- Midnight (default — current Apple dark) ---
  dark('midnight', 'Midnight', 'Original', ['#000000', '#1d1d1f', '#0071e3'], {}),

  // --- Snow (clean light) ---
  light('snow', 'Snow', 'Original', ['#f5f5f7', '#ffffff', '#0071e3'], {}),

  // --- Slate (cool gray dark) ---
  dark('slate', 'Slate', 'Original', ['#0f1114', '#1c1f24', '#8b9bb4'], {
    '--bg': '#0f1114',
    '--bg-2': '#15181d',
    '--surface': '#1c1f24',
    '--surface-2': '#272b33',
    '--surface-3': '#343942',
    '--accent': '#8b9bb4',
    '--accent-2': '#9dadc5',
    '--accent-hover': '#a0b0cc',
    '--accent-soft': 'rgba(139,155,180,0.12)',
    '--accent-line': 'rgba(139,155,180,0.30)',
    '--grad': 'linear-gradient(135deg, #8b9bb4 0%, #6b7b94 50%, #556b8a 100%)',
  }),

  // --- Ember (deep red/orange) ---
  dark('ember', 'Ember', 'Original', ['#0d0806', '#1f1410', '#e8622c'], {
    '--bg': '#0d0806',
    '--bg-2': '#14100c',
    '--surface': '#1f1410',
    '--surface-2': '#2e1f18',
    '--surface-3': '#3f2a20',
    '--accent': '#e8622c',
    '--accent-2': '#f0783f',
    '--accent-hover': '#f07838',
    '--accent-soft': 'rgba(232,98,44,0.14)',
    '--accent-line': 'rgba(232,98,44,0.35)',
    '--grad': 'linear-gradient(135deg, #e8622c 0%, #d44020 50%, #ff8c42 100%)',
    '--pr': '#ffb347',
    '--pr-soft': 'rgba(255,179,71,0.14)',
  }),

  // --- Ocean (deep navy/teal) ---
  dark('ocean', 'Ocean', 'Original', ['#050a12', '#0d1a2a', '#14b8a6'], {
    '--bg': '#050a12',
    '--bg-2': '#0a1018',
    '--surface': '#0d1a2a',
    '--surface-2': '#152640',
    '--surface-3': '#1e3350',
    '--ink-2': '#8bafc4',
    '--ink-3': '#5d8aa8',
    '--accent': '#14b8a6',
    '--accent-2': '#2dd4bf',
    '--accent-hover': '#20c4b0',
    '--accent-soft': 'rgba(20,184,166,0.14)',
    '--accent-line': 'rgba(20,184,166,0.35)',
    '--grad': 'linear-gradient(135deg, #14b8a6 0%, #0891b2 50%, #06b6d4 100%)',
    '--info': '#38bdf8',
    '--info-soft': 'rgba(56,189,248,0.12)',
  }),

  // --- Forest (dark green/earth) ---
  dark('forest', 'Forest', 'Original', ['#070c06', '#141e12', '#4ade80'], {
    '--bg': '#070c06',
    '--bg-2': '#0c1309',
    '--surface': '#141e12',
    '--surface-2': '#1e2e1a',
    '--surface-3': '#2a3d24',
    '--ink-2': '#9ab893',
    '--ink-3': '#6f9068',
    '--accent': '#4ade80',
    '--accent-2': '#6ee7a0',
    '--accent-hover': '#5ae090',
    '--accent-soft': 'rgba(74,222,128,0.12)',
    '--accent-line': 'rgba(74,222,128,0.30)',
    '--grad': 'linear-gradient(135deg, #4ade80 0%, #16a34a 50%, #a3e635 100%)',
    '--ok': '#86efac',
    '--ok-soft': 'rgba(134,239,172,0.12)',
  }),

  // --- Lavender (soft purple light) ---
  light('lavender', 'Lavender', 'Original', ['#f3f0f8', '#ffffff', '#8b5cf6'], {
    '--bg': '#f3f0f8',
    '--bg-2': '#e8e3f0',
    '--surface': '#ffffff',
    '--surface-2': '#f0ecf6',
    '--surface-3': '#e0dae8',
    '--accent': '#8b5cf6',
    '--accent-2': '#7c3aed',
    '--accent-hover': '#9b6df7',
    '--accent-soft': 'rgba(139,92,246,0.10)',
    '--accent-line': 'rgba(139,92,246,0.28)',
    '--grad': 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #d946ef 100%)',
  }),

  // --- Mono (pure B&W) ---
  dark('mono', 'Mono', 'Original', ['#000000', '#111111', '#ffffff'], {
    '--bg': '#000000',
    '--bg-2': '#080808',
    '--surface': '#111111',
    '--surface-2': '#1c1c1c',
    '--surface-3': '#282828',
    '--accent': '#ffffff',
    '--accent-2': '#e0e0e0',
    '--accent-hover': '#ffffff',
    '--accent-soft': 'rgba(255,255,255,0.08)',
    '--accent-line': 'rgba(255,255,255,0.20)',
    '--grad': 'linear-gradient(135deg, #ffffff 0%, #b0b0b0 50%, #808080 100%)',
    '--ok': '#a0a0a0',
    '--ok-soft': 'rgba(160,160,160,0.10)',
    '--warn': '#d4d4d4',
    '--warn-soft': 'rgba(212,212,212,0.10)',
    '--info': '#c0c0c0',
    '--info-soft': 'rgba(192,192,192,0.10)',
    '--pr': '#e0e0e0',
    '--pr-soft': 'rgba(224,224,224,0.10)',
  }),

  // ============================================================
  // VIDEO GAME THEMES
  // ============================================================

  // --- The Last of Us: muted olive/brown, spore green accent ---
  dark('last-of-us', 'The Last of Us', 'Video Games', ['#0c0e08', '#1a1e14', '#7b9e4e'], {
    '--bg': '#0c0e08',
    '--bg-2': '#12150d',
    '--surface': '#1a1e14',
    '--surface-2': '#252b1e',
    '--surface-3': '#333a2a',
    '--ink': '#d4cdb8',
    '--ink-2': '#a09880',
    '--ink-3': '#7a7260',
    '--ink-4': '#5c5548',
    '--accent': '#7b9e4e',
    '--accent-2': '#92b862',
    '--accent-hover': '#88aa58',
    '--accent-soft': 'rgba(123,158,78,0.14)',
    '--accent-line': 'rgba(123,158,78,0.35)',
    '--grad': 'linear-gradient(135deg, #7b9e4e 0%, #5a7a30 50%, #8faa5e 100%)',
    '--ok': '#6b8a40',
    '--ok-soft': 'rgba(107,138,64,0.14)',
    '--warn': '#c45c3a',
    '--warn-soft': 'rgba(196,92,58,0.14)',
    '--info': '#8aaa6e',
    '--info-soft': 'rgba(138,170,110,0.12)',
    '--pr': '#d4a84e',
    '--pr-soft': 'rgba(212,168,78,0.14)',
  }),

  // --- Dragon Age: Inquisition: crimson/gold heraldry ---
  dark('dai', 'Dragon Age: Inquisition', 'Video Games', ['#0a0608', '#1e1018', '#c4a23a'], {
    '--bg': '#0a0608',
    '--bg-2': '#10090e',
    '--surface': '#1e1018',
    '--surface-2': '#2e1a28',
    '--surface-3': '#3e2438',
    '--ink': '#f0e6d8',
    '--ink-2': '#b8a890',
    '--ink-3': '#8a7a68',
    '--ink-4': '#5e5048',
    '--accent': '#c4a23a',
    '--accent-2': '#d4b24a',
    '--accent-hover': '#d0aa42',
    '--accent-soft': 'rgba(196,162,58,0.14)',
    '--accent-line': 'rgba(196,162,58,0.35)',
    '--grad': 'linear-gradient(135deg, #c4a23a 0%, #8b1a1a 50%, #d4b24a 100%)',
    '--ok': '#7a9a4a',
    '--ok-soft': 'rgba(122,154,74,0.14)',
    '--warn': '#c03030',
    '--warn-soft': 'rgba(192,48,48,0.14)',
    '--info': '#8a7a5a',
    '--info-soft': 'rgba(138,122,90,0.12)',
    '--pr': '#e8c84a',
    '--pr-soft': 'rgba(232,200,74,0.14)',
  }),

  // --- Dragon Age: The Veilguard: purple/teal magical glow ---
  dark('dav', 'Dragon Age: Veilguard', 'Video Games', ['#08060e', '#14102a', '#7b5cd4'], {
    '--bg': '#08060e',
    '--bg-2': '#0d0a16',
    '--surface': '#14102a',
    '--surface-2': '#201a40',
    '--surface-3': '#2c2458',
    '--ink': '#e4ddf0',
    '--ink-2': '#a89ec0',
    '--ink-3': '#7a72a0',
    '--ink-4': '#5a5478',
    '--accent': '#7b5cd4',
    '--accent-2': '#9474e8',
    '--accent-hover': '#8a6ae0',
    '--accent-soft': 'rgba(123,92,212,0.14)',
    '--accent-line': 'rgba(123,92,212,0.35)',
    '--grad': 'linear-gradient(135deg, #7b5cd4 0%, #2dd4bf 50%, #a855f7 100%)',
    '--ok': '#2dd4bf',
    '--ok-soft': 'rgba(45,212,191,0.14)',
    '--warn': '#e04080',
    '--warn-soft': 'rgba(224,64,128,0.14)',
    '--info': '#4ed4e0',
    '--info-soft': 'rgba(78,212,224,0.12)',
    '--pr': '#c8a0f0',
    '--pr-soft': 'rgba(200,160,240,0.14)',
  }),

  // --- Fortnite: saturated purple/blue, bright yellow storm ---
  dark('fortnite', 'Fortnite', 'Video Games', ['#0a0820', '#1a1440', '#f0d020'], {
    '--bg': '#0a0820',
    '--bg-2': '#100e30',
    '--surface': '#1a1440',
    '--surface-2': '#261e5a',
    '--surface-3': '#342878',
    '--ink': '#f0ecff',
    '--ink-2': '#b8b0d8',
    '--ink-3': '#8a82b0',
    '--ink-4': '#6a6290',
    '--accent': '#f0d020',
    '--accent-2': '#f8e040',
    '--accent-hover': '#f4d830',
    '--accent-soft': 'rgba(240,208,32,0.14)',
    '--accent-line': 'rgba(240,208,32,0.35)',
    '--grad': 'linear-gradient(135deg, #f0d020 0%, #4040ff 50%, #a020f0 100%)',
    '--ok': '#40e080',
    '--ok-soft': 'rgba(64,224,128,0.14)',
    '--warn': '#ff4060',
    '--warn-soft': 'rgba(255,64,96,0.14)',
    '--info': '#40a0ff',
    '--info-soft': 'rgba(64,160,255,0.12)',
    '--pr': '#ffd700',
    '--pr-soft': 'rgba(255,215,0,0.14)',
  }),

  // ============================================================
  // WORLD OF WARCRAFT CLASS THEMES
  // ============================================================

  // --- Death Knight: icy blue on near-black ---
  dark('wow-dk', 'Death Knight', 'World of Warcraft', ['#060810', '#101420', '#c41e3a'], {
    '--bg': '#060810',
    '--bg-2': '#0a0e18',
    '--surface': '#101420',
    '--surface-2': '#1a2030',
    '--surface-3': '#242e44',
    '--ink': '#d8e0f0',
    '--ink-2': '#8a9ab8',
    '--ink-3': '#5a6a88',
    '--accent': '#c41e3a',
    '--accent-2': '#dc3050',
    '--accent-hover': '#d42844',
    '--accent-soft': 'rgba(196,30,58,0.14)',
    '--accent-line': 'rgba(196,30,58,0.35)',
    '--grad': 'linear-gradient(135deg, #c41e3a 0%, #6090d0 50%, #88c0f0 100%)',
    '--info': '#6090d0',
    '--info-soft': 'rgba(96,144,208,0.12)',
  }),

  // --- Demon Hunter: fel green / dark purple ---
  dark('wow-dh', 'Demon Hunter', 'World of Warcraft', ['#0a060e', '#18102a', '#a330c9'], {
    '--bg': '#0a060e',
    '--bg-2': '#100a16',
    '--surface': '#18102a',
    '--surface-2': '#24183e',
    '--surface-3': '#302050',
    '--ink': '#e0d8f0',
    '--ink-2': '#a898c0',
    '--ink-3': '#786890',
    '--accent': '#a330c9',
    '--accent-2': '#b848d8',
    '--accent-hover': '#aa38d0',
    '--accent-soft': 'rgba(163,48,201,0.14)',
    '--accent-line': 'rgba(163,48,201,0.35)',
    '--grad': 'linear-gradient(135deg, #a330c9 0%, #40ff40 50%, #c040e0 100%)',
    '--ok': '#40ff40',
    '--ok-soft': 'rgba(64,255,64,0.12)',
  }),

  // --- Druid: nature orange on forest dark ---
  dark('wow-druid', 'Druid', 'World of Warcraft', ['#080a06', '#141e10', '#ff7c0a'], {
    '--bg': '#080a06',
    '--bg-2': '#0e1209',
    '--surface': '#141e10',
    '--surface-2': '#1e2e1a',
    '--surface-3': '#2a3d24',
    '--ink': '#e8e0d0',
    '--ink-2': '#a8a090',
    '--ink-3': '#787060',
    '--accent': '#ff7c0a',
    '--accent-2': '#ff9030',
    '--accent-hover': '#ff8818',
    '--accent-soft': 'rgba(255,124,10,0.14)',
    '--accent-line': 'rgba(255,124,10,0.35)',
    '--grad': 'linear-gradient(135deg, #ff7c0a 0%, #40a020 50%, #ff9840 100%)',
  }),

  // --- Hunter: sage green on earthy brown ---
  dark('wow-hunter', 'Hunter', 'World of Warcraft', ['#0a0806', '#1a1610', '#aad372'], {
    '--bg': '#0a0806',
    '--bg-2': '#10100a',
    '--surface': '#1a1610',
    '--surface-2': '#28221a',
    '--surface-3': '#362e22',
    '--ink': '#e8e0d0',
    '--ink-2': '#a89880',
    '--ink-3': '#787060',
    '--accent': '#aad372',
    '--accent-2': '#bbde88',
    '--accent-hover': '#b2d87a',
    '--accent-soft': 'rgba(170,211,114,0.14)',
    '--accent-line': 'rgba(170,211,114,0.35)',
    '--grad': 'linear-gradient(135deg, #aad372 0%, #668a40 50%, #bbde88 100%)',
  }),

  // --- Mage: arcane blue/purple ---
  dark('wow-mage', 'Mage', 'World of Warcraft', ['#060812', '#101830', '#3fc7eb'], {
    '--bg': '#060812',
    '--bg-2': '#0a1020',
    '--surface': '#101830',
    '--surface-2': '#1a2448',
    '--surface-3': '#243060',
    '--ink': '#dce8f8',
    '--ink-2': '#90a8d0',
    '--ink-3': '#607898',
    '--accent': '#3fc7eb',
    '--accent-2': '#60d4f0',
    '--accent-hover': '#50cce8',
    '--accent-soft': 'rgba(63,199,235,0.14)',
    '--accent-line': 'rgba(63,199,235,0.35)',
    '--grad': 'linear-gradient(135deg, #3fc7eb 0%, #6050d8 50%, #a040f0 100%)',
  }),

  // --- Monk: jade green on dark teal ---
  dark('wow-monk', 'Monk', 'World of Warcraft', ['#060a0a', '#0e1a18', '#00ff98'], {
    '--bg': '#060a0a',
    '--bg-2': '#0a1210',
    '--surface': '#0e1a18',
    '--surface-2': '#182824',
    '--surface-3': '#223630',
    '--ink': '#d8f0e8',
    '--ink-2': '#88b8a8',
    '--ink-3': '#5a8878',
    '--accent': '#00ff98',
    '--accent-2': '#40ffa8',
    '--accent-hover': '#20ffa0',
    '--accent-soft': 'rgba(0,255,152,0.12)',
    '--accent-line': 'rgba(0,255,152,0.30)',
    '--grad': 'linear-gradient(135deg, #00ff98 0%, #008860 50%, #40ffc0 100%)',
  }),

  // --- Paladin: holy gold on deep blue ---
  dark('wow-paladin', 'Paladin', 'World of Warcraft', ['#080810', '#101428', '#f48cba'], {
    '--bg': '#080810',
    '--bg-2': '#0c0e18',
    '--surface': '#101428',
    '--surface-2': '#1a2040',
    '--surface-3': '#242c58',
    '--ink': '#f0e8f0',
    '--ink-2': '#b0a0b8',
    '--ink-3': '#807088',
    '--accent': '#f48cba',
    '--accent-2': '#f8a0c8',
    '--accent-hover': '#f698c0',
    '--accent-soft': 'rgba(244,140,186,0.14)',
    '--accent-line': 'rgba(244,140,186,0.35)',
    '--grad': 'linear-gradient(135deg, #f48cba 0%, #ffd700 50%, #f8b0c8 100%)',
    '--pr': '#ffd700',
    '--pr-soft': 'rgba(255,215,0,0.14)',
  }),

  // --- Priest (Shadow): deep purple/void ---
  dark('wow-priest', 'Priest', 'World of Warcraft', ['#08060e', '#141020', '#ffffff'], {
    '--bg': '#08060e',
    '--bg-2': '#0e0a16',
    '--surface': '#141020',
    '--surface-2': '#201838',
    '--surface-3': '#2c204e',
    '--ink': '#e8e0f8',
    '--ink-2': '#a898c8',
    '--ink-3': '#786898',
    '--accent': '#ffffff',
    '--accent-2': '#d8d0f0',
    '--accent-hover': '#e8e0ff',
    '--accent-soft': 'rgba(255,255,255,0.08)',
    '--accent-line': 'rgba(255,255,255,0.20)',
    '--grad': 'linear-gradient(135deg, #ffffff 0%, #8040c0 50%, #4020a0 100%)',
  }),

  // --- Rogue: dark yellow on near-black ---
  dark('wow-rogue', 'Rogue', 'World of Warcraft', ['#0a0a06', '#181810', '#fff468'], {
    '--bg': '#0a0a06',
    '--bg-2': '#10100a',
    '--surface': '#181810',
    '--surface-2': '#24241a',
    '--surface-3': '#303024',
    '--ink': '#f0f0e0',
    '--ink-2': '#b0b098',
    '--ink-3': '#808070',
    '--accent': '#fff468',
    '--accent-2': '#fff888',
    '--accent-hover': '#fff678',
    '--accent-soft': 'rgba(255,244,104,0.12)',
    '--accent-line': 'rgba(255,244,104,0.30)',
    '--grad': 'linear-gradient(135deg, #fff468 0%, #c0a020 50%, #e0c840 100%)',
  }),

  // --- Shaman: deep blue on stormy gray ---
  dark('wow-shaman', 'Shaman', 'World of Warcraft', ['#06080e', '#101828', '#0070dd'], {
    '--bg': '#06080e',
    '--bg-2': '#0a1018',
    '--surface': '#101828',
    '--surface-2': '#182438',
    '--surface-3': '#22304a',
    '--ink': '#d8e4f4',
    '--ink-2': '#8898b8',
    '--ink-3': '#586888',
    '--accent': '#0070dd',
    '--accent-2': '#2088e8',
    '--accent-hover': '#1080e0',
    '--accent-soft': 'rgba(0,112,221,0.14)',
    '--accent-line': 'rgba(0,112,221,0.35)',
    '--grad': 'linear-gradient(135deg, #0070dd 0%, #4040ff 50%, #00aaff 100%)',
  }),

  // --- Warlock: fel green / shadow purple ---
  dark('wow-warlock', 'Warlock', 'World of Warcraft', ['#0a060a', '#18101a', '#8788ee'], {
    '--bg': '#0a060a',
    '--bg-2': '#100a10',
    '--surface': '#18101a',
    '--surface-2': '#241828',
    '--surface-3': '#302036',
    '--ink': '#e0d8e8',
    '--ink-2': '#a098b0',
    '--ink-3': '#706878',
    '--accent': '#8788ee',
    '--accent-2': '#9898f4',
    '--accent-hover': '#9090f0',
    '--accent-soft': 'rgba(135,136,238,0.14)',
    '--accent-line': 'rgba(135,136,238,0.35)',
    '--grad': 'linear-gradient(135deg, #8788ee 0%, #40c040 50%, #a060ff 100%)',
    '--ok': '#40c040',
    '--ok-soft': 'rgba(64,192,64,0.12)',
  }),

  // --- Warrior: brown/tan on dark iron ---
  dark('wow-warrior', 'Warrior', 'World of Warcraft', ['#0a0806', '#18140e', '#c69b6d'], {
    '--bg': '#0a0806',
    '--bg-2': '#100e08',
    '--surface': '#18140e',
    '--surface-2': '#24201a',
    '--surface-3': '#322c24',
    '--ink': '#f0e8d8',
    '--ink-2': '#b0a890',
    '--ink-3': '#808068',
    '--accent': '#c69b6d',
    '--accent-2': '#d4aa7e',
    '--accent-hover': '#cca278',
    '--accent-soft': 'rgba(198,155,109,0.14)',
    '--accent-line': 'rgba(198,155,109,0.35)',
    '--grad': 'linear-gradient(135deg, #c69b6d 0%, #8a6840 50%, #d4b088 100%)',
  }),

  // --- Evoker: teal/bronze ---
  dark('wow-evoker', 'Evoker', 'World of Warcraft', ['#060a0a', '#0e1818', '#33937f'], {
    '--bg': '#060a0a',
    '--bg-2': '#0a1210',
    '--surface': '#0e1818',
    '--surface-2': '#182828',
    '--surface-3': '#223838',
    '--ink': '#d8f0e8',
    '--ink-2': '#88b8a8',
    '--ink-3': '#5a8878',
    '--accent': '#33937f',
    '--accent-2': '#48a892',
    '--accent-hover': '#3e9e88',
    '--accent-soft': 'rgba(51,147,127,0.14)',
    '--accent-line': 'rgba(51,147,127,0.35)',
    '--grad': 'linear-gradient(135deg, #33937f 0%, #c8a040 50%, #48a892 100%)',
    '--pr': '#c8a040',
    '--pr-soft': 'rgba(200,160,64,0.14)',
  }),
];

export const THEME_MAP = new Map(THEMES.map((t) => [t.id, t]));
export const DEFAULT_THEME = 'midnight';

export function getTheme(id: string): ThemeDef {
  return THEME_MAP.get(id) ?? THEME_MAP.get(DEFAULT_THEME)!;
}

export function applyTheme(id: string) {
  const theme = getTheme(id);
  const root = document.documentElement;
  for (const [prop, value] of Object.entries(theme.vars)) {
    root.style.setProperty(prop, value);
  }
}

export const THEME_GROUPS = ['Original', 'Video Games', 'World of Warcraft'] as const;
