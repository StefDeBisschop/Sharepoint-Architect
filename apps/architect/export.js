/* ===== SharePoint Architect — branded PNG export =====
   Re-renders the whole design on a 2D canvas. layoutNode() both MEASURES and
   DRAWS with identical logic (fonts are set in BOTH passes) so heights always
   match, and every piece of text is clipped/wrapped to the card width. */
"use strict";

const X_INK = "#15212f", X_MUTED = "#5b6878", X_SUBTLE = "#939eac", X_LINE = "#e3e7ed", X_CANVAS = "#f3f5f8";
const FONT = "'Segoe UI', ui-sans-serif, system-ui, -apple-system, sans-serif";

function roundRect(ctx, x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
function clipText(ctx, text, max) { text = String(text); if (max <= 0) return ""; if (ctx.measureText(text).width <= max) return text; let t = text; while (t.length && ctx.measureText(t + "…").width > max) t = t.slice(0, -1); return t + "…"; }
function wrapText(ctx, text, maxW) {
  const words = String(text).split(/\s+/); const lines = []; let line = "";
  words.forEach((w) => { const t = line ? line + " " + w : w; if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t; });
  if (line) lines.push(line); return lines.length ? lines : [""];
}
const _iconCache = {};
function iconImg(name, color) {
  const key = name + "|" + color;
  if (_iconCache[key]) return _iconCache[key];
  const s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[name] || "") + "</svg>";
  const img = new Image();
  const entry = { img: img, p: new Promise((res) => { img.onload = () => res(img); img.onerror = () => res(null); }) };
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(s);
  _iconCache[key] = entry; return entry;
}
function hpM(n, side, size) {
  if (side === "top") return { x: n.x + size.w / 2, y: n.y, dx: 0, dy: -1 };
  if (side === "bottom") return { x: n.x + size.w / 2, y: n.y + size.h, dx: 0, dy: 1 };
  if (side === "left") return { x: n.x, y: n.y + size.h / 2, dx: -1, dy: 0 };
  return { x: n.x + size.w, y: n.y + size.h / 2, dx: 1, dy: 0 };
}

/* Lays out (and optionally draws) a node's inner content. Returns total height.
   IMPORTANT: every ctx.font assignment happens in BOTH passes so measure === draw. */
