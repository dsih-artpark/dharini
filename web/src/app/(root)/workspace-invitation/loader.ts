import { AxiosError } from "axios";
import apiClient from "@/src/libs/apiClient";
import type { Workspace } from "@/src/types/global";

// 3.3: response shape for GET /invites/:token when the invite is a
// workspace invite (workspaceId set) as opposed to a project/team invite.
export type WorkspaceInvite = {
  id: string;
  workspaceId: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  accepted: boolean;
};

export const getWorkspaceInviteByToken = async (
  inviteToken: string,
): Promise<WorkspaceInvite> => {
  try {
    const response = await apiClient.get(`/invites/${inviteToken}`);
    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(
      "An unknown error occurred while fetching the workspace invite.",
    );
  }
};

export const getWorkspaceById = async (
  workspaceId: string,
): Promise<Workspace> => {
  try {
    const response = await apiClient.get(`/workspaces/${workspaceId}`);
    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("An unknown error occurred while fetching the workspace.");
  }
};
