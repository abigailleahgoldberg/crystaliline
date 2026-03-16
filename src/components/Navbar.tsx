"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/community", label: "Community" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="pill-header">
      <nav className="pill-nav">
        <div className="nav-logo">
          <Link href="/" className="nav-logo-link">
            Crystal<span className="accent">line</span>
          </Link>
        </div>

        {/* Desktop links */}
        <ul className="nav-links hidden md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                style={pathname === link.href ? { color: "#FFB347" } : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href="https://github.com/skids-zj71"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-[5px] p-2 bg-transparent border-none cursor-pointer"
          aria-label="Toggle menu"
        >
          <span
            className="block w-5 h-[2px] rounded-sm transition-all duration-300"
            style={{
              background: "#FFB347",
              transform: mobileOpen ? "rotate(45deg) translate(3.5px, 3.5px)" : "none",
            }}
          />
          <span
            className="block w-5 h-[2px] rounded-sm transition-all duration-300"
            style={{
              background: "#FFB347",
              opacity: mobileOpen ? 0 : 1,
            }}
          />
          <span
            className="block w-5 h-[2px] rounded-sm transition-all duration-300"
            style={{
              background: "#FFB347",
              transform: mobileOpen ? "rotate(-45deg) translate(3.5px, -3.5px)" : "none",
            }}
          />
        </button>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="mobile-nav-dropdown md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="mobile-nav-link"
              style={pathname === link.href ? { color: "#FFB347" } : undefined}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://github.com/skids-zj71"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileOpen(false)}
            className="mobile-nav-link"
          >
            GitHub
          </a>
        </div>
      )}
    </header>
  );
}
