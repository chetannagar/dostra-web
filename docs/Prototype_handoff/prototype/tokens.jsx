// Dostra design tokens — shared across all four screens.
// Two themes (light + dark), one accent hue, one signal green.
// Export to window so every screen file can read the same values.

const DOSTRA_LIGHT = {
  // Warm bone background, near-black ink — feels operational but not sterile.
  bg:        '#f6f4ef',
  surface:   '#fbfaf6',
  surface2:  '#f0ede5',
  line:      '#e4e0d5',
  lineSoft:  '#ece8de',
  ink:       '#1a1813',
  inkMuted:  '#5a5649',
  inkFaint:  '#908b7b',
  // Cool indigo-slate accent — restrained, single hue.
  accent:    'oklch(0.48 0.09 260)',
  accentSoft:'oklch(0.92 0.03 260)',
  accentInk: 'oklch(0.28 0.06 260)',
  // Signals
  signal:    'oklch(0.58 0.11 155)', // "new lead" green
  signalBg:  'oklch(0.94 0.04 155)',
  warn:      'oklch(0.62 0.13 65)',
  warnBg:    'oklch(0.94 0.05 65)',
  danger:    'oklch(0.55 0.16 25)',
  // Payload JSON
  codeBg:    '#f0ede5',
  codeKey:   'oklch(0.42 0.09 260)',
  codeStr:   'oklch(0.45 0.10 155)',
  codeNum:   'oklch(0.52 0.14 65)',
};

const DOSTRA_DARK = {
  bg:        '#121110',
  surface:   '#1a1815',
  surface2:  '#232019',
  line:      '#2e2a22',
  lineSoft:  '#252218',
  ink:       '#f0ede4',
  inkMuted:  '#9a9383',
  inkFaint:  '#625c50',
  accent:    'oklch(0.72 0.09 260)',
  accentSoft:'oklch(0.28 0.05 260)',
  accentInk: 'oklch(0.85 0.06 260)',
  signal:    'oklch(0.72 0.12 155)',
  signalBg:  'oklch(0.28 0.05 155)',
  warn:      'oklch(0.75 0.13 65)',
  warnBg:    'oklch(0.30 0.05 65)',
  danger:    'oklch(0.68 0.16 25)',
  codeBg:    '#0e0d0b',
  codeKey:   'oklch(0.78 0.08 260)',
  codeStr:   'oklch(0.74 0.10 155)',
  codeNum:   'oklch(0.78 0.12 65)',
};

const DOSTRA_TYPE = {
  sans: '"Geist", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  mono: '"Geist Mono", ui-monospace, "SF Mono", Menlo, monospace',
};

// Inject the Geist + Geist Mono fonts once.
if (typeof document !== 'undefined' && !document.getElementById('dostra-fonts')) {
  const link = document.createElement('link');
  link.id = 'dostra-fonts';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap';
  document.head.appendChild(link);
}