function layoutNode(ctx, n, x, y, draw) {
  const cfg = CONFIG[n.type], accent = accentOf(n), compact = cfg.category === "sub", w = nodeWidth(n);
  const inheriting = n.security.inheritsFromParent, broken = !inheriting && !isRoot(n.type);
  const teamsOn = n.type === "teamSite" && !!n.teamsEnabled, d = n.cardDisplay || {};
  const padX = compact ? 10 : 12;
  const innerW = w - padX * 2;
  let cy = y + (compact ? 8 : 16);

  /* ----- head: icon, title, type, inherit indicator ----- */
  const iconSz = compact ? 24 : 32, gl = compact ? 13 : 16;
  if (draw) {
    ctx.fillStyle = accent + "16"; roundRect(ctx, x + padX, cy, iconSz, iconSz, compact ? 7 : 9); ctx.fill();
    const im = iconImg(iconKeyOf(n), accent).img; if (im) ctx.drawImage(im, x + padX + (iconSz - gl) / 2, cy + (iconSz - gl) / 2, gl, gl);
  }
  const textX = x + padX + iconSz + (compact ? 8 : 10);
  const textMax = x + w - padX - 18 - textX; // room for the inherit indicator
  if (draw) {
    ctx.textBaseline = "alphabetic"; ctx.textAlign = "left";
    ctx.fillStyle = X_INK; ctx.font = "600 " + (compact ? 13 : 14) + "px " + FONT;
    const tl = clipText(ctx, n.label, textMax - (teamsOn ? 19 : 0));
    ctx.fillText(tl, textX, cy + (compact ? 11 : 13));
    if (teamsOn) { const after = textX + ctx.measureText(tl).width + 4; ctx.fillStyle = TEAMS_ACCENT + "18"; roundRect(ctx, after, cy, 15, 15, 4); ctx.fill(); const tg = iconImg("messages", TEAMS_ACCENT).img; if (tg) ctx.drawImage(tg, after + 2, cy + 2, 11, 11); }
    ctx.fillStyle = compact ? X_SUBTLE : accent; ctx.font = "600 9.5px " + FONT;
    ctx.fillText(clipText(ctx, (cfg.label + (teamsOn ? " · Teams" : "")).toUpperCase(), textMax), textX, cy + (compact ? 23 : 27));
    const ic = iconImg(inheriting ? "chevronsDown" : "lock", inheriting ? X_SUBTLE : accent).img;
    if (ic) ctx.drawImage(ic, x + w - padX - 13, cy + 1, 13, 13);
  }
  cy += compact ? 28 : 34;

  /* ----- governance pills (flow layout, wraps to extra rows) ----- */
  const pills = [];
  if (n.sensitivity && SENSITIVITY[n.sensitivity]) pills.push({ label: SENSITIVITY[n.sensitivity].label, color: SENSITIVITY[n.sensitivity].color, dot: true });
  if (n.externalSharing && n.externalSharing !== "inherit" && EXTERNAL[n.externalSharing]) { const ex = EXTERNAL[n.externalSharing]; pills.push({ label: ex.label, color: ex.color, icon: ex.icon }); }
  if (pills.length) {
    cy += 8; const ph = 18;
    ctx.font = "600 10px " + FONT; // set in BOTH passes — flow depends on measurement
    let bx = x + padX, row = 0;
    pills.forEach((pill) => {
      const pre = pill.icon ? 19 : 14;
      let lbl = pill.label;
      let pw = ctx.measureText(lbl).width + pre + 8;
      if (pw > innerW) { lbl = clipText(ctx, lbl, innerW - pre - 8); pw = ctx.measureText(lbl).width + pre + 8; }
      if (bx + pw > x + padX + innerW && bx > x + padX) { bx = x + padX; row++; cy += ph + 4; }
      if (draw) {
        ctx.fillStyle = pill.color + "1f"; roundRect(ctx, bx, cy, pw, ph, 9); ctx.fill();
        if (pill.dot) { ctx.fillStyle = pill.color; ctx.beginPath(); ctx.arc(bx + 8, cy + 9, 3, 0, Math.PI * 2); ctx.fill(); }
        if (pill.icon) { const im = iconImg(pill.icon, pill.color).img; if (im) ctx.drawImage(im, bx + 6, cy + 3.5, 11, 11); }
        ctx.fillStyle = pill.color; ctx.fillText(lbl, bx + pre, cy + 12.5);
      }
      bx += pw + 4;
    });
    cy += ph;
  }

  function box(bg, border, h) { if (draw) { ctx.fillStyle = bg; roundRect(ctx, x + padX, cy, innerW, h, 6); ctx.fill(); if (border) { ctx.strokeStyle = border; ctx.lineWidth = 1; roundRect(ctx, x + padX, cy, innerW, h, 6); ctx.stroke(); } } }

  /* ----- broken-inheritance banner (clipped) ----- */
  if (broken) {
    cy += 8; const h = 24; box("#fdf3f4", "#f3c4c8", h);
    if (draw) {
      const ic = iconImg("unlock", "#b91c1c").img; if (ic) ctx.drawImage(ic, x + padX + 8, cy + 6, 12, 12);
      ctx.fillStyle = "#b91c1c"; ctx.font = "600 10.5px " + FONT;
      ctx.fillText(clipText(ctx, compact ? "Inheritance broken" : "Inheritance broken — unique permissions", innerW - 34), x + padX + 26, cy + 16);
    }
    cy += h;
  }

  /* ----- note (wrapped) ----- */
  if (n.notes && n.notes.trim()) {
    cy += 8;
    ctx.font = "11px " + FONT;
    const lines = wrapText(ctx, n.notes, innerW - 34);
    const h = Math.max(22, lines.length * 14 + 9);
    box("#f8fafc", X_LINE, h);
    if (draw) {
      const ic = iconImg("note", X_SUBTLE).img; if (ic) ctx.drawImage(ic, x + padX + 8, cy + 6, 12, 12);
      ctx.fillStyle = X_MUTED; lines.forEach((ln, i) => ctx.fillText(ln, x + padX + 26, cy + 15 + i * 14));
    }
    cy += h;
  }

  function blockBox(label, rows, rowFn) {
    cy += 10;
    if (draw) { ctx.fillStyle = X_SUBTLE; ctx.font = "600 9px " + FONT; ctx.fillText(label.toUpperCase(), x + padX, cy + 8); }
    cy += 12;
    const h = rows * 16 + 12; box(X_CANVAS, null, h);
    if (draw) { ctx.font = "11px " + FONT; for (let i = 0; i < rows; i++) { rowFn(i, cy + 13 + i * 16); ctx.font = "11px " + FONT; } ctx.textAlign = "left"; }
    cy += h;
  }

  if (!compact) {
    /* description (wrapped) */
    if (d.description && n.description) {
      cy += 8; ctx.font = "12px " + FONT;
      const lines = wrapText(ctx, n.description, innerW);
      if (draw) { ctx.fillStyle = X_MUTED; lines.forEach((ln, i) => ctx.fillText(ln, x + padX, cy + 11 + i * 16)); }
      cy += lines.length * 16;
    }
    /* nested contents (folders / document sets / content types living inside this card) */
    const kids = childrenOf(n.id);
    if (kids.length) blockBox("Contents", kids.length, (i, ry) => {
      const k = kids[i], ka = accentOf(k);
      ctx.font = "600 9px " + FONT;
      const typeLbl = CONFIG[k.type].label;
      const tw = ctx.measureText(typeLbl).width;
      if (draw) {
        ctx.fillStyle = ka + "16"; roundRect(ctx, x + padX + 8, ry - 10, 14, 14, 4); ctx.fill();
        const im = iconImg(iconKeyOf(k), ka).img; if (im) ctx.drawImage(im, x + padX + 10, ry - 8, 10, 10);
        ctx.textAlign = "right"; ctx.fillStyle = X_SUBTLE; ctx.fillText(typeLbl, x + w - padX - 10, ry);
      }
      ctx.font = "11px " + FONT;
      if (draw) {
        ctx.textAlign = "left"; ctx.fillStyle = X_INK;
        ctx.fillText(clipText(ctx, k.label, innerW - 20 - 18 - tw - 14), x + padX + 28, ry);
      }
    });
    /* metadata */
    if (d.metadata && n.metadata.length) blockBox("Metadata", n.metadata.length, (i, ry) => {
      const m = n.metadata[i];
      const keyMax = innerW * 0.42;
      ctx.textAlign = "left"; ctx.fillStyle = X_SUBTLE; const key = clipText(ctx, m.key, keyMax); ctx.fillText(key, x + padX + 10, ry);
      ctx.textAlign = "right"; ctx.fillStyle = X_INK;
      ctx.fillText(clipText(ctx, m.value || "—", innerW - 20 - ctx.measureText(key).width - 12), x + w - padX - 10, ry);
    });
    /* channels */
    if (d.channels && teamsOn && n.channels.length) blockBox("Channels", n.channels.length, (i, ry) => {
      const c = n.channels[i];
      const kc = CHANNEL_KINDS[c.kind];
      ctx.font = "600 9px " + FONT;
      const chipLbl = kc.label, chipTw = ctx.measureText(chipLbl).width, chipW = chipTw + 12;
      ctx.font = "11px " + FONT;
      const hh = iconImg("hash", X_SUBTLE).img; if (hh) ctx.drawImage(hh, x + padX + 10, ry - 9, 10, 10);
      ctx.textAlign = "left"; ctx.fillStyle = X_INK;
      ctx.fillText(clipText(ctx, c.name, innerW - 20 - 14 - chipW - 10), x + padX + 24, ry);
      ctx.fillStyle = kc.color + "22"; roundRect(ctx, x + w - padX - 10 - chipW, ry - 11, chipW, 15, 4); ctx.fill();
      ctx.fillStyle = kc.color; ctx.font = "600 9px " + FONT;
      ctx.fillText(chipLbl, x + w - padX - 10 - chipW + 6, ry);
    });
    /* permissions */
    if (d.permissions && n.security.permissions.length) blockBox("Permissions", n.security.permissions.length, (i, ry) => {
      const p = n.security.permissions[i];
      const roleLbl = ROLES[p.role], roleW = ctx.measureText(roleLbl).width;
      ctx.textAlign = "left"; ctx.fillStyle = X_INK;
      ctx.fillText(clipText(ctx, p.principal, innerW - 20 - roleW - 12), x + padX + 10, ry);
      ctx.textAlign = "right"; ctx.fillStyle = X_MUTED; ctx.fillText(roleLbl, x + w - padX - 10, ry);
    });
    /* storage */
    if (d.storage && storageRelevant(n.type) && n.storage) {
      const srows = []; if (n.storage.quota) srows.push(["Quota", n.storage.quota]); if (n.storage.items) srows.push(["Items", n.storage.items]); if (n.storage.retention) srows.push(["Retention", n.storage.retention]);
      if (srows.length) blockBox("Storage", srows.length, (i, ry) => {
        ctx.textAlign = "left"; ctx.fillStyle = X_SUBTLE; ctx.fillText(srows[i][0], x + padX + 10, ry);
        ctx.textAlign = "right"; ctx.fillStyle = X_INK; ctx.fillText(clipText(ctx, srows[i][1], innerW - 90), x + w - padX - 10, ry);
      });
    }
  }

  /* ----- permission badges with a guaranteed "+N" chip ----- */
  const showBadges = !inheriting && n.security.permissions.length && (compact || !d.permissions);
  if (showBadges) {
    cy += 8; const bh = 17;
    ctx.font = "600 10px " + FONT; // both passes
    const list = n.security.permissions.slice(0, compact ? 2 : 3);
    const total = n.security.permissions.length;
    let bx = x + padX, shown = 0;
    for (let i = 0; i < list.length; i++) {
      const p = list[i];
      const remainingAfter = total - (shown + 1);
      const reserve = remainingAfter > 0 ? 34 : 0; // keep room for the +N chip
      let lbl = p.principal + " · " + ROLES[p.role];
      let pw = ctx.measureText(lbl).width + 12;
      const limit = x + padX + innerW - reserve;
      if (bx + pw > limit) {
        lbl = clipText(ctx, lbl, limit - bx - 12);
        pw = ctx.measureText(lbl).width + 12;
        if (!lbl || lbl === "…") break;
      }
      if (draw) {
        ctx.fillStyle = accent + "12"; roundRect(ctx, bx, cy, pw, bh, 6); ctx.fill();
        ctx.strokeStyle = accent + "33"; ctx.lineWidth = 1; roundRect(ctx, bx, cy, pw, bh, 6); ctx.stroke();
        ctx.fillStyle = accent; ctx.fillText(lbl, bx + 6, cy + 12);
      }
      bx += pw + 4; shown++;
    }
    const over = total - shown;
    if (over > 0 && draw) {
      const lbl = "+" + over, pw = ctx.measureText(lbl).width + 12;
      ctx.fillStyle = X_LINE; roundRect(ctx, bx, cy, pw, bh, 6); ctx.fill();
      ctx.fillStyle = X_MUTED; ctx.fillText(lbl, bx + 6, cy + 12);
    }
    cy += bh;
  }

  return cy - y + (compact ? 10 : 12);
}

