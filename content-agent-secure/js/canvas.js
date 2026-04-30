// ============================================================
//  CANVAS DRAWING — Feed & Story Bildvorschau
// ============================================================

function wrapText(ctx, text, x, y, maxW, lineH) {
  if (!text) return y;
  const words = text.split(' ');
  let line = '';
  let cy = y;
  for (let i = 0; i < words.length; i++) {
    const test = line + words[i] + ' ';
    if (ctx.measureText(test).width > maxW && i > 0) {
      ctx.fillText(line.trim(), x, cy);
      line = words[i] + ' ';
      cy += lineH;
    } else {
      line = test;
    }
  }
  ctx.fillText(line.trim(), x, cy);
  return cy + lineH;
}

function hexToRgbStr(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function drawFeedCanvas(canvasId, data, nicheKey) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx  = canvas.getContext('2d');
  const W    = canvas.width;
  const H    = canvas.height;
  const nc   = NICHES[nicheKey];
  const accent = data.accentColor || nc.colors.accent;
  const bgCol  = data.bgColor    || nc.colors.bg;
  const textCol = nc.colors.text;

  // Background
  ctx.fillStyle = bgCol;
  ctx.fillRect(0, 0, W, H);

  // Decorative circles
  ctx.fillStyle = hexToRgbStr(accent, 0.12);
  ctx.beginPath(); ctx.arc(W * 0.9, H * 0.1, W * 0.55, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = hexToRgbStr(accent, 0.07);
  ctx.beginPath(); ctx.arc(W * 0.1, H * 0.85, W * 0.4, 0, Math.PI * 2); ctx.fill();

  // Bottom accent bar
  ctx.fillStyle = accent;
  ctx.fillRect(0, H - 6, W, 6);

  // Left accent line
  ctx.fillStyle = accent;
  ctx.fillRect(0, 60, 4, H - 120);

  // Emoji
  ctx.font = `${W * 0.13}px serif`;
  ctx.textAlign = 'center';
  ctx.fillText(data.emoji || nc.emoji, W / 2, W * 0.22);

  // Headline
  ctx.fillStyle = textCol;
  ctx.font = `bold ${W * 0.06}px 'DM Sans', sans-serif`;
  ctx.textAlign = 'center';
  const hy = wrapText(ctx, data.headline || '', W / 2, W * 0.32, W - 60, W * 0.072);

  // Subtext
  if (data.subtext) {
    ctx.fillStyle = hexToRgbStr(textCol, 0.65);
    ctx.font = `${W * 0.042}px 'DM Sans', sans-serif`;
    wrapText(ctx, data.subtext, W / 2, hy + 10, W - 70, W * 0.052);
  }

  // Bullet points
  if (data.points && data.points.length) {
    const startY = H * 0.58;
    ctx.font = `${W * 0.038}px 'DM Sans', sans-serif`;
    ctx.textAlign = 'left';
    data.points.slice(0, 3).forEach((pt, i) => {
      const py = startY + i * (W * 0.075);
      // dot
      ctx.fillStyle = accent;
      ctx.beginPath(); ctx.arc(28, py - 5, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = textCol;
      ctx.fillText(pt.substring(0, 40), 42, py);
    });
  }

  // CTA
  if (data.cta) {
    const ctaY = H - 28;
    ctx.fillStyle = hexToRgbStr(accent, 0.15);
    roundRect(ctx, W / 2 - 100, ctaY - 18, 200, 28, 6);
    ctx.fill();
    ctx.fillStyle = accent;
    ctx.font = `bold ${W * 0.038}px 'DM Sans', sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(data.cta.substring(0, 30), W / 2, ctaY);
  }
}

function drawStoryCanvas(canvas, data, nicheKey, index, total) {
  const ctx  = typeof canvas === 'string' ? document.getElementById(canvas).getContext('2d') : canvas.getContext('2d');
  const W    = ctx.canvas.width;
  const H    = ctx.canvas.height;
  const nc   = NICHES[nicheKey];
  const accent = data.accentColor || nc.colors.accent;
  const bgCol  = data.bgColor    || nc.colors.bg;
  const textCol = nc.colors.text;

  ctx.fillStyle = bgCol;
  ctx.fillRect(0, 0, W, H);

  // Decorative blobs
  ctx.fillStyle = hexToRgbStr(accent, 0.1);
  ctx.beginPath(); ctx.arc(W * 0.85, H * 0.15, W * 0.65, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = hexToRgbStr(accent, 0.07);
  ctx.beginPath(); ctx.arc(W * 0.1, H * 0.82, W * 0.5, 0, Math.PI * 2); ctx.fill();

  // Progress bar
  const barW = (W - 32) / (total || 5);
  for (let i = 0; i < (total || 5); i++) {
    ctx.fillStyle = i <= index
      ? hexToRgbStr(accent, 0.9)
      : hexToRgbStr(textCol, 0.2);
    ctx.fillRect(16 + i * (barW + 4), 16, barW, 3);
  }

  // Emoji
  ctx.font = `${W * 0.18}px serif`;
  ctx.textAlign = 'center';
  ctx.fillText(data.emoji || nc.emoji, W / 2, H * 0.32);

  // Headline
  ctx.fillStyle = textCol;
  ctx.font = `bold ${W * 0.077}px 'DM Sans', sans-serif`;
  ctx.textAlign = 'center';
  const hy = wrapText(ctx, data.headline || '', W / 2, H * 0.44, W - 40, W * 0.09);

  // Body
  if (data.body) {
    ctx.fillStyle = hexToRgbStr(textCol, 0.72);
    ctx.font = `${W * 0.056}px 'DM Sans', sans-serif`;
    wrapText(ctx, data.body, W / 2, hy + 14, W - 50, W * 0.068);
  }

  // CTA button
  if (data.cta) {
    const btnY = H * 0.84;
    ctx.fillStyle = accent;
    roundRect(ctx, W / 2 - 80, btnY - 18, 160, 36, 18);
    ctx.fill();
    ctx.fillStyle = bgCol;
    ctx.font = `bold ${W * 0.056}px 'DM Sans', sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(data.cta.substring(0, 18), W / 2, btnY + 2);
  }
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function downloadCanvas(canvasIdOrEl, filename) {
  const canvas = typeof canvasIdOrEl === 'string'
    ? document.getElementById(canvasIdOrEl)
    : canvasIdOrEl;
  const a = document.createElement('a');
  a.download = filename;
  a.href = canvas.toDataURL('image/png');
  a.click();
}

// ============================================================
//  FACEBOOK CANVAS FUNCTIONS
// ============================================================

function getFbNicheColors(nicheKey) {
  return FB_NICHES[nicheKey]?.colors || { accent: '#4ade80', bg: '#0d1f0f', text: '#bbf7d0' };
}

// Facebook Post-Bild (1.91:1 = 400x210)
function drawFbPostCanvas(canvasId, data, nicheKey) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const nc = getFbNicheColors(nicheKey);
  const accent = data.accentColor || nc.accent;
  const bgCol  = data.bgColor    || nc.bg;
  const textCol = nc.text;

  ctx.fillStyle = bgCol; ctx.fillRect(0,0,W,H);

  // Background orb
  ctx.fillStyle = hexToRgbStr(accent, 0.13);
  ctx.beginPath(); ctx.arc(W*0.85, H*0.2, H*1.1, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = hexToRgbStr(accent, 0.07);
  ctx.beginPath(); ctx.arc(W*0.05, H*0.9, H*0.7, 0, Math.PI*2); ctx.fill();

  // Left stripe
  ctx.fillStyle = accent; ctx.fillRect(0, 0, 4, H);

  // Emoji
  ctx.font = `${H*0.38}px serif`; ctx.textAlign='center';
  ctx.fillText(data.emoji || FB_NICHES[nicheKey]?.emoji || '🌿', W*0.12, H*0.62);

  // Headline
  ctx.fillStyle = textCol;
  ctx.font = `bold ${H*0.16}px 'DM Sans', sans-serif`;
  ctx.textAlign = 'left';
  wrapText(ctx, data.headline||'', W*0.22, H*0.35, W*0.72, H*0.19);

  // Subtext
  ctx.fillStyle = hexToRgbStr(textCol, 0.65);
  ctx.font = `${H*0.1}px 'DM Sans', sans-serif`;
  wrapText(ctx, data.subtext||'', W*0.22, H*0.62, W*0.72, H*0.13);

  // CTA pill
  ctx.fillStyle = accent;
  roundRect(ctx, W*0.22, H*0.78, W*0.45, H*0.16, 20); ctx.fill();
  ctx.fillStyle = bgCol;
  ctx.font = `bold ${H*0.1}px 'DM Sans', sans-serif`;
  ctx.textAlign='center';
  ctx.fillText((data.cta||'').substring(0,25), W*0.22+W*0.225, H*0.895);
}

// Facebook Cover (16:9 = 400x225)
function drawFbCoverCanvas(canvasId, data, nicheKey) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const nc = getFbNicheColors(nicheKey);
  const accent = data.accentColor || nc.accent;
  const bgCol  = data.bgColor    || nc.bg;
  const textCol = nc.text;

  ctx.fillStyle = bgCol; ctx.fillRect(0,0,W,H);

  // Geometric shapes
  ctx.fillStyle = hexToRgbStr(accent, 0.15);
  ctx.beginPath(); ctx.arc(W, 0, W*0.6, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = hexToRgbStr(accent, 0.08);
  ctx.beginPath(); ctx.arc(0, H, W*0.45, 0, Math.PI*2); ctx.fill();

  // Bottom bar
  ctx.fillStyle = accent; ctx.fillRect(0, H-5, W, 5);

  // Emoji large
  ctx.font = `${H*0.42}px serif`; ctx.textAlign='center';
  ctx.fillText(data.emoji || FB_NICHES[nicheKey]?.emoji || '🌿', W/2, H*0.48);

  // Cover headline
  ctx.fillStyle = textCol;
  ctx.font = `bold ${H*0.14}px 'DM Sans', sans-serif`;
  ctx.textAlign='center';
  wrapText(ctx, data.cover_headline||data.headline||'', W/2, H*0.67, W-50, H*0.17);

  // Niche label
  ctx.fillStyle = hexToRgbStr(accent, 0.8);
  ctx.font = `${H*0.08}px 'DM Sans', sans-serif`;
  ctx.textAlign='center';
  ctx.fillText(FB_NICHES[nicheKey]?.label||'', W/2, H*0.9);
}

// Facebook Story Canvas (same proportions as IG story)
function drawFbStoryCanvas(canvas, data, nicheKey, index, total) {
  const nc = getFbNicheColors(nicheKey);
  // Reuse IG story drawing but with FB colors
  const modified = {
    ...data,
    bgColor: data.bgColor || nc.bg,
    accentColor: data.accentColor || nc.accent,
  };
  // Temporarily override NICHES for color lookup
  const origNiches = window._fbColorOverride;
  window._fbColorOverride = nc;
  drawStoryCanvasFb(canvas, modified, nicheKey, index, total, nc);
  window._fbColorOverride = origNiches;
}

function drawStoryCanvasFb(canvas, data, nicheKey, index, total, nc) {
  const ctx = typeof canvas === 'string'
    ? document.getElementById(canvas).getContext('2d')
    : canvas.getContext('2d');
  const W = ctx.canvas.width, H = ctx.canvas.height;
  const accent = data.accentColor || nc.accent;
  const bgCol  = data.bgColor    || nc.bg;
  const textCol = nc.text;

  ctx.fillStyle = bgCol; ctx.fillRect(0,0,W,H);
  ctx.fillStyle = hexToRgbStr(accent, 0.1);
  ctx.beginPath(); ctx.arc(W*0.85, H*0.15, W*0.65, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = hexToRgbStr(accent, 0.07);
  ctx.beginPath(); ctx.arc(W*0.1, H*0.82, W*0.5, 0, Math.PI*2); ctx.fill();

  // Progress bars
  const barW = (W-32)/(total||5);
  for(let i=0;i<(total||5);i++){
    ctx.fillStyle = i<=index ? hexToRgbStr(accent,0.9) : hexToRgbStr(textCol,0.2);
    ctx.fillRect(16+i*(barW+4),16,barW,3);
  }

  ctx.font=`${W*0.18}px serif`; ctx.textAlign='center';
  ctx.fillText(data.emoji||FB_NICHES[nicheKey]?.emoji||'🌿', W/2, H*0.32);

  ctx.fillStyle=textCol;
  ctx.font=`bold ${W*0.077}px 'DM Sans',sans-serif`; ctx.textAlign='center';
  const hy=wrapText(ctx, data.headline||'', W/2, H*0.44, W-40, W*0.09);

  if(data.body){
    ctx.fillStyle=hexToRgbStr(textCol,0.72);
    ctx.font=`${W*0.056}px 'DM Sans',sans-serif`;
    wrapText(ctx, data.body, W/2, hy+14, W-50, W*0.068);
  }

  if(data.cta){
    const btnY=H*0.84;
    ctx.fillStyle=accent;
    roundRect(ctx,W/2-80,btnY-18,160,36,18); ctx.fill();
    ctx.fillStyle=bgCol;
    ctx.font=`bold ${W*0.056}px 'DM Sans',sans-serif`; ctx.textAlign='center';
    ctx.fillText(data.cta.substring(0,18), W/2, btnY+2);
  }
}
