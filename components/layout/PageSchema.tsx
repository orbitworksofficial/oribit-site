import { pageSchema } from "@/lib/page-seo";

/**
 * Renders the JSON-LD block written for a route in the dashboard's Page SEO
 * screen, if there is one.
 *
 * A separate async component so the root layout does not have to await a
 * database read on every render — Next streams this in independently, and a
 * route with no stored schema costs a cached lookup that returns null.
 */
export default async function PageSchema({ path }: { path: string }) {
  const json = await pageSchema(path);
  if (!json) return null;

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
