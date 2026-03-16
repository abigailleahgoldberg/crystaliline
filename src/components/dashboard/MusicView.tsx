"use client";

import { useState, useEffect, useRef } from "react";

interface MusicPack {
  id: string;
  name: string;
  description: string;
  images: { icon: string | null; smallIcon: string | null };
  set?: { value: string } | null;
}

export default function MusicView() {
  const [packs, setPacks] = useState<MusicPack[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetched = useRef(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(75);

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

  const selectedTrack =
    selectedIndex !== null && selectedIndex < filtered.length
      ? filtered[selectedIndex]
      : null;

  const handlePrev = () => {
    if (selectedIndex === null || filtered.length === 0) return;
    setSelectedIndex(selectedIndex === 0 ? filtered.length - 1 : selectedIndex - 1);
    setIsPlaying(false);
  };

  const handleNext = () => {
    if (selectedIndex === null || filtered.length === 0) return;
    setSelectedIndex(selectedIndex === filtered.length - 1 ? 0 : selectedIndex + 1);
    setIsPlaying(false);
  };

  return (
    <main className="dashboard-main" style={{ position: "relative", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, overflowY: "auto" }}>
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
            {filtered.map((pack, index) => (
              <div
                key={pack.id}
                className={`view-card view-card-music music-track${selectedIndex === index ? " selected" : ""}`}
                onClick={() => { setSelectedIndex(index); setIsPlaying(false); }}
              >
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
      </div>

      {selectedIndex !== null && selectedTrack && (
        <div className="music-player-bar">
          <div className="music-player-art">
            {selectedTrack.images.icon ? (
              <img src={selectedTrack.images.icon} alt={selectedTrack.name} />
            ) : (
              <span style={{ fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>🎵</span>
            )}
          </div>

          <div className="music-player-info">
            <div className="music-player-name">{selectedTrack.name}</div>
            <div className="music-player-artist">{selectedTrack.set?.value || "Fortnite"}</div>
          </div>

          <div className="player-controls">
            <button onClick={handlePrev} title="Previous">⏮</button>
            <button className="play-btn" onClick={() => setIsPlaying(!isPlaying)} title="Preview not available">
              {isPlaying ? "⏸" : "▶"}
            </button>
            <button onClick={handleNext} title="Next">⏭</button>
          </div>

          <div className="player-progress">
            <span className="player-progress-time">0:00</span>
            <div className="player-progress-track">
              <div className="player-progress-fill" />
            </div>
            <span className="player-progress-time">-:--</span>
          </div>

          <div className="player-volume">
            <span className="player-volume-icon">🔊</span>
            <input type="range" min={0} max={100} value={volume} onChange={(e) => setVolume(Number(e.target.value))} />
          </div>

          <button className="music-player-close" onClick={() => { setSelectedIndex(null); setIsPlaying(false); }} title="Close">✕</button>
        </div>
      )}
    </main>
  );
}
