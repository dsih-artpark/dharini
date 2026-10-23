import { env } from "@/env";
import { logout } from "@/src/app/(root)/actions";
import { CURRENT_WORKSPACE_STORAGE_KEY } from "@/src/store/currentWorkspaceAtom";
import { deleteToken, getAuthToken } from "@/src/utils/auth";
import { isPublicPath, sessionExpiredLoginPath } from "@/src/utils/session";
import axios, { AxiosInstance } from "axios";

// The API address is set on each request (below), not here: the settings may
// not have reached the browser yet when this module loads.
const apiClient: AxiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) => {
    const searchParams = new URLSearchParams();
    for (const key in params) {
      const value = params[key];
      if (Array.isArray(value)) {
        value.forEach((val) => searchParams.append(key, val));
      } else if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, value);
      }
    }
    return searchParams.toString();
  },
});

// Add request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    config.baseURL = env.API_URL || "http://localhost:4000";
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Set once a 401 has started the session-expired flow, so requests that fail
// together clear the session and redirect only once.
let isSessionExpiring = false;

// The session ended (token expired or rejected): clear what logout() clears
// and go to the login page, which says "Session Expired" and returns here
// after signing in. A full page load, so no in-memory state survives.
function handleSessionExpired() {
  if (isSessionExpiring) return;
  isSessionExpiring = true;
  const loginPath = sessionExpiredLoginPath(window.location.pathname);
  window.localStorage.removeItem(CURRENT_WORKSPACE_STORAGE_KEY);
  deleteToken()
    .catch(() => undefined)
    .finally(() => window.location.replace(loginPath));
}

// Add response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      // The login page and public routes have no session to expire, so they
      // keep the plain logout.
      if (isPublicPath(window.location.pathname)) {
        logout();
      } else {
        handleSessionExpired();
        // Never settles, so the screen that made the request shows no error
        // of its own while the page leaves for the login page.
        return new Promise(() => {});
      }
    }
    return Promise.reject(error);
  },
);

export function convertToFormData(payload: object) {
  const formData = new FormData();

  // Iterate over payload entries
  Object.entries(payload).forEach(([key, value]) => {
    if (Array.isArray(value) && value.every((item) => item instanceof File)) {
      // If value is an array of files, append each file
      (value as File[]).forEach((file) => {
        formData.append(key, file);
      });
    } else if (value instanceof File) {
      // If value is a single file
      formData.append(key, value);
    } else if (typeof value === "string" || typeof value === "number") {
      // Append other primitive values
      formData.append(key, String(value));
    }
  });

  return formData;
}

export default apiClient;
