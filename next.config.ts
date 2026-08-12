import type { NextConfig } from "next";

/**
 * Canonical host, without protocol. Keep in step with lib/site.ts.
 * Overridable so preview deployments don't redirect to production.
 */
const HOST = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://orb-itworks.com")
  .replace(/^https?:\/\//, "")
  .replace(/\/$/, "");

const nextConfig: NextConfig = {
  /**
   * 301 www -> non-www.
   *
   * The SEO audit flagged "the www and non-www versions of the URL are not
   * redirected to the same site". Left alone, Google can treat
   * www.orb-itworks.com and orb-itworks.com as two separate sites, splitting
   * link equity between them and contradicting our canonical tags.
   *
   * Non-www is the target because that is what SITE_URL, every canonical, the
   * sitemap and robots.txt already declare.
   */
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: `www.${HOST}` }],
        destination: `https://${HOST}/:path*`,
        permanent: true,
      },
    ];
  },

  /**
   * Long-lived caching for static media.
   *
   * Next serves everything in public/ with `Cache-Control: public, max-age=0`,
   * which means no reuse at all. On the homepage that made the hero loop
   * download TWICE in a single visit — once for SiteLoader's readiness probe
   * and once for the <video> element itself, 1.75MB wasted before a repeat
   * visitor is even considered.
   *
   * 30 days, not `immutable`: these filenames are not content-hashed, so a
   * replaced asset still needs to reach returning visitors within a sane
   * window. If you swap an image and need it live immediately, rename it.
   *
   * The trailing extension group is load-bearing. `/:dir(…|services)/:path*`
   * alone also matched the /services PAGE, so the HTML was served with a
   * 30-day cache: visitors and crawlers kept the first response they ever got,
   * and every SEO edit made in the dashboard appeared to be ignored. /services
   * was the only route affected, because it is the only page whose name
   * collides with a folder in public/. Matching on the asset extension keeps
   * the header on the files in public/services/ without ever touching a
   * document.
   */
  async headers() {
    return [
      {
        source:
          "/:dir(video|media|brand|services)/:path*.:ext(avif|gif|ico|jpeg|jpg|mp4|png|svg|webm|webp|woff|woff2)",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000" }],
      },
    ];
  },
};

export default nextConfig;
