"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  sendSignupOtp,
  verifySignupOtp,
} from "@/src/app/(root)/signup/actions";
import analytics from "@/src/lib/analytics";

import {
  ContactField,
  ContactTypeToggle,
  Field,
  FormAlert,
  SubmitButton,
  Subtitle,
  SwitchLine,
  Title,
} from "./auth-ui";
import type { AuthFormStatus } from "./auth-ui";
import OtpStep from "./otp-step";
import { useOtpFlow } from "./use-otp-flow";

export default function SignupForm({
  titleId,
  onSwitchToLogin,
  onStatusChange,
}: {
  titleId: string;
  onSwitchToLogin: () => void;
  onStatusChange: (status: AuthFormStatus) => void;
}) {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceNameManuallyEdited, setWorkspaceNameManuallyEdited] =
    useState(false);

  const flow = useOtpFlow({
    send: sendSignupOtp,
    validateBeforeSend: () => {
      if (!firstName.trim()) throw new Error("First name is required");
      if (!workspaceName.trim()) throw new Error("Workspace name is required");
    },
    verify: (identifier, type, otp) =>
      verifySignupOtp({
        identifier,
        type,
        otp,
        firstName: firstName.trim(),
        lastName: lastName.trim() || undefined,
        workspaceName: workspaceName.trim(),
      }),
    onCodeSent: analytics.signupOtpSent,
    onVerified: (type) => {
      analytics.signupSuccess(type);
      // Route through the workspace picker rather than /home directly - it
      // auto-selects/redirects immediately since a brand-new signup user
      // belongs to exactly one workspace (the one just created).
      router.replace("/workspaces");
    },
    onVerifyFailed: analytics.signupFailed,
    verifiedMessage: "Workspace created successfully!",
  });

  // Anything typed here would be lost if the dialog closed.
  const dirty =
    flow.showOtpSection ||
    [firstName, lastName, organizationName, workspaceName, flow.identifier].some(
      (value) => value.trim() !== "",
    );
  useEffect(() => {
    onStatusChange({ busy: flow.loading, dirty });
  }, [onStatusChange, flow.loading, dirty]);

  const canSendOtp =
    flow.isIdentifierValid &&
    firstName.trim().length > 0 &&
    workspaceName.trim().length > 0;

  if (flow.showOtpSection) {
    return (
      <OtpStep
        titleId={titleId}
        flow={flow}
        submitLabel="Verify & Create Workspace"
        loadingLabel="Creating workspace…"
      />
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (canSendOtp && !flow.loading) flow.sendCode();
      }}
    >
      <Title id={titleId}>Create your account</Title>
      <Subtitle>
        Tell us a bit about your team, then verify with a one-time code.
      </Subtitle>

      <div className="grid grid-cols-2 gap-3">
        <Field
          id="auth-firstName"
          label="First name"
          autoComplete="given-name"
          placeholder="Jane"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          autoFocus
        />
        <Field
          id="auth-lastName"
          label="Last name"
          autoComplete="family-name"
          placeholder="Doe"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <Field
        id="auth-organisation"
        label="Organisation name"
        autoComplete="organization"
        placeholder="Acme Diagnostics"
        value={organizationName}
        onChange={(e) => {
          setOrganizationName(e.target.value);
          // Auto-fill workspace name from org name unless user has manually edited it
          if (!workspaceNameManuallyEdited) {
            setWorkspaceName(e.target.value);
          }
        }}
      />
      {/* Workspace name — auto-filled from org name, editable */}
      <Field
        id="auth-workspace"
        label="Workspace name"
        placeholder="Acme Diagnostics"
        value={workspaceName}
        onChange={(e) => {
          setWorkspaceName(e.target.value);
          setWorkspaceNameManuallyEdited(true);
        }}
      />

      <ContactTypeToggle
        value={flow.contactType}
        onChange={flow.changeContactType}
      />
      <ContactField
        type={flow.contactType}
        value={flow.identifier}
        onChange={flow.setIdentifier}
      />

      {flow.error && <FormAlert>{flow.error}</FormAlert>}

      <SubmitButton
        loading={flow.loading}
        disabled={!canSendOtp}
        loadingLabel="Sending code…"
      >
        Send OTP
      </SubmitButton>

      <SwitchLine
        prompt="Already have a workspace?"
        action="Log in"
        onClick={onSwitchToLogin}
      />
    </form>
  );
}
