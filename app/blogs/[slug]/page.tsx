import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { formatPostDate } from "@/lib/dates";
import { postMetadata } from "@/lib/seo";
import { getPost, getPosts, postSchema, postSeoOverride } from "@/lib/public-blogs";
import ArticleSchema from "@/components/layout/ArticleSchema";

/**
 * Params are no longer known at build time — posts live in the database and can
 * be published after a deploy, so generateStaticParams would freeze the set at
 * whatever existed when the build ran. Routes are resolved on demand instead.
 */
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Not found | OrbitWorks" };

  // Canonical + absolute OG image URLs — relative ones are dropped by most
  // crawlers and social unfurlers.
  const base = postMetadata(post);

  // The per-post SEO block written in the dashboard overrides that default.
  // These fields were being stored and never rendered before this.
  return postSeoOverride(slug, base);
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const more = (await getPosts()).filter((p) => p.slug !== post.slug).slice(0, 3);


  // Author-written JSON-LD from the dashboard's SEO panel. Parsed and
  // re-serialised in postSchema(), so malformed JSON is dropped rather than
  // emitted as a broken script tag.
  const customSchema = await postSchema(slug);

  return (
    <main>
      <ArticleSchema post={post} />
      {customSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: customSchema }}
        />
      )}
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
          {/*
            Two shapes, one renderer. Posts from the database carry `html`
            written in the dashboard editor; the lib/content.ts fallback posts
            carry `body` as an array of paragraphs. The HTML is sanitised in
            lib/public-blogs.ts before it reaches this point — never render
            author-supplied markup that has not been through that allow-list.
          */}
          {post.html ? (
            <div
              className="orbit-post__body"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />
          ) : (
            <div className="orbit-post__body">
              {post.body.map((para, i) =>
                para.startsWith("## ") ? (
                  <h2 key={i}>{para.slice(3)}</h2>
                ) : (
                  <p key={i}>{para}</p>
                ),
              )}
            </div>
          )}
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
