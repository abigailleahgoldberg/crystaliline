"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

interface Settings {
  theme: string;
  notifyUpdates: boolean;
  notifyNews: boolean;
  notifyCommunity: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  theme: "dark",
  notifyUpdates: true,
  notifyNews: true,
  notifyCommunity: false,
};

export default function SettingsView() {
  const { data: session } = useSession();
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("crystaliline-settings");
      if (stored) setSettings(JSON.parse(stored));
    } catch {}
  }, []);

  const save = () => {
    localStorage.setItem("crystaliline-settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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

      <div className="view-settings-sections">
        {/* Theme */}
        <div className="view-settings-card">
          <h3 className="view-settings-label">Theme</h3>
          <div className="view-settings-row">
            <button
              className={`view-theme-btn${settings.theme === "dark" ? " active" : ""}`}
              onClick={() => setSettings({ ...settings, theme: "dark" })}
            >
              🌙 Dark
            </button>
            <button
              className={`view-theme-btn${settings.theme === "darker" ? " active" : ""}`}
              onClick={() => setSettings({ ...settings, theme: "darker" })}
            >
              🖤 Darker
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="view-settings-card">
          <h3 className="view-settings-label">Notifications</h3>
          <label className="view-checkbox-row">
            <input
              type="checkbox"
              checked={settings.notifyUpdates}
              onChange={(e) => setSettings({ ...settings, notifyUpdates: e.target.checked })}
            />
            <span>App updates</span>
          </label>
          <label className="view-checkbox-row">
            <input
              type="checkbox"
              checked={settings.notifyNews}
              onChange={(e) => setSettings({ ...settings, notifyNews: e.target.checked })}
            />
            <span>News & announcements</span>
          </label>
          <label className="view-checkbox-row">
            <input
              type="checkbox"
              checked={settings.notifyCommunity}
              onChange={(e) => setSettings({ ...settings, notifyCommunity: e.target.checked })}
            />
            <span>Community activity</span>
          </label>
        </div>

        {/* Discord Account */}
        <div className="view-settings-card">
          <h3 className="view-settings-label">Connected Account</h3>
          {user ? (
            <div className="view-settings-discord">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="view-settings-avatar" />
              ) : (
                <div className="view-settings-avatar view-settings-avatar-fallback">
                  {user.name?.[0] || "?"}
                </div>
              )}
              <div>
                <div className="view-settings-username">{user.name}</div>
                <div className="view-settings-provider">Discord</div>
              </div>
            </div>
          ) : (
            <p className="view-settings-muted">No account connected.</p>
          )}
        </div>

        {/* Actions */}
        <div className="view-settings-actions">
          <button className="view-btn view-btn-primary" onClick={save}>
            {saved ? "✓ Saved!" : "Save Settings"}
          </button>
          <button className="view-btn view-btn-danger" onClick={() => signOut({ callbackUrl: "/" })}>
            Sign Out
          </button>
        </div>
      </div>
    </main>
  );
}
