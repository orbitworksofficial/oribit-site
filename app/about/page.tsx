import type { Metadata } from "next";
import Link from "next/link";

import PageHeader from "@/components/blocks/PageHeader";
import Stats from "@/components/blocks/Stats";
import TeamGrid from "@/components/blocks/TeamGrid";
import TextMarquee from "@/components/blocks/TextMarquee";
import { CLIENTS, OFFICES } from "@/lib/content";
import { chromeFor } from "@/lib/routes";

const chrome = chromeFor("/about");
export const metadata: Metadata = { title: chrome.title, description: chrome.description };

export default function About() {
  return (
    <main>
      <PageHeader
        title="About"
        lead="Crafting solutions with purpose."
        intro="OrbitWorks is a delivery team, not a layer of account management. Fifty specialists across four offices, working with clients in more than ten countries — cloud, software, data, AI and digital marketing under one roof."
      />

      <Stats />

      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12"
        data-transition="slideup"
        data-transition-include="through"
      >
        <h2 className="wp-block-heading deco-l mobile">How we work</h2>
        <h3 className="wp-block-heading book mobilexl shorten">
          Strategy is only worth what it ships. So the people who plan the work are the people who
          build it.
        </h3>
        <ul className="wp-block-list block-list" data-transition-include="through">
          <li>One team from roadmap to release</li>
          <li>Senior people on the actual work</li>
          <li>Handover you can maintain without us</li>
          <li>Numbers agreed before the spend</li>
        </ul>
      </div>

      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12"
        data-transition="slideup"
        data-transition-include="through"
      >
        <h2 className="wp-block-heading deco-l mobile">Leadership</h2>
        <TeamGrid />
        <p className="has-text-align-left small wp-block-paragraph">
          Alongside specialists in software engineering, data analysis, digital marketing and SEO.
        </p>
      </div>

      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12"
        data-transition="slideup"
        data-transition-include="through"
      >
        <h2 className="wp-block-heading deco-l mobile">Offices</h2>
        <ul className="orbit-list">
          {OFFICES.map((o) => (
            <li key={o.country}>
              <strong>
                {o.city}, {o.country}
              </strong>
              <span>{o.address}</span>
            </li>
          ))}
        </ul>
        <p className="k-center">
          <Link href="/contact" className="squarearrowonleft">
            Get in touch
          </Link>
        </p>
      </div>

      <TextMarquee items={CLIENTS} />
    </main>
  );
}
