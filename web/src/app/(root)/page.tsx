"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Spinner from "@/src/components/ui/spinner";

import { sendOtp, verifyOtp } from "@/src/app/(root)/actions";
import { isValidEmail, isValidPhone, formatPhoneForAPI } from "@/src/utils";
import analytics from "@/src/lib/analytics";
import { deleteToken } from "@/src/utils/auth";
import { SESSION_EXPIRED_REASON } from "@/src/utils/session";
import { env } from "@/env";

export default function Home() {
  const router = useRouter();
  let searchParams: URLSearchParams | null = null;
  if (typeof window !== "undefined") {
    searchParams = new URLSearchParams(window.location.search);
  }

  // Guards against a duplicate verify call. The OTP is single-use server-side, so a
  // second submit (e.g. pressing Enter twice, or Enter + button) would hit the
  // already-consumed OTP and surface a spurious "Invalid OTP" even though the first
  // call already logged the user in. A ref flips synchronously, so it blocks the
  // second call even within the same event-loop tick (unlike async loading state).
  const isVerifyingRef = useRef(false);

  const [loginType, setLoginType] = useState<"email" | "phone">("email");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [allowIdentifierChange, setAllowIdentifierChange] = useState(false);
  const [isIdentifierValid, setIsIdentifierValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  // Read after mount, not during render: the server render has no URL to
  // read, and both renders must match.
  useEffect(() => {
    const reason = new URLSearchParams(window.location.search).get("reason");
    if (reason !== SESSION_EXPIRED_REASON) return;
    setSessionExpired(true);
    // The middleware leaves the expired token in place (see middleware.ts),
    // so clear it now the user is here. This page only renders without a
    // valid token, so no live session is affected.
    deleteToken().catch(() => undefined);
  }, []);

  // A heads-up, not something the page stays in: hide it after 4 seconds.
  useEffect(() => {
    if (!sessionExpired) return;
    const timer = setTimeout(() => setSessionExpired(false), 4000);
    return () => clearTimeout(timer);
  }, [sessionExpired]);

  useEffect(() => {
    if (identifier.length > 0) {
      if (loginType === "email") {
        setIsIdentifierValid(isValidEmail(identifier));
      } else {
        setIsIdentifierValid(isValidPhone(identifier));
      }
    } else {
      setIsIdentifierValid(false);
    }
  }, [identifier, loginType]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleSendOtp = async () => {
    try {
      const validationCheck =
        loginType === "email"
          ? isValidEmail(identifier)
          : isValidPhone(identifier);

      if (!validationCheck) {
        throw new Error(
          `Invalid ${loginType === "email" ? "email address" : "phone number"}`,
        );
      }

      setLoading(true);
      setError("");
      setMessage("");

      const formattedIdentifier =
        loginType === "phone" ? formatPhoneForAPI(identifier) : identifier;

      await sendOtp(formattedIdentifier, loginType);
      analytics.loginOtpSent(loginType);
      setMessage("OTP sent successfully!");
      setShowOtpSection(true);
      setResendCooldown(60);
      setCanResend(false);
      setTimeout(() => {
        setAllowIdentifierChange(true);
      }, 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred while sending OTP.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setOtp("");
    setError("");
    setMessage("");
    await handleSendOtp();
  };

  const handleVerifyOtp = async () => {
    if (isVerifyingRef.current) return;
    isVerifyingRef.current = true;
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const formattedIdentifier =
        loginType === "phone" ? formatPhoneForAPI(identifier) : identifier;

      await verifyOtp(formattedIdentifier, Number(otp), loginType);
      analytics.loginSuccess(loginType);
      setMessage("Login successful!");
      // 4.2: land on the workspace picker rather than /home directly - it
      // auto-selects and skips straight through when there's only one
      // workspace, and forwards redirectTo once a workspace is chosen.
      const redirectTo = searchParams?.get("redirectTo");
      router.replace(
        redirectTo
          ? `/workspaces?redirectTo=${encodeURIComponent(redirectTo)}`
          : "/workspaces",
      );
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while verifying OTP.";
      analytics.loginFailed(loginType, errorMessage);
      setError(errorMessage);

      // Show resend option immediately if OTP is expired or invalid
      const isOtpError = errorMessage.toLowerCase().includes("expired");
      if (isOtpError) {
        setCanResend(true);
        setResendCooldown(0);
      }

      setLoading(false);
      // Re-enable verification after a genuine failure so the user can retry.
      // On success we intentionally leave it locked while navigating away.
      isVerifyingRef.current = false;
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (!showOtpSection) {
        handleSendOtp();
      } else {
        handleVerifyOtp();
      }
    }
  };

  const handleLoginTypeToggle = (type: "email" | "phone") => {
    setLoginType(type);
    setIdentifier("");
    setOtp("");
    setShowOtpSection(false);
    setError("");
    setMessage("");
    setAllowIdentifierChange(false);
    setResendCooldown(0);
    setCanResend(false);
  };

  const handleChangeIdentifier = () => {
    setShowOtpSection(false);
    setOtp("");
    setMessage("");
    setError("");
    setAllowIdentifierChange(false);
    setResendCooldown(0);
    setCanResend(false);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-blue-60 bg-[url('/images/background.svg')] py-6">
      <div className="inline-flex w-full items-center justify-center rounded-lg border-r border-grey-20 bg-white px-4 py-10 shadow sm:min-h-[640px] sm:w-[720px] sm:p-10">
        <div className="w-80 flex-col justify-start items-center gap-10 flex ">
          <div className="flex w-full -translate-x-2 items-center justify-center gap-3">
            <div className="relative h-24 w-24 shrink-0">
              <Image
                src="/images/site-logo.png"
                fill
                sizes="96px"
                className="object-contain"
                alt="Dharini logo"
                priority
              />
            </div>
            <div className="min-w-0 text-blue-60">
              <h1 className="font-sans text-[38px] font-bold leading-none tracking-wide">
                DHARINI
              </h1>
              <p className="mt-1 whitespace-nowrap font-sans text-[7px] font-bold leading-none tracking-tight">
                ONE HEALTH PATHOGEN SURVEILLANCE &amp; GENOMICS
              </p>
            </div>
          </div>
          <div className="flex-col justify-start items-start gap-4 flex w-full">
            <div className="flex-col justify-start items-start gap-4 flex w-full">
              <p className="text-black text-lg font-semibold font-noto-serif leading-normal">
                Login
              </p>
              <div className="w-80 h-px border-t border-grey-20" />
            </div>

            {sessionExpired && (
              <p
                role="alert"
                className="w-full rounded border border-red-20 bg-red-10 px-3 py-2 text-sm font-medium text-red-30"
              >
                Session Expired
              </p>
            )}

            {/* Toggle between Email and Phone */}
            <div className="flex gap-2 w-full mb-2">
              <button
                onClick={() => handleLoginTypeToggle("email")}
                disabled={showOtpSection && !allowIdentifierChange}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  loginType === "email"
                    ? "bg-blue-40 text-white"
                    : "bg-grey-10 text-grey-80 hover:bg-grey-20"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Email
              </button>
              <button
                onClick={() => handleLoginTypeToggle("phone")}
                disabled={showOtpSection && !allowIdentifierChange}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  loginType === "phone"
                    ? "bg-blue-40 text-white"
                    : "bg-grey-10 text-grey-80 hover:bg-grey-20"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Phone
              </button>
            </div>

            <div className="self-stretch flex-col justify-start items-start gap-5 flex">
              {/* Email/Phone Input */}
              <div className="self-stretch flex-col justify-start items-start gap-2 flex">
                <label className="text-grey-80 text-base leading-normal">
                  {loginType === "email" ? "Email-id" : "Phone Number"}
                </label>
                <div className="self-stretch h-10 px-3 py-2 bg-white rounded border border-grey-20 justify-start items-center">
                  <input
                    className="w-full outline-none self-stretch text-grey-80 text-sm leading-[21px] grow shrink basis-0 justify-start items-center flex"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={
                      loginType === "email"
                        ? "example@email.com"
                        : "+91 9876543210"
                    }
                    autoFocus={true}
                    disabled={showOtpSection && !allowIdentifierChange}
                  />
                </div>
                {loginType === "phone" && (
                  <p className="text-grey-50 text-xs">
                    Enter 10-digit mobile number (with or without +91)
                  </p>
                )}
              </div>

              {/* Send OTP Button - shown when OTP section is not visible */}
              {!showOtpSection && (
                <button
                  className="w-full p-3 bg-blue-40 hover:bg-blue-50 active:bg-blue-60 disabled:bg-grey-20 rounded-lg justify-center items-center gap-2 inline-flex text-white disabled:text-grey-50 text-base leading-normal font-semibold"
                  onClick={handleSendOtp}
                  disabled={!isIdentifierValid || loading}
                >
                  {loading && <Spinner />}
                  Send OTP
                </button>
              )}

              {/* OTP Section - shown at bottom of same screen */}
              {showOtpSection && (
                <>
                  <div className="w-full border-t border-grey-20 my-2" />

                  <div className="self-stretch flex-col justify-start items-start gap-2 flex">
                    <label className="text-grey-80 text-base leading-normal">
                      One Time Password
                    </label>
                    <div className="relative self-stretch h-10 px-3 py-2 bg-white rounded border border-grey-20 justify-start items-center">
                      <input
                        className="w-full outline-none self-stretch text-grey-80 text-sm leading-[21px] grow shrink basis-0 justify-start items-center flex"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Enter 6-digit OTP"
                        autoFocus={true}
                        maxLength={6}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center w-full">
                    <button
                      className="text-blue-50 disabled:text-grey-50 text-sm cursor-pointer"
                      onClick={handleChangeIdentifier}
                      disabled={!allowIdentifierChange}
                    >
                      Try different{" "}
                      {loginType === "email" ? "Email" : "Phone Number"}
                    </button>

                    {canResend ? (
                      <button
                        className="text-blue-50 text-sm font-medium cursor-pointer hover:text-blue-40 transition-colors"
                        onClick={handleResendOtp}
                        disabled={loading}
                      >
                        Resend OTP
                      </button>
                    ) : (
                      <span className="text-grey-50 text-sm">
                        Resend in {resendCooldown}s
                      </span>
                    )}
                  </div>

                  <button
                    className="w-full p-3 bg-blue-40 hover:bg-blue-50 active:bg-blue-60 disabled:bg-grey-20 rounded-lg justify-center items-center gap-2 inline-flex text-white disabled:text-grey-50 text-base leading-normal font-semibold"
                    onClick={handleVerifyOtp}
                    disabled={otp.length < 6 || loading}
                  >
                    {loading && <Spinner />}
                    Verify & Login
                  </button>
                </>
              )}
            </div>
            {error && <p className="text-red-30 text-sm">{error}</p>}
            {message && <p className="text-green-30 text-sm">{message}</p>}

            <p className="text-grey-50 text-sm">
              New to Dharini?{" "}
              <Link href="/signup" className="text-blue-50 hover:text-blue-40">
                Signup
              </Link>
            </p>
          </div>

          {env.APK_DOWNLOAD_URL && (
            <a
              href={env.APK_DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mt-8 px-4 py-3 bg-grey-10 hover:bg-grey-20 rounded-lg border border-grey-20 flex items-center justify-center gap-3 group transition-colors"
            >
              <Image
                src="/images/android-logo.svg"
                width={24}
                height={24}
                alt="Android"
                className="transition-transform group-hover:scale-110"
              />
              <span className="text-grey-80 text-sm font-medium group-hover:text-blue-40 transition-colors">
                Download Mobile App
              </span>
            </a>
          )}
          <a
            href="https://dharini.artpark.ai/user-guide/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-4 py-3 bg-grey-10 hover:bg-grey-20 rounded-lg border border-grey-20 flex items-center justify-center gap-3 group transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-grey-80 group-hover:text-blue-40 transition-all group-hover:scale-110"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <span className="text-grey-80 text-sm font-medium group-hover:text-blue-40 transition-colors">
              View User Guide
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