function drawCard(ctx, x, y, w, h, accent, compact) {
  const r = compact ? 10 : 14;
  ctx.save(); ctx.shadowColor = "rgba(16,24,40,0.10)"; ctx.shadowBlur = 8; ctx.shadowOffsetY = 2;
  ctx.fillStyle = "#fff"; roundRect(ctx, x, y, w, h, r); ctx.fill(); ctx.restore();
  ctx.strokeStyle = X_LINE; ctx.lineWidth = 1; roundRect(ctx, x, y, w, h, r); ctx.stroke();
  // accent bar clipped to the rounded card path — no anti-aliased fringe outside the corners
  ctx.save(); roundRect(ctx, x, y, w, h, r); ctx.clip(); ctx.fillStyle = accent;
  if (compact) ctx.fillRect(x, y, 3, h); else ctx.fillRect(x, y, w, 6);
  ctx.restore();
}

function loadImage(src) { return new Promise((res) => { const img = new Image(); img.onload = () => res(img); img.onerror = () => res(null); img.src = src; }); }
function hexLuminance(hex) { hex = String(hex || "#ffffff").replace("#", ""); if (hex.length === 3) hex = hex.split("").map((c) => c + c).join(""); const r = parseInt(hex.slice(0, 2), 16) / 255, g = parseInt(hex.slice(2, 4), 16) / 255, b = parseInt(hex.slice(4, 6), 16) / 255; const f = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)); return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); }

