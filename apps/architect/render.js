/* ===== SharePoint Architect — rendering: canvas, inspector, palette, menus ===== */
"use strict";

function renderAll() {
  renderNodes(); renderFrames(); renderAnnotations(); redrawEdges(); drawMinimap(); renderInspector(); updateTopbar();
  dom.docName.value = state.docName;
  save();
}

/* ---------- annotation rendering ---------- */
function renderFrames() {
  if (!dom.frames) return;
  dom.frames.innerHTML = (state.annotations || []).filter((a) => a.kind === "frame").map((a) => {
    const sel = state.selectedAnno === a.id ? " sel" : "";
    return '<div class="frame' + sel + '" data-anno="' + a.id + '" style="left:' + a.x + "px;top:" + a.y + "px;width:" + a.w + "px;height:" + a.h + "px;color:" + a.color + ";background:" + a.color + "1f;border-color:" + a.color + '66">' +
      (a.label ? '<span class="frame-label" style="color:' + a.color + '">' + esc(a.label) + "</span>" : "") +
      '<span class="frame-resize" data-resize="' + a.id + '"></span></div>';
  }).join("");
}
function renderAnnotations() {
  if (!dom.annotations) return;
  dom.annotations.innerHTML = (state.annotations || []).filter((a) => a.kind !== "frame").map((a) => {
    const sel = state.selectedAnno === a.id ? " sel" : "";
    if (a.kind === "text") return '<div class="anno-text' + sel + '" data-anno="' + a.id + '" style="left:' + a.x + "px;top:" + a.y + "px;color:" + a.color + ";font-size:" + a.size + 'px">' + esc(a.text) + "</div>";
    return '<div class="anno-icon' + sel + '" data-anno="' + a.id + '" style="left:' + a.x + "px;top:" + a.y + "px;width:" + a.size + "px;height:" + a.size + "px;color:" + a.color + '">' + svg(ANNO_ICON[a.icon] || "user") + "</div>";
  }).join("");
}

function accentOf(n) { return n.color || CONFIG[n.type].accent; }
function iconKeyOf(n) { return n.icon && ICONS[n.icon] ? n.icon : CONFIG[n.type].icon; }

/* single source of truth for card width — used by the live canvas AND the PNG export */
function nodeWidth(n) {
  const f = SIZE_FACTOR[n.size] || 1;
  if (CONFIG[n.type].category === "sub") return Math.round(NODE_W.compact * f);
  const d = n.cardDisplay || {};
  const detailed = d.description || d.metadata || d.channels || d.permissions || (d.storage && storageRelevant(n.type)) || childrenOf(n.id).length;
  return Math.round((detailed ? NODE_W.wide : NODE_W.standard) * f);
}

function nestedListHTML(n) {
  const kids = childrenOf(n.id);
  if (!kids.length) return "";
  let h = '<div class="block"><div class="block-label">Contents</div><div class="block-body nested-list">';
  kids.forEach((k) => {
    const ka = accentOf(k);
    const ksel = state.selectedIds.indexOf(k.id) >= 0 ? " sel" : "";
    h += '<div class="nested-item' + ksel + '" data-nid="' + k.id + '" title="Click to edit · drag out via Detach">';
    h += '<span class="ni-chip" style="background:' + ka + '16;color:' + ka + '">' + svg(iconKeyOf(k)) + "</span>";
    h += '<span class="ni-label">' + esc(k.label) + "</span>";
    h += '<span class="ni-type">' + CONFIG[k.type].label + "</span>";
    if (!k.security.inheritsFromParent) h += '<span class="ni-lock" title="Unique permissions">' + svg("lock") + "</span>";
    h += "</div>";
  });
  return h + "</div></div>";
}

function badgeHTML(p, accent) {
  return '<span class="badge" style="color:' + accent + ';border-color:' + accent + '33;background:' + accent + '12"><span class="bp">' + esc(p.principal) + '</span><span class="dot">·</span><span>' + ROLES[p.role] + "</span></span>";
}

function indicatorsHTML(n) {
  const parts = [];
  if (n.sensitivity && SENSITIVITY[n.sensitivity]) { const c = SENSITIVITY[n.sensitivity]; parts.push('<span class="sens-pill" style="color:' + c.color + ";background:" + c.color + "14;border-color:" + c.color + '33"><span class="dot" style="background:' + c.color + '"></span>' + c.label + "</span>"); }
  const ex = n.externalSharing && n.externalSharing !== "inherit" ? EXTERNAL[n.externalSharing] : null;
  if (ex) parts.push('<span class="ext-pill" style="color:' + ex.color + ";background:" + ex.color + "14;border-color:" + ex.color + '33">' + svg(ex.icon) + "<span>" + ex.label + "</span></span>");
  return parts.length ? '<div class="ind-row">' + parts.join("") + "</div>" : "";
}
function storageBlockHTML(n) {
  const d = n.cardDisplay || {};
  if (!d.storage || !storageRelevant(n.type) || !n.storage) return "";
  const rows = [];
  if (n.storage.quota) rows.push(["Quota", n.storage.quota]);
  if (n.storage.items) rows.push(["Items", n.storage.items]);
  if (n.storage.retention) rows.push(["Retention", n.storage.retention]);
  if (!rows.length) return "";
  return '<div class="block"><div class="block-label">Storage</div><div class="block-body">' + rows.map((r) => '<div class="kv"><span class="k">' + r[0] + '</span><span class="v">' + esc(r[1]) + "</span></div>").join("") + "</div></div>";
}

