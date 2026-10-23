import { AxiosError } from "axios";
import apiClient from "@/src/libs/apiClient";
import { setToken } from "@/src/utils/auth";

export const acceptProjectInvite = async (
  inviteToken: string,
): Promise<{ accessToken: string }> => {
  try {
    const response = await apiClient.post(`/invites/accept/${inviteToken}`);
    const data = response.data;
    if (data.success) {
      setToken(data.data.accessToken);
    }
    return data.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(
      "An unknown error occurred while accepting project invite.",
    );
  }
};
