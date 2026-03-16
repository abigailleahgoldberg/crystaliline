"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import SectionHeading from "@/components/SectionHeading";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundGrid from "@/components/BackgroundGrid";

export default function About() {
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
            About Crystaliline
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto"
          >
            The story behind the modding tool that&apos;s changing how the OG Fortnite community builds and customizes their servers.
          </motion.p>
        </section>

        {/* What is Crystaliline */}
        <section className="px-6 pb-24 max-w-4xl mx-auto">
          <SectionHeading title="What is Crystaliline?" />
          <GlassCard className="space-y-4">
            <p className="text-white/70 leading-relaxed text-lg">
              Crystaliline is a modern modding tool designed specifically for OG Fortnite server projects. It gives developers and modders the power to add, change, and customize virtually anything in their projects — from cosmetics and gameplay mechanics to server configurations and beyond.
            </p>
            <p className="text-white/70 leading-relaxed text-lg">
              Unlike scattered scripts and one-off tools, Crystaliline brings everything together into a cohesive platform. It&apos;s the central hub for your modding workflow, connecting you with the tools, resources, and community you need to bring your vision to life.
            </p>
            <p className="text-white/70 leading-relaxed text-lg">
              Whether you&apos;re running a private server for friends or building a full-scale community experience, Crystaliline gives you the flexibility and control to make it yours.
            </p>
          </GlassCard>
        </section>

        {/* How It Works */}
        <section className="px-6 pb-24 max-w-4xl mx-auto">
          <SectionHeading
            title="How It Works"
            subtitle="Crystaliline is designed to be simple to pick up but powerful enough for advanced modders."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Explore",
                desc: "Browse available modifications, tools, and community resources. Find exactly what you need or discover something new.",
                icon: "🔍",
              },
              {
                step: "02",
                title: "Customize",
                desc: "Use Crystaliline's tools to apply modifications to your project. Mix and match features to create your perfect setup.",
                icon: "✏️",
              },
              {
                step: "03",
                title: "Deploy",
                desc: "Push your customized project to your server with confidence. Test locally first, then go live when you're ready.",
                icon: "🚀",
              },
            ].map((item, i) => (
              <GlassCard key={item.title} delay={i * 0.15}>
                <span className="text-xs font-mono gradient-text font-bold">STEP {item.step}</span>
                <div className="text-3xl my-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-white/50 leading-relaxed">{item.desc}</p>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Vision & Roadmap */}
        <section className="px-6 pb-24 max-w-4xl mx-auto">
          <SectionHeading
            title="The Vision"
            subtitle="Where Crystaliline is headed and what we're building toward."
          />
          <div className="space-y-6">
            {[
              {
                phase: "Phase 1",
                title: "Foundation",
                status: "In Progress",
                items: [
                  "Core modding tool functionality",
                  "Website and community hub launch",
                  "GitHub repository and documentation",
                  "Discord community setup",
                ],
              },
              {
                phase: "Phase 2",
                title: "Expansion",
                status: "Planned",
                items: [
                  "Plugin system for community-created mods",
                  "Visual mod editor for non-technical users",
                  "Expanded tool integrations",
                  "Mod template library",
                ],
              },
              {
                phase: "Phase 3",
                title: "Ecosystem",
                status: "Future",
                items: [
                  "Mod marketplace for sharing creations",
                  "Server management dashboard",
                  "Automated testing for mods",
                  "API for third-party integrations",
                ],
              },
            ].map((phase, i) => (
              <GlassCard key={phase.phase} delay={i * 0.15}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-sm font-mono gradient-text font-bold">{phase.phase}</span>
                    <h3 className="text-xl font-bold text-white">{phase.title}</h3>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      phase.status === "In Progress"
                        ? "bg-orange/20 text-orange-light"
                        : "bg-white/5 text-white/40"
                    }`}
                  >
                    {phase.status}
                  </span>
                </div>
                <ul className="space-y-2">
                  {phase.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-white/50">
                      <span className="text-orange-light mt-1 text-xs">◆</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Creator */}
        <section className="px-6 pb-32 max-w-4xl mx-auto">
          <SectionHeading
            title="The Creator"
            subtitle="The person behind Crystaliline."
          />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass p-8 md:p-12 rounded-2xl text-center max-w-lg mx-auto"
          >
            <div
              className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl font-bold gradient-bg text-black"
            >
              ZJ
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">ZJ</h3>
            <p className="text-white/40 text-sm mb-3 font-mono">thee zj71</p>
            <p className="gradient-text font-semibold mb-4">Creator & Lead Developer</p>
            <p className="text-white/50 leading-relaxed">
              A passionate developer and OG Fortnite enthusiast who saw the need for better modding tools. ZJ built Crystaliline to give the community the power to customize their servers without limits — bringing together scattered tools into one cohesive platform.
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <a
                href="https://github.com/skids-zj71"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 rounded-lg text-sm font-medium glass glass-hover text-white/60 hover:text-white transition-colors"
              >
                GitHub
              </a>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
