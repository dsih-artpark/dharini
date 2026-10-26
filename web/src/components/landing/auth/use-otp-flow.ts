"use client";
import { useEffect, useRef, useState } from "react";

import { formatPhoneForAPI, isValidEmail, isValidPhone } from "@/src/utils";

import { OTP_LENGTH } from "./otp-input";

export type ContactType = "email" | "phone";

const RESEND_COOLDOWN_SECONDS = 60;
// Stops a user backing out of the code screen the instant it appears.
const IDENTIFIER_CHANGE_DELAY_MS = 3000;

interface OtpFlowConfig {
  send: (identifier: string, type: ContactType) => Promise<unknown>;
  verify: (
    identifier: string,
    type: ContactType,
    otp: number,
  ) => Promise<unknown>;
  /** Extra checks before a code is sent; throw an Error to show its message. */
  validateBeforeSend?: () => void;
  onCodeSent?: (type: ContactType) => void;
  /** Runs after a successful verify, e.g. to navigate away. */
  onVerified: (type: ContactType) => void;
  onVerifyFailed?: (type: ContactType, message: string) => void;
  verifiedMessage: string;
}

export type OtpFlow = ReturnType<typeof useOtpFlow>;

// The send-code → enter-code → verify sequence shared by login and signup.
export function useOtpFlow({
  send,
  verify,
  validateBeforeSend,
  onCodeSent,
  onVerified,
  onVerifyFailed,
  verifiedMessage,
}: OtpFlowConfig) {
  // Guards against a duplicate verify call. The OTP is single-use server-side,
  // so a second submit (e.g. pressing Enter twice, or Enter + button) would hit
  // the already-consumed OTP and surface a spurious "Invalid OTP" even though
  // the first call already succeeded. A ref flips synchronously, so it blocks
  // the second call even within the same event-loop tick (unlike async loading
  // state).
  const isVerifyingRef = useRef(false);

  const [contactType, setContactType] = useState<ContactType>("email");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [allowIdentifierChange, setAllowIdentifierChange] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const isIdentifierValid =
    contactType === "email"
      ? isValidEmail(identifier)
      : isValidPhone(identifier);
  const canResend = resendCooldown === 0;

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  useEffect(() => {
    if (!showOtpSection) {
      setAllowIdentifierChange(false);
      return;
    }
    const timer = setTimeout(
      () => setAllowIdentifierChange(true),
      IDENTIFIER_CHANGE_DELAY_MS,
    );
    return () => clearTimeout(timer);
  }, [showOtpSection]);

  const apiIdentifier = () =>
    contactType === "phone" ? formatPhoneForAPI(identifier) : identifier;

  const sendCode = async () => {
    try {
      if (!isIdentifierValid) {
        throw new Error(
          `Invalid ${contactType === "email" ? "email address" : "phone number"}`,
        );
      }
      validateBeforeSend?.();

      setLoading(true);
      setError("");
      setMessage("");

      await send(apiIdentifier(), contactType);
      onCodeSent?.(contactType);
      setMessage("OTP sent successfully!");
      setShowOtpSection(true);
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while sending OTP.",
      );
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    setOtp("");
    setError("");
    setMessage("");
    await sendCode();
  };

  const verifyCode = async () => {
    if (otp.length < OTP_LENGTH) return;
    if (isVerifyingRef.current) return;
    isVerifyingRef.current = true;
    try {
      setLoading(true);
      setError("");
      setMessage("");

      await verify(apiIdentifier(), contactType, Number(otp));
      setMessage(verifiedMessage);
      onVerified(contactType);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while verifying OTP.";
      onVerifyFailed?.(contactType, errorMessage);
      setError(errorMessage);

      // Offer a resend straight away when the code has expired.
      if (errorMessage.toLowerCase().includes("expired")) {
        setResendCooldown(0);
      }

      setLoading(false);
      // Re-enable verification after a genuine failure so the user can retry.
      // On success we intentionally leave it locked while navigating away.
      isVerifyingRef.current = false;
    }
  };

  const updateOtp = (code: string) => {
    setOtp(code);
    if (error) setError("");
  };

  const backToContactStep = () => {
    setShowOtpSection(false);
    setOtp("");
    setMessage("");
    setError("");
    setResendCooldown(0);
  };

  const changeContactType = (type: ContactType) => {
    setContactType(type);
    setIdentifier("");
    backToContactStep();
  };

  return {
    contactType,
    identifier,
    setIdentifier,
    otp,
    updateOtp,
    error,
    message,
    showOtpSection,
    allowIdentifierChange,
    loading,
    resendCooldown,
    canResend,
    isIdentifierValid,
    sendCode,
    resendCode,
    verifyCode,
    changeContactType,
    changeIdentifier: backToContactStep,
  };
}
