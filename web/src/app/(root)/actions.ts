import { AxiosError } from "axios";
import { redirect } from "next/navigation";
import apiClient from "@/src/libs/apiClient";
import { deleteToken, setToken } from "@/src/utils/auth";

// Send OTP - Unified (supports both email and phone)
export const sendOtp = async (
  identifier: string,
  type: "email" | "phone",
): Promise<{ message: string }> => {
  try {
    const payload =
      type === "email" ? { email: identifier } : { phone: identifier };
    const response = await apiClient.post("/auth/login", payload);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("An unknown error occurred while sending the OTP.");
  }
};

// Verify OTP - Unified (supports both email and phone)
export const verifyOtp = async (
  identifier: string,
  otp: number,
  type: "email" | "phone",
): Promise<{ accessToken: string }> => {
  try {
    const payload =
      type === "email"
        ? { email: identifier, otp }
        : { phone: identifier, otp };
    const response = await apiClient.post("/auth/verify-otp", payload);
    const data = response.data;
    if (data.success) {
      await setToken(data.data.accessToken);
    }
    return data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("An unknown error occurred while verifying the OTP.");
  }
};

// Logout
export const logout = async () => {
  await deleteToken();
  // Logout leaves nothing in this browser's local storage, so the next user on
  // a shared browser starts clean. B9: that includes currentWorkspaceAtom
  // (atomWithStorage), which would otherwise put them inside the previous
  // user's workspace. Callers that already hold the atom's setter
  // (user-menu.tsx, workspaces/page.tsx) also null it in-memory before calling
  // logout(), since a plain function like this one can't use jotai hooks.
  if (typeof window !== "undefined") {
    window.localStorage.clear();
  }
  redirect("/");
};
