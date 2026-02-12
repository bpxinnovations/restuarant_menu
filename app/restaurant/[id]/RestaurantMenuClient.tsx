"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import type { Restaurant, ReviewsSummary, RatingDistribution, ReviewAttributeScores } from "../../data/restaurants";

const RestaurantMap = dynamic(
  () => import("../../components/RestaurantMap").then((m) => ({ default: m.RestaurantMap })),
  { ssr: false, loading: () => <div className="h-[160px] w-full rounded-lg bg-gray-100 animate-pulse" /> }
);

const STICKY_OFFSET = 120;

interface RestaurantMenuClientProps {
  restaurant: Restaurant;
}

function getMinPrice(menu: { price: number }[]): number {
  if (!menu.length) return 0;
  return Math.min(...menu.map((m) => m.price));
}

function priceRangeLabel(tier: 1 | 2 | 3): string {
  return "₵".repeat(tier);
}

/** Derive reviews summary from reviews array when reviewsSummary is not set */
function getReviewsSummary(restaurant: Restaurant): ReviewsSummary | null {
  if (restaurant.reviewsSummary) return restaurant.reviewsSummary;
  const reviews = restaurant.reviews;
  if (!reviews?.length) return null;
  const totalReviews = reviews.length;
  const averageRating = reviews.reduce((s, r) => s + r.rating, 0) / totalReviews;
  const distribution: RatingDistribution = { excellent: 0, good: 0, average: 0, poor: 0, terrible: 0 };
  reviews.forEach((r) => {
    const bucket = Math.round(r.rating);
    if (bucket >= 5) distribution.excellent++;
    else if (bucket >= 4) distribution.good++;
    else if (bucket >= 3) distribution.average++;
    else if (bucket >= 2) distribution.poor++;
    else distribution.terrible++;
  });
  return { totalReviews, averageRating, distribution };
}

const RATING_LABELS: { key: keyof RatingDistribution; label: string }[] = [
  { key: "excellent", label: "Excellent" },
  { key: "good", label: "Good" },
  { key: "average", label: "Average" },
  { key: "poor", label: "Poor" },
  { key: "terrible", label: "Terrible" },
];

const ATTRIBUTE_LABELS: { key: keyof ReviewAttributeScores; label: string }[] = [
  { key: "service", label: "Service" },
  { key: "food", label: "Food" },
  { key: "value", label: "Value" },
];

