import React from "react";
import Link from "next/link";

import { LINKS } from "./content";
import { Logo } from "./logo";
import { Container } from "./ui";

const FOOTER_LINK_CLASS = "transition-colors hover:text-white";

export default function Footer() {
  return (
    <footer className="bg-landing-navy-2 py-9 text-[#ffffffb3]">
      <Container className="flex flex-wrap items-center justify-between gap-x-8 gap-y-[18px]">
        <Logo tone="light" />
        <nav className="flex gap-[26px] text-sm" aria-label="Footer">
          <a
            href={LINKS.userGuide}
            target="_blank"
            rel="noopener noreferrer"
            className={FOOTER_LINK_CLASS}
          >
            User guide
          </a>
          <Link href="/privacy" className={FOOTER_LINK_CLASS}>
            Privacy Policy
          </Link>
          <a
            href={LINKS.terms}
            target="_blank"
            rel="noopener noreferrer"
            className={FOOTER_LINK_CLASS}
          >
            Terms of Use
          </a>
        </nav>
        <p className="text-[13px] text-[#ffffff80]">
          © {new Date().getFullYear()} Dharini · An ARTPARK and NCBS-TIFR
          product
        </p>
      </Container>
    </footer>
  );
}
