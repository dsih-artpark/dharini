"use client";
import React from "react";
import { ArrowLeft, ArrowRight, LoaderCircle } from "lucide-react";

import { buttonClass } from "../button-styles";
import type { ContactType } from "./use-otp-flow";

// What a form tells the dialog so it knows when closing would lose work:
// `busy` while a request is in flight, `dirty` once there is input to lose.
export interface AuthFormStatus {
  busy: boolean;
  dirty: boolean;
}

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-landing-purple";

export const INPUT_CLASS =
  "w-full rounded-lg border bg-[#f8f6ff] text-landing-ink transition focus:border-landing-purple focus:bg-white focus:shadow-[0_0_0_3px_#6c47ff29] focus:outline-none disabled:cursor-not-allowed disabled:opacity-[0.65]";

export const LINK_BUTTON_CLASS = `font-medium text-landing-purple hover:underline disabled:cursor-default disabled:text-landing-muted-2 disabled:no-underline ${FOCUS_RING}`;

export function Title({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className="mb-2 font-serif text-[28px] leading-[1.1] text-landing-ink sm:text-[32px]"
    >
      {children}
    </h2>
  );
}

export function Subtitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-6 text-sm leading-[1.6] text-landing-muted [&_strong]:break-all [&_strong]:font-semibold [&_strong]:text-landing-ink">
      {children}
    </p>
  );
}

const FORM_ALERT_VARIANT = {
  error: "-mt-1 mb-3.5 text-[12.5px] leading-[1.45]",
  notice: "-mt-2 mb-[18px] text-[13px] font-medium",
} as const;

// A red message above the submit button: "error" for a failed request,
// "notice" for a heads-up such as an expired session.
export function FormAlert({
  variant = "error",
  children,
}: {
  variant?: keyof typeof FORM_ALERT_VARIANT;
  children: React.ReactNode;
}) {
  return (
    <p
      role="alert"
      className={`rounded-lg bg-[#fff1f2] px-3 py-2.5 text-[#c62f3f] ${FORM_ALERT_VARIANT[variant]}`}
    >
      {children}
    </p>
  );
}

export function BackButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className={`mb-3.5 inline-flex items-center gap-1.5 text-[13px] font-medium text-landing-muted hover:text-landing-ink disabled:cursor-default disabled:opacity-50 ${FOCUS_RING}`}
      onClick={onClick}
      disabled={disabled}
    >
      <ArrowLeft size={15} strokeWidth={2} /> Back
    </button>
  );
}

// "Prompt text + link-style button" line under the submit button.
export function SwitchLine({
  prompt,
  action,
  onClick,
}: {
  prompt: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <p className="mt-5 text-center text-[13.5px] text-landing-purple">
      {prompt}{" "}
      <button
        type="button"
        className={`hover:underline ${FOCUS_RING}`}
        onClick={onClick}
      >
        {action}
      </button>
    </p>
  );
}

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  hint?: string;
}

export function Field({ id, label, hint, ...inputProps }: FieldProps) {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="mb-[7px] block text-[12.5px] text-[#44425f]"
      >
        {label}
      </label>
      <input
        id={id}
        aria-describedby={hint ? `${id}-hint` : undefined}
        className={`${INPUT_CLASS} h-11 border-[#dcd6f5] px-3.5 text-[14.5px] placeholder:text-[#a3a1b8]`}
        {...inputProps}
      />
      {hint && (
        <p className="mt-1.5 text-xs text-landing-muted-2" id={`${id}-hint`}>
          {hint}
        </p>
      )}
    </div>
  );
}

export function ContactTypeToggle({
  value,
  onChange,
}: {
  value: ContactType;
  onChange: (type: ContactType) => void;
}) {
  return (
    <div
      className="mb-4 grid grid-cols-2 gap-1 rounded-[10px] border border-[#e6e1f7] bg-landing-lav p-1"
      role="group"
      aria-label="Sign in with"
    >
      {(["email", "phone"] as const).map((type) => (
        <button
          key={type}
          type="button"
          aria-pressed={value === type}
          onClick={() => onChange(type)}
          className={`h-[34px] rounded-[7px] text-[13.5px] font-medium text-landing-muted transition aria-pressed:bg-white aria-pressed:font-semibold aria-pressed:text-landing-purple aria-pressed:shadow-[0_2px_6px_-2px_rgba(21,20,58,0.18)] ${FOCUS_RING}`}
        >
          {type === "email" ? "Email" : "Phone"}
        </button>
      ))}
    </div>
  );
}

// Email/phone input shared by login and signup.
export function ContactField({
  type,
  value,
  onChange,
  autoFocus,
}: {
  type: ContactType;
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
}) {
  return (
    <Field
      id={`auth-${type}`}
      label={type === "email" ? "Email address" : "Phone number"}
      type={type === "email" ? "email" : "tel"}
      inputMode={type === "email" ? "email" : "tel"}
      autoComplete={type === "email" ? "email" : "tel"}
      placeholder={
        type === "email" ? "name@organisation.org" : "+91 9876543210"
      }
      hint={
        type === "phone"
          ? "Enter 10-digit mobile number (with or without +91)"
          : undefined
      }
      value={value}
      onChange={(e) => onChange(e.target.value)}
      autoFocus={autoFocus}
    />
  );
}

export function SubmitButton({
  loading,
  disabled,
  loadingLabel,
  children,
}: {
  loading: boolean;
  disabled?: boolean;
  loadingLabel: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      className={buttonClass({
        size: "xl",
        fullWidth: true,
        className: "mt-1.5",
      })}
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <LoaderCircle size={16} className="animate-spin" /> {loadingLabel}
        </>
      ) : (
        <>
          {children} <ArrowRight size={16} strokeWidth={2.2} />
        </>
      )}
    </button>
  );
}

export function ResendLine({
  canResend,
  cooldown,
  loading,
  onResend,
}: {
  canResend: boolean;
  cooldown: number;
  loading: boolean;
  onResend: () => void;
}) {
  return (
    <p className="mt-5 text-center text-[13.5px] text-landing-purple">
      Didn&rsquo;t get it?{" "}
      {canResend ? (
        <button
          type="button"
          className={`hover:underline disabled:cursor-default disabled:text-landing-muted-2 disabled:no-underline ${FOCUS_RING}`}
          onClick={onResend}
          disabled={loading}
        >
          Resend code
        </button>
      ) : (
        <span className="text-landing-muted-2">
          Resend in {Math.floor(cooldown / 60)}:
          {String(cooldown % 60).padStart(2, "0")}
        </span>
      )}
    </p>
  );
}
