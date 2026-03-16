"use client";

import { useState, useRef, useCallback, useEffect } from "react";

/* ── Sound definitions ── */

interface SoundButton {
  emoji: string;
  name: string;
  category: string;
}

const SOUNDS: SoundButton[] = [
  // Weapons
  { emoji: "\uD83D\uDD2B", name: "Assault Rifle", category: "Weapons" },
  { emoji: "\uD83D\uDCA5", name: "Shotgun", category: "Weapons" },
  { emoji: "\uD83C\uDFAF", name: "Sniper", category: "Weapons" },
  { emoji: "\uD83D\uDD2B", name: "SMG", category: "Weapons" },
  { emoji: "\uD83D\uDE80", name: "Rocket Launch", category: "Weapons" },
  { emoji: "\uD83D\uDD04", name: "Reload", category: "Weapons" },
  // Emotes
  { emoji: "\uD83D\uDC83", name: "Default Dance", category: "Emotes" },
  { emoji: "\uD83D\uDE02", name: "Take the L", category: "Emotes" },
  { emoji: "\uD83D\uDD7A", name: "Floss", category: "Emotes" },
  { emoji: "\uD83C\uDF89", name: "Orange Justice", category: "Emotes" },
  // UI
  { emoji: "\uD83C\uDFC6", name: "Victory Royale", category: "UI" },
  { emoji: "\uD83D\uDCA2", name: "Elimination", category: "UI" },
  { emoji: "\uD83D\uDD14", name: "Menu Click", category: "UI" },
  { emoji: "\uD83D\uDE8C", name: "Bus Horn", category: "UI" },
  { emoji: "\uD83C\uDF00", name: "Storm Warning", category: "UI" },
  { emoji: "\uD83D\uDEE1\uFE0F", name: "Shield Pop", category: "UI" },
  // Gameplay
  { emoji: "\uD83D\uDCE6", name: "Chest Open", category: "Gameplay" },
  { emoji: "\uD83D\uDEE9\uFE0F", name: "Supply Drop", category: "Gameplay" },
  { emoji: "\uD83E\uDDF1", name: "Building", category: "Gameplay" },
  { emoji: "\uD83D\uDC9A", name: "Heal Up", category: "Gameplay" },
  { emoji: "\uD83E\uDD98", name: "Jump Pad", category: "Gameplay" },
  { emoji: "\u2728", name: "Rift", category: "Gameplay" },
];

