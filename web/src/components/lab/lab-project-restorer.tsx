"use client";

import { useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";
import { usePathname } from "next/navigation";

import { labSwitchedFromProjectAtom } from "@/src/store/labSwitchedFromProjectAtom";
import { userAtom } from "@/src/store/userAtom";

// Once the user leaves the lab's pages (/lab and /lab/<sample>), puts back
// the project the lab picker switched them away from on its own. See
// labSwitchedFromProjectAtom.
export default function LabProjectRestorer() {
  const pathname = usePathname();
  const [switchedFrom, setSwitchedFrom] = useAtom(labSwitchedFromProjectAtom);
  const setUser = useSetAtom(userAtom);

  useEffect(() => {
    if (!switchedFrom) return;
    if (pathname === "/lab" || pathname?.startsWith("/lab/")) return;
    setUser((previous) =>
      previous ? { ...previous, project: switchedFrom } : previous,
    );
    setSwitchedFrom(null);
  }, [pathname, switchedFrom, setUser, setSwitchedFrom]);

  return null;
}
