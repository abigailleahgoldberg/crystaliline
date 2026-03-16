"use client";

import { useState, useEffect, useRef } from "react";

interface GalleryItem {
  id: string;
  name: string;
  images: { icon: string | null; featured: string | null; smallIcon: string | null };
}

export default function GalleryView() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<GalleryItem | null>(null);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    fetch("https://fortnite-api.com/v2/cosmetics/br/search/all?type=loadingscreen")
      .then((r) => r.json())
      .then((json) => {
        if (json.data) setItems(json.data.slice(0, 100));
        else setError("No gallery data returned.");
      })
      .catch(() => setError("Failed to load gallery."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="dashboard-main">
      <div className="view-header">
        <h2 className="view-title">Gallery</h2>
        <p className="view-subtitle">Fortnite loading screens and artwork</p>
      </div>

      <div className="view-search-bar">
        <input
          className="view-search-input"
          placeholder="Search gallery..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && (
        <div className="view-loading">
          <div className="dashboard-spinner" />
          <span>Loading gallery...</span>
        </div>
      )}

      {error && <div className="view-error">{error}</div>}

      {!loading && !error && (
        <div className="view-gallery-grid">
          {filtered.map((item) => {
            const src = item.images.featured || item.images.icon || item.images.smallIcon;
            if (!src) return null;
            return (
              <div
                key={item.id}
                className="view-gallery-item"
                onClick={() => setExpanded(item)}
              >
                <img src={src} alt={item.name} loading="lazy" />
                <span className="view-gallery-label">{item.name}</span>
              </div>
            );
          })}
        </div>
      )}

      {expanded && (
        <div className="asset-overlay" onClick={() => setExpanded(null)}>
          <div className="view-gallery-expanded" onClick={(e) => e.stopPropagation()}>
            <button className="asset-detail-close" onClick={() => setExpanded(null)}>✕</button>
            <img
              src={expanded.images.featured || expanded.images.icon || expanded.images.smallIcon || ""}
              alt={expanded.name}
            />
            <h3>{expanded.name}</h3>
          </div>
        </div>
      )}
    </main>
  );
}
