import React from "react";
import Image from "next/image";
import { Monitor, RefreshCw, Smartphone } from "lucide-react";

import { buttonClass } from "./button-styles";
import { IMAGE_BASE } from "./content";
import { mobileAppLinks } from "./mobile-app-links";
import { Container, Eyebrow, H2_CLASS, SECTION_CLASS } from "./ui";

const BODY_CLASS =
  "mb-4 max-w-[520px] text-[15.5px] leading-[1.75] text-landing-muted";

// Desktop monitor and phone drawn from plain boxes; sizes are percentages of
// the stage so the whole illustration scales together.
function DeviceStage() {
  return (
    <div
      className="relative isolate aspect-[1.12] w-full"
      role="img"
      aria-label="Dharini on a desktop showing the Projects dashboard, and on a phone showing clinical sample collection"
    >
      <div
        className="absolute -z-10 bottom-[6%] left-[6%] right-[4%] top-[8%] rounded-full bg-[radial-gradient(closest-side,#6c47ff29,#6c47ff00)] blur-[8px]"
        aria-hidden="true"
      />

      <div className="absolute left-0 top-[4%] w-[90%]">
        <div className="rounded-t-[9px] bg-[#0e0d1f] px-[2.2%] pt-[2.2%] shadow-[0_30px_60px_-28px_#15143a8c] sm:rounded-t-[14px]">
          <Image
            src={`${IMAGE_BASE}/desktop-projects.webp`}
            width={1624}
            height={958}
            alt=""
            className="aspect-[1624/958] w-full rounded-t-[3px] object-cover object-left-top"
          />
        </div>
        <div className="h-0 rounded-b-[9px] bg-gradient-to-b from-[#e9e8ef] to-[#cfcdd8] pb-[5%] shadow-[0_18px_30px_-18px_#15143a73] sm:rounded-b-[14px]" />
        <div className="mx-auto w-[16%] bg-[linear-gradient(90deg,#c9c7d3,#eeedf3_45%,#c3c1cd)] pb-[9%] [clip-path:polygon(8%_0,92%_0,100%_100%,0_100%)]" />
        <div className="mx-auto w-[34%] rounded-[6px_6px_3px_3px] bg-gradient-to-b from-[#f1f0f5] to-[#c9c7d3] pb-[2.2%] shadow-[0_10px_18px_-8px_#15143a59]" />
      </div>

      <div className="absolute bottom-[2%] right-0 w-[27%] rounded-[18px] bg-[#121124] p-[2.2%] shadow-[inset_0_0_0_1px_#ffffff0f,0_28px_50px_-18px_#15143a99] sm:rounded-[26px]">
        <div className="absolute left-1/2 top-[3.4%] z-[1] h-[1.8%] w-[22%] -translate-x-1/2 rounded-full bg-[#121124]" />
        <div className="overflow-hidden rounded-[13px] bg-white sm:rounded-[19px]">
          <Image
            src={`${IMAGE_BASE}/collect-phone.webp`}
            width={309}
            height={686}
            alt=""
            className="aspect-[309/640] w-full object-cover object-top"
          />
        </div>
      </div>

      <div
        className="absolute bottom-[6%] right-[24%] inline-flex items-center gap-[7px] whitespace-nowrap rounded-full bg-white px-2.5 py-1.5 text-[11px] font-semibold text-landing-ink shadow-[0_12px_26px_-10px_#15143a59,0_0_0_1px_#6c47ff1f] sm:bottom-[13%] sm:right-[22%] sm:px-[13px] sm:py-2 sm:text-[12.5px]"
        aria-hidden="true"
      >
        <RefreshCw
          size={13}
          strokeWidth={2.2}
          className="text-landing-purple"
        />{" "}
        Same record, synced
      </div>
    </div>
  );
}

export default function Devices() {
  const appLinks = mobileAppLinks();

  return (
    <section className={`bg-white ${SECTION_CLASS}`}>
      <Container className="grid items-center gap-9 min-[900px]:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] min-[900px]:gap-20">
        <DeviceStage />

        <div>
          <Eyebrow>One record, every device</Eyebrow>
          <h2 className={`${H2_CLASS} mb-[26px] max-w-[420px]`}>
            Plan on a desktop, collect on a phone
          </h2>
          <p className={BODY_CLASS}>
            Whether a coordinator is planning a project, a field team is
            collecting a sample, or a laboratory is reporting a result, the
            record stays the same one, wherever it&rsquo;s opened.
          </p>
          <p className={BODY_CLASS}>
            No more re-typing what the field already recorded. No more results
            that arrive separately from the site they came from.
          </p>
          <ul className="mb-7 mt-[26px] flex gap-[22px] text-sm text-landing-ink-2">
            <li className="inline-flex items-center gap-2">
              <Monitor
                size={15}
                strokeWidth={2}
                className="text-landing-purple"
              />{" "}
              Desktop
            </li>
            <li className="inline-flex items-center gap-2">
              <Smartphone
                size={15}
                strokeWidth={2}
                className="text-landing-purple"
              />{" "}
              Mobile
            </li>
          </ul>
          {appLinks.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {appLinks.map(({ href, label, Icon }, i) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClass({
                    variant: i === 0 ? "primary" : "ghost",
                  })}
                >
                  <Icon size={15} strokeWidth={2.2} /> {label}
                </a>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