function nodeHTML(n) {
  const cfg = CONFIG[n.type];
  const accent = accentOf(n);
  const compact = cfg.category === "sub";
  const inheriting = n.security.inheritsFromParent;
  const broken = !inheriting && !isRoot(n.type);
  const teamsOn = n.type === "teamSite" && !!n.teamsEnabled;
  const d = n.cardDisplay || {};
  const sel = state.selectedIds.indexOf(n.id) >= 0 ? " selected" : "";
  const styleVars = "--accent:" + accent + ";--sel:" + accent + "33;left:" + n.x + "px;top:" + n.y + "px;width:" + nodeWidth(n) + "px";
  const indicator = '<span class="indicator" title="' + (inheriting ? "Inherits parent permissions" : "Unique permissions") + '">' + svg(inheriting ? "chevronsDown" : "lock") + "</span>";
  const icon = '<span class="nicon" style="background:' + accent + '16;color:' + accent + '">' + svg(iconKeyOf(n)) + "</span>";
  const handles = SIDES.map((s) => '<div class="handle h-' + s + '" data-id="' + n.id + '" data-side="' + s + '"></div>').join("");
  const title = '<div class="title" data-edit-title="' + n.id + '" title="Double-click to rename">' + esc(n.label) + "</div>";

  if (compact) {
    const showBadges = !inheriting && n.security.permissions.length > 0;
    const vis = n.security.permissions.slice(0, 2);
    const over = n.security.permissions.length - vis.length;
    let h = '<div class="node compact' + sel + '" data-id="' + n.id + '" style="' + styleVars + '">';
    h += '<div class="body"><div class="head">' + icon + '<div class="htext"><div class="title-row">' + title + '</div><div class="type">' + cfg.label + "</div></div>" + indicator + "</div></div>";
    h += indicatorsHTML(n);
    if (broken) h += '<div class="banner-broken">' + svg("unlock") + "<span>Inheritance broken</span></div>";
    if (n.notes && n.notes.trim()) h += '<div class="note">' + svg("note") + "<span>" + esc(n.notes) + "</span></div>";
    if (showBadges) { h += '<div class="badges">' + vis.map((p) => badgeHTML(p, accent)).join(""); if (over > 0) h += '<span class="badge-more">+' + over + "</span>"; h += "</div>"; }
    h += handles + "</div>";
    return h;
  }

  const showPerm = d.permissions && n.security.permissions.length > 0;
  const showBadgeRow = !d.permissions && !inheriting && n.security.permissions.length > 0;
  const bvis = n.security.permissions.slice(0, 3);
  const bover = n.security.permissions.length - bvis.length;

  let h = '<div class="node standard' + sel + '" data-id="' + n.id + '" style="' + styleVars + '">';
  h += '<div class="topbar"></div><div class="body">';
  h += '<div class="head">' + icon + '<div class="htext"><div class="title-row">' + title;
  if (teamsOn) h += '<span class="teams-badge" title="Teams-connected" style="background:' + TEAMS_ACCENT + '18;color:' + TEAMS_ACCENT + '">' + svg("messages") + "</span>";
  h += '</div><div class="type">' + cfg.label + (teamsOn ? " · Teams" : "") + "</div></div>" + indicator + "</div>";
  h += indicatorsHTML(n);
  if (broken) h += '<div class="banner-broken">' + svg("unlock") + "<span>Inheritance broken — unique permissions</span></div>";
  if (n.notes && n.notes.trim()) h += '<div class="note">' + svg("note") + "<span>" + esc(n.notes) + "</span></div>";
  if (d.description && n.description) h += '<div class="desc">' + esc(n.description) + "</div>";
  if (d.metadata && n.metadata.length) { h += '<div class="block"><div class="block-label">Metadata</div><div class="block-body">'; h += n.metadata.map((m) => '<div class="kv"><span class="k">' + esc(m.key) + '</span><span class="v">' + esc(m.value || "—") + "</span></div>").join(""); h += "</div></div>"; }
  h += nestedListHTML(n);
  h += storageBlockHTML(n);
  if (d.channels && teamsOn && n.channels.length) {
    h += '<div class="block"><div class="block-label">Channels</div><div class="block-body">';
    h += n.channels.map((c) => '<div class="chan-line"><span class="cn">' + svg("hash") + "<span>" + esc(c.name) + '</span></span><span class="chan-kind" style="color:' + CHANNEL_KINDS[c.kind].color + ";background:" + CHANNEL_KINDS[c.kind].color + '14">' + CHANNEL_KINDS[c.kind].label + "</span></div>").join("");
    h += "</div></div>";
  }
  if (showPerm) { h += '<div class="block"><div class="block-label">Permissions</div><div class="block-body">'; h += n.security.permissions.map((p) => '<div class="perm-line"><span class="who">' + esc(p.principal) + '</span><span class="role">' + ROLES[p.role] + "</span></div>").join(""); h += "</div></div>"; }
  else if (showBadgeRow) { h += '<div class="badges">' + bvis.map((p) => badgeHTML(p, accent)).join(""); if (bover > 0) h += '<span class="badge-more">+' + bover + "</span>"; h += "</div>"; }
  h += "</div>" + handles + "</div>";
  return h;
}

function renderNodes() {
  dom.nodes.innerHTML = state.nodes.filter((n) => !n.parentId).map(nodeHTML).join("");
}

/* ---------- inline title editing (double-click / F2) ---------- */
function startTitleEdit(id) {
  const n = nodeById(id); if (!n) return;
  const el = dom.nodes.querySelector('.title[data-edit-title="' + id + '"]'); if (!el) return;
  const input = document.createElement("input");
  input.className = "title-edit";
  input.value = n.label;
  el.textContent = ""; el.appendChild(input);
  input.focus(); input.select();
  let done = false;
  const commit = (apply) => {
    if (done) return; done = true;
    if (apply && input.value.trim() && input.value !== n.label) {
      mutate(() => { renameNode(n, input.value.trim()); }, { reinspect: true });
    } else { renderNodes(); }
  };
  input.addEventListener("blur", () => commit(true));
  input.addEventListener("keydown", (e) => {
    e.stopPropagation();
    if (e.key === "Enter") { e.preventDefault(); commit(true); }
    else if (e.key === "Escape") { e.preventDefault(); commit(false); }
  });
  input.addEventListener("mousedown", (e) => e.stopPropagation());
}

/* ---------- edges ---------- */
function nodeSize(id) {
  const el = dom.nodes.querySelector('.node[data-id="' + id + '"]');
  return el ? { w: el.offsetWidth, h: el.offsetHeight } : { w: NODE_W.standard, h: 80 };
}
function handlePoint(n, side) {
  const s = nodeSize(n.id);
  if (side === "top") return { x: n.x + s.w / 2, y: n.y, dx: 0, dy: -1 };
  if (side === "bottom") return { x: n.x + s.w / 2, y: n.y + s.h, dx: 0, dy: 1 };
  if (side === "left") return { x: n.x, y: n.y + s.h / 2, dx: -1, dy: 0 };
  return { x: n.x + s.w, y: n.y + s.h / 2, dx: 1, dy: 0 };
}
function edgePath(p1, p2) {
  if (state.settings.edgeStyle === "straight") return "M" + p1.x + "," + p1.y + " L" + p2.x + "," + p2.y;
  const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
  const off = Math.max(40, dist * 0.4);
  const c1x = p1.x + p1.dx * off, c1y = p1.y + p1.dy * off;
  const c2x = p2.x + p2.dx * off, c2y = p2.y + p2.dy * off;
  return "M" + p1.x + "," + p1.y + " C" + c1x + "," + c1y + " " + c2x + "," + c2y + " " + p2.x + "," + p2.y;
}
function redrawEdges() {
  let s = "";
  state.edges.forEach((e) => {
    const a = nodeById(e.source), b = nodeById(e.target);
    if (!a || !b) return;
    const p1 = handlePoint(a, e.sourceHandle || "bottom");
    const p2 = handlePoint(b, e.targetHandle || "top");
    const d = edgePath(p1, p2);
    s += '<path class="hit" data-edge="' + e.id + '" d="' + d + '"/><path d="' + d + '"/>';
  });
  dom.edges.innerHTML = s;
}

