import Image from "next/image";
import Link from "next/link";

import { IMAGE_BASE } from "./content";

export function Logo({
  href = "/",
  tone = "dark",
}: {
  href?: string;
  tone?: "dark" | "light";
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-[9px]"
      aria-label="Dharini home"
    >
      <span
        className="grid size-9 place-items-center overflow-hidden rounded-full border border-[#dcd5f5] bg-white p-[3px] shadow-[0_4px_12px_rgba(40,24,120,0.12)]"
        aria-hidden="true"
      >
        <Image
          src={`${IMAGE_BASE}/dharini-logo.webp`}
          width={128}
          height={128}
          alt=""
          className="size-full object-contain"
          priority
        />
      </span>
      <span
        className={`font-serif text-xl ${tone === "light" ? "text-white" : "text-landing-ink"}`}
      >
        Dharini
      </span>
    </Link>
  );
}
