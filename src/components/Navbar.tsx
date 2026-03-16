"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import AuthButton from "./AuthButton";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkStyle = (href: string) =>
    pathname === href ? { color: "#FFB347" } : undefined;

  return (
    <header className="pill-header">
      <nav className="pill-nav">
        <div className="nav-logo">
          <Link href="/" className="nav-logo-link">
            Crystal<span className="accent">line</span>
          </Link>
        </div>
        <ul className="nav-links">
          <li>
            <a
              href="https://discord.gg/crystaliline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Discord
            </a>
          </li>
          <li>
            <a
              href="https://github.com/skids-zj71"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </li>
          <li className="hide-mobile">
            <Link href="/about" style={linkStyle("/about")}>
              About
            </Link>
          </li>
          <li className="hide-mobile">
            <Link href="/community" style={linkStyle("/community")}>
              Community
            </Link>
          </li>
          <li>
            <AuthButton />
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className="mobile-hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span
            className="hamburger-line"
            style={{
              transform: mobileOpen ? "rotate(45deg) translate(3.5px, 3.5px)" : "none",
            }}
          />
          <span
            className="hamburger-line"
            style={{ opacity: mobileOpen ? 0 : 1 }}
          />
          <span
            className="hamburger-line"
            style={{
              transform: mobileOpen ? "rotate(-45deg) translate(3.5px, -3.5px)" : "none",
            }}
          />
        </button>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="mobile-nav-dropdown">
          <Link href="/" onClick={() => setMobileOpen(false)} className="mobile-nav-link" style={linkStyle("/")}>Home</Link>
          <Link href="/about" onClick={() => setMobileOpen(false)} className="mobile-nav-link" style={linkStyle("/about")}>About</Link>
          <Link href="/community" onClick={() => setMobileOpen(false)} className="mobile-nav-link" style={linkStyle("/community")}>Community</Link>
          <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="mobile-nav-link" style={linkStyle("/dashboard")}>Dashboard</Link>
          <a href="https://discord.gg/crystaliline" target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)} className="mobile-nav-link">Discord</a>
          <a href="https://github.com/skids-zj71" target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)} className="mobile-nav-link">GitHub</a>
        </div>
      )}
    </header>
  );
}
