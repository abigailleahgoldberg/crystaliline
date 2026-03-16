"use client";

import { useState } from "react";

interface SoundButton {
  emoji: string;
  name: string;
  category: string;
}

const SOUNDS: SoundButton[] = [
  { emoji: "🔫", name: "AR Shot", category: "Weapons" },
  { emoji: "💥", name: "Shotgun Blast", category: "Weapons" },
  { emoji: "🎯", name: "Sniper Shot", category: "Weapons" },
  { emoji: "🚀", name: "RPG Launch", category: "Weapons" },
  { emoji: "⛏️", name: "Pickaxe Swing", category: "Weapons" },
  { emoji: "💣", name: "Grenade Explosion", category: "Weapons" },
  { emoji: "💃", name: "Default Dance", category: "Emotes" },
  { emoji: "🕺", name: "Floss", category: "Emotes" },
  { emoji: "😂", name: "Take the L", category: "Emotes" },
  { emoji: "🎉", name: "Orange Justice", category: "Emotes" },
  { emoji: "🫡", name: "Salute", category: "Emotes" },
  { emoji: "🪩", name: "Disco Fever", category: "Emotes" },
  { emoji: "🔔", name: "Notification", category: "UI" },
  { emoji: "🎒", name: "Inventory Open", category: "UI" },
  { emoji: "🗺️", name: "Map Open", category: "UI" },
  { emoji: "⭐", name: "Level Up", category: "UI" },
  { emoji: "🛒", name: "Item Shop", category: "UI" },
  { emoji: "🏆", name: "Victory Royale", category: "Gameplay" },
  { emoji: "🚌", name: "Battle Bus", category: "Gameplay" },
  { emoji: "🌀", name: "Storm Closing", category: "Gameplay" },
  { emoji: "📦", name: "Chest Open", category: "Gameplay" },
  { emoji: "🛡️", name: "Shield Pop", category: "Gameplay" },
  { emoji: "🪂", name: "Glider Deploy", category: "Gameplay" },
];

const CATEGORIES = ["All", "Weapons", "Emotes", "UI", "Gameplay"];

export default function SoundboardView() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [toast, setToast] = useState("");

  const filtered =
    activeCategory === "All"
      ? SOUNDS
      : SOUNDS.filter((s) => s.category === activeCategory);

  const playSound = (name: string) => {
    setToast(`🔊 "${name}" — Sound coming soon`);
    setTimeout(() => setToast(""), 2000);
  };

  return (
    <main className="dashboard-main">
      <div className="view-header">
        <h2 className="view-title">Sound Board</h2>
        <p className="view-subtitle">Fortnite sound effects</p>
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
        {filtered.map((sound) => (
          <button
            key={sound.name}
            className="view-sound-btn"
            onClick={() => playSound(sound.name)}
          >
            <span className="view-sound-emoji">{sound.emoji}</span>
            <span className="view-sound-name">{sound.name}</span>
          </button>
        ))}
      </div>

      {toast && <div className="view-toast">{toast}</div>}
    </main>
  );
}
