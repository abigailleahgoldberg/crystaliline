"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Crosshair, Music, Gamepad2, Zap, Volume2, Square } from "lucide-react";

/* ── Types ── */

interface SoundDef {
  name: string;
  category: "fortnite" | "memes" | "game";
  type: "youtube" | "webaudio";
  youtubeId?: string;
  iconKey: "crosshair" | "music" | "gamepad" | "zap";
}

const SOUNDS: SoundDef[] = [
  // Iconic Fortnite (YouTube)
  { name: "Default Dance", category: "fortnite", type: "youtube", youtubeId: "czHKeFb0M7Q", iconKey: "music" },
  { name: "OG Menu Music", category: "fortnite", type: "youtube", youtubeId: "OI_f0SfECWA", iconKey: "music" },
  { name: "Floss", category: "fortnite", type: "youtube", youtubeId: "LV-t_2MjL0o", iconKey: "music" },
  { name: "Take the L", category: "fortnite", type: "youtube", youtubeId: "6BERN2jVns8", iconKey: "music" },
  { name: "Orange Justice", category: "fortnite", type: "youtube", youtubeId: "9L0jY0MpjKI", iconKey: "music" },
  { name: "Chug Jug With You", category: "fortnite", type: "youtube", youtubeId: "Z0Uh3OJCx3o", iconKey: "music" },
  // Memes (YouTube)
  { name: "Bruh", category: "memes", type: "youtube", youtubeId: "2ZIpFytCSVc", iconKey: "gamepad" },
  { name: "Vine Boom", category: "memes", type: "youtube", youtubeId: "ja0n3gqCXfY", iconKey: "gamepad" },
  { name: "Rizz", category: "memes", type: "youtube", youtubeId: "xyAEwMWn05A", iconKey: "gamepad" },
  { name: "Among Us", category: "memes", type: "youtube", youtubeId: "grd-K33tOSM", iconKey: "gamepad" },
  { name: "MLG Horn", category: "memes", type: "youtube", youtubeId: "3-d6yBTGOw4", iconKey: "gamepad" },
  { name: "Oof", category: "memes", type: "youtube", youtubeId: "HoBa2SyvtpE", iconKey: "gamepad" },
  // Game Sounds (Web Audio)
  { name: "Chest Open", category: "game", type: "webaudio", iconKey: "zap" },
  { name: "Victory Royale", category: "game", type: "webaudio", iconKey: "zap" },
  { name: "Elimination", category: "game", type: "webaudio", iconKey: "crosshair" },
  { name: "Shield Pop", category: "game", type: "webaudio", iconKey: "zap" },
  { name: "Storm Circle", category: "game", type: "webaudio", iconKey: "zap" },
  { name: "Reboot Card", category: "game", type: "webaudio", iconKey: "zap" },
];

const CATEGORIES = [
  { id: "all", label: "All", iconKey: "volume2" },
  { id: "fortnite", label: "Fortnite", iconKey: "music" },
  { id: "memes", label: "Memes", iconKey: "gamepad" },
  { id: "game", label: "Game SFX", iconKey: "zap" },
] as const;

const CAT_ICON_MAP: Record<string, React.ComponentType<{size?: number; color?: string}>> = {
  volume2: Volume2,
  music: Music,
  gamepad: Gamepad2,
  zap: Zap,
  crosshair: Crosshair,
};

