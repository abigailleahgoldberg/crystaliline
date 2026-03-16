"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  User, Backpack, Hammer, Umbrella, PawPrint, Dice1,
  Smile, Paintbrush, Flag, Image, PersonStanding, Bot,
  Guitar, Piano, Car
} from "lucide-react";

/* ── Category definitions ── */

const ICON_MAP: Record<string, React.ComponentType<{size?: number; color?: string}>> = {
  user: User,
  backpack: Backpack,
  hammer: Hammer,
  umbrella: Umbrella,
  pawprint: PawPrint,
  dice: Dice1,
  smile: Smile,
  paintbrush: Paintbrush,
  flag: Flag,
  image: Image,
  personstanding: PersonStanding,
  bot: Bot,
  guitar: Guitar,
  piano: Piano,
  car: Car,
};

const COSMETIC_CATEGORIES = [
  { iconKey: "user", name: "Outfits", filter: "outfit" },
  { iconKey: "backpack", name: "Backpacks", filter: "backpack" },
  { iconKey: "hammer", name: "Pickaxes", filter: "pickaxe" },
  { iconKey: "umbrella", name: "Gliders", filter: "glider" },
  { iconKey: "pawprint", name: "Pets", filter: "pet" },
  { iconKey: "dice", name: "Toys", filter: "toy" },
  { iconKey: "smile", name: "Emoticons", filter: "emoji" },
  { iconKey: "paintbrush", name: "Sprays", filter: "spray" },
  { iconKey: "flag", name: "Banners", filter: "banner" },
  { iconKey: "image", name: "Loading Screens", filter: "loadingscreen" },
  { iconKey: "personstanding", name: "Emotes", filter: "emote" },
  { iconKey: "bot", name: "Sidekicks", filter: "sidekick" },
];

const FESTIVAL_CATEGORIES = [
  { iconKey: "guitar", name: "Guitars", filter: "__instrument_guitar" },
  { iconKey: "guitar", name: "Basses", filter: "__instrument_bass" },
  { iconKey: "piano", name: "Keytars", filter: "__instrument_keytar" },
];

const VEHICLES_CATEGORIES = [
  { iconKey: "car", name: "Vehicles", filter: "__cars" },
];

const SECTIONS = [
  { label: "COSMETICS", categories: COSMETIC_CATEGORIES },
  { label: "FESTIVAL", categories: FESTIVAL_CATEGORIES },
  { label: "VEHICLES", categories: VEHICLES_CATEGORIES },
];

interface CosmeticItem {
  id: string;
  name: string;
  description: string | null;
  type: { value: string; displayValue: string };
  rarity: { value: string; displayValue: string } | null;
  images: {
    icon: string | null;
    smallIcon: string | null;
    featured: string | null;
  };
  introduction?: {
    chapter: string;
    season: string;
    text: string;
  } | null;
  set?: { value: string } | null;
}

const PAGE_SIZE = 100;

