"use client";

import { useSession, signIn, signOut } from "next-auth/react";

const REQUIRED_ROLE = "1482915649142653080";

const NAV_SECTIONS = [
  {
    label: "GENERAL",
    items: [
      { icon: "🏠", name: "Home", id: "home" },
      { icon: "📰", name: "News & Updates", id: "news" },
    ],
  },
  {
    label: "TOOLS",
    items: [
      { icon: "📦", name: "Assets", id: "assets" },
      { icon: "📁", name: "Files", id: "files" },
      { icon: "🗺️", name: "Map", id: "map" },
      { icon: "🎵", name: "Music", id: "music" },
    ],
  },
  {
    label: "ONLINE",
    items: [
      { icon: "💬", name: "Chat", id: "chat" },
      { icon: "🏆", name: "Leaderboard", id: "leaderboard" },
    ],
  },
  {
    label: "SETTINGS",
    items: [
      { icon: "🔌", name: "Plugins", id: "plugins" },
      { icon: "📤", name: "Export Options", id: "export" },
      { icon: "⚙️", name: "App Settings", id: "settings" },
    ],
  },
  {
    label: "INFO",
    items: [
      { icon: "🖥️", name: "Console", id: "console" },
      { icon: "❓", name: "Help", id: "help" },
    ],
  },
];

const NEWS_CARDS = [
  {
    tag: "UPDATE",
    date: "Mar 15",
    title: "Release v1.0.0",
    desc: "Crystaliline is now available!",
  },
  {
    tag: "NEWS",
    date: "Mar 15",
    title: "Community Launch",
    desc: "Join the growing Crystaliline community!",
  },
  {
    tag: "NEWS",
    date: "Mar 14",
    title: "Open Source",
    desc: "Crystaliline is now fully open source!",
  },
];

const FEATURED_CARDS = [
  { title: "Crystal Loader", author: "ZJ" },
  { title: "Skin Swapper", author: "Community" },
  { title: "Map Editor", author: "Contributors" },
];

