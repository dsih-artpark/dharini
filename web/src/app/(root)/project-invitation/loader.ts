import { AxiosError } from "axios";
import apiClient from "@/src/libs/apiClient";
import type { ProjectInvite } from "@/src/types/global";

export const getProjectInviteByInviteToken = async (
  inviteToken: string,
): Promise<ProjectInvite> => {
  try {
    const response = await apiClient.get(`/invites/${inviteToken}`);
    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(
      "An unknown error occurred while fetching project invite by invite-token",
    );
  }
};
