"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { restaurants } from "./data/restaurants";
// Partner images for Discover Restaurants section (from /public/images/partners/)
const partnerImages = [
  "/images/partners/147-1475937_jeff-kinney-penguin-random-house-logo%20Background%20Removed.png",
  "/images/partners/a7bdc469-cd70-4ea1-bb57-b59204ad8182-cover.png",
  "/images/partners/c6b68b29632909%20Background%20Removed.55fc107b87f06.png",
  "/images/partners/pngtree-dice-logo-vector-choice-gambling-random-vector-png-image_52308860.jpg",
  "/images/partners/random-logo-png-transparent.png",
  "/images/partners/riofruits-logo.png",
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const filteredRestaurants = useMemo(() => {
    let filtered = restaurants;

    // Filter by cuisine
    if (selectedCuisine) {
      filtered = filtered.filter((r) => r.cuisine === selectedCuisine);
    }

    // Filter by search query
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
  }, [searchQuery, selectedCuisine]);

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

      {/* Search Bar - below hero */}
      <div className="border-t border-gray-100 bg-white py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
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
                className="w-full rounded-lg border-2 border-gray-200 bg-white py-3 pl-12 pr-12 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
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
            {searchQuery && (
              <p className="mt-2 text-center text-sm text-gray-600">
                Found {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>
      </div>

      <main className="relative z-10 bg-white">
        {/* Discover Restaurants Section */}
        <section id={searchQuery || selectedCuisine ? undefined : "restaurants"} className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex items-center justify-between">
              <div>
                <h2 className="mb-2 text-3xl font-bold text-gray-900 sm:text-4xl">
                  {searchQuery || selectedCuisine ? "Search Results" : "Discover Restaurants"}
                </h2>
                <p className="text-gray-600">
                  {searchQuery || selectedCuisine
                    ? `Found ${filteredRestaurants.length} restaurant${filteredRestaurants.length !== 1 ? "s" : ""}`
                    : "Discover amazing places to dine"}
                </p>
              </div>
              {!searchQuery && !selectedCuisine && (
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
                !searchQuery && !selectedCuisine
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
                      <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-gray-800 shadow-sm backdrop-blur-sm">
                        <span className="text-amber-500">★</span>
                        {restaurant.rating}
                      </div>
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
                  Try adjusting your search terms or cuisine filter
                </p>
              </div>
            );
            })()}
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
