"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";

const features = [
  {
    icon: "🔧",
    title: "Custom Modifications",
    desc: "Add or change virtually anything in your OG Fortnite server project — from cosmetics and skins to gameplay mechanics, weapons, and map elements. Full creative control at your fingertips.",
  },
  {
    icon: "🔗",
    title: "Tool Integration",
    desc: "Seamlessly connects with popular OG Fortnite server tools and frameworks. One central hub that links your entire modding workflow together without the hassle of juggling separate utilities.",
  },
  {
    icon: "👥",
    title: "Community Driven",
    desc: "Built by modders, for modders. Join a growing community of OG Fortnite enthusiasts who share mods, collaborate on projects, and push the boundaries of what's possible.",
  },
  {
    icon: "📂",
    title: "Open Source",
    desc: "Crystaliline is fully open source. Inspect the code, contribute features, submit bug fixes, or fork it to build your own custom version. Transparency and collaboration at the core.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.6,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="px-6 pt-24 pb-32 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="glow-pulse inline-block"
        >
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold shimmer tracking-tight leading-none">
            Crystaliline
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-xl md:text-2xl text-white/70 mt-8 font-medium"
        >
          The Modern Modding Tool for OG Fortnite
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="text-base md:text-lg text-white/40 mt-4 max-w-xl mx-auto"
        >
          More customizability. More control. More power.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="https://github.com/skids-zj71"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 rounded-xl text-base font-bold gradient-bg text-black hover:opacity-90 transition-all hover:scale-105 hover:shadow-[0_8px_30px_rgba(255,140,0,0.3)]"
          >
            View on GitHub →
          </a>
          <a
            href="/community"
            className="px-8 py-3.5 rounded-xl text-base font-medium glass glass-hover text-white/70 hover:text-white transition-all"
          >
            Join the Community
          </a>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="px-6 pb-32 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
            Everything You Need
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto text-lg">
            Crystaliline gives you the tools to take full control of your OG Fortnite server project.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={item}>
              <GlassCard>
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/50 leading-relaxed">{feature.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 pb-32 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass p-10 md:p-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to mod?
          </h2>
          <p className="text-white/50 text-lg mb-8 max-w-md mx-auto">
            Dive into the source, explore the tools, and start building your perfect OG Fortnite experience.
          </p>
          <a
            href="https://github.com/skids-zj71"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3.5 rounded-xl text-base font-bold gradient-bg text-black hover:opacity-90 transition-all hover:scale-105 hover:shadow-[0_8px_30px_rgba(255,140,0,0.3)]"
          >
            Get Started on GitHub →
          </a>
        </motion.div>
      </section>
    </div>
  );
}
