import { AxiosError } from "axios";
import apiClient from "@/src/libs/apiClient";
import type { ApiResponse, Workspace } from "@/src/types/global";
import type { UserRole } from "@/src/types/user";

// 4.5: PATCH /workspaces/:workspaceId (rename) - added alongside this task,
// 2.6 never built a rename endpoint.
export const updateWorkspaceApi = async (
  workspaceId: string,
  payload: { name: string },
): Promise<ApiResponse<Workspace>> => {
  try {
    const response = await apiClient.patch(
      `/workspaces/${workspaceId}`,
      payload,
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to update workspace.");
  }
};

// 4.5: POST /invites/workspace (2.7) - invite a new/existing person into the
// current workspace by email.
export const sendWorkspaceInviteApi = async (payload: {
  email: string;
  workspaceId: string;
  roleId: string;
  firstName?: string;
  lastName?: string;
}): Promise<ApiResponse<null>> => {
  try {
    const response = await apiClient.post("/invites/workspace", payload);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to send workspace invite.");
  }
};

// 4.5: PATCH /workspaces/:workspaceId/members/:memberId (2.6) - change an
// existing member's workspace-scoped role.
export const updateWorkspaceMemberApi = async (
  workspaceId: string,
  memberId: string,
  payload: { roleId: string },
): Promise<ApiResponse<UserRole>> => {
  try {
    const response = await apiClient.patch(
      `/workspaces/${workspaceId}/members/${memberId}`,
      payload,
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to update workspace member.");
  }
};

// 4.5: DELETE /workspaces/:workspaceId/members/:memberId (2.6) - remove a
// member from the workspace.
export const removeWorkspaceMemberApi = async (
  workspaceId: string,
  memberId: string,
): Promise<ApiResponse<null>> => {
  try {
    const response = await apiClient.delete(
      `/workspaces/${workspaceId}/members/${memberId}`,
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to remove workspace member.");
  }
};

// DELETE /users/:id - permanently anonymize a user's account (scrubs
// contact info, revokes login; historical records and role rows are left
// in place). Authorization is enforced server-side via canManageUser.
export const deleteUserAccountApi = async (
  userId: string,
): Promise<ApiResponse<null>> => {
  try {
    const response = await apiClient.delete(`/users/${userId}`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to delete user account.");
  }
};
