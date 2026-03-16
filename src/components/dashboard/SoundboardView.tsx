"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Crosshair, Music, Gamepad2, Zap, Volume2, Square,
  Sword, Shield, CloudLightning, RotateCcw, Diamond, Target,
  Hammer, Pickaxe, Laugh, AlertTriangle, Siren, Bell,
  Radio, Disc, Trophy, Skull, Heart, Star
} from "lucide-react";

/* ── Types ── */

interface SoundDef {
  name: string;
  category: "fortnite" | "memes" | "game";
  type: "youtube" | "webaudio";
  youtubeId?: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
}

const SOUNDS: SoundDef[] = [
  // ── FORTNITE (YouTube clips) ──
  { name: "Default Dance", category: "fortnite", type: "youtube", youtubeId: "czHKeFb0M7Q", icon: Music },
  { name: "OG Lobby Music", category: "fortnite", type: "youtube", youtubeId: "OI_f0SfECWA", icon: Radio },
  { name: "Take the L", category: "fortnite", type: "youtube", youtubeId: "6BERN2jVns8", icon: Laugh },
  { name: "Floss", category: "fortnite", type: "youtube", youtubeId: "LV-t_2MjL0o", icon: Star },
  { name: "Orange Justice", category: "fortnite", type: "youtube", youtubeId: "9L0jY0MpjKI", icon: Disc },
  { name: "Chug Jug With You", category: "fortnite", type: "youtube", youtubeId: "Z0Uh3OJCx3o", icon: Heart },
  { name: "Renegade", category: "fortnite", type: "youtube", youtubeId: "L3w6RzROhvM", icon: Sword },
  { name: "Electro Shuffle", category: "fortnite", type: "youtube", youtubeId: "fHv2VUJkMY4", icon: Zap },
  { name: "Scenario", category: "fortnite", type: "youtube", youtubeId: "WJa3eUczYaM", icon: Music },
  { name: "Hype", category: "fortnite", type: "youtube", youtubeId: "gUGkhaRg-gE", icon: Star },
  { name: "Never Gonna", category: "fortnite", type: "youtube", youtubeId: "dQw4w9WgXcQ", icon: Radio },
  { name: "Star Power", category: "fortnite", type: "youtube", youtubeId: "VzMXC_vXxD0", icon: Star },
  { name: "Smooth Moves", category: "fortnite", type: "youtube", youtubeId: "AZx8kVrk7Ks", icon: Disc },

  // ── MEMES (YouTube clips) ──
  { name: "Bruh", category: "memes", type: "youtube", youtubeId: "2ZIpFytCSVc", icon: Gamepad2 },
  { name: "Vine Boom", category: "memes", type: "youtube", youtubeId: "ja0n3gqCXfY", icon: AlertTriangle },
  { name: "Among Us", category: "memes", type: "youtube", youtubeId: "grd-K33tOSM", icon: Skull },
  { name: "MLG Air Horn", category: "memes", type: "youtube", youtubeId: "3-d6yBTGOw4", icon: Siren },
  { name: "Windows XP Error", category: "memes", type: "youtube", youtubeId: "0lhhrUuw2N8", icon: Bell },
  { name: "Taco Bell", category: "memes", type: "youtube", youtubeId: "tfHOuTqAzJI", icon: Bell },
  { name: "Rick Roll", category: "memes", type: "youtube", youtubeId: "dQw4w9WgXcQ", icon: Radio },
  { name: "Emotional Damage", category: "memes", type: "youtube", youtubeId: "njO8mmr2MoQ", icon: Heart },
  { name: "Wah Wah Wah", category: "memes", type: "youtube", youtubeId: "CQeezCdF4mk", icon: Laugh },
  { name: "Bonk", category: "memes", type: "youtube", youtubeId: "gwxTZaa3NgI", icon: Hammer },

  // ── GAME SFX (Web Audio) ──
  { name: "Chest Open", category: "game", type: "webaudio", icon: Diamond },
  { name: "Victory Royale", category: "game", type: "webaudio", icon: Trophy },
  { name: "Elimination", category: "game", type: "webaudio", icon: Crosshair },
  { name: "Shield Pop", category: "game", type: "webaudio", icon: Shield },
  { name: "Storm Warning", category: "game", type: "webaudio", icon: CloudLightning },
  { name: "Reboot Van", category: "game", type: "webaudio", icon: RotateCcw },
  { name: "Llama Found", category: "game", type: "webaudio", icon: Diamond },
  { name: "Headshot", category: "game", type: "webaudio", icon: Target },
  { name: "Building Place", category: "game", type: "webaudio", icon: Hammer },
  { name: "Pickaxe Hit", category: "game", type: "webaudio", icon: Pickaxe },
];

