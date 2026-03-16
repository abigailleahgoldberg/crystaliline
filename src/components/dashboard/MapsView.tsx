"use client";

import { Building2, Paintbrush, Settings, Ruler, Map } from "lucide-react";

const MAPS_ICON_MAP: Record<string, React.ComponentType<{size?: number; color?: string}>> = {
  building2: Building2,
  paintbrush: Paintbrush,
  settings: Settings,
  ruler: Ruler,
  map: Map,
};

const MAP_TOOLS = [
  {
    iconKey: "building2",
    name: "UEFN (Unreal Editor for Fortnite)",
    desc: "Epic's official editor for creating Fortnite islands and experiences.",
    link: "https://store.epicgames.com/en-US/p/fortnite--uefn",
  },
  {
    iconKey: "paintbrush",
    name: "Blender",
    desc: "Free 3D modeling tool for creating custom map assets and models.",
    link: "https://www.blender.org/",
  },
  {
    iconKey: "settings",
    name: "Unreal Engine 5",
    desc: "Full game engine for advanced map modding and custom game modes.",
    link: "https://www.unrealengine.com/",
  },
  {
    iconKey: "ruler",
    name: "FModel",
    desc: "Fortnite asset viewer/extractor for studying existing map structures.",
    link: "https://fmodel.app/",
  },
];

const TIPS = [
  "Start small — build a single POI before attempting a full map.",
  "Study existing OG Fortnite maps by extracting them with FModel.",
  "Use Blender for custom props, then import into Unreal Engine.",
  "Test your map in a local private server before sharing.",
  "Join the Crystaliline Discord for map modding help and feedback.",
];

export default function MapsView() {
  return (
    <main className="dashboard-main">
      <div className="view-header">
        <h2 className="view-title">Map Mods</h2>
        <p className="view-subtitle">Resources and tools for OG Fortnite map modding</p>
      </div>

      <section className="view-section">
        <h3 className="view-section-title">Map Tools & Resources</h3>
        <div className="view-grid view-grid-maps">
          {MAP_TOOLS.map((tool) => {
            const ToolIcon = MAPS_ICON_MAP[tool.iconKey];
            return (
              <div key={tool.name} className="view-card view-card-tool">
                <span className="view-card-icon">
                  {ToolIcon && <ToolIcon size={20} color="#FF8C00" />}
                </span>
                <h4 className="view-card-title">{tool.name}</h4>
                <p className="view-card-desc">{tool.desc}</p>
                <a href={tool.link} target="_blank" rel="noopener noreferrer" className="view-btn">
                  Visit
                </a>
              </div>
            );
          })}
        </div>
      </section>

      <section className="view-section">
        <h3 className="view-section-title">Map Modding Tips</h3>
        <div className="view-tips">
          {TIPS.map((tip, i) => (
            <div key={i} className="view-tip-item">
              <span className="view-tip-num">{i + 1}</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="view-section">
        <div className="view-coming-soon">
          <span className="view-coming-soon-icon">
            <Map size={20} color="#8888A0" />
          </span>
          <h3>Map Downloads</h3>
          <p>Custom OG Fortnite maps will be available here soon.</p>
          <span className="view-badge-coming">Coming Soon</span>
        </div>
      </section>
    </main>
  );
}
