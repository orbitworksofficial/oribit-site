import type { Metadata } from "next";
import Link from "next/link";

import PageHero from "@/components/blocks/PageHero";
import { getPosts } from "@/lib/public-blogs";
import { pageMetadataFromDb } from "@/lib/page-seo";
import { formatPostDate } from "@/lib/dates";

/**
 * Editable from the dashboard (Page SEO -> /blogs), falling back to the
 * hardcoded copy in lib/routes.ts when no override is set.
 */
export async function generateMetadata(): Promise<Metadata> {
  return pageMetadataFromDb("/blogs");
}

export default async function Blogs() {
  const [lead, ...rest] = await getPosts();

  return (
    <main>
      <PageHero
        chip="Notes from the delivery floor"
        icon="blog"
        title="Insights on AI, cloud & growth"
        lead="Short pieces on digital marketing, AI, cloud and shipping software, written by the people doing the work, not a content team."
        ctas={[
          { label: "Talk to our team", href: "/contact" },
          { label: "Explore Our Services", href: "/services", ghost: true },
        ]}
        proof={["Written by practitioners", "No gated PDFs", "Updated monthly"]}
        image="https://images.unsplash.com/photo-1644088379091-d574269d422f?q=80&w=1993&auto=format&fit=crop&w=1800&q=70&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />

      {/* Lead post gets the wide treatment; the rest run as a grid. */}
      {/*
        Guarded because the post list is no longer a hardcoded array: an admin
        can unpublish everything, and `lead.slug` on an empty list would take
        the whole page down with a runtime error.
      */}
      {!lead ? (
        <div
          className="wp-block-kenza-column-constraint column-constraint cols-12"
          data-transition="slideup"
        >
          <p className="orbit-lead">
            No posts published yet. Check back shortly.
          </p>
        </div>
      ) : (
      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12"
        data-transition="slideup"
      >
        <Link href={`/blogs/${lead.slug}`} className="orbit-card orbit-card--lead">
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lead.image} alt={lead.title} loading="eager" decoding="async" />
          </figure>
          <div>
            <span className="label">
              {lead.kind} · {lead.readingMinutes} min read
            </span>
            <h2>{lead.title}</h2>
            <p>{lead.excerpt}</p>
            <time dateTime={lead.date} className="label small">
              {formatPostDate(lead.date)}
            </time>
          </div>
        </Link>

        <ul className="orbit-cards">
          {rest.map((post) => (
            <li key={post.slug}>
              <Link href={`/blogs/${post.slug}`} className="orbit-card">
                <figure>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.image} alt={post.title} loading="lazy" decoding="async" />
                </figure>
                <span className="label">
                  {post.kind} · {post.readingMinutes} min read
                </span>
                <h3>{post.title}</h3>
                <p className="orbit-card__excerpt">{post.excerpt}</p>
                <time dateTime={post.date} className="label small">
                  {formatPostDate(post.date)}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      )}
    </main>
  );
}
