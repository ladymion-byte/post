# Instagram Content Agent

KI-gestützter Instagram Content Creator für die Nischen:
- 🥗 Abnehmen
- 🌸 Wechseljahre
- 🌙 Besser schlafen

## Setup

### 1. API Key eintragen
Öffne `js/config.js` und ersetze `DEIN_API_KEY_HIER` mit deinem Anthropic API Key:
```js
const CONFIG = {
  apiKey: 'sk-ant-...',
  ...
};
```
Den API Key bekommst du unter: https://console.anthropic.com/

### 2. Auf Netlify deployen

**Option A — Drag & Drop (einfachste Methode):**
1. Gehe zu https://app.netlify.com
2. Klicke auf "Add new site" → "Deploy manually"
3. Ziehe den gesamten Projektordner in das Upload-Feld
4. Fertig — Netlify gibt dir eine URL

**Option B — Git:**
1. Lade den Ordner auf GitHub
2. Netlify → "Add new site" → "Import from Git"
3. Repository auswählen → Deploy

### Projektstruktur
```
instagram-agent/
├── index.html          # Haupt-HTML
├── netlify.toml        # Netlify-Konfiguration
├── css/
│   └── style.css       # Alle Styles
└── js/
    ├── config.js       # API Key + Nischen-Daten
    ├── canvas.js       # Bildvorschau (Feed & Story)
    ├── api.js          # Claude API Aufrufe
    └── app.js          # UI-Logik & Events
```

## Hinweise
- Der API Key ist im Frontend sichtbar — nur für den privaten Gebrauch verwenden
- Für produktiven Einsatz: API Key über ein Netlify Function (serverless) schützen