/* hit-test a world-space point against the invisible wide "hit" paths */
function edgeAt(p) {
  const paths = dom.edges.querySelectorAll("path.hit");
  for (let i = 0; i < paths.length; i++) {
    try { if (paths[i].isPointInStroke(new DOMPoint(p.x, p.y))) return paths[i].dataset.edge; } catch (err) {}
  }
  return null;
}
function deleteEdge(id) { mutate(() => { state.edges = state.edges.filter((e) => e.id !== id); }); }

/* ---------- transform / view ---------- */
function applyTransform() {
  dom.viewport.style.transform = "translate(" + state.view.x + "px," + state.view.y + "px) scale(" + state.view.k + ")";
  if (dom.zoomLabel) dom.zoomLabel.textContent = Math.round(state.view.k * 100) + "%";
}
function canvasRect() { return dom.canvas.getBoundingClientRect(); }
function screenToWorld(cx, cy) {
  const r = canvasRect();
  return { x: (cx - r.left - state.view.x) / state.view.k, y: (cy - r.top - state.view.y) / state.view.k };
}
function zoomAt(cx, cy, factor) {
  const r = canvasRect();
  const px = cx - r.left, py = cy - r.top;
  const wx = (px - state.view.x) / state.view.k, wy = (py - state.view.y) / state.view.k;
  const k = clamp(state.view.k * factor, 0.2, 2);
  state.view.k = k; state.view.x = px - wx * k; state.view.y = py - wy * k;
  applyTransform();
}
function fitView() {
  const roots = state.nodes.filter((n) => !n.parentId);
  if (!roots.length) return;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  roots.forEach((n) => { const s = nodeSize(n.id); minX = Math.min(minX, n.x); minY = Math.min(minY, n.y); maxX = Math.max(maxX, n.x + s.w); maxY = Math.max(maxY, n.y + s.h); });
  const r = canvasRect(), pad = 60;
  const k = clamp(Math.min((r.width - pad * 2) / (maxX - minX), (r.height - pad * 2) / (maxY - minY)), 0.2, 1.5);
  state.view.k = k;
  state.view.x = (r.width - (maxX - minX) * k) / 2 - minX * k;
  state.view.y = (r.height - (maxY - minY) * k) / 2 - minY * k;
  applyTransform();
}

/* ---------- minimap ---------- */
function drawMinimap() {
  const W = 180, H = 120, pad = 8;
  const roots = state.nodes.filter((n) => !n.parentId);
  if (!roots.length) { dom.minimapSvg.innerHTML = ""; return; }
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const boxes = roots.map((n) => { const s = nodeSize(n.id); minX = Math.min(minX, n.x); minY = Math.min(minY, n.y); maxX = Math.max(maxX, n.x + s.w); maxY = Math.max(maxY, n.y + s.h); return { x: n.x, y: n.y, w: s.w, h: s.h, c: accentOf(n) }; });
  const k = Math.min((W - pad * 2) / Math.max(1, maxX - minX), (H - pad * 2) / Math.max(1, maxY - minY));
  let s = "";
  boxes.forEach((b) => { s += '<rect x="' + (pad + (b.x - minX) * k) + '" y="' + (pad + (b.y - minY) * k) + '" width="' + Math.max(3, b.w * k) + '" height="' + Math.max(3, b.h * k) + '" rx="1.5" fill="' + b.c + '" opacity="0.85"/>'; });
  dom.minimapSvg.innerHTML = s;
}

/* ---------- topbar state ---------- */
function updateTopbar() {
  dom.undoBtn.disabled = state.past.length === 0;
  dom.redoBtn.disabled = state.future.length === 0;
}

/* ---------- presentation mode (customer-facing full screen) ---------- */
let presenting = false;
function setPresent(on) {
  presenting = on;
  dom.app.classList.toggle("presenting", on);
  dom.presentExit.hidden = !on;
  if (on) {
    closeMenu(); closeSettings();
    if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {});
  } else if (document.fullscreenElement && document.exitFullscreen) {
    document.exitFullscreen().catch(() => {});
  }
  requestAnimationFrame(() => { redrawEdges(); fitView(); drawMinimap(); });
}

