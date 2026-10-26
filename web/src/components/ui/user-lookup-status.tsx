"use client";

import React from "react";

import Spinner from "@/src/components/ui/spinner";
import type { LookupUserMatch } from "@/src/types/global";
import type { UserLookupStatus } from "@/src/hooks/use-user-lookup";

/**
 * Shared feedback strip for the identity-first "add a user" forms, so every
 * form explains the same state the same way.
 *
 * The "found" case is the one that matters: it tells the admin the account
 * already exists and that its name is being reused rather than re-entered.
 */
/**
 * What a match *means* differs by form:
 *  - "reuse"    - the existing account will simply be given a role here
 *                 (add member, add team). This is the common case.
 *  - "conflict" - the form can only create a brand-new account, so a match is
 *                 a dead end (create super admin, which the API rejects
 *                 outright for an email that already exists).
 */
export type UserLookupVariant = "reuse" | "conflict";

export default function UserLookupStatusBanner({
  status,
  match,
  error,
  variant = "reuse",
  className = "",
}: {
  status: UserLookupStatus;
  match: LookupUserMatch | null;
  error?: string | null;
  variant?: UserLookupVariant;
  className?: string;
}) {
  if (status === "idle" || status === "not-found") return null;

  const base = `self-stretch flex items-start gap-2 rounded px-3 py-2 text-sm ${className}`;

  if (status === "checking") {
    return (
      <div className={`${base} bg-grey-10 text-grey-70`}>
        <Spinner />
        <span>Checking whether this user already exists…</span>
      </div>
    );
  }

  if (status === "found" && match) {
    const fullName = [match.firstName, match.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

    if (variant === "conflict") {
      return (
        <div className={`${base} bg-red-10 text-grey-80`}>
          <span aria-hidden>⛔</span>
          <span>
            {fullName ? (
              <>
                <strong>{fullName}</strong> already has an account with this
                {match.email ? " email" : " phone number"}.
              </>
            ) : (
              <>An account already uses this identifier.</>
            )}{" "}
            Use a different one, or change that user&apos;s role from where
            they already appear.
          </span>
        </div>
      );
    }

    return (
      <div className={`${base} bg-blue-10 text-grey-80`}>
        <span aria-hidden>👤</span>
        <span>
          {fullName ? (
            <>
              <strong>{fullName}</strong> already has an account. Their existing
              details will be used — pick a role and save.
            </>
          ) : (
            <>
              This user already has an account (no name on record). Pick a role
              and save; you can add their name from their profile.
            </>
          )}
        </span>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className={`${base} bg-yellow-10 text-grey-80`}>
        <span aria-hidden>⚠️</span>
        <span>
          {error ?? "Could not check this user."} You can still fill in the
          details below; an existing user&apos;s name will not be changed.
        </span>
      </div>
    );
  }

  return null;
}
