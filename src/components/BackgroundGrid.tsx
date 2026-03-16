"use client";

import { useMemo } from "react";

const FORTNITE_IMAGES = [
  "https://fortnite-api.com/images/cosmetics/br/lsid_094_holidayspecial/background.png",
  "https://fortnite-api.com/images/cosmetics/br/lsid_236_oceanrider/background.png",
  "https://fortnite-api.com/images/cosmetics/br/lsid_281_cubeninja/background.png",
  "https://fortnite-api.com/images/cosmetics/br/loadingscreen_casinoreaper2/background.png",
  "https://fortnite-api.com/images/cosmetics/br/lsid_410_cadet/background.png",
  "https://fortnite-api.com/images/cosmetics/br/loadingscreen_possession/background.png",
  "https://fortnite-api.com/images/cosmetics/br/lsid_278_goldentouch/background.png",
  "https://fortnite-api.com/images/cosmetics/br/lsid_246_hightowerdate/background.png",
  "https://fortnite-api.com/images/cosmetics/br/lsid_044_flytrap/background.png",
  "https://fortnite-api.com/images/cosmetics/br/lsid_185_s11cumulative06/background.png",
  "https://fortnite-api.com/images/cosmetics/br/lsid_131_s9cumulative01/background.png",
  "https://fortnite-api.com/images/cosmetics/br/lsid_140_s9cumulative10/background.png",
  "https://fortnite-api.com/images/cosmetics/br/loadingscreen_pizzaparty2/background.png",
  "https://fortnite-api.com/images/cosmetics/br/lsid_049_s5cumulative10/background.png",
  "https://fortnite-api.com/images/cosmetics/br/loadingscreen_sunburst_keyart/background.png",
  "https://fortnite-api.com/images/cosmetics/br/lsid_087_s7cumulative04/background.png",
  "https://fortnite-api.com/images/cosmetics/br/lsid_478_rainbowroyale_art/background.png",
  "https://fortnite-api.com/images/cosmetics/br/lsid_242_valet/background.png",
  "https://fortnite-api.com/images/cosmetics/br/lsid_128_auroraglow/background.png",
  "https://fortnite-api.com/images/cosmetics/br/loadingscreen_mincepounce/background.png",
  "https://fortnite-api.com/images/cosmetics/br/lsid_387_island/background.png",
  "https://fortnite-api.com/images/cosmetics/br/loadingscreen_nitroflowebony/background.png",
  "https://fortnite-api.com/images/cosmetics/br/loadingscreen_figmentkeyart/background.png",
  "https://fortnite-api.com/images/cosmetics/br/loadingscreen_mochi/background.png",
  "https://fortnite-api.com/images/cosmetics/br/loadingscreen_crescentnail/background.png",
  "https://fortnite-api.com/images/cosmetics/br/lsid_421_scrn_journeymentor/background.png",
  "https://fortnite-api.com/images/cosmetics/br/loadingscreen_stridemicekeyart/background.png",
  "https://fortnite-api.com/images/cosmetics/br/loadingscreen_partyupquest/background.png",
  "https://fortnite-api.com/images/cosmetics/br/loadingscreen_selenacobra_gliding/background.png",
  "https://fortnite-api.com/images/cosmetics/br/loadingscreen_mseesatirecane/background.png",
];

const CARDS_PER_COL = 12;
const NUM_COLS = 7;

interface BackgroundGridProps {
  darker?: boolean;
}

export default function BackgroundGrid({ darker = false }: BackgroundGridProps) {
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
      <div className={darker ? "bg-overlay bg-overlay-dark" : "bg-overlay"} />
    </div>
  );
}
