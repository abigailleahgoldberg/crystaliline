"use client";

import { useState, useEffect, useRef } from "react";

interface MusicPack {
  id: string;
  name: string;
  description: string;
  images: { icon: string | null; smallIcon: string | null };
  set?: { value: string } | null;
  showcaseVideo?: string | null;
}

export default function MusicView() {
  const [packs, setPacks] = useState<MusicPack[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetched = useRef(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    fetch("https://fortnite-api.com/v2/cosmetics/br/search/all?type=music&language=en")
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
    setShowVideo(false);
  };

  const handleNext = () => {
    if (selectedIndex === null || filtered.length === 0) return;
    setSelectedIndex(selectedIndex === filtered.length - 1 ? 0 : selectedIndex + 1);
    setShowVideo(false);
  };

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    const track = filtered[index];
    setShowVideo(!!track?.showcaseVideo);
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
                onClick={() => handleSelect(index)}
              >
                <div className="view-music-art">
                  {pack.images.icon ? (
                    <img src={pack.images.icon} alt={pack.name} loading="lazy" />
                  ) : (
                    <span className="view-card-no-img">🎵</span>
                  )}
                  {pack.showcaseVideo && (
                    <span style={{
                      position: "absolute",
                      bottom: 4,
                      right: 4,
                      background: "rgba(0,0,0,0.7)",
                      borderRadius: 4,
                      padding: "2px 5px",
                      fontSize: 10,
                      color: "#fff",
                    }}>▶ Video</span>
                  )}
                </div>
                <span className="view-card-name">{pack.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedIndex !== null && selectedTrack && (
        <div style={{
          position: "sticky",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#1a1a2e",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          zIndex: 50,
        }}>
          {/* YouTube embed area */}
          {showVideo && selectedTrack.showcaseVideo && (
            <div style={{
              position: "relative",
              width: "100%",
              maxWidth: 640,
              margin: "0 auto",
              padding: "12px 12px 0",
            }}>
              <button
                onClick={() => setShowVideo(false)}
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  zIndex: 10,
                  background: "rgba(0,0,0,0.7)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: 28,
                  height: 28,
                  cursor: "pointer",
                  fontSize: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title="Close video"
              >✕</button>
              <div style={{
                position: "relative",
                width: "100%",
                paddingBottom: "56.25%",
                borderRadius: 8,
                overflow: "hidden",
                background: "#000",
              }}>
                <iframe
                  src={`https://www.youtube.com/embed/${selectedTrack.showcaseVideo}?autoplay=1`}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: "none",
                  }}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title={selectedTrack.name}
                />
              </div>
            </div>
          )}

          {/* No video message */}
          {showVideo === false && !selectedTrack.showcaseVideo && (
            <div style={{
              textAlign: "center",
              padding: "8px 0 0",
              fontSize: 12,
              color: "#6B6B7B",
            }}>
              No preview available
            </div>
          )}

          {/* Player bar */}
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
              {selectedTrack.showcaseVideo ? (
                <button
                  className="play-btn"
                  onClick={() => setShowVideo(!showVideo)}
                  title={showVideo ? "Hide video" : "Watch video"}
                >
                  {showVideo ? "⏸" : "▶"}
                </button>
              ) : (
                <button className="play-btn" title="No preview available" style={{ opacity: 0.4, cursor: "default" }}>
                  ▶
                </button>
              )}
              <button onClick={handleNext} title="Next">⏭</button>
            </div>

            <button className="music-player-close" onClick={() => { setSelectedIndex(null); setShowVideo(false); }} title="Close">✕</button>
          </div>
        </div>
      )}
    </main>
  );
}