/* ===================== inspector ===================== */
function renderInspector() {
  if (state.selectedAnno) { renderAnnoInspector(); return; }
  if (state.selectedIds.length > 1) { renderBulkInspector(); return; }
  const n = nodeById(state.selectedId);
  if (!n) {
    dom.inspector.innerHTML = '<div class="insp-empty">' + svg("cursor") + '<div class="t">Nothing selected</div><div class="d">Select a node to edit its details, governance and security. Double-click a node title to rename it.</div></div>';
    return;
  }
  const cfg = CONFIG[n.type];
  const accent = accentOf(n);
  const isTeamSite = n.type === "teamSite";
  const teamsOn = isTeamSite && !!n.teamsEnabled;
  const d = n.cardDisplay || {};
  const activeIcon = iconKeyOf(n);
  const known = knownPrincipals();

  let h = "";
  h += '<div class="insp-head"><div class="tag"><span class="bar" style="background:' + accent + '"></span><h2>' + cfg.label + '</h2></div><button class="insp-del" data-act="delete">' + svg("trash") + "Delete</button></div>";
  h += '<div class="insp-body">';

  if (n.parentId) {
    const parent = nodeById(n.parentId);
    h += '<div class="nested-note">' + svg("folder") + '<span>Inside <b>' + esc(parent ? parent.label : "?") + '</b></span><button class="add-btn" data-act="detach">Detach</button></div>';
  }

  h += field("Name", '<input class="input" data-field="label" value="' + esc(n.label) + '">');
  let typeOpts = "";
  PALETTE.forEach((g) => g.types.forEach((t) => { typeOpts += '<option value="' + t + '"' + (t === n.type ? " selected" : "") + ">" + CONFIG[t].label + "</option>"; }));
  h += field("Type", '<select class="input" data-field="type">' + typeOpts + "</select>");
  h += field("Description", '<textarea class="input" rows="2" data-field="description" placeholder="What is this object for?">' + esc(n.description) + "</textarea>");
  h += field("Note (informational, shown on card)", '<textarea class="input" rows="2" data-field="notes" placeholder="A neutral note rendered on the node…">' + esc(n.notes) + "</textarea>");

  if (isTeamSite) {
    let t = sectionHead("Microsoft Teams");
    t += '<label class="toggle-row"><span class="lbl">' + svg("messages") + " Teams-connected</span>" + switchHTML(teamsOn, "teamsEnabled") + "</label>";
    if (teamsOn) {
      t += '<div class="section-head"><span class="mini-label">Channels</span><button class="add-btn" data-act="add-channel">' + svg("plus") + "Add</button></div>";
      if (!n.channels.length) t += '<p class="muted-empty">No channels yet.</p>';
      n.channels.forEach((c) => {
        t += '<div class="chan-row">' + svg("hash") + '<input class="input" data-channel="' + c.id + '" data-ckey="name" value="' + esc(c.name) + '" placeholder="Channel name">';
        t += '<select class="input w24" data-channel="' + c.id + '" data-ckey="kind" style="color:' + CHANNEL_KINDS[c.kind].color + '">' + CHANNEL_ORDER.map((k) => '<option value="' + k + '"' + (k === c.kind ? " selected" : "") + ">" + CHANNEL_KINDS[k].label + "</option>").join("") + "</select>";
        t += '<button class="row-del" data-del-channel="' + c.id + '">' + svg("trash") + "</button></div>";
      });
    }
    h += section(t);
  }

  let sc = sectionHead("Show on card");
  sc += checkRow("Description", !!d.description, "description");
  sc += checkRow("Metadata", !!d.metadata, "metadata");
  if (teamsOn) sc += checkRow("Channels", !!d.channels, "channels");
  sc += checkRow("Permissions", !!d.permissions, "permissions");
  if (storageRelevant(n.type)) sc += checkRow("Storage", !!d.storage, "storage");
  h += section(sc);

  let gv = sectionHead("Governance");
  gv += field("Sensitivity label", '<select class="input" data-gov="sensitivity"><option value="">None</option>' + SENS_ORDER.map((k) => '<option value="' + k + '"' + (n.sensitivity === k ? " selected" : "") + ">" + SENSITIVITY[k].label + "</option>").join("") + "</select>");
  gv += field("External sharing", '<select class="input" data-gov="externalSharing">' + [["inherit", "Inherit / default"], ["enabled", "Enabled"], ["blocked", "Blocked"]].map((o) => '<option value="' + o[0] + '"' + ((n.externalSharing || "inherit") === o[0] ? " selected" : "") + ">" + o[1] + "</option>").join("") + "</select>");
  h += section(gv);

  let ap = sectionHead("Appearance");
  ap += '<div><p class="mini-label" style="margin:0 0 6px">Color</p><div class="swatches">';
  COLORS.forEach((c) => { const seld = (n.color || cfg.accent) === c; ap += '<button class="swatch" data-color="' + c + '" style="background:' + c + (seld ? ";outline:2px solid " + c + "55;outline-offset:2px" : "") + '">' + (seld ? svg("check") : "") + "</button>"; });
  ap += '<button class="swatch reset" data-color="__reset" title="Reset color">' + svg("refresh") + "</button></div></div>";
  ap += '<div><p class="mini-label" style="margin:0 0 6px">Size</p><div class="size-row">' +
    [["s", "Small"], ["m", "Normal"], ["l", "Large"]].map((o) => '<button class="size-btn' + ((n.size || "m") === o[0] ? " act" : "") + '" data-size="' + o[0] + '">' + o[1] + "</button>").join("") + "</div></div>";
  ap += '<div><p class="mini-label" style="margin:0 0 6px">Icon</p><div class="icon-grid">';
  ICON_KEYS.forEach((k) => { const seld = activeIcon === k; ap += '<button class="icon-pick" data-icon-key="' + k + '" style="' + (seld ? "border-color:" + accent + ";background:" + accent + "14;color:" + accent : "") + '">' + svg(k) + "</button>"; });
  ap += "</div></div>";
  h += section(ap);

  let md = '<div class="section-head"><h3>Metadata</h3><button class="add-btn" data-act="add-metadata">' + svg("plus") + "Add</button></div>";
  if (!n.metadata.length) md += '<p class="muted-empty">No metadata fields.</p>';
  n.metadata.forEach((m) => {
    md += '<div class="row"><input class="input" data-meta="' + m.id + '" data-mkey="key" value="' + esc(m.key) + '" placeholder="Key"><input class="input" data-meta="' + m.id + '" data-mkey="value" value="' + esc(m.value) + '" placeholder="Value"><button class="row-del" data-del-meta="' + m.id + '">' + svg("trash") + "</button></div>";
  });
  h += section(md);

  if (storageRelevant(n.type)) {
    const sg = n.storage || { quota: "", items: "", retention: "" };
    let st = sectionHead("Storage & retention");
    st += field("Storage quota", '<input class="input" data-storage="quota" value="' + esc(sg.quota) + '" placeholder="e.g. 100 GB">');
    st += field("Item count", '<input class="input" data-storage="items" value="' + esc(sg.items) + '" placeholder="e.g. 12,400">');
    st += field("Retention", '<input class="input" data-storage="retention" value="' + esc(sg.retention) + '" placeholder="e.g. 7 years">');
    h += section(st);
  }

  let se = sectionHead("Security");
  se += '<label class="toggle-row"><span class="lbl">Inherit from parent</span>' + switchHTML(n.security.inheritsFromParent, "inherit") + "</label>";
  if (!n.security.inheritsFromParent && !isRoot(n.type)) se += '<p class="broken-note">Inheritance broken — this node uses unique permissions.</p>';
  se += '<div class="section-head"><span class="mini-label">Permissions</span><div class="row">';
  if (isRoot(n.type)) se += '<button class="add-btn" data-act="default-groups" title="Owners / Members / Visitors">Default groups</button>';
  se += '<button class="add-btn" data-act="add-perm">' + svg("plus") + "Add</button></div></div>";
  se += '<select class="input" data-act="add-existing"><option value="">+ Add existing group…</option>' + known.map((p) => '<option value="' + esc(p) + '">' + esc(p) + "</option>").join("") + "</select>";
  const permSources = state.nodes.filter((o) => o.id !== n.id && o.security.permissions.length);
  se += '<div class="row">';
  se += '<select class="input" data-act="set-all-roles"' + (n.security.permissions.length ? "" : " disabled") + '><option value="">Set all to…</option>' + ROLE_ORDER.map((r) => '<option value="' + r + '">' + ROLE_FULL[r] + "</option>").join("") + "</select>";
  se += '<select class="input" data-act="copy-perms"' + (permSources.length ? "" : " disabled") + '><option value="">Copy from…</option>' + permSources.map((o) => '<option value="' + o.id + '">' + esc(o.label) + "</option>").join("") + "</select>";
  se += "</div>";
  if (!n.security.permissions.length) se += '<p class="muted-empty">No explicit permissions.</p>';
  n.security.permissions.forEach((p) => {
    se += '<div class="perm-card"><div class="row"><input class="input" data-perm="' + p.id + '" data-pkey="principal" list="known-principals" value="' + esc(p.principal) + '" placeholder="User / group"><button class="row-del" data-del-perm="' + p.id + '">' + svg("trash") + '</button></div><div class="row"><select class="input w24" data-perm="' + p.id + '" data-pkey="principalType"><option value="group"' + (p.principalType === "group" ? " selected" : "") + '>Group</option><option value="user"' + (p.principalType === "user" ? " selected" : "") + '>User</option></select><select class="input" data-perm="' + p.id + '" data-pkey="role">' + ROLE_ORDER.map((r) => '<option value="' + r + '"' + (r === p.role ? " selected" : "") + ">" + ROLE_FULL[r] + "</option>").join("") + "</select></div></div>";
  });
  h += section(se);

  h += "</div>";
  h += '<datalist id="known-principals">' + known.map((p) => '<option value="' + esc(p) + '">').join("") + "</datalist>";
  dom.inspector.innerHTML = h;
  bindInspector(n);
}

