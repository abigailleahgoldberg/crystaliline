"use client";

const RELEASES = [
  {
    name: "Crystaliline",
    version: "v1.0.0",
    tag: "Latest",
    date: "March 15, 2026",
    changelog: "Initial public release with dashboard, asset browser, skin mods, and server tools integration.",
    link: "https://github.com/crystaliline/crystaliline/releases/tag/v1.0.0",
  },
  {
    name: "Crystaliline",
    version: "v0.9.0",
    tag: "Beta",
    date: "March 1, 2026",
    changelog: "Beta release with core modding features, Discord auth, and community tools.",
    link: "https://github.com/crystaliline/crystaliline/releases/tag/v0.9.0",
  },
  {
    name: "Crystal Loader",
    version: "v1.0",
    tag: "Stable",
    date: "February 20, 2026",
    changelog: "Standalone mod loader for injecting custom skins and assets into OG Fortnite builds.",
    link: "https://github.com/crystaliline/crystal-loader/releases/tag/v1.0",
  },
];

export default function DownloadsView() {
  return (
    <main className="dashboard-main">
      <div className="view-header">
        <h2 className="view-title">Downloads</h2>
        <p className="view-subtitle">Get the latest Crystaliline releases</p>
      </div>

      <div className="view-downloads-list">
        {RELEASES.map((r) => (
          <div key={r.version + r.name} className="view-download-card">
            <div className="view-download-header">
              <div>
                <h3 className="view-download-name">{r.name} <span className="view-download-version">{r.version}</span></h3>
                <span className="view-download-date">{r.date}</span>
              </div>
              <span className={`view-download-tag ${r.tag === "Latest" ? "latest" : r.tag === "Beta" ? "beta" : "stable"}`}>
                {r.tag}
              </span>
            </div>
            <p className="view-download-changelog">{r.changelog}</p>
            <a href={r.link} target="_blank" rel="noopener noreferrer" className="view-btn">
              Download
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}
