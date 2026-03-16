"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { User, Palette, Bell, Download, Wrench, Info } from "lucide-react";

interface Settings {
  theme: "dark" | "midnight" | "oled";
  fontSize: "small" | "medium" | "large";
  notifyNews: boolean;
  notifyReleases: boolean;
  notifyCommunity: boolean;
  notifySound: boolean;
  downloadLocation: string;
  autoUpdate: boolean;
  keepDownloads: boolean;
  debugMode: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  theme: "dark",
  fontSize: "medium",
  notifyNews: true,
  notifyReleases: true,
  notifyCommunity: false,
  notifySound: true,
  downloadLocation: "~/Downloads/Crystaliline",
  autoUpdate: true,
  keepDownloads: true,
  debugMode: false,
};

const STORAGE_KEY = "crystaliline-settings";

export default function SettingsView() {
  const { data: session } = useSession();
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); } catch {}
  }, [settings, loaded]);

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const clearCache = () => {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key !== STORAGE_KEY) localStorage.removeItem(key);
      });
    } catch {}
  };

  const user = session?.user;
  const avatarUrl =
    user?.discordId && user?.avatar
      ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png?size=128`
      : null;

  return (
    <main className="dashboard-main">
      <div className="view-header">
        <h2 className="view-title">Settings</h2>
        <p className="view-subtitle">Customize your Crystaliline experience</p>
      </div>

      {/* ACCOUNT */}
      <div className="settings-section">
        <h3 className="settings-header">
          <User size={20} color="#FF8C00" style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
          Account
        </h3>
        <div className="settings-separator" />
        <div className="settings-account-card">
          {user ? (
            <>
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" />
              ) : (
                <div className="account-avatar-fallback">{user.name?.[0] || "?"}</div>
              )}
              <div className="settings-account-info">
                <div className="settings-account-name">{user.name}</div>
                {user.discordId && (
                  <div className="settings-account-detail">ID: {user.discordId}</div>
                )}
                <div className="settings-account-detail">Connected since March 2024</div>
              </div>
              <button className="settings-btn settings-btn-danger" onClick={() => signOut({ callbackUrl: "/" })}>
                Sign Out
              </button>
            </>
          ) : (
            <span className="settings-account-detail">No account connected.</span>
          )}
        </div>
      </div>

      {/* APPEARANCE */}
      <div className="settings-section">
        <h3 className="settings-header">
          <Palette size={20} color="#FF8C00" style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
          Appearance
        </h3>
        <div className="settings-separator" />
        <div className="settings-toggle-row">
          <span className="settings-toggle-label">Theme</span>
        </div>
        <div className="settings-theme-options">
          {([["dark", "#1a1a24", "Dark"], ["midnight", "#0d0d14", "Midnight"], ["oled", "#000000", "OLED"]] as const).map(([id, color, label]) => (
            <button
              key={id}
              className={`settings-theme-btn${settings.theme === id ? " active" : ""}`}
              onClick={() => update("theme", id)}
            >
              <span className="settings-theme-swatch" style={{ backgroundColor: color }} />
              {label}
            </button>
          ))}
        </div>
        <div className="settings-toggle-row" style={{ marginTop: "1rem" }}>
          <span className="settings-toggle-label">Font Size</span>
        </div>
        <div className="settings-font-options">
          {(["small", "medium", "large"] as const).map((size) => (
            <button
              key={size}
              className={`settings-font-btn${settings.fontSize === size ? " active" : ""}`}
              onClick={() => update("fontSize", size)}
            >
              {size.charAt(0).toUpperCase() + size.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* NOTIFICATIONS */}
      <div className="settings-section">
        <h3 className="settings-header">
          <Bell size={20} color="#FF8C00" style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
          Notifications
        </h3>
        <div className="settings-separator" />
        {([
          ["notifyNews", "News Updates"],
          ["notifyReleases", "New Releases"],
          ["notifyCommunity", "Community Messages"],
          ["notifySound", "Sound Effects"],
        ] as const).map(([key, label]) => (
          <div key={key} className="settings-toggle-row">
            <span className="settings-toggle-label">{label}</span>
            <label className="toggle-switch">
              <input type="checkbox" checked={settings[key]} onChange={(e) => update(key, e.target.checked)} />
              <span className="toggle-slider" />
            </label>
          </div>
        ))}
      </div>

      {/* DOWNLOADS */}
      <div className="settings-section">
        <h3 className="settings-header">
          <Download size={20} color="#FF8C00" style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
          Downloads
        </h3>
        <div className="settings-separator" />
        <div className="settings-toggle-row">
          <span className="settings-toggle-label">Download Location</span>
        </div>
        <input
          type="text"
          className="settings-input"
          value={settings.downloadLocation}
          onChange={(e) => update("downloadLocation", e.target.value)}
        />
        <div className="settings-toggle-row" style={{ marginTop: "0.5rem" }}>
          <span className="settings-toggle-label">Auto-Update</span>
          <label className="toggle-switch">
            <input type="checkbox" checked={settings.autoUpdate} onChange={(e) => update("autoUpdate", e.target.checked)} />
            <span className="toggle-slider" />
          </label>
        </div>
        <div className="settings-toggle-row">
          <span className="settings-toggle-label">Keep Downloaded Files</span>
          <label className="toggle-switch">
            <input type="checkbox" checked={settings.keepDownloads} onChange={(e) => update("keepDownloads", e.target.checked)} />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>

      {/* ADVANCED */}
      <div className="settings-section">
        <h3 className="settings-header">
          <Wrench size={20} color="#FF8C00" style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
          Advanced
        </h3>
        <div className="settings-separator" />
        <div className="settings-btn-row">
          <button className="settings-btn" onClick={clearCache}>Clear Cache</button>
          <button className="settings-btn" onClick={() => setSettings(DEFAULT_SETTINGS)}>Reset Settings</button>
        </div>
        <div className="settings-toggle-row">
          <span className="settings-toggle-label">Debug Mode</span>
          <label className="toggle-switch">
            <input type="checkbox" checked={settings.debugMode} onChange={(e) => update("debugMode", e.target.checked)} />
            <span className="toggle-slider" />
          </label>
        </div>
        <p className="settings-version-text">Version: v1.0.0</p>
      </div>

      {/* ABOUT */}
      <div className="settings-section">
        <h3 className="settings-header">
          <Info size={20} color="#FF8C00" style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
          About
        </h3>
        <div className="settings-separator" />
        <p className="settings-version-text">Crystaliline v1.0.0</p>
        <p className="settings-version-text">Build: March 2026</p>
        <div className="settings-about-links">
          <a href="https://github.com/crystaliline" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://discord.gg/crystaliline" target="_blank" rel="noopener noreferrer">Discord</a>
          <a href="/" >Website</a>
        </div>
      </div>
    </main>
  );
}