function renderAnnoInspector() {
  const a = annoById(state.selectedAnno); if (!a) { state.selectedAnno = null; return renderInspector(); }
  const title = a.kind === "frame" ? "Frame" : a.kind === "text" ? "Text" : a.icon.charAt(0).toUpperCase() + a.icon.slice(1) + " icon";
  let h = '<div class="insp-head"><div class="tag"><span class="bar" style="background:' + a.color + '"></span><h2>' + title + '</h2></div><button class="insp-del" data-annodel>' + svg("trash") + "Delete</button></div>";
  h += '<div class="insp-body">';
  if (a.kind === "frame") h += field("Label", '<input class="input" data-annofield="label" value="' + esc(a.label || "") + '">');
  if (a.kind === "text") { h += field("Text", '<textarea class="input" rows="3" data-annofield="text">' + esc(a.text) + "</textarea>"); h += field("Font size", '<input class="input" type="number" min="8" max="96" data-annofield="size" value="' + a.size + '">'); }
  if (a.kind === "icon") h += field("Size", '<input class="input" type="number" min="16" max="160" data-annofield="size" value="' + a.size + '">');
  let cl = sectionHead("Color") + '<div class="swatches">';
  COLORS.forEach((c) => { cl += '<button class="swatch" data-annocolor="' + c + '" style="background:' + c + (a.color === c ? ";outline:2px solid " + c + "55;outline-offset:2px" : "") + '">' + (a.color === c ? svg("check") : "") + "</button>"; });
  cl += '</div><input type="color" class="color-input" data-annocolorpick value="' + a.color + '" style="margin-top:8px">';
  h += section(cl) + "</div>";
  dom.inspector.innerHTML = h;
  const root = dom.inspector;
  root.querySelector("[data-annodel]").addEventListener("click", () => deleteAnno(a.id));
  root.querySelectorAll("[data-annofield]").forEach((el) => el.addEventListener("input", () => updateAnno(a.id, defineProp(el.dataset.annofield, el.type === "number" ? Number(el.value) : el.value))));
  root.querySelectorAll("[data-annocolor]").forEach((el) => el.addEventListener("click", () => { updateAnno(a.id, { color: el.dataset.annocolor }); renderInspector(); }));
  const cp = root.querySelector("[data-annocolorpick]"); if (cp) cp.addEventListener("input", () => updateAnno(a.id, { color: cp.value }));
}
function defineProp(k, v) { const o = {}; o[k] = v; return o; }

function renderBulkInspector() {
  const count = state.selectedIds.length;
  let h = '<div class="insp-head"><div class="tag"><span class="bar" style="background:var(--accent)"></span><h2>' + count + ' nodes selected</h2></div><button class="insp-del" data-bulk="delete">' + svg("trash") + "Delete</button></div>";
  h += '<div class="insp-body">';
  let cl = sectionHead("Color (all)") + '<div class="swatches">';
  COLORS.forEach((c) => { cl += '<button class="swatch" data-bulkcolor="' + c + '" style="background:' + c + '"></button>'; });
  cl += '<button class="swatch reset" data-bulkcolor="__reset" title="Reset color">' + svg("refresh") + "</button></div>";
  h += section(cl);
  let sn = sectionHead("Sensitivity (all)") + '<select class="input" data-bulksens><option value="">— set for all —</option><option value="__none">None</option>' + SENS_ORDER.map((k) => '<option value="' + k + '">' + SENSITIVITY[k].label + "</option>").join("") + "</select>";
  h += section(sn);
  let inh = sectionHead("Inheritance (all)") + '<div class="bulk-actions"><button class="bulk-btn" data-bulkinh="true">' + svg("chevronsDown") + 'Inherit</button><button class="bulk-btn" data-bulkinh="false">' + svg("unlock") + "Break</button></div>";
  h += section(inh);
  let al = sectionHead("Align & distribute") + '<div class="bulk-actions">' +
    '<button class="bulk-btn" data-align="left">Align left</button>' +
    '<button class="bulk-btn" data-align="top">Align top</button>' +
    '<button class="bulk-btn" data-align="centerX">Center horiz.</button>' +
    '<button class="bulk-btn" data-align="centerY">Center vert.</button>' +
    '<button class="bulk-btn" data-dist="x">Distribute H</button>' +
    '<button class="bulk-btn" data-dist="y">Distribute V</button></div>';
  h += section(al);
  h += "</div>";
  dom.inspector.innerHTML = h;
  const root = dom.inspector;
  root.querySelector('[data-bulk="delete"]').addEventListener("click", () => deleteNodes(state.selectedIds.slice()));
  root.querySelectorAll("[data-bulkcolor]").forEach((el) => el.addEventListener("click", () => { const c = el.dataset.bulkcolor; bulkSet((n) => { n.color = c === "__reset" ? null : c; }); }));
  root.querySelector("[data-bulksens]").addEventListener("change", (e) => { const v = e.target.value; if (!v) return; bulkSet((n) => { n.sensitivity = v === "__none" ? null : v; }); });
  root.querySelectorAll("[data-bulkinh]").forEach((el) => el.addEventListener("click", () => { const v = el.dataset.bulkinh === "true"; bulkSet((n) => { n.security.inheritsFromParent = v; }); }));
  root.querySelectorAll("[data-align]").forEach((el) => el.addEventListener("click", () => alignNodes(el.dataset.align)));
  root.querySelectorAll("[data-dist]").forEach((el) => el.addEventListener("click", () => distributeNodes(el.dataset.dist)));
}

function field(label, inner) { return '<div class="field"><label>' + label + "</label>" + inner + "</div>"; }
function section(inner) { return '<div class="section">' + inner + "</div>"; }
function sectionHead(t) { return '<div class="section-head"><h3>' + t + "</h3></div>"; }
function switchHTML(on, key) { return '<button class="switch' + (on ? " on" : "") + '" data-switch="' + key + '"><span class="knob"></span></button>'; }
function checkRow(label, on, key) { return '<label class="toggle-row"><span class="lbl">' + label + "</span>" + switchHTML(on, "display:" + key) + "</label>"; }

