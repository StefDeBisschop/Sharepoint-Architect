/* ===== SharePoint Architect — node-type config & constants ===== */
"use strict";

const CONFIG = {
  hubSite: { label: "Hub Site", category: "site", icon: "hub", accent: "#8f6f3e", desc: "Connects related sites (navigation, search)" },
  teamSite: { label: "Team Site", category: "site", icon: "users", accent: "#3b6fb0", desc: "Collaboration site (optionally Teams-connected)" },
  communicationSite: { label: "Communication Site", category: "site", icon: "megaphone", accent: "#7a5cb8", desc: "Broadcast / intranet site" },
  documentLibrary: { label: "Document Library", category: "container", icon: "library", accent: "#3f8f66", desc: "Stores documents and files" },
  sharepointList: { label: "SharePoint List", category: "container", icon: "list", accent: "#3f7d8f", desc: "Structured list of items" },
  page: { label: "Page", category: "sub", icon: "fileText", accent: "#c2853c", desc: "Modern SharePoint page" },
  planner: { label: "Planner", category: "container", icon: "planner", accent: "#2f8f5e", desc: "Task board for the group" },
  groupMailbox: { label: "Group Mailbox", category: "container", icon: "mail", accent: "#b0506b", desc: "Shared Microsoft 365 mailbox" },
  groupForms: { label: "Group Forms", category: "container", icon: "clipboardCheck", accent: "#5a6fb0", desc: "Forms owned by the group" },
  oneNote: { label: "OneNote Notebook", category: "container", icon: "bookOpen", accent: "#8a4f9e", desc: "Shared notebook for the site" },
  folder: { label: "Folder", category: "sub", icon: "folder", accent: "#6b7280", desc: "Folder within a library" },
  documentSet: { label: "Document Set", category: "sub", icon: "layers", accent: "#7d8f3f", desc: "Folder with metadata & content types" },
  contentType: { label: "Content Type", category: "sub", icon: "shapes", accent: "#8a5a83", desc: "Reusable content definition" },
  metadata: { label: "Metadata", category: "sub", icon: "tags", accent: "#3a949b", desc: "Managed metadata column / term set" },
};

const PALETTE = [
  { title: "Sites", types: ["hubSite", "teamSite", "communicationSite"] },
  { title: "Content", types: ["documentLibrary", "sharepointList", "page"] },
  { title: "Microsoft 365 apps", types: ["planner", "groupMailbox", "groupForms", "oneNote"] },
  { title: "Sub-items", types: ["folder", "documentSet", "contentType", "metadata"] },
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
const ICON_KEYS = ["users", "megaphone", "hub", "library", "fileText", "folder", "layers", "shapes", "tags", "messages", "hash", "shield", "globe", "star", "bookOpen", "settings"];
const EVERYONE = "Everyone except external users";
const TEAMS_ACCENT = "#4b53bc";
const SIDES = ["top", "right", "bottom", "left"];
const CHILD_TYPES = ["documentLibrary", "page", "folder", "documentSet", "contentType", "metadata"];
// sub-items that can be nested INSIDE a container/site card
const SUB_CHILD_TYPES = ["folder", "documentSet", "contentType", "metadata"];
// per-node size multiplier applied to NODE_W (null/"m" = default)
const SIZE_FACTOR = { s: 0.85, m: 1, l: 1.25 };

// card widths shared by live canvas (CSS) and PNG export — keep in sync with architect.css
const NODE_W = { compact: 200, standard: 248, wide: 320 };

const STORAGE_KEY = "sp-architect-static:v1";
const SETTINGS_KEY = "sp-architect-static:settings";

function isRoot(t) { return CONFIG[t].category === "site"; }
function storageRelevant(t) { return t === "documentLibrary" || t === "sharepointList" || t === "folder" || t === "documentSet" || CONFIG[t].category === "site"; }
