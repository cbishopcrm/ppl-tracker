// ============================================================
// PPL Tracker — App Logic
// ============================================================

(() => {
  const { G_A, G_B, H_A, H_B, DAY_META } = window.PPL_DATA;

  // ---------- Storage ----------
  const STORAGE_KEY = 'ppl:v1';
  const defaultState = {
    settings: { loc: 'gym', week: 'a', rest: 90, unit: 'lb' },
    selections: {},      // key -> alt index chosen
    logs: [],            // completed sessions
    active: null         // in-progress session
  };
  let S = load();

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredClone(defaultState);
      return { ...structuredClone(defaultState), ...JSON.parse(raw) };
    } catch (e) {
      console.warn('load failed', e);
      return structuredClone(defaultState);
    }
  }
  const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(S));

  // ---------- State ----------
  const today = new Date().getDay();
  // Mon=Pull(0) Tue=Push(1) Thu=Legs(2) Fri=Core(3) — else default Pull
  let DAY = (today === 1 ? 0 : today === 2 ? 1 : today === 4 ? 2 : today === 5 ? 3 : 0);
  const openAlts = {};  // which alt panels are open
  const openSets = {};  // which exercise set panels are open

  // ---------- Timer ----------
  const timer = {
    endAt: 0, total: 0, tickId: 0, urgent: false,
    el: document.getElementById('timer'),
    text: document.getElementById('timerText'),
    circle: document.getElementById('timerCircle'),
    start(sec) {
      this.total = sec;
      this.endAt = Date.now() + sec * 1000;
      this.el.classList.add('on');
      this.el.classList.remove('urgent');
      this.urgent = false;
      this.tick();
      clearInterval(this.tickId);
      this.tickId = setInterval(() => this.tick(), 250);
    },
    tick() {
      const left = Math.max(0, Math.ceil((this.endAt - Date.now()) / 1000));
      const m = Math.floor(left / 60), s = left % 60;
      this.text.textContent = `${m}:${String(s).padStart(2, '0')}`;
      const pct = left / this.total;
      this.circle.style.strokeDashoffset = String(283 * (1 - pct));
      if (left <= 5 && !this.urgent) {
        this.urgent = true;
        this.el.classList.add('urgent');
      }
      if (left === 0) {
        this.stop();
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        toast('Rest complete');
      }
    },
    adjust(d) { this.endAt += d * 1000; this.total += d; this.tick(); },
    stop() { clearInterval(this.tickId); this.el.classList.remove('on'); }
  };
  document.getElementById('timerSkip').onclick = () => timer.stop();
  document.getElementById('timerMinus').onclick = () => timer.adjust(-15);
  document.getElementById('timerPlus').onclick = () => timer.adjust(15);

  // ---------- Toast ----------
  let toastT = 0;
  function toast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(() => el.classList.remove('show'), 2000);
  }

  // ---------- Helpers ----------
  const getData = () => {
    const { loc, week } = S.settings;
    return loc === 'gym' ? (week === 'a' ? G_A : G_B) : (week === 'a' ? H_A : H_B);
  };
  const selKey = (di, ei) => `${S.settings.loc}_${S.settings.week}_${di}_${ei}`;
  const getSel = (di, ei) => S.selections[selKey(di, ei)] || 0;
  const getEx = (di, ei) => getData()[di][ei][getSel(di, ei)];

  // ---------- Session (active workout) ----------
  function startSession() {
    if (S.active) return;
    S.active = {
      id: Date.now(),
      day: DAY,
      loc: S.settings.loc,
      week: S.settings.week,
      start: Date.now(),
      exercises: {}, // key -> { name, sets: [{w,r,done,pr}] }
    };
    save();
    render();
    toast('Session started');
  }

  function endSession() {
    if (!S.active) return;
    const exCount = Object.values(S.active.exercises).filter(e => (e.sets || []).some(s => s.done)).length;
    if (exCount === 0) {
      if (!confirm('No sets logged. Discard session?')) return;
      S.active = null; save(); render();
      toast('Session discarded');
      return;
    }
    const finished = {
      ...S.active,
      end: Date.now(),
      duration: Date.now() - S.active.start,
    };
    S.logs.unshift(finished);
    S.active = null;
    save();
    render();
    toast(`Session saved · ${exCount} exercises`);
  }

  // Get last logged sets for an exercise name
  function prevSets(name) {
    for (const log of S.logs) {
      for (const k in log.exercises) {
        const ex = log.exercises[k];
        if (ex.name === name && (ex.sets || []).some(s => s.done)) {
          return ex.sets.filter(s => s.done);
        }
      }
    }
    return null;
  }

  function exKey(di, ei) {
    const ex = getEx(di, ei);
    return `${di}_${ei}_${ex.n}`;
  }

  function getActiveEx(di, ei) {
    if (!S.active) return null;
    const key = exKey(di, ei);
    if (!S.active.exercises[key]) {
      S.active.exercises[key] = {
        name: getEx(di, ei).n,
        rx: getEx(di, ei).r,
        sets: [{ w: '', r: '', done: false }, { w: '', r: '', done: false }, { w: '', r: '', done: false }]
      };
    }
    return S.active.exercises[key];
  }

  // ---------- Set actions ----------
  window.addSet = (di, ei) => {
    const ex = getActiveEx(di, ei);
    ex.sets.push({ w: '', r: '', done: false });
    save(); render();
  };
  window.delSet = (di, ei, si) => {
    const ex = getActiveEx(di, ei);
    if (ex.sets.length > 1) ex.sets.splice(si, 1);
    save(); render();
  };
  window.updateSet = (di, ei, si, field, val) => {
    const ex = getActiveEx(di, ei);
    ex.sets[si][field] = val;
    save();
    // no re-render during typing
  };
  window.toggleSetDone = (di, ei, si) => {
    const ex = getActiveEx(di, ei);
    const set = ex.sets[si];
    set.done = !set.done;
    // Detect PR
    if (set.done && set.w && set.r) {
      const vol = Number(set.w) * Number(set.r);
      const prev = prevSets(ex.name);
      const prevBest = prev ? Math.max(...prev.map(s => (Number(s.w) || 0) * (Number(s.r) || 0))) : 0;
      if (vol > prevBest && prevBest > 0) {
        set.pr = true;
        toast('🏆 New PR!');
      }
    }
    save();
    if (set.done) timer.start(S.settings.rest);
    render();
  };

  window.toggleSets = (di, ei) => {
    const k = `${di}_${ei}`;
    openSets[k] = !openSets[k];
    render();
  };

  // ---------- Alt selection ----------
  window.pickAlt = (di, ei, oi) => {
    S.selections[selKey(di, ei)] = oi;
    delete openAlts[`${di}_${ei}`];
    save(); render();
  };
  window.toggleAlt = (di, ei) => {
    const k = `${di}_${ei}`;
    openAlts[k] = !openAlts[k];
    render();
  };

  // ---------- Icons ----------
  const ICO = {
    swap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>',
    spine: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    hotel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/><path d="M9 22v-4h6v4"/></svg>',
    ss: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>'
  };

  // ---------- Stats ----------
  function computeStats() {
    // Streak: count consecutive days with a logged workout (ending today or yesterday)
    const dayMs = 86400000;
    const byDate = new Set(S.logs.map(l => new Date(l.start).toDateString()));
    let streak = 0;
    let cur = new Date();
    if (!byDate.has(cur.toDateString())) cur = new Date(Date.now() - dayMs);
    while (byDate.has(cur.toDateString())) {
      streak++;
      cur = new Date(cur.getTime() - dayMs);
    }
    // Volume this week
    const weekStart = Date.now() - 7 * dayMs;
    let vol = 0, sets = 0;
    for (const log of S.logs) {
      if (log.start < weekStart) continue;
      for (const k in log.exercises) {
        for (const s of (log.exercises[k].sets || [])) {
          if (s.done && s.w && s.r) {
            vol += Number(s.w) * Number(s.r);
            sets++;
          }
        }
      }
    }
    return { streak, vol: Math.round(vol), sets };
  }

  // ---------- Render ----------
  function render() {
    const data = getData();
    const v = S.settings.week === 'a' ? '1' : '2';
    const loc = S.settings.loc;

    document.getElementById('hdrSub').textContent =
      `Week ${S.settings.week.toUpperCase()} · ${loc === 'gym' ? 'Gym' : 'Hotel'}${S.active ? ' · Live' : ''}`;

    // Stats strip
    const st = computeStats();
    document.getElementById('stats').innerHTML = `
      <div class="stat streak"><div class="stat-label">Streak</div><div class="stat-value">${st.streak}<span class="stat-unit">days</span></div></div>
      <div class="stat volume"><div class="stat-label">Week Vol</div><div class="stat-value">${formatVol(st.vol)}<span class="stat-unit">${S.settings.unit}</span></div></div>
      <div class="stat sets"><div class="stat-label">Week Sets</div><div class="stat-value">${st.sets}</div></div>
    `;

    // Bottom nav
    document.getElementById('bnav').innerHTML = DAY_META.map((m, i) =>
      `<button class="${i === DAY ? 'on' : ''}" onclick="window._setDay(${i})">
        <span class="bn-icon">${m.icon}</span>
        <span class="bn-label">${m.label} ${v}</span>
      </button>`
    ).join('');

    // Main content
    const day = data[DAY];
    const meta = DAY_META[DAY];
    const main = document.getElementById('main');

    let html = `
      <div class="day-meta">
        <div class="dm-left">
          <div class="day-tag">${meta.day} · Day ${DAY + 1}</div>
          <div class="day-title">${meta.label} ${v}</div>
          <div class="day-focus">${loc === 'hotel' ? 'DBs + bands only' : 'Full equipment'}</div>
        </div>
        <button class="session-btn ${S.active ? 'end' : ''}" onclick="window._session()">
          ${S.active ? 'End Session' : 'Start Session'}
        </button>
      </div>
    `;

    day.forEach((opts, ei) => {
      const sel = getSel(DAY, ei);
      const ex = opts[sel];
      const isSS = ex.n.includes('→');
      const hasSpine = !!ex.s;
      const isHotel = loc === 'hotel';
      const hasGym = !!ex.g;
      const setsKey = `${DAY}_${ei}`;
      const altsKey = `${DAY}_${ei}`;
      const setsOpen = openSets[setsKey] || !!S.active;
      const altsOpen = !!openAlts[altsKey];

      const activeEx = S.active ? getActiveEx(DAY, ei) : null;
      const allDone = activeEx ? activeEx.sets.length > 0 && activeEx.sets.every(s => s.done) : false;
      const isActive = activeEx ? activeEx.sets.some(s => s.done) && !allDone : false;

      html += `
        <div class="ex ${allDone ? 'done' : ''} ${isActive ? 'active' : ''}">
          <div class="ex-main" onclick="window._toggleSets(${DAY},${ei},event)">
            <div class="ex-top">
              <span class="ex-num ${isSS ? 'ss' : ''}">${isSS ? ICO.ss : (ei + 1)}</span>
              <div class="ex-tags">
                ${isSS ? `<span class="tag tag-ss">${ICO.ss}Superset</span>` : ''}
                ${hasSpine ? `<span class="tag tag-spine">${ICO.spine}Spine-safe</span>` : ''}
                ${isHotel ? `<span class="tag tag-hotel">${ICO.hotel}Hotel</span>` : ''}
              </div>
              <button class="swap-btn" onclick="window.toggleAlt(${DAY},${ei});event.stopPropagation()" aria-label="Swap">${ICO.swap}</button>
            </div>
            <div class="ex-name">${ex.n}</div>
            <div class="ex-rx">${ex.r}</div>
            <div class="ex-note">${ex.t}</div>
            ${hasSpine ? `<div class="ex-spine">${ICO.spine}<span>${ex.s}</span></div>` : ''}
            ${hasGym ? `<div class="ex-gym-ref">← ${ex.g}</div>` : ''}
          </div>
          ${renderSets(DAY, ei, ex, setsOpen)}
          ${renderAlts(DAY, ei, opts, sel, altsOpen)}
        </div>
      `;
    });

    main.innerHTML = html;
  }

  function renderSets(di, ei, ex, open) {
    if (!open) return '';
    const prev = prevSets(ex.n);
    const prevStr = prev ? prev.map(s => `${s.w || '-'}×${s.r || '-'}`).join('  ') : '—';
    const activeEx = S.active ? getActiveEx(di, ei) : null;
    const sets = activeEx ? activeEx.sets : [{ w: '', r: '', done: false }, { w: '', r: '', done: false }, { w: '', r: '', done: false }];
    const readonly = !S.active;

    let h = `
      <div class="sets open">
        <div class="sets-hdr">
          <div>SET</div><div>${S.settings.unit.toUpperCase()}</div><div>REPS</div><div></div><div></div>
        </div>
    `;
    sets.forEach((s, si) => {
      const prevSet = prev && prev[si] ? prev[si] : null;
      const wPh = prevSet ? String(prevSet.w || '') : '';
      const rPh = prevSet ? String(prevSet.r || '') : '';
      h += `
        <div class="set-row ${s.done ? 'done' : ''} ${s.pr ? 'pr' : ''}">
          <div class="set-num">${si + 1}</div>
          <input class="set-input" type="number" inputmode="decimal" ${readonly ? 'disabled' : ''}
            value="${s.w || ''}" placeholder="${wPh}"
            oninput="window.updateSet(${di},${ei},${si},'w',this.value)">
          <input class="set-input" type="number" inputmode="numeric" ${readonly ? 'disabled' : ''}
            value="${s.r || ''}" placeholder="${rPh}"
            oninput="window.updateSet(${di},${ei},${si},'r',this.value)">
          <button class="set-check" ${readonly ? 'disabled' : ''} onclick="window.toggleSetDone(${di},${ei},${si})" aria-label="Complete set">${ICO.check}</button>
          <button class="set-del" ${readonly ? 'disabled' : ''} onclick="window.delSet(${di},${ei},${si})" aria-label="Delete set">${ICO.trash}</button>
        </div>
      `;
    });
    if (!readonly) {
      h += `<div class="sets-actions"><button class="sets-btn" onclick="window.addSet(${di},${ei})">+ Add set</button></div>`;
    }
    if (prev) h += `<div class="sets-prev">Last: ${prevStr}</div>`;
    h += '</div>';
    return h;
  }

  function renderAlts(di, ei, opts, sel, open) {
    if (!open) return '';
    let h = '<div class="alt-panel open"><div class="alt-title">Alternatives</div>';
    opts.forEach((alt, oi) => {
      h += `
        <div class="alt-opt ${oi === sel ? 'active' : ''}" onclick="window.pickAlt(${di},${ei},${oi})">
          <div class="ao-name">${'ABC'[oi]}. ${alt.n}</div>
          <div class="ao-rx">${alt.r}</div>
          ${alt.t ? `<div class="ao-note">${alt.t}</div>` : ''}
        </div>
      `;
    });
    h += '</div>';
    return h;
  }

  function formatVol(n) {
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return String(n);
  }

  // ---------- Window handlers ----------
  window._setDay = (i) => { DAY = i; render(); };
  window._toggleSets = (di, ei, e) => {
    if (e && (e.target.closest('.swap-btn') || e.target.closest('.ex-name'))) return;
    const k = `${di}_${ei}`;
    openSets[k] = !openSets[k];
    render();
  };
  window._session = () => S.active ? endSession() : startSession();

  // ---------- Modals ----------
  const openModal = id => document.getElementById(id).classList.add('open');
  const closeModal = id => document.getElementById(id).classList.remove('open');
  document.getElementById('btnSettings').onclick = () => openModal('modalSettings');
  document.getElementById('btnHistory').onclick = () => { renderHistory(); openModal('modalHistory'); };
  document.querySelectorAll('[data-close-modal]').forEach(b =>
    b.onclick = () => closeModal(b.dataset.closeModal)
  );
  document.querySelectorAll('.modal-bg').forEach(bg =>
    bg.addEventListener('click', e => { if (e.target === bg) closeModal(bg.id); })
  );

  // Settings toggles
  function bindSeg(id, attr, apply) {
    const el = document.getElementById(id);
    el.querySelectorAll('button').forEach(b => {
      b.onclick = () => {
        apply(b.dataset[attr]);
        save();
        syncSettingsUI();
        render();
      };
    });
  }
  bindSeg('locToggle', 'loc', v => { S.settings.loc = v; });
  bindSeg('weekToggle', 'week', v => { S.settings.week = v; });
  bindSeg('restToggle', 'rest', v => { S.settings.rest = Number(v); });
  bindSeg('unitToggle', 'unit', v => { S.settings.unit = v; });

  function syncSettingsUI() {
    const map = [['locToggle', 'loc'], ['weekToggle', 'week'], ['restToggle', 'rest'], ['unitToggle', 'unit']];
    map.forEach(([id, attr]) => {
      document.querySelectorAll(`#${id} button`).forEach(b => {
        b.classList.toggle('on', String(b.dataset[attr]) === String(S.settings[attr]));
      });
    });
    document.getElementById('packInfo').classList.toggle('show', S.settings.loc === 'hotel');
  }

  // Data export/import/reset
  document.getElementById('btnExport').onclick = () => {
    const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ppl-tracker-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast('Exported');
  };
  document.getElementById('btnImport').onclick = () => document.getElementById('importFile').click();
  document.getElementById('importFile').onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!data.settings || !Array.isArray(data.logs)) throw 0;
        if (!confirm('Replace current data with import?')) return;
        S = { ...structuredClone(defaultState), ...data };
        save();
        syncSettingsUI();
        render();
        toast('Imported');
      } catch {
        toast('Invalid file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };
  document.getElementById('btnReset').onclick = () => {
    if (!confirm('Reset ALL data? This cannot be undone.')) return;
    if (!confirm('Are you absolutely sure?')) return;
    localStorage.removeItem(STORAGE_KEY);
    S = structuredClone(defaultState);
    syncSettingsUI();
    render();
    toast('Reset');
  };

  // History
  function renderHistory() {
    const body = document.getElementById('historyBody');
    if (!S.logs.length) {
      body.innerHTML = '<div class="hist-empty">No sessions logged yet.<br>Start a session to track your first workout.</div>';
      return;
    }
    body.innerHTML = S.logs.map(log => {
      let totalVol = 0, totalSets = 0;
      for (const k in log.exercises) {
        for (const s of (log.exercises[k].sets || [])) {
          if (s.done && s.w && s.r) {
            totalVol += Number(s.w) * Number(s.r);
            totalSets++;
          }
        }
      }
      const dur = log.duration ? Math.round(log.duration / 60000) : '—';
      const meta = DAY_META[log.day] || DAY_META[0];
      const v = log.week === 'a' ? '1' : '2';
      const date = new Date(log.start);
      const dateStr = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      const exNames = Object.values(log.exercises).filter(e => (e.sets || []).some(s => s.done)).map(e => e.name);
      return `
        <div class="hist-item">
          <div class="hist-top">
            <div class="hist-title">${meta.label} ${v} · ${log.loc === 'gym' ? 'Gym' : 'Hotel'}</div>
            <div class="hist-date">${dateStr}</div>
          </div>
          <div class="hist-stats">
            <span><strong>${formatVol(Math.round(totalVol))}</strong> ${S.settings.unit}</span>
            <span><strong>${totalSets}</strong> sets</span>
            <span><strong>${dur}</strong> min</span>
          </div>
          <div style="font-size:11px;color:var(--text-3);margin-top:6px;line-height:1.5">${exNames.join(' · ')}</div>
        </div>
      `;
    }).join('');
  }

  // ---------- Init ----------
  syncSettingsUI();
  render();

  // Register service worker for PWA
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }
})();
