"use client";

import { useState } from "react";

const FAQ = [
  {
    q: "What is Crystaliline?",
    a: "Crystaliline is an all-in-one OG Fortnite modding tool and community hub. It provides access to skin mods, map tools, server utilities, asset browsing, and a thriving community of Fortnite modders — all in one dashboard.",
  },
  {
    q: "How do I install mods?",
    a: "Head to the Downloads section to grab the latest Crystal Loader. Run the loader, select your Fortnite build folder, and choose the mods you want to apply. The loader handles injection and patching automatically.",
  },
  {
    q: "How do I set up an OG Fortnite server?",
    a: "Visit the Server Tools tab for links to popular private server backends like Rift Server, Lawin Server, and Neonite. Each tool has its own setup guide. You'll also need Fiddler to redirect your game client to the local server.",
  },
  {
    q: "How do I use the asset browser?",
    a: "Click on Assets in the sidebar to open the asset browser. Use the category panel on the left to filter by type (Characters, Weapons, etc.), and the search bar to find specific items. Click any asset to see details.",
  },
  {
    q: "How do I report bugs?",
    a: "Report bugs in our Discord server's #bug-reports channel, or open an issue on our GitHub repository. Please include steps to reproduce, your OS, and any error messages.",
  },
  {
    q: "Where can I get help?",
    a: "Join our Discord community using the Chat tab for real-time help. You can also check the Server Tools section for documentation links, or ask in the #help channel on Discord.",
  },
];

export default function HelpView() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <main className="dashboard-main">
      <div className="view-header">
        <h2 className="view-title">Help & FAQ</h2>
        <p className="view-subtitle">Frequently asked questions about Crystaliline</p>
      </div>

      <div className="view-faq-list">
        {FAQ.map((item, i) => (
          <div key={i} className={`view-faq-item${openIndex === i ? " open" : ""}`}>
            <button className="view-faq-question" onClick={() => toggle(i)}>
              <span>{item.q}</span>
              <span className="view-faq-arrow">{openIndex === i ? "−" : "+"}</span>
            </button>
            {openIndex === i && (
              <div className="view-faq-answer">
                <p>{item.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
