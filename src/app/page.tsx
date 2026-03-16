"use client";

import { useMemo } from "react";
import Link from "next/link";

// Generate diverse crystal-like gradient cards
function generateCardGradients(count: number): string[] {
  const palettes = [
    "linear-gradient(135deg, #3d2200 0%, #CC6B00 50%, #1a0f00 100%)",
    "linear-gradient(135deg, #1a0f00 0%, #FF8C00 40%, #2a1500 100%)",
    "linear-gradient(225deg, #0d0800 0%, #b35e00 50%, #331a00 100%)",
    "radial-gradient(ellipse at 30% 20%, #CC6B00 0%, #1a0f00 60%, #000 100%)",
    "radial-gradient(ellipse at 70% 80%, #FF8C00 0%, #2a1500 50%, #0a0500 100%)",
    "radial-gradient(circle at 50% 50%, #b35e00 0%, #1a0f00 70%)",
    "radial-gradient(ellipse at 20% 70%, #e07800 0%, #0d0800 60%)",
    "linear-gradient(60deg, #000 0%, #CC6B00 30%, #000 35%, #FF8C00 65%, #000 70%)",
    "linear-gradient(120deg, #1a0f00 0%, #e07800 25%, #0d0800 50%, #CC6B00 75%, #1a0f00 100%)",
    "linear-gradient(45deg, #0a0500 0%, #FF8C00 20%, #1a0f00 40%, #b35e00 60%, #0a0500 80%)",
    "linear-gradient(180deg, #2a1f00 0%, #d4a017 50%, #1a1200 100%)",
    "linear-gradient(0deg, #0d0a00 0%, #c89a1d 40%, #2a1f00 100%)",
    "radial-gradient(ellipse at 40% 30%, #d4a017 0%, #1a1200 55%, #000 100%)",
    "linear-gradient(135deg, #0a0500 0%, #4d2e00 30%, #0a0500 60%, #331a00 100%)",
    "linear-gradient(160deg, #1a0f00 0%, #663c00 40%, #0d0800 80%)",
    "linear-gradient(135deg, #FF8C00 0%, #CC6B00 30%, #993f00 60%, #1a0f00 100%)",
    "radial-gradient(ellipse at 80% 20%, #FF8C00 0%, #663c00 40%, #0a0500 100%)",
    "linear-gradient(200deg, #0d0800 0%, #FF8C00 35%, #CC6B00 65%, #0a0500 100%)",
    "linear-gradient(135deg, #1a1200 0%, #332200 50%, #0d0a00 100%)",
    "linear-gradient(45deg, #0d0800 0%, #261700 30%, #1a0f00 60%, #331a00 100%)",
    "radial-gradient(circle at 60% 40%, #4d2e00 0%, #0d0800 80%)",
    "linear-gradient(135deg, #000 0%, #993f00 20%, #000 40%, #CC6B00 60%, #000 80%, #663c00 100%)",
    "linear-gradient(90deg, #1a0f00 0%, #FF8C00 15%, #0a0500 30%, #CC6B00 50%, #0d0800 70%, #b35e00 85%, #1a0f00 100%)",
    "conic-gradient(from 45deg at 50% 50%, #0a0500, #CC6B00, #0a0500, #FF8C00, #0a0500)",
    "conic-gradient(from 180deg at 30% 70%, #1a0f00, #b35e00, #0d0800, #993f00, #1a0f00)",
    "linear-gradient(135deg, #0d0800 0%, #CC6B00 50%, #1a0f00 51%, #FF8C00 100%)",
    "radial-gradient(ellipse at 10% 90%, #e07800 0%, #1a0f00 40%, #0a0500 100%)",
    "linear-gradient(270deg, #0a0500 0%, #663c00 30%, #FF8C00 50%, #663c00 70%, #0a0500 100%)",
    "radial-gradient(ellipse at 90% 10%, #CC6B00 0%, #331a00 50%, #000 100%)",
    "linear-gradient(150deg, #2a1500 0%, #e07800 35%, #1a0f00 70%, #993f00 100%)",
  ];
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(palettes[i % palettes.length]);
  }
  return result;
}

const CARDS_PER_COL = 12;
const NUM_COLS = 7;

export default function Home() {
  const columns = useMemo(() => {
    const allGradients = generateCardGradients(NUM_COLS * CARDS_PER_COL);
    const cols: string[][] = [];
    for (let c = 0; c < NUM_COLS; c++) {
      const cards: string[] = [];
      for (let r = 0; r < CARDS_PER_COL; r++) {
        cards.push(allGradients[(c * CARDS_PER_COL + r) % allGradients.length]);
      }
      cols.push(cards);
    }
    return cols;
  }, []);

  return (
    <div className="landing-root">
      {/* ── Background grid ── */}
      <div className="bg-grid-wrap">
        <div className="bg-grid">
          {columns.map((cards, ci) => (
            <div className="bg-col" key={ci}>
              {[...cards, ...cards].map((grad, ri) => (
                <div
                  className="bg-card"
                  key={ri}
                  style={{ background: grad }}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="bg-overlay" />
      </div>

      {/* ── Pill navbar ── */}
      <header className="pill-header">
        <nav className="pill-nav">
          <div className="nav-logo">
            <Link href="/" className="nav-logo-link">
              Crystal<span className="accent">line</span>
            </Link>
          </div>
          <ul className="nav-links">
            <li>
              <a href="https://discord.gg/crystaliline" target="_blank" rel="noopener noreferrer">
                Discord
              </a>
            </li>
            <li>
              <a href="https://github.com/skids-zj71" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </li>
            <li className="hide-mobile">
              <Link href="/about">About</Link>
            </li>
            <li className="hide-mobile">
              <Link href="/community">Community</Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* ── Hero ── */}
      <div className="hero">
        <div className="hero-content">
          <h1>
            Crystal<span className="gradient">line</span>
          </h1>
          <p className="subtitle">
            The modern modding tool for OG Fortnite servers.
          </p>
          <a
            href="https://discord.gg/crystaliline"
            target="_blank"
            rel="noopener noreferrer"
            className="cta"
          >
            DOWNLOAD
          </a>
        </div>
      </div>
    </div>
  );
}