export default function AssetBrowser() {
  const [allItems, setAllItems] = useState<CosmeticItem[]>([]);
  const [instrumentItems, setInstrumentItems] = useState<CosmeticItem[]>([]);
  const [carItems, setCarItems] = useState<CosmeticItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("outfit");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedItem, setSelectedItem] = useState<CosmeticItem | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  /* ── Fetch data ── */
  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        const [brRes, instrRes, carsRes] = await Promise.all([
          fetch("https://fortnite-api.com/v2/cosmetics/br?language=en"),
          fetch("https://fortnite-api.com/v2/cosmetics/instruments?language=en"),
          fetch("https://fortnite-api.com/v2/cosmetics/cars?language=en"),
        ]);
        if (!brRes.ok) throw new Error("Failed to fetch cosmetics");
        const brData = await brRes.json();
        if (!cancelled) setAllItems(brData.data || []);

        if (instrRes.ok) {
          const instrData = await instrRes.json();
          if (!cancelled) setInstrumentItems(instrData.data || []);
        }
        if (carsRes.ok) {
          const carsData = await carsRes.json();
          if (!cancelled) setCarItems(carsData.data || []);
        }
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Fetch failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, []);

  /* ── Filter items for active category ── */
  const getFilteredItems = useCallback(() => {
    let items: CosmeticItem[] = [];

    if (activeCategory === "__cars") {
      items = carItems;
    } else if (activeCategory.startsWith("__instrument_")) {
      const sub = activeCategory.replace("__instrument_", "");
      items = instrumentItems.filter((i) => {
        const name = i.name.toLowerCase();
        if (sub === "guitar") return name.includes("guitar") || (!name.includes("bass") && !name.includes("keytar"));
        if (sub === "bass") return name.includes("bass");
        if (sub === "keytar") return name.includes("keytar") || name.includes("keys");
        return true;
      });
      if (items.length === 0) items = instrumentItems;
    } else if (activeCategory === "pet") {
      items = allItems.filter(
        (i) => i.type.value === "petcarrier" || i.type.value === "pet"
      );
    } else {
      items = allItems.filter((i) => i.type.value === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter((i) => i.name.toLowerCase().includes(q));
    }

    return items;
  }, [allItems, instrumentItems, carItems, activeCategory, searchQuery]);

  const filteredItems = getFilteredItems();
  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  /* Reset visible count on category/search change */
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    if (gridRef.current) gridRef.current.scrollTop = 0;
  }, [activeCategory, searchQuery]);

  /* Infinite scroll */
  const handleScroll = useCallback(() => {
    const el = gridRef.current;
    if (!el || !hasMore) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 200) {
      setVisibleCount((c) => c + PAGE_SIZE);
    }
  }, [hasMore]);


  /* ── Category label ── */
  const activeCategoryName =
    SECTIONS.flatMap((s) => s.categories).find((c) => c.filter === activeCategory)?.name || "Items";

  return (
    <div className="asset-browser">
      {/* Category sidebar */}
      <div className="asset-categories">
        {SECTIONS.map((section) => (
          <div key={section.label} className="asset-category-section">
            <span className="asset-category-header">{section.label}</span>
            {section.categories.map((cat) => {
              const CatIcon = ICON_MAP[cat.iconKey];
              return (
                <button
                  key={cat.filter}
                  className={`asset-category-item${activeCategory === cat.filter ? " active" : ""}`}
                  onClick={() => setActiveCategory(cat.filter)}
                >
                  <span className="asset-category-icon">
                    {CatIcon && <CatIcon size={18} />}
                  </span>
                  {cat.name}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="asset-content">
        {/* Toolbar */}
        <div className="asset-toolbar">
          <div className="asset-toolbar-left">
            <span className="asset-toolbar-title">{activeCategoryName}</span>
            {!loading && (
              <span className="asset-toolbar-count">
                {filteredItems.length.toLocaleString()} items
              </span>
            )}
          </div>
          <div className="asset-toolbar-right">
            <input
              type="text"
              className="asset-search"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Grid area */}
        <div className="asset-grid-container" ref={gridRef} onScroll={handleScroll}>
          {loading ? (
            <div className="asset-loading">
              <div className="dashboard-spinner" />
              <p>Loading cosmetics...</p>
            </div>
          ) : error ? (
            <div className="asset-loading">
              <p style={{ color: "#ef4444" }}>{error}</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="asset-loading">
              <p>No items found</p>
            </div>
          ) : (
            <div className="asset-grid">
              {visibleItems.map((item) => (
                <div
                  key={item.id}
                  className="asset-card"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="asset-card-img-wrap">
                    {item.images.smallIcon || item.images.icon ? (
                      <img
                        src={(item.images.smallIcon || item.images.icon)!}
                        alt={String(item?.name || "Unknown")}
                        loading="lazy"
                      />
                    ) : (
                      <div className="asset-card-no-img">?</div>
                    )}
                  </div>
                  <span className="asset-card-name">{String(item?.name || "Unknown")}</span>
                </div>
              ))}
            </div>
          )}
          {hasMore && !loading && (
            <div className="asset-load-more">
              Showing {visibleCount.toLocaleString()} of{" "}
              {filteredItems.length.toLocaleString()} — scroll for more
            </div>
          )}
        </div>
      </div>

      {/* Item detail overlay */}
      {selectedItem && (
        <div className="asset-overlay" onClick={() => setSelectedItem(null)}>
          <div className="asset-detail" onClick={(e) => e.stopPropagation()}>
            <button className="asset-detail-close" onClick={() => setSelectedItem(null)}>
              ✕
            </button>
            <div className="asset-detail-img">
              {selectedItem.images.icon || selectedItem.images.featured ? (
                <img
                  src={(selectedItem.images.featured || selectedItem.images.icon)!}
                  alt={selectedItem.name}
                />
              ) : (
                <div className="asset-card-no-img" style={{ fontSize: "3rem" }}>?</div>
              )}
            </div>
            <h2 className="asset-detail-name">{selectedItem.name}</h2>
            {selectedItem.description && (
              <p className="asset-detail-desc">{String(selectedItem?.description || "")}</p>
            )}
            <div className="asset-detail-meta">
              <span className="asset-detail-tag">
                {String(selectedItem?.type?.displayValue || "")}
              </span>
              {selectedItem.rarity && (
                <span className="asset-detail-tag">
                  {String(selectedItem?.rarity?.displayValue || "")}
                </span>
              )}
              {selectedItem.set && (
                <span className="asset-detail-tag">
                  {String(selectedItem?.set?.value || "")}
                </span>
              )}
              {selectedItem.introduction && (
                <span className="asset-detail-tag">
                  {String(selectedItem?.introduction?.text || "")}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
