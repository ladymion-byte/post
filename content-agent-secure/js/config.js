// ============================================================
//  KONFIGURATION — kein API Key hier, läuft über Netlify Function
// ============================================================
const CONFIG = {
  model:     'claude-sonnet-4-20250514',
  maxTokens: 1200,
};

// ============================================================
//  INSTAGRAM NISCHEN
// ============================================================
const NICHES = {
  abnehmen: {
    label:   'Abnehmen',
    emoji:   '🥗',
    context: 'Gesundes, nachhaltiges Abnehmen ohne Crash-Diäten. Zielgruppe: Frauen 30–55.',
    colors:  { accent: '#a78bfa', bg: '#1a1528', text: '#e9d5ff', dark: '#7c3aed' },
    placeholder: 'z.B. 5 Tipps gegen Heißhunger, Zuckerfalle Joghurt',
    audience: 'Frauen 30–55, die gesund abnehmen wollen',
  },
  wechseljahre: {
    label:   'Wechseljahre',
    emoji:   '🌸',
    context: 'Wechseljahre: Hormone, Hitzewallungen, Gewicht, emotionale Gesundheit. Einfühlsam, empowernd. Frauen 45–60.',
    colors:  { accent: '#fb923c', bg: '#1e1610', text: '#fed7aa', dark: '#c2410c' },
    placeholder: 'z.B. Hitzewallungen natürlich lindern, Hormone & Gewicht',
    audience: 'Frauen 45–60 in oder vor den Wechseljahren',
  },
  schlaf: {
    label:   'Besser schlafen',
    emoji:   '🌙',
    context: 'Schlafhygiene, Einschlaftipps, Schlafrituale, weniger Stress. Menschen 30–60.',
    colors:  { accent: '#34d399', bg: '#0d1f18', text: '#a7f3d0', dark: '#059669' },
    placeholder: 'z.B. Abendroutine für besseren Schlaf, Einschlafen in 10 Min',
    audience: 'Menschen 30–60 mit Einschlafproblemen',
  },
};

// ============================================================
//  FACEBOOK NISCHEN
// ============================================================
const FB_NICHES = {
  oele: {
    label:   'Ätherische Öle',
    emoji:   '🌿',
    context: 'Ätherische Öle: Aromatherapie, Anwendung, Wirkung, DIY-Rezepte. Natürlich, ganzheitlich, warmherzig. Frauen 35–60.',
    colors:  { accent: '#4ade80', bg: '#0d1f0f', text: '#bbf7d0', dark: '#16a34a' },
    placeholder: 'z.B. Lavendel gegen Stress, 5 Öle für Anfänger',
    ideas: [
      { title: 'Öl des Monats', sub: 'Wirkung, Anwendung & Tipp' },
      { title: 'DIY Rezept', sub: 'z.B. Schlafspray mit Lavendel' },
      { title: 'Mythos aufklären', sub: 'Was ätherische Öle wirklich können' },
      { title: 'Community-Frage', sub: 'Welches Öl nutzt ihr täglich?' },
      { title: 'Saison-Öle', sub: 'Passende Öle für die aktuelle Jahreszeit' },
      { title: 'Anfänger-Guide', sub: '3 Öle die jeder haben sollte' },
    ],
  },
  zellen: {
    label:   'Zellerneuerung',
    emoji:   '✨',
    context: 'Zellerneuerung, Autophagie, Anti-Aging, Vitalität durch Ernährung und Lebensweise. Frauen und Männer 40–65.',
    colors:  { accent: '#60a5fa', bg: '#0d1626', text: '#bfdbfe', dark: '#1d4ed8' },
    placeholder: 'z.B. Autophagie aktivieren, Zellen durch Schlaf regenerieren',
    ideas: [
      { title: 'Was ist Autophagie?', sub: 'Einfach erklärt für Einsteiger' },
      { title: 'Top 5 Lebensmittel', sub: 'Die die Zellregeneration fördern' },
      { title: 'Schlaf & Zellerneuerung', sub: 'Warum Nachtschlaf entscheidend ist' },
      { title: 'Fasten-Tipp', sub: 'Intervall-Fasten und seine Wirkung' },
      { title: 'Anti-Aging natürlich', sub: 'Was wirklich hilft' },
      { title: 'Community-Frage', sub: 'Was tut ihr für eure Zellen?' },
    ],
  },
  'oele-zellen': {
    label:   'Öle & Zellen',
    emoji:   '🌱',
    context: 'Kombination: Ätherische Öle und Zellerneuerung. Ganzheitliche Gesundheit, Natur + Wissenschaft. Frauen 40–65.',
    colors:  { accent: '#a3e635', bg: '#111a0a', text: '#d9f99d', dark: '#4d7c0f' },
    placeholder: 'z.B. Öle die Zellregeneration unterstützen, Entgiftung',
    ideas: [
      { title: 'Öle für Zellregeneration', sub: 'Welche Öle die Erneuerung fördern' },
      { title: 'Morgenritual', sub: 'Öle + Ernährung für vitale Zellen' },
      { title: 'Entgiftung natürlich', sub: 'Öle die Entgiftungsorgane unterstützen' },
      { title: 'Anti-Aging Kombi', sub: 'Öle + Zellerneuerung = Synergieeffekt' },
      { title: 'DIY Körperöl', sub: 'Rezept für straffe, regenerierte Haut' },
      { title: 'Erfahrungsbericht', sub: 'Teile deine Routine mit der Community' },
    ],
  },
};

// ============================================================
//  STATE
// ============================================================
let currentNiche   = 'abnehmen';
let currentFbNiche = 'oele';
let currentPlat    = 'instagram';
