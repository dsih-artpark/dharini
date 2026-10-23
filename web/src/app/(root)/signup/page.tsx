"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Spinner from "@/src/components/ui/spinner";

import {
  sendSignupOtp,
  verifySignupOtp,
} from "@/src/app/(root)/signup/actions";
import { isValidEmail, isValidPhone, formatPhoneForAPI } from "@/src/utils";
import analytics from "@/src/lib/analytics";

export default function Signup() {
  const router = useRouter();

  // Guards against a duplicate verify call, same rationale as the login page:
  // the OTP is single-use server-side, so a second submit would hit the
  // already-consumed OTP and surface a spurious error even though the first
  // call already succeeded.
  const isVerifyingRef = useRef(false);

  const [loginType, setLoginType] = useState<"email" | "phone">("email");
  const [identifier, setIdentifier] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceNameManuallyEdited, setWorkspaceNameManuallyEdited] =
    useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [allowIdentifierChange, setAllowIdentifierChange] = useState(false);
  const [isIdentifierValid, setIsIdentifierValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [canResend, setCanResend] = useState(false);

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

  const canSendOtp =
    isIdentifierValid &&
    firstName.trim().length > 0 &&
    workspaceName.trim().length > 0;
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
      if (!firstName.trim()) {
        throw new Error("First name is required");
      }
      if (!workspaceName.trim()) {
        throw new Error("Workspace name is required");
      }

      setLoading(true);
      setError("");
      setMessage("");

      const formattedIdentifier =
        loginType === "phone" ? formatPhoneForAPI(identifier) : identifier;

      await sendSignupOtp(formattedIdentifier, loginType);
      analytics.signupOtpSent(loginType);
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

      await verifySignupOtp({
        identifier: formattedIdentifier,
        type: loginType,
        otp: Number(otp),
        firstName: firstName.trim(),
        lastName: lastName.trim() || undefined,
        workspaceName: workspaceName.trim(),
      });
      analytics.signupSuccess(loginType);
      setMessage("Workspace created successfully!");
      // 4.2: route through the workspace picker rather than /home directly -
      // it auto-selects/redirects immediately since a brand-new signup user
      // belongs to exactly one workspace (the one just created).
      router.replace("/workspaces");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while verifying OTP.";
      analytics.signupFailed(loginType, errorMessage);
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

  const fieldsLocked = showOtpSection && !allowIdentifierChange;

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
                Sign Up
              </p>
              <div className="w-80 h-px border-t border-grey-20" />
            </div>

            <div className="self-stretch flex-col justify-start items-start gap-5 flex">
              {/* First / last name */}
              <div className="self-stretch flex gap-3">
                <div className="flex-1 flex-col justify-start items-start gap-2 flex">
                  <label className="text-grey-80 text-base leading-normal">
                    First name
                  </label>
                  <div className="self-stretch h-10 px-3 py-2 bg-white rounded border border-grey-20 justify-start items-center">
                    <input
                      className="w-full outline-none self-stretch text-grey-80 text-sm leading-[21px] grow shrink basis-0 justify-start items-center flex"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Jane"
                      disabled={fieldsLocked}
                    />
                  </div>
                </div>
                <div className="flex-1 flex-col justify-start items-start gap-2 flex">
                  <label className="text-grey-80 text-base leading-normal">
                    Last name
                  </label>
                  <div className="self-stretch h-10 px-3 py-2 bg-white rounded border border-grey-20 justify-start items-center">
                    <input
                      className="w-full outline-none self-stretch text-grey-80 text-sm leading-[21px] grow shrink basis-0 justify-start items-center flex"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      disabled={fieldsLocked}
                    />
                  </div>
                </div>
              </div>

              {/* Organization name */}
              <div className="self-stretch flex-col justify-start items-start gap-2 flex">
                <label className="text-grey-80 text-base leading-normal">
                  Organisation name
                </label>
                <div className="self-stretch h-10 px-3 py-2 bg-white rounded border border-grey-20 justify-start items-center">
                  <input
                    className="w-full outline-none self-stretch text-grey-80 text-sm leading-[21px] grow shrink basis-0 justify-start items-center flex"
                    value={organizationName}
                    onChange={(e) => {
                      setOrganizationName(e.target.value);
                      // Auto-fill workspace name from org name unless user has manually edited it
                      if (!workspaceNameManuallyEdited) {
                        setWorkspaceName(e.target.value);
                      }
                    }}
                    placeholder="Acme Diagnostics"
                    disabled={fieldsLocked}
                  />
                </div>
              </div>

              {/* Workspace name — auto-filled from org name, editable */}
              <div className="self-stretch flex-col justify-start items-start gap-2 flex">
                <label className="text-grey-80 text-base leading-normal">
                  Workspace name
                </label>
                <div className="self-stretch h-10 px-3 py-2 bg-white rounded border border-grey-20 justify-start items-center">
                  <input
                    className="w-full outline-none self-stretch text-grey-80 text-sm leading-[21px] grow shrink basis-0 justify-start items-center flex"
                    value={workspaceName}
                    onChange={(e) => {
                      setWorkspaceName(e.target.value);
                      setWorkspaceNameManuallyEdited(true);
                    }}
                    placeholder="Acme Diagnostics"
                    disabled={fieldsLocked}
                  />
                </div>
              </div>

              {/* Toggle between Email and Phone */}
              <div className="flex gap-2 w-full">
                <button
                  onClick={() => handleLoginTypeToggle("email")}
                  disabled={fieldsLocked}
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
                  disabled={fieldsLocked}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    loginType === "phone"
                      ? "bg-blue-40 text-white"
                      : "bg-grey-10 text-grey-80 hover:bg-grey-20"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Phone
                </button>
              </div>

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
                    disabled={fieldsLocked}
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
                  disabled={!canSendOtp || loading}
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
                    Verify &amp; Create Workspace
                  </button>
                </>
              )}
            </div>
            {error && <p className="text-red-30 text-sm">{error}</p>}
            {message && <p className="text-green-30 text-sm">{message}</p>}

            <p className="text-grey-50 text-sm">
              Already have a workspace?{" "}
              <Link href="/" className="text-blue-50 hover:text-blue-40">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
