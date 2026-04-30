// ============================================================
//  CLAUDE API — alle KI-Aufrufe
// ============================================================

async function callClaude(prompt, systemPrompt) {
  const body = { messages: [{ role: 'user', content: prompt }] };
  if (systemPrompt) body.system = systemPrompt;

  const res = await fetch('/.netlify/functions/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Fehler ${res.status}`);
  }

  const data = await res.json();
  return data.content?.map(b => b.text || '').join('') || '';
}

function parseJSON(str) {
  try {
    return JSON.parse(str.replace(/```json|```/g, '').trim());
  } catch (e) {
    const match = str.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
    if (match) {
      try { return JSON.parse(match[0]); } catch (_) {}
    }
    return null;
  }
}

// ---- BILD + POST ----
async function apiGenerateVisual(topic, format, style, colorHint, nicheKey) {
  const nc = NICHES[nicheKey];
  const prompt = `Du bist ein erfahrener Instagram Content Creator für die Nische: ${nc.context}

Erstelle für das Thema "${topic}" (Format: ${format}, Stil: ${style}${colorHint ? ', Gewünschte Farbe: ' + colorHint : ''}) ein vollständiges Content-Paket als JSON:
{
  "headline": "Kurze, knackige Headline für das Bild (max 7 Wörter)",
  "subtext": "1 kurzer Untertitel-Satz",
  "points": ["Punkt 1 (max 35 Zeichen)", "Punkt 2", "Punkt 3"],
  "emoji": "1 passendes Emoji",
  "cta": "Kurzer CTA-Text für das Bild (max 5 Wörter)",
  "bgColor": "#hexfarbe (dunkler Hintergrund passend zur Nische und zum Stil)",
  "accentColor": "#hexfarbe (Akzentfarbe, leuchtkräftig)",
  "post": "Vollständiger Instagram-Post auf Deutsch (Hook → Haupttext → 3 Tipps/Insights → CTA → Emojis, 4-5 Absätze)",
  "caption_short": "Sehr kurze Story-Caption (max 2 Zeilen, für Overlay)",
  "hashtags": "#hashtag1 #hashtag2 ... (20 Hashtags: 4 groß >1M, 8 mittel 100k-1M, 8 klein <100k)"
}

Nur das JSON-Objekt, absolut kein Text davor oder danach.`;

  const raw = await callClaude(prompt);
  return parseJSON(raw);
}

// ---- STORY-SEQUENZ ----
async function apiGenerateStory(topic, count, style, nicheKey) {
  const nc = NICHES[nicheKey];
  const prompt = `Du bist Instagram Story Spezialist für: ${nc.context}

Erstelle eine ${count}-teilige Story-Sequenz zum Thema "${topic}" (Stil: ${style}).
Die letzte Story ist immer ein starker CTA (DM, Link in Bio o.ä.).

Antworte NUR mit einem JSON-Array:
[
  {
    "headline": "Headline (max 6 Wörter)",
    "body": "1-2 kurze Sätze mit Mehrwert",
    "emoji": "1 passendes Emoji",
    "cta": "Kurzer CTA oder null",
    "bgColor": "#hexfarbe",
    "accentColor": "#hexfarbe"
  }
]

Nur das JSON-Array, kein Text davor oder danach.`;

  const raw = await callClaude(prompt);
  return parseJSON(raw);
}

// ---- CAPTION ----
async function apiGenerateCaption(desc, cta, hashtags, nicheKey) {
  const nc = NICHES[nicheKey];
  const prompt = `Du bist Instagram Creator für: ${nc.context}

Erstelle eine Instagram-Caption auf Deutsch + ${hashtags} Hashtags.
Bild/Video: ${desc}
CTA am Ende: "${cta}"

Struktur:
1. Hook-Satz (erste Zeile stoppt beim Scrollen)
2. Empathischer Haupttext (2-3 Zeilen)
3. Konkreter Tipp oder Insight
4. CTA-Zeile
5. Leerzeile
6. ${hashtags} Hashtags (Mix: 4 groß, 8 mittel, Rest klein)

Nur die fertige Caption, kein Intro oder Erklärung davor.`;

  return await callClaude(prompt);
}

// ---- 4-WOCHEN-PLAN ----
async function apiGeneratePlan(freq, goal, nicheKey) {
  const nc = NICHES[nicheKey];
  const prompt = `Du bist Instagram-Stratege für die Nische: ${nc.context}

Erstelle einen 4-Wochen Redaktionsplan.
Posting-Frequenz: ${freq}
Ziel: ${goal || 'Vertrauen aufbauen und organische Reichweite steigern'}

Für jede Woche:
- Wochen-Motto (1 Satz)
- Jeden Post: Format | Thema | 1-Satz Beschreibung | Idealer Posting-Zeitpunkt

Format kompakt und direkt umsetzbar. Keine langen Einleitungen.`;

  return await callClaude(prompt);
}

// ============================================================
//  FACEBOOK API CALLS
// ============================================================

