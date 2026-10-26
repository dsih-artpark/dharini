import React from "react";
import { ArrowRight } from "lucide-react";

import { AuthButton } from "./auth/auth-dialog-provider";
import { buttonClass } from "./button-styles";
import { JOURNEY, LINKS } from "./content";
import Cycle from "./cycle";
import { Container, Eyebrow, GRID_BACKDROP_CLASS } from "./ui";

export default function Hero() {
  return (
    <section className={`relative overflow-hidden ${GRID_BACKDROP_CLASS}`}>
      <Container className="grid items-center gap-12 pb-[72px] pt-11 sm:pt-14 min-[900px]:grid-cols-[1.05fr_1fr] min-[900px]:gap-16 min-[900px]:pt-20">
        <div>
          <Eyebrow>Active One Health surveillance</Eyebrow>
          <h1 className="mb-[30px] max-w-[7.4em] font-serif text-[length:clamp(46px,6.3vw,76px)] leading-[0.98] tracking-[-0.015em] text-landing-ink">
            From field samples to surveillance intelligence.
          </h1>
          <p className="mb-2.5 max-w-[520px] text-[17px] leading-[1.68] text-landing-muted">
            Dharini helps teams plan surveillance, digitise field sampling,
            track laboratory workflows and understand disease risk across
            animals and the environment.
          </p>
          <p className="mb-7 max-w-[540px] text-[14.5px] leading-normal text-landing-muted sm:mb-[34px]">
            Plan projects. Collect samples. Track laboratory workflows.
            Understand where risk is emerging.
          </p>
          <div className="flex flex-wrap gap-3">
            <AuthButton mode="signup" className={buttonClass({ size: "lg" })}>
              Get Started <ArrowRight size={16} strokeWidth={2.2} />
            </AuthButton>
            <a
              href={LINKS.userGuide}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass({ variant: "ghost", size: "lg" })}
            >
              See how it works
            </a>
          </div>
        </div>
        <div className="flex justify-center">
          <Cycle />
        </div>
      </Container>
      <Container>
        <ol className="flex flex-wrap gap-x-2.5 gap-y-2 border-t border-[#dcd6ef] pb-5 pt-[18px] text-[13px] text-[#5d5b78]">
          {JOURNEY.map((step, i) => {
            const isLast = i === JOURNEY.length - 1;
            return (
              <li
                key={step}
                className={`inline-flex items-center gap-2.5 ${isLast ? "font-semibold text-landing-purple" : ""
                  }`}
              >
                {step}
                {!isLast && (
                  <ArrowRight
                    size={13}
                    strokeWidth={2}
                    className="text-[#9b8cf0]"
                  />
                )}
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