const CATEGORIES = ["All", "Weapons", "Emotes", "UI", "Gameplay"];

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
      case "Assault Rifle":
        return this.assaultRifle(ctx, master, t);
      case "Shotgun":
        return this.shotgun(ctx, master, t);
      case "Sniper":
        return this.sniper(ctx, master, t);
      case "SMG":
        return this.smg(ctx, master, t);
      case "Rocket Launch":
        return this.rocketLaunch(ctx, master, t);
      case "Reload":
        return this.reload(ctx, master, t);
      case "Default Dance":
        return this.defaultDance(ctx, master, t);
      case "Take the L":
        return this.takeTheL(ctx, master, t);
      case "Floss":
        return this.floss(ctx, master, t);
      case "Orange Justice":
        return this.orangeJustice(ctx, master, t);
      case "Victory Royale":
        return this.victoryRoyale(ctx, master, t);
      case "Elimination":
        return this.elimination(ctx, master, t);
      case "Menu Click":
        return this.menuClick(ctx, master, t);
      case "Bus Horn":
        return this.busHorn(ctx, master, t);
      case "Storm Warning":
        return this.stormWarning(ctx, master, t);
      case "Shield Pop":
        return this.shieldPop(ctx, master, t);
      case "Chest Open":
        return this.chestOpen(ctx, master, t);
      case "Supply Drop":
        return this.supplyDrop(ctx, master, t);
      case "Building":
        return this.building(ctx, master, t);
      case "Heal Up":
        return this.healUp(ctx, master, t);
      case "Jump Pad":
        return this.jumpPad(ctx, master, t);
      case "Rift":
        return this.rift(ctx, master, t);
      default:
        return 300;
    }
  }

  /* ── WEAPONS ── */

  private assaultRifle(ctx: AudioContext, master: GainNode, t: number): number {
    // 3-round burst of sharp tones
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(800 + i * 100, t + i * 0.08);
      g.gain.setValueAtTime(0.3, t + i * 0.08);
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.06);
      osc.connect(g).connect(master);
      osc.start(t + i * 0.08);
      osc.stop(t + i * 0.08 + 0.06);
    }
    return 350;
  }

  private shotgun(ctx: AudioContext, master: GainNode, t: number): number {
    // Low boom + noise burst
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(80, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.3);
    g.gain.setValueAtTime(0.5, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    osc.connect(g).connect(master);
    osc.start(t);
    osc.stop(t + 0.3);

    const n = this.noise(ctx, 0.15);
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.4, t);
    ng.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    const filt = ctx.createBiquadFilter();
    filt.type = "lowpass";
    filt.frequency.setValueAtTime(2000, t);
    n.connect(filt).connect(ng).connect(master);
    n.start(t);
    n.stop(t + 0.15);
    return 350;
  }

  private sniper(ctx: AudioContext, master: GainNode, t: number): number {
    // High crack + echo
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(2000, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.08);
    g.gain.setValueAtTime(0.4, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    osc.connect(g).connect(master);
    osc.start(t);
    osc.stop(t + 0.1);

    // Echo
    const delay = ctx.createDelay(1.0);
    delay.delayTime.setValueAtTime(0.25, t);
    const echoG = ctx.createGain();
    echoG.gain.setValueAtTime(0.15, t);
    const osc2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    osc2.type = "sawtooth";
    osc2.frequency.setValueAtTime(1500, t);
    osc2.frequency.exponentialRampToValueAtTime(300, t + 0.06);
    g2.gain.setValueAtTime(0.2, t);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    osc2.connect(g2).connect(delay).connect(echoG).connect(master);
    osc2.start(t);
    osc2.stop(t + 0.06);
    return 600;
  }

  private smg(ctx: AudioContext, master: GainNode, t: number): number {
    // Rapid high-frequency clicks
    for (let i = 0; i < 8; i++) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(1200 + Math.random() * 400, t + i * 0.04);
      g.gain.setValueAtTime(0.2, t + i * 0.04);
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.04 + 0.025);
      osc.connect(g).connect(master);
      osc.start(t + i * 0.04);
      osc.stop(t + i * 0.04 + 0.03);
    }
    return 400;
  }

  private rocketLaunch(ctx: AudioContext, master: GainNode, t: number): number {
    // Ascending whoosh with bass rumble
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(60, t);
    osc.frequency.exponentialRampToValueAtTime(600, t + 1.0);
    g.gain.setValueAtTime(0.3, t);
    g.gain.linearRampToValueAtTime(0.4, t + 0.4);
    g.gain.exponentialRampToValueAtTime(0.001, t + 1.0);
    osc.connect(g).connect(master);
    osc.start(t);
    osc.stop(t + 1.0);

    const n = this.noise(ctx, 1.0);
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.15, t);
    ng.gain.linearRampToValueAtTime(0.25, t + 0.5);
    ng.gain.exponentialRampToValueAtTime(0.001, t + 1.0);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(200, t);
    bp.frequency.exponentialRampToValueAtTime(2000, t + 1.0);
    bp.Q.setValueAtTime(1, t);
    n.connect(bp).connect(ng).connect(master);
    n.start(t);
    n.stop(t + 1.0);
    return 1100;
  }

  private reload(ctx: AudioContext, master: GainNode, t: number): number {
    // Metallic click-clack
    const freqs = [3000, 1500, 4000, 2000];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(f, t + i * 0.12);
      g.gain.setValueAtTime(0.25, t + i * 0.12);
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.12 + 0.06);
      osc.connect(g).connect(master);
      osc.start(t + i * 0.12);
      osc.stop(t + i * 0.12 + 0.08);
    });
    return 600;
  }

  /* ── EMOTES ── */

  private defaultDance(ctx: AudioContext, master: GainNode, t: number): number {
    // Iconic melody approximation
    const notes = [392, 440, 494, 523, 494, 440, 392, 330];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(freq, t + i * 0.12);
      g.gain.setValueAtTime(0.2, t + i * 0.12);
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.12 + 0.1);
      osc.connect(g).connect(master);
      osc.start(t + i * 0.12);
      osc.stop(t + i * 0.12 + 0.11);
    });
    return 1100;
  }

  private takeTheL(ctx: AudioContext, master: GainNode, t: number): number {
    // Descending tones
    const notes = [880, 784, 659, 587, 494, 440, 370, 330];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, t + i * 0.1);
      g.gain.setValueAtTime(0.15, t + i * 0.1);
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.1 + 0.08);
      osc.connect(g).connect(master);
      osc.start(t + i * 0.1);
      osc.stop(t + i * 0.1 + 0.09);
    });
    return 900;
  }

  private floss(ctx: AudioContext, master: GainNode, t: number): number {
    // Rhythmic swoosh
    for (let i = 0; i < 6; i++) {
      const n = this.noise(ctx, 0.08);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.2, t + i * 0.15);
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.15 + 0.07);
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.setValueAtTime(i % 2 === 0 ? 3000 : 5000, t + i * 0.15);
      bp.Q.setValueAtTime(2, t + i * 0.15);
      n.connect(bp).connect(g).connect(master);
      n.start(t + i * 0.15);
      n.stop(t + i * 0.15 + 0.08);
    }
    return 1000;
  }

  private orangeJustice(ctx: AudioContext, master: GainNode, t: number): number {
    // Funky beat pattern
    const pattern = [
      { f: 200, dur: 0.08, off: 0 },
      { f: 400, dur: 0.06, off: 0.1 },
      { f: 300, dur: 0.08, off: 0.2 },
      { f: 500, dur: 0.06, off: 0.3 },
      { f: 200, dur: 0.1, off: 0.4 },
      { f: 600, dur: 0.06, off: 0.5 },
      { f: 250, dur: 0.08, off: 0.6 },
      { f: 400, dur: 0.1, off: 0.7 },
    ];
    pattern.forEach((p) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(p.f, t + p.off);
      g.gain.setValueAtTime(0.2, t + p.off);
      g.gain.exponentialRampToValueAtTime(0.001, t + p.off + p.dur);
      osc.connect(g).connect(master);
      osc.start(t + p.off);
      osc.stop(t + p.off + p.dur + 0.01);
    });
    return 900;
  }

  /* ── UI ── */

  private victoryRoyale(ctx: AudioContext, master: GainNode, t: number): number {
    // Triumphant ascending chord
    const chords = [
      [261, 329, 392],
      [329, 415, 494],
      [392, 494, 587],
    ];
    chords.forEach((chord, ci) => {
      chord.forEach((freq) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, t + ci * 0.35);
        g.gain.setValueAtTime(0.15, t + ci * 0.35);
        g.gain.linearRampToValueAtTime(0.18, t + ci * 0.35 + 0.15);
        g.gain.exponentialRampToValueAtTime(0.001, t + ci * 0.35 + 0.33);
        osc.connect(g).connect(master);
        osc.start(t + ci * 0.35);
        osc.stop(t + ci * 0.35 + 0.35);
      });
    });
    return 1200;
  }

  private elimination(ctx: AudioContext, master: GainNode, t: number): number {
    // Sharp hit
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(1000, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.15);
    g.gain.setValueAtTime(0.4, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.connect(g).connect(master);
    osc.start(t);
    osc.stop(t + 0.2);
    return 300;
  }

  private menuClick(ctx: AudioContext, master: GainNode, t: number): number {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1800, t);
    g.gain.setValueAtTime(0.2, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    osc.connect(g).connect(master);
    osc.start(t);
    osc.stop(t + 0.06);
    return 150;
  }

  private busHorn(ctx: AudioContext, master: GainNode, t: number): number {
    // Deep horn blast
    [110, 138, 165].forEach((freq) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.15, t);
      g.gain.linearRampToValueAtTime(0.2, t + 0.3);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
      osc.connect(g).connect(master);
      osc.start(t);
      osc.stop(t + 0.8);
    });
    return 900;
  }

  private stormWarning(ctx: AudioContext, master: GainNode, t: number): number {
    // Ominous low rumble building
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(40, t);
    osc.frequency.linearRampToValueAtTime(80, t + 1.5);
    g.gain.setValueAtTime(0.05, t);
    g.gain.linearRampToValueAtTime(0.35, t + 1.2);
    g.gain.exponentialRampToValueAtTime(0.001, t + 1.5);
    osc.connect(g).connect(master);
    osc.start(t);
    osc.stop(t + 1.5);

    const n = this.noise(ctx, 1.5);
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.02, t);
    ng.gain.linearRampToValueAtTime(0.15, t + 1.2);
    ng.gain.exponentialRampToValueAtTime(0.001, t + 1.5);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(300, t);
    n.connect(lp).connect(ng).connect(master);
    n.start(t);
    n.stop(t + 1.5);
    return 1600;
  }

  private shieldPop(ctx: AudioContext, master: GainNode, t: number): number {
    // Crystalline breaking sound
    const freqs = [2000, 3000, 4000, 2500, 3500];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, t + i * 0.04);
      osc.frequency.exponentialRampToValueAtTime(f * 0.5, t + i * 0.04 + 0.1);
      g.gain.setValueAtTime(0.2, t + i * 0.04);
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.04 + 0.12);
      osc.connect(g).connect(master);
      osc.start(t + i * 0.04);
      osc.stop(t + i * 0.04 + 0.13);
    });
    return 400;
  }

  /* ── GAMEPLAY ── */

  private chestOpen(ctx: AudioContext, master: GainNode, t: number): number {
    // Magical sparkle ascending notes
    const notes = [523, 659, 784, 880, 1047, 1175, 1319];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t + i * 0.08);
      g.gain.setValueAtTime(0.18, t + i * 0.08);
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.15);
      osc.connect(g).connect(master);
      osc.start(t + i * 0.08);
      osc.stop(t + i * 0.08 + 0.16);
    });
    return 750;
  }

  private supplyDrop(ctx: AudioContext, master: GainNode, t: number): number {
    // Airplane engine fading
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.linearRampToValueAtTime(180, t + 0.5);
    osc.frequency.linearRampToValueAtTime(120, t + 1.5);
    g.gain.setValueAtTime(0.1, t);
    g.gain.linearRampToValueAtTime(0.3, t + 0.5);
    g.gain.exponentialRampToValueAtTime(0.001, t + 1.5);
    osc.connect(g).connect(master);
    osc.start(t);
    osc.stop(t + 1.5);

    const n = this.noise(ctx, 1.5);
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.05, t);
    ng.gain.linearRampToValueAtTime(0.15, t + 0.5);
    ng.gain.exponentialRampToValueAtTime(0.001, t + 1.5);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(800, t);
    bp.Q.setValueAtTime(0.5, t);
    n.connect(bp).connect(ng).connect(master);
    n.start(t);
    n.stop(t + 1.5);
    return 1600;
  }

  private building(ctx: AudioContext, master: GainNode, t: number): number {
    // Quick wooden thud
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.1);
    g.gain.setValueAtTime(0.4, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc.connect(g).connect(master);
    osc.start(t);
    osc.stop(t + 0.15);

    const n = this.noise(ctx, 0.06);
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.3, t);
    ng.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.setValueAtTime(1000, t);
    n.connect(hp).connect(ng).connect(master);
    n.start(t);
    n.stop(t + 0.06);
    return 300;
  }

  private healUp(ctx: AudioContext, master: GainNode, t: number): number {
    // Gentle ascending chime
    const notes = [523, 587, 659, 784, 880];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t + i * 0.15);
      g.gain.setValueAtTime(0.15, t + i * 0.15);
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.15 + 0.2);
      osc.connect(g).connect(master);
      osc.start(t + i * 0.15);
      osc.stop(t + i * 0.15 + 0.22);
    });
    return 950;
  }

  private jumpPad(ctx: AudioContext, master: GainNode, t: number): number {
    // Springy boing with whoosh
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.exponentialRampToValueAtTime(1200, t + 0.15);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.35);
    g.gain.setValueAtTime(0.3, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    osc.connect(g).connect(master);
    osc.start(t);
    osc.stop(t + 0.4);

    const n = this.noise(ctx, 0.5);
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.01, t + 0.1);
    ng.gain.linearRampToValueAtTime(0.15, t + 0.25);
    ng.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(1000, t);
    bp.frequency.exponentialRampToValueAtTime(4000, t + 0.5);
    n.connect(bp).connect(ng).connect(master);
    n.start(t);
    n.stop(t + 0.5);
    return 600;
  }

  private rift(ctx: AudioContext, master: GainNode, t: number): number {
    // Ethereal swirl
    [400, 600, 800].forEach((baseF, idx) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(baseF, t + idx * 0.05);
      // LFO-like frequency wobble via scheduled values
      for (let j = 0; j < 8; j++) {
        const time = t + idx * 0.05 + j * 0.12;
        osc.frequency.setValueAtTime(
          baseF + Math.sin(j * 1.5) * 100,
          time
        );
      }
      g.gain.setValueAtTime(0.12, t + idx * 0.05);
      g.gain.linearRampToValueAtTime(0.15, t + 0.4);
      g.gain.exponentialRampToValueAtTime(0.001, t + 1.0);
      osc.connect(g).connect(master);
      osc.start(t + idx * 0.05);
      osc.stop(t + 1.0);
    });
    return 1100;
  }
}