async function apiFbGenerateProfilPost(topic, format, tone, style, nicheKey) {
  const nc = FB_NICHES[nicheKey];
  const prompt = `Du bist ein erfahrener Facebook Content Creator für die Nische: ${nc.context}

Erstelle für das Thema "${topic}" (Format: ${format}, Ton: ${tone}, Bildstil: ${style}) ein vollständiges Facebook Content-Paket als JSON:
{
  "headline": "Kurze Headline für das Bild (max 8 Wörter)",
  "subtext": "1 Untertitel-Satz",
  "points": ["Punkt 1 (max 35 Zeichen)", "Punkt 2", "Punkt 3"],
  "emoji": "1 passendes Emoji",
  "cta": "Kurzer CTA-Text für das Bild (max 5 Wörter)",
  "bgColor": "#hexfarbe (passend zum Stil und zur Nische)",
  "accentColor": "#hexfarbe (Akzentfarbe)",
  "post": "Vollständiger Facebook-Post auf Deutsch: Emotionaler Einstieg → Hauptinhalt → persönlicher Bezug → Frage oder CTA. Facebook-typisch: längere Texte ok, keine Hashtag-Flut (max 3-5), persönlich und direkt.",
  "cover_headline": "Alternative kürzere Headline für Cover-Bild (max 5 Wörter)"
}

Nur das JSON-Objekt, kein Text davor oder danach.`;

  const raw = await callClaude(prompt);
  return parseJSON(raw);
}

async function apiFbGenerateStory(topic, count, style, nicheKey) {
  const nc = FB_NICHES[nicheKey];
  const prompt = `Du bist Facebook Story Spezialist für: ${nc.context}

Erstelle eine ${count}-teilige Facebook Story-Sequenz zum Thema "${topic}" (Stil: ${style}).
Die letzte Story ist immer ein CTA (DM, Kommentar, Link).

Antworte NUR mit einem JSON-Array:
[
  {
    "headline": "Headline (max 6 Wörter)",
    "body": "1-2 kurze Sätze mit echtem Mehrwert",
    "emoji": "1 Emoji",
    "cta": "Kurzer CTA oder null",
    "bgColor": "#hexfarbe",
    "accentColor": "#hexfarbe"
  }
]

Nur das Array, kein Text davor oder danach.`;

  const raw = await callClaude(prompt);
  return parseJSON(raw);
}

async function apiFbGenerateGruppenPost(topic, type, groupName, goal, nicheKey) {
  const nc = FB_NICHES[nicheKey];
  const prompt = `Du bist Community Manager einer Facebook Gruppe zum Thema: ${nc.context}
${groupName ? 'Gruppenname: ' + groupName : ''}

Erstelle einen Facebook Gruppen-Post auf Deutsch.
Post-Typ: ${type}
Thema: ${topic}
Ziel: ${goal || 'Engagement und Diskussion fördern'}

Facebook-Gruppen-typisch:
- Persönlich und auf Augenhöhe ansprechen
- Bei Fragen: offen formulieren, zum Kommentieren einladen
- Emojis sinnvoll einsetzen (nicht übertreiben)
- Max. 2-3 Hashtags
- Wenn passend: "Teilt gerne / Markiert jemanden der das braucht"
- Zwischen 100-250 Wörter

Nur den fertigen Post, kein Intro.`;

  return await callClaude(prompt);
}

async function apiFbGenerateIdeaPost(title, sub, nicheKey) {
  const nc = FB_NICHES[nicheKey];
  const prompt = `Du bist Facebook Content Creator für: ${nc.context}

Thema: "${title}" — ${sub}

Erstelle:
1. Einen fertigen Facebook-Post (persönlich, 150-250 Wörter, max 3 Hashtags, mit CTA/Frage am Ende)
2. 2 alternative Titel-Varianten für dieses Thema
3. 1 Idee für ein Bild dazu (kurze Beschreibung was man zeigen könnte)

Auf Deutsch, direkt verwendbar.`;

  return await callClaude(prompt);
}

async function apiFbGeneratePlan(freq, channels, goal, nicheKey) {
  const nc = FB_NICHES[nicheKey];
  const prompt = `Du bist Facebook-Stratege für die Nische: ${nc.context}

Erstelle einen 4-Wochen Facebook-Monatsplan.
Posting-Frequenz: ${freq}
Kanäle: ${channels}
Ziel: ${goal || 'Community aufbauen und Reichweite steigern'}

Für jede Woche:
- Wochen-Motto
- Jeden Post: Kanal (Profil/Gruppe/Story) | Format | konkretes Thema | 1-Satz Beschreibung | Posting-Zeitpunkt

Facebook-Besonderheiten berücksichtigen:
- Gruppen-Posts für Engagement
- Profil-Posts für Reichweite
- Stories für tägliche Präsenz
- Beste Zeiten: Di–Do 9–11 Uhr und 18–20 Uhr

Kompakt und direkt umsetzbar.`;

  return await callClaude(prompt);
}
