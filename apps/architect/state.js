/* ===== SharePoint Architect — state, history, persistence & document ops ===== */
"use strict";

/* ---------- helpers ---------- */
const uid = () => Math.random().toString(36).slice(2, 10);
const clone = (o) => JSON.parse(JSON.stringify(o));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const $ = (sel, root) => (root || document).querySelector(sel);

/* DOM refs — populated in init() (main.js). Every dom.X used anywhere MUST be set there. */
let dom = {};

function defaultGroupNames(label) {
  return [label + " Owners", label + " Members", label + " Visitors"];
}
function defaultSiteGroups(label) {
  return [
    { id: uid(), principal: label + " Owners", principalType: "group", role: "owner" },
    { id: uid(), principal: label + " Members", principalType: "group", role: "contribute" },
    { id: uid(), principal: label + " Visitors", principalType: "group", role: "read" },
  ];
}
function createNode(type, x, y) {
  const label = CONFIG[type].label;
  const root = isRoot(type);
  return {
    id: uid(), type: type, x: snap(x), y: snap(y), label: label, description: "", notes: "",
    parentId: null, size: null,
    teamsEnabled: false, channels: [], cardDisplay: {}, icon: null, color: null, metadata: [],
    sensitivity: null, externalSharing: "inherit", storage: { quota: "", items: "", retention: "" },
    security: root ? { inheritsFromParent: false, permissions: defaultSiteGroups(label) } : { inheritsFromParent: true, permissions: [] },
  };
}
function regenIds(n) {
  const c = clone(n);
  c.id = uid();
  c.metadata = (c.metadata || []).map((m) => ({ ...m, id: uid() }));
  c.security.permissions = (c.security.permissions || []).map((p) => ({ ...p, id: uid() }));
  c.channels = (c.channels || []).map((ch) => ({ ...ch, id: uid() }));
  return c;
}
function snap(v) { const s = state.settings; if (!s || !s.snap) return v; const g = (s && s.grid) || 20; return Math.round(v / g) * g; }

/* ---------- state ---------- */
const DEFAULT_SETTINGS = {
  snap: true, grid: 20, showGrid: true, showMinimap: true, sidebarCollapsed: false,
  edgeStyle: "curved", edgeWidth: 1.5, edgeColor: "#c2c7d0",
  exportBg: "#f6f7f9", logo: null, exportHeader: true, exportLegend: true, exportScale: 2,
};
const state = {
  nodes: [], edges: [], annotations: [], selectedId: null, selectedIds: [], selectedAnno: null,
  docName: "Untitled architecture", docDescription: "",
  view: { x: 0, y: 0, k: 1 }, past: [], future: [], clipboard: null, _lastPush: 0,
  settings: Object.assign({}, DEFAULT_SETTINGS),
};
const nodeById = (id) => state.nodes.find((n) => n.id === id);
const annoById = (id) => state.annotations.find((a) => a.id === id);

function createAnnotation(kind, x, y) {
  x = snap(x); y = snap(y);
  if (kind === "frame") return { id: uid(), kind: "frame", x: x - 40, y: y - 30, w: 320, h: 220, color: "#3b6fb0", label: "Group" };
  if (kind === "text") return { id: uid(), kind: "text", x: x, y: y, text: "Text", color: "#15212f", size: 16 };
  return { id: uid(), kind: "icon", icon: kind, x: x - 18, y: y - 18, color: ANNO_DEFAULT_COLOR[kind] || "#3b6fb0", size: 36 };
}

function loadSettings() { try { const raw = localStorage.getItem(SETTINGS_KEY); if (raw) Object.assign(state.settings, JSON.parse(raw)); } catch (e) {} }
function saveSettings() { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings)); } catch (e) {} }
function applySettings() {
  const s = state.settings;
  dom.canvas.style.background = s.showGrid
    ? "radial-gradient(circle, #dde1e7 1px, transparent 1px) 0 0 / " + s.grid + "px " + s.grid + "px, var(--bg)"
    : "var(--bg)";
  dom.minimap.style.display = s.showMinimap ? "block" : "none";
  if (dom.app) dom.app.classList.toggle("nav-collapsed", !!s.sidebarCollapsed);
  document.documentElement.style.setProperty("--edge-width", s.edgeWidth);
  document.documentElement.style.setProperty("--edge-color", s.edgeColor || "#c2c7d0");
  if (dom.edges) redrawEdges();
}

