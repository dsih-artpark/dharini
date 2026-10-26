"use server";
import { getCookie, setCookie, deleteCookie, OptionsType } from "cookies-next";
import { cookies, headers } from "next/headers";
import {
  EXPIRED_TOKEN_GRACE_SECONDS,
  getTokenExpiry,
} from "@/src/utils/session";

const KEY = "authToken";

// Backend tokens last 7 days (JwtModule `expiresIn`). Only used for a token
// that carries no `exp`.
const FALLBACK_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

// The login cookie is marked Secure only when the request reached us over
// HTTPS, so a browser never sends it over plain HTTP. Tying it to the request,
// not to NODE_ENV, keeps login working for a deployment served over HTTP (a
// local Docker run or an internal server). The reverse proxy sets
// X-Forwarded-Proto (see the Nginx configuration guide); the Origin header of
// the browser's POST is the fallback.
const isHttpsRequest = async () => {
  const requestHeaders = await headers();
  const proto = requestHeaders
    .get("x-forwarded-proto")
    ?.split(",")[0]
    .trim()
    .toLowerCase();
  if (proto) return proto === "https";
  return (
    requestHeaders.get("origin")?.toLowerCase().startsWith("https://") ?? false
  );
};

export const getAuthToken = async (options?: OptionsType) => {
  return getCookie(
    KEY,
    // options
    typeof window === "undefined" ? { cookies, ...options } : options,
  );
};

export const setToken = async (token: string) => {
  const expiry = getTokenExpiry(token);
  return setCookie(KEY, token, {
    // As long as the token lasts, plus a grace period so the middleware can
    // still recognise an expired session (see session.ts).
    ...(expiry === null
      ? { maxAge: FALLBACK_MAX_AGE_SECONDS }
      : { expires: new Date(expiry + EXPIRED_TOKEN_GRACE_SECONDS * 1000) }),
    path: "/",
    secure: await isHttpsRequest(),
    sameSite: "lax",
    httpOnly: true,
    cookies,
  });
};

export const deleteToken = async () => {
  await deleteCookie(KEY, { cookies });
};

export async function checkAuth() {
  const token = await getAuthToken();
  if (!token) return false;

  return true;
}