/* ── Component ── */

export default function SoundboardView() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [pulsingSound, setPulsingSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.7);
  const engineRef = useRef<SoundEngine | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getEngine = useCallback(() => {
    if (!engineRef.current) {
      engineRef.current = new SoundEngine();
    }
    return engineRef.current;
  }, []);

  // Update engine volume when slider changes
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setVolume(volume);
    }
  }, [volume]);

  const filtered =
    activeCategory === "All"
      ? SOUNDS
      : SOUNDS.filter((s) => s.category === activeCategory);

  const playSound = useCallback(
    (name: string) => {
      const engine = getEngine();
      engine.setVolume(volume);
      const durationMs = engine.play(name);

      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setPlayingSound(name);
      setPulsingSound(name);

      // Remove pulse class after animation completes
      setTimeout(() => setPulsingSound(null), 400);

      // Remove playing glow after sound finishes
      timeoutRef.current = setTimeout(() => {
        setPlayingSound(null);
        timeoutRef.current = null;
      }, durationMs);
    },
    [getEngine, volume]
  );

  return (
    <main className="dashboard-main">
      <div className="view-header">
        <h2 className="view-title">Sound Board</h2>
        <p className="view-subtitle">
          Synthetic game sound effects &mdash; powered by Web Audio API
        </p>
      </div>

      <div className="soundboard-volume-row">
        <label className="soundboard-volume-label" htmlFor="sb-vol">
          Volume
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
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`view-category-tab${activeCategory === cat ? " active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="view-grid view-grid-sounds">
        {filtered.map((sound) => {
          const isPlaying = playingSound === sound.name;
          const isPulsing = pulsingSound === sound.name;
          let cls = "view-sound-btn";
          if (isPlaying) cls += " playing";
          if (isPulsing) cls += " pulse";

          return (
            <button
              key={sound.name}
              className={cls}
              onClick={() => playSound(sound.name)}
            >
              <span className="view-sound-emoji">{sound.emoji}</span>
              <span className="view-sound-name">{sound.name}</span>
            </button>
          );
        })}
      </div>
    </main>
  );
}
