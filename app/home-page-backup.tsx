"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { restaurants, type Restaurant } from "./data/restaurants";
import { blogPosts } from "./data/blogs";

const NearMeMap = dynamic(() => import("./components/NearMeMap").then((m) => ({ default: m.NearMeMap })), {
  ssr: false,
  loading: () => <div className="h-[320px] w-full rounded-xl bg-gray-100 animate-pulse" />,
});

const partnerImages = [
  "/images/partners/147-1475937_jeff-kinney-penguin-random-house-logo%20Background%20Removed.png",
  "/images/partners/a7bdc469-cd70-4ea1-bb57-b59204ad8182-cover.png",
  "/images/partners/c6b68b29632909%20Background%20Removed.55fc107b87f06.png",
  "/images/partners/pngtree-dice-logo-vector-choice-gambling-random-vector-png-image_52308860.jpg",
  "/images/partners/random-logo-png-transparent.png",
  "/images/partners/riofruits-logo.png",
];

const NEAR_ME_RADIUS_KM = 5;

/** Haversine distance in km */
function getDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/** Approximate region name from coordinates (Ghana: Kumasi / Accra) */
function getRegionName(lat: number, lng: number): string {
  if (lat >= 6.6 && lat <= 6.75 && lng >= -1.66 && lng <= -1.58) {
    return "Kumasi, Ashanti Region";
  }
  if (lat >= 5.55 && lat <= 5.65 && lng >= -0.25 && lng <= -0.1) {
    return "Accra, Greater Accra Region";
  }
  return "Your location";
}

// Extract city from location string (e.g. "..., Kumasi" -> "Kumasi")
function getCity(location: string): string {
  const parts = location.split(",").map((p) => p.trim());
  return parts[parts.length - 1] ?? location;
}

// Minimum menu price (starting price) for a restaurant
function getMinPrice(r: { menu: { price: number }[] }): number {
  if (!r.menu.length) return 0;
  return Math.min(...r.menu.map((m) => m.price));
}

export type PriceRangeId = "under-25" | "25-40" | "40-60" | "60-plus" | null;

const PRICE_RANGES: { id: PriceRangeId; label: string; min: number; max: number | null }[] = [
  { id: null, label: "Any price", min: 0, max: null },
  { id: "under-25", label: "Under 25 GHS", min: 0, max: 25 },
  { id: "25-40", label: "25 – 40 GHS", min: 25, max: 40 },
  { id: "40-60", label: "40 – 60 GHS", min: 40, max: 60 },
  { id: "60-plus", label: "60+ GHS", min: 60, max: null },
];

function restaurantMatchesPriceRange(
  r: { menu: { price: number }[] },
  rangeId: PriceRangeId
): boolean {
  if (!rangeId) return true;
  const range = PRICE_RANGES.find((x) => x.id === rangeId);
  if (!range) return true;
  const minPrice = getMinPrice(r);
  if (range.max == null) return minPrice >= range.min;
  return minPrice >= range.min && minPrice < range.max;
}

const SUGGESTED_OPTIONS = [
  { id: "openNow" as const, label: "Open Now" },
  { id: "reservations" as const, label: "Reservations" },
  { id: "onlineWaitlist" as const, label: "Offers Online Waitlist" },
  { id: "delivery" as const, label: "Offers Delivery" },
  { id: "takeout" as const, label: "Offers Takeout" },
  { id: "goodForDinner" as const, label: "Good for Dinner" },
];

