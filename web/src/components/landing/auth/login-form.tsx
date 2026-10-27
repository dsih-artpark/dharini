"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";

import { sendOtp, verifyOtp } from "@/src/app/(root)/actions";
import { deleteToken } from "@/src/utils/auth";
import { safeRedirectPath } from "@/src/utils/redirect";
import { SESSION_EXPIRED_REASON } from "@/src/utils/session";

import { LINKS } from "../content";
import { mobileAppLinks } from "../mobile-app-links";
import type { LandingLink } from "../mobile-app-links";
import {
  ContactField,
  ContactTypeToggle,
  FormAlert,
  SubmitButton,
  Subtitle,
  SwitchLine,
  Title,
} from "./auth-ui";
import type { AuthFormStatus } from "./auth-ui";
import OtpStep from "./otp-step";
import { useOtpFlow } from "./use-otp-flow";

// Each link grows to share the row and wraps once it would be narrower than
// its basis, so one to three links fit the dialog at any width.
const SECONDARY_LINK_CLASS =
  "inline-flex h-[38px] flex-1 basis-[110px] items-center justify-center gap-[7px] whitespace-nowrap rounded-lg border border-landing-border text-[13px] font-medium text-landing-ink-2 transition hover:border-[#c9c3e6] hover:text-landing-purple";

const USER_GUIDE_LINK: LandingLink = {
  href: LINKS.userGuide,
  label: "User guide",
  Icon: BookOpen,
};

export default function LoginForm({
  titleId,
  onSwitchToSignup,
  onStatusChange,
}: {
  titleId: string;
  onSwitchToSignup: () => void;
  onStatusChange: (status: AuthFormStatus) => void;
}) {
  const router = useRouter();
  const [sessionExpired, setSessionExpired] = useState(false);

  const flow = useOtpFlow({
    send: sendOtp,
    verify: (identifier, type, otp) => verifyOtp(identifier, otp, type),
    onVerified: () => {
      // Land on the workspace picker rather than /home directly - it
      // auto-selects and skips straight through when there's only one
      // workspace, and forwards redirectTo once a workspace is chosen.
      const redirectTo = safeRedirectPath(
        new URLSearchParams(window.location.search).get("redirectTo"),
      );
      router.replace(
        redirectTo
          ? `/workspaces?redirectTo=${encodeURIComponent(redirectTo)}`
          : "/workspaces",
      );
    },
    verifiedMessage: "Login successful!",
  });

  // Once a code has been requested, closing would throw the attempt away.
  useEffect(() => {
    onStatusChange({ busy: flow.loading, dirty: flow.showOtpSection });
  }, [onStatusChange, flow.loading, flow.showOtpSection]);

  // Read after mount, not during render: the server render has no URL to
  // read, and both renders must match.
  useEffect(() => {
    const reason = new URLSearchParams(window.location.search).get("reason");
    if (reason !== SESSION_EXPIRED_REASON) return;
    setSessionExpired(true);
    // The middleware leaves the expired token in place (see middleware.ts),
    // so clear it now the user is here, along with local storage as logout()
    // does. The landing page only renders without a valid token, so no live
    // session is affected.
    deleteToken().catch(() => undefined);
    window.localStorage.clear();
  }, []);

  if (flow.showOtpSection) {
    return (
      <OtpStep
        titleId={titleId}
        flow={flow}
        submitLabel="Verify & Login"
        loadingLabel="Verifying…"
      />
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (flow.isIdentifierValid && !flow.loading) flow.sendCode();
      }}
    >
      <Title id={titleId}>Login</Title>
      <Subtitle>
        Enter your email or phone number to get a one-time code.
      </Subtitle>

      {sessionExpired && <FormAlert variant="notice">Session Expired</FormAlert>}

      <ContactTypeToggle
        value={flow.contactType}
        onChange={flow.changeContactType}
      />
      <ContactField
        type={flow.contactType}
        value={flow.identifier}
        onChange={flow.setIdentifier}
        autoFocus
      />

      {flow.error && <FormAlert>{flow.error}</FormAlert>}

      <SubmitButton
        loading={flow.loading}
        disabled={!flow.isIdentifierValid}
        loadingLabel="Sending code…"
      >
        Send OTP
      </SubmitButton>

      <SwitchLine
        prompt="New to Dharini?"
        action="Sign up"
        onClick={onSwitchToSignup}
      />

      <div className="mt-5 flex flex-wrap gap-2 border-t border-[#ece8f8] pt-[18px]">
        {[...mobileAppLinks(), USER_GUIDE_LINK].map(({ href, label, Icon }) => (
          <a
            key={label}
            className={SECONDARY_LINK_CLASS}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon size={15} strokeWidth={2} /> {label}
          </a>
        ))}
      </div>
    </form>
  );
}
