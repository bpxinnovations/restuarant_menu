"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Restaurant } from "../../data/restaurants";

const STICKY_OFFSET = 120; // space below nav + category bar

interface RestaurantMenuClientProps {
  restaurant: Restaurant;
}

export default function RestaurantMenuClient({ restaurant }: RestaurantMenuClientProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Tab order and normalized category names
  const TAB_ORDER = ["Starters", "Drinks", "Main dish"] as const;
  type TabCategory = (typeof TAB_ORDER)[number];

  const normalizeCategory = (raw: string): TabCategory => {
    const lower = raw.toLowerCase();
    if (lower.includes("side") || lower.includes("appetizer") || lower.includes("breakfast")) return "Starters";
    if (lower.includes("drink")) return "Drinks";
    return "Main dish";
  };

  // Group menu items by normalized category (Starters, Drinks, Main dish)
  const menuByCategory = restaurant.menu.reduce(
    (acc, item) => {
      const tab = normalizeCategory(item.category);
      if (!acc[tab]) acc[tab] = [];
      acc[tab].push(item);
      return acc;
    },
    {} as Record<TabCategory, typeof restaurant.menu>
  );

  // Always show all three tabs: Starters, Drinks, Main dish
  const categories: TabCategory[] = [...TAB_ORDER];

  // Scroll to category (scrolls the menu container, not the window)
  const scrollToCategory = useCallback(
    (category: string) => {
      setActiveCategory(category);
      const element = categoryRefs.current[category];
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    []
  );

  // Set first category as active on mount
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories.length, activeCategory]);

  // Listen to scroll on the menu container to update active category
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || categories.length === 0) return;

    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();
      const threshold = containerRect.top + STICKY_OFFSET;
      let current: string | null = null;

      for (const category of categories) {
        const el = categoryRefs.current[category];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= threshold + 40) {
          current = category;
        }
      }
      if (current) setActiveCategory(current);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // set initial active
    return () => container.removeEventListener("scroll", handleScroll);
  }, [categories]);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Menu Items */}
      <section className="relative overflow-hidden">
        <div className="relative min-h-screen w-full overflow-hidden">
          <Image
            src={restaurant.imageUrl}
            alt={restaurant.name}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-black/70" />
          
          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col">
            {/* Top Section - Restaurant Info */}
            <div className="container mx-auto px-4 pt-24 pb-8 sm:px-6 lg:px-8 lg:pt-32">
              {/* Back Button */}
              <Link
                href="/"
                className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span className="font-medium">Back to Restaurants</span>
              </Link>

              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
                  {restaurant.cuisine}
                </span>
                <div className="flex items-center gap-1 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-sm font-bold text-white">{restaurant.rating}</span>
                </div>
              </div>

              <h1 className="mb-3 text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl drop-shadow-lg">
                {restaurant.name}
              </h1>

              <div className="mb-3 flex items-center gap-2 text-white">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-lg font-medium">{restaurant.location}</span>
              </div>

              <p className="max-w-3xl text-lg text-gray-100 drop-shadow-md">
                {restaurant.description}
              </p>
            </div>

            {/* Menu Items Section Overlay on Hero - scrollable container */}
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain scroll-smooth"
            >
              <div className="container mx-auto px-4 pb-16 sm:px-6 lg:px-8">
                {/* Category Navigation - Sticky */}
                <div className="sticky top-16 z-40 mb-6 mt-2">
                  <div className="flex items-center gap-2 overflow-x-auto rounded-2xl bg-primary/50 backdrop-blur-md p-3 shadow-lg scrollbar-hide pb-px border border-white/20">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => scrollToCategory(category)}
                        className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                          activeCategory === category
                            ? "bg-white/90 text-gray-900 shadow-lg"
                            : "bg-white/20 text-white hover:bg-white/30"
                        }`}
                      >
                        {category}
                        <span className="ml-2 text-xs opacity-75">
                          ({(menuByCategory[category]?.length ?? 0)})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Menu Sections - fixed order: Starters, Drinks, Main dish */}
                <div className="space-y-8">
                  {categories.map((category) => {
                    const items = menuByCategory[category] ?? [];
                    return (
                    <div
                      key={category}
                      ref={(el) => {
                        categoryRefs.current[category] = el;
                      }}
                      className="scroll-mt-28"
                      style={{ scrollMarginTop: STICKY_OFFSET + 16 }}
                    >
                      {/* Category Header */}
                      <div className="mb-4 px-1">
                        <h2 className="text-2xl font-bold text-white drop-shadow-lg sm:text-3xl">
                          {category}
                        </h2>
                        <p className="mt-1 text-sm font-medium text-white/80">
                          {items.length} {items.length === 1 ? "item" : "items"}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <div className="space-y-3">
                        {items.length === 0 ? (
                          <p className="rounded-xl bg-white/5 py-6 text-center text-sm text-white/70">
                            No items in this category
                          </p>
                        ) : items.map((item) => (
                          <div
                            key={item.id}
                            className="group rounded-xl bg-white/10 backdrop-blur-sm p-4 transition-all hover:bg-white/20 hover:shadow-lg sm:p-5 border border-white/5"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <h3 className="mb-1.5 text-lg font-bold text-white drop-shadow-md transition-colors group-hover:text-amber-200 sm:text-xl">
                                  {item.name}
                                </h3>
                                <p className="text-sm leading-relaxed text-white/85 drop-shadow-sm sm:text-base">
                                  {item.description}
                                </p>
                              </div>
                              <div className="flex-shrink-0 text-right">
                                <span className="text-xl font-bold text-white drop-shadow-lg sm:text-2xl tabular-nums">
                                  ${item.price.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    );
                  })}
                </div>

                {/* Call to Action - Transparent */}
                <div className="mt-8 rounded-2xl bg-white/10 backdrop-blur-md p-6 text-center shadow-xl">
                  <h3 className="mb-2 text-xl font-bold text-white drop-shadow-lg sm:text-2xl">
                    Ready to Order?
                  </h3>
                  <p className="mb-4 text-white/90 drop-shadow-md">
                    Visit us at {restaurant.location} or call us to place your order
                  </p>
                  <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <a
                      href={`tel:+15551234567`}
                      className="rounded-xl bg-white/90 px-6 py-3 font-semibold text-gray-900 transition-colors hover:bg-white shadow-lg"
                    >
                      Call Now
                    </a>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(restaurant.location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl bg-white/20 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/30 shadow-lg"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