const SOCIAL_LINKS = [
  { icon: "💬", label: "Discord", href: "https://discord.gg/crystaliline" },
  { icon: "🐙", label: "GitHub", href: "https://github.com/crystaliline" },
  { icon: "👥", label: "Community", href: "/community" },
  { icon: "🌐", label: "Website", href: "/" },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();

  /* Loading */
  if (status === "loading") {
    return (
      <div className="landing-root">
        <div className="hero">
          <div className="hero-content">
            <div className="dashboard-spinner" />
            <p style={{ color: "#71717a", marginTop: "1rem" }}>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  /* Not signed in */
  if (!session) {
    return (
      <div className="landing-root">
        <div className="bg-grid-wrap">
          <div className="bg-overlay" />
        </div>
        <header className="pill-header">
          <nav className="pill-nav">
            <div className="nav-logo">
              <a href="/" className="nav-logo-link">Crystal<span className="accent">line</span></a>
            </div>
            <ul className="nav-links">
              <li><a href="https://discord.gg/crystaliline" target="_blank" rel="noopener noreferrer">Discord</a></li>
              <li><a href="https://github.com/skids-zj71" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li className="hide-mobile"><a href="/about">About</a></li>
              <li className="hide-mobile"><a href="/community">Community</a></li>
            </ul>
          </nav>
        </header>
        <div className="hero">
          <div className="hero-content">
            <h1>Crystal<span className="gradient">line</span></h1>
            <p className="subtitle">Sign in with Discord to access the dashboard.</p>
            <button onClick={() => signIn("discord", { callbackUrl: "/dashboard" })} className="cta" style={{ border: "none", cursor: "pointer", fontFamily: "inherit" }}>
              LOGIN WITH DISCORD
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* Role check */
  const roles = session.user.roles || [];
  const hasAccess = roles.includes(REQUIRED_ROLE);

  if (!hasAccess) {
    return (
      <div className="landing-root">
        <div className="bg-grid-wrap">
          <div className="bg-overlay" />
        </div>
        <header className="pill-header">
          <nav className="pill-nav">
            <div className="nav-logo">
              <a href="/" className="nav-logo-link">Crystal<span className="accent">line</span></a>
            </div>
            <ul className="nav-links">
              <li><a href="https://discord.gg/crystaliline" target="_blank" rel="noopener noreferrer">Discord</a></li>
              <li><a href="https://github.com/skids-zj71" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            </ul>
          </nav>
        </header>
        <div className="hero">
          <div className="hero-content">
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔒</div>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>Access <span className="gradient">Denied</span></h1>
            <p className="subtitle" style={{ maxWidth: "420px", margin: "0.5rem auto 2rem" }}>
              You need the Crystaliline role to access the dashboard. Join our Discord server to get the role.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="https://discord.gg/crystaliline" target="_blank" rel="noopener noreferrer" className="cta" style={{ textDecoration: "none" }}>
                JOIN DISCORD
              </a>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="cta" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer", fontFamily: "inherit" }}>
                SIGN OUT
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* Build avatar URL */
  const user = session.user;
  const avatarUrl =
    user.discordId && user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png?size=256`
      : null;
  const handle =
    user.discriminator && user.discriminator !== "0"
      ? `#${user.discriminator}`
      : `@${user.name}`;

  return (
    <div className="dashboard-layout">
      {/* ── SIDEBAR ── */}
      <aside className="dashboard-sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <span className="sidebar-logo-text">
            <span style={{ color: "#fff" }}>Crystal</span>
            <span className="gradient-text">line</span>
          </span>
          <span className="sidebar-version">v1.0.0</span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="sidebar-section">
              <span className="sidebar-section-label">{section.label}</span>
              {section.items.map((item) => (
                <button
                  key={item.id}
                  className={`sidebar-item${item.id === "home" ? " active" : ""}`}
                >
                  <span className="sidebar-item-icon">{item.icon}</span>
                  {item.name}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* User profile */}
        <div className="sidebar-profile">
          <div className="sidebar-profile-sep" />
          <div className="sidebar-profile-row">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="sidebar-avatar" />
            ) : (
              <div className="sidebar-avatar sidebar-avatar-fallback">
                {user.name?.[0] || "?"}
              </div>
            )}
            <div className="sidebar-profile-info">
              <span className="sidebar-profile-name">{user.name}</span>
              <span className="sidebar-profile-handle">{handle}</span>
            </div>
          </div>
          <div className="sidebar-xp">
            <div className="sidebar-xp-labels">
              <span>Level 1</span>
              <span>0/100 XP</span>
            </div>
            <div className="sidebar-xp-track">
              <div className="sidebar-xp-fill" style={{ width: "0%" }} />
            </div>
          </div>
          <button onClick={() => signOut()} className="sidebar-signout">
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="dashboard-main">
        {/* Header */}
        <div className="dashboard-content-header">
          <h1 className="dashboard-content-title">
            <span style={{ color: "#fff" }}>Crystal</span>
            <span className="gradient-text">line</span>
          </h1>
          <div className="social-pills">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="social-pill"
              >
                <span>{link.icon}</span>
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* News & Updates */}
        <section className="dashboard-section">
          <h2 className="dashboard-section-title">News & Updates</h2>
          <div className="news-grid">
            {NEWS_CARDS.map((card) => (
              <div key={card.title} className="news-card">
                <div className="news-card-image" />
                <div className="news-card-body">
                  <div className="news-card-meta">
                    <span className={`card-tag ${card.tag === "UPDATE" ? "update" : "news"}`}>
                      {card.tag}
                    </span>
                    <span className="news-card-date">{card.date}</span>
                  </div>
                  <h3 className="news-card-title">{card.title}</h3>
                  <p className="news-card-desc">{card.desc}</p>
                </div>
                <span className="news-card-arrow">→</span>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Mods */}
        <section className="dashboard-section">
          <h2 className="dashboard-section-title">Featured Mods</h2>
          <div className="featured-grid">
            {FEATURED_CARDS.map((card) => (
              <div key={card.title} className="featured-card">
                <div className="featured-card-image" />
                <div className="featured-card-body">
                  <h3 className="featured-card-title">{card.title}</h3>
                  <p className="featured-card-author">by {card.author}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