/* ── SoundEngine: Web Audio API synthesis ── */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  ensureContext() {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return { ctx: this.ctx, master: this.masterGain! };
  }

  setVolume(v: number) {
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(v, this.ctx!.currentTime);
    }
  }

  private noise(ctx: AudioContext, duration: number): AudioBufferSourceNode {
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    return src;
  }

  play(name: string): number {
    const { ctx, master } = this.ensureContext();
    const t = ctx.currentTime;

    switch (name) {
      case "Chest Open": return this.chestOpen(ctx, master, t);
      case "Victory Royale": return this.victoryRoyale(ctx, master, t);
      case "Elimination": return this.elimination(ctx, master, t);
      case "Shield Pop": return this.shieldPop(ctx, master, t);
      case "Storm Circle": return this.stormCircle(ctx, master, t);
      case "Reboot Card": return this.rebootCard(ctx, master, t);
      default: return 300;
    }
  }

  private chestOpen(ctx: AudioContext, master: GainNode, t: number): number {
    // Sparkle ascending
    const notes = [523, 659, 784, 880, 1047, 1175, 1319, 1568];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t + i * 0.07);
      g.gain.setValueAtTime(0.2, t + i * 0.07);
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.07 + 0.18);
      // Add shimmer with second oscillator
      const osc2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(freq * 2, t + i * 0.07);
      g2.gain.setValueAtTime(0.08, t + i * 0.07);
      g2.gain.exponentialRampToValueAtTime(0.001, t + i * 0.07 + 0.12);
      osc.connect(g).connect(master);
      osc2.connect(g2).connect(master);
      osc.start(t + i * 0.07);
      osc.stop(t + i * 0.07 + 0.2);
      osc2.start(t + i * 0.07);
      osc2.stop(t + i * 0.07 + 0.14);
    });
    return 800;
  }

  private victoryRoyale(ctx: AudioContext, master: GainNode, t: number): number {
    // Triumphant fanfare
    const chords = [
      [261, 329, 392],
      [293, 370, 440],
      [329, 415, 494],
      [392, 494, 587],
    ];
    chords.forEach((chord, ci) => {
      chord.forEach((freq) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, t + ci * 0.3);
        g.gain.setValueAtTime(0.18, t + ci * 0.3);
        g.gain.linearRampToValueAtTime(0.22, t + ci * 0.3 + 0.15);
        g.gain.exponentialRampToValueAtTime(0.001, t + ci * 0.3 + 0.28);
        osc.connect(g).connect(master);
        osc.start(t + ci * 0.3);
        osc.stop(t + ci * 0.3 + 0.3);
      });
      // Add brass-like overtone
      const brass = ctx.createOscillator();
      const bg = ctx.createGain();
      brass.type = "sawtooth";
      brass.frequency.setValueAtTime(chord[0] * 0.5, t + ci * 0.3);
      bg.gain.setValueAtTime(0.06, t + ci * 0.3);
      bg.gain.exponentialRampToValueAtTime(0.001, t + ci * 0.3 + 0.25);
      brass.connect(bg).connect(master);
      brass.start(t + ci * 0.3);
      brass.stop(t + ci * 0.3 + 0.28);
    });
    return 1400;
  }

  private elimination(ctx: AudioContext, master: GainNode, t: number): number {
    // Sharp hit with impact
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.12);
    g.gain.setValueAtTime(0.45, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.connect(g).connect(master);
    osc.start(t);
    osc.stop(t + 0.18);

    const n = this.noise(ctx, 0.1);
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.35, t);
    ng.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.setValueAtTime(2000, t);
    n.connect(hp).connect(ng).connect(master);
    n.start(t);
    n.stop(t + 0.1);
    return 300;
  }

  private shieldPop(ctx: AudioContext, master: GainNode, t: number): number {
    // Crystal break
    const freqs = [2000, 3200, 4200, 2800, 3600, 5000];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, t + i * 0.03);
      osc.frequency.exponentialRampToValueAtTime(f * 0.4, t + i * 0.03 + 0.12);
      g.gain.setValueAtTime(0.22, t + i * 0.03);
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.03 + 0.14);
      osc.connect(g).connect(master);
      osc.start(t + i * 0.03);
      osc.stop(t + i * 0.03 + 0.16);
    });
    // Glass shatter noise
    const n = this.noise(ctx, 0.15);
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.2, t + 0.05);
    ng.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(6000, t);
    bp.Q.setValueAtTime(2, t);
    n.connect(bp).connect(ng).connect(master);
    n.start(t + 0.05);
    n.stop(t + 0.2);
    return 400;
  }

  private stormCircle(ctx: AudioContext, master: GainNode, t: number): number {
    // Rumble
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(35, t);
    osc.frequency.linearRampToValueAtTime(70, t + 1.5);
    g.gain.setValueAtTime(0.05, t);
    g.gain.linearRampToValueAtTime(0.35, t + 1.0);
    g.gain.exponentialRampToValueAtTime(0.001, t + 1.8);
    osc.connect(g).connect(master);
    osc.start(t);
    osc.stop(t + 1.8);

    const n = this.noise(ctx, 1.8);
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.02, t);
    ng.gain.linearRampToValueAtTime(0.18, t + 1.0);
    ng.gain.exponentialRampToValueAtTime(0.001, t + 1.8);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(200, t);
    lp.frequency.linearRampToValueAtTime(400, t + 1.5);
    n.connect(lp).connect(ng).connect(master);
    n.start(t);
    n.stop(t + 1.8);
    return 1900;
  }

  private rebootCard(ctx: AudioContext, master: GainNode, t: number): number {
    // Digital chime
    const notes = [880, 1047, 1319, 1568, 1760];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(freq, t + i * 0.1);
      g.gain.setValueAtTime(0.12, t + i * 0.1);
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.1 + 0.15);
      osc.connect(g).connect(master);
      osc.start(t + i * 0.1);
      osc.stop(t + i * 0.1 + 0.17);

      // Digital overtone
      const osc2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(freq * 1.5, t + i * 0.1);
      g2.gain.setValueAtTime(0.06, t + i * 0.1);
      g2.gain.exponentialRampToValueAtTime(0.001, t + i * 0.1 + 0.1);
      osc2.connect(g2).connect(master);
      osc2.start(t + i * 0.1);
      osc2.stop(t + i * 0.1 + 0.12);
    });
    return 700;
  }
}

/* ── Component ── */

