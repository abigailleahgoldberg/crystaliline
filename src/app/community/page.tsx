"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import SectionHeading from "@/components/SectionHeading";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundGrid from "@/components/BackgroundGrid";

const highlights = [
  {
    label: "Community Members",
    value: "Growing",
    icon: "👥",
  },
  {
    label: "Mods Created",
    value: "Expanding",
    icon: "⚙️",
  },
  {
    label: "Tools Integrated",
    value: "10+",
    icon: "🔗",
  },
  {
    label: "Open Source",
    value: "100%",
    icon: "📂",
  },
];

export default function Community() {
  return (
    <div className="page-root">
      <BackgroundGrid darker />
      <Navbar />
      <main className="relative z-10 pt-32">
        {/* Hero */}
        <section className="px-6 pt-12 pb-24 text-center max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold shimmer mb-6"
          >
            Join the Community
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Connect with fellow modders, share your work, and help shape the future of Crystaliline.
          </motion.p>
        </section>

        {/* Discord Embed */}
        <section className="px-6 pb-24 max-w-4xl mx-auto">
          <SectionHeading
            title="Join the Conversation"
            subtitle="Our Discord server is the heart of the Crystaliline community."
          />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass p-4 rounded-2xl max-w-lg mx-auto"
          >
            <iframe
              src="https://discord.com/widget?id=1384979421231976658&theme=dark"
              width="100%"
              height="500"
              sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
              className="rounded-xl"
              title="Discord Widget"
            />
          </motion.div>
        </section>

        {/* Get Involved */}
        <section className="px-6 pb-24 max-w-4xl mx-auto">
          <SectionHeading
            title="Get Involved"
            subtitle="There are many ways to be part of the Crystaliline community."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "💬",
                title: "Chat & Collaborate",
                desc: "Join our Discord to discuss ideas, share mods, and team up on projects with other modders.",
              },
              {
                icon: "🛠️",
                title: "Contribute Code",
                desc: "Crystaliline is open source. Submit pull requests, fix bugs, and help build new features on GitHub.",
              },
              {
                icon: "📣",
                title: "Spread the Word",
                desc: "Help grow the community by sharing Crystaliline with other OG Fortnite enthusiasts and server owners.",
              },
            ].map((item, i) => (
              <GlassCard key={item.title} delay={i * 0.15}>
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-white/50 leading-relaxed">{item.desc}</p>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Community Stats */}
        <section className="px-6 pb-24 max-w-4xl mx-auto">
          <SectionHeading title="Community at a Glance" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {highlights.map((item, i) => (
              <GlassCard key={item.label} delay={i * 0.1} className="text-center">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-xl font-bold gradient-text">{item.value}</div>
                <div className="text-xs text-white/40 mt-1">{item.label}</div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Quick Links */}
        <section className="px-6 pb-32 max-w-4xl mx-auto">
          <SectionHeading
            title="Quick Links"
            subtitle="Jump straight to the platforms where the community lives."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard delay={0}>
              <h3 className="text-lg font-bold text-white mb-2">GitHub Repository</h3>
              <p className="text-white/50 leading-relaxed mb-4">
                Browse the source code, report issues, and contribute to Crystaliline.
              </p>
              <a
                href="https://github.com/skids-zj71"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-5 py-2 rounded-lg text-sm font-semibold gradient-bg text-black hover:opacity-90 transition-opacity"
              >
                View on GitHub →
              </a>
            </GlassCard>
            <GlassCard delay={0.15}>
              <h3 className="text-lg font-bold text-white mb-2">Discord Server</h3>
              <p className="text-white/50 leading-relaxed mb-4">
                Chat with other modders, get help, and share your creations in real-time.
              </p>
              <a
                href="https://discord.gg/crystaliline"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-5 py-2 rounded-lg text-sm font-semibold gradient-bg text-black hover:opacity-90 transition-opacity"
              >
                Join Discord →
              </a>
            </GlassCard>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
