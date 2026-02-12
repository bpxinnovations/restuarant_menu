"use client";

import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "../data/blogs";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
     
      <section className="relative overflow-hidden pt-16 hero-pattern-modern">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute top-1/2 -left-24 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl" />
        </div>
        <div className="container relative mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Food Blog
            </h1>
            <p className="mt-6 text-lg text-gray-600 sm:text-xl">
              Recipes, restaurant tips, and guides to Ghanaian and West African food
            </p>
          </div>
        </div>
      </section>

      {/* Blog grid */}
      <div className="border-t border-gray-100 bg-white">
        <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <h2 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Latest posts
          </h2>
          <p className="mb-10 text-gray-600">
            Food stories, dish guides, and dining tips from our team
          </p>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blogs/${post.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-xl"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                  <Image
                    src={post.imageUrl}
                    alt={post.imageAlt}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1.5">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-medium text-gray-700 backdrop-blur-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <time
                    dateTime={post.publishedAt}
                    className="text-xs font-medium text-gray-400"
                  >
                    {formatDate(post.publishedAt)}
                  </time>
                  <h3 className="mb-2 mt-1 text-xl font-bold tracking-tight text-gray-900 transition-colors group-hover:text-primary-dark">
                    {post.title}
                  </h3>
                  <p className="mb-3 line-clamp-2 text-sm leading-snug text-gray-500">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
                    <span className="text-xs font-medium text-gray-400">
                      {post.author} · {post.readTimeMinutes} min read
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all group-hover:gap-2 group-hover:text-primary-dark">
                      Read more
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
