"use client";

import { useState, useEffect, useRef } from "react";

interface MusicPack {
  id: string;
  name: string;
  description: string;
  images: { icon: string | null; smallIcon: string | null };
}

export default function MusicView() {
  const [packs, setPacks] = useState<MusicPack[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    fetch("https://fortnite-api.com/v2/cosmetics/br/search/all?type=music")
      .then((r) => r.json())
      .then((json) => {
        if (json.data) setPacks(json.data.slice(0, 150));
        else setError("No music data returned.");
      })
      .catch(() => setError("Failed to load music packs."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = packs.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="dashboard-main">
      <div className="view-header">
        <h2 className="view-title">Music Packs</h2>
        <p className="view-subtitle">Fortnite music pack cosmetics</p>
      </div>

      <div className="view-search-bar">
        <input
          className="view-search-input"
          placeholder="Search music packs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && (
        <div className="view-loading">
          <div className="dashboard-spinner" />
          <span>Loading music packs...</span>
        </div>
      )}

      {error && <div className="view-error">{error}</div>}

      {!loading && !error && (
        <div className="view-grid view-grid-music">
          {filtered.map((pack) => (
            <div key={pack.id} className="view-card view-card-music">
              <div className="view-music-art">
                {pack.images.icon ? (
                  <img src={pack.images.icon} alt={pack.name} loading="lazy" />
                ) : (
                  <span className="view-card-no-img">🎵</span>
                )}
              </div>
              <span className="view-card-name">{pack.name}</span>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
