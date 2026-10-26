"use client";
import React, { useEffect, useRef, useState } from "react";

export const OTP_LENGTH = 6;

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
}

const toSlots = (value: string) =>
  Array.from({ length: OTP_LENGTH }, (_, i) => value[i] || "");

// Six single-digit boxes that behave like one field: typing advances,
// Backspace on an empty box steps back, and pasting a full code fills them all.
//
// The boxes are fixed positions: clearing one in the middle leaves a gap
// instead of shifting the later digits left. `onChange` receives the digits
// joined together, so the code is only OTP_LENGTH long once every box is full.
export default function OtpInput({
  value,
  onChange,
  disabled,
  invalid,
}: OtpInputProps) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const [slots, setSlots] = useState(() => toSlots(value));
  const wasDisabled = useRef(disabled);

  // Follow the parent when it replaces the value (for example, clearing it on
  // resend), but not for the value this component just reported itself, which
  // has no gaps and so cannot rebuild the slots.
  useEffect(() => {
    if (value !== slots.join("")) setSlots(toSlots(value));
  }, [value, slots]);

  // Put the cursor in the first empty box on open, and back in the boxes once
  // they re-enable after a verify attempt (disabled inputs drop focus).
  useEffect(() => {
    const reenabled = wasDisabled.current && !disabled;
    wasDisabled.current = disabled;
    if (disabled) return;
    if (reenabled || !value) {
      const firstEmpty = slots.findIndex((d) => !d);
      inputs.current[firstEmpty === -1 ? OTP_LENGTH - 1 : firstEmpty]?.focus();
    }
    // Only the disabled transition and the first render should move focus.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);

  const commit = (next: string[]) => {
    setSlots(next);
    onChange(next.join(""));
  };

  const fillFrom = (index: number, text: string) => {
    const chars = text
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH - index)
      .split("");
    if (!chars.length) return;
    const next = slots.slice();
    chars.forEach((d, i) => (next[index + i] = d));
    inputs.current[Math.min(index + chars.length, OTP_LENGTH - 1)]?.focus();
    commit(next);
  };

  const handleChange = (index: number, raw: string) => {
    const typed = raw.replace(/\D/g, "");
    if (!typed) {
      const next = slots.slice();
      next[index] = "";
      commit(next);
      return;
    }
    if (typed.length > 1) return fillFrom(index, typed);
    const next = slots.slice();
    next[index] = typed;
    if (index < OTP_LENGTH - 1) inputs.current[index + 1]?.focus();
    commit(next);
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !slots[index] && index > 0) {
      e.preventDefault();
      const next = slots.slice();
      next[index - 1] = "";
      commit(next);
      inputs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  return (
    <div
      className="grid grid-cols-6 gap-1.5 sm:gap-2"
      role="group"
      aria-label="One-time code"
    >
      {slots.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            inputs.current[i] = el;
          }}
          value={digit}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={OTP_LENGTH}
          disabled={disabled}
          aria-label={`Digit ${i + 1}`}
          aria-invalid={invalid || undefined}
          className={`h-12 w-full rounded-lg border bg-[#f8f6ff] text-center text-xl font-semibold text-landing-ink transition focus:border-landing-purple focus:bg-white focus:shadow-[0_0_0_3px_#6c47ff29] focus:outline-none disabled:opacity-60 sm:h-[52px] ${
            invalid ? "border-[#d93a4a]" : "border-[#dcd6f5]"
          }`}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={(e) => {
            e.preventDefault();
            fillFrom(i, e.clipboardData.getData("text"));
          }}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </div>
  );
}
