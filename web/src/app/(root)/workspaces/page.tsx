"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSetAtom } from "jotai";

import Loader from "@/src/components/ui/loader";
import { currentWorkspaceAtom } from "@/src/store/currentWorkspaceAtom";
import { getMyWorkspaces } from "@/src/app/(root)/workspaces/loader";
import type { Workspace } from "@/src/types/global";
import { logout } from "@/src/app/(root)/actions";

// 4.2: shown right after login/signup. Auto-selects and skips straight to
// /home (or redirectTo) when the user belongs to exactly one workspace;
// otherwise lets them pick which one to enter.
export default function WorkspacePicker() {
  const router = useRouter();
  const setCurrentWorkspace = useSetAtom(currentWorkspaceAtom);

  let redirectTo: string | null = null;
  if (typeof window !== "undefined") {
    redirectTo = new URLSearchParams(window.location.search).get("redirectTo");
  }

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const enterWorkspace = (workspace: Workspace) => {
    setCurrentWorkspace(workspace);
    router.replace(redirectTo || "/home");
  };

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyWorkspaces();
        if (data.length === 1) {
          enterWorkspace(data[0]);
          return;
        }
        // 4.6 e2e-verification fix: legacy users (project/team-scoped roles
        // whose project has no workspace assigned) legitimately have ZERO
        // workspaces. Previously they'd be stranded here ("you don't belong
        // to any workspace yet") with no way forward except logging out.
        // Skip the picker entirely and let /home's own project resolution
        // (pre-4.2 behavior) take over unchanged.
        if (data.length === 0) {
          // B9: explicitly null out any stale selection (e.g. left over from
          // a previous user on this browser, or a workspace this user no
          // longer belongs to) rather than leaving whatever was persisted.
          setCurrentWorkspace(null);
          router.replace(redirectTo || "/home");
          return;
        }
        setWorkspaces(data);
        setLoading(false);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "An unexpected error occurred while fetching your workspaces.",
        );
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-10">
        <p className="mt-10 text-center">Loading your workspaces</p>
        <Loader />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-blue-60 bg-[url('/images/background.svg')] py-6">
      <div className="inline-flex w-full items-center justify-center rounded-lg border-r border-grey-20 bg-white px-4 py-10 shadow sm:min-h-[520px] sm:w-[560px] sm:p-10">
        <div className="w-80 flex-col justify-start items-center gap-8 flex">
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
            <p className="text-black text-lg font-semibold font-noto-serif leading-normal">
              Select a workspace
            </p>
            <div className="w-80 h-px border-t border-grey-20" />
          </div>

          {error && <p className="text-red-30 text-sm">{error}</p>}

          {!error && workspaces.length === 0 && (
            <p className="text-grey-60 text-sm">
              You don&apos;t belong to any workspace yet.
            </p>
          )}

          <div className="self-stretch flex-col justify-start items-start gap-3 flex">
            {workspaces.map((workspace) => (
              <button
                key={workspace.id}
                className="w-full p-3 bg-white hover:bg-grey-10 active:bg-grey-20 rounded-lg border border-grey-20 justify-start items-center gap-2 inline-flex text-grey-80 text-base leading-normal font-semibold text-left"
                onClick={() => enterWorkspace(workspace)}
              >
                {workspace.name}
              </button>
            ))}
          </div>

          <button
            className="text-grey-50 text-sm hover:text-blue-40"
            onClick={() => {
              // B9: clear the in-memory workspace selection too — logout()
              // only clears localStorage since it isn't a hook.
              setCurrentWorkspace(null);
              logout();
            }}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
