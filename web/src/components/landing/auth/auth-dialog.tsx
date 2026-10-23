"use client";
import React, { useCallback, useEffect, useRef } from "react";
import { X } from "lucide-react";

import { Logo } from "../logo";
import type { AuthFormStatus } from "./auth-ui";
import LoginForm from "./login-form";
import SignupForm from "./signup-form";

export type AuthMode = "login" | "signup";

const TITLE_ID = "auth-title";

export default function AuthDialog({
  mode,
  onModeChange,
  onClose,
}: {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const status = useRef<AuthFormStatus>({ busy: false, dirty: false });

  // Closing is refused while a request is in flight (its result, including a
  // failed verify's error, would never be seen). Once the form holds input, a
  // stray click on the backdrop is ignored and Escape or the close button ask
  // first.
  const requestClose = useCallback(
    (source: "backdrop" | "explicit") => {
      const { busy, dirty } = status.current;
      if (busy) return;
      if (dirty) {
        if (source === "backdrop") return;
        if (!window.confirm("Close this form? What you entered will be lost."))
          return;
      }
      onClose();
    },
    [onClose],
  );
  const requestCloseRef = useRef(requestClose);
  requestCloseRef.current = requestClose;

  const handleStatusChange = useCallback((next: AuthFormStatus) => {
    status.current = next;
  }, []);

  // Lock page scroll, trap Tab inside the dialog, close on Escape, and hand
  // focus back to whatever opened the dialog once it closes.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestCloseRef.current("explicit");
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        "button:not([disabled]), input:not([disabled]), a[href]",
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      opener?.focus?.();
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] grid animate-landing-fade-in place-items-center overflow-y-auto bg-[#15143a8c] p-4 font-sans leading-normal text-landing-ink antialiased backdrop-blur-[3px]"
      onMouseDown={(e) =>
        e.target === e.currentTarget && requestClose("backdrop")
      }
    >
      <div
        ref={dialogRef}
        className={`w-full animate-landing-pop-in rounded-[14px] bg-white px-[18px] pb-[22px] pt-[18px] shadow-[0_30px_70px_-20px_#15143a80] sm:px-7 sm:pb-7 sm:pt-[22px] ${
          mode === "signup" ? "max-w-[480px]" : "max-w-[440px]"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={TITLE_ID}
      >
        <div className="mb-[26px] flex items-center justify-between">
          <Logo />
          <button
            type="button"
            className="-mr-2 grid size-8 place-items-center rounded-lg text-landing-ink hover:bg-landing-lav focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-landing-purple"
            onClick={() => requestClose("explicit")}
            aria-label="Close"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>
        {mode === "login" ? (
          <LoginForm
            titleId={TITLE_ID}
            onSwitchToSignup={() => onModeChange("signup")}
            onStatusChange={handleStatusChange}
          />
        ) : (
          <SignupForm
            titleId={TITLE_ID}
            onSwitchToLogin={() => onModeChange("login")}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </div>
  );
}
