"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Navbar from "@/components/Navbar";
import BackgroundGrid from "@/components/BackgroundGrid";

/* ── Role-to-tier mapping ── */
const ROLE_TIERS: Record<string, { tier: string; color: string }> = {
  Admin: { tier: "Admin", color: "#FF4444" },
  Moderator: { tier: "Moderator", color: "#8B5CF6" },
  Contributor: { tier: "Contributor", color: "#3B82F6" },
  Member: { tier: "Basic Member", color: "#FFB347" },
};

const ACCESS_LEVELS = [
  {
    tier: "Basic Member",
    description: "View dashboard and community stats",
    icon: "👤",
    unlocked: (roles: string[]) => roles.length > 0,
  },
  {
    tier: "Contributor",
    description: "Access tools section and beta features",
    icon: "🛠",
    unlocked: (roles: string[]) =>
      roles.some((r) => ["Contributor", "Moderator", "Admin"].includes(r)),
  },
  {
    tier: "Moderator",
    description: "Access admin panel and moderation tools",
    icon: "🛡",
    unlocked: (roles: string[]) =>
      roles.some((r) => ["Moderator", "Admin"].includes(r)),
  },
  {
    tier: "Admin",
    description: "Full access to all features and settings",
    icon: "⚡",
    unlocked: (roles: string[]) => roles.includes("Admin"),
  },
];

/* ── Some known role colors (fallback) ── */
function getRoleColor(roleName: string): string {
  return ROLE_TIERS[roleName]?.color || "#71717a";
}

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="page-root">
        <BackgroundGrid darker />
        <Navbar />
        <div className="snap-section">
          <div className="dashboard-loading">
            <div className="dashboard-spinner" />
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="page-root">
        <BackgroundGrid darker />
        <Navbar />
        <div className="snap-section snap-hero">
          <h1>
            <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="hero-sub">
            Sign in with Discord to view your roles, access level, and server status.
          </p>
          <button onClick={() => signIn("discord")} className="login-button">
            Login with Discord
          </button>
        </div>
      </div>
    );
  }

  const user = session.user;
  const avatarUrl =
    user.discordId && user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png?size=256`
      : null;

  const roleNames = user.roles || [];

  return (
    <div className="page-root">
      <BackgroundGrid darker />
      <Navbar />

      <div className="snap-section">
        <div className="section-inner">
          {/* User profile header */}
          <div className="dashboard-header">
            <div className="dashboard-profile">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="user-avatar" />
              ) : (
                <div className="user-avatar user-avatar-fallback">
                  {user.name?.[0] || "?"}
                </div>
              )}
              <div className="dashboard-user-info">
                <h1 className="dashboard-username">{user.name}</h1>
                <p className="dashboard-discriminator">
                  {user.discriminator && user.discriminator !== "0"
                    ? `#${user.discriminator}`
                    : `@${user.name}`}
                </p>
              </div>
            </div>
            <button onClick={() => signOut()} className="logout-button">
              Logout
            </button>
          </div>

          {/* Cards grid */}
          <div className="dashboard-grid">
            {/* Server status */}
            <div className="dashboard-card">
              <h3 className="dashboard-card-title">Server Status</h3>
              <div className="server-status">
                <span
                  className="status-dot"
                  style={{
                    background: user.inGuild ? "#22c55e" : "#ef4444",
                  }}
                />
                <span className="status-text">
                  {user.inGuild
                    ? "Member of Crystaliline"
                    : "Not in Crystaliline server"}
                </span>
              </div>
              {!user.inGuild && (
                <a
                  href="https://discord.gg/crystaliline"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-link"
                  style={{ marginTop: "1rem", display: "inline-block" }}
                >
                  Join Server
                </a>
              )}
            </div>

            {/* Roles */}
            <div className="dashboard-card">
              <h3 className="dashboard-card-title">Your Roles</h3>
              {roleNames.length > 0 ? (
                <div className="roles-list">
                  {roleNames.map((roleId) => (
                    <span
                      key={roleId}
                      className="role-badge"
                      style={{
                        borderColor: getRoleColor(roleId),
                        color: getRoleColor(roleId),
                      }}
                    >
                      {roleId}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="dashboard-empty">
                  {user.inGuild
                    ? "No named roles assigned yet"
                    : "Join the server to get roles"}
                </p>
              )}
            </div>

            {/* Access levels */}
            <div className="dashboard-card dashboard-card-wide">
              <h3 className="dashboard-card-title">Your Access Level</h3>
              <div className="access-list">
                {ACCESS_LEVELS.map((level) => {
                  const unlocked = level.unlocked(roleNames);
                  return (
                    <div
                      key={level.tier}
                      className={`access-card ${unlocked ? "access-unlocked" : "access-locked"}`}
                    >
                      <span className="access-icon">{level.icon}</span>
                      <div className="access-info">
                        <span className="access-tier">{level.tier}</span>
                        <span className="access-desc">{level.description}</span>
                      </div>
                      <span className="access-status">
                        {unlocked ? "✓" : "🔒"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
