"use client";

import Navbar from "@/components/Navbar";
import BackgroundGrid from "@/components/BackgroundGrid";
import Link from "next/link";

export default function Community() {
  return (
    <div className="page-root">
      <BackgroundGrid darker />
      <Navbar />

      {/* Section 1: Hero */}
      <section className="snap-section snap-hero">
        <div className="section-inner">
          <h1>Join the <span className="gradient">Community</span></h1>
          <p className="hero-sub">
            Connect with fellow modders, share your work, and help shape the future of Crystaliline.
          </p>
        </div>
        <div className="scroll-indicator">Scroll</div>
      </section>

      {/* Section 2: Live Chat */}
      <section className="snap-section">
        <div className="section-inner">
          <h2 className="gradient-text">Live Chat</h2>
          <p className="section-sub">Chat directly with the community — right from this page.</p>
          <div className="discord-chat-embed">
            <iframe
              src="https://e.widgetbot.io/channels/1384979421231976658"
              title="Discord Chat"
              allow="clipboard-write; fullscreen"
            />
          </div>
        </div>
      </section>

      {/* Section 3: Who's Online */}
      <section className="snap-section">
        <div className="section-inner">
          <h2 className="gradient-text">Who&apos;s Online</h2>
          <p className="section-sub">See who&apos;s active in the Discord right now.</p>
          <div className="discord-embed">
            <iframe
              src="https://discord.com/widget?id=1384979421231976658&theme=dark"
              sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
              title="Discord Widget"
            />
          </div>
        </div>
      </section>

      {/* Section 4: Get Involved */}
      <section className="snap-section">
        <div className="section-inner">
          <h2 className="gradient-text">Get Involved</h2>
          <p className="section-sub">There are many ways to be part of the Crystaliline community.</p>
          <div className="card-grid-3">
            {[
              { icon: "💬", title: "Chat & Collaborate", desc: "Join our Discord to discuss ideas, share mods, and team up on projects with other modders." },
              { icon: "🛠️", title: "Contribute Code", desc: "Crystaliline is open source. Submit pull requests, fix bugs, and help build new features on GitHub." },
              { icon: "📣", title: "Spread the Word", desc: "Help grow the community by sharing Crystaliline with other OG Fortnite enthusiasts and server owners." },
            ].map((item) => (
              <div className="content-card" key={item.title}>
                <div className="card-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Quick Links */}
      <section className="snap-section">
        <div className="section-inner">
          <h2 className="gradient-text">Quick Links</h2>
          <p className="section-sub">Jump straight to the platforms where the community lives.</p>
          <div className="card-grid-2">
            <div className="content-card">
              <h3>GitHub Repository</h3>
              <p>Browse the source code, report issues, and contribute to Crystaliline.</p>
              <a href="https://github.com/skids-zj71" target="_blank" rel="noopener noreferrer" className="cta-link" style={{ marginTop: "1rem", display: "inline-block" }}>
                View on GitHub →
              </a>
            </div>
            <div className="content-card">
              <h3>Discord Server</h3>
              <p>Chat with other modders, get help, and share your creations in real-time.</p>
              <a href="https://discord.gg/crystaliline" target="_blank" rel="noopener noreferrer" className="cta-link" style={{ marginTop: "1rem", display: "inline-block" }}>
                Join Discord →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="snap-footer page-footer">
        <div className="footer-inner">
          <div className="footer-brand">Crystaliline</div>
          <div className="footer-links">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/community">Community</Link>
            <a href="https://github.com/skids-zj71" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
          <div className="footer-copy">© {new Date().getFullYear()} Crystaliline. Built for the OG Fortnite community.</div>
        </div>
      </footer>
    </div>
  );
}
