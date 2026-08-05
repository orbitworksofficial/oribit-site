import { SITE_URL } from "@/lib/site";
import type { PublicPost } from "@/lib/public-blogs";

/**
 * Article + BreadcrumbList JSON-LD for a blog post.
 *
 * Article makes the post eligible for rich results and Discover; the breadcrumb
 * replaces the raw URL in the SERP with a Home › Blog › Post trail. Both
 * reference the site Organization by @id (emitted in StructuredData) rather than
 * repeating the publisher details.
 */
export default function ArticleSchema({ post }: { post: PublicPost }) {
  const url = `${SITE_URL}/blogs/${post.slug}`;

  /**
   * Word count from whichever body shape the post carries.
   *
   * Posts from the database store their content as HTML in `html` and leave
   * `body` empty, so the previous `post.body.join(" ")` reported wordCount 1 for
   * every post once the blog moved to MongoDB. Tags are stripped before
   * counting so markup is not counted as words.
   */
  const text = post.html
    ? post.html.replace(/<[^>]*>/g, " ")
    : post.body.join(" ");
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  const graph = [
    {
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      dateModified: post.date,
      author: { "@type": "Organization", name: post.author, url: SITE_URL },
      publisher: { "@id": `${SITE_URL}/#organization` },
      image: [`${SITE_URL}${post.image}`],
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      articleSection: post.kind,
      wordCount,
      inLanguage: "en-US",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blogs` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
      }}
    />
  );
}
