"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useAtom, useAtomValue } from "jotai";
import { userAtom } from "@/src/store/userAtom";
import { currentWorkspaceAtom } from "@/src/store/currentWorkspaceAtom";
import type { UserProfile } from "@/src/types/user";
import EditUserProfile from "@/src/components/nav/edit-profile";

export default function UserProfile() {
  const [user, setUser] = useAtom(userAtom);
  const currentWorkspace = useAtomValue(currentWorkspaceAtom);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClose = () => {
    if (user) {
      setUser((prev) => ({ ...(prev as UserProfile), visible: false }));
    }
  };

  if (!user?.visible) {
    return;
  }

  return (
    <div className="z-[80] w-full sm:w-[380px] flex flex-col h-[calc(100dvh-76px)] max-h-[calc(100dvh-76px)] fixed top-[76px] right-0 border-l border-grey-20 bg-white shadow-xl overflow-hidden">
      <div className="px-5 py-4 sm:px-6 flex items-center justify-between border-b border-grey-20">
        <h3 className="font-noto-serif font-semibold text-xl text-grey-80">
          Profile
        </h3>
        <div
          className="h-9 w-9 rounded-full border border-grey-20 bg-grey-10 flex items-center justify-center cursor-pointer transition hover:bg-blue-10"
          onClick={handleClose}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.00048 7.05781L11.3005 3.75781L12.2431 4.70048L8.94315 8.00048L12.2431 11.3005L11.3005 12.2431L8.00048 8.94315L4.70048 12.2431L3.75781 11.3005L7.05781 8.00048L3.75781 4.70048L4.70048 3.75781L8.00048 7.05781Z"
              fill="#284DB6"
            />
          </svg>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto bg-grey-10">
        <div className="flex flex-col items-center px-5 py-6 sm:px-6 gap-3 bg-grey-0 bg-no-repeat bg-contain bg-bottom bg-[url('/images/profile-bg.svg')]">
          {user?.profilePicture ? (
            <Image
              className="w-[120px] h-[120px] sm:w-[132px] sm:h-[132px] rounded-full object-cover border-4 border-white shadow-md"
              src={user.profilePicture}
              width={132}
              height={132}
              alt="profile photo"
            />
          ) : (
            <div className="w-[120px] h-[120px] sm:w-[132px] sm:h-[132px] bg-teal-10 rounded-full border-4 border-white shadow-md flex-col justify-center items-center inline-flex">
              <p className="self-stretch text-center text-grey-80 text-3xl font-semibold uppercase leading-[18px] tracking-tight whitespace-nowrap">
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </p>
            </div>
          )}
          <h2 className="font-noto-serif text-2xl font-semibold text-grey-80 text-center">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-grey-70 text-sm capitalize text-center leading-5">
            {(() => {
              // Show only roles belonging to the currently selected workspace.
              // Fall back to all roles for super-admins (system scope, no workspace)
              // or when no workspace is selected.
              const filtered = currentWorkspace
                ? (user?.roles ?? []).filter(
                    (r) =>
                      r.workspace?.id === currentWorkspace.id ||
                      (!r.workspace && r.role?.scope === "system"),
                  )
                : (user?.roles ?? []);
              const display = filtered.length ? filtered : (user?.roles ?? []);
              return display.length
                ? [
                    ...new Set(
                      display
                        .map((r) => r.role?.name?.replace(/-/g, " "))
                        .filter(Boolean),
                    ),
                  ].join(", ")
                : "-";
            })()}
          </p>
        </div>
        <div className="p-5 sm:p-6 flex flex-col gap-3">
          <div className="rounded-xl border border-grey-20 bg-white p-4 shadow-sm">
            <p className="text-grey-70 text-xs uppercase leading-[18px] tracking-tight">
              Team
            </p>
            <p className="mt-1 text-grey-80 text-sm font-medium">
              {user.team?.teamName ?? "NA"}
            </p>
          </div>
          <div className="rounded-xl border border-grey-20 bg-white p-4 shadow-sm">
            <p className="text-grey-70 text-xs uppercase leading-[18px] tracking-tight">
              Email-id
            </p>
            <p className="mt-1 text-grey-80 text-sm font-medium break-all">
              {user.email}
            </p>
          </div>
          <div className="rounded-xl border border-grey-20 bg-white p-4 shadow-sm">
            <p className="text-grey-70 text-xs uppercase leading-[18px] tracking-tight">
              Phone Number
            </p>
            <p className="mt-1 text-grey-80 text-sm font-medium">
              +91 {user.contactNumber}
            </p>
          </div>
        </div>
      </div>
      <button
        className="m-5 sm:m-6 h-12 px-4 py-3 bg-blue-40 text-white flex shrink-0 items-center justify-center gap-2 rounded-lg shadow-sm transition hover:bg-blue-50"
        onClick={() => setIsOpen(true)}
      >
        <div className="w-4 h-4">
          <svg
            width="17"
            height="16"
            viewBox="0 0 17 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.9853 6.45739L10.0427 5.51472L3.83333 11.7241V12.6667H4.776L10.9853 6.45739ZM11.928 5.51472L12.8707 4.57206L11.928 3.62939L10.9853 4.57206L11.928 5.51472ZM5.328 14.0001H2.5V11.1714L11.4567 2.21472C11.5817 2.08974 11.7512 2.01953 11.928 2.01953C12.1048 2.01953 12.2743 2.08974 12.3993 2.21472L14.2853 4.10072C14.4103 4.22574 14.4805 4.39528 14.4805 4.57206C14.4805 4.74883 14.4103 4.91837 14.2853 5.04339L5.32867 14.0001H5.328Z"
              fill="white"
            />
          </svg>
        </div>
        Edit Profile
      </button>
      <EditUserProfile isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
