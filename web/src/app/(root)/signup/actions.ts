import { AxiosError } from "axios";
import apiClient from "@/src/libs/apiClient";
import { setToken } from "@/src/utils/auth";

// 3.2: mirrors (root)/actions.ts's sendOtp/verifyOtp, but targets the
// signup endpoints (3.1) instead of login, and verifySignupOtp also
// carries the new-workspace-owner's name + workspace name.

// Step 1: send an OTP to a brand-new contact to start self-serve signup.
export const sendSignupOtp = async (
  identifier: string,
  type: "email" | "phone",
): Promise<{ message: string }> => {
  try {
    const payload =
      type === "email" ? { email: identifier } : { phone: identifier };
    const response = await apiClient.post("/auth/signup", payload);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("An unknown error occurred while sending the OTP.");
  }
};

export interface VerifySignupParams {
  identifier: string;
  type: "email" | "phone";
  otp: number;
  firstName: string;
  lastName?: string;
  workspaceName: string;
}

// Step 2: verify the OTP and atomically create the user + workspace,
// then set the same auth cookie login() sets.
export const verifySignupOtp = async ({
  identifier,
  type,
  otp,
  firstName,
  lastName,
  workspaceName,
}: VerifySignupParams): Promise<{ accessToken: string }> => {
  try {
    const identifierPayload =
      type === "email" ? { email: identifier } : { phone: identifier };
    const response = await apiClient.post("/auth/signup/verify", {
      ...identifierPayload,
      otp,
      firstName,
      lastName,
      workspaceName,
    });
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
