/* ===== SharePoint Architect — bootstrap, topbar wiring & sample ===== */
"use strict";

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
    else if (a === "present") setPresent(true);
    else if (a === "present-exit") setPresent(false);
    else if (a === "toggle-nav") { state.settings.sidebarCollapsed = !state.settings.sidebarCollapsed; saveSettings(); applySettings(); }
    else if (a === "settings") openSettings(el);
  }));
  dom.docName.addEventListener("input", () => { state.docName = dom.docName.value; save(); });
  dom.fileInput.addEventListener("change", () => { if (dom.fileInput.files[0]) importJson(dom.fileInput.files[0]); dom.fileInput.value = ""; });
  dom.paletteSearch.addEventListener("input", () => renderPalette(dom.paletteSearch.value));
}

function bindCanvas() {
  dom.canvas.addEventListener("mousedown", onCanvasMouseDown);
  dom.nodes.addEventListener("mousedown", onNodesMouseDown);
  dom.nodes.addEventListener("dblclick", onNodesDblClick);
  dom.nodes.addEventListener("contextmenu", (e) => {
    const nested = e.target.closest(".nested-item");
    const el = e.target.closest(".node");
    if (!nested && !el) return;
    e.preventDefault(); e.stopPropagation();
    const id = nested ? nested.dataset.nid : el.dataset.id;
    if (state.selectedIds.indexOf(id) < 0) select(id);
    openMenu("node", e.clientX, e.clientY, id);
  });
  dom.canvas.addEventListener("contextmenu", (e) => {
    if (e.target.closest(".node")) return;
    e.preventDefault();
    const w = screenToWorld(e.clientX, e.clientY);
    const edgeId = edgeAt(w);
    if (edgeId) { openMenu("edge", e.clientX, e.clientY, edgeId); return; }
    openMenu("pane", e.clientX, e.clientY, null, w);
  });
  dom.canvas.addEventListener("wheel", onWheel, { passive: false });
  dom.canvas.addEventListener("dragover", (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "copy"; });
  dom.canvas.addEventListener("drop", (e) => {
    e.preventDefault();
    const t = e.dataTransfer.getData("text/type"); if (!t) return;
    const p = screenToWorld(e.clientX, e.clientY);
    if (t.indexOf("anno:") === 0) { addAnnotationAt(t.slice(5), p); return; }
    if (!CONFIG[t]) return;
    // dropping a sub-item straight onto a container nests it inside that card
    if (CONFIG[t].category === "sub") {
      for (let i = state.nodes.length - 1; i >= 0; i--) {
        const c = state.nodes[i];
        if (c.parentId || CONFIG[c.type].category === "sub") continue;
        const s = nodeSize(c.id);
        if (p.x >= c.x && p.x <= c.x + s.w && p.y >= c.y && p.y <= c.y + s.h) { addNestedChild(c.id, t); return; }
      }
    }
    addNodeAt(t, p);
  });
  dom.frames.addEventListener("mousedown", onFrameMouseDown);
  dom.annotations.addEventListener("mousedown", onAnnoMouseDown);
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
  window.addEventListener("keydown", onKey);
  window.addEventListener("resize", drawMinimap);
  document.addEventListener("fullscreenchange", () => { if (!document.fullscreenElement && presenting) setPresent(false); });
}

function loadSample() {
  state.nodes = clone(SAMPLE.nodes).map(normalizeNode); state.edges = clone(SAMPLE.edges); state.annotations = clone(SAMPLE.annotations || []);
  state.docName = SAMPLE.name; state.docDescription = SAMPLE.description || "";
  state.selectedId = null; state.selectedIds = []; state.selectedAnno = null;
  renderAll(); requestAnimationFrame(() => { redrawEdges(); drawMinimap(); fitView(); });
}

function init() {
  dom = {
    app: $("#app"), presentExit: $("#present-exit"),
    canvas: $("#canvas"), viewport: $("#viewport"), nodes: $("#nodes"), edges: $("#edges"),
    inspector: $("#inspector"), palette: $("#palette"), paletteSearch: $("#palette-search"), menu: $("#contextmenu"),
    connectLayer: $("#connect-layer"), connectPath: $("#connect-path"), frames: $("#frames"), annotations: $("#annotations"),
    minimap: $("#minimap"), minimapSvg: $("#minimap-svg"), docName: $("#doc-name"), fileInput: $("#file-input"),
    zoomLabel: $("#zoom-label"),
    undoBtn: $('[data-action="undo"]'), redoBtn: $('[data-action="redo"]'),
  };
  document.querySelectorAll("[data-icon]").forEach((el) => (el.innerHTML = svg(el.dataset.icon)));
  loadSettings(); applySettings();
  renderPalette(); bindTopbar(); bindCanvas();
  applyTransform();
  const saved = load();
  if (saved) {
    state.nodes = saved.nodes.map(normalizeNode);
    state.edges = (saved.edges || []).map((e) => ({ id: e.id || uid(), source: e.source, target: e.target, sourceHandle: e.sourceHandle || "bottom", targetHandle: e.targetHandle || "top" }));
    state.docName = saved.name || "Untitled architecture"; state.docDescription = saved.description || "";
    state.annotations = Array.isArray(saved.annotations) ? saved.annotations : [];
    renderAll(); requestAnimationFrame(() => { redrawEdges(); drawMinimap(); fitView(); });
  } else loadSample();
}

