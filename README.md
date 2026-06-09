# SharePoint Architect — static edition

A visual, drag-and-drop editor for designing SharePoint information architecture
(sites, libraries, pages, folders, metadata) with an integrated **security model**
and **Microsoft Teams / channels** — built as **plain HTML + CSS + JS with zero
dependencies and no build step**. Just open `index.html`.

This is a self-contained port of the Next.js version, made to host for free on
GitHub Pages (or any static host) without npm, Node, or a build.

---

## Files

```
sharepoint-architect-static/
├─ index.html     # markup (topbar, sidebar, canvas, inspector)
├─ styles.css     # full design system
└─ app.js         # all logic (no libraries)
```

No `node_modules`, no bundler, nothing to install.

---

## Run locally

Just **double-click `index.html`** — it opens in your browser and works offline.

(Optional) to serve it like it will be online, run any static server, e.g.
`python -m http.server` in this folder, then open `http://localhost:8000`.

---

## Host free on GitHub Pages

1. Create a new repo on GitHub (e.g. `sharepoint-architect`).
2. Put these three files in the repo **root** and push:
   ```bash
   git init
   git add index.html styles.css app.js README.md
   git commit -m "SharePoint Architect (static)"
   git branch -M main
   git remote add origin https://github.com/<you>/sharepoint-architect.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: **main**, folder: **/ (root)** → Save.
4. Wait ~1 minute. Your app is live at
   `https://<you>.github.io/sharepoint-architect/`.

That's it — no Actions, no build, no secrets. Editing a file and pushing
re-publishes automatically.

> Tip: you can also just drag the folder onto **Netlify Drop**
> (app.netlify.com/drop) or **Cloudflare Pages** for instant hosting.

---

## Features

- **Canvas** — drag from the sidebar, pan (drag background), zoom (wheel /
  buttons), **live snap-to-grid** while dragging, connect on **all four sides**,
  minimap.
- **Settings** (gear icon, top-right) — toggle snap-to-grid, change grid size,
  show/hide the grid and the minimap, choose **curved or straight connections**,
  set the **line thickness** and **line color** for all connections, and configure
  the **export** (background color, a **logo** for the top-right, and a
  **description** for the top-left header). Saved between sessions.
- **Branded PNG export** — the exported image uses your chosen background color and
  (when the **header** toggle is on) carries a header: the document **name +
  description** top-left and your **logo** top-right (text auto-switches to light on
  dark backgrounds). Frames, text and stickers are included; lines render smoothed.
- **Multi-select** — Shift+click nodes to add/remove, or **Shift+drag** the canvas
  to rubber-band select. Drag any selected node to move the whole group. The
  inspector then offers **bulk actions**: recolor, set sensitivity, inherit/break
  permissions, align (left/top/center) and distribute. Copy / cut / paste /
  duplicate / delete all act on the whole selection.
- **Governance per node** — a **sensitivity label** (Public / Internal /
  Confidential / Highly Confidential) and an **external-sharing** flag
  (Enabled / Blocked), shown as badges on the card.
- **Storage & retention** — quota, item count and retention per site / library /
  folder, optionally shown on the card.
- **10 node types** — Team Site, Communication Site, Document Library,
  SharePoint List, Page, Planner, Group Mailbox, Group Forms, Folder, Metadata.
  Sub-items render as compact cards; the rest as full cards with a colored top bar.
- **Annotations** (drag from the *Annotations* group in the sidebar) —
  **Frames** (semi-transparent tinted boxes to group nodes, resizable + labelled),
  **free-floating Text**, and **icon stickers** (Person, Mail, Building, Country),
  each with its own color. Lightweight — no permissions/security, just a few props.
- **Microsoft Teams** — a Team Site has a **Teams-connected** switch; when on, a
  Teams glyph shows on the card and you manage **channels** (Standard / Private /
  Shared) in the Inspector.
- **Security per node** — inherit toggle, `{ principal, role }` permissions,
  inheriting nodes show a waterfall icon, broken inheritance shows a red banner.
  Sites auto-get **Owners / Members / Visitors** named after the site (renaming
  the site renames only *its own* groups). Pick existing groups (or *Everyone
  except external users*) from the dropdown.
- **Show on card** — toggle Description / Metadata / Channels / Permissions.
- **Appearance** — per-node color swatches and icon picker.
- **Right-click menu** — node: color, add child, add/remove Teams, break/restore
  inheritance, reset groups, duplicate, copy, cut, delete. Canvas: add node,
  paste here, tidy layout, fit.
- **Shortcuts** — Ctrl/⌘ + C / X / V / D, Delete, Esc, Ctrl/⌘+Z / Shift+Z
  (undo/redo).
- **Undo / Redo**, **auto-tidy layout**.
- **Export** — PNG (renders every visible section — notes, banners, badges,
  channels, permissions — with rounded corners) + JSON. **Import** JSON (also
  accepts the Next.js version's JSON). **Auto-save** to `localStorage`.

---

## Notes / trade-offs

- The canvas engine (pan/zoom/drag/connect) is hand-written vanilla JS — no React
  Flow — to keep the app dependency-free and offline. It covers all the features
  but is simpler than the React Flow version.
- Designs are saved in your browser's `localStorage`. Use **Export JSON** to keep
  a portable copy or share a design.
