"use client";

import Link from "next/link";
import Image from "next/image";
import { restaurants } from "../data/restaurants";

export default function BrowseMenus() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* Hero - aligned with home */}
      <section className="relative overflow-hidden pt-16 hero-pattern-modern">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute top-1/2 -left-24 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl" />
        </div>
        <div className="container relative mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Restaurants & Menus
            </h1>
            <p className="mt-6 text-lg text-gray-600 sm:text-xl">
              Choose a restaurant to see its full menu, dishes, and prices
            </p>
          </div>
        </div>
      </section>

      {/* Restaurants list */}
      <div className="border-t border-gray-100 bg-white">
        <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <h2 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Restaurants
          </h2>
          <p className="mb-10 text-gray-600">
            Tap a restaurant to view its menu items and prices
          </p>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                href={`/restaurant/${restaurant.id}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-xl"
              >
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

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="mb-1.5 text-xl font-bold tracking-tight text-gray-900 transition-colors group-hover:text-primary-dark">
                    {restaurant.name}
                  </h3>
                  <p className="mb-3 line-clamp-2 text-sm leading-snug text-gray-500">
                    {restaurant.description}
                  </p>
                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
                    <span className="text-xs font-medium text-gray-400">
                      {restaurant.menu.length} menu items
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
        </main>
      </div>
    </div>
  );
}
