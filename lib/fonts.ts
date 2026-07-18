import localFont from "next/font/local";

/**
 * The real PP Mori, self-hosted. The theme's own @font-face blocks were stripped
 * when theme.css was ported; next/font owns the faces now and publishes the
 * family as --font-sans, which is what every rule in theme.css resolves to.
 *
 * Weight names map to the theme's numeric scale:
 *   Extralight 100 · Light 200 · Book 300 · Regular 400
 *   Medium 500 · SemiBold 600 · Bold 700
 * Body copy is weight 300 (Book) — the theme leans on it heavily, so keep it.
 */
export const ppMori = localFont({
  src: [
    { path: "../public/theme/fonts/PPMori-Extralight.woff2", weight: "100", style: "normal" },
    { path: "../public/theme/fonts/PPMori-ExtralightItalic.woff2", weight: "100", style: "italic" },
    { path: "../public/theme/fonts/PPMori-Light.woff2", weight: "200", style: "normal" },
    { path: "../public/theme/fonts/PPMori-LightItalic.woff2", weight: "200", style: "italic" },
    { path: "../public/theme/fonts/PPMori-Book.woff2", weight: "300", style: "normal" },
    { path: "../public/theme/fonts/PPMori-BookItalic.woff2", weight: "300", style: "italic" },
    { path: "../public/theme/fonts/PPMori-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/theme/fonts/PPMori-RegularItalic.woff2", weight: "400", style: "italic" },
    { path: "../public/theme/fonts/PPMori-Medium.woff2", weight: "500", style: "normal" },
    { path: "../public/theme/fonts/PPMori-MediumItalic.woff2", weight: "500", style: "italic" },
    { path: "../public/theme/fonts/PPMori-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../public/theme/fonts/PPMori-SemiBoldItalic.woff2", weight: "600", style: "italic" },
    { path: "../public/theme/fonts/PPMori-Bold.woff2", weight: "700", style: "normal" },
    { path: "../public/theme/fonts/PPMori-BoldItalic.woff2", weight: "700", style: "italic" },
  ],
  display: "swap",
  variable: "--font-sans",
  fallback: ["sans-serif"],
});