export default function SoundboardView() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.7);
  const engineRef = useRef<SoundEngine | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const ytStopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getEngine = useCallback(() => {
    if (!engineRef.current) {
      engineRef.current = new SoundEngine();
    }
    return engineRef.current;
  }, []);

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setVolume(volume);
    }
  }, [volume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (ytStopTimerRef.current) clearTimeout(ytStopTimerRef.current);
    };
  }, []);

  const filtered =
    activeCategory === "all"
      ? SOUNDS
      : SOUNDS.filter((s) => s.category === activeCategory);

  const stopCurrentSound = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (ytStopTimerRef.current) {
      clearTimeout(ytStopTimerRef.current);
      ytStopTimerRef.current = null;
    }
    // Stop YouTube by loading blank
    if (iframeRef.current) {
      iframeRef.current.src = "about:blank";
    }
    setPlayingSound(null);
  }, []);

  const playSound = useCallback(
    (sound: SoundDef) => {
      // Stop any currently playing sound
      stopCurrentSound();

      setPlayingSound(sound.name);

      if (sound.type === "youtube" && sound.youtubeId) {
        // Play YouTube video for 4 seconds
        const ytVolume = Math.round(volume * 100);
        if (iframeRef.current) {
          iframeRef.current.src = `https://www.youtube.com/embed/${sound.youtubeId}?autoplay=1&start=0&enablejsapi=0&vol=${ytVolume}`;
        }
        ytStopTimerRef.current = setTimeout(() => {
          if (iframeRef.current) {
            iframeRef.current.src = "about:blank";
          }
          setPlayingSound(null);
          ytStopTimerRef.current = null;
        }, 4000);
      } else {
        // Web Audio
        const engine = getEngine();
        engine.setVolume(volume);
        const durationMs = engine.play(sound.name);

        timeoutRef.current = setTimeout(() => {
          setPlayingSound(null);
          timeoutRef.current = null;
        }, durationMs);
      }
    },
    [getEngine, volume, stopCurrentSound]
  );

  return (
    <main className="dashboard-main">
      <div className="view-header">
        <h2 className="view-title">Sound Board</h2>
        <p className="view-subtitle">
          Fortnite sounds, memes &amp; game SFX &mdash; YouTube clips + Web Audio API
        </p>
      </div>

      {/* Hidden YouTube iframe */}
      <iframe
        ref={iframeRef}
        src="about:blank"
        allow="autoplay"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: "none",
          border: "none",
        }}
        tabIndex={-1}
      />

      <div className="soundboard-volume-row">
        <label className="soundboard-volume-label" htmlFor="sb-vol">
          <Volume2 size={18} color="#8888A0" />
          <span style={{ marginLeft: "0.4rem" }}>Volume</span>
        </label>
        <input
          id="sb-vol"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="soundboard-volume-slider"
        />
        <span className="soundboard-volume-value">
          {Math.round(volume * 100)}%
        </span>
      </div>

      <div className="view-category-tabs">
        {CATEGORIES.map((cat) => {
          const CatIcon = CAT_ICON_MAP[cat.iconKey];
          return (
            <button
              key={cat.id}
              className={`view-category-tab${activeCategory === cat.id ? " active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {CatIcon && <CatIcon size={16} />}
              <span style={{ marginLeft: "0.35rem" }}>{cat.label}</span>
            </button>
          );
        })}
      </div>

      <div className="view-grid view-grid-sounds">
        {filtered.map((sound) => {
          const isPlaying = playingSound === sound.name;
          const SoundIcon = CAT_ICON_MAP[sound.iconKey];
          let cls = "view-sound-btn";
          if (isPlaying) cls += " playing pulse";

          return (
            <button
              key={sound.name}
              className={cls}
              onClick={() => isPlaying ? stopCurrentSound() : playSound(sound)}
            >
              <span className="view-sound-emoji">
                {isPlaying ? (
                  <Square size={20} color="#FF8C00" />
                ) : (
                  SoundIcon && <SoundIcon size={20} color="#FF8C00" />
                )}
              </span>
              <span className="view-sound-name">{sound.name}</span>
              {sound.type === "youtube" && (
                <span className="view-sound-badge">YT</span>
              )}
            </button>
          );
        })}
      </div>

      <style>{`
        .view-sound-badge {
          position: absolute;
          top: 6px;
          right: 6px;
          font-size: 0.6rem;
          font-weight: 700;
          color: #FF8C00;
          background: rgba(255, 140, 0, 0.15);
          border: 1px solid rgba(255, 140, 0, 0.3);
          border-radius: 4px;
          padding: 1px 5px;
          letter-spacing: 0.05em;
        }
        .view-sound-btn {
          position: relative;
        }
        .view-sound-btn.playing {
          box-shadow: 0 0 16px rgba(255, 140, 0, 0.4), 0 0 4px rgba(255, 140, 0, 0.2);
          border-color: rgba(255, 140, 0, 0.5);
        }
        .view-sound-btn.pulse {
          animation: sb-pulse 0.6s ease-out;
        }
        @keyframes sb-pulse {
          0% { transform: scale(1); }
          30% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </main>
  );
}
