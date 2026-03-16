"use client";

import { Zap, Globe, Lightbulb, Gamepad2, RefreshCw, Search, Package } from "lucide-react";

const TOOLS_ICON_MAP: Record<string, React.ComponentType<{size?: number; color?: string}>> = {
  zap: Zap,
  globe: Globe,
  lightbulb: Lightbulb,
  gamepad2: Gamepad2,
  refreshcw: RefreshCw,
  search: Search,
  package: Package,
};

const TOOLS = [
  {
    iconKey: "zap",
    name: "Rift Server",
    desc: "OG Fortnite private server for hosting classic Fortnite matches and experiences.",
    link: "https://github.com/nicxlxs/RiftServer",
  },
  {
    iconKey: "globe",
    name: "Lawin Server",
    desc: "Lightweight Fortnite backend server supporting OG seasons and custom loadouts.",
    link: "https://github.com/Lawin0129/LawinServer",
  },
  {
    iconKey: "lightbulb",
    name: "Neonite",
    desc: "Private server backend for Fortnite with support for multiple seasons and cosmetics.",
    link: "https://github.com/nicxlxs/NeoniteV2",
  },
  {
    iconKey: "gamepad2",
    name: "JEEF",
    desc: "Fortnite emulator allowing you to play older builds locally.",
    link: "https://github.com/nicxlxs/JEEF",
  },
  {
    iconKey: "refreshcw",
    name: "CUE (Custom Update Engine)",
    desc: "Engine for managing and applying custom Fortnite updates and patches.",
    link: "https://github.com/nicxlxs/CUE",
  },
  {
    iconKey: "search",
    name: "Fiddler",
    desc: "Network debugging proxy for inspecting and modifying Fortnite traffic.",
    link: "https://www.telerik.com/fiddler",
  },
  {
    iconKey: "package",
    name: "Fortnite Porting",
    desc: "Asset extraction tool for pulling models, textures, and data from Fortnite builds.",
    link: "https://github.com/halfuwu/FortnitePorting",
  },
];

export default function ToolsView() {
  return (
    <main className="dashboard-main">
      <div className="view-header">
        <h2 className="view-title">Server Tools</h2>
        <p className="view-subtitle">Essential tools for OG Fortnite modding and private servers</p>
      </div>

      <div className="view-grid view-grid-tools">
        {TOOLS.map((tool) => {
          const ToolIcon = TOOLS_ICON_MAP[tool.iconKey];
          return (
            <div key={tool.name} className="view-card view-card-tool">
              <span className="view-card-icon">
                {ToolIcon && <ToolIcon size={20} color="#FF8C00" />}
              </span>
              <h4 className="view-card-title">{tool.name}</h4>
              <p className="view-card-desc">{tool.desc}</p>
              <a href={tool.link} target="_blank" rel="noopener noreferrer" className="view-btn">
                Open
              </a>
            </div>
          );
        })}
      </div>
    </main>
  );
}
