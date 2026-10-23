"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import dynamic from "next/dynamic";

import { SESSION_EXPIRED_REASON } from "@/src/utils/session";

import type { AuthMode } from "./auth-dialog";

// The forms, server actions and analytics behind the dialog are only needed
// once someone opens it, so keep them out of the landing page's first load.
const AuthDialog = dynamic(() => import("./auth-dialog"));

const AuthDialogContext = createContext<{
  openAuth: (mode: AuthMode) => void;
  isAuthOpen: boolean;
} | null>(null);

export function useAuthDialog() {
  const context = useContext(AuthDialogContext);
  if (!context) {
    throw new Error("useAuthDialog must be used inside AuthDialogProvider");
  }
  return context;
}

// Owns the login/signup dialog so the marketing sections around it can stay
// server components: they only need a button that calls `openAuth`. Anything
// that should idle while the dialog covers the page can read `isAuthOpen`.
export default function AuthDialogProvider({
  initialMode = null,
  children,
}: {
  initialMode?: AuthMode | null;
  children: React.ReactNode;
}) {
  const [authMode, setAuthMode] = useState<AuthMode | null>(initialMode);

  // The middleware sends signed-out users here with ?redirectTo=… (and
  // ?reason=session-expired when their session ended); open the login dialog
  // straight away so they aren't left on the marketing page. Read after
  // mount: the server render has no URL to read.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (
      params.has("redirectTo") ||
      params.get("reason") === SESSION_EXPIRED_REASON
    ) {
      setAuthMode("login");
    }
  }, []);

  const openAuth = useCallback((mode: AuthMode) => setAuthMode(mode), []);
  const closeAuth = useCallback(() => {
    setAuthMode(null);
    // Once the dialog is dismissed the URL should describe the landing page
    // again: /signup renders it with the signup dialog open, and the
    // redirectTo / reason params only apply to the visit that opened the
    // dialog. Left behind, they would show the "Session Expired" notice (and
    // clear the token) again on reopening, and redirect after the next
    // sign-in.
    const url = new URL(window.location.href);
    url.searchParams.delete("redirectTo");
    url.searchParams.delete("reason");
    if (url.pathname === "/signup") url.pathname = "/";
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
  }, []);

  const value = useMemo(
    () => ({ openAuth, isAuthOpen: authMode !== null }),
    [openAuth, authMode],
  );

  return (
    <AuthDialogContext.Provider value={value}>
      {children}
      {authMode && (
        <AuthDialog
          mode={authMode}
          onModeChange={setAuthMode}
          onClose={closeAuth}
        />
      )}
    </AuthDialogContext.Provider>
  );
}

// A button that opens the auth dialog; usable from server components.
export function AuthButton({
  mode,
  className,
  children,
}: {
  mode: AuthMode;
  className?: string;
  children: React.ReactNode;
}) {
  const { openAuth } = useAuthDialog();
  return (
    <button type="button" className={className} onClick={() => openAuth(mode)}>
      {children}
    </button>
  );
}
