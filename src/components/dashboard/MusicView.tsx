"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ------------------------------------------------------------------ */
/*  YouTube IFrame API type declarations                               */
/* ------------------------------------------------------------------ */
declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
  namespace YT {
    interface PlayerOptions {
      width?: number | string;
      height?: number | string;
      videoId?: string;
      playerVars?: Record<string, unknown>;
      events?: {
        onReady?: (e: PlayerEvent) => void;
        onStateChange?: (e: OnStateChangeEvent) => void;
        onError?: (e: PlayerEvent) => void;
      };
    }
    interface PlayerEvent {
      target: Player;
      data?: number;
    }
    interface OnStateChangeEvent {
      target: Player;
      data: number;
    }
    class Player {
      constructor(elementId: string | HTMLElement, options: PlayerOptions);
      playVideo(): void;
      pauseVideo(): void;
      seekTo(seconds: number, allowSeekAhead: boolean): void;
      getCurrentTime(): number;
      getDuration(): number;
      setVolume(volume: number): void;
      getVolume(): number;
      getPlayerState(): number;
      destroy(): void;
    }
    const PlayerState: {
      UNSTARTED: -1;
      ENDED: 0;
      PLAYING: 1;
      PAUSED: 2;
      BUFFERING: 3;
      CUED: 5;
    };
  }
}

