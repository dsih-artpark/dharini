import { AxiosError } from "axios";
import apiClient from "@/src/libs/apiClient";
import { setToken } from "@/src/utils/auth";
import type { UserProfile } from "@/src/types/user";

// 3.3: accepts a workspace invite. Hits the same shared endpoint as
// project-invitation's acceptProjectInvite() — InvitesController's
// accept/:inviteToken route/InvitesService.acceptInvite() branch internally
// on the invite's workspaceId (task 2.7).
export const acceptWorkspaceInvite = async (
  inviteToken: string,
): Promise<{ accessToken: string }> => {
  try {
    const response = await apiClient.post(`/invites/accept/${inviteToken}`);
    const data = response.data;
    if (data.success) {
      await setToken(data.data.accessToken);
    }
    return data.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(
      "An unknown error occurred while accepting the workspace invite.",
    );
  }
};

export type OwnProfileUpdate = Pick<
  UserProfile,
  "firstName" | "lastName" | "designation"
>;

// 3.3: first-run details step save, via the new self-service
// PATCH /users/profile endpoint.
export const updateOwnProfile = async (
  payload: OwnProfileUpdate,
): Promise<UserProfile> => {
  try {
    const response = await apiClient.patch("/users/profile", payload);
    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("An unknown error occurred while updating your profile.");
  }
};
