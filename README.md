# M365 Toolkit — SharePoint Architect & friends

A static, zero-dependency suite of Microsoft 365 tools. No npm, no build step,
no network calls — host it on **GitHub Pages** (or any static host) as-is.

```
sharepoint-suite/
├─ index.html                 # hub homepage — navigation to all sub-apps
├─ shared/
│  ├─ theme.css               # design tokens shared by every app
│  └─ icons.js                # shared inline-SVG icon set (ICONS map + svg())
├─ apps/
│  └─ architect/              # SharePoint Architect (live)
│     ├─ index.html           # markup + script load order
│     ├─ architect.css        # app styles
│     ├─ config.js            # node types, palettes, constants (NODE_W = card widths)
│     ├─ state.js             # state, history, mutate(), node/annotation ops, JSON import/export, persistence
│     ├─ render.js            # canvas cards, edges, minimap, inspector, palette, menus, settings
│     ├─ export.js            # branded PNG export (measure+draw layout engine, legend)
│     ├─ interactions.js      # drag state machine, keyboard shortcuts, inline rename
│     └─ main.js              # init(), topbar wiring, sample document
└─ README.md
```

The files load as plain scripts in order (no ES modules), so the app still works
when `index.html` is opened straight from disk **and** on GitHub Pages.
Top-level `const`/`function` declarations are shared across the files exactly
like the old single-file IIFE — just split into readable modules.

## Roadmap (sub-apps)

The hub is designed for more apps next to the Architect:

- **Security Scan** — Graph-based scan for over-sharing / broken inheritance.
- **Tenant Inventory** — read an existing tenant and import it into the canvas.
- **PnP Provisioning** — generate PnP PowerShell from an Architect design.

Add a folder under `apps/<name>/` and a card on the hub page. Reuse
`shared/theme.css` + `shared/icons.js` for a consistent look. (Graph-connected
apps will need authentication — they can still be static SPAs using MSAL.js,
but they will no longer be fully offline.)

## SharePoint Architect

Visual drag-and-drop editor for SharePoint / Teams information architecture
with a per-node security model, governance fields and branded exports.

### Node types

- **Sites**: Hub Site, Team Site (optionally Teams-connected with channels), Communication Site
- **Content**: Document Library, SharePoint List, Page
- **Microsoft 365 apps**: Planner, Group Mailbox, Group Forms, OneNote Notebook
- **Sub-items** (compact child cards): Folder, Document Set, Content Type, Metadata / term set
- **Annotations**: Frames (tinted grouping boxes), free Text, icon stickers

### Highlights

- Pan / zoom / snap-to-grid canvas, 4-side connections, minimap, zoom indicator
- **Inline rename**: double-click any node title on the canvas (or press **F2**);
  renaming a site renames only its own default Owners/Members/Visitors groups
- Per-node security (inheritance, role assignments), governance (sensitivity
  label, external sharing), storage & retention, metadata, Teams channels
- Multi-select (Shift+click / Shift+drag), bulk recolor / align / distribute
- Sidebar **search filter**, context menus, undo/redo, auto-tidy
- **Branded PNG export**: header (name + description + logo), auto **legend** of
  used node types, configurable background and **export scale (1×/2×/3×)**.
  The export layout engine measures and draws with identical logic and clips or
  wraps every label, so nothing ever renders outside a card.
- JSON export / import — compatible with designs from the previous static
  version and the old Next.js version
- Auto-save to localStorage (same key as the previous version, so an existing
  saved design carries over when hosted on the same origin)

### Deploy on GitHub Pages

1. Push this folder's contents to a repo root.
2. Settings → Pages → Deploy from branch → `main` / root.
3. Done — the hub is at `https://<you>.github.io/<repo>/`.

### Development notes

- After editing any `.js` file, run `node --check <file>` — a syntax error in
  one file prevents that file's functions from defining and blanks the app.
- All user-entered text rendered via innerHTML must go through `esc()`.
- Card widths exist in two places by design: `NODE_W` (config.js, used by the
  export) and the `.node` width rules in architect.css — keep them in sync.
- Every state mutation goes through `mutate()` so history, auto-save and
  re-render stay consistent.