function knownPrincipals() {
  const set = new Set([EVERYONE]);
  state.nodes.forEach((n) => n.security.permissions.forEach((p) => { if (p.principal.trim()) set.add(p.principal.trim()); }));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

/* ---------- history ---------- */
function historySnapshot() { return { nodes: clone(state.nodes), edges: clone(state.edges), annotations: clone(state.annotations) }; }
function historyRestore(s) { state.nodes = s.nodes; state.edges = s.edges; state.annotations = s.annotations || []; }
function pushHistory(mode) {
  const now = Date.now();
  if (mode === "coalesce" && now - state._lastPush < 700) { state.future = []; return; }
  state.past.push(historySnapshot());
  if (state.past.length > 60) state.past.shift();
  state.future = [];
  state._lastPush = now;
}
function undo() {
  if (!state.past.length) return;
  state.future.unshift(historySnapshot());
  historyRestore(state.past.pop()); clearSelection(); state.selectedAnno = null;
  renderAll();
}
function redo() {
  if (!state.future.length) return;
  state.past.push(historySnapshot());
  historyRestore(state.future.shift()); clearSelection(); state.selectedAnno = null;
  renderAll();
}

/* ---------- mutation wrapper: history + render + save in one place ---------- */
function mutate(fn, opts) {
  pushHistory(opts && opts.coalesce ? "coalesce" : "commit");
  fn();
  afterChange(opts && opts.reinspect);
}
function afterChange(reinspect) {
  renderNodes(); renderFrames(); renderAnnotations(); redrawEdges(); drawMinimap(); updateTopbar(); save();
  if (reinspect) renderInspector();
}

/* ===================== node ops ===================== */
function select(id, additive) {
  state.selectedAnno = null;
  if (additive && id) { const i = state.selectedIds.indexOf(id); if (i >= 0) state.selectedIds.splice(i, 1); else state.selectedIds.push(id); }
  else state.selectedIds = id ? [id] : [];
  state.selectedId = state.selectedIds.length ? state.selectedIds[state.selectedIds.length - 1] : null;
  renderNodes(); renderFrames(); renderAnnotations(); renderInspector();
}
function clearSelection() { state.selectedIds = []; state.selectedId = null; }
function setSelection(ids) { state.selectedIds = ids.slice(); state.selectedId = ids.length ? ids[ids.length - 1] : null; }
// returns the full selection when `id` is part of it, otherwise just [id]
function selectionOrId(id) { if (id && state.selectedIds.indexOf(id) >= 0) return state.selectedIds.slice(); return id ? [id] : state.selectedIds.slice(); }

/* ---------- nesting (sub-items living INSIDE a container card) ---------- */
function childrenOf(id) { return state.nodes.filter((n) => n.parentId === id); }
function withDescendants(ids) {
  const out = new Set(ids);
  let grew = true;
  while (grew) {
    grew = false;
    state.nodes.forEach((n) => { if (n.parentId && out.has(n.parentId) && !out.has(n.id)) { out.add(n.id); grew = true; } });
  }
  return Array.from(out);
}
// raw nest (no history) — callers wrap in mutate() or reuse a drag's snapshot
function nestNodeRaw(childId, parentId) {
  const c = nodeById(childId); if (!c || childId === parentId) return;
  c.parentId = parentId;
  state.edges = state.edges.filter((e) => e.source !== childId && e.target !== childId);
}
function detachNode(id) {
  const c = nodeById(id); if (!c || !c.parentId) return;
  const p = nodeById(c.parentId);
  mutate(() => {
    c.parentId = null;
    if (p) { const s = nodeSize(p.id); c.x = snap(p.x + 24); c.y = snap(p.y + s.h + 24); }
    setSelection([id]);
  }, { reinspect: true });
}
function addNestedChild(parentId, type) {
  const parent = nodeById(parentId); if (!parent) return;
  mutate(() => {
    const child = createNode(type, parent.x, parent.y);
    child.parentId = parentId;
    state.nodes.push(child); setSelection([child.id]);
  }, { reinspect: true });
}

function copyNodes(ids) {
  ids = withDescendants(ids);
  const nodes = ids.map(nodeById).filter(Boolean).map(clone); if (!nodes.length) return;
  const set = new Set(ids);
  const edges = state.edges.filter((e) => set.has(e.source) && set.has(e.target)).map(clone);
  const minX = Math.min.apply(null, nodes.map((n) => n.x)), minY = Math.min.apply(null, nodes.map((n) => n.y));
  state.clipboard = { nodes: nodes, edges: edges, minX: minX, minY: minY };
}
function deleteNodes(ids) {
  if (!ids.length) return; const set = new Set(withDescendants(ids));
  mutate(() => { state.nodes = state.nodes.filter((n) => !set.has(n.id)); state.edges = state.edges.filter((e) => !set.has(e.source) && !set.has(e.target)); clearSelection(); }, { reinspect: true });
}
function duplicateNodes(ids) {
  if (!ids.length) return;
  ids = withDescendants(ids); const set = new Set(ids);
  mutate(() => {
    const idmap = {}; const news = ids.map(nodeById).filter(Boolean).map((n) => { const c = regenIds(n); idmap[n.id] = c.id; c.x = snap(n.x + 40); c.y = snap(n.y + 40); return c; });
    news.forEach((c) => { if (c.parentId) c.parentId = idmap[c.parentId] || c.parentId; });
    state.nodes.push.apply(state.nodes, news);
    state.edges.filter((e) => set.has(e.source) && set.has(e.target)).forEach((e) => state.edges.push({ id: uid(), source: idmap[e.source], sourceHandle: e.sourceHandle, target: idmap[e.target], targetHandle: e.targetHandle }));
    setSelection(news.map((n) => n.id));
  }, { reinspect: true });
}
function pasteClipboard(pos) {
  const cb = state.clipboard; if (!cb || !cb.nodes || !cb.nodes.length) return;
  mutate(() => {
    const dx = pos ? snap(pos.x) - cb.minX : 40, dy = pos ? snap(pos.y) - cb.minY : 40;
    const idmap = {}; const news = cb.nodes.map((n) => { const c = regenIds(n); idmap[n.id] = c.id; c.x = snap(n.x + dx); c.y = snap(n.y + dy); return c; });
    news.forEach((c) => { if (c.parentId) c.parentId = idmap[c.parentId] || null; }); // detach if parent wasn't copied
    state.nodes.push.apply(state.nodes, news);
    (cb.edges || []).forEach((e) => { if (idmap[e.source] && idmap[e.target]) state.edges.push({ id: uid(), source: idmap[e.source], sourceHandle: e.sourceHandle, target: idmap[e.target], targetHandle: e.targetHandle }); });
    setSelection(news.map((n) => n.id));
  }, { reinspect: true });
}

// named wrappers operate on the active selection (or the passed id)
function deleteNode(id) { deleteNodes(selectionOrId(id)); }
function duplicateNode(id) { duplicateNodes(selectionOrId(id)); }
function copyNode(id) { copyNodes(selectionOrId(id)); }
function cutNode(id) { const ids = selectionOrId(id); copyNodes(ids); deleteNodes(ids); }
function pasteNode(pos) { pasteClipboard(pos); }

// rename a site's OWN default groups (scoped — never touches other nodes)
function renameOwnGroups(n, newLabel) {
  const map = {};
  const oldN = defaultGroupNames(n.label), newN = defaultGroupNames(newLabel);
  map[oldN[0]] = newN[0]; map[oldN[1]] = newN[1]; map[oldN[2]] = newN[2];
  n.security.permissions = n.security.permissions.map((p) => (map[p.principal] ? { ...p, principal: map[p.principal] } : p));
}
function renameNode(n, newLabel) {
  if (isRoot(n.type)) renameOwnGroups(n, newLabel);
  n.label = newLabel;
}

/* ---------- bulk edits ---------- */
function selectedNodes() { return state.selectedIds.map(nodeById).filter(Boolean); }
function bulkSet(fn) { mutate(() => selectedNodes().forEach(fn), { reinspect: true }); }
function bulkBounds() { const ns = selectedNodes(); let a = Infinity, b = Infinity, c = -Infinity, e = -Infinity; ns.forEach((n) => { const s = nodeSize(n.id); a = Math.min(a, n.x); b = Math.min(b, n.y); c = Math.max(c, n.x + s.w); e = Math.max(e, n.y + s.h); }); return { minX: a, minY: b, maxX: c, maxY: e }; }
function alignNodes(mode) {
  const ns = selectedNodes(); if (ns.length < 2) return; const bb = bulkBounds();
  bulkSet((n) => { const s = nodeSize(n.id);
    if (mode === "left") n.x = snap(bb.minX);
    else if (mode === "top") n.y = snap(bb.minY);
    else if (mode === "centerX") n.x = snap((bb.minX + bb.maxX) / 2 - s.w / 2);
    else if (mode === "centerY") n.y = snap((bb.minY + bb.maxY) / 2 - s.h / 2);
  });
}
function distributeNodes(axis) {
  const ns = selectedNodes(); if (ns.length < 3) return;
  const key = axis === "x" ? "x" : "y"; ns.sort((a, b) => a[key] - b[key]);
  const min = ns[0][key], max = ns[ns.length - 1][key], step = (max - min) / (ns.length - 1);
  mutate(() => ns.forEach((n, i) => { n[key] = snap(min + i * step); }), { reinspect: true });
}
function addChild(parentId, type) {
  const parent = nodeById(parentId); if (!parent) return;
  mutate(() => {
    const child = createNode(type, parent.x, parent.y + 160);
    state.edges.push({ id: uid(), source: parentId, sourceHandle: "bottom", target: child.id, targetHandle: "top" });
    state.nodes.push(child); setSelection([child.id]);
  }, { reinspect: true });
}
function addNodeAt(type, flow) { mutate(() => { const n = createNode(type, flow ? flow.x : 100, flow ? flow.y : 100); state.nodes.push(n); setSelection([n.id]); state.selectedAnno = null; }, { reinspect: true }); }

/* ---------- annotation ops ---------- */
function addAnnotationAt(kind, p) { mutate(() => { const a = createAnnotation(kind, p.x, p.y); state.annotations.push(a); clearSelection(); state.selectedAnno = a.id; }, { reinspect: true }); }
function selectAnno(id) { state.selectedAnno = id; clearSelection(); renderFrames(); renderAnnotations(); renderInspector(); }
function updateAnno(id, patch) { mutate(() => { const a = annoById(id); if (a) Object.assign(a, patch); }, { coalesce: true }); }
function deleteAnno(id) { mutate(() => { state.annotations = state.annotations.filter((a) => a.id !== id); if (state.selectedAnno === id) state.selectedAnno = null; }, { reinspect: true }); }

/* ---------- auto-tidy ---------- */
function tidyLayout() {
  if (!state.nodes.length) return;
  mutate(() => {
    const depth = {}; state.nodes.forEach((n) => (depth[n.id] = 0));
    for (let i = 0; i < state.nodes.length; i++) {
      let ch = false;
      state.edges.forEach((e) => { if (depth[e.target] < (depth[e.source] || 0) + 1) { depth[e.target] = (depth[e.source] || 0) + 1; ch = true; } });
      if (!ch) break;
    }
    const layers = {};
    state.nodes.filter((n) => !n.parentId).forEach((n) => { const dd = depth[n.id] || 0; (layers[dd] = layers[dd] || []).push(n); });
    Object.keys(layers).sort((a, b) => a - b).forEach((dd) => {
      layers[dd].sort((a, b) => a.x - b.x);
      layers[dd].forEach((n, i) => { n.x = 80 + i * 300; n.y = 60 + Number(dd) * 220; });
    });
  });
}

/* ===================== document: build / import / persist ===================== */
function buildDoc() { return { version: "1.0-static", name: state.docName, description: state.docDescription, nodes: state.nodes, edges: state.edges, annotations: state.annotations, updatedAt: new Date().toISOString() }; }
function download(url, name) { const a = document.createElement("a"); a.href = url; a.download = name; a.click(); }
function exportJson() {
  const blob = new Blob([JSON.stringify(buildDoc(), null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  download(url, (state.docName || "design").replace(/[^a-z0-9]+/gi, "-").toLowerCase() + ".json");
  URL.revokeObjectURL(url);
}
// tolerant of both this app's flat shape and the old Next.js node.data/node.position shape
function normalizeNode(n) {
  const freshStorage = () => ({ quota: "", items: "", retention: "" });
  if (n.data && n.position) {
    const dt = n.data;
    return { id: n.id || uid(), x: n.position.x, y: n.position.y, type: CONFIG[dt.type] ? dt.type : "documentLibrary", label: dt.label || "", description: dt.description || "", notes: dt.notes || "", parentId: n.parentId || dt.parentId || null, size: dt.size || null, teamsEnabled: !!dt.teamsEnabled, channels: dt.channels || [], cardDisplay: dt.cardDisplay || {}, icon: dt.icon || null, color: dt.color || null, metadata: dt.metadata || [], security: dt.security || { inheritsFromParent: true, permissions: [] }, sensitivity: dt.sensitivity || null, externalSharing: dt.externalSharing || "inherit", storage: dt.storage ? clone(dt.storage) : freshStorage() };
  }
  const out = Object.assign({ id: uid(), x: 0, y: 0, label: "", description: "", notes: "", parentId: null, size: null, teamsEnabled: false, channels: [], cardDisplay: {}, icon: null, color: null, metadata: [], security: { inheritsFromParent: true, permissions: [] }, sensitivity: null, externalSharing: "inherit" }, n);
  if (!CONFIG[out.type]) out.type = "documentLibrary";
  out.storage = n.storage ? clone(n.storage) : freshStorage();
  return out;
}
function importJson(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const doc = JSON.parse(reader.result);
      if (!Array.isArray(doc.nodes) || !Array.isArray(doc.edges)) throw 0;
      state.nodes = doc.nodes.map(normalizeNode);
      state.edges = doc.edges.map((e) => ({ id: e.id || uid(), source: e.source, target: e.target, sourceHandle: e.sourceHandle || "bottom", targetHandle: e.targetHandle || "top" }));
      state.docName = doc.name || "Imported design";
      state.docDescription = doc.description || "";
      state.annotations = Array.isArray(doc.annotations) ? doc.annotations : [];
      state.selectedId = null; state.selectedIds = []; state.selectedAnno = null; state.past = []; state.future = [];
      renderAll(); requestAnimationFrame(() => { redrawEdges(); drawMinimap(); fitView(); });
    } catch (err) { alert("Could not import this file. Please choose a valid design JSON."); }
  };
  reader.readAsText(file);
}

/* ---------- localStorage persistence ---------- */
let saveTimer = null;
function save() { clearTimeout(saveTimer); saveTimer = setTimeout(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(buildDoc())); } catch (e) {} }, 400); }
function load() { try { const raw = localStorage.getItem(STORAGE_KEY); if (!raw) return null; const d = JSON.parse(raw); if (!Array.isArray(d.nodes)) return null; return d; } catch (e) { return null; } }