/* ---------- inspector bindings ---------- */
function bindInspector(n) {
  const root = dom.inspector;
  // text inputs (coalesced, no re-render to preserve focus)
  root.querySelectorAll("[data-field]").forEach((el) => {
    const f = el.dataset.field;
    if (f === "type") {
      el.addEventListener("change", () => mutate(() => {
        n.type = el.value;
        // a nested node that becomes a container pops back onto the canvas
        if (n.parentId && CONFIG[n.type].category !== "sub") {
          const p = nodeById(n.parentId); n.parentId = null;
          if (p) { n.x = snap(p.x + 24); n.y = snap(p.y + 200); }
        }
      }, { reinspect: true }));
    } else if (f === "label") {
      el.addEventListener("input", () => mutate(() => { renameNode(n, el.value); }, { coalesce: true }));
    } else {
      el.addEventListener("input", () => mutate(() => { n[f] = el.value; }, { coalesce: true }));
    }
  });
  // switches
  root.querySelectorAll("[data-switch]").forEach((el) => el.addEventListener("click", () => {
    const key = el.dataset.switch;
    mutate(() => {
      if (key === "inherit") n.security.inheritsFromParent = !n.security.inheritsFromParent;
      else if (key === "teamsEnabled") { n.teamsEnabled = !n.teamsEnabled; if (!n.channels) n.channels = []; }
      else if (key.indexOf("display:") === 0) { const dk = key.split(":")[1]; n.cardDisplay = n.cardDisplay || {}; n.cardDisplay[dk] = !n.cardDisplay[dk]; }
    }, { reinspect: true });
  }));
  // actions
  root.querySelectorAll("[data-act]").forEach((el) => {
    const act = el.dataset.act;
    if (el.tagName === "SELECT") {
      el.addEventListener("change", () => {
        const v = el.value; if (!v) return;
        if (act === "add-existing") mutate(() => { n.security.permissions.push({ id: uid(), principal: v, principalType: "group", role: "read" }); }, { reinspect: true });
        else if (act === "set-all-roles") mutate(() => { n.security.permissions.forEach((p) => { p.role = v; }); }, { reinspect: true });
        else if (act === "copy-perms") {
          const src = nodeById(v);
          if (src) mutate(() => {
            n.security.permissions = clone(src.security.permissions).map((p) => ({ ...p, id: uid() }));
            if (!isRoot(n.type)) n.security.inheritsFromParent = false;
          }, { reinspect: true });
        }
      });
      return;
    }
    el.addEventListener("click", () => {
      if (act === "delete") { deleteNode(n.id); return; }
      if (act === "detach") { detachNode(n.id); return; }
      mutate(() => {
        if (act === "add-metadata") n.metadata.push({ id: uid(), key: "Key", value: "" });
        else if (act === "add-perm") n.security.permissions.push({ id: uid(), principal: "New Group", principalType: "group", role: "read" });
        else if (act === "default-groups") n.security.permissions = defaultSiteGroups(n.label);
        else if (act === "add-channel") { n.channels = n.channels || []; n.channels.push({ id: uid(), name: "New channel", kind: "standard" }); }
      }, { reinspect: true });
    });
  });
  // metadata fields
  root.querySelectorAll("[data-meta]").forEach((el) => el.addEventListener("input", () => {
    const m = n.metadata.find((x) => x.id === el.dataset.meta); if (!m) return;
    mutate(() => { m[el.dataset.mkey] = el.value; }, { coalesce: true });
  }));
  root.querySelectorAll("[data-del-meta]").forEach((el) => el.addEventListener("click", () => mutate(() => { n.metadata = n.metadata.filter((x) => x.id !== el.dataset.delMeta); }, { reinspect: true })));
  // permissions
  root.querySelectorAll("[data-perm]").forEach((el) => {
    const p = n.security.permissions.find((x) => x.id === el.dataset.perm); if (!p) return;
    const ev = el.tagName === "SELECT" ? "change" : "input";
    el.addEventListener(ev, () => mutate(() => { p[el.dataset.pkey] = el.value; }, { coalesce: ev === "input" }));
  });
  root.querySelectorAll("[data-del-perm]").forEach((el) => el.addEventListener("click", () => mutate(() => { n.security.permissions = n.security.permissions.filter((x) => x.id !== el.dataset.delPerm); }, { reinspect: true })));
  // channels
  root.querySelectorAll("[data-channel]").forEach((el) => {
    const c = n.channels.find((x) => x.id === el.dataset.channel); if (!c) return;
    const ev = el.tagName === "SELECT" ? "change" : "input";
    el.addEventListener(ev, () => mutate(() => { c[el.dataset.ckey] = el.value; }, { coalesce: ev === "input", reinspect: ev === "change" }));
  });
  root.querySelectorAll("[data-del-channel]").forEach((el) => el.addEventListener("click", () => mutate(() => { n.channels = n.channels.filter((x) => x.id !== el.dataset.delChannel); }, { reinspect: true })));
  // color / icon / size
  root.querySelectorAll("[data-size]").forEach((el) => el.addEventListener("click", () => mutate(() => { n.size = el.dataset.size === "m" ? null : el.dataset.size; }, { reinspect: true })));
  root.querySelectorAll("[data-color]").forEach((el) => el.addEventListener("click", () => mutate(() => { n.color = el.dataset.color === "__reset" ? null : el.dataset.color; }, { reinspect: true })));
  root.querySelectorAll("[data-icon-key]").forEach((el) => el.addEventListener("click", () => mutate(() => { n.icon = el.dataset.iconKey; }, { reinspect: true })));
  // governance
  root.querySelectorAll("[data-gov]").forEach((el) => el.addEventListener("change", () => mutate(() => { const g = el.dataset.gov; n[g] = el.value || (g === "sensitivity" ? null : "inherit"); }, {})));
  // storage
  root.querySelectorAll("[data-storage]").forEach((el) => el.addEventListener("input", () => mutate(() => { if (!n.storage) n.storage = { quota: "", items: "", retention: "" }; n.storage[el.dataset.storage] = el.value; }, { coalesce: true })));
}

