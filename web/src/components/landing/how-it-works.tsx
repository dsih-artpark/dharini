import React from "react";
import Image from "next/image";
import { Dna, FlaskConical, MapPin, Smartphone, WifiOff } from "lucide-react";

import { IMAGE_BASE } from "./content";
import { Container, SECTION_CLASS, SectionHeading } from "./ui";

const CARD_CLASS = "flex min-h-[292px] overflow-hidden rounded-lg";
const CARD_HEAD_CLASS = "flex items-center gap-3 px-4 pb-3.5 pt-4";
const CARD_TITLE_CLASS = "font-serif text-[19px] leading-[1.25]";
const MEDIA_CLASS =
  "mx-[13px] mb-[13px] mt-auto h-[230px] flex-1 overflow-hidden rounded-sm bg-[#eceaf3] sm:h-[272px]";
const MEDIA_IMAGE_CLASS = "size-full object-cover";

const TILE_TONES = {
  lav: "bg-landing-purple-100 text-landing-purple",
  mint: "bg-landing-mint text-landing-mint-ink",
  dark: "bg-[#2d2b52] text-landing-yellow",
  glass: "bg-[#ffffff2e] text-white",
};

function IconTile({
  tone,
  children,
}: {
  tone: keyof typeof TILE_TONES;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`grid size-[30px] flex-none place-items-center rounded-[7px] ${TILE_TONES[tone]}`}
    >
      {children}
    </span>
  );
}

export default function HowItWorks() {
  return (
    <section className={`bg-landing-page ${SECTION_CLASS}`} id="how-it-works">
      <Container>
        <SectionHeading
          eyebrow="How does it work?"
          title="Your whole surveillance workflow in one connected system"
          intro="Five stages, one continuous record. Nothing is re-entered, and nothing is lost between the field and the result."
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <article
            className={`${CARD_CLASS} flex-col border border-landing-border bg-white`}
          >
            <header className={CARD_HEAD_CLASS}>
              <IconTile tone="lav">
                <MapPin size={16} strokeWidth={2} />
              </IconTile>
              <h3 className={`${CARD_TITLE_CLASS} text-landing-ink`}>
                Plan the surveillance
              </h3>
            </header>
            <div className={`${MEDIA_CLASS} border border-landing-border`}>
              <Image
                src={`${IMAGE_BASE}/plan-site.webp`}
                width={780}
                height={440}
                alt="Site address and map preview in Dharini"
                className={`${MEDIA_IMAGE_CLASS} object-left-top`}
              />
            </div>
          </article>

          <article
            className={`${CARD_CLASS} min-h-[300px] flex-row gap-3.5 bg-landing-purple pl-4 pr-3 pt-3 text-white sm:min-h-[292px]`}
          >
            <div className="flex-none basis-[34%] pt-1">
              <div className="mb-3.5 flex items-center gap-2.5">
                <IconTile tone="glass">
                  <Smartphone size={16} strokeWidth={2} />
                </IconTile>
                <span className="inline-flex items-center gap-[5px] rounded-full bg-[#ffffff38] px-[9px] py-1 text-[10px] font-bold tracking-[0.04em]">
                  <WifiOff size={11} strokeWidth={2.4} /> OFFLINE
                </span>
              </div>
              <h3 className={`${CARD_TITLE_CLASS} mb-[5px] text-white`}>
                Collect in the field
              </h3>
            </div>
            <div className="h-80 flex-1 self-end overflow-hidden rounded-t-[14px] bg-white shadow-[0_16px_30px_-12px_#140a5080] sm:h-[332px]">
              <Image
                src={`${IMAGE_BASE}/collect-phone.webp`}
                width={309}
                height={686}
                alt="Clinical sample selection screen on the Dharini mobile app"
                className={`${MEDIA_IMAGE_CLASS} object-top`}
              />
            </div>
          </article>

          <article
            className={`${CARD_CLASS} flex-col border border-landing-border bg-white`}
          >
            <header className={CARD_HEAD_CLASS}>
              <IconTile tone="mint">
                <FlaskConical size={16} strokeWidth={2} />
              </IconTile>
              <h3 className={`${CARD_TITLE_CLASS} text-landing-ink`}>
                Track through the lab
              </h3>
            </header>
            <div className={MEDIA_CLASS}>
              <Image
                src={`${IMAGE_BASE}/lab-photo.webp`}
                width={1280}
                height={576}
                alt="Laboratory scientist processing samples at a biosafety cabinet"
                className={`${MEDIA_IMAGE_CLASS} object-center`}
              />
            </div>
          </article>

          <article
            className={`${CARD_CLASS} flex-col bg-landing-navy text-white`}
          >
            <header className={CARD_HEAD_CLASS}>
              <IconTile tone="dark">
                <Dna size={16} strokeWidth={2} />
              </IconTile>
              <h3 className={`${CARD_TITLE_CLASS} text-white`}>
                Connect the signals
              </h3>
            </header>
            <div className={MEDIA_CLASS}>
              <Image
                src={`${IMAGE_BASE}/signals-map.webp`}
                width={1321}
                height={588}
                alt="Buffer and proximity analysis map comparing bird density, wetlands and poultry farms around a site"
                className={`${MEDIA_IMAGE_CLASS} object-left-top`}
              />
            </div>
          </article>
        </div>
      </Container>
    </section>
  );
}