async function exportPng() {
  if (!state.nodes.length) return;
  const measure = document.createElement("canvas").getContext("2d");
  const roots = state.nodes.filter((n) => !n.parentId);
  const sizes = {}; let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  roots.forEach((n) => { const w = nodeWidth(n); const h = layoutNode(measure, n, 0, 0, false); sizes[n.id] = { w: w, h: h }; minX = Math.min(minX, n.x); minY = Math.min(minY, n.y); maxX = Math.max(maxX, n.x + w); maxY = Math.max(maxY, n.y + h); });
  (state.annotations || []).forEach((a) => {
    if (a.kind === "frame") { minX = Math.min(minX, a.x); minY = Math.min(minY, a.y); maxX = Math.max(maxX, a.x + a.w); maxY = Math.max(maxY, a.y + a.h); }
    else if (a.kind === "text") {
      measure.font = "600 " + a.size + "px " + FONT;
      const lines = String(a.text || "").split("\n");
      const tw = Math.max.apply(null, lines.map((ln) => measure.measureText(ln).width).concat([10]));
      minX = Math.min(minX, a.x); minY = Math.min(minY, a.y);
      maxX = Math.max(maxX, a.x + tw + 6); maxY = Math.max(maxY, a.y + lines.length * a.size * 1.25 + 4);
    }
    else { minX = Math.min(minX, a.x); minY = Math.min(minY, a.y); maxX = Math.max(maxX, a.x + a.size); maxY = Math.max(maxY, a.y + a.size); }
  });

  /* preload every icon we will draw */
  const seen = {}, specs = [];
  const need = (name, color) => { const k = name + "|" + color; if (!seen[k]) { seen[k] = 1; specs.push(iconImg(name, color).p); } };
  state.nodes.forEach((n) => {
    const accent = accentOf(n), inh = n.security.inheritsFromParent;
    need(iconKeyOf(n), accent); need(inh ? "chevronsDown" : "lock", inh ? X_SUBTLE : accent);
    if (n.type === "teamSite" && n.teamsEnabled) need("messages", TEAMS_ACCENT);
    if (!inh && !isRoot(n.type)) need("unlock", "#b91c1c");
    if (n.notes && n.notes.trim()) need("note", X_SUBTLE);
    if (n.externalSharing && EXTERNAL[n.externalSharing]) need(EXTERNAL[n.externalSharing].icon, EXTERNAL[n.externalSharing].color);
    const d = n.cardDisplay || {};
    if (d.channels && n.type === "teamSite" && n.teamsEnabled && n.channels.length) need("hash", X_SUBTLE);
  });
  (state.annotations || []).forEach((a) => { if (a.kind === "icon") need(ANNO_ICON[a.icon] || "user", a.color); });
  await Promise.all(specs);

  const bg = state.settings.exportBg || X_CANVAS;
  const logo = state.settings.logo ? await loadImage(state.settings.logo) : null;
  const name = (state.docName || "").trim(), desc = (state.docDescription || "").trim();
  const hasHeader = state.settings.exportHeader !== false && !!(name || desc || logo);
  const dark = hexLuminance(bg) < 0.5;

  /* legend of used node types */
  const usedTypes = [];
  if (state.settings.exportLegend !== false) {
    PALETTE.forEach((g) => g.types.forEach((t) => { if (state.nodes.some((n) => n.type === t)) usedTypes.push(t); }));
  }
  const legendH = usedTypes.length ? 38 : 0;

  const pad = 48, scale = clamp(Number(state.settings.exportScale) || 2, 1, 3), headerH = hasHeader ? 92 : 0;
  const contentW = Math.max(maxX - minX, 460);
  const W = contentW + pad * 2, H = (maxY - minY) + pad * 2 + headerH + legendH;
  const cv = document.createElement("canvas"); cv.width = Math.ceil(W * scale); cv.height = Math.ceil(H * scale);
  const ctx = cv.getContext("2d"); ctx.scale(scale, scale);
  ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high"; ctx.lineJoin = "round"; ctx.lineCap = "round";
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  if (hasHeader) {
    const inkC = dark ? "#ffffff" : X_INK, mutedC = dark ? "rgba(255,255,255,0.72)" : X_MUTED;
    let logoW = 0;
    if (logo && logo.naturalWidth) { const lh = 52; logoW = Math.min(220, (logo.naturalWidth / logo.naturalHeight) * lh); ctx.drawImage(logo, W - pad - logoW, pad - 6, logoW, lh); }
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    const textMax = W - pad * 2 - (logoW ? logoW + 24 : 0);
    ctx.fillStyle = inkC; ctx.font = "700 22px " + FONT;
    ctx.fillText(clipText(ctx, name || "Untitled architecture", textMax), pad, pad + 18);
    if (desc) { ctx.fillStyle = mutedC; ctx.font = "13px " + FONT; wrapText(ctx, desc, textMax).slice(0, 2).forEach((ln, i) => ctx.fillText(ln, pad, pad + 40 + i * 17)); }
    ctx.strokeStyle = dark ? "rgba(255,255,255,0.18)" : X_LINE; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(pad, pad + headerH - 16); ctx.lineTo(W - pad, pad + headerH - 16); ctx.stroke();
  }

  const ox = pad - minX, oy = pad + headerH - minY;

  /* frames behind everything */
  (state.annotations || []).filter((a) => a.kind === "frame").forEach((a) => {
    const fx = a.x + ox, fy = a.y + oy;
    ctx.fillStyle = a.color + "1f"; roundRect(ctx, fx, fy, a.w, a.h, 12); ctx.fill();
    ctx.strokeStyle = a.color + "66"; ctx.lineWidth = 1.5; roundRect(ctx, fx, fy, a.w, a.h, 12); ctx.stroke();
    if (a.label) { ctx.font = "600 12px " + FONT; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic"; const lbl = clipText(ctx, a.label, a.w - 28); const tw = ctx.measureText(lbl).width; ctx.fillStyle = "rgba(255,255,255,0.82)"; roundRect(ctx, fx + 8, fy + 6, tw + 12, 18, 6); ctx.fill(); ctx.fillStyle = a.color; ctx.fillText(lbl, fx + 14, fy + 19); }
  });

  /* edges */
  ctx.strokeStyle = state.settings.edgeColor || "#c2c7d0"; ctx.lineWidth = state.settings.edgeWidth || 1.5;
  const straight = state.settings.edgeStyle === "straight";
  state.edges.forEach((e) => {
    const a = nodeById(e.source), b = nodeById(e.target); if (!a || !b) return;
    const p1 = hpM(a, e.sourceHandle || "bottom", sizes[a.id]), p2 = hpM(b, e.targetHandle || "top", sizes[b.id]);
    ctx.beginPath(); ctx.moveTo(p1.x + ox, p1.y + oy);
    if (straight) ctx.lineTo(p2.x + ox, p2.y + oy);
    else { const off = Math.max(40, Math.hypot(p2.x - p1.x, p2.y - p1.y) * 0.4); ctx.bezierCurveTo(p1.x + p1.dx * off + ox, p1.y + p1.dy * off + oy, p2.x + p2.dx * off + ox, p2.y + p2.dy * off + oy, p2.x + ox, p2.y + oy); }
    ctx.stroke();
  });

  /* nodes (nested children render inside their parent's Contents block) */
  roots.forEach((n) => { const s = sizes[n.id]; drawCard(ctx, n.x + ox, n.y + oy, s.w, s.h, accentOf(n), CONFIG[n.type].category === "sub"); layoutNode(ctx, n, n.x + ox, n.y + oy, true); });

  /* free text + icon stickers on top */
  (state.annotations || []).forEach((a) => {
    if (a.kind === "text") { ctx.fillStyle = a.color; ctx.font = "600 " + a.size + "px " + FONT; ctx.textAlign = "left"; ctx.textBaseline = "top"; String(a.text || "").split("\n").forEach((ln, i) => ctx.fillText(ln, a.x + ox, a.y + oy + i * a.size * 1.25)); ctx.textBaseline = "alphabetic"; }
    else if (a.kind === "icon") { const im = iconImg(ANNO_ICON[a.icon] || "user", a.color).img; if (im) ctx.drawImage(im, a.x + ox, a.y + oy, a.size, a.size); }
  });

  /* legend (bottom-left) */
  if (usedTypes.length) {
    const ly = H - pad / 2 - 22;
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic"; ctx.font = "600 11px " + FONT;
    let lx = pad;
    const inkC = dark ? "rgba(255,255,255,0.85)" : X_MUTED;
    usedTypes.forEach((t) => {
      const lbl = CONFIG[t].label;
      const iw = 9 + 6 + ctx.measureText(lbl).width + 18;
      if (lx + iw > W - pad) return; // single row; skip overflow
      ctx.fillStyle = CONFIG[t].accent; roundRect(ctx, lx, ly, 9, 9, 3); ctx.fill();
      ctx.fillStyle = inkC; ctx.fillText(lbl, lx + 15, ly + 9);
      lx += iw;
    });
  }

  download(cv.toDataURL("image/png"), (state.docName || "sharepoint-architecture").replace(/[^a-z0-9]+/gi, "-").toLowerCase() + ".png");
}
