"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import Loader from "@/src/components/ui/loader";
import Spinner from "@/src/components/ui/spinner";
import { fetchUserProfileApi } from "@/src/app/(root)/loader";
import {
  acceptWorkspaceInvite,
  updateOwnProfile,
} from "@/src/app/(root)/workspace-invitation/actions";
import {
  getWorkspaceById,
  getWorkspaceInviteByToken,
} from "@/src/app/(root)/workspace-invitation/loader";

// 3.3: adapted from project-invitation/[token]/page.tsx's simple
// accept-on-mount pattern, extended with a first-run details step (per the
// user's chosen design: a small, secure self-service endpoint rather than a
// welcome-only screen) before redirecting into the workspace.
type Step = "accepting" | "details" | "invalid";

export default function WorkspaceInvite() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();

  const [step, setStep] = useState<Step>("accepting");
  const [workspaceName, setWorkspaceName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleInvite = async () => {
    if (!token) return;

    try {
      await acceptWorkspaceInvite(token);
      const invite = await getWorkspaceInviteByToken(token);

      if (invite.workspaceId) {
        const workspace = await getWorkspaceById(invite.workspaceId);
        setWorkspaceName(workspace.name);
      }

      const profileResponse = await fetchUserProfileApi();
      setFirstName(profileResponse.data?.firstName || invite.firstName || "");
      setLastName(profileResponse.data?.lastName || invite.lastName || "");

      setStep("details");
    } catch (err) {
      console.error("Error accepting workspace invite:", err);
      setStep("invalid");
    }
  };

  useEffect(() => {
    if (token) {
      handleInvite();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleContinue = async () => {
    try {
      setSaving(true);
      setError("");
      await updateOwnProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      // 4.2: route through the workspace picker rather than /home directly -
      // an invited member may belong to more than one workspace, so let the
      // picker decide (auto-select if this is their only one).
      router.replace("/workspaces");
    } catch (err: unknown) {
      setSaving(false);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred while saving your details.");
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleContinue();
    }
  };

  if (step === "accepting") {
    return (
      <div className="flex flex-col gap-10">
        <p className="mt-10 text-center">Accepting your invite</p>
        <Loader />
      </div>
    );
  }

  if (step === "invalid") {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <h2 className="mb-10 text-xl font-semibold text-center text-grey-80">
          Invalid Token
        </h2>
        <p className="mb-10 text-center text-grey-60">
          The token used for invitation has expired or invalid.
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-blue-60 bg-[url('/images/background.svg')] py-6">
      <div className="inline-flex w-full items-center justify-center rounded-lg border-r border-grey-20 bg-white px-4 py-10 shadow sm:min-h-[520px] sm:w-[560px] sm:p-10">
        <div className="w-80 flex-col justify-start items-center gap-10 flex">
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
                {workspaceName
                  ? `Welcome to ${workspaceName}`
                  : "Welcome to your new workspace"}
              </p>
              <div className="w-80 h-px border-t border-grey-20" />
            </div>

            <div className="self-stretch flex-col justify-start items-start gap-5 flex">
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
                      onKeyDown={handleKeyPress}
                      placeholder="Jane"
                      autoFocus
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
                      onKeyDown={handleKeyPress}
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>

              <button
                className="w-full p-3 bg-blue-40 hover:bg-blue-50 active:bg-blue-60 disabled:bg-grey-20 rounded-lg justify-center items-center gap-2 inline-flex text-white disabled:text-grey-50 text-base leading-normal font-semibold"
                onClick={handleContinue}
                disabled={saving || firstName.trim().length === 0}
              >
                {saving && <Spinner />}
                Continue
              </button>
            </div>

            {error && <p className="text-red-30 text-sm">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