/* ===================== sample: a best-practice flat IA with a hub ===================== */
const SAMPLE = {
  name: "Contoso Intranet — example",
  description: "Hub-based information architecture & permissions, following Microsoft's flat-structure guidance.",
  nodes: [
    { id: "hub", type: "hubSite", x: 460, y: 32, label: "Intranet Hub", description: "Shared navigation, branding and search scope", notes: "Sites associate to the hub — no nested subsites.", security: { inheritsFromParent: false, permissions: [{ id: "h1", principal: "Intranet Hub Owners", principalType: "group", role: "owner" }, { id: "h2", principal: "Intranet Hub Members", principalType: "group", role: "contribute" }, { id: "h3", principal: "Intranet Hub Visitors", principalType: "group", role: "read" }] } },
    { id: "comm", type: "communicationSite", x: 96, y: 240, label: "HR Hub", description: "Company-wide HR intranet", notes: "Public landing site for all employees.", metadata: [{ id: "m1", key: "Owner dept", value: "People & Culture" }], security: { inheritsFromParent: false, permissions: [{ id: "c1", principal: "HR Hub Owners", principalType: "group", role: "owner" }, { id: "c2", principal: "HR Hub Members", principalType: "group", role: "contribute" }, { id: "c3", principal: "HR Hub Visitors", principalType: "group", role: "read" }] } },
    { id: "welcome", type: "page", x: 96, y: 470, label: "Welcome", description: "Landing page", security: { inheritsFromParent: true, permissions: [] } },
    { id: "policies", type: "documentLibrary", x: 420, y: 470, label: "Policies", description: "Published HR policies", notes: "Read-only for staff.", metadata: [{ id: "m2", key: "Retention", value: "7 years" }], security: { inheritsFromParent: true, permissions: [] } },
    { id: "dept", type: "metadata", x: 420, y: 660, label: "Department", description: "Managed term set", metadata: [{ id: "m4", key: "Terms", value: "HR, IT, Finance" }], security: { inheritsFromParent: true, permissions: [] } },
    { id: "ops", type: "teamSite", x: 860, y: 240, label: "HR Operations", description: "Internal HR collaboration", notes: "Restricted — HR staff only.", teamsEnabled: true, channels: [{ id: "ch1", name: "General", kind: "standard" }, { id: "ch2", name: "Recruitment", kind: "private" }, { id: "ch3", name: "Payroll", kind: "shared" }], cardDisplay: { channels: true }, security: { inheritsFromParent: false, permissions: [{ id: "p1", principal: "HR Operations Owners", principalType: "group", role: "owner" }, { id: "p2", principal: "HR Operations Members", principalType: "group", role: "contribute" }, { id: "p3", principal: "HR Operations Visitors", principalType: "group", role: "read" }] } },
    { id: "contracts", type: "documentLibrary", x: 860, y: 540, label: "Contracts", description: "Confidential contracts", notes: "Legal reviews every contract.", cardDisplay: { permissions: true, storage: true }, sensitivity: "highlyConfidential", externalSharing: "blocked", storage: { quota: "50 GB", items: "8,200", retention: "10 years" }, security: { inheritsFromParent: false, permissions: [{ id: "p4", principal: "HR Operations Owners", principalType: "group", role: "fullControl" }, { id: "p5", principal: "Legal", principalType: "group", role: "contribute" }, { id: "p6", principal: "Everyone except external users", principalType: "group", role: "read" }] } },
    { id: "y2026", type: "folder", x: 1220, y: 540, label: "2026", description: "Signed in 2026", parentId: "contracts", security: { inheritsFromParent: true, permissions: [] } },
    { id: "ctype", type: "contentType", x: 1220, y: 680, label: "Contract", parentId: "contracts", notes: "Inherits from Document.", metadata: [{ id: "m5", key: "Columns", value: "Party, Value, Expiry" }], security: { inheritsFromParent: true, permissions: [] } },
  ],
  edges: [
    { id: "e0", source: "hub", sourceHandle: "left", target: "comm", targetHandle: "top" },
    { id: "e0b", source: "hub", sourceHandle: "right", target: "ops", targetHandle: "top" },
    { id: "e1", source: "comm", sourceHandle: "bottom", target: "welcome", targetHandle: "top" },
    { id: "e2", source: "comm", sourceHandle: "bottom", target: "policies", targetHandle: "top" },
    { id: "e3", source: "policies", sourceHandle: "bottom", target: "dept", targetHandle: "top" },
    { id: "e5", source: "ops", sourceHandle: "bottom", target: "contracts", targetHandle: "top" },
  ],
  annotations: [
    { id: "fr1", kind: "frame", x: 828, y: 200, w: 640, h: 580, color: "#3b6fb0", label: "HR Operations group" },
    { id: "tx1", kind: "text", x: 96, y: 700, text: "Public surface", color: "#7a5cb8", size: 18 },
    { id: "ic1", kind: "icon", icon: "person", x: 300, y: 706, color: "#3b6fb0", size: 36 },
  ],
};

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();
