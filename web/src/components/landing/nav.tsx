"use client";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";

import { useAuthDialog } from "./auth/auth-dialog-provider";
import type { AuthMode } from "./auth/auth-dialog";
import { buttonClass } from "./button-styles";
import { SiteHeader } from "./ui";

export default function Nav() {
  const { openAuth } = useAuthDialog();
  const [menuOpen, setMenuOpen] = useState(false);

  const open = (mode: AuthMode) => {
    setMenuOpen(false);
    openAuth(mode);
  };

  return (
    <SiteHeader>
      <nav
        className={`${menuOpen ? "flex" : "hidden"} absolute inset-x-0 top-16 flex-col items-stretch gap-1 border-b border-[#e8e5f3] bg-white px-6 pb-5 pt-3 shadow-[0_20px_30px_-20px_#15143a40] min-[900px]:static min-[900px]:flex min-[900px]:flex-row min-[900px]:items-center min-[900px]:gap-7 min-[900px]:border-0 min-[900px]:bg-transparent min-[900px]:p-0 min-[900px]:shadow-none`}
        aria-label="Primary"
      >
        <button
          type="button"
          className="inline-flex items-center py-2.5 text-left text-base text-[#56546f] transition-colors hover:text-landing-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-landing-purple min-[900px]:py-0 min-[900px]:text-[14.5px]"
          onClick={() => open("login")}
        >
          Sign in
        </button>
        <button
          type="button"
          className={buttonClass({
            size: "lg",
            className: "mt-2 justify-center min-[900px]:mt-0",
          })}
          onClick={() => open("signup")}
        >
          Get Started
        </button>
      </nav>
      <button
        type="button"
        className="inline-flex p-1.5 text-landing-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-landing-purple min-[900px]:hidden"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((o) => !o)}
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
    </SiteHeader>
  );
}
