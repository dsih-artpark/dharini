"use client";
import React from "react";

import OtpInput, { OTP_LENGTH } from "./otp-input";
import {
  BackButton,
  LINK_BUTTON_CLASS,
  ResendLine,
  SubmitButton,
  Subtitle,
  Title,
} from "./auth-ui";
import type { OtpFlow } from "./use-otp-flow";

// The "enter the code we sent you" screen shared by login and signup.
export default function OtpStep({
  titleId,
  flow,
  submitLabel,
  loadingLabel,
}: {
  titleId: string;
  flow: OtpFlow;
  submitLabel: string;
  loadingLabel: string;
}) {
  const channel = flow.contactType === "email" ? "email" : "phone";

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        flow.verifyCode();
      }}
    >
      <BackButton
        onClick={flow.changeIdentifier}
        disabled={!flow.allowIdentifierChange}
      />
      <Title id={titleId}>Check your {channel}</Title>
      <Subtitle>
        We sent a {OTP_LENGTH}-digit code to <strong>{flow.identifier}</strong>.{" "}
        <button
          type="button"
          className={LINK_BUTTON_CLASS}
          onClick={flow.changeIdentifier}
          disabled={!flow.allowIdentifierChange}
        >
          Try different {channel === "email" ? "email" : "phone number"}
        </button>
      </Subtitle>

      <OtpInput
        value={flow.otp}
        onChange={flow.updateOtp}
        disabled={flow.loading}
        invalid={!!flow.error}
      />
      {flow.error && (
        <p
          className="mt-2.5 text-[12.5px] leading-[1.45] text-[#c62f3f]"
          role="alert"
        >
          {flow.error}
        </p>
      )}
      {flow.message && !flow.error && (
        <p
          className="mt-2.5 rounded-lg bg-[#e8f8f0] px-3 py-2.5 text-[12.5px] text-landing-mint-ink"
          role="status"
        >
          {flow.message}
        </p>
      )}

      <SubmitButton
        loading={flow.loading}
        disabled={flow.otp.length < OTP_LENGTH}
        loadingLabel={loadingLabel}
      >
        {submitLabel}
      </SubmitButton>
      <ResendLine
        canResend={flow.canResend}
        cooldown={flow.resendCooldown}
        loading={flow.loading}
        onResend={flow.resendCode}
      />
    </form>
  );
}
