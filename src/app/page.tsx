"use client";

import { useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const FORTNITE_IMAGES = [
  "https://fortnite-api.com/images/cosmetics/br/lsid_094_holidayspecial/icon.png",
  "https://fortnite-api.com/images/cosmetics/br/lsid_236_oceanrider/icon.png",
  "https://fortnite-api.com/images/cosmetics/br/lsid_281_cubeninja/icon.png",
  "https://fortnite-api.com/images/cosmetics/br/loadingscreen_casinoreaper2/icon.png",
  "https://fortnite-api.com/images/cosmetics/br/lsid_410_cadet/icon.png",
  "https://fortnite-api.com/images/cosmetics/br/loadingscreen_possession/icon.png",
  "https://fortnite-api.com/images/cosmetics/br/lsid_278_goldentouch/icon.png",
  "https://fortnite-api.com/images/cosmetics/br/lsid_246_hightowerdate/icon.png",
  "https://fortnite-api.com/images/cosmetics/br/lsid_044_flytrap/icon.png",
  "https://fortnite-api.com/images/cosmetics/br/lsid_185_s11cumulative06/icon.png",
  "https://fortnite-api.com/images/cosmetics/br/lsid_131_s9cumulative01/icon.png",
  "https://fortnite-api.com/images/cosmetics/br/lsid_140_s9cumulative10/icon.png",
  "https://fortnite-api.com/images/cosmetics/br/loadingscreen_pizzaparty2/icon.png",
  "https://fortnite-api.com/images/cosmetics/br/lsid_049_s5cumulative10/icon.png",
  "https://fortnite-api.com/images/cosmetics/br/loadingscreen_sunburst_keyart/icon.png",
  "https://fortnite-api.com/images/cosmetics/br/lsid_087_s7cumulative04/icon.png",
  "https://fortnite-api.com/images/cosmetics/br/lsid_478_rainbowroyale_art/icon.png",
  "https://fortnite-api.com/images/cosmetics/br/lsid_242_valet/icon.png",
  "https://fortnite-api.com/images/cosmetics/br/lsid_128_auroraglow/icon.png",
  "https://fortnite-api.com/images/cosmetics/br/loadingscreen_mincepounce/icon.png",
  "https://fortnite-api.com/images/cosmetics/br/lsid_387_island/icon.png",
  "https://fortnite-api.com/images/cosmetics/br/loadingscreen_nitroflowebony/icon.png",
  "https://fortnite-api.com/images/cosmetics/br/loadingscreen_figmentkeyart/icon.png",
  "https://fortnite-api.com/images/cosmetics/br/loadingscreen_mochi/icon.png",
  "https://fortnite-api.com/images/cosmetics/br/loadingscreen_crescentnail/icon.png",
  "https://fortnite-api.com/images/cosmetics/br/lsid_421_scrn_journeymentor/icon.png",
  "https://fortnite-api.com/images/cosmetics/br/loadingscreen_stridemicekeyart/icon.png",
  "https://fortnite-api.com/images/cosmetics/br/loadingscreen_partyupquest/icon.png",
  "https://fortnite-api.com/images/cosmetics/br/loadingscreen_selenacobra_gliding/icon.png",
  "https://fortnite-api.com/images/cosmetics/br/loadingscreen_mseesatirecane/icon.png",
];

const CARDS_PER_COL = 12;
const NUM_COLS = 7;

export default function Home() {
  const columns = useMemo(() => {
    const cols: string[][] = [];
    for (let c = 0; c < NUM_COLS; c++) {
      const cards: string[] = [];
      for (let r = 0; r < CARDS_PER_COL; r++) {
        cards.push(FORTNITE_IMAGES[(c * CARDS_PER_COL + r) % FORTNITE_IMAGES.length]);
      }
      cols.push(cards);
    }
    return cols;
  }, []);

  return (
    <div className="landing-root">
      {/* ── Background grid ── */}
      <div className="bg-grid-wrap">
        <div className="bg-grid">
          {columns.map((cards, ci) => (
            <div className="bg-col" key={ci}>
              {[...cards, ...cards].map((src, ri) => (
                <div className="bg-card" key={ri}>
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="bg-overlay" />
      </div>

      {/* ── Pill navbar ── */}
      <Navbar />

      {/* ── Hero ── */}
      <div className="hero">
        <div className="hero-content">
          <h1>
            Crystal<span className="gradient">line</span>
          </h1>
          <p className="subtitle">
            The modern modding tool for OG Fortnite servers.
          </p>
          <a
            href="https://discord.gg/crystaliline"
            target="_blank"
            rel="noopener noreferrer"
            className="cta"
          >
            DOWNLOAD
          </a>
        </div>
      </div>
    </div>
  );
}