/* ===================== palette ===================== */
function renderPalette(filter) {
  const q = (filter || "").trim().toLowerCase();
  const match = (label) => !q || label.toLowerCase().indexOf(q) >= 0;
  let h = "";
  PALETTE.forEach((g) => {
    const types = g.types.filter((t) => match(CONFIG[t].label));
    if (!types.length) return;
    h += '<div class="palette-group"><div class="group-title">' + g.title + "</div>";
    types.forEach((t) => {
      const cfg = CONFIG[t], sub = cfg.category === "sub";
      h += '<div class="palette-item' + (sub ? " sub" : "") + '" draggable="true" data-type="' + t + '">';
      h += '<span class="chip" style="background:' + cfg.accent + "16;color:" + cfg.accent + '">' + svg(cfg.icon) + "</span>";
      h += '<div class="pi-text"><div class="pi-title">' + cfg.label + "</div>" + (sub ? "" : '<div class="pi-desc">' + cfg.desc + "</div>") + "</div></div>";
    });
    h += "</div>";
  });
  const annos = ANNO_PALETTE.filter((a) => match(a.label));
  if (annos.length) {
    h += '<div class="palette-group"><div class="group-title">Annotations</div>';
    annos.forEach((a) => {
      h += '<div class="palette-item sub" draggable="true" data-type="anno:' + a.kind + '">';
      h += '<span class="chip" style="background:#9aa3af16;color:#6b7280">' + svg(a.icon) + "</span>";
      h += '<div class="pi-text"><div class="pi-title">' + a.label + "</div></div></div>";
    });
    h += "</div>";
  }
  if (!h) h = '<p class="muted-empty" style="padding:4px 6px">No blocks match.</p>';
  dom.palette.innerHTML = h;
  dom.palette.querySelectorAll(".palette-item").forEach((el) => el.addEventListener("dragstart", (e) => e.dataTransfer.setData("text/type", el.dataset.type)));
}

/* ===================== context menu ===================== */
let menuOpen = false;
function closeMenu() { menuOpen = false; dom.menu.hidden = true; dom.menu.innerHTML = ""; const b = document.getElementById("cm-backdrop"); if (b) b.remove(); }
function openMenu(kind, sx, sy, nodeId, flow) {
  closeMenu();
  const back = document.createElement("div"); back.id = "cm-backdrop";
  back.addEventListener("mousedown", closeMenu);
  back.addEventListener("contextmenu", (e) => { e.preventDefault(); closeMenu(); });
  document.body.appendChild(back);
  dom.menu.innerHTML = kind === "node" ? nodeMenuHTML(nodeById(nodeId)) : kind === "edge" ? edgeMenuHTML() : paneMenuHTML();
  dom.menu.hidden = false; menuOpen = true;
  const mw = 224, mh = dom.menu.offsetHeight || 360;
  dom.menu.style.left = Math.min(sx, window.innerWidth - mw - 8) + "px";
  dom.menu.style.top = Math.min(sy, window.innerHeight - mh - 8) + "px";
  bindMenu(kind, nodeId, flow);
}
function mItem(act, icon, label, hint, danger, disabled) {
  return '<button class="cm-item' + (danger ? " danger" : "") + '" data-m="' + act + '"' + (disabled ? " disabled" : "") + ">" + svg(icon) + "<span>" + label + "</span>" + (hint ? '<span class="hint">' + hint + "</span>" : "") + "</button>";
}
function nodeMenuHTML(n) {
  if (!n) return "";
  let h = '<div class="cm-swatches">';
  COLORS.forEach((c) => { h += '<button data-color="' + c + '" style="background:' + c + '"></button>'; });
  h += "</div><div class='cm-divider'></div>";
  h += mItem("rename", "pencil", "Rename", "F2");
  if (n.parentId) h += mItem("detach", "upload", "Detach from parent");
  if (CONFIG[n.type].category !== "sub") {
    h += '<div class="cm-label">Add child (connected)</div><div class="cm-grid">';
    CHILD_TYPES.forEach((t) => { h += '<button data-child="' + t + '"><span class="dot" style="background:' + CONFIG[t].accent + '"></span>' + CONFIG[t].label.replace("Document ", "Doc. ") + "</button>"; });
    h += '</div><div class="cm-label">Add inside (nested)</div><div class="cm-grid">';
    SUB_CHILD_TYPES.forEach((t) => { h += '<button data-childin="' + t + '"><span class="dot" style="background:' + CONFIG[t].accent + '"></span>' + CONFIG[t].label.replace("Document ", "Doc. ") + "</button>"; });
    h += "</div>";
  }
  h += "<div class='cm-divider'></div>";
  if (n.type === "teamSite") h += mItem("teams", "messages", n.teamsEnabled ? "Remove Teams" : "Add Teams");
  h += mItem("inherit", n.security.inheritsFromParent ? "unlock" : "lock", n.security.inheritsFromParent ? "Break inheritance" : "Restore inheritance");
  if (isRoot(n.type)) h += mItem("default-groups", "users", "Reset default groups");
  h += "<div class='cm-divider'></div>";
  h += mItem("duplicate", "copy", "Duplicate", "Ctrl+D") + mItem("copy", "copy", "Copy", "Ctrl+C") + mItem("cut", "scissors", "Cut", "Ctrl+X");
  h += "<div class='cm-divider'></div>" + mItem("delete", "trash", "Delete", "Del", true);
  return h;
}
function edgeMenuHTML() {
  return '<div class="cm-label">Connection</div>' + mItem("delete-edge", "trash", "Delete connection", null, true);
}
function paneMenuHTML() {
  let h = '<div class="cm-label">Add node</div><div class="cm-grid">';
  PALETTE.forEach((g) => g.types.forEach((t) => { h += '<button data-add="' + t + '"><span class="dot" style="background:' + CONFIG[t].accent + '"></span>' + CONFIG[t].label.replace("Document ", "Doc. ").replace("Communication", "Comm.").replace("OneNote Notebook", "OneNote") + "</button>"; }));
  h += "</div><div class='cm-divider'></div>";
  h += mItem("paste", "clipboard", "Paste here", "Ctrl+V", false, !state.clipboard);
  h += mItem("tidy", "wand", "Tidy layout") + mItem("fit", "maximize", "Fit to view");
  return h;
}
function bindMenu(kind, nodeId, flow) {
  dom.menu.querySelectorAll("[data-color]").forEach((el) => el.addEventListener("click", () => { mutate(() => { nodeById(nodeId).color = el.dataset.color; }, { reinspect: true }); closeMenu(); }));
  dom.menu.querySelectorAll("[data-child]").forEach((el) => el.addEventListener("click", () => { addChild(nodeId, el.dataset.child); closeMenu(); }));
  dom.menu.querySelectorAll("[data-childin]").forEach((el) => el.addEventListener("click", () => { addNestedChild(nodeId, el.dataset.childin); closeMenu(); }));
  dom.menu.querySelectorAll("[data-add]").forEach((el) => el.addEventListener("click", () => { addNodeAt(el.dataset.add, flow); closeMenu(); }));
  dom.menu.querySelectorAll("[data-m]").forEach((el) => el.addEventListener("click", () => {
    const a = el.dataset.m, n = nodeById(nodeId);
    if (a === "delete-edge") { deleteEdge(nodeId); closeMenu(); return; } // nodeId carries the edge id here
    if (a === "rename") { closeMenu(); startTitleEdit(nodeId); return; }
    if (a === "detach") { closeMenu(); detachNode(nodeId); return; }
    if (a === "teams") mutate(() => { n.teamsEnabled = !n.teamsEnabled; if (!n.channels) n.channels = []; }, { reinspect: true });
    else if (a === "inherit") mutate(() => { n.security.inheritsFromParent = !n.security.inheritsFromParent; }, { reinspect: true });
    else if (a === "default-groups") mutate(() => { n.security.permissions = defaultSiteGroups(n.label); }, { reinspect: true });
    else if (a === "duplicate") duplicateNode(nodeId);
    else if (a === "copy") copyNode(nodeId);
    else if (a === "cut") cutNode(nodeId);
    else if (a === "delete") deleteNode(nodeId);
    else if (a === "paste") pasteNode(flow);
    else if (a === "tidy") tidyLayout();
    else if (a === "fit") fitView();
    closeMenu();
  }));
}