/* ------------------------------------------------------------------ */
/*  Data types                                                         */
/* ------------------------------------------------------------------ */
interface MusicPack {
  id: string;
  name: string;
  description: string;
  images: { icon: string | null; smallIcon: string | null };
  set?: { value: string } | null;
  showcaseVideo?: string | null;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

let apiLoadPromise: Promise<void> | null = null;

function loadYouTubeAPI(): Promise<void> {
  if (apiLoadPromise) return apiLoadPromise;
  if (window.YT && window.YT.Player) return Promise.resolve();

  apiLoadPromise = new Promise<void>((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prev) prev();
      resolve();
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
  return apiLoadPromise;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function MusicView() {
  const [packs, setPacks] = useState<MusicPack[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetched = useRef(false);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [playerReady, setPlayerReady] = useState(false);

  const playerRef = useRef<YT.Player | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const playerDivId = "yt-hidden-player";

  /* ---- Data fetch ---- */
  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    fetch(
      "https://fortnite-api.com/v2/cosmetics/br/search/all?type=music&language=en"
    )
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

  /* ---- Progress polling ---- */
  const startProgressPolling = useCallback(() => {
    if (progressInterval.current) clearInterval(progressInterval.current);
    progressInterval.current = setInterval(() => {
      if (playerRef.current) {
        try {
          const t = playerRef.current.getCurrentTime();
          const d = playerRef.current.getDuration();
          setCurrentTime(t);
          if (d > 0) setDuration(d);
        } catch {
          /* player may be destroyed */
        }
      }
    }, 500);
  }, []);

  const stopProgressPolling = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  }, []);

  /* ---- Destroy player ---- */
  const destroyPlayer = useCallback(() => {
    stopProgressPolling();
    if (playerRef.current) {
      try {
        playerRef.current.destroy();
      } catch {
        /* ignore */
      }
      playerRef.current = null;
    }
    setPlayerReady(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [stopProgressPolling]);

  /* ---- Create player for a video ID ---- */
  const createPlayer = useCallback(
    async (videoId: string) => {
      destroyPlayer();
      await loadYouTubeAPI();

      // Ensure the hidden container has a fresh div
      if (playerContainerRef.current) {
        playerContainerRef.current.innerHTML = `<div id="${playerDivId}"></div>`;
      }

      playerRef.current = new YT.Player(playerDivId, {
        width: 1,
        height: 1,
        videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
        },
        events: {
          onReady: (e: YT.PlayerEvent) => {
            e.target.setVolume(volume);
            setPlayerReady(true);
            setIsPlaying(true);
            startProgressPolling();
          },
          onStateChange: (e: YT.OnStateChangeEvent) => {
            switch (e.data) {
              case 1: // PLAYING
                setIsPlaying(true);
                startProgressPolling();
                break;
              case 2: // PAUSED
                setIsPlaying(false);
                stopProgressPolling();
                break;
              case 0: // ENDED
                setIsPlaying(false);
                stopProgressPolling();
                setCurrentTime(0);
                break;
            }
          },
        },
      });
    },
    [destroyPlayer, volume, startProgressPolling, stopProgressPolling]
  );

  /* ---- Cleanup on unmount ---- */
  useEffect(() => {
    return () => {
      destroyPlayer();
    };
  }, [destroyPlayer]);

  /* ---- When selected track changes, create new player ---- */
  useEffect(() => {
    if (selectedTrack?.showcaseVideo) {
      createPlayer(selectedTrack.showcaseVideo);
    } else {
      destroyPlayer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex, selectedTrack?.id]);

  /* ---- Controls ---- */
  const togglePlay = () => {
    if (!playerRef.current || !playerReady) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!playerRef.current || !playerReady || duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const seekTime = pct * duration;
    playerRef.current.seekTo(seekTime, true);
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVolume(v);
    if (playerRef.current && playerReady) {
      playerRef.current.setVolume(v);
    }
  };

  const handlePrev = () => {
    if (selectedIndex === null || filtered.length === 0) return;
    setSelectedIndex(
      selectedIndex === 0 ? filtered.length - 1 : selectedIndex - 1
    );
  };

  const handleNext = () => {
    if (selectedIndex === null || filtered.length === 0) return;
    setSelectedIndex(
      selectedIndex === filtered.length - 1 ? 0 : selectedIndex + 1
    );
  };

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
  };

  const handleClose = () => {
    destroyPlayer();
    setSelectedIndex(null);
  };

  const progressPct =
    duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  /* ---- Render ---- */
  return (
    <main
      className="dashboard-main"
      style={{ position: "relative", display: "flex", flexDirection: "column" }}
    >
      {/* Hidden YouTube player container */}
      <div
        ref={playerContainerRef}
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          opacity: 0,
          pointerEvents: "none",
          top: -9999,
          left: -9999,
        }}
      >
        <div id={playerDivId} />
      </div>

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
                className={`view-card view-card-music music-track${
                  selectedIndex === index ? " selected" : ""
                }`}
                onClick={() => handleSelect(index)}
              >
                <div className="view-music-art">
                  {pack.images.icon ? (
                    <img
                      src={pack.images.icon}
                      alt={pack.name}
                      loading="lazy"
                    />
                  ) : (
                    <span className="view-card-no-img">&#127925;</span>
                  )}
                  {pack.showcaseVideo && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: 4,
                        right: 4,
                        background: "rgba(0,0,0,0.7)",
                        borderRadius: 4,
                        padding: "2px 5px",
                        fontSize: 10,
                        color: "#fff",
                      }}
                    >
                      &#9654; Preview
                    </span>
                  )}
                </div>
                <span className="view-card-name">{pack.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---- Sticky player bar ---- */}
      {selectedIndex !== null && selectedTrack && (
        <div
          className="music-player-sticky"
          style={{
            position: "sticky",
            bottom: 0,
            left: 0,
            right: 0,
            background: "#1a1a2e",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            zIndex: 50,
          }}
        >
          {/* No-preview notice */}
          {!selectedTrack.showcaseVideo && (
            <div
              style={{
                textAlign: "center",
                padding: "6px 0 0",
                fontSize: 12,
                color: "#6B6B7B",
              }}
            >
              No preview available
            </div>
          )}

          <div className="music-player-bar">
            {/* Album art */}
            <div className="music-player-art">
              {selectedTrack.images.icon ? (
                <img
                  src={selectedTrack.images.icon}
                  alt={selectedTrack.name}
                />
              ) : (
                <span
                  style={{
                    fontSize: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  &#127925;
                </span>
              )}
            </div>

            {/* Track info */}
            <div className="music-player-info">
              <div className="music-player-name">{selectedTrack.name}</div>
              <div className="music-player-artist">
                {selectedTrack.set?.value || selectedTrack.description || "Fortnite"}
              </div>
            </div>

            {/* Controls */}
            <div className="player-controls">
              <button onClick={handlePrev} title="Previous">
                &#9198;
              </button>
              {selectedTrack.showcaseVideo ? (
                <button
                  className="play-btn"
                  onClick={togglePlay}
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? "\u23F8" : "\u25B6"}
                </button>
              ) : (
                <button
                  className="play-btn"
                  title="No preview available"
                  style={{ opacity: 0.4, cursor: "default" }}
                >
                  &#9654;
                </button>
              )}
              <button onClick={handleNext} title="Next">
                &#9197;
              </button>
            </div>

            {/* Progress bar */}
            <div className="player-progress">
              <span className="player-progress-time">
                {formatTime(currentTime)}
              </span>
              <div
                className="player-progress-track"
                onClick={handleSeek}
                style={{ cursor: "pointer" }}
              >
                <div
                  className="player-progress-fill"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="player-progress-time">
                {formatTime(duration)}
              </span>
            </div>

            {/* Volume */}
            <div className="player-volume">
              <span className="player-volume-icon">
                {volume === 0 ? "\uD83D\uDD07" : volume < 50 ? "\uD83D\uDD09" : "\uD83D\uDD0A"}
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={handleVolumeChange}
                title={`Volume: ${volume}%`}
              />
            </div>

            {/* Close */}
            <button
              className="music-player-close"
              onClick={handleClose}
              title="Close"
            >
              &#10005;
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
