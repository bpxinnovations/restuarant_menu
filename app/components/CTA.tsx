import Link from "next/link";

export default function CTA() {
  return (
    <section className="relative overflow-hidden border-t border-gray-100 bg-gradient-to-br from-primary/8 via-white to-primary/5">
      <div className="absolute inset-0 hero-pattern-dots opacity-50" aria-hidden />
      <div className="container relative mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Ready to find your next meal?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Browse full menus, see prices, and discover restaurants across Ghana—from Accra to Kumasi and beyond.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/menus"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30"
            >
              Browse all menus
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/#restaurants"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary bg-white px-8 py-3.5 text-base font-semibold text-primary transition-all hover:bg-primary/10"
            >
              View restaurants
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