// Shared realistic seed data — used by dashboard, list, and detail so the
// "same app" feeling holds when users compare screens.
const DOSTRA_LEADS = [
  { id: 1247, client: 'Acme Plumbing',    key: 'acme_plumbing',    name: 'Sarah Connor',      email: 'sarah.connor@gmail.com',         message: 'Hi — looking for a quote on replacing a corroded cast iron stack. Two-story home, built 1978. When could someone come out for an assessment?', source: 'wpforms-zapier', ago: '2m', ts: '2026-04-21 14:32', fresh: true, active: true },
  { id: 1246, client: 'Harbor Dental',    key: 'harbor_dental',    name: 'Marcus Webb',       email: 'mwebb@outlook.com',               message: 'New patient inquiry. Do you accept Delta Dental PPO? Also wondering about Invisalign consult availability next month.', source: 'wpforms-zapier', ago: '14m', ts: '2026-04-21 14:20', fresh: true, active: true },
  { id: 1245, client: 'Northstar Legal',  key: 'northstar_legal',  name: 'Priya Ramanathan',  email: 'priya.r@protonmail.com',          message: 'Contract review for small business acquisition. Approx $2.1M deal value. Timeline is 3 weeks. Please advise rate structure.', source: 'wpforms-zapier', ago: '38m', ts: '2026-04-21 13:56', fresh: true, active: true },
  { id: 1244, client: 'Acme Plumbing',    key: 'acme_plumbing',    name: 'James O\u2019Brien', email: 'jim.obrien@yahoo.com',           message: 'Kitchen sink clogged, tried drain snake no luck. Available today?', source: 'wpforms-zapier', ago: '1h', ts: '2026-04-21 13:28', fresh: false, active: true },
  { id: 1243, client: 'Redwood Therapy',  key: 'redwood_therapy',  name: 'Elena Vasquez',     email: 'e.vasquez@icloud.com',            message: 'Seeking individual therapy, anxiety and life transitions. Sliding scale availability?', source: 'wpforms-zapier', ago: '2h', ts: '2026-04-21 12:14', fresh: false, active: true },
  { id: 1242, client: 'Harbor Dental',    key: 'harbor_dental',    name: 'Tomas Lindgren',    email: null,                              message: 'Emergency — chipped molar, pain level 7. Can someone call me back?', source: 'wpforms-zapier', ago: '3h', ts: '2026-04-21 11:42', fresh: false, active: true },
  { id: 1241, client: 'Acme Plumbing',    key: 'acme_plumbing',    name: 'Yuki Tanaka',       email: 'yuki.t@fastmail.com',             message: 'Water heater making loud banging noise. Home is from 2009, Rheem 50gal.', source: 'wpforms-zapier', ago: '4h', ts: '2026-04-21 10:22', fresh: false, active: true },
  { id: 1240, client: 'Northstar Legal',  key: 'northstar_legal',  name: 'David Okonkwo',     email: 'd.okonkwo@gmail.com',             message: 'Employment dispute — wrongful termination consultation request.', source: 'wpforms-zapier', ago: '5h', ts: '2026-04-21 09:01', fresh: false, active: true },
  { id: 1239, client: 'Meridian HVAC',    key: 'meridian_hvac',    name: 'Rebecca Fox',       email: 'rfox@hey.com',                    message: 'AC not cooling, Central Texas, 2100sqft. Furnace replacement quote also wanted.', source: 'wpforms-zapier', ago: '7h', ts: '2026-04-21 07:48', fresh: false, active: true },
  { id: 1238, client: 'Redwood Therapy',  key: 'redwood_therapy',  name: 'Aarav Mehta',       email: 'aarav.m@gmail.com',               message: 'Couples counseling inquiry, evening availability required.', source: 'wpforms-zapier', ago: '8h', ts: '2026-04-21 06:30', fresh: false, active: true },
  { id: 1237, client: 'Acme Plumbing',    key: 'acme_plumbing',    name: 'Leon Schulz',       email: 'leon.schulz@web.de',              message: 'Leaking pipe under bathroom sink, water damage visible.', source: 'wpforms-zapier', ago: '12h', ts: '2026-04-21 02:11', fresh: false, active: true },
  { id: 1236, client: 'Ironwood Fitness', key: 'ironwood_fitness', name: 'Chloe Adams',       email: 'chloe@hey.com',                   message: 'Personal training consult — post-injury return to lifting.', source: 'wpforms-zapier', ago: '1d', ts: '2026-04-20 15:04', fresh: false, active: false },
  { id: 1235, client: 'Meridian HVAC',    key: 'meridian_hvac',    name: 'Greg Patel',        email: 'g.patel@gmail.com',               message: 'Quote for whole-home humidifier install.', source: 'wpforms-zapier', ago: '1d', ts: '2026-04-20 11:22', fresh: false, active: true },
  { id: 1234, client: 'Harbor Dental',    key: 'harbor_dental',    name: 'Adaeze Nwosu',      email: 'adaeze.nwosu@gmail.com',          message: 'New patient, family of 4. Pediatric dentistry available?', source: 'wpforms-zapier', ago: '1d', ts: '2026-04-20 09:47', fresh: false, active: true },
];

const DOSTRA_CLIENTS = [
  { name: 'Acme Plumbing',    key: 'acme_plumbing',    count: 48, active: true  },
  { name: 'Harbor Dental',    key: 'harbor_dental',    count: 31, active: true  },
  { name: 'Northstar Legal',  key: 'northstar_legal',  count: 22, active: true  },
  { name: 'Meridian HVAC',    key: 'meridian_hvac',    count: 18, active: true  },
  { name: 'Redwood Therapy',  key: 'redwood_therapy',  count: 14, active: true  },
  { name: 'Ironwood Fitness', key: 'ironwood_fitness', count:  7, active: false },
];

// 14-day histogram for the dashboard bar chart.
const DOSTRA_DAILY = [
  { d: 'Apr 8',  n: 6 }, { d: 'Apr 9',  n: 9 }, { d: 'Apr 10', n: 4 },
  { d: 'Apr 11', n: 11 }, { d: 'Apr 12', n: 2 }, { d: 'Apr 13', n: 3 },
  { d: 'Apr 14', n: 12 }, { d: 'Apr 15', n: 15 }, { d: 'Apr 16', n: 8 },
  { d: 'Apr 17', n: 10 }, { d: 'Apr 18', n: 4 }, { d: 'Apr 19', n: 5 },
  { d: 'Apr 20', n: 13 }, { d: 'Apr 21', n: 9 },
];

Object.assign(window, {
  DOSTRA_LIGHT, DOSTRA_DARK, DOSTRA_TYPE,
  DOSTRA_LEADS, DOSTRA_CLIENTS, DOSTRA_DAILY,
});
