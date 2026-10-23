import React from "react";
import Image from "next/image";

import { IMAGE_BASE, PARTNERS } from "./content";
import { Container, SECTION_CLASS, SectionHeading } from "./ui";

// The logo strip scrolls by animating two identical groups; the second is
// decorative, so it is hidden from assistive tech (and from users who prefer
// reduced motion, who get a plain scrollable row instead).
function PartnerGroup({ decorative }: { decorative?: boolean }) {
  return (
    <ul
      className="flex items-center gap-7 px-6 sm:gap-12 motion-reduce:[&[aria-hidden]]:hidden"
      aria-hidden={decorative || undefined}
    >
      {PARTNERS.map((p) => (
        <li
          key={p.short}
          title={p.name}
          className="flex h-[100px] min-w-[110px] flex-none flex-col items-center justify-between gap-3 px-2.5 py-1.5 transition-transform duration-[180ms] hover:-translate-y-0.5 sm:h-[120px] sm:min-w-[150px] sm:px-5 sm:py-2"
        >
          <Image
            src={`${IMAGE_BASE}/partners/${p.logo}.webp`}
            width={p.w}
            height={p.h}
            alt={decorative ? "" : `${p.name} logo`}
            className="h-[58px] w-auto max-w-[260px] object-contain sm:h-[76px] sm:max-w-[340px]"
          />
          <span className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-landing-muted-2">
            {p.short}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function Partners() {
  return (
    <section
      className={`border-t border-[#e6e1f7] bg-landing-lav ${SECTION_CLASS}`}
      id="partners"
    >
      <Container>
        <SectionHeading
          eyebrow="Our partners"
          title="Built with India’s leading research institutes"
          intro="Dharini is developed with laboratories, research centres and animal-health institutes that run surveillance on the ground."
        />
      </Container>
      <div
        className="group relative overflow-hidden pb-3 pt-2 [mask-image:linear-gradient(90deg,transparent_0,#000_9%,#000_91%,transparent_100%)] motion-reduce:overflow-x-auto motion-reduce:[mask-image:none]"
        aria-label="Partner institutes"
      >
        <div className="flex w-max animate-landing-marquee group-focus-within:[animation-play-state:paused] group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          <PartnerGroup />
          <PartnerGroup decorative />
        </div>
      </div>
    </section>
  );
}
