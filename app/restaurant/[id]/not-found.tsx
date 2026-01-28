import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-slate-900 dark:text-slate-50">
          404
        </h1>
        <h2 className="mb-4 text-2xl font-semibold text-slate-700 dark:text-slate-300">
          Restaurant Not Found
        </h2>
        <p className="mb-8 text-slate-600 dark:text-slate-400">
          Sorry, we couldn't find the restaurant you're looking for.
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Back to Restaurants
        </Link>
      </div>
    </div>
  );
}

