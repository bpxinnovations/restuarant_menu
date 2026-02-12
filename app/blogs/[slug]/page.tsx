import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getBlogBySlug, getAllBlogSlugs } from "../../data/blogs";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}


function renderBlogContent(content: string) {
  const paragraphs = content.trim().split(/\n\n+/);
  return paragraphs.map((block, i) => {
    type Segment = { type: "text"; value: string } | { type: "bold"; value: string } | { type: "link"; text: string; href: string };
    const segments: Segment[] = [];
    let pos = 0;
    const re = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(block)) !== null) {
      if (m.index > pos) {
        segments.push({ type: "text", value: block.slice(pos, m.index) });
      }
      const raw = m[1];
      if (raw.startsWith("**")) {
        segments.push({ type: "bold", value: raw.slice(2, -2) });
      } else {
        const linkMatch = raw.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          segments.push({ type: "link", text: linkMatch[1], href: linkMatch[2] });
        } else {
          segments.push({ type: "text", value: raw });
        }
      }
      pos = m.index + m[0].length;
    }
    if (pos < block.length) {
      segments.push({ type: "text", value: block.slice(pos) });
    }
    if (segments.length === 0) {
      return <p key={i} className="mb-4 leading-relaxed text-gray-700">{block}</p>;
    }
    return (
      <p key={i} className="mb-4 leading-relaxed text-gray-700">
        {segments.map((s, j) => {
          if (s.type === "text") return <span key={j}>{s.value}</span>;
          if (s.type === "bold") return <strong key={j} className="font-semibold text-gray-900">{s.value}</strong>;
          return (
            <Link key={j} href={s.href} className="font-medium text-primary hover:text-primary-dark underline">
              {s.text}
            </Link>
          );
        })}
      </p>
    );
  });
}

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) return { title: "Blog" };
  return {
    title: `${post.title} | Food Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) notFound();

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* Hero with image */}
      <section className="relative overflow-hidden pt-16 hero-pattern-modern">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        </div>
        <div className="container relative mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-primary transition-colors mb-6"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to blog
          </Link>

          <div className="mx-auto max-w-3xl">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              {post.excerpt}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="font-medium text-gray-700">{post.author}</span>
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              <span>{post.readTimeMinutes} min read</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured image */}
      <div className="border-t border-gray-100 bg-white">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-gray-100">
              <Image
                src={post.imageUrl}
                alt={post.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 896px"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Article body */}
      <article className="border-t border-gray-100 bg-white pb-20">
        <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl prose prose-gray">
            {renderBlogContent(post.content)}
          </div>
        </div>
      </article>

      {/* CTA back to blogs and menus */}
      <section className="border-t border-gray-100 bg-gray-50/60 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-xl font-bold text-gray-900">Explore more</h2>
            <p className="mt-2 text-gray-600">
              Browse our food blog or check out restaurant menus near you.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                href="/blogs"
                className="inline-flex items-center justify-center rounded-lg border-2 border-primary bg-white px-6 py-3 text-sm font-semibold text-primary transition-all hover:bg-primary/10"
              >
                All blog posts
              </Link>
              <Link
                href="/menus"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-dark"
              >
                View restaurant menus
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
