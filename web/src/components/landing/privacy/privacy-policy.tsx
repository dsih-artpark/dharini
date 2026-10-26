import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import Footer from "../footer";
import {
  Container,
  Eyebrow,
  GRID_BACKDROP_CLASS,
  H2_CLASS,
  PageShell,
  SiteHeader,
} from "../ui";
import { POLICY_PROSE_CLASS } from "./policy-ui";
import { POLICY_SECTIONS } from "./sections";

export const POLICY_LAST_UPDATED = "Oct 26, 2026";

export default function PrivacyPolicy() {
  return (
    <PageShell>
      <SiteHeader>
        <Link
          href="/"
          className="inline-flex items-center gap-[5px] text-[14.5px] text-[#56546f] transition-colors hover:text-landing-ink"
        >
          <ArrowLeft size={15} strokeWidth={2} /> Back to home
        </Link>
      </SiteHeader>

      <main>
        <section
          className={`${GRID_BACKDROP_CLASS} pb-10 pt-12 sm:pb-14 sm:pt-[72px]`}
        >
          <Container>
            {/* <Eyebrow>Legal</Eyebrow> */}
            <h1 className={H2_CLASS}>Dharini Privacy Policy</h1>
            <p className="mt-3.5 text-sm text-landing-muted">
              Last updated: {POLICY_LAST_UPDATED}
            </p>
          </Container>
        </section>

        <Container className="grid gap-8 pb-24 pt-9 min-[900px]:grid-cols-[240px_minmax(0,1fr)] min-[900px]:gap-14 min-[900px]:pt-14">
          <nav
            className="min-[900px]:sticky min-[900px]:top-[88px] min-[900px]:self-start"
            aria-label="On this page"
          >
            <p className="mb-3 font-mono text-[11.5px] uppercase tracking-[0.06em] text-landing-purple">
              On this page
            </p>
            <ol className="grid gap-0.5 border-l border-landing-border">
              {POLICY_SECTIONS.map(({ id, title }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="block py-1.5 pl-3.5 text-[13.5px] text-landing-muted transition-colors hover:text-landing-purple"
                  >
                    {title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className={POLICY_PROSE_CLASS}>
            {POLICY_SECTIONS.map(({ id, Component }) => (
              <Component key={id} />
            ))}
          </article>
        </Container>
      </main>

      <Footer />
    </PageShell>
  );
}
