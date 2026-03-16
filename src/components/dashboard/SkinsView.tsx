"use client";

import { useState, useEffect, useRef } from "react";

interface Skin {
  id: string;
  name: string;
  description: string;
  rarity: { value: string; displayValue: string };
  images: { icon: string | null; smallIcon: string | null };
}

const RARITY_COLORS: Record<string, string> = {
  legendary: "#f0a832",
  epic: "#b84dff",
  rare: "#3d8eff",
  uncommon: "#68bb2a",
  common: "#8c8c8c",
};

export default function SkinsView() {
  const [skins, setSkins] = useState<Skin[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Skin | null>(null);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    fetch("https://fortnite-api.com/v2/cosmetics/br/search/all?type=outfit")
      .then((r) => r.json())
      .then((json) => {
        if (json.data) setSkins(json.data.slice(0, 200));
        else setError("No skin data returned.");
      })
      .catch(() => setError("Failed to load skins."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = skins.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="dashboard-main">
      <div className="view-header">
        <h2 className="view-title">Skin Mods</h2>
        <p className="view-subtitle">Browse OG Fortnite outfits</p>
      </div>

      <div className="view-search-bar">
        <input
          className="view-search-input"
          placeholder="Search skins..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && (
        <div className="view-loading">
          <div className="dashboard-spinner" />
          <span>Loading skins...</span>
        </div>
      )}

      {error && <div className="view-error">{error}</div>}

      {!loading && !error && (
        <div className="view-grid view-grid-skins">
          {filtered.map((skin) => {
            const color = RARITY_COLORS[skin.rarity?.value] || "#8c8c8c";
            return (
              <div
                key={skin.id}
                className="view-card view-card-skin"
                onClick={() => setSelected(skin)}
              >
                <div className="view-card-img" style={{ borderBottom: `3px solid ${color}` }}>
                  {skin.images.icon ? (
                    <img src={skin.images.icon} alt={skin.name} loading="lazy" />
                  ) : (
                    <span className="view-card-no-img">👤</span>
                  )}
                </div>
                <div className="view-card-info">
                  <span className="view-card-name">{skin.name}</span>
                  <span className="view-rarity-badge" style={{ background: color }}>
                    {skin.rarity?.displayValue || "Common"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selected && (
        <div className="asset-overlay" onClick={() => setSelected(null)}>
          <div className="asset-detail" onClick={(e) => e.stopPropagation()}>
            <button className="asset-detail-close" onClick={() => setSelected(null)}>✕</button>
            <div className="asset-detail-img">
              {selected.images.icon && <img src={selected.images.icon} alt={selected.name} />}
            </div>
            <h3 className="asset-detail-name">{selected.name}</h3>
            <p className="asset-detail-desc">{selected.description || "No description available."}</p>
            <div className="asset-detail-meta">
              <span
                className="asset-detail-tag"
                style={{ background: `${RARITY_COLORS[selected.rarity?.value] || "#8c8c8c"}30`, color: RARITY_COLORS[selected.rarity?.value] || "#8c8c8c" }}
              >
                {selected.rarity?.displayValue || "Common"}
              </span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
