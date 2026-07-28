import type { Metadata } from "next";
import Link from "next/link";

import PageHero from "@/components/blocks/PageHero";
import { BLOGS } from "@/lib/content";
import { chromeFor } from "@/lib/routes";
import { formatPostDate } from "@/lib/dates";

const chrome = chromeFor("/blogs");
export const metadata: Metadata = { title: chrome.title, description: chrome.description };

export default function Blogs() {
  const [lead, ...rest] = BLOGS;

  return (
    <main>
      <PageHero
        chip="Notes from the delivery floor"
        icon="blog"
        title="Insights on AI, cloud & growth"
        lead="Short pieces on digital marketing, AI, cloud and shipping software — written by the people doing the work, not a content team."
        ctas={[
          { label: "Talk to our team", href: "/contact" },
          { label: "Explore Our Services", href: "/services", ghost: true },
        ]}
        proof={["Written by practitioners", "No gated PDFs", "Updated monthly"]}
        image="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1800&q=70"
      />

      {/* Lead post gets the wide treatment; the rest run as a grid. */}
      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12"
        data-transition="slideup"
      >
        <Link href={`/blogs/${lead.slug}`} className="orbit-card orbit-card--lead">
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lead.image} alt="" loading="eager" decoding="async" />
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
                  <img src={post.image} alt="" loading="lazy" decoding="async" />
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
    </main>
  );
}
