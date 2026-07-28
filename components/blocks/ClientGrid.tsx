import { TESTIMONIALS } from "@/lib/content";
import ClientLogo from "./ClientLogo";

/**
 * Homepage client section — tiles showing who we work with (logo or monogram,
 * name, sector). Drawn from the testimonial set so names stay in sync with the
 * quotes below.
 */
export default function ClientGrid() {
  return (
    <ul className="orbit-clients">
      {TESTIMONIALS.map((t) => (
        <li key={t.client} className="orbit-client">
          <ClientLogo name={t.client} logo={t.logo} className="orbit-client__logo" />
          <span className="orbit-client__body">
            <strong className="orbit-client__name">{t.client}</strong>
            <span className="orbit-client__sector">{t.sector}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
