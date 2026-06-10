/* ===== SharePoint Architect — pointer & keyboard interactions ===== */
"use strict";

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
  if (e.target.tagName === "INPUT") return; // inline title editing
  const handle = e.target.closest(".handle");
  if (handle) { e.stopPropagation(); startConnect(handle, e); return; }
  const nested = e.target.closest(".nested-item");
  if (nested) { e.stopPropagation(); select(nested.dataset.nid, e.shiftKey); return; }
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
  drag = { kind: "connect", sourceId: handle.dataset.id, sourceSide: handle.dataset.side, hoverId: null };
  dom.connectLayer.style.display = "block";
  dom.canvas.classList.add("connecting"); // shows every node's handles while wiring
}
function setHoverTarget(id) {
  if (drag && drag.hoverId === id) return;
  dom.nodes.querySelectorAll(".node.drop-target").forEach((el) => el.classList.remove("drop-target"));
  if (id) { const el = dom.nodes.querySelector('.node[data-id="' + id + '"]'); if (el) el.classList.add("drop-target"); }
  if (drag) drag.hoverId = id;
}
/* nearest side of a node for a world-space point — lets users drop a connection anywhere on a card */
function nearestSide(n, p) {
  const s = nodeSize(n.id);
  const rx = (p.x - (n.x + s.w / 2)) / (s.w / 2), ry = (p.y - (n.y + s.h / 2)) / (s.h / 2);
  return Math.abs(rx) > Math.abs(ry) ? (rx > 0 ? "right" : "left") : (ry > 0 ? "bottom" : "top");
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
    // dragging a single sub-item over a container offers nesting
    if (drag.ids.length === 1) {
      const dn = nodeById(drag.ids[0]);
      if (dn && CONFIG[dn.type].category === "sub") {
        const p = screenToWorld(e.clientX, e.clientY);
        let target = null;
        for (let i = state.nodes.length - 1; i >= 0; i--) {
          const c = state.nodes[i];
          if (c.id === dn.id || c.parentId || CONFIG[c.type].category === "sub") continue;
          const s = nodeSize(c.id);
          if (p.x >= c.x && p.x <= c.x + s.w && p.y >= c.y && p.y <= c.y + s.h) { target = c.id; break; }
        }
        setHoverTarget(target);
        drag.nestTarget = target;
      }
    }
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
    const under = document.elementFromPoint(e.clientX, e.clientY);
    const ne = under && under.closest ? under.closest(".node") : null;
    setHoverTarget(ne && ne.dataset.id !== drag.sourceId ? ne.dataset.id : null);
  }
}
function onMouseUp(e) {
  if (!drag) return;
  if (drag.kind === "pan") dom.canvas.classList.remove("panning");
  else if (drag.kind === "node" || drag.kind === "anno-move" || drag.kind === "frame-resize") {
    if (drag.kind === "node" && drag.nestTarget && drag.moved) {
      // reuses the history snapshot taken at drag start
      nestNodeRaw(drag.ids[0], drag.nestTarget);
      setSelection([drag.ids[0]]);
      setHoverTarget(null);
      afterChange(true);
    } else if (drag.moved) afterChange();
    else state.past.pop(); // no movement -> discard the snapshot we took
    setHoverTarget(null);
  } else if (drag.kind === "marquee") {
    if (marqueeEl) { marqueeEl.remove(); marqueeEl = null; }
    state.selectedId = state.selectedIds.length ? state.selectedIds[state.selectedIds.length - 1] : null;
    renderInspector();
  } else if (drag.kind === "connect") {
    dom.connectLayer.style.display = "none";
    dom.canvas.classList.remove("connecting");
    const target = document.elementFromPoint(e.clientX, e.clientY);
    const th = target && target.closest && target.closest(".handle");
    let tid = null, tside = null;
    if (th && th.dataset.id !== drag.sourceId) { tid = th.dataset.id; tside = th.dataset.side; }
    else {
      // dropping anywhere on a card connects to its nearest side
      const ne = target && target.closest && target.closest(".node");
      if (ne && ne.dataset.id !== drag.sourceId) {
        tid = ne.dataset.id;
        tside = nearestSide(nodeById(tid), screenToWorld(e.clientX, e.clientY));
      }
    }
    setHoverTarget(null);
    if (tid) {
      const src = drag.sourceId, sside = drag.sourceSide;
      mutate(() => { state.edges.push({ id: uid(), source: src, sourceHandle: sside, target: tid, targetHandle: tside }); });
    }
  }
  drag = null;
}

function onWheel(e) { e.preventDefault(); zoomAt(e.clientX, e.clientY, e.deltaY < 0 ? 1.1 : 1 / 1.1); }

/* double-click a node title (or anywhere on the head) to rename in place */
function onNodesDblClick(e) {
  const titleEl = e.target.closest("[data-edit-title]");
  const nodeEl = e.target.closest(".node");
  if (!nodeEl) return;
  e.preventDefault(); e.stopPropagation();
  startTitleEdit(titleEl ? titleEl.dataset.editTitle : nodeEl.dataset.id);
}

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
  else if (k === "f2") { if (state.selectedId) { e.preventDefault(); startTitleEdit(state.selectedId); } }
  else if (k === "delete" || k === "backspace") { if (state.selectedAnno) { e.preventDefault(); deleteAnno(state.selectedAnno); } else if (state.selectedId) { e.preventDefault(); deleteNode(state.selectedId); } }
  else if (k === "escape") { if (presenting) { setPresent(false); return; } select(null); closeMenu(); closeSettings(); }
}
