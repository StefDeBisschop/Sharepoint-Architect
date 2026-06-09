/* ===================== SharePoint Architect — static, zero-dependency ===================== */
(function () {
  "use strict";

  /* ---------- icons (lucide-style inner SVG) ---------- */
  const ICONS = {
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    megaphone: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
    library: '<path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/>',
    fileText: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>',
    folder: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
    tags: '<path d="M9 5H2v7l6.29 6.29c.94.94 2.48.94 3.42 0l3.58-3.58c.94-.94.94-2.48 0-3.42L9 5Z"/><path d="M6 9.01V9"/><path d="m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19"/>',
    messages: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    hash: '<line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    unlock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',
    chevronsDown: '<path d="m7 6 5 5 5-5"/><path d="m7 13 5 5 5-5"/>',
    note: '<path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11l5-5V5a2 2 0 0 0-2-2z"/><path d="M15 21v-5a1 1 0 0 1 1-1h5"/>',
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" x2="8.12" y1="4" y2="15.88"/><line x1="14.47" x2="20" y1="14.48" y2="20"/><line x1="8.12" x2="12" y1="8.12" y2="12"/>',
    clipboard: '<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>',
    undo: '<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>',
    redo: '<path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/>',
    wand: '<path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8 19 13"/><path d="M17.8 6.2 19 5"/><path d="m3 21 9-9"/><path d="M12.2 6.2 11 5"/>',
    maximize: '<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
    image: '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
    box: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
    star: '<path d="m12 2 3 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.9 21l1.2-6.8-5-4.9 6.9-1z"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    cursor: '<path d="m13 13 6 6"/><path d="M3 3l7.07 17 2.51-7.39L20 10.07z"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    building: '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>',
    flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>',
    list: '<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>',
    planner: '<path d="M6 5v14"/><path d="M12 5v8"/><path d="M18 5v11"/>',
    clipboardCheck: '<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
    type: '<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/>',
    frame: '<line x1="22" x2="2" y1="6" y2="6"/><line x1="22" x2="2" y1="18" y2="18"/><line x1="6" x2="6" y1="2" y2="22"/><line x1="18" x2="18" y1="2" y2="22"/>',
  };
  const svg = (n) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[n] || "") + "</svg>";

  /* ---------- config ---------- */
  const CONFIG = {
    teamSite: { label: "Team Site", category: "site", icon: "users", accent: "#3b6fb0", desc: "Collaboration site (optionally Teams-connected)" },
    communicationSite: { label: "Communication Site", category: "site", icon: "megaphone", accent: "#7a5cb8", desc: "Broadcast / intranet site" },
    documentLibrary: { label: "Document Library", category: "container", icon: "library", accent: "#3f8f66", desc: "Stores documents and files" },
    page: { label: "Page", category: "sub", icon: "fileText", accent: "#c2853c", desc: "Modern SharePoint page" },
    folder: { label: "Folder", category: "sub", icon: "folder", accent: "#6b7280", desc: "Folder within a library" },
    metadata: { label: "Metadata", category: "sub", icon: "tags", accent: "#3a949b", desc: "Managed metadata column" },
    sharepointList: { label: "SharePoint List", category: "container", icon: "list", accent: "#3f7d8f", desc: "Structured list of items" },
    planner: { label: "Planner", category: "container", icon: "planner", accent: "#2f8f5e", desc: "Task board for the group" },
    groupMailbox: { label: "Group Mailbox", category: "container", icon: "mail", accent: "#b0506b", desc: "Shared Microsoft 365 mailbox" },
    groupForms: { label: "Group Forms", category: "container", icon: "clipboardCheck", accent: "#5a6fb0", desc: "Forms owned by the group" },
  };
  const PALETTE = [
    { title: "Sites", types: ["teamSite", "communicationSite"] },
    { title: "Content", types: ["documentLibrary", "sharepointList", "page"] },
    { title: "Microsoft 365 apps", types: ["planner", "groupMailbox", "groupForms"] },
    { title: "Sub-items", types: ["folder", "metadata"] },
  ];
  // annotations are decorative canvas objects, not SharePoint nodes
  const ANNO_PALETTE = [
    { kind: "frame", label: "Frame", icon: "frame", desc: "Group nodes in a tinted box" },
    { kind: "text", label: "Text", icon: "type", desc: "Free-floating label" },
    { kind: "person", label: "Person", icon: "user" },
    { kind: "mail", label: "Mail", icon: "mail" },
    { kind: "building", label: "Building", icon: "building" },
    { kind: "country", label: "Country", icon: "flag" },
  ];
  const ANNO_ICON = { person: "user", mail: "mail", building: "building", country: "flag" };
  const ANNO_DEFAULT_COLOR = { person: "#3b6fb0", mail: "#7a5cb8", building: "#6b7280", country: "#3f8f66" };
  const ROLES = { read: "Read", contribute: "Contribute", owner: "Owner", fullControl: "Full Ctrl" };
  const ROLE_FULL = { read: "Read", contribute: "Contribute", owner: "Owner", fullControl: "Full Control" };
  const ROLE_ORDER = ["read", "contribute", "owner", "fullControl"];
  const CHANNEL_KINDS = { standard: { label: "Standard", color: "#6b7280" }, private: { label: "Private", color: "#c2853c" }, shared: { label: "Shared", color: "#3a949b" } };
  const CHANNEL_ORDER = ["standard", "private", "shared"];
  const SENSITIVITY = {
    public: { label: "Public", color: "#3f8f66" },
    internal: { label: "Internal", color: "#3b6fb0" },
    confidential: { label: "Confidential", color: "#c2853c" },
    highlyConfidential: { label: "Highly Confidential", color: "#b0506b" },
  };
  const SENS_ORDER = ["public", "internal", "confidential", "highlyConfidential"];
  const EXTERNAL = {
    enabled: { label: "External sharing on", icon: "globe", color: "#c2853c" },
    blocked: { label: "External sharing blocked", icon: "shield", color: "#6b7280" },
  };
  const COLORS = ["#3b6fb0", "#7a5cb8", "#3f8f66", "#c2853c", "#6b7280", "#3a949b", "#4b53bc", "#b0506b"];
  const ICON_KEYS = ["users", "megaphone", "library", "fileText", "folder", "tags", "messages", "hash", "shield", "globe", "star", "settings"];
  const EVERYONE = "Everyone except external users";
  const TEAMS_ACCENT = "#4b53bc";
  const SIDES = ["top", "right", "bottom", "left"];
  const CHILD_TYPES = ["documentLibrary", "page", "folder", "metadata"];
  const STORAGE_KEY = "sp-architect-static:v1";

  /* ---------- helpers ---------- */
  const uid = () => Math.random().toString(36).slice(2, 10);
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const isRoot = (t) => CONFIG[t].category === "site";
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const $ = (sel, root) => (root || document).querySelector(sel);

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
  function storageRelevant(t) { return t === "documentLibrary" || t === "sharepointList" || t === "folder" || CONFIG[t].category === "site"; }

  /* ---------- state ---------- */
  const DEFAULT_SETTINGS = { snap: true, grid: 20, showGrid: true, showMinimap: true, edgeStyle: "curved", edgeWidth: 1.5, edgeColor: "#c2c7d0", exportBg: "#f6f7f9", logo: null, exportHeader: true };
  const state = {
    nodes: [], edges: [], annotations: [], selectedId: null, selectedIds: [], selectedAnno: null,
    docName: "Untitled architecture", docDescription: "",
    view: { x: 0, y: 0, k: 1 }, past: [], future: [], clipboard: null, _lastPush: 0,
    settings: Object.assign({}, DEFAULT_SETTINGS),
  };
  const annoById = (id) => state.annotations.find((a) => a.id === id);
  function createAnnotation(kind, x, y) {
    x = snap(x); y = snap(y);
    if (kind === "frame") return { id: uid(), kind: "frame", x: x - 40, y: y - 30, w: 320, h: 220, color: "#3b6fb0", label: "Group" };
    if (kind === "text") return { id: uid(), kind: "text", x: x, y: y, text: "Text", color: "#1f2733", size: 16 };
    return { id: uid(), kind: "icon", icon: kind, x: x - 18, y: y - 18, color: ANNO_DEFAULT_COLOR[kind] || "#3b6fb0", size: 36 };
  }

  const SETTINGS_KEY = "sp-architect-static:settings";
  function loadSettings() { try { const raw = localStorage.getItem(SETTINGS_KEY); if (raw) Object.assign(state.settings, JSON.parse(raw)); } catch (e) {} }
  function saveSettings() { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings)); } catch (e) {} }
  function applySettings() {
    const s = state.settings;
    dom.canvas.style.background = s.showGrid
      ? "radial-gradient(circle, #dfe2e7 1px, transparent 1px) 0 0 / " + s.grid + "px " + s.grid + "px, #f6f7f9"
      : "#f6f7f9";
    dom.minimap.style.display = s.showMinimap ? "block" : "none";
    document.documentElement.style.setProperty("--edge-width", s.edgeWidth);
    document.documentElement.style.setProperty("--edge-color", s.edgeColor || "#c2c7d0");
    if (dom.edges) redrawEdges();
  }

  function knownPrincipals() {
    const set = new Set([EVERYONE]);
    state.nodes.forEach((n) => n.security.permissions.forEach((p) => { if (p.principal.trim()) set.add(p.principal.trim()); }));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }
  const nodeById = (id) => state.nodes.find((n) => n.id === id);

  /* ---------- history ---------- */
  function snapshot() { return { nodes: clone(state.nodes), edges: clone(state.edges), annotations: clone(state.annotations) }; }
  function restore(s) { state.nodes = s.nodes; state.edges = s.edges; state.annotations = s.annotations || []; }
  function pushHistory(mode) {
    const now = Date.now();
    if (mode === "coalesce" && now - state._lastPush < 700) { state.future = []; return; }
    state.past.push(snapshot());
    if (state.past.length > 60) state.past.shift();
    state.future = [];
    state._lastPush = now;
  }
  function undo() {
    if (!state.past.length) return;
    state.future.unshift(snapshot());
    restore(state.past.pop()); clearSelection(); state.selectedAnno = null;
    renderAll();
  }
  function redo() {
    if (!state.future.length) return;
    state.past.push(snapshot());
    restore(state.future.shift()); clearSelection(); state.selectedAnno = null;
    renderAll();
  }

  /* ---------- mutation wrapper ---------- */
  function mutate(fn, opts) {
    pushHistory(opts && opts.coalesce ? "coalesce" : "commit");
    fn();
    afterChange(opts && opts.reinspect);
  }
  function afterChange(reinspect) {
    renderNodes(); renderFrames(); renderAnnotations(); redrawEdges(); drawMinimap(); updateTopbar(); save();
    if (reinspect) renderInspector();
  }

  /* ---------- DOM refs ---------- */
  let dom = {};

  /* ===================== rendering ===================== */
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

  function badgeHTML(p, accent) {
    return '<span class="badge" style="color:' + accent + ';border-color:' + accent + '33;background:' + accent + '12"><span>' + esc(p.principal) + '</span><span class="dot">·</span><span>' + ROLES[p.role] + "</span></span>";
  }

  function indicatorsHTML(n) {
    const parts = [];
    if (n.sensitivity && SENSITIVITY[n.sensitivity]) { const c = SENSITIVITY[n.sensitivity]; parts.push('<span class="sens-pill" style="color:' + c.color + ";background:" + c.color + "14;border-color:" + c.color + '33"><span class="dot" style="background:' + c.color + '"></span>' + c.label + "</span>"); }
    const ex = n.externalSharing && n.externalSharing !== "inherit" ? EXTERNAL[n.externalSharing] : null;
    if (ex) parts.push('<span class="ext-pill" style="color:' + ex.color + ";background:" + ex.color + "14;border-color:" + ex.color + '33">' + svg(ex.icon) + ex.label + "</span>");
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
    const styleVars = "--accent:" + accent + ";--sel:" + accent + "33;left:" + n.x + "px;top:" + n.y + "px";
    const indicator = '<span class="indicator" title="' + (inheriting ? "Inherits parent permissions" : "Unique permissions") + '">' + svg(inheriting ? "chevronsDown" : "lock") + "</span>";
    const icon = '<span class="nicon" style="background:' + accent + '16;color:' + accent + '">' + svg(iconKeyOf(n)) + "</span>";
    const handles = SIDES.map((s) => '<div class="handle h-' + s + '" data-id="' + n.id + '" data-side="' + s + '"></div>').join("");

    if (compact) {
      const showBadges = !inheriting && n.security.permissions.length > 0;
      const vis = n.security.permissions.slice(0, 2);
      const over = n.security.permissions.length - vis.length;
      let h = '<div class="node compact' + sel + '" data-id="' + n.id + '" style="' + styleVars + '">';
      h += '<div class="body"><div class="head">' + icon + '<div class="htext"><div class="title">' + esc(n.label) + '</div><div class="type">' + cfg.label + "</div></div>" + indicator + "</div></div>";
      h += indicatorsHTML(n);
      if (broken) h += '<div class="banner-broken">' + svg("unlock") + "Inheritance broken</div>";
      if (n.notes && n.notes.trim()) h += '<div class="note">' + svg("note") + "<span>" + esc(n.notes) + "</span></div>";
      if (showBadges) { h += '<div class="badges">' + vis.map((p) => badgeHTML(p, accent)).join(""); if (over > 0) h += '<span class="badge-more">+' + over + "</span>"; h += "</div>"; }
      h += handles + "</div>";
      return h;
    }

    const anyD = d.description || d.metadata || d.channels || d.permissions || (d.storage && storageRelevant(n.type));
    const showPerm = d.permissions && n.security.permissions.length > 0;
    const showBadgeRow = !d.permissions && !inheriting && n.security.permissions.length > 0;
    const bvis = n.security.permissions.slice(0, 3);
    const bover = n.security.permissions.length - bvis.length;

    let h = '<div class="node standard' + (anyD ? " wide" : "") + sel + '" data-id="' + n.id + '" style="' + styleVars + '">';
    h += '<div class="topbar"></div><div class="body">';
    h += '<div class="head">' + icon + '<div class="htext"><div class="title-row"><span class="title">' + esc(n.label) + "</span>";
    if (teamsOn) h += '<span class="teams-badge" title="Teams-connected" style="background:' + TEAMS_ACCENT + '18;color:' + TEAMS_ACCENT + '">' + svg("messages") + "</span>";
    h += '</div><div class="type">' + cfg.label + (teamsOn ? " · Teams" : "") + "</div></div>" + indicator + "</div>";
    h += indicatorsHTML(n);
    if (broken) h += '<div class="banner-broken">' + svg("unlock") + "Inheritance broken — unique permissions</div>";
    if (n.notes && n.notes.trim()) h += '<div class="note">' + svg("note") + "<span>" + esc(n.notes) + "</span></div>";
    if (d.description && n.description) h += '<div class="desc">' + esc(n.description) + "</div>";
    if (d.metadata && n.metadata.length) { h += '<div class="block"><div class="block-label">Metadata</div><div class="block-body">'; h += n.metadata.map((m) => '<div class="kv"><span class="k">' + esc(m.key) + '</span><span class="v">' + esc(m.value || "—") + "</span></div>").join(""); h += "</div></div>"; }
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
    dom.nodes.innerHTML = state.nodes.map(nodeHTML).join("");
  }

  /* ---------- edges ---------- */
  function nodeSize(id) {
    const el = dom.nodes.querySelector('.node[data-id="' + id + '"]');
    return el ? { w: el.offsetWidth, h: el.offsetHeight } : { w: 244, h: 80 };
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
      s += '<path d="' + edgePath(p1, p2) + '"/>';
    });
    dom.edges.innerHTML = s;
  }

  /* ---------- transform / view ---------- */
  function applyTransform() {
    dom.viewport.style.transform = "translate(" + state.view.x + "px," + state.view.y + "px) scale(" + state.view.k + ")";
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
    if (!state.nodes.length) return;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    state.nodes.forEach((n) => { const s = nodeSize(n.id); minX = Math.min(minX, n.x); minY = Math.min(minY, n.y); maxX = Math.max(maxX, n.x + s.w); maxY = Math.max(maxY, n.y + s.h); });
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
    if (!state.nodes.length) { dom.minimapSvg.innerHTML = ""; return; }
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    const boxes = state.nodes.map((n) => { const s = nodeSize(n.id); minX = Math.min(minX, n.x); minY = Math.min(minY, n.y); maxX = Math.max(maxX, n.x + s.w); maxY = Math.max(maxY, n.y + s.h); return { x: n.x, y: n.y, w: s.w, h: s.h, c: accentOf(n) }; });
    const k = Math.min((W - pad * 2) / Math.max(1, maxX - minX), (H - pad * 2) / Math.max(1, maxY - minY));
    let s = "";
    boxes.forEach((b) => { s += '<rect x="' + (pad + (b.x - minX) * k) + '" y="' + (pad + (b.y - minY) * k) + '" width="' + Math.max(3, b.w * k) + '" height="' + Math.max(3, b.h * k) + '" rx="1.5" fill="' + b.c + '" opacity="0.85"/>'; });
    dom.minimapSvg.innerHTML = s;
  }

  /* ===================== topbar ===================== */
  function updateTopbar() {
    dom.undoBtn.disabled = state.past.length === 0;
    dom.redoBtn.disabled = state.future.length === 0;
  }

  /* ===================== inspector ===================== */
  function renderInspector() {
    if (state.selectedAnno) { renderAnnoInspector(); return; }
    if (state.selectedIds.length > 1) { renderBulkInspector(); return; }
    const n = nodeById(state.selectedId);
    if (!n) {
      dom.inspector.innerHTML = '<div class="insp-empty">' + svg("cursor") + '<div class="t">No node selected</div><div class="d">Select a node on the canvas to edit its details and security.</div></div>';
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
        t += '<div class="section-head"><span style="font-size:12px;font-weight:500;color:var(--ink-muted)">Channels</span><button class="add-btn" data-act="add-channel">' + svg("plus") + "Add</button></div>";
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
    ap += '<div><p style="margin:0 0 6px;font-size:12px;font-weight:500;color:var(--ink-muted)">Color</p><div class="swatches">';
    COLORS.forEach((c) => { const seld = (n.color || cfg.accent) === c; ap += '<button class="swatch" data-color="' + c + '" style="background:' + c + (seld ? ";outline:2px solid " + c + "55;outline-offset:2px" : "") + '">' + (seld ? svg("check") : "") + "</button>"; });
    ap += '<button class="swatch reset" data-color="__reset" title="Reset color">' + svg("refresh") + "</button></div></div>";
    ap += '<div><p style="margin:0 0 6px;font-size:12px;font-weight:500;color:var(--ink-muted)">Icon</p><div class="icon-grid">';
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
    se += '<div class="section-head"><span style="font-size:12px;font-weight:500;color:var(--ink-muted)">Permissions</span><div class="row">';
    if (isRoot(n.type)) se += '<button class="add-btn" data-act="default-groups" title="Owners / Members / Visitors">Default groups</button>';
    se += '<button class="add-btn" data-act="add-perm">' + svg("plus") + "Add</button></div></div>";
    se += '<select class="input" data-act="add-existing"><option value="">+ Add existing group…</option>' + known.map((p) => '<option value="' + esc(p) + '">' + esc(p) + "</option>").join("") + "</select>";
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
    let h = '<div class="insp-head"><div class="tag"><span class="bar" style="background:#3b6fb0"></span><h2>' + count + ' nodes selected</h2></div><button class="insp-del" data-bulk="delete">' + svg("trash") + "Delete</button></div>";
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
    // text inputs (coalesced, no re-render)
    root.querySelectorAll("[data-field]").forEach((el) => {
      const f = el.dataset.field;
      if (f === "type") {
        el.addEventListener("change", () => mutate(() => { n.type = el.value; }, { reinspect: true }));
      } else {
        el.addEventListener("input", () => {
          mutate(() => {
            if (f === "label" && isRoot(n.type)) renameOwnGroups(n, el.value);
            n[f] = el.value;
          }, { coalesce: true });
        });
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
      if (el.tagName === "SELECT" && act === "add-existing") {
        el.addEventListener("change", () => { const v = el.value; if (!v) return; mutate(() => { n.security.permissions.push({ id: uid(), principal: v, principalType: "group", role: "read" }); }, { reinspect: true }); });
        return;
      }
      el.addEventListener("click", () => {
        if (act === "delete") { deleteNode(n.id); return; }
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
    // color / icon
    root.querySelectorAll("[data-color]").forEach((el) => el.addEventListener("click", () => mutate(() => { n.color = el.dataset.color === "__reset" ? null : el.dataset.color; }, { reinspect: true })));
    root.querySelectorAll("[data-icon-key]").forEach((el) => el.addEventListener("click", () => mutate(() => { n.icon = el.dataset.iconKey; }, { reinspect: true })));
    // governance
    root.querySelectorAll("[data-gov]").forEach((el) => el.addEventListener("change", () => mutate(() => { const g = el.dataset.gov; n[g] = el.value || (g === "sensitivity" ? null : "inherit"); }, {})));
    // storage
    root.querySelectorAll("[data-storage]").forEach((el) => el.addEventListener("input", () => mutate(() => { if (!n.storage) n.storage = { quota: "", items: "", retention: "" }; n.storage[el.dataset.storage] = el.value; }, { coalesce: true })));
  }

  // rename a site's OWN default groups (scoped — never touches other nodes)
  function renameOwnGroups(n, newLabel) {
    const map = {};
    const oldN = defaultGroupNames(n.label), newN = defaultGroupNames(newLabel);
    map[oldN[0]] = newN[0]; map[oldN[1]] = newN[1]; map[oldN[2]] = newN[2];
    n.security.permissions = n.security.permissions.map((p) => (map[p.principal] ? { ...p, principal: map[p.principal] } : p));
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

  function copyNodes(ids) {
    const nodes = ids.map(nodeById).filter(Boolean).map(clone); if (!nodes.length) return;
    const set = new Set(ids);
    const edges = state.edges.filter((e) => set.has(e.source) && set.has(e.target)).map(clone);
    const minX = Math.min.apply(null, nodes.map((n) => n.x)), minY = Math.min.apply(null, nodes.map((n) => n.y));
    state.clipboard = { nodes: nodes, edges: edges, minX: minX, minY: minY };
  }
  function deleteNodes(ids) {
    if (!ids.length) return; const set = new Set(ids);
    mutate(() => { state.nodes = state.nodes.filter((n) => !set.has(n.id)); state.edges = state.edges.filter((e) => !set.has(e.source) && !set.has(e.target)); clearSelection(); }, { reinspect: true });
  }
  function duplicateNodes(ids) {
    if (!ids.length) return; const set = new Set(ids);
    mutate(() => {
      const idmap = {}; const news = ids.map(nodeById).filter(Boolean).map((n) => { const c = regenIds(n); idmap[n.id] = c.id; c.x = snap(n.x + 40); c.y = snap(n.y + 40); return c; });
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
      state.nodes.forEach((n) => { const dd = depth[n.id] || 0; (layers[dd] = layers[dd] || []).push(n); });
      Object.keys(layers).sort((a, b) => a - b).forEach((dd) => {
        layers[dd].sort((a, b) => a.x - b.x);
        layers[dd].forEach((n, i) => { n.x = 80 + i * 300; n.y = 60 + Number(dd) * 200; });
      });
    });
  }

  /* ===================== export / import ===================== */
  function buildDoc() { return { version: "1.0-static", name: state.docName, description: state.docDescription, nodes: state.nodes, edges: state.edges, annotations: state.annotations, updatedAt: new Date().toISOString() }; }
  function download(url, name) { const a = document.createElement("a"); a.href = url; a.download = name; a.click(); }
  function exportJson() {
    const blob = new Blob([JSON.stringify(buildDoc(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    download(url, (state.docName || "design").replace(/[^a-z0-9]+/gi, "-").toLowerCase() + ".json");
    URL.revokeObjectURL(url);
  }
  function normalizeNode(n) {
    const freshStorage = () => ({ quota: "", items: "", retention: "" });
    if (n.data && n.position) {
      const dt = n.data;
      return { id: n.id || uid(), x: n.position.x, y: n.position.y, type: dt.type, label: dt.label || "", description: dt.description || "", notes: dt.notes || "", teamsEnabled: !!dt.teamsEnabled, channels: dt.channels || [], cardDisplay: dt.cardDisplay || {}, icon: dt.icon || null, color: dt.color || null, metadata: dt.metadata || [], security: dt.security || { inheritsFromParent: true, permissions: [] }, sensitivity: dt.sensitivity || null, externalSharing: dt.externalSharing || "inherit", storage: dt.storage ? clone(dt.storage) : freshStorage() };
    }
    const out = Object.assign({ id: uid(), x: 0, y: 0, label: "", description: "", notes: "", teamsEnabled: false, channels: [], cardDisplay: {}, icon: null, color: null, metadata: [], security: { inheritsFromParent: true, permissions: [] }, sensitivity: null, externalSharing: "inherit" }, n);
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
        renderAll(); fitView();
      } catch (err) { alert("Could not import this file. Please choose a valid design JSON."); }
    };
    reader.readAsText(file);
  }

  /* ---------- PNG export (full re-render on a 2D canvas) ---------- */
  const X_INK = "#1f2733", X_MUTED = "#6b7280", X_SUBTLE = "#9aa3af", X_LINE = "#e6e8ec", X_CANVAS = "#f6f7f9";
  const FONT = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif";
  function roundRect(ctx, x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  function clipText(ctx, text, max) { text = String(text); if (ctx.measureText(text).width <= max) return text; let t = text; while (t.length && ctx.measureText(t + "…").width > max) t = t.slice(0, -1); return t + "…"; }
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
  function widthOf(n) { if (CONFIG[n.type].category === "sub") return 190; const d = n.cardDisplay || {}; return d.description || d.metadata || d.channels || d.permissions || (d.storage && storageRelevant(n.type)) ? 312 : 244; }
  function hpM(n, side, size) {
    if (side === "top") return { x: n.x + size.w / 2, y: n.y, dx: 0, dy: -1 };
    if (side === "bottom") return { x: n.x + size.w / 2, y: n.y + size.h, dx: 0, dy: 1 };
    if (side === "left") return { x: n.x, y: n.y + size.h / 2, dx: -1, dy: 0 };
    return { x: n.x + size.w, y: n.y + size.h / 2, dx: 1, dy: 0 };
  }

  // Lays out (and optionally draws) a node's inner content. Returns total height.
  function layoutNode(ctx, n, x, y, draw) {
    const cfg = CONFIG[n.type], accent = accentOf(n), compact = cfg.category === "sub", w = widthOf(n);
    const inheriting = n.security.inheritsFromParent, broken = !inheriting && !isRoot(n.type);
    const teamsOn = n.type === "teamSite" && !!n.teamsEnabled, d = n.cardDisplay || {};
    const padX = compact ? 10 : 12;
    let cy = y + (compact ? 8 : 16);

    // head
    const iconSz = compact ? 24 : 32, gl = compact ? 13 : 16;
    if (draw) {
      ctx.fillStyle = accent + "16"; roundRect(ctx, x + padX, cy, iconSz, iconSz, compact ? 7 : 9); ctx.fill();
      const im = iconImg(iconKeyOf(n), accent).img; if (im) ctx.drawImage(im, x + padX + (iconSz - gl) / 2, cy + (iconSz - gl) / 2, gl, gl);
    }
    const textX = x + padX + iconSz + (compact ? 8 : 10);
    if (draw) {
      ctx.textBaseline = "alphabetic"; ctx.textAlign = "left";
      ctx.fillStyle = X_INK; ctx.font = "600 " + (compact ? 13 : 14) + "px " + FONT;
      const titleMax = w - (textX - x) - padX - 16 - (teamsOn ? 19 : 0);
      const tl = clipText(ctx, n.label, titleMax);
      ctx.fillText(tl, textX, cy + (compact ? 11 : 13));
      if (teamsOn) { const after = textX + ctx.measureText(tl).width + 4; ctx.fillStyle = TEAMS_ACCENT + "18"; roundRect(ctx, after, cy, 15, 15, 4); ctx.fill(); const tg = iconImg("messages", TEAMS_ACCENT).img; if (tg) ctx.drawImage(tg, after + 2, cy + 2, 11, 11); }
      ctx.fillStyle = accent; ctx.font = "600 10px " + FONT;
      ctx.fillText((cfg.label + (teamsOn ? " · Teams" : "")).toUpperCase(), textX, cy + (compact ? 24 : 28));
      const ic = iconImg(inheriting ? "chevronsDown" : "lock", inheriting ? X_SUBTLE : accent).img;
      if (ic) ctx.drawImage(ic, x + w - padX - 13, cy + 1, 13, 13);
    }
    cy += compact ? 28 : 34;

    // sensitivity / external-sharing indicator pills
    const sensCfg = n.sensitivity && SENSITIVITY[n.sensitivity] ? SENSITIVITY[n.sensitivity] : null;
    const exCfg = n.externalSharing && n.externalSharing !== "inherit" ? EXTERNAL[n.externalSharing] : null;
    if (sensCfg || exCfg) {
      cy += 8; const h = 18;
      if (draw) {
        ctx.font = "600 10px " + FONT; ctx.textBaseline = "alphabetic"; let bx = x + padX;
        if (sensCfg) { const lbl = sensCfg.label; const pw = ctx.measureText(lbl).width + 18; ctx.fillStyle = sensCfg.color + "1f"; roundRect(ctx, bx, cy, pw, h, 9); ctx.fill(); ctx.fillStyle = sensCfg.color; ctx.beginPath(); ctx.arc(bx + 8, cy + 9, 3, 0, Math.PI * 2); ctx.fill(); ctx.fillText(lbl, bx + 14, cy + 12); bx += pw + 4; }
        if (exCfg) { const lbl = exCfg.label; const pw = ctx.measureText(lbl).width + 22; ctx.fillStyle = exCfg.color + "1f"; roundRect(ctx, bx, cy, pw, h, 9); ctx.fill(); const im = iconImg(exCfg.icon, exCfg.color).img; if (im) ctx.drawImage(im, bx + 6, cy + 3, 11, 11); ctx.fillStyle = exCfg.color; ctx.fillText(lbl, bx + 19, cy + 12); }
      }
      cy += h;
    }

    function box(bg, border, h) { if (draw) { ctx.fillStyle = bg; roundRect(ctx, x + padX, cy, w - padX * 2, h, 6); ctx.fill(); if (border) { ctx.strokeStyle = border; ctx.lineWidth = 1; roundRect(ctx, x + padX, cy, w - padX * 2, h, 6); ctx.stroke(); } } }

    if (broken) {
      cy += 8; const h = 24; box("#fef2f2", "#fecaca", h);
      if (draw) { const ic = iconImg("unlock", "#b91c1c").img; if (ic) ctx.drawImage(ic, x + padX + 8, cy + 6, 12, 12); ctx.fillStyle = "#b91c1c"; ctx.font = "600 11px " + FONT; ctx.fillText(compact ? "Inheritance broken" : "Inheritance broken — unique permissions", x + padX + 26, cy + 16); }
      cy += h;
    }
    if (n.notes && n.notes.trim()) {
      cy += 8; if (draw) ctx.font = "11px " + FONT; else ctx.font = "11px " + FONT;
      const lines = wrapText(ctx, n.notes, w - padX * 2 - 26); const h = Math.max(22, lines.length * 14 + 8);
      box("#f8fafc", X_LINE, h);
      if (draw) { const ic = iconImg("note", X_SUBTLE).img; if (ic) ctx.drawImage(ic, x + padX + 8, cy + 6, 12, 12); ctx.fillStyle = X_MUTED; ctx.font = "11px " + FONT; lines.forEach((ln, i) => ctx.fillText(ln, x + padX + 26, cy + 15 + i * 14)); }
      cy += h;
    }

    function blockBox(label, rows, rowFn) {
      cy += 10; if (draw) { ctx.fillStyle = X_SUBTLE; ctx.font = "600 9px " + FONT; ctx.fillText(label.toUpperCase(), x + padX, cy + 8); } cy += 12;
      const h = rows * 16 + 12; box(X_CANVAS, null, h);
      if (draw) { ctx.font = "11px " + FONT; for (let i = 0; i < rows; i++) rowFn(i, cy + 13 + i * 16); ctx.textAlign = "left"; }
      cy += h;
    }

    if (!compact) {
      if (d.description && n.description) { cy += 8; ctx.font = "12px " + FONT; const lines = wrapText(ctx, n.description, w - padX * 2); if (draw) { ctx.fillStyle = X_MUTED; lines.forEach((ln, i) => ctx.fillText(ln, x + padX, cy + 11 + i * 16)); } cy += lines.length * 16; }
      if (d.metadata && n.metadata.length) blockBox("Metadata", n.metadata.length, (i, ry) => { const m = n.metadata[i]; ctx.textAlign = "left"; ctx.fillStyle = X_SUBTLE; ctx.fillText(m.key, x + padX + 10, ry); ctx.textAlign = "right"; ctx.fillStyle = X_INK; ctx.fillText(clipText(ctx, m.value || "—", 120), x + w - padX - 10, ry); });
      if (d.channels && teamsOn && n.channels.length) blockBox("Channels", n.channels.length, (i, ry) => { const c = n.channels[i]; const hh = iconImg("hash", X_SUBTLE).img; if (hh) ctx.drawImage(hh, x + padX + 10, ry - 9, 10, 10); ctx.textAlign = "left"; ctx.fillStyle = X_INK; ctx.fillText(clipText(ctx, c.name, w - 150), x + padX + 24, ry); const kc = CHANNEL_KINDS[c.kind]; ctx.font = "600 9px " + FONT; const lbl = kc.label; const tw = ctx.measureText(lbl).width; ctx.fillStyle = kc.color + "22"; roundRect(ctx, x + w - padX - 10 - tw - 12, ry - 11, tw + 12, 15, 4); ctx.fill(); ctx.fillStyle = kc.color; ctx.textAlign = "left"; ctx.fillText(lbl, x + w - padX - 10 - tw - 6, ry); ctx.font = "11px " + FONT; });
      if (d.permissions && n.security.permissions.length) blockBox("Permissions", n.security.permissions.length, (i, ry) => { const p = n.security.permissions[i]; ctx.textAlign = "left"; ctx.fillStyle = X_INK; ctx.fillText(clipText(ctx, p.principal, w - 120), x + padX + 10, ry); ctx.textAlign = "right"; ctx.fillStyle = X_MUTED; ctx.fillText(ROLES[p.role], x + w - padX - 10, ry); });
      if (d.storage && storageRelevant(n.type) && n.storage) {
        const srows = []; if (n.storage.quota) srows.push(["Quota", n.storage.quota]); if (n.storage.items) srows.push(["Items", n.storage.items]); if (n.storage.retention) srows.push(["Retention", n.storage.retention]);
        if (srows.length) blockBox("Storage", srows.length, (i, ry) => { ctx.textAlign = "left"; ctx.fillStyle = X_SUBTLE; ctx.fillText(srows[i][0], x + padX + 10, ry); ctx.textAlign = "right"; ctx.fillStyle = X_INK; ctx.fillText(clipText(ctx, srows[i][1], 140), x + w - padX - 10, ry); });
      }
    }

    // badge row (compact, or standard without the permissions block)
    const showBadges = !inheriting && n.security.permissions.length && (compact || !d.permissions);
    if (showBadges) {
      cy += 8; const max = compact ? 2 : 3; const list = n.security.permissions.slice(0, max);
      if (draw) { ctx.font = "600 10px " + FONT; ctx.textBaseline = "alphabetic"; let bx = x + padX;
        list.forEach((p) => { const lbl = p.principal + " · " + ROLES[p.role]; const tw = ctx.measureText(lbl).width; const pw = tw + 12; if (bx + pw > x + w - padX) return; ctx.fillStyle = accent + "12"; roundRect(ctx, bx, cy, pw, 17, 6); ctx.fill(); ctx.strokeStyle = accent + "33"; ctx.lineWidth = 1; roundRect(ctx, bx, cy, pw, 17, 6); ctx.stroke(); ctx.fillStyle = accent; ctx.fillText(lbl, bx + 6, cy + 12); bx += pw + 4; });
      }
      cy += 17;
    }

    return cy - y + (compact ? 8 : 12);
  }

  function drawCard(ctx, x, y, w, h, accent, compact) {
    const r = compact ? 10 : 14;
    ctx.save(); ctx.shadowColor = "rgba(16,24,40,0.10)"; ctx.shadowBlur = 8; ctx.shadowOffsetY = 2;
    ctx.fillStyle = "#fff"; roundRect(ctx, x, y, w, h, r); ctx.fill(); ctx.restore();
    ctx.strokeStyle = X_LINE; ctx.lineWidth = 1; roundRect(ctx, x, y, w, h, r); ctx.stroke();
    if (compact) { ctx.save(); roundRect(ctx, x, y, w, h, r); ctx.clip(); ctx.fillStyle = accent; ctx.fillRect(x, y, 3, h); ctx.restore(); }
    else { ctx.fillStyle = accent; ctx.beginPath(); ctx.moveTo(x, y + 6); ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r); ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r); ctx.lineTo(x + w, y + 6); ctx.closePath(); ctx.fill(); }
  }

  function loadImage(src) { return new Promise((res) => { const img = new Image(); img.onload = () => res(img); img.onerror = () => res(null); img.src = src; }); }
  function hexLuminance(hex) { hex = String(hex || "#ffffff").replace("#", ""); if (hex.length === 3) hex = hex.split("").map((c) => c + c).join(""); const r = parseInt(hex.slice(0, 2), 16) / 255, g = parseInt(hex.slice(2, 4), 16) / 255, b = parseInt(hex.slice(4, 6), 16) / 255; const f = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)); return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); }

  async function exportPng() {
    if (!state.nodes.length) return;
    const measure = document.createElement("canvas").getContext("2d");
    const sizes = {}; let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    state.nodes.forEach((n) => { const w = widthOf(n); const h = layoutNode(measure, n, 0, 0, false); sizes[n.id] = { w: w, h: h }; minX = Math.min(minX, n.x); minY = Math.min(minY, n.y); maxX = Math.max(maxX, n.x + w); maxY = Math.max(maxY, n.y + h); });
    (state.annotations || []).forEach((a) => {
      if (a.kind === "frame") { minX = Math.min(minX, a.x); minY = Math.min(minY, a.y); maxX = Math.max(maxX, a.x + a.w); maxY = Math.max(maxY, a.y + a.h); }
      else if (a.kind === "text") { minX = Math.min(minX, a.x); minY = Math.min(minY, a.y); maxX = Math.max(maxX, a.x + 200); maxY = Math.max(maxY, a.y + a.size + 6); }
      else { minX = Math.min(minX, a.x); minY = Math.min(minY, a.y); maxX = Math.max(maxX, a.x + a.size); maxY = Math.max(maxY, a.y + a.size); }
    });

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

    const pad = 48, scale = 2, headerH = hasHeader ? 92 : 0;
    const contentW = Math.max(maxX - minX, 460);
    const W = contentW + pad * 2, H = (maxY - minY) + pad * 2 + headerH;
    const cv = document.createElement("canvas"); cv.width = Math.ceil(W * scale); cv.height = Math.ceil(H * scale);
    const ctx = cv.getContext("2d"); ctx.scale(scale, scale);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high"; ctx.lineJoin = "round"; ctx.lineCap = "round";
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    if (hasHeader) {
      const dark = hexLuminance(bg) < 0.5;
      const inkC = dark ? "#ffffff" : "#1f2733", mutedC = dark ? "rgba(255,255,255,0.72)" : "#6b7280";
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

    // frames behind everything
    (state.annotations || []).filter((a) => a.kind === "frame").forEach((a) => {
      const fx = a.x + ox, fy = a.y + oy;
      ctx.fillStyle = a.color + "1f"; roundRect(ctx, fx, fy, a.w, a.h, 12); ctx.fill();
      ctx.strokeStyle = a.color + "66"; ctx.lineWidth = 1.5; roundRect(ctx, fx, fy, a.w, a.h, 12); ctx.stroke();
      if (a.label) { ctx.font = "600 12px " + FONT; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic"; const tw = ctx.measureText(a.label).width; ctx.fillStyle = "rgba(255,255,255,0.82)"; roundRect(ctx, fx + 8, fy + 6, tw + 12, 18, 6); ctx.fill(); ctx.fillStyle = a.color; ctx.fillText(a.label, fx + 14, fy + 19); }
    });

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
    state.nodes.forEach((n) => { const s = sizes[n.id]; drawCard(ctx, n.x + ox, n.y + oy, s.w, s.h, accentOf(n), CONFIG[n.type].category === "sub"); layoutNode(ctx, n, n.x + ox, n.y + oy, true); });

    // free text + icon stickers on top
    (state.annotations || []).forEach((a) => {
      if (a.kind === "text") { ctx.fillStyle = a.color; ctx.font = "600 " + a.size + "px " + FONT; ctx.textAlign = "left"; ctx.textBaseline = "top"; String(a.text || "").split("\n").forEach((ln, i) => ctx.fillText(ln, a.x + ox, a.y + oy + i * a.size * 1.25)); }
      else if (a.kind === "icon") { const im = iconImg(ANNO_ICON[a.icon] || "user", a.color).img; if (im) ctx.drawImage(im, a.x + ox, a.y + oy, a.size, a.size); }
    });

    download(cv.toDataURL("image/png"), "sharepoint-architecture.png");
  }

  /* ===================== persistence ===================== */
  let saveTimer = null;
  function save() { clearTimeout(saveTimer); saveTimer = setTimeout(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(buildDoc())); } catch (e) {} }, 400); }
  function load() { try { const raw = localStorage.getItem(STORAGE_KEY); if (!raw) return null; const d = JSON.parse(raw); if (!Array.isArray(d.nodes)) return null; return d; } catch (e) { return null; } }

  /* ===================== context menu ===================== */
  let menuOpen = false;
  function closeMenu() { menuOpen = false; dom.menu.hidden = true; dom.menu.innerHTML = ""; const b = document.getElementById("cm-backdrop"); if (b) b.remove(); }
  function openMenu(kind, sx, sy, nodeId, flow) {
    closeMenu();
    const back = document.createElement("div"); back.id = "cm-backdrop";
    back.addEventListener("mousedown", closeMenu);
    back.addEventListener("contextmenu", (e) => { e.preventDefault(); closeMenu(); });
    document.body.appendChild(back);
    dom.menu.innerHTML = kind === "node" ? nodeMenuHTML(nodeById(nodeId)) : paneMenuHTML();
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
    h += '<div class="cm-label">Add child</div><div class="cm-grid">';
    CHILD_TYPES.forEach((t) => { h += '<button data-child="' + t + '"><span class="dot" style="background:' + CONFIG[t].accent + '"></span>' + CONFIG[t].label.replace("Document ", "") + "</button>"; });
    h += "</div><div class='cm-divider'></div>";
    if (n.type === "teamSite") h += mItem("teams", "messages", n.teamsEnabled ? "Remove Teams" : "Add Teams");
    h += mItem("inherit", n.security.inheritsFromParent ? "unlock" : "lock", n.security.inheritsFromParent ? "Break inheritance" : "Restore inheritance");
    if (isRoot(n.type)) h += mItem("default-groups", "users", "Reset default groups");
    h += "<div class='cm-divider'></div>";
    h += mItem("duplicate", "copy", "Duplicate", "Ctrl+D") + mItem("copy", "copy", "Copy", "Ctrl+C") + mItem("cut", "scissors", "Cut", "Ctrl+X");
    h += "<div class='cm-divider'></div>" + mItem("delete", "trash", "Delete", "Del", true);
    return h;
  }
  function paneMenuHTML() {
    let h = '<div class="cm-label">Add node</div><div class="cm-grid">';
    PALETTE.forEach((g) => g.types.forEach((t) => { h += '<button data-add="' + t + '"><span class="dot" style="background:' + CONFIG[t].accent + '"></span>' + CONFIG[t].label.replace("Document ", "").replace("Communication", "Comm.") + "</button>"; }));
    h += "</div><div class='cm-divider'></div>";
    h += mItem("paste", "clipboard", "Paste here", "Ctrl+V", false, !state.clipboard);
    h += mItem("tidy", "wand", "Tidy layout") + mItem("fit", "maximize", "Fit to view");
    return h;
  }
  function bindMenu(kind, nodeId, flow) {
    dom.menu.querySelectorAll("[data-color]").forEach((el) => el.addEventListener("click", () => { mutate(() => { nodeById(nodeId).color = el.dataset.color; }, { reinspect: true }); closeMenu(); }));
    dom.menu.querySelectorAll("[data-child]").forEach((el) => el.addEventListener("click", () => { addChild(nodeId, el.dataset.child); closeMenu(); }));
    dom.menu.querySelectorAll("[data-add]").forEach((el) => el.addEventListener("click", () => { addNodeAt(el.dataset.add, flow); closeMenu(); }));
    dom.menu.querySelectorAll("[data-m]").forEach((el) => el.addEventListener("click", () => {
      const a = el.dataset.m, n = nodeById(nodeId);
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
  function addNodeAt(type, flow) { mutate(() => { const n = createNode(type, flow ? flow.x : 100, flow ? flow.y : 100); state.nodes.push(n); setSelection([n.id]); state.selectedAnno = null; }, { reinspect: true }); }

  /* ---------- annotation ops ---------- */
  function addAnnotationAt(kind, p) { mutate(() => { const a = createAnnotation(kind, p.x, p.y); state.annotations.push(a); clearSelection(); state.selectedAnno = a.id; }, { reinspect: true }); }
  function selectAnno(id) { state.selectedAnno = id; clearSelection(); renderFrames(); renderAnnotations(); renderInspector(); }
  function updateAnno(id, patch) { mutate(() => { const a = annoById(id); if (a) Object.assign(a, patch); }, { coalesce: true }); }
  function deleteAnno(id) { mutate(() => { state.annotations = state.annotations.filter((a) => a.id !== id); if (state.selectedAnno === id) state.selectedAnno = null; }, { reinspect: true }); }

  /* ===================== interactions ===================== */
  let drag = null;
  let marqueeEl = null;

  function onCanvasMouseDown(e) {
    if (e.button !== 0) return;
    if (e.target.closest(".node") || e.target.closest(".handle")) return; // handled by node listener
    closeMenu();
    if (state.selectedAnno) { state.selectedAnno = null; renderFrames(); renderAnnotations(); renderInspector(); }
    if (e.shiftKey) {
      const w0 = screenToWorld(e.clientX, e.clientY);
      marqueeEl = document.createElement("div"); marqueeEl.className = "marquee"; dom.canvas.appendChild(marqueeEl);
      drag = { kind: "marquee", sx: e.clientX, sy: e.clientY, w0: w0, base: state.selectedIds.slice() };
    } else {
      select(null);
      drag = { kind: "pan", sx: e.clientX, sy: e.clientY, ox: state.view.x, oy: state.view.y };
      dom.canvas.classList.add("panning");
    }
  }
  function onNodesMouseDown(e) {
    if (e.button !== 0) return;
    const handle = e.target.closest(".handle");
    if (handle) { e.stopPropagation(); startConnect(handle, e); return; }
    const nodeEl = e.target.closest(".node");
    if (!nodeEl) return;
    e.stopPropagation();
    const id = nodeEl.dataset.id;
    if (e.shiftKey) { select(id, true); return; } // toggle membership, no drag
    if (state.selectedIds.indexOf(id) < 0) select(id); // collapse to this node
    const ids = state.selectedIds.slice();
    pushHistory("commit");
    const orig = {}; ids.forEach((i) => { const nn = nodeById(i); if (nn) orig[i] = { x: nn.x, y: nn.y }; });
    drag = { kind: "node", ids: ids, sx: e.clientX, sy: e.clientY, orig: orig, moved: false };
  }
  function startConnect(handle, e) {
    closeMenu();
    drag = { kind: "connect", sourceId: handle.dataset.id, sourceSide: handle.dataset.side };
    dom.connectLayer.style.display = "block";
  }
  function onFrameMouseDown(e) {
    if (e.button !== 0) return;
    const rz = e.target.closest("[data-resize]");
    if (rz) { e.stopPropagation(); const a = annoById(rz.dataset.resize); if (!a) return; selectAnno(a.id); pushHistory("commit"); drag = { kind: "frame-resize", id: a.id, sx: e.clientX, sy: e.clientY, w0: a.w, h0: a.h, moved: false }; return; }
    const fr = e.target.closest(".frame"); if (!fr) return;
    e.stopPropagation(); const id = fr.dataset.anno; selectAnno(id);
    const a = annoById(id); pushHistory("commit");
    drag = { kind: "anno-move", id: id, sx: e.clientX, sy: e.clientY, ox: a.x, oy: a.y, moved: false };
  }
  function onAnnoMouseDown(e) {
    if (e.button !== 0) return;
    const el = e.target.closest(".anno-text,.anno-icon"); if (!el) return;
    e.stopPropagation(); const id = el.dataset.anno; selectAnno(id);
    const a = annoById(id); pushHistory("commit");
    drag = { kind: "anno-move", id: id, sx: e.clientX, sy: e.clientY, ox: a.x, oy: a.y, moved: false };
  }
  function onMouseMove(e) {
    if (!drag) return;
    if (drag.kind === "pan") {
      state.view.x = drag.ox + (e.clientX - drag.sx);
      state.view.y = drag.oy + (e.clientY - drag.sy);
      applyTransform();
    } else if (drag.kind === "node") {
      const dx = (e.clientX - drag.sx) / state.view.k, dy = (e.clientY - drag.sy) / state.view.k;
      drag.ids.forEach((i) => {
        const nn = nodeById(i); if (!nn || !drag.orig[i]) return;
        nn.x = snap(drag.orig[i].x + dx); nn.y = snap(drag.orig[i].y + dy);
        const el = dom.nodes.querySelector('.node[data-id="' + i + '"]');
        if (el) { el.style.left = nn.x + "px"; el.style.top = nn.y + "px"; }
      });
      drag.moved = true; redrawEdges(); drawMinimap();
    } else if (drag.kind === "anno-move") {
      const a = annoById(drag.id); if (!a) return;
      a.x = snap(drag.ox + (e.clientX - drag.sx) / state.view.k);
      a.y = snap(drag.oy + (e.clientY - drag.sy) / state.view.k);
      drag.moved = true;
      const el = dom.frames.querySelector('[data-anno="' + drag.id + '"]') || dom.annotations.querySelector('[data-anno="' + drag.id + '"]');
      if (el) { el.style.left = a.x + "px"; el.style.top = a.y + "px"; }
    } else if (drag.kind === "frame-resize") {
      const a = annoById(drag.id); if (!a) return;
      a.w = Math.max(80, snap(drag.w0 + (e.clientX - drag.sx) / state.view.k));
      a.h = Math.max(60, snap(drag.h0 + (e.clientY - drag.sy) / state.view.k));
      drag.moved = true;
      const el = dom.frames.querySelector('[data-anno="' + drag.id + '"]');
      if (el) { el.style.width = a.w + "px"; el.style.height = a.h + "px"; }
    } else if (drag.kind === "marquee") {
      const r = canvasRect();
      const x1 = drag.sx - r.left, y1 = drag.sy - r.top, x2 = e.clientX - r.left, y2 = e.clientY - r.top;
      marqueeEl.style.left = Math.min(x1, x2) + "px"; marqueeEl.style.top = Math.min(y1, y2) + "px";
      marqueeEl.style.width = Math.abs(x2 - x1) + "px"; marqueeEl.style.height = Math.abs(y2 - y1) + "px";
      const w2 = screenToWorld(e.clientX, e.clientY);
      const rx1 = Math.min(drag.w0.x, w2.x), ry1 = Math.min(drag.w0.y, w2.y), rx2 = Math.max(drag.w0.x, w2.x), ry2 = Math.max(drag.w0.y, w2.y);
      const set = new Set(drag.base);
      state.nodes.forEach((n) => { const s = nodeSize(n.id); if (n.x < rx2 && n.x + s.w > rx1 && n.y < ry2 && n.y + s.h > ry1) set.add(n.id); });
      state.selectedIds = Array.from(set);
      dom.nodes.querySelectorAll(".node").forEach((el) => el.classList.toggle("selected", set.has(el.dataset.id)));
    } else if (drag.kind === "connect") {
      const src = nodeById(drag.sourceId); if (!src) return;
      const p = handlePoint(src, drag.sourceSide);
      const r = canvasRect();
      const s1x = p.x * state.view.k + state.view.x, s1y = p.y * state.view.k + state.view.y;
      const cx = e.clientX - r.left, cy = e.clientY - r.top;
      dom.connectPath.setAttribute("d", "M" + s1x + "," + s1y + " L" + cx + "," + cy);
    }
  }
  function onMouseUp(e) {
    if (!drag) return;
    if (drag.kind === "pan") dom.canvas.classList.remove("panning");
    else if (drag.kind === "node" || drag.kind === "anno-move" || drag.kind === "frame-resize") {
      if (drag.moved) afterChange();
      else state.past.pop(); // no movement -> discard the snapshot we took
    } else if (drag.kind === "marquee") {
      if (marqueeEl) { marqueeEl.remove(); marqueeEl = null; }
      state.selectedId = state.selectedIds.length ? state.selectedIds[state.selectedIds.length - 1] : null;
      renderInspector();
    } else if (drag.kind === "connect") {
      dom.connectLayer.style.display = "none";
      const target = document.elementFromPoint(e.clientX, e.clientY);
      const th = target && target.closest && target.closest(".handle");
      if (th && th.dataset.id !== drag.sourceId) {
        mutate(() => { state.edges.push({ id: uid(), source: drag.sourceId, sourceHandle: drag.sourceSide, target: th.dataset.id, targetHandle: th.dataset.side }); });
      }
    }
    drag = null;
  }

  function onWheel(e) { e.preventDefault(); zoomAt(e.clientX, e.clientY, e.deltaY < 0 ? 1.1 : 1 / 1.1); }

  /* ---------- keyboard ---------- */
  function isTyping(t) { return t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable); }
  function onKey(e) {
    if (isTyping(e.target)) return;
    const mod = e.ctrlKey || e.metaKey, k = e.key.toLowerCase();
    if (mod && k === "z") { e.preventDefault(); e.shiftKey ? redo() : undo(); }
    else if (mod && k === "y") { e.preventDefault(); redo(); }
    else if (mod && k === "c") { if (state.selectedId) { e.preventDefault(); copyNode(state.selectedId); } }
    else if (mod && k === "x") { if (state.selectedId) { e.preventDefault(); cutNode(state.selectedId); } }
    else if (mod && k === "v") { e.preventDefault(); pasteNode(); }
    else if (mod && k === "d") { if (state.selectedId) { e.preventDefault(); duplicateNode(state.selectedId); } }
    else if (k === "delete" || k === "backspace") { if (state.selectedAnno) { e.preventDefault(); deleteAnno(state.selectedAnno); } else if (state.selectedId) { e.preventDefault(); deleteNode(state.selectedId); } }
    else if (k === "escape") { select(null); closeMenu(); closeSettings(); }
  }

  /* ===================== palette + topbar ===================== */
  function renderPalette() {
    let h = "";
    PALETTE.forEach((g) => {
      h += '<div class="palette-group"><div class="group-title">' + g.title + "</div>";
      g.types.forEach((t) => {
        const cfg = CONFIG[t], sub = cfg.category === "sub";
        h += '<div class="palette-item' + (sub ? " sub" : "") + '" draggable="true" data-type="' + t + '">';
        h += '<span class="stripe" style="background:' + cfg.accent + ";height:" + (sub ? 18 : 28) + 'px"></span>';
        h += '<span class="chip" style="background:' + cfg.accent + "16;color:" + cfg.accent + '">' + svg(cfg.icon) + "</span>";
        h += '<div><div class="pi-title">' + cfg.label + "</div>" + (sub ? "" : '<div class="pi-desc">' + cfg.desc + "</div>") + "</div></div>";
      });
      h += "</div>";
    });
    h += '<div class="palette-group"><div class="group-title">Annotations</div>';
    ANNO_PALETTE.forEach((a) => {
      h += '<div class="palette-item sub" draggable="true" data-type="anno:' + a.kind + '">';
      h += '<span class="stripe" style="background:#9aa3af;height:18px"></span>';
      h += '<span class="chip" style="background:#9aa3af16;color:#6b7280">' + svg(a.icon) + "</span>";
      h += '<div><div class="pi-title">' + a.label + "</div></div></div>";
    });
    h += "</div>";
    dom.palette.innerHTML = h;
    dom.palette.querySelectorAll(".palette-item").forEach((el) => el.addEventListener("dragstart", (e) => e.dataTransfer.setData("text/type", el.dataset.type)));
  }

  function bindTopbar() {
    document.querySelectorAll("[data-action]").forEach((el) => el.addEventListener("click", () => {
      const a = el.dataset.action;
      if (a === "undo") undo();
      else if (a === "redo") redo();
      else if (a === "tidy") tidyLayout();
      else if (a === "sample") { state.past = []; state.future = []; loadSample(); }
      else if (a === "import") dom.fileInput.click();
      else if (a === "export-json") exportJson();
      else if (a === "export-png") exportPng();
      else if (a === "zoom-in") { const r = canvasRect(); zoomAt(r.left + r.width / 2, r.top + r.height / 2, 1.15); }
      else if (a === "zoom-out") { const r = canvasRect(); zoomAt(r.left + r.width / 2, r.top + r.height / 2, 1 / 1.15); }
      else if (a === "fit") fitView();
      else if (a === "settings") openSettings(el);
    }));
    dom.docName.addEventListener("input", () => { state.docName = dom.docName.value; save(); });
    dom.fileInput.addEventListener("change", () => { if (dom.fileInput.files[0]) importJson(dom.fileInput.files[0]); dom.fileInput.value = ""; });
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
      "<h4>Settings</h4>" +
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
      '<div class="settings-row"><span>Background</span><input type="color" class="color-input" data-set="exportBg" value="' + (s.exportBg || "#f6f7f9") + '"></div>' +
      '<div class="settings-row" style="display:block"><span style="display:block;margin-bottom:4px">Description (export header)</span><textarea class="input" rows="2" data-doc="description" placeholder="Shown top-left of the exported image…">' + esc(state.docDescription) + "</textarea></div>" +
      '<div class="settings-row"><span>Logo (top-right)</span><div style="display:flex;gap:6px"><button class="add-btn" data-logo-pick>' + (s.logo ? "Change" : "Upload") + "</button>" + (s.logo ? '<button class="add-btn" data-logo-clear>Remove</button>' : "") + "</div></div>" +
      '<input type="file" accept="image/*" data-logo-file hidden>';
    document.body.appendChild(panel);
    const r = anchor.getBoundingClientRect();
    panel.style.top = r.bottom + 8 + "px";
    panel.style.left = Math.min(r.left, window.innerWidth - 256) + "px";

    panel.querySelectorAll("[data-switch]").forEach((el) => el.addEventListener("click", () => {
      const key = el.dataset.switch.split(":")[1];
      state.settings[key] = !state.settings[key];
      el.classList.toggle("on");
      saveSettings(); applySettings(); drawMinimap();
    }));
    panel.querySelector("[data-set=grid]").addEventListener("change", (e) => {
      state.settings.grid = Number(e.target.value); saveSettings(); applySettings();
    });
    panel.querySelector("[data-set=edgeStyle]").addEventListener("change", (e) => {
      state.settings.edgeStyle = e.target.value; saveSettings(); redrawEdges();
    });
    panel.querySelector("[data-set=edgeWidth]").addEventListener("change", (e) => {
      state.settings.edgeWidth = Number(e.target.value); saveSettings(); applySettings();
    });
    panel.querySelector("[data-set=edgeColor]").addEventListener("input", (e) => {
      state.settings.edgeColor = e.target.value; saveSettings(); applySettings();
    });
    panel.querySelector("[data-set=exportBg]").addEventListener("input", (e) => {
      state.settings.exportBg = e.target.value; saveSettings();
    });
    panel.querySelector("[data-doc=description]").addEventListener("input", (e) => {
      state.docDescription = e.target.value; save();
    });
    const fileEl = panel.querySelector("[data-logo-file]");
    panel.querySelector("[data-logo-pick]").addEventListener("click", () => fileEl.click());
    fileEl.addEventListener("change", () => {
      const f = fileEl.files[0]; if (!f) return;
      const r = new FileReader();
      r.onload = () => { state.settings.logo = r.result; saveSettings(); closeSettings(); openSettings(anchor); };
      r.readAsDataURL(f);
    });
    const clr = panel.querySelector("[data-logo-clear]");
    if (clr) clr.addEventListener("click", () => { state.settings.logo = null; saveSettings(); closeSettings(); openSettings(anchor); });
  }

  /* ===================== init ===================== */
  function bindCanvas() {
    dom.canvas.addEventListener("mousedown", onCanvasMouseDown);
    dom.nodes.addEventListener("mousedown", onNodesMouseDown);
    dom.nodes.addEventListener("contextmenu", (e) => { const el = e.target.closest(".node"); if (!el) return; e.preventDefault(); e.stopPropagation(); const id = el.dataset.id; if (state.selectedIds.indexOf(id) < 0) select(id); openMenu("node", e.clientX, e.clientY, id); });
    dom.canvas.addEventListener("contextmenu", (e) => { if (e.target.closest(".node")) return; e.preventDefault(); openMenu("pane", e.clientX, e.clientY, null, screenToWorld(e.clientX, e.clientY)); });
    dom.canvas.addEventListener("wheel", onWheel, { passive: false });
    dom.canvas.addEventListener("dragover", (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "copy"; });
    dom.canvas.addEventListener("drop", (e) => { e.preventDefault(); const t = e.dataTransfer.getData("text/type"); if (!t) return; const p = screenToWorld(e.clientX, e.clientY); if (t.indexOf("anno:") === 0) addAnnotationAt(t.slice(5), p); else if (CONFIG[t]) addNodeAt(t, p); });
    dom.frames.addEventListener("mousedown", onFrameMouseDown);
    dom.annotations.addEventListener("mousedown", onAnnoMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", drawMinimap);
  }

  function loadSample() { state.nodes = clone(SAMPLE.nodes).map(normalizeNode); state.edges = clone(SAMPLE.edges); state.annotations = clone(SAMPLE.annotations || []); state.docName = SAMPLE.name; state.docDescription = SAMPLE.description || ""; state.selectedId = null; state.selectedIds = []; state.selectedAnno = null; renderAll(); requestAnimationFrame(() => { redrawEdges(); drawMinimap(); fitView(); }); }

  function init() {
    dom = {
      canvas: $("#canvas"), viewport: $("#viewport"), nodes: $("#nodes"), edges: $("#edges"),
      inspector: $("#inspector"), palette: $("#palette"), menu: $("#contextmenu"),
      connectLayer: $("#connect-layer"), connectPath: $("#connect-path"), frames: $("#frames"), annotations: $("#annotations"),
      minimap: $("#minimap"), minimapSvg: $("#minimap-svg"), docName: $("#doc-name"), fileInput: $("#file-input"),
      undoBtn: $('[data-action="undo"]'), redoBtn: $('[data-action="redo"]'),
    };
    document.querySelectorAll("[data-icon]").forEach((el) => (el.innerHTML = svg(el.dataset.icon)));
    loadSettings(); applySettings();
    renderPalette(); bindTopbar(); bindCanvas();
    applyTransform();
    const saved = load();
    if (saved) { state.nodes = saved.nodes.map(normalizeNode); state.edges = (saved.edges || []).map((e) => ({ id: e.id || uid(), source: e.source, target: e.target, sourceHandle: e.sourceHandle || "bottom", targetHandle: e.targetHandle || "top" })); state.docName = saved.name || "Untitled architecture"; state.docDescription = saved.description || ""; state.annotations = Array.isArray(saved.annotations) ? saved.annotations : []; renderAll(); requestAnimationFrame(() => { redrawEdges(); drawMinimap(); fitView(); }); }
    else loadSample();
  }

  /* ===================== sample ===================== */
  const SAMPLE = {
    name: "HR Intranet — example",
    description: "Information architecture & permissions for the HR intranet.",
    nodes: [
      { id: "comm", type: "communicationSite", x: 96, y: 48, label: "HR Hub", description: "Company-wide HR intranet", notes: "Public landing site for all employees.", teamsEnabled: false, channels: [], cardDisplay: {}, icon: null, color: null, metadata: [{ id: "m1", key: "Owner dept", value: "People & Culture" }], security: { inheritsFromParent: false, permissions: [{ id: "c1", principal: "HR Hub Owners", principalType: "group", role: "owner" }, { id: "c2", principal: "HR Hub Members", principalType: "group", role: "contribute" }, { id: "c3", principal: "HR Hub Visitors", principalType: "group", role: "read" }] } },
      { id: "welcome", type: "page", x: 96, y: 256, label: "Welcome", description: "Landing page", notes: "", teamsEnabled: false, channels: [], cardDisplay: {}, icon: null, color: null, metadata: [], security: { inheritsFromParent: true, permissions: [] } },
      { id: "policies", type: "documentLibrary", x: 432, y: 256, label: "Policies", description: "Published HR policies", notes: "Read-only for staff.", teamsEnabled: false, channels: [], cardDisplay: {}, icon: null, color: null, metadata: [{ id: "m2", key: "Retention", value: "7 years" }], security: { inheritsFromParent: true, permissions: [] } },
      { id: "dept", type: "metadata", x: 432, y: 416, label: "Department", description: "Managed term set", notes: "", teamsEnabled: false, channels: [], cardDisplay: {}, icon: null, color: null, metadata: [{ id: "m4", key: "Terms", value: "HR, IT, Finance" }], security: { inheritsFromParent: true, permissions: [] } },
      { id: "ops", type: "teamSite", x: 800, y: 48, label: "HR Operations", description: "Internal HR collaboration", notes: "Restricted — HR staff only.", teamsEnabled: true, channels: [{ id: "ch1", name: "General", kind: "standard" }, { id: "ch2", name: "Recruitment", kind: "private" }, { id: "ch3", name: "Payroll", kind: "shared" }], cardDisplay: { channels: true }, icon: null, color: null, metadata: [], security: { inheritsFromParent: false, permissions: [{ id: "p1", principal: "HR Operations Owners", principalType: "group", role: "owner" }, { id: "p2", principal: "HR Operations Members", principalType: "group", role: "contribute" }, { id: "p3", principal: "HR Operations Visitors", principalType: "group", role: "read" }] } },
      { id: "contracts", type: "documentLibrary", x: 800, y: 336, label: "Contracts", description: "Confidential contracts", notes: "Legal reviews every contract.", teamsEnabled: false, channels: [], cardDisplay: { permissions: true, storage: true }, icon: null, color: null, sensitivity: "highlyConfidential", externalSharing: "blocked", storage: { quota: "50 GB", items: "8,200", retention: "10 years" }, metadata: [], security: { inheritsFromParent: false, permissions: [{ id: "p4", principal: "HR Operations Owners", principalType: "group", role: "fullControl" }, { id: "p5", principal: "Legal", principalType: "group", role: "contribute" }, { id: "p6", principal: "Everyone except external users", principalType: "group", role: "read" }] } },
      { id: "y2026", type: "folder", x: 1152, y: 336, label: "2026", description: "Signed in 2026", notes: "", teamsEnabled: false, channels: [], cardDisplay: {}, icon: null, color: null, metadata: [], security: { inheritsFromParent: true, permissions: [] } },
    ],
    edges: [
      { id: "e1", source: "comm", sourceHandle: "bottom", target: "welcome", targetHandle: "top" },
      { id: "e2", source: "comm", sourceHandle: "right", target: "policies", targetHandle: "top" },
      { id: "e3", source: "policies", sourceHandle: "bottom", target: "dept", targetHandle: "top" },
      { id: "e4", source: "comm", sourceHandle: "right", target: "ops", targetHandle: "left" },
      { id: "e5", source: "ops", sourceHandle: "bottom", target: "contracts", targetHandle: "top" },
      { id: "e6", source: "contracts", sourceHandle: "right", target: "y2026", targetHandle: "left" },
    ],
    annotations: [
      { id: "fr1", kind: "frame", x: 768, y: 16, w: 576, h: 544, color: "#3b6fb0", label: "HR Operations group" },
      { id: "tx1", kind: "text", x: 96, y: 460, text: "Public surface", color: "#7a5cb8", size: 18 },
      { id: "ic1", kind: "icon", icon: "person", x: 320, y: 470, color: "#3b6fb0", size: 36 },
    ],
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
