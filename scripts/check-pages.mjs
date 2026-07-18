import { chromium } from "playwright";

/**
 * Drives every route at a spread of viewports and reports:
 *  - horizontal overflow (the failure mode that keeps biting this theme)
 *  - failed requests (dead links, missing assets)
 *  - page errors
 *
 * Clipped elements are ignored on purpose: a wide child inside an
 * overflow:hidden parent is by design (the marquee track is ~5000px). Only
 * report what a user could actually scroll to.
 *
 * Usage: npm run check:pages   (needs `npm start` running on :3311)
 */

const BASE = process.env.BASE ?? "http://localhost:3311";

const ROUTES = [
  "/",
  "/about",
  "/services",
  "/products",
  "/industries",
  "/case-studies",
  "/resources",
  "/blogs",
  "/blogs/seo-that-compounds",
  "/blogs/ppc-without-the-leak",
  "/blogs/genai-in-production",
  "/blogs/migrating-without-downtime",
  "/contact",
  "/legal",
];

const VIEWPORTS = [
  { name: "375", width: 375, height: 812 },
  { name: "834", width: 834, height: 1112 },
  { name: "1440", width: 1440, height: 900 },
];

const browser = await chromium.launch();
let failures = 0;

for (const route of ROUTES) {
  const line = [];
  const problems = [];

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    const bad = new Set();
    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e).split("\n")[0]));
    page.on("response", (r) => {
      if (r.status() >= 400) bad.add(`${r.status()} ${new URL(r.url()).pathname}`);
    });

    await page.goto(BASE + route, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2200);

    const report = await page.evaluate(() => {
      const doc = document.documentElement;
      const docW = doc.clientWidth;
      const isClipped = (el) => {
        let p = el.parentElement;
        while (p && p !== doc) {
          const ox = getComputedStyle(p).overflowX;
          if (ox === "hidden" || ox === "clip" || ox === "auto" || ox === "scroll") return true;
          p = p.parentElement;
        }
        return false;
      };
      const offenders = [];
      for (const el of document.querySelectorAll("body *")) {
        const r = el.getBoundingClientRect();
        if (!r.width && !r.height) continue;
        if (r.right - docW <= 1) continue;
        if (isClipped(el)) continue;
        offenders.push(
          `${el.tagName.toLowerCase()}.${(el.className || "").toString().trim().split(/\s+/)[0]}+${Math.round(r.right - docW)}`,
        );
      }
      return { overflow: doc.scrollWidth - docW, offenders: offenders.slice(0, 3) };
    });

    const ok = report.overflow <= 0;
    if (!ok) problems.push(`@${vp.name} overflow ${report.overflow}px  ${report.offenders.join(" ")}`);
    if (bad.size) problems.push(`@${vp.name} failed: ${[...bad].slice(0, 5).join(", ")}`);
    if (errors.length) problems.push(`@${vp.name} JS: ${errors.slice(0, 2).join(" | ")}`);

    line.push(`${vp.name}:${ok ? "ok" : report.overflow + "px"}`);
    await page.close();
  }

  const status = problems.length ? "FAIL" : "pass";
  if (problems.length) failures++;
  console.log(`  ${status.padEnd(4)} ${route.padEnd(14)} ${line.join("  ")}`);
  for (const p of problems) console.log(`         ${p}`);
}

await browser.close();
console.log(failures ? `\n${failures} route(s) with problems` : "\nall routes clean");
process.exit(failures ? 1 : 0);
