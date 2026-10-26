import React from "react";

import { Logo } from "./logo";

// Page frame shared by the landing page and the privacy policy. Everything
// inside inherits the landing typography and colour.
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-landing-page font-sans leading-normal text-landing-ink antialiased motion-reduce:[&_*]:!transition-none">
      {children}
    </div>
  );
}

export function Container({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1320px] px-4 sm:px-6 ${className}`}>
      {children}
    </div>
  );
}

export function SiteHeader({ children }: { children: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#e8e5f3] bg-[#fffffff5] backdrop-blur-[8px] backdrop-saturate-[1.4]">
      <Container className="flex h-16 items-center justify-between">
        <Logo href="/" />
        {children}
      </Container>
    </header>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-[18px] font-mono text-[11.5px] uppercase tracking-[0.06em] text-landing-purple">
      {children}
    </p>
  );
}

export const H2_CLASS =
  "font-serif text-[length:clamp(34px,4.2vw,48px)] leading-[1.14] tracking-[-0.01em] text-landing-ink";

export const GRID_BACKDROP_CLASS =
  "border-b border-[#e3def5] bg-landing-lav bg-landing-grid bg-[length:64px_64px] bg-[position:-16px_-1px]";

export const SECTION_CLASS = "py-[72px] sm:py-[104px]";

// Eyebrow + title on the left, a short intro on the right (stacked on mobile).
export function SectionHeading({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro: string;
}) {
  return (
    <div className="mb-11 grid items-end gap-x-[60px] gap-y-8 min-[900px]:grid-cols-[minmax(0,640px)_minmax(0,520px)] min-[900px]:justify-between">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className={`${H2_CLASS} max-w-[560px]`}>{title}</h2>
      </div>
      <p className="pb-2 text-base leading-[1.75] text-landing-muted">
        {intro}
      </p>
    </div>
  );
}
