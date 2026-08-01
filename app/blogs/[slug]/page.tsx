import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BLOGS, postBySlug } from "@/lib/content";
import { formatPostDate } from "@/lib/dates";
import { postMetadata } from "@/lib/seo";
import ArticleSchema from "@/components/layout/ArticleSchema";

/** Every post is known at build time, so prerender them all. */
export function generateStaticParams() {
  return BLOGS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) return { title: "Not found | OrbitWorks" };

  // Canonical + absolute OG image URLs — relative ones are dropped by most
  // crawlers and social unfurlers.
  return postMetadata(post);
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) notFound();

  const more = BLOGS.filter((p) => p.slug !== post.slug).slice(0, 3);


  return (
    <main>
      <ArticleSchema post={post} />
      <article className="orbit-post">
        <div
          className="wp-block-kenza-column-constraint column-constraint cols-12"
          data-transition="slideup"
          data-transition-include="through"
        >
          <p className="label orbit-post__meta">
            <Link href="/blogs">Blog</Link>
            <span aria-hidden="true"> · </span>
            {post.kind}
            <span aria-hidden="true"> · </span>
            {post.readingMinutes} min read
          </p>

          <h1 className="wp-block-heading orbit-post__title">{post.title}</h1>

          <p className="has-text-align-left large large-intro shorten shorten-70 wp-block-paragraph">
            {post.excerpt}
          </p>

          <p className="label small orbit-post__byline">
            {post.author}
            <span aria-hidden="true"> · </span>
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          </p>
        </div>

        <div
          className="wp-block-kenza-column-constraint column-constraint cols-12"
          data-transition="slideup"
        >
          <figure className="orbit-post__hero">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.image} alt={post.title} loading="eager" decoding="async" />
          </figure>
        </div>

        <div
          className="wp-block-kenza-column-constraint column-constraint cols-12"
          data-transition="slideup"
          data-transition-include="through"
        >
          <div className="orbit-post__body">
            {post.body.map((para, i) =>
              para.startsWith("## ") ? (
                <h2 key={i}>{para.slice(3)}</h2>
              ) : (
                <p key={i}>{para}</p>
              ),
            )}
          </div>
        </div>
      </article>

      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12"
        data-transition="slideup"
      >
        <h2 className="wp-block-heading deco-l mobile">More</h2>
        <ul className="orbit-cards">
          {more.map((p) => (
            <li key={p.slug}>
              <Link href={`/blogs/${p.slug}`} className="orbit-card">
                <figure>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.title} loading="lazy" decoding="async" />
                </figure>
                <span className="label">{p.kind}</span>
                <h3>{p.title}</h3>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