const DIETARY_OPTIONS = ["Halal", "Vegan", "Vegetarian", "Kosher"];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const startingPriceDropdownRef = useRef<HTMLDivElement>(null);
  const priceDropdownPortalRef = useRef<HTMLDivElement>(null);

  // Sidebar open state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [startingPriceDropdownOpen, setStartingPriceDropdownOpen] = useState(false);
  const [priceDropdownPosition, setPriceDropdownPosition] = useState<{ top: number; left: number } | null>(null);

  // Applied filters (used for filtering results)
  const [appliedPriceRange, setAppliedPriceRange] = useState<PriceRangeId>(null);
  const [appliedSuggested, setAppliedSuggested] = useState<Record<string, boolean>>({});
  const [appliedDietary, setAppliedDietary] = useState<string[]>([]);
  const [appliedCategory, setAppliedCategory] = useState<string | null>(null);

  // Draft filters (sidebar form); synced to applied when sidebar opens; applied on "Apply filters"
  const [draftPriceRange, setDraftPriceRange] = useState<PriceRangeId>(null);
  const [draftSuggested, setDraftSuggested] = useState<Record<string, boolean>>({});
  const [draftDietary, setDraftDietary] = useState<string[]>([]);
  const [draftCategory, setDraftCategory] = useState<string | null>(null);

  // Near me: geolocation + 5km results + map
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [showNearMeView, setShowNearMeView] = useState(false);

  const nearMeRestaurants = useMemo((): Restaurant[] => {
    if (!userLocation) return [];
    return restaurants.filter((r) => {
      if (!r.coordinates) return false;
      return getDistanceKm(userLocation.lat, userLocation.lng, r.coordinates.lat, r.coordinates.lng) <= NEAR_ME_RADIUS_KM;
    });
  }, [userLocation]);

  const requestLocation = () => {
    setLocationError(null);
    setLocationLoading(true);
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      setLocationLoading(false);
      return;
    }
    if (typeof window !== "undefined" && !window.isSecureContext) {
      setLocationError(
        "Location only works on a secure connection (HTTPS) or localhost. Open this site via https:// or run it on localhost to use Find restaurants near me."
      );
      setLocationLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserLocation({ lat, lng });
        setShowNearMeView(true);
        setLocationLoading(false);
      },
      (err) => {
        setLocationError(
          err.code === 1
            ? "Location access was denied. Click the lock or info icon in your browser's address bar and set Location to Allow, then click Find restaurants near me again."
            : "Unable to get your location. Please check that location is enabled and try again."
        );
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const findRestaurantsNearMe = () => requestLocation();

  const filterOptions = useMemo(() => {
    const cuisines = [...new Set(restaurants.map((r) => r.cuisine))].sort();
    return { cuisines };
  }, []);

  const hasActiveFilters =
    appliedPriceRange != null ||
    Object.values(appliedSuggested).some(Boolean) ||
    appliedDietary.length > 0 ||
    appliedCategory != null;

  const openSidebar = () => {
    setDraftPriceRange(appliedPriceRange);
    setDraftSuggested({ ...appliedSuggested });
    setDraftDietary([...appliedDietary]);
    setDraftCategory(appliedCategory);
    setSidebarOpen(true);
  };

  const closeSidebar = () => setSidebarOpen(false);

  const applySidebarFilters = () => {
    setAppliedPriceRange(draftPriceRange);
    setAppliedSuggested({ ...draftSuggested });
    setAppliedDietary([...draftDietary]);
    setAppliedCategory(draftCategory);
    setSidebarOpen(false);
  };

  // Position and close starting price dropdown
  useEffect(() => {
    if (!startingPriceDropdownOpen || !startingPriceDropdownRef.current) {
      setPriceDropdownPosition(null);
      return;
    }
    const updatePosition = () => {
      const el = startingPriceDropdownRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setPriceDropdownPosition({ top: rect.bottom + 6, left: rect.left });
    };
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [startingPriceDropdownOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        startingPriceDropdownOpen &&
        !startingPriceDropdownRef.current?.contains(target) &&
        !priceDropdownPortalRef.current?.contains(target)
      ) {
        setStartingPriceDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [startingPriceDropdownOpen]);

  const toggleSuggested = (key: string) => {
    setAppliedSuggested((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredRestaurants = useMemo(() => {
    let filtered = restaurants;

    if (appliedPriceRange != null) {
      filtered = filtered.filter((r) => restaurantMatchesPriceRange(r, appliedPriceRange));
    }
    if (appliedSuggested.openNow) {
      filtered = filtered.filter((r) => r.openNow === true);
    }
    if (appliedSuggested.reservations) {
      filtered = filtered.filter((r) => r.reservations === true);
    }
    if (appliedSuggested.onlineWaitlist) {
      filtered = filtered.filter((r) => r.onlineWaitlist === true);
    }
    if (appliedSuggested.delivery) {
      filtered = filtered.filter((r) => r.delivery === true);
    }
    if (appliedSuggested.takeout) {
      filtered = filtered.filter((r) => r.takeout === true);
    }
    if (appliedSuggested.goodForDinner) {
      filtered = filtered.filter((r) => r.goodForDinner === true);
    }
    if (appliedDietary.length > 0) {
      filtered = filtered.filter(
        (r) => r.dietary?.some((d) => appliedDietary.includes(d)) === true
      );
    }
    if (appliedCategory) {
      filtered = filtered.filter((r) => r.cuisine === appliedCategory);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(query) ||
          restaurant.cuisine.toLowerCase().includes(query) ||
          restaurant.location.toLowerCase().includes(query) ||
          restaurant.description.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [
    searchQuery,
    appliedPriceRange,
    appliedSuggested,
    appliedDietary,
    appliedCategory,
  ]);

  // Carousel images (use multiple restaurants for hero)
  const carouselImages = useMemo(() => {
    return [...restaurants]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6)
      .map((r) => ({ imageUrl: r.imageUrl, name: r.name }));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* Hero Section - Reference UI: left content, right image + overlay card */}
      <section className="relative overflow-hidden pt-16 hero-pattern-modern">
        {/* Modern accent orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute top-1/2 -left-24 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl" />
        </div>
        <div className="container relative mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16 items-center min-h-[calc(100vh-6rem)]">
            {/* Left Content - Headline, paragraph, CTAs */}
            <div className="relative z-10 max-w-xl">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl leading-tight animate-fade-in-up">
                Restaurants in Ghana and Their Menus
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed animate-fade-in-up animation-delay-200">
                This site lists restaurants across the country and shows their full menus. Browse by restaurant, check dishes and prices, and find where to eat—from Accra to Kumasi and beyond.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 animate-fade-in-up animation-delay-400">
                <Link
                  href="#restaurants"
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-primary-dark"
                >
                  View Restaurants
                </Link>
                <Link
                  href="/menus"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-primary bg-white px-8 py-3.5 text-base font-semibold text-primary transition-all hover:bg-primary/10"
                >
                  Browse Menus
                </Link>
              </div>
            </div>

            {/* Right - Hero Carousel with Overlay Card */}
            <div className="relative h-[480px] sm:h-[520px] lg:h-[560px] rounded-2xl overflow-hidden animate-fade-in-right">
              {/* Carousel Images */}
              {carouselImages.length > 0 ? (
                <>
                  {carouselImages.map((slide, index) => (
                    <div
                      key={slide.name + index}
                      className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                        index === carouselIndex ? "opacity-100 z-0" : "opacity-0 z-0"
                      }`}
                    >
                      <Image
                        src={slide.imageUrl}
                        alt={slide.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority={index === 0}
                      />
                    </div>
                  ))}
                </>
              ) : (
                <div className="absolute inset-0 bg-gray-200" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-[1]" />

              {/* Carousel indicators */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCarouselIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === carouselIndex
                        ? "w-8 bg-white"
                        : "w-2 bg-white/60 hover:bg-white/80"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Overlay Card - clean, modern pill-style */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm z-20 animate-fade-in-up animation-delay-600">
                <div className="rounded-2xl border border-white/20 bg-white/90 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.12)] shadow-gray-900/10 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary">Menus</span>
                        <h2 className="mt-1 text-xl font-bold tracking-tight text-gray-900">See full menus</h2>
                        <p className="mt-2 text-sm leading-snug text-gray-600">
                          Dishes, prices and details for every restaurant. Pick one to view its menu.
                        </p>
                        <Link
                          href="/menus"
                          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow-md"
                        >
                          Browse all menus
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Restaurants - scrolling logos (partner images) */}
      <section className="relative border-t border-gray-100 bg-gray-50/60 py-10 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">Featured Restaurants</h2>
        </div>
        <div className="relative flex w-full" aria-hidden>
          <div className="flex animate-marquee gap-10 pl-4 sm:gap-14 sm:pl-6">
            {[...partnerImages, ...partnerImages].map((src, index) => (
              <div
                key={`marquee-partner-${index}`}
                className="group flex shrink-0 items-center justify-center rounded-2xl bg-white/80 p-3 shadow-sm ring-1 ring-gray-200/80 sm:p-4"
              >
                <div className="relative h-14 w-14 overflow-hidden rounded-xl sm:h-16 sm:w-16">
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-contain grayscale transition-all duration-300 group-hover:grayscale-0"
                    sizes="64px"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-gray-50/90 to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-gray-50/90 to-transparent sm:w-24" />
      </section>

      {/* Search Bar + Filters - below hero */}
      <div className="border-t border-gray-100 bg-white py-8 sm:py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-6xl mx-auto space-y-6">
            {/* Search + Find near me row */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch sm:gap-3">
              <div className="relative min-w-0 flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search restaurants, cuisines, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 bg-white py-3.5 pl-12 pr-12 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={findRestaurantsNearMe}
                disabled={locationLoading}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-primary bg-primary/10 px-5 py-3.5 text-sm font-semibold text-primary transition-all hover:bg-primary/20 disabled:opacity-60 sm:px-6"
              >
                {locationLoading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                      <path fill="currentColor" d="M12 2a10 10 0 0110 10h-2a8 8 0 00-8-8V2z" />
                    </svg>
                    Finding…
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Find near me
                  </>
                )}
              </button>
            </div>

            {locationError && (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 rounded-xl bg-red-50 px-4 py-3" role="alert">
                <p className="text-sm text-red-700 flex-1">{locationError}</p>
                <button
                  type="button"
                  onClick={() => { setLocationError(null); findRestaurantsNearMe(); }}
                  className="shrink-0 text-sm font-semibold text-primary hover:text-primary-dark underline"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Filters */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Filters</p>
              <div className="flex flex-nowrap items-center gap-2 overflow-x-auto pb-1 sm:gap-3">
                <button
                  type="button"
                  onClick={openSidebar}
                  className={`shrink-0 inline-flex items-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition-all ${
                    sidebarOpen
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-gray-200 bg-white text-gray-800 hover:border-primary/50 hover:bg-primary/5"
                  }`}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  All
                </button>
                <div className="relative shrink-0" ref={startingPriceDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setStartingPriceDropdownOpen((o) => !o)}
                    className={`shrink-0 inline-flex items-center gap-1.5 rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition-all ${
                      appliedPriceRange
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-gray-200 bg-white text-gray-800 hover:border-primary/50 hover:bg-primary/5"
                    }`}
                  >
                    Starting price
                    {appliedPriceRange && (
                      <span className="text-gray-500">
                        · {PRICE_RANGES.find((x) => x.id === appliedPriceRange)?.label ?? ""}
                      </span>
                    )}
                    <svg
                      className={`h-4 w-4 text-gray-500 transition-transform ${startingPriceDropdownOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                {SUGGESTED_OPTIONS.slice(0, 5).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleSuggested(opt.id)}
                    className={`shrink-0 inline-flex rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition-all ${
                      appliedSuggested[opt.id]
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-gray-200 bg-white text-gray-800 hover:border-primary/50 hover:bg-primary/5"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {(searchQuery || hasActiveFilters) && (
              <p className="text-center text-sm text-gray-600">
                Found {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Starting price dropdown (portal so it isn't clipped by overflow-x-auto) */}
      {typeof document !== "undefined" &&
        startingPriceDropdownOpen &&
        priceDropdownPosition &&
        createPortal(
          <div
            ref={priceDropdownPortalRef}
            className="min-w-[200px] rounded-xl border-2 border-gray-200 bg-white py-1 shadow-lg z-[100]"
            style={{
              position: "fixed",
              top: priceDropdownPosition.top,
              left: priceDropdownPosition.left,
            }}
          >
            {PRICE_RANGES.map((range) => (
              <button
                key={range.id ?? "any"}
                type="button"
                onClick={() => {
                  setAppliedPriceRange(range.id);
                  setStartingPriceDropdownOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  appliedPriceRange === range.id
                    ? "bg-primary/10 text-primary"
                    : "text-gray-800 hover:bg-gray-50"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>,
          document.body
        )}

      {/* Filters sidebar overlay - matches project styling */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 transition-opacity"
            onClick={closeSidebar}
            aria-hidden
          />
          <aside
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md overflow-y-auto rounded-l-2xl border-2 border-l border-gray-200 bg-white shadow-2xl"
            aria-labelledby="filters-title"
          >
            <div className="flex flex-col p-6 pb-8">
              <h2 id="filters-title" className="text-xl font-bold tracking-tight text-gray-900">
                Filters
              </h2>

              {/* Starting price */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="text-sm font-bold text-gray-900">Starting price</h3>
                <div className="mt-3 space-y-1 rounded-lg border-2 border-gray-200 p-1">
                  {PRICE_RANGES.map((range) => (
                    <button
                      key={range.id ?? "any"}
                      type="button"
                      onClick={() => setDraftPriceRange((d) => (d === range.id ? null : range.id))}
                      className={`w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                        draftPriceRange === range.id
                          ? "bg-primary/15 text-primary"
                          : "text-gray-800 hover:bg-gray-50"
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Suggested */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="text-sm font-bold text-gray-900">Suggested</h3>
                <ul className="mt-3 space-y-2">
                  {SUGGESTED_OPTIONS.map((opt) => (
                    <li key={opt.id}>
                      <label className="flex cursor-pointer items-center gap-3">
                        <input
                          type="checkbox"
                          checked={draftSuggested[opt.id] ?? false}
                          onChange={() =>
                            setDraftSuggested((d) => ({ ...d, [opt.id]: !(d[opt.id] ?? false) }))
                          }
                          className="h-4 w-4 rounded border-2 border-gray-300 text-primary focus:ring-2 focus:ring-primary/20"
                        />
                        <span className="text-sm font-medium text-gray-800">{opt.label}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dietary Restrictions */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="text-sm font-bold text-gray-900">Dietary Restrictions</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {DIETARY_OPTIONS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() =>
                        setDraftDietary((prev) =>
                          prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
                        )
                      }
                      className={`rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all ${
                        draftDietary.includes(d)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-gray-200 bg-gray-50 text-gray-800 hover:border-primary/50 hover:bg-primary/5"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category (cuisine) */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="text-sm font-bold text-gray-900">Category</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {filterOptions.cuisines.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setDraftCategory((d) => (d === c ? null : c))}
                      className={`rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all ${
                        draftCategory === c
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-gray-200 bg-gray-50 text-gray-800 hover:border-primary/50 hover:bg-primary/5"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="mt-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
                >
                  See all
                </button>
              </div>

              {/* Actions */}
              <div className="mt-8 flex gap-3 border-t border-gray-200 pt-6">
                <button
                  type="button"
                  onClick={closeSidebar}
                  className="flex-1 rounded-lg border-2 border-gray-200 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={applySidebarFilters}
                  className="flex-1 rounded-lg bg-primary py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark transition-colors"
                >
                  Apply filters
                </button>
              </div>
            </div>
          </aside>
        </>
      )}

      <main className="relative z-10 bg-white">
        {/* Near Me: Restaurants within 5km + map */}
        {showNearMeView && userLocation && (
          <section className="border-t border-gray-100 bg-gray-50/50 py-12" aria-labelledby="near-me-title">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 id="near-me-title" className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    Restaurants near you
                  </h2>
                  <p className="mt-1 text-gray-600">
                    You&apos;re in <strong>{getRegionName(userLocation.lat, userLocation.lng)}</strong> — showing
                    restaurants within {NEAR_ME_RADIUS_KM} km
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNearMeView(false)}
                  className="rounded-lg border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all"
                >
                  Back to all restaurants
                </button>
              </div>

              <div className="mb-8 min-h-[320px] overflow-hidden rounded-2xl border-2 border-gray-200 bg-white shadow-sm">
                <NearMeMap
                  userLat={userLocation.lat}
                  userLng={userLocation.lng}
                  restaurants={nearMeRestaurants}
                  className="block"
                />
              </div>

              {nearMeRestaurants.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {nearMeRestaurants.map((restaurant) => (
                    <Link
                      key={restaurant.id}
                      href={`/restaurant/${restaurant.id}`}
                      className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-xl"
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                        <Image
                          src={restaurant.imageUrl}
                          alt={restaurant.name}
                          fill
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        {restaurant.coordinates && userLocation && (
                          <div className="absolute bottom-2 left-2 rounded-lg bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                            {getDistanceKm(
                              userLocation.lat,
                              userLocation.lng,
                              restaurant.coordinates.lat,
                              restaurant.coordinates.lng
                            ).toFixed(1)}{" "}
                            km away
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="mb-1.5 text-xl font-bold tracking-tight text-gray-900 transition-colors group-hover:text-primary-dark">
                          {restaurant.name}
                        </h3>
                        <p className="mb-3 line-clamp-2 text-sm leading-snug text-gray-500">
                          {restaurant.description}
                        </p>
                        <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
                          <span className="text-xs font-medium text-gray-400">{restaurant.menu.length} items</span>
                          <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all group-hover:gap-2 group-hover:text-primary-dark">
                            View menu
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border-2 border-gray-200 bg-white p-12 text-center">
                  <p className="text-gray-600">
                    No restaurants found within {NEAR_ME_RADIUS_KM} km. Try &quot;Back to all restaurants&quot; to browse the full list.
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Discover Restaurants Section */}
        <section id={searchQuery || hasActiveFilters ? undefined : "restaurants"} className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex items-center justify-between">
              <div>
                <h2 className="mb-2 text-3xl font-bold text-gray-900 sm:text-4xl">
                  {searchQuery || hasActiveFilters ? "Search Results" : "Discover Restaurants"}
                </h2>
                <p className="text-gray-600">
                  {searchQuery || hasActiveFilters
                    ? `Found ${filteredRestaurants.length} restaurant${filteredRestaurants.length !== 1 ? "s" : ""}`
                    : "Discover amazing places to dine"}
                </p>
              </div>
              {!searchQuery && !hasActiveFilters && (
                <Link
                  href="/menus"
                  className="flex-shrink-0 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
                >
                  View more
                </Link>
              )}
            </div>

            {(() => {
              const displayRestaurants =
                !searchQuery && !hasActiveFilters
                  ? filteredRestaurants.slice(0, 5)
                  : filteredRestaurants;
              return displayRestaurants.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {displayRestaurants.map((restaurant) => (
                  <Link
                    key={restaurant.id}
                    href={`/restaurant/${restaurant.id}`}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-xl"
                  >
                    {/* Image block */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                      <Image
                        src={restaurant.imageUrl}
                        alt={restaurant.name}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-5">
                      <h2 className="mb-1.5 text-xl font-bold tracking-tight text-gray-900 transition-colors group-hover:text-primary-dark">
                        {restaurant.name}
                      </h2>
                      <p className="mb-3 line-clamp-2 text-sm leading-snug text-gray-500">
                        {restaurant.description}
                      </p>
                      <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
                        <span className="text-xs font-medium text-gray-400">
                          {restaurant.menu.length} items
                        </span>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all group-hover:gap-2 group-hover:text-primary-dark">
                          View menu
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg
                    className="h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  No restaurants found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search terms or filters (price, category, dietary, suggested).
                </p>
              </div>
            );
            })()}
          </div>
        </section>

        {/* From the blog */}
        <section className="border-t border-gray-100 bg-gray-50/60 py-16" aria-labelledby="blog-heading">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <h2 id="blog-heading" className="text-3xl font-bold text-gray-900 sm:text-4xl">
                  From the blog
                </h2>
                <p className="mt-2 text-gray-600">
                  Food guides, restaurant tips, and Ghanaian cuisine
                </p>
              </div>
              <Link
                href="/blogs"
                className="hidden shrink-0 text-sm font-semibold text-primary hover:text-primary-dark sm:block"
              >
                View all posts
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {blogPosts.slice(0, 3).map((post) => (
                <Link
                  key={post.slug}
                  href={`/blogs/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                    <Image
                      src={post.imageUrl}
                      alt={post.imageAlt}
                      fill
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <time dateTime={post.publishedAt} className="text-xs font-medium text-gray-400">
                      {new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </time>
                    <h3 className="mt-1 text-lg font-bold tracking-tight text-gray-900 transition-colors group-hover:text-primary-dark">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                      {post.excerpt}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                      Read more
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link href="/blogs" className="text-sm font-semibold text-primary hover:text-primary-dark">
                View all posts
              </Link>
            </div>
          </div>
        </section>

        {/* Dark feature section - how we help */}
        <section className="relative overflow-hidden bg-[#001514]">
          <div className="container relative mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight">
                  We make it easy for{" "}
                  <span className="text-primary">Restaurants and diners.</span>
                </h2>
              </div>
              <div>
                <p className="text-lg text-white/90 leading-relaxed">
                  Looking for a place to eat? Or a restaurant that wants to be found? This site lists restaurants across Ghana with their full menus. Browse dishes and prices, filter by cuisine or location, and find your next meal—from Accra to Kumasi and beyond.
                </p>
                <Link
                  href="/menus"
                  className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-primary-dark"
                >
                  Browse Menus
                </Link>
              </div>
            </div>

            {/* Infinite scrolling cards */}
            <div className="mt-14 lg:mt-20 overflow-hidden" aria-hidden>
              <div className="flex gap-6 animate-marquee-fast w-max">
                {[1, 2].map((copy) => (
                  <div key={copy} className="flex gap-6 shrink-0">
                    {/* Card 1 - light */}
                    <div className="flex w-[320px] shrink-0 gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white">
                        <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">Search & filter</h3>
                        <p className="mt-1 text-sm text-white/80 leading-relaxed">
                          Find restaurants by name, cuisine, or location. See ratings and descriptions at a glance.
                        </p>
                      </div>
                    </div>
                    {/* Card 2 - primary */}
                    <div className="flex w-[320px] shrink-0 gap-4 rounded-2xl bg-primary p-6">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white">
                        <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">See full menus</h3>
                        <p className="mt-1 text-sm text-white/90 leading-relaxed">
                          Browse complete menus with dishes and prices. No surprises—decide before you go.
                        </p>
                      </div>
                    </div>
                    {/* Card 3 - primary */}
                    <div className="flex w-[320px] shrink-0 gap-4 rounded-2xl bg-primary p-6">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white">
                        <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">Discover across Ghana</h3>
                        <p className="mt-1 text-sm text-white/90 leading-relaxed">
                          From Accra to Kumasi and beyond. Explore restaurants and their offerings in one place.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
