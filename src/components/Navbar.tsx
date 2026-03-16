"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/community", label: "Community" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10"
      style={{
        background: "rgba(10, 10, 10, 0.8)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl font-bold shimmer">Crystaliline</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-orange-light"
                    : "text-white/60 hover:text-white/90"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="navbar-active"
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background: "rgba(255, 140, 0, 0.1)",
                      border: "1px solid rgba(255, 140, 0, 0.2)",
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}

          <a
            href="https://github.com/skids-zj71"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-3 px-4 py-2 rounded-lg text-sm font-medium gradient-bg text-black hover:opacity-90 transition-opacity"
          >
            GitHub
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-[5px] p-2 bg-transparent border-none cursor-pointer"
          aria-label="Toggle menu"
        >
          <span
            className="block w-6 h-[2px] rounded-sm transition-all duration-300"
            style={{
              background: "#FFB347",
              transform: mobileOpen ? "rotate(45deg) translate(3.5px, 3.5px)" : "none",
            }}
          />
          <span
            className="block w-6 h-[2px] rounded-sm transition-all duration-300"
            style={{
              background: "#FFB347",
              opacity: mobileOpen ? 0 : 1,
            }}
          />
          <span
            className="block w-6 h-[2px] rounded-sm transition-all duration-300"
            style={{
              background: "#FFB347",
              transform: mobileOpen ? "rotate(-45deg) translate(3.5px, -3.5px)" : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden border-b border-white/5"
            style={{ background: "rgba(10, 10, 10, 0.95)" }}
          >
            <div className="flex flex-col gap-2 px-6 py-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    pathname === link.href
                      ? "text-orange-light bg-white/5"
                      : "text-white/60 hover:text-white/90"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="https://github.com/skids-zj71"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 px-4 py-3 rounded-lg text-sm font-medium gradient-bg text-black text-center hover:opacity-90 transition-opacity"
              >
                GitHub
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
