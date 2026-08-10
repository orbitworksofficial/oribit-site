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
        {/*
          One grid for the whole article, so the sidebar starts level with the
          title rather than halfway down the page. Previously the header, hero
          and body were three separate full-width blocks and the sidebar lived
          inside the last of them — which is why it began below the fold.
        */}
        <div
          className="wp-block-kenza-column-constraint column-constraint cols-12 orbit-post__layout"
          data-transition="slideup"
          data-transition-include="through"
        >
          <div className="orbit-post__main">
          <header className="orbit-post__head">
            <p className="label orbit-post__meta">
              <Link href="/blogs">Blog</Link>
              <span aria-hidden="true"> · </span>
              {post.kind}
              <span aria-hidden="true"> · </span>
              {post.readingMinutes} min read
            </p>

            <h1 className="wp-block-heading orbit-post__title">{post.title}</h1>

            {/*
              Own class rather than the theme's `large-intro`, whose line-height
              is tuned for a two-line marketing strapline — a three-line excerpt
              rendered with a visible gap between every line.
            */}
            <p className="orbit-post__lead">{post.excerpt}</p>

            <p className="label small orbit-post__byline">
              {post.author}
              <span aria-hidden="true"> · </span>
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            </p>
          </header>

          {/* No hero at all rather than an empty <img>, which renders as a broken
              icon and alt text where a picture should be. */}
          {post.image && (
            <figure className="orbit-post__hero">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.image} alt={post.title} loading="eager" decoding="async" />
            </figure>
          )}

          {/*
            Two shapes, one renderer. Posts from the database carry `html`
            written in the dashboard editor; the lib/content.ts fallback posts
            carry `body` as an array of paragraphs. The HTML is sanitised in
            lib/public-blogs.ts before it reaches this point — never render
            author-supplied markup that has not been through that allow-list.
          */}
          {post.html ? (
            <>
              {/*
                Contents list. Shown only when there is enough structure to be
                worth one — on a two-heading post it is noise, not navigation.
                Plain anchors, so it works without JavaScript and each entry is
                a real shareable URL.
              */}
              {/*
                Always open, and scrollable rather than collapsed. A 45-heading
                post used to render 1,594px of links before the article, so this
                was a <details>; but a contents list nobody can see is not doing
                its job. Capped height with its own scroll keeps it short without
                hiding it, and the numbering makes each row obviously clickable.
              */}
              {post.headings && post.headings.length >= 3 && (
                <nav className="orbit-toc" aria-labelledby="orbit-toc-title">
                  <p className="orbit-toc__title" id="orbit-toc-title">
                    <span className="orbit-toc__eyebrow">In this article</span>
                    <span className="orbit-toc__lead">
                      Jump to any section
                    </span>
                    <span className="orbit-toc__count">
                      {post.headings.length} sections · {post.readingMinutes} min
                    </span>
                  </p>
                  <ol className={post.headings.length > 12 ? "is-scrollable" : undefined}>
                    {post.headings.map((h) => (
                      <li key={h.id} data-level={h.level}>
                        <a href={`#${h.id}`}>
                          <span className="orbit-toc__arrow" aria-hidden="true" />
                          <span className="orbit-toc__text">{h.text}</span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}

              <div
                className="orbit-post__body"
                dangerouslySetInnerHTML={{ __html: post.html }}
              />
            </>
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

          {/*
            Sidebar. The reading column is capped at 68ch for legibility, which
            left ~470px of dead space on a wide screen. This fills it with
            somewhere to go next rather than widening the text past a
            comfortable measure.

            Sticky, so it stays with the reader down a long article, and hidden
            below 1200px where there is no room for a second column.
          */}
          {more.length > 0 && (
            <aside className="orbit-aside" aria-label="More posts">
              <div className="orbit-aside__inner">
                <p className="orbit-aside__title">Recent posts</p>
                <ul className="orbit-aside__list">
                  {more.map((r) => (
                    <li key={r.slug}>
                      <Link href={`/blogs/${r.slug}`}>
                        {r.image && (
                          <span className="orbit-aside__thumb">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={r.image} alt="" loading="lazy" decoding="async" />
                          </span>
                        )}
                        <span className="orbit-aside__text">
                          <span className="orbit-aside__kind">{r.kind}</span>
                          <span className="orbit-aside__name">{r.title}</span>
                          <span className="orbit-aside__meta">{r.readingMinutes} min read</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>

                <Link href="/blogs" className="orbit-aside__all">
                  All posts
                  <span aria-hidden="true"> →</span>
                </Link>
              </div>
            </aside>
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
                {p.image && (
                  <figure>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt={p.title} loading="lazy" decoding="async" />
                  </figure>
                )}
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
