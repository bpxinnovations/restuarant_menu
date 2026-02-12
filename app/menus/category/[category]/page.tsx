"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { restaurants } from "../../../data/restaurants";
import { useParams } from "next/navigation";

export default function CategoryMenu() {
  const params = useParams();
  const category = decodeURIComponent(params?.category as string);


  const categoryItems = useMemo(() => {
    const items: Array<{
      item: typeof restaurants[0]["menu"][0];
      restaurant: typeof restaurants[0];
    }> = [];

    restaurants.forEach((restaurant) => {
      restaurant.menu.forEach((item) => {
        if (item.category === category) {
          items.push({ item, restaurant });
        }
      });
    });

    return items.sort((a, b) => a.item.price - b.item.price); // Sort by price
  }, [category]);

  // Get unique restaurants for this category
  const restaurantsInCategory = useMemo(() => {
    const restaurantSet = new Set(
      categoryItems.map(({ restaurant }) => restaurant.id)
    );
    return restaurants.filter((r) => restaurantSet.has(r.id));
  }, [categoryItems]);

  if (categoryItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Category Not Found
          </h1>
          <p className="mb-8 text-gray-600">
            The category "{category}" doesn't exist or has no items.
          </p>
          <Link
            href="/menus"
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Browse All Menus
          </Link>
        </div>
      </div>
    );
  }

  // Calculate stats
  const stats = useMemo(() => {
    const prices = categoryItems.map(({ item }) => item.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice =
      prices.reduce((sum, price) => sum + price, 0) / prices.length;

    return { minPrice, maxPrice, avgPrice };
  }, [categoryItems]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 container mx-auto px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center text-white">
            <Link
              href="/menus"
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
              <span className="font-medium">Back to Menus</span>
            </Link>

            <h1 className="mb-4 text-4xl font-extrabold sm:text-5xl lg:text-6xl drop-shadow-lg">
              {category}
            </h1>
            <p className="mb-8 text-xl text-white/90 sm:text-2xl drop-shadow-md">
              {categoryItems.length} {categoryItems.length === 1 ? "item" : "items"} from{" "}
              {restaurantsInCategory.length}{" "}
              {restaurantsInCategory.length === 1 ? "restaurant" : "restaurants"}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 rounded-2xl bg-white/20 p-6 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-2xl font-bold sm:text-3xl">${stats.minPrice.toFixed(2)}</div>
                <div className="mt-1 text-xs text-white/80 sm:text-sm">Min Price</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold sm:text-3xl">${stats.avgPrice.toFixed(2)}</div>
                <div className="mt-1 text-xs text-white/80 sm:text-sm">Avg Price</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold sm:text-3xl">${stats.maxPrice.toFixed(2)}</div>
                <div className="mt-1 text-xs text-white/80 sm:text-sm">Max Price</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Filter by Restaurant */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Available at {restaurantsInCategory.length}{" "}
            {restaurantsInCategory.length === 1 ? "Restaurant" : "Restaurants"}
          </h2>
          <div className="flex flex-wrap gap-3">
            {restaurantsInCategory.map((restaurant) => (
              <Link
                key={restaurant.id}
                href={`/restaurant/${restaurant.id}`}
                className="group flex items-center gap-3 rounded-xl bg-white p-4 shadow-md transition-all hover:shadow-lg"
              >
                <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                  <Image
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                    sizes="48px"
                  />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {restaurant.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {categoryItems.filter((i) => i.restaurant.id === restaurant.id).length}{" "}
                    {category} items
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="mb-8">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            All {category} Items
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categoryItems.map(({ item, restaurant }) => (
              <Link
                key={`${restaurant.id}-${item.id}`}
                href={`/restaurant/${restaurant.id}`}
                className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
              >
                {/* Restaurant Info */}
                <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-lg">
                      <Image
                        src={restaurant.imageUrl}
                        alt={restaurant.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-110"
                        sizes="40px"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {restaurant.name}
                      </div>
                      <div className="text-xs text-gray-600">{restaurant.location}</div>
                    </div>
                  </div>
                </div>

                {/* Menu Item Info */}
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {item.name}
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-gray-600 line-clamp-3">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">
                      ${item.price.toFixed(2)}
                    </span>
                    <span className="flex items-center text-sm font-semibold text-blue-600 transition-colors group-hover:text-blue-700">
                      View Menu
                      <svg
                        className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

