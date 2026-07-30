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
};

export default nextConfig;
