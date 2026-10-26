"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowDownLeft,
  ArrowDownRight,
  ArrowUpLeft,
  ArrowUpRight,
  Dna,
  FlaskConical,
  MapPin,
  TestTubeDiagonal,
} from "lucide-react";

import { useAuthDialog } from "./auth/auth-dialog-provider";
import { IMAGE_BASE } from "./content";

// Sizes inside the diagram are in `cqw` (1% of the diagram's own width), so it
// scales as one picture at any container width.
const CYCLE_NODES = [
  {
    id: "field",
    title: "Field collection",
    sub: "GPS + sample ID",
    Icon: MapPin,
    img: "node-field.webp",
    position: "left-[34.55%] top-[0.9%]",
    imgClass: "",
    labelClass: "bottom-[12%]",
  },
  {
    id: "lab",
    title: "Laboratory",
    sub: "Receive + test",
    Icon: FlaskConical,
    img: "node-lab.webp",
    position: "left-[67.9%] top-[34.55%]",
    imgClass: "scale-[1.08]",
    labelClass: "bottom-[12%]",
  },
  {
    id: "genomic",
    title: "Genomic surveillance",
    sub: "Variants + alerts",
    Icon: Dna,
    img: "node-genomic.webp",
    position: "left-[34.55%] top-[68.6%]",
    imgClass: "scale-[1.08]",
    labelClass: "bottom-[9%]",
  },
  {
    id: "analysis",
    title: "Analysis",
    sub: "Results + context",
    Icon: TestTubeDiagonal,
    img: "node-analysis.webp",
    position: "left-[1.2%] top-[34.55%]",
    imgClass: "scale-[1.08]",
    labelClass: "bottom-[12%]",
  },
];

const CYCLE_CONNECTORS = [
  {
    id: "top-right",
    position: "left-[67.2%] top-[20.3%]",
    Icon: ArrowDownRight,
  },
  {
    id: "bottom-right",
    position: "left-[82.8%] top-[66.8%]",
    Icon: ArrowDownLeft,
  },
  { id: "bottom-left", position: "left-[33%] top-[82.7%]", Icon: ArrowUpLeft },
  { id: "top-left", position: "left-[14.9%] top-[32.2%]", Icon: ArrowUpRight },
];

const ROTATE_EVERY_MS = 2800;

export default function Cycle() {
  const [active, setActive] = useState(2);
  const rootRef = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const { isAuthOpen } = useAuthDialog();

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) =>
      setOnScreen(entry.isIntersecting),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const update = () => setTabVisible(document.visibilityState === "visible");
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  // Follow the setting live: it can change while the page is open.
  useEffect(() => {
    const query = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!query) return;
    setReducedMotion(query.matches);
    const update = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // Only rotate while someone can see it: not off-screen, in a hidden tab,
  // behind the auth dialog, or for people who asked for less motion.
  const running = onScreen && tabVisible && !isAuthOpen && !reducedMotion;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(
      () => setActive((i) => (i + 1) % CYCLE_NODES.length),
      ROTATE_EVERY_MS,
    );
    return () => clearInterval(id);
  }, [running]);

  return (
    <div
      ref={rootRef}
      className="w-[min(520px,100%)] [container-type:inline-size]"
      role="img"
      aria-label="Field collection, laboratory, genomic surveillance and analysis connected in one record"
    >
      <div className="relative aspect-square rounded-full bg-[radial-gradient(circle_at_50%_50%,#26225a_0%,#1b1940_55%,#13122e_100%)] shadow-[0_30px_60px_-20px_#1b194073,inset_0_0_0_1px_#ffffff0a]">
        <div className="absolute inset-1/4 rounded-full bg-[radial-gradient(circle,#7c4dff8c,#7c4dff00_70%)] blur-[6px]" />
        <div className="absolute inset-[4.5%] rounded-full border border-dashed border-white/[0.14]" />
        <svg
          className="absolute inset-0 size-full"
          viewBox="0 0 440 440"
          aria-hidden="true"
        >
          <circle
            cx="220"
            cy="220"
            r="152"
            fill="none"
            stroke="rgba(255,255,255,.28)"
            strokeWidth="2.5"
            strokeDasharray="9 11"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute left-[34.75%] top-[34.75%] flex size-[30.5%] flex-col items-center justify-center gap-[2.4cqw] rounded-full border-[1.5px] border-white/[0.14] bg-[#1a1838] text-center text-[length:2.55cqw] font-bold leading-[1.25] tracking-[0.01em] text-white shadow-[0_0_40px_#7c4dff59]">
          <Dna strokeWidth={2} className="size-[6cqw] text-landing-yellow" />
          <span>
            ONE CONNECTED
            <br />
            RECORD
          </span>
        </div>
        {CYCLE_NODES.map(
          (
            { id, title, sub, Icon, img, position, imgClass, labelClass },
            i,
          ) => (
            <div
              key={id}
              className={`absolute size-[30.9%] overflow-hidden rounded-full transition-[border-color,box-shadow,transform] duration-500 ease-in-out ${position} ${
                i === active
                  ? "scale-[1.03] border-[5px] border-[#cfcde0] shadow-[0_0_0_1px_#ffffff4d,0_12px_30px_#00000073]"
                  : "border-2 border-white/[0.32] shadow-[0_10px_24px_#00000059]"
              }`}
            >
              <Image
                src={`${IMAGE_BASE}/${img}`}
                alt=""
                fill
                sizes="140px"
                className={`object-cover ${imgClass}`}
                priority
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,#14123200_30%,#1412328c_62%,#141232d9)]" />
              <div
                className={`absolute inset-x-0 flex flex-col items-center px-[6%] text-center text-white ${labelClass}`}
              >
                <Icon
                  strokeWidth={2}
                  className="mb-[1cqw] size-[4cqw] text-landing-yellow"
                  aria-hidden="true"
                />
                <strong className="text-[length:2.9cqw] font-bold leading-[1.12]">
                  {title}
                </strong>
                <small className="mt-[0.8cqw] text-[length:1.95cqw] text-[#ffffffb8]">
                  {sub}
                </small>
              </div>
            </div>
          ),
        )}
        {CYCLE_CONNECTORS.map(({ id, position, Icon }) => (
          <span
            key={id}
            className={`absolute -ml-[2.6%] -mt-[2.6%] grid size-[5.2%] place-items-center rounded-full bg-white text-landing-purple shadow-[0_2px_6px_#00000040] ${position}`}
          >
            <Icon strokeWidth={2.4} className="size-[2.6cqw]" />
          </span>
        ))}
      </div>
    </div>
  );
}