export default function RestaurantMenuClient({ restaurant }: RestaurantMenuClientProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [reviewsTab, setReviewsTab] = useState<"all" | "insider">("all");
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const reviewsSummary = getReviewsSummary(restaurant);
  const hasReviews = (restaurant.reviews?.length ?? 0) > 0 || reviewsSummary !== null;

  const priceTier = restaurant.priceTier ?? (restaurant.menu.length ? (getMinPrice(restaurant.menu) < 25 ? 1 : getMinPrice(restaurant.menu) < 45 ? 2 : 3) : 1);
  const minBudget = restaurant.minimumBudget ?? getMinPrice(restaurant.menu);
  const openNow = restaurant.hours?.openNow ?? restaurant.openNow;

  const TAB_ORDER = ["Starters", "Drinks", "Main dish"] as const;
  type TabCategory = (typeof TAB_ORDER)[number];

  const normalizeCategory = (raw: string): TabCategory => {
    const lower = raw.toLowerCase();
    if (lower.includes("side") || lower.includes("appetizer") || lower.includes("breakfast")) return "Starters";
    if (lower.includes("drink")) return "Drinks";
    return "Main dish";
  };

  const menuByCategory = restaurant.menu.reduce(
    (acc, item) => {
      const tab = normalizeCategory(item.category);
      if (!acc[tab]) acc[tab] = [];
      acc[tab].push(item);
      return acc;
    },
    {} as Record<TabCategory, typeof restaurant.menu>
  );
  const categories: TabCategory[] = [...TAB_ORDER];

  const scrollToCategory = useCallback((category: string) => {
    setActiveCategory(category);
    const element = categoryRefs.current[category];
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) setActiveCategory(categories[0]);
  }, [categories.length, activeCategory]);

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
        if (el.getBoundingClientRect().top <= threshold + 40) current = category;
      }
      if (current) setActiveCategory(current);
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => container.removeEventListener("scroll", handleScroll);
  }, [categories]);

  const photoUrls: string[] = [];
  if (restaurant.imageUrl) photoUrls.push(restaurant.imageUrl);
  if (restaurant.photos?.exterior) photoUrls.push(restaurant.photos.exterior);
  if (restaurant.photos?.interior) photoUrls.push(restaurant.photos.interior);
  if (restaurant.photos?.food?.length) photoUrls.push(...restaurant.photos.food);
  const uniquePhotos = [...new Set(photoUrls)];

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero — card style: under navbar; image + semi-transparent overlay + CTA */}
      <section className="relative bg-white px-4 pt-4 pb-6 sm:px-6 sm:pt-6 sm:pb-8 lg:px-8">
        {/* Modern decorative pattern on white background */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
          {/* Rounded square - top left */}
          <svg className="hero-svg-float-1 absolute left-[2%] top-[6%] h-14 w-14 text-primary/20 sm:h-18 sm:w-18" viewBox="0 0 48 48" fill="currentColor">
            <rect x="8" y="8" width="32" height="32" rx="8" />
          </svg>
          {/* Ring - top right */}
          <svg className="hero-svg-drift absolute right-[4%] top-[10%] h-20 w-20 text-primary/15 sm:h-24 sm:w-24" style={{ animationDelay: "-3s" }} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="32" cy="32" r="28" />
          </svg>
          {/* Plus sign - left middle (slow spin) */}
          <svg className="hero-svg-spin absolute left-[3%] top-[40%] h-10 w-10 text-primary/25 sm:h-12 sm:w-12" viewBox="0 0 32 32" fill="currentColor">
            <rect x="13" y="4" width="6" height="24" rx="3" />
            <rect x="4" y="13" width="24" height="6" rx="3" />
          </svg>
          {/* Blob shape - bottom left */}
          <svg className="hero-svg-drift absolute left-[5%] bottom-[12%] h-16 w-16 text-primary/20 sm:h-20 sm:w-20" style={{ animationDelay: "-8s" }} viewBox="0 0 56 56" fill="currentColor">
            <path d="M28 4c12 0 22 8 22 20s-6 24-18 28c-4 1-8-2-12-4-8-4-14-12-14-24C6 12 16 4 28 4z" />
          </svg>
          {/* Dotted ring - right middle (slow spin) */}
          <svg className="hero-svg-spin absolute right-[3%] top-[45%] h-16 w-16 text-primary/18 sm:h-20 sm:w-20" style={{ animationDirection: "reverse" }} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="4 6">
            <circle cx="32" cy="32" r="26" />
          </svg>
          {/* Small dot cluster - top */}
          <svg className="hero-svg-float-2 absolute right-[18%] top-[4%] h-8 w-8 text-primary/30 sm:h-10 sm:w-10" style={{ animationDelay: "-4s" }} viewBox="0 0 32 32" fill="currentColor">
            <circle cx="8" cy="16" r="4" />
            <circle cx="24" cy="12" r="3" />
            <circle cx="20" cy="24" r="2.5" />
          </svg>
          {/* Hexagon - right bottom */}
          <svg className="hero-svg-drift absolute right-[6%] bottom-[18%] h-12 w-12 text-primary/22 sm:h-14 sm:w-14" style={{ animationDelay: "-7s" }} viewBox="0 0 40 40" fill="currentColor">
            <polygon points="20,2 37,11 37,29 20,38 3,29 3,11" />
          </svg>
          {/* Cross/X shape - bottom middle-left */}
          <svg className="hero-svg-float-1 absolute left-[12%] bottom-[25%] h-8 w-8 text-primary/25 sm:h-10 sm:w-10" style={{ animationDelay: "-6s" }} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <line x1="6" y1="6" x2="26" y2="26" />
            <line x1="26" y1="6" x2="6" y2="26" />
          </svg>
          {/* Small rounded square - left */}
          <svg className="hero-svg-float-2 absolute left-[1%] top-[58%] h-6 w-6 text-primary/28 sm:h-8 sm:w-8" style={{ animationDelay: "-9s" }} viewBox="0 0 24 24" fill="currentColor">
            <rect x="4" y="4" width="16" height="16" rx="4" />
          </svg>
          {/* Double ring - bottom right corner (pulse) */}
          <svg className="hero-svg-pulse absolute right-[2%] bottom-[8%] h-10 w-10 text-primary/15 sm:h-12 sm:w-12" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="20" cy="20" r="16" />
            <circle cx="20" cy="20" r="10" />
          </svg>
          {/* Triangle - top middle */}
          <svg className="hero-svg-float-1 absolute left-[25%] top-[3%] h-6 w-6 text-primary/22 sm:h-8 sm:w-8" style={{ animationDelay: "-1s" }} viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12,2 22,20 2,20" />
          </svg>
        </div>
        <div className="relative z-10 mx-auto max-w-6xl overflow-hidden rounded-2xl bg-gray-100 shadow-xl sm:rounded-3xl">
          <div className="relative h-[280px] w-full sm:h-[360px] lg:h-[420px]">
            <Image
              src={restaurant.imageUrl}
              alt={restaurant.name}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 1152px, 100vw"
              priority
            />
            <Link
              href="/"
              className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-lg bg-black/40 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/60 sm:left-6 sm:top-6"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </Link>

            {/* Semi-transparent dark overlay (bottom half) */}
            <div className="absolute inset-x-0 bottom-0 z-0 h-1/2 min-h-[180px] rounded-b-2xl bg-gradient-to-t from-black/85 via-black/50 to-transparent sm:min-h-[200px] sm:rounded-b-3xl" />

            {/* Overlay content */}
            <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end p-5 pb-6 sm:p-6 sm:pb-8 lg:p-8 lg:pb-10">
              <div className="relative flex items-end justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-sm">
                    {restaurant.cuisine}
                  </span>
                  <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                    {restaurant.name}
                  </h1>
                  <p className="mt-1.5 max-w-2xl text-sm font-normal leading-snug text-white/90 sm:text-base">
                    {restaurant.description}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/80">
                    {openNow !== undefined && (
                      <span className={openNow ? "text-emerald-300" : "text-white/60"}>
                        {openNow ? "Open now" : "Closed"}
                      </span>
                    )}
                    <span>{priceRangeLabel(priceTier as 1 | 2 | 3)}</span>
                    {minBudget > 0 && <span>From ₵{minBudget} GHS</span>}
                  </div>
                </div>
                <a
                  href="#menu"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-gray-900 shadow-lg transition-transform hover:scale-105 sm:h-14 sm:w-14"
                  aria-label="Scroll to menu"
                >
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photos section with grey background */}
      {uniquePhotos.length >= 1 && (
        <section className="bg-gray-100 py-8 sm:py-10" aria-label="Photos">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="mb-5 text-2xl font-bold text-gray-900 sm:mb-6 sm:text-3xl">Photos</h2>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4 md:grid-rows-2">
              {uniquePhotos.length === 1 ? (
                <div className="relative col-span-2 aspect-[16/10] min-h-[200px] overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/5 md:col-span-4 md:min-h-[260px]">
                  <Image src={uniquePhotos[0]} alt="" fill className="object-cover" sizes="(min-width: 768px) 100vw, 100vw" />
                </div>
              ) : (
                uniquePhotos.slice(0, 5).map((url, i) => (
                  <div
                    key={url + i}
                    className={`relative overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/5 ${
                      i === 0
                        ? "col-span-2 row-span-2 min-h-[200px] md:min-h-[280px]"
                        : "aspect-[4/3] min-h-[100px] sm:min-h-[120px]"
                    }`}
                  >
                    <Image src={url} alt="" fill className="object-cover" sizes={i === 0 ? "(min-width: 768px) 50vw, 100vw" : "25vw"} />
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      <div className="container mx-auto bg-white px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* Menu + sidebar: compact list left, Hours/Contact/Location right */}
        <div className="mb-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6">
          <section id="menu" className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5 lg:max-h-[calc(100vh-10rem)] lg:flex lg:flex-col" aria-label="Menu">
            <div className="border-b border-gray-100 bg-gray-50/50 px-4 py-3">
              <h2 className="text-lg font-bold text-gray-900">Menu</h2>
              <p className="text-xs text-gray-500">{restaurant.menu.length} items</p>
            </div>
            <div ref={scrollContainerRef} className="max-h-[50vh] overflow-y-auto p-3 lg:max-h-none lg:min-h-0 lg:flex-1 lg:p-4">
              <div className="sticky top-0 z-10 mb-3 flex flex-wrap gap-1.5 rounded-lg bg-gray-100/90 py-1.5 backdrop-blur-sm">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => scrollToCategory(cat)}
                    className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                      activeCategory === cat ? "bg-primary text-white" : "bg-white text-gray-600 hover:bg-white/80"
                    }`}
                  >
                    {cat} ({(menuByCategory[cat]?.length ?? 0)})
                  </button>
                ))}
              </div>
              <div className="space-y-4">
                {categories.map((cat) => {
                  const items = menuByCategory[cat] ?? [];
                  return (
                    <div
                      key={cat}
                      ref={(el) => { categoryRefs.current[cat] = el; }}
                      className="scroll-mt-16"
                      style={{ scrollMarginTop: 64 }}
                    >
                      <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-primary/80">{cat}</h3>
                      <ul className="space-y-1.5">
                        {items.length === 0 ? (
                          <li className="text-xs text-gray-500">No items</li>
                        ) : (
                          items.map((item) => (
                            <li key={item.id} className="group relative flex items-start justify-between gap-2 overflow-hidden rounded-xl border border-gray-100 bg-white px-3 py-2.5 shadow-sm transition-all duration-300 ease-out hover:-translate-x-0.5 hover:border-primary/25">
                              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/8 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden />
                              <span className="absolute left-0 top-0 h-full w-1 origin-top scale-y-0 rounded-r bg-primary transition-transform duration-300 ease-out group-hover:scale-y-100" aria-hidden />
                              <div className="relative z-10 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 transition-colors duration-300 group-hover:text-primary-dark">{item.name}</p>
                                <p className="mt-0.5 text-xs text-gray-600 line-clamp-1">{item.description}</p>
                              </div>
                              <p className="relative z-10 shrink-0 text-sm font-bold text-primary tabular-nums">₵{item.price.toFixed(2)}</p>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Sidebar: Hours, Contact, Location */}
          <div className="min-w-0 space-y-4">
            {(restaurant.hours?.weekdays || restaurant.hours?.saturday || restaurant.hours?.sunday || openNow !== undefined) && (
              <div className="group/card relative overflow-hidden rounded-xl bg-slate-800 p-5 text-left transition-all duration-300 hover:bg-slate-700 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5">
                <h3 className="text-lg font-bold text-white">Opening Hours</h3>
                <div className="mt-3 space-y-0.5 text-sm text-white/70">
                  {restaurant.hours?.weekdays && <p>{restaurant.hours.weekdays}</p>}
                  {restaurant.hours?.saturday && <p>{restaurant.hours.saturday}</p>}
                  {restaurant.hours?.sunday && <p>{restaurant.hours.sunday}</p>}
                </div>
                <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-primary/10 transition-colors duration-300 group-hover/card:bg-primary/15" />
                <div className="absolute bottom-2 right-2 text-primary/35 transition-colors duration-300 group-hover/card:text-primary/50">
                  <svg className="h-14 w-14" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
              </div>
            )}
            {(restaurant.contact?.phone || restaurant.contact?.email) && (
              <div className="group/card relative overflow-hidden rounded-xl bg-slate-800 p-5 text-left transition-all duration-300 hover:bg-slate-700 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5">
                <h3 className="text-lg font-bold text-white">Get in Touch</h3>
                <div className="mt-3 space-y-1.5 text-sm text-white/70">
                  {restaurant.contact.phone && (
                    <a href={`tel:${restaurant.contact.phone.replace(/\s/g, "")}`} className="block hover:text-primary">
                      {restaurant.contact.phone}
                    </a>
                  )}
                  {restaurant.contact.email && (
                    <a href={`mailto:${restaurant.contact.email}`} className="block hover:text-primary">
                      {restaurant.contact.email}
                    </a>
                  )}
                </div>
                <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-primary/10 transition-colors duration-300 group-hover/card:bg-primary/15" />
                <div className="absolute bottom-2 right-2 text-primary/35 transition-colors duration-300 group-hover/card:text-primary/50">
                  <svg className="h-14 w-14" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                {(restaurant.contact?.facebook || restaurant.contact?.instagram) && (
                  <div className="mt-3 flex gap-2">
                    {restaurant.contact.facebook && (
                      <a href={`https://facebook.com/${restaurant.contact.facebook}`} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-white/10 p-2 text-white/70 transition-colors hover:bg-primary/20 hover:text-primary" aria-label="Facebook">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                      </a>
                    )}
                    {restaurant.contact.instagram && (
                      <a href={`https://instagram.com/${restaurant.contact.instagram}`} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-white/10 p-2 text-white/70 transition-colors hover:bg-primary/20 hover:text-primary" aria-label="Instagram">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.265.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.058 1.645-.07 4.849-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" /></svg>
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}
            <div className="group/card relative overflow-hidden rounded-xl bg-slate-800 p-5 text-left transition-all duration-300 hover:bg-slate-700 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5">
              <h3 className="text-lg font-bold text-white">Location</h3>
              <p className="mt-3 text-sm text-white/70">
                {restaurant.location}
              </p>
              {restaurant.coordinates && (
                <>
                  <div className="mt-3 overflow-hidden rounded-xl ring-1 ring-white/10">
                    <RestaurantMap lat={restaurant.coordinates.lat} lng={restaurant.coordinates.lng} name={restaurant.name} />
                  </div>
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(restaurant.location)}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-white/15 hover:text-primary-dark">
                    Open in Maps
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </a>
                </>
              )}
              <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-primary/10 transition-colors duration-300 group-hover/card:bg-primary/15" />
              <div className="absolute bottom-2 right-2 text-primary/35 transition-colors duration-300 group-hover/card:text-primary/50">
                <svg className="h-14 w-14" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Attributes, Reviews, CTA — full width below */}
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white p-6 shadow-md ring-1 ring-gray-200/60">
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-primary/15 px-4 py-2 text-sm font-semibold text-primary ring-1 ring-primary/20">{restaurant.cuisine}</span>
              {restaurant.atmosphere?.map((tag) => (
                <span key={tag} className="rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200">{tag}</span>
              ))}
              {restaurant.dietary?.map((d) => (
                <span key={d} className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800 ring-1 ring-emerald-200/60">{d}</span>
              ))}
            </div>
            <p className="mb-4 text-sm leading-relaxed text-gray-700">{restaurant.description}</p>
            <p className="inline-flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-sm font-bold text-primary ring-1 ring-primary/20">
              {priceRangeLabel(priceTier as 1 | 2 | 3)} · Min budget ₵{minBudget} GHS
            </p>
          </div>

          {/* Reviews */}
          {hasReviews && reviewsSummary && (
          <section className="overflow-hidden rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-200/60 sm:p-8">
            {/* Header: title, underlined tabs, action buttons */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <h2 className="text-xl font-bold text-primary">Reviews</h2>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setReviewsTab("insider")}
                    className={`text-sm font-medium transition-colors ${
                      reviewsTab === "insider"
                        ? "text-primary underline decoration-primary underline-offset-2"
                        : "text-gray-600 hover:text-primary hover:underline"
                    }`}
                  >
                    Insider tips/Q&A ({reviewsSummary.insiderTipsCount ?? 0})
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewsTab("all")}
                    className={`text-sm font-medium transition-colors ${
                      reviewsTab === "all"
                        ? "text-primary underline decoration-primary underline-offset-2"
                        : "text-gray-600 hover:text-primary hover:underline"
                    }`}
                  >
                    All reviews ({reviewsSummary.totalReviews})
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full border-2 border-primary bg-white px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Share an insider tip
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Write a review
                  </button>
                </div>
              </div>
            </div>

            {/* Three columns: overall rating (circles), distribution bars, aspect scores */}
            <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {/* Left: big number, Average, five circular rating indicators, count */}
              <div>
                <p className="text-4xl font-bold text-primary">{reviewsSummary.averageRating.toFixed(1)}</p>
                <p className="mt-1 text-sm text-gray-600">Average</p>
                <div className="mt-3 flex items-center gap-1.5">
                  <div className="flex gap-1" aria-label={`${reviewsSummary.averageRating.toFixed(1)} out of 5`}>
                    {[1, 2, 3, 4, 5].map((i) => {
                      const fill = Math.min(1, Math.max(0, reviewsSummary.averageRating - i + 1));
                      return (
                        <span key={i} className="relative inline-block h-5 w-5 shrink-0 rounded-full border-2 border-gray-300 bg-white">
                          {fill >= 1 && <span className="absolute inset-0 rounded-full bg-primary" />}
                          {fill > 0 && fill < 1 && (
                            <span className="absolute inset-0 overflow-hidden rounded-full">
                              <span className="absolute left-0 top-0 h-full rounded-l-full bg-primary" style={{ width: `${fill * 100}%` }} />
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                  <span className="text-sm text-gray-600">({reviewsSummary.totalReviews})</span>
                </div>
              </div>

              {/* Middle: Excellent / Good / Average / Poor / Terrible with progress bars and counts */}
              <div>
                <div className="space-y-2.5">
                  {RATING_LABELS.map(({ key, label }) => {
                    const count = reviewsSummary.distribution[key];
                    const max = Math.max(...Object.values(reviewsSummary.distribution), 1);
                    const pct = max > 0 ? (count / max) * 100 : 0;
                    return (
                      <div key={key} className="flex items-center gap-3">
                        <span className="w-20 shrink-0 text-sm text-gray-700">{label}</span>
                        <div className="h-2.5 flex-1 min-w-0 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-6 shrink-0 text-right text-sm text-gray-600">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right: Service, Food, Value with progress bars and scores */}
              {reviewsSummary.attributeScores && (
                <div>
                  <div className="space-y-2.5">
                    {ATTRIBUTE_LABELS.map(({ key, label }) => {
                      const score = reviewsSummary.attributeScores?.[key];
                      if (score == null) return null;
                      const pct = (score / 5) * 100;
                      return (
                        <div key={key} className="flex items-center gap-3">
                          <span className="w-16 shrink-0 text-sm text-gray-700">{label}</span>
                          <div className="h-2.5 flex-1 min-w-0 overflow-hidden rounded-full bg-gray-200">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-8 shrink-0 text-right text-sm font-medium text-gray-900">{score.toFixed(1)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Review list (All reviews tab) or placeholder for Insider tips */}
            {reviewsTab === "all" && restaurant.reviews && restaurant.reviews.length > 0 && (
              <ul className="space-y-3 border-t border-gray-200 pt-6">
                {restaurant.reviews.map((review, i) => (
                  <li key={i} className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm ring-1 ring-black/5">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-semibold text-gray-900">{review.author}</span>
                      <span className="flex items-center gap-1 text-primary font-medium">
                        ★ {review.rating.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.text}</p>
                    {review.date && <p className="mt-2 text-sm text-gray-500">{review.date}</p>}
                  </li>
                ))}
              </ul>
            )}
            {reviewsTab === "insider" && (
              <div className="border-t border-gray-200 pt-4 text-center text-sm text-gray-500">
                Insider tips and Q&A will appear here.
              </div>
            )}
          </section>
          )}

        </div>
      </div>
    </div>
  );
}