/* ===================== settings popover ===================== */
function closeSettings() { const p = document.getElementById("settings-panel"); if (p) p.remove(); const b = document.getElementById("settings-backdrop"); if (b) b.remove(); }
function openSettings(anchor) {
  if (document.getElementById("settings-panel")) { closeSettings(); return; }
  const back = document.createElement("div"); back.id = "settings-backdrop";
  back.addEventListener("mousedown", closeSettings);
  document.body.appendChild(back);
  const s = state.settings;
  const panel = document.createElement("div"); panel.id = "settings-panel"; panel.className = "settings-panel";
  panel.innerHTML =
    "<h4>Canvas</h4>" +
    '<div class="settings-row"><span>Snap to grid</span>' + switchHTML(s.snap, "set:snap") + "</div>" +
    '<div class="settings-row"><span>Grid size</span><select class="input" data-set="grid">' +
      [12, 16, 20, 24, 32].map((g) => '<option value="' + g + '"' + (g === s.grid ? " selected" : "") + ">" + g + " px</option>").join("") + "</select></div>" +
    '<div class="settings-row"><span>Show grid</span>' + switchHTML(s.showGrid, "set:showGrid") + "</div>" +
    '<div class="settings-row"><span>Show minimap</span>' + switchHTML(s.showMinimap, "set:showMinimap") + "</div>" +
    '<h4 style="margin-top:12px">Connections</h4>' +
    '<div class="settings-row"><span>Line style</span><select class="input" data-set="edgeStyle">' +
      [["curved", "Curved"], ["straight", "Straight"]].map((o) => '<option value="' + o[0] + '"' + (o[0] === s.edgeStyle ? " selected" : "") + ">" + o[1] + "</option>").join("") + "</select></div>" +
    '<div class="settings-row"><span>Line thickness</span><select class="input" data-set="edgeWidth">' +
      [["1", "Thin"], ["1.5", "Normal"], ["2.5", "Medium"], ["4", "Thick"]].map((o) => '<option value="' + o[0] + '"' + (Number(o[0]) === s.edgeWidth ? " selected" : "") + ">" + o[1] + "</option>").join("") + "</select></div>" +
    '<div class="settings-row"><span>Line color</span><input type="color" class="color-input" data-set="edgeColor" value="' + (s.edgeColor || "#c2c7d0") + '"></div>' +
    '<h4 style="margin-top:12px">Export</h4>' +
    '<div class="settings-row"><span>Header (name + logo)</span>' + switchHTML(s.exportHeader !== false, "set:exportHeader") + "</div>" +
    '<div class="settings-row"><span>Legend (node types)</span>' + switchHTML(s.exportLegend !== false, "set:exportLegend") + "</div>" +
    '<div class="settings-row"><span>Scale</span><select class="input" data-set="exportScale">' +
      [[1, "1× "], [2, "2× (sharp)"], [3, "3× (print)"]].map((o) => '<option value="' + o[0] + '"' + (Number(o[0]) === (s.exportScale || 2) ? " selected" : "") + ">" + o[1] + "</option>").join("") + "</select></div>" +
    '<div class="settings-row"><span>Background</span><input type="color" class="color-input" data-set="exportBg" value="' + (s.exportBg || "#f6f7f9") + '"></div>' +
    '<div class="settings-row" style="display:block"><span style="display:block;margin-bottom:4px">Description (export header)</span><textarea class="input" rows="2" data-doc="description" placeholder="Shown top-left of the exported image…">' + esc(state.docDescription) + "</textarea></div>" +
    '<div class="settings-row"><span>Logo (top-right)</span><div style="display:flex;gap:6px"><button class="add-btn" data-logo-pick>' + (s.logo ? "Change" : "Upload") + "</button>" + (s.logo ? '<button class="add-btn" data-logo-clear>Remove</button>' : "") + "</div></div>" +
    '<input type="file" accept="image/*" data-logo-file hidden>';
  document.body.appendChild(panel);
  const r = anchor.getBoundingClientRect();
  panel.style.top = r.bottom + 8 + "px";
  panel.style.left = Math.min(r.left, window.innerWidth - 264) + "px";

  panel.querySelectorAll("[data-switch]").forEach((el) => el.addEventListener("click", () => {
    const key = el.dataset.switch.split(":")[1];
    state.settings[key] = !state.settings[key];
    el.classList.toggle("on");
    saveSettings(); applySettings(); drawMinimap();
  }));
  panel.querySelector("[data-set=grid]").addEventListener("change", (e) => { state.settings.grid = Number(e.target.value); saveSettings(); applySettings(); });
  panel.querySelector("[data-set=edgeStyle]").addEventListener("change", (e) => { state.settings.edgeStyle = e.target.value; saveSettings(); redrawEdges(); });
  panel.querySelector("[data-set=edgeWidth]").addEventListener("change", (e) => { state.settings.edgeWidth = Number(e.target.value); saveSettings(); applySettings(); });
  panel.querySelector("[data-set=edgeColor]").addEventListener("input", (e) => { state.settings.edgeColor = e.target.value; saveSettings(); applySettings(); });
  panel.querySelector("[data-set=exportScale]").addEventListener("change", (e) => { state.settings.exportScale = Number(e.target.value); saveSettings(); });
  panel.querySelector("[data-set=exportBg]").addEventListener("input", (e) => { state.settings.exportBg = e.target.value; saveSettings(); });
  panel.querySelector("[data-doc=description]").addEventListener("input", (e) => { state.docDescription = e.target.value; save(); });
  const fileEl = panel.querySelector("[data-logo-file]");
  panel.querySelector("[data-logo-pick]").addEventListener("click", () => fileEl.click());
  fileEl.addEventListener("change", () => {
    const f = fileEl.files[0]; if (!f) return;
    const r2 = new FileReader();
    r2.onload = () => { state.settings.logo = r2.result; saveSettings(); closeSettings(); openSettings(anchor); };
    r2.readAsDataURL(f);
  });
  const clr = panel.querySelector("[data-logo-clear]");
  if (clr) clr.addEventListener("click", () => { state.settings.logo = null; saveSettings(); closeSettings(); openSettings(anchor); });
}
