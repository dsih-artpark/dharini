"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { lookupUserApi } from "@/src/app/(dashboard)/manage/loader";
import type { LookupUserMatch } from "@/src/types/global";
import { isValidEmail } from "@/src/utils";

export type UserLookupStatus =
  | "idle" // nothing usable typed yet
  | "checking" // request in flight
  | "found" // an account already holds this identifier
  | "not-found" // identifier is free; collect the new user's details
  | "error"; // lookup failed; fall back to collecting details

const DEBOUNCE_MS = 450;
const PHONE_PATTERN = /^\d{10}$/;

/**
 * Drives the identity-first "add a user" flow.
 *
 * The forms collect an email (or phone) before anything else and call this.
 * Until it resolves there is nothing sensible to show for first/last name, so
 * the detail fields stay hidden; once it resolves the form either shows the
 * existing user's name read-only or reveals empty, editable fields.
 *
 * This exists because typing a name for someone who already has an account
 * used to rewrite their name globally - `users.firstName` is that person's
 * identity in every project they belong to, not a per-project label.
 *
 * Email wins when both are present: it is the identifier every one of these
 * forms already requires. Phone is still checked on its own so that a
 * collector who was onboarded with a number and no email is matched too.
 */
export function useUserLookup({
  email,
  contactNumber,
  enabled = true,
}: {
  email?: string;
  contactNumber?: string;
  enabled?: boolean;
}) {
  const [status, setStatus] = useState<UserLookupStatus>("idle");
  const [match, setMatch] = useState<LookupUserMatch | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Guards against a slow early request landing after a fast later one and
  // overwriting it - the user types quickly here, so out-of-order responses
  // are the common case, not an edge case.
  const requestIdRef = useRef(0);

  const trimmedEmail = email?.trim() ?? "";
  const trimmedPhone = contactNumber?.trim() ?? "";

  const query = isValidEmail(trimmedEmail)
    ? { email: trimmedEmail }
    : PHONE_PATTERN.test(trimmedPhone)
      ? { contactNumber: trimmedPhone }
      : null;

  // Serialised so the effect re-runs on a changed identifier but not on every
  // keystroke that leaves the resolved query identical.
  const queryKey = query ? JSON.stringify(query) : "";

  const reset = useCallback(() => {
    requestIdRef.current += 1; // orphan any in-flight response
    setStatus("idle");
    setMatch(null);
    setError(null);
  }, []);

  useEffect(() => {
    if (!enabled || !queryKey) {
      // Don't call reset() here: it is a new function identity only when
      // remounted, but calling it unconditionally would clobber a "found"
      // state the moment a user blanks the field to retype it. Setting idle
      // directly is the same thing without the callback dependency.
      requestIdRef.current += 1;
      setStatus("idle");
      setMatch(null);
      setError(null);
      return;
    }

    const requestId = ++requestIdRef.current;
    setStatus("checking");
    setError(null);

    const timer = setTimeout(async () => {
      try {
        const { data } = await lookupUserApi(JSON.parse(queryKey));
        if (requestId !== requestIdRef.current) return;

        if (data?.exists && data.user) {
          setMatch(data.user);
          setStatus("found");
        } else {
          setMatch(null);
          setStatus("not-found");
        }
      } catch (e) {
        if (requestId !== requestIdRef.current) return;
        // A failed check must not block the form. Treat it as "unknown" and
        // let the user fill in details - the server still refuses to rename
        // an existing user, so the worst case is retyping a name that is
        // then ignored.
        setMatch(null);
        setError((e as Error)?.message ?? "Could not check this user.");
        setStatus("error");
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [queryKey, enabled]);

  // A matched account with no name on record is a stub - typically created by
  // an earlier bulk import or by being added as a bare phone number. Filling
  // that blank in adds information rather than destroying it, and the server
  // permits exactly that, so the detail fields are still worth showing.
  const matchedNameIsBlank =
    status === "found" &&
    !match?.firstName?.trim() &&
    !match?.lastName?.trim();

  return {
    status,
    match,
    error,
    reset,
    matchedNameIsBlank,
    /** Detail fields (name, address) are worth showing only once we know. */
    shouldCollectDetails:
      status === "not-found" || status === "error" || matchedNameIsBlank,
    /** True while we know the identifier but not yet whether it is taken. */
    isResolving: status === "checking",
  };
}
