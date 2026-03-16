import Navbar from "@/components/Navbar";
import BackgroundGrid from "@/components/BackgroundGrid";
import Link from "next/link";

export default function About() {
  return (
    <div className="page-root">
      <BackgroundGrid darker />
      <Navbar />
      <div className="page-container" style={{ position: "relative", zIndex: 10 }}>
        {/* Hero */}
        <div className="page-hero">
          <h1>About Crystal<span className="gradient">line</span></h1>
          <p className="hero-sub">
            The story behind the modding tool that&apos;s changing how the OG Fortnite community builds and customizes their servers.
          </p>
        </div>

        {/* What is Crystaliline */}
        <div className="section">
          <h2 className="section-title gradient-text">What is Crystaliline?</h2>
          <div className="text-block">
            <p>
              Crystaliline is a modern modding tool designed specifically for OG Fortnite server projects. It gives developers and modders the power to add, change, and customize virtually anything in their projects — from cosmetics and gameplay mechanics to server configurations and beyond.
            </p>
            <p>
              Unlike scattered scripts and one-off tools, Crystaliline brings everything together into a cohesive platform. It&apos;s the central hub for your modding workflow, connecting you with the tools, resources, and community you need to bring your vision to life.
            </p>
            <p>
              Whether you&apos;re running a private server for friends or building a full-scale community experience, Crystaliline gives you the flexibility and control to make it yours.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="section">
          <h2 className="section-title gradient-text">How It Works</h2>
          <p className="section-subtitle">
            Crystaliline is designed to be simple to pick up but powerful enough for advanced modders.
          </p>
          <div className="card-grid-3">
            {[
              { step: "01", title: "Explore", desc: "Browse available modifications, tools, and community resources. Find exactly what you need or discover something new.", icon: "🔍" },
              { step: "02", title: "Customize", desc: "Use Crystaliline's tools to apply modifications to your project. Mix and match features to create your perfect setup.", icon: "✏️" },
              { step: "03", title: "Deploy", desc: "Push your customized project to your server with confidence. Test locally first, then go live when you're ready.", icon: "🚀" },
            ].map((item) => (
              <div className="content-card" key={item.title}>
                <div className="card-label">STEP {item.step}</div>
                <div className="card-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Vision & Roadmap */}
        <div className="section">
          <h2 className="section-title gradient-text">The Vision</h2>
          <p className="section-subtitle">
            Where Crystaliline is headed and what we&apos;re building toward.
          </p>
          {[
            {
              phase: "Phase 1", title: "Foundation", status: "In Progress",
              items: ["Core modding tool functionality", "Website and community hub launch", "GitHub repository and documentation", "Discord community setup"],
            },
            {
              phase: "Phase 2", title: "Expansion", status: "Planned",
              items: ["Plugin system for community-created mods", "Visual mod editor for non-technical users", "Expanded tool integrations", "Mod template library"],
            },
            {
              phase: "Phase 3", title: "Ecosystem", status: "Future",
              items: ["Mod marketplace for sharing creations", "Server management dashboard", "Automated testing for mods", "API for third-party integrations"],
            },
          ].map((phase) => (
            <div className="roadmap-card" key={phase.phase}>
              <div className="roadmap-header">
                <div>
                  <div className="roadmap-label">{phase.phase}</div>
                  <div className="roadmap-title">{phase.title}</div>
                </div>
                <span className={phase.status === "In Progress" ? "roadmap-badge" : "roadmap-badge planned"}>
                  {phase.status}
                </span>
              </div>
              <ul className="roadmap-list">
                {phase.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Creator */}
        <div className="section">
          <h2 className="section-title gradient-text">The Creator</h2>
          <p className="section-subtitle">The person behind Crystaliline.</p>
          <div className="creator-card">
            <div className="creator-avatar">ZJ</div>
            <div className="creator-name">ZJ</div>
            <div className="creator-handle">thee zj71</div>
            <div className="creator-role">Creator &amp; Lead Developer</div>
            <p className="creator-bio">
              A passionate developer and OG Fortnite enthusiast who saw the need for better modding tools. ZJ built Crystaliline to give the community the power to customize their servers without limits — bringing together scattered tools into one cohesive platform.
            </p>
            <a
              href="https://github.com/skids-zj71"
              target="_blank"
              rel="noopener noreferrer"
              className="creator-link"
            >
              GitHub
            </a>
          </div>
        </div>

        {/* Footer */}
        <footer className="page-footer">
          <div className="footer-inner">
            <div className="footer-brand">Crystaliline</div>
            <div className="footer-links">
              <Link href="/">Home</Link>
              <Link href="/about">About</Link>
              <Link href="/community">Community</Link>
              <a href="https://github.com/skids-zj71" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
            <div className="footer-copy">© 2025 Crystaliline. Built for the OG Fortnite community.</div>
          </div>
        </footer>
      </div>
    </div>
  );
}