const CATEGORIES = [
  { id: "all", label: "All", icon: Volume2 },
  { id: "fortnite", label: "Fortnite", icon: Music },
  { id: "memes", label: "Memes", icon: Gamepad2 },
  { id: "game", label: "Game SFX", icon: Zap },
] as const;

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
      case "Storm Warning": return this.stormWarning(ctx, master, t);
      case "Reboot Van": return this.rebootVan(ctx, master, t);
      case "Llama Found": return this.llamaFound(ctx, master, t);
      case "Headshot": return this.headshot(ctx, master, t);
      case "Building Place": return this.buildingPlace(ctx, master, t);
      case "Pickaxe Hit": return this.pickaxeHit(ctx, master, t);
      default: return 300;
    }
  }

  private chestOpen(ctx: AudioContext, master: GainNode, t: number): number {
    const notes = [523, 659, 784, 880, 1047, 1175, 1319, 1568];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t + i * 0.07);
      g.gain.setValueAtTime(0.2, t + i * 0.07);
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.07 + 0.18);
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

  private stormWarning(ctx: AudioContext, master: GainNode, t: number): number {
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

  private rebootVan(ctx: AudioContext, master: GainNode, t: number): number {
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

  private llamaFound(ctx: AudioContext, master: GainNode, t: number): number {
    const melody = [660, 880, 1100, 880, 1320, 1100];
    melody.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, t + i * 0.12);
      g.gain.setValueAtTime(0.2, t + i * 0.12);
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.12 + 0.15);
      osc.connect(g).connect(master);
      osc.start(t + i * 0.12);
      osc.stop(t + i * 0.12 + 0.17);
    });
    return 900;
  }

  private headshot(ctx: AudioContext, master: GainNode, t: number): number {
    // Sharp crack
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(2400, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.06);
    g.gain.setValueAtTime(0.5, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    osc.connect(g).connect(master);
    osc.start(t);
    osc.stop(t + 0.1);
    // Ding
    const osc2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1800, t + 0.02);
    g2.gain.setValueAtTime(0.3, t + 0.02);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    osc2.connect(g2).connect(master);
    osc2.start(t + 0.02);
    osc2.stop(t + 0.27);
    return 300;
  }

  private buildingPlace(ctx: AudioContext, master: GainNode, t: number): number {
    // Thunk + click
    const n = this.noise(ctx, 0.08);
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.4, t);
    ng.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    const bp = ctx.createBiquadFilter();
    bp.type = "lowpass";
    bp.frequency.setValueAtTime(400, t);
    n.connect(bp).connect(ng).connect(master);
    n.start(t);
    n.stop(t + 0.08);
    // Snap
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(600, t + 0.04);
    g.gain.setValueAtTime(0.15, t + 0.04);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc.connect(g).connect(master);
    osc.start(t + 0.04);
    osc.stop(t + 0.14);
    return 200;
  }

  private pickaxeHit(ctx: AudioContext, master: GainNode, t: number): number {
    // Metal clang
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.15);
    g.gain.setValueAtTime(0.35, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.connect(g).connect(master);
    osc.start(t);
    osc.stop(t + 0.22);
    // Impact noise
    const n = this.noise(ctx, 0.06);
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.3, t);
    ng.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    n.connect(ng).connect(master);
    n.start(t);
    n.stop(t + 0.06);
    return 300;
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
    if (iframeRef.current) {
      iframeRef.current.src = "about:blank";
    }
    setPlayingSound(null);
  }, []);

  const playSound = useCallback(
    (sound: SoundDef) => {
      stopCurrentSound();
      setPlayingSound(sound.name);

      if (sound.type === "youtube" && sound.youtubeId) {
        if (iframeRef.current) {
          iframeRef.current.src = `https://www.youtube.com/embed/${sound.youtubeId}?autoplay=1&start=0`;
        }
        ytStopTimerRef.current = setTimeout(() => {
          if (iframeRef.current) {
            iframeRef.current.src = "about:blank";
          }
          setPlayingSound(null);
          ytStopTimerRef.current = null;
        }, 4000);
      } else {
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
          Fortnite sounds, memes &amp; game SFX
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
          <Volume2 size={18} color="#A0A0AA" />
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
          const CatIcon = cat.icon;
          return (
            <button
              key={cat.id}
              className={`view-category-tab${activeCategory === cat.id ? " active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <CatIcon size={16} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      <div className="view-grid view-grid-sounds">
        {filtered.map((sound) => {
          const isPlaying = playingSound === sound.name;
          const SoundIcon = sound.icon;
          let cls = "view-sound-btn";
          if (isPlaying) cls += " playing pulse";

          return (
            <button
              key={sound.name}
              className={cls}
              onClick={() => isPlaying ? stopCurrentSound() : playSound(sound)}
            >
              <span className="view-sound-icon">
                {isPlaying ? (
                  <Square size={32} color="#FF8C00" />
                ) : (
                  <SoundIcon size={32} color="#FF8C00" />
                )}
              </span>
              <span className="view-sound-name">{sound.name}</span>
            </button>
          );
        })}
      </div>
    </main>
  );
}
